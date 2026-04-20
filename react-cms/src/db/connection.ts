/**
 * @file connection.ts
 * @description Oracle DB 커넥션 풀 초기화 및 연결 유틸리티.
 * Vite dev 서버(플러그인) 내에서만 실행되는 서버 사이드 모듈입니다.
 *
 * - Thick 모드: Oracle Instant Client 필요 (구버전 Oracle XE 지원)
 * - CLOB 컬럼을 string으로 자동 변환 (PAGE_JSON 등)
 * - 커넥션 풀 최초 초기화 시 Promise 캐싱으로 레이스 컨디션 방지
 */
import oracledb from 'oracledb';
import { oracleEnv } from '../lib/env';

let poolInitPromise: Promise<void> | null = null;

// Promise 캐싱 패턴: 동시 요청이 동일한 Promise를 await하여 중복 초기화 방지
async function initPool(): Promise<void> {
  if (poolInitPromise) return poolInitPromise;

  poolInitPromise = (async () => {
    try {
      // oracleEnv는 getter로 구현되어 있어 이 시점(첫 요청)에 process.env를 읽음.
      // Vite가 .env를 process.env에 주입한 이후이므로 값이 정상적으로 반영됨.
      const { user, password, host, port, service, clientDir } = oracleEnv;

      // ORACLE_CLIENT_DIR 설정 시 PATH 의존 없이 경로 직접 지정 (Windows 개발환경 대응)
      // clientDir 미설정 시 인수 없이 호출 → Oracle Instant Client를 PATH에서 자동 탐색
      oracledb.initOracleClient(clientDir ? { libDir: clientDir } : undefined);
      // CLOB 컬럼을 string으로 자동 변환 (PAGE_JSON)
      oracledb.fetchAsString = [oracledb.CLOB];

      await oracledb.createPool({
        user,
        password,
        connectString:  `${host}:${port}/${service}`,
        poolMin:        0,  // 공유 Oracle XE 세션 제한 고려
        poolMax:        5,
        poolIncrement:  1,
        poolTimeout:    60,     // 1분: 유휴 커넥션 빠른 반환
        queueTimeout:   30000,  // 30초: 커넥션 부족 시 대기
      });

      console.warn('[react-cms] Oracle 커넥션 풀 초기화 완료');
    } catch (err) {
      poolInitPromise = null;
      console.error('[react-cms] Oracle 커넥션 풀 초기화 실패:', err);
      throw err;
    }
  })();

  return poolInitPromise;
}

const MAX_CONN_RETRIES = 3;
const CONN_RETRY_DELAY = 500;

/** 커넥션 획득. 최초 호출 시 풀 자동 초기화, 스키마 설정 포함. */
export async function getConnection(): Promise<oracledb.Connection> {
  await initPool();

  let conn: oracledb.Connection | null = null;
  for (let attempt = 1; attempt <= MAX_CONN_RETRIES; attempt++) {
    try {
      conn = await oracledb.getConnection();
      break;
    } catch (err) {
      if (attempt < MAX_CONN_RETRIES) {
        console.warn(`[react-cms] 커넥션 획득 실패 (${attempt}/${MAX_CONN_RETRIES}회), ${CONN_RETRY_DELAY}ms 후 재시도...`);
        await new Promise((r) => setTimeout(r, CONN_RETRY_DELAY));
      } else {
        throw err;
      }
    }
  }

  if (!conn) throw new Error('커넥션 획득에 실패했습니다.');

  // 테이블 소유 스키마로 세션 변경 — 실패 시 커넥션 반환 후 throw
  try {
    await conn.execute(
      `BEGIN
         EXECUTE IMMEDIATE 'ALTER SESSION SET CURRENT_SCHEMA = ' || DBMS_ASSERT.ENQUOTE_NAME(:schemaName);
       END;`,
      { schemaName: oracleEnv.schema },
    );
  } catch (err) {
    await conn.close();
    throw err;
  }

  return conn;
}

/** 커넥션 풀 종료 */
export async function closePool(): Promise<void> {
  if (!poolInitPromise) return;
  await oracledb.getPool().close(10);
  poolInitPromise = null;
  console.warn('[react-cms] Oracle 커넥션 풀 종료 완료');
}

/**
 * 트랜잭션 래퍼.
 * 성공 시 COMMIT, 예외 시 ROLLBACK 후 재throw.
 */
export async function withTransaction<T>(
  task: (conn: oracledb.Connection) => Promise<T>,
): Promise<T> {
  const conn = await getConnection();
  try {
    const result = await task(conn);
    await conn.commit();
    return result;
  } catch (err) {
    // rollback 자체가 실패해도 원본 에러를 덮어씌우지 않도록 별도 catch
    try { await conn.rollback(); }
    catch (rbErr) { console.error('[react-cms] rollback 실패:', rbErr); }
    throw err;
  } finally {
    await conn.close();
  }
}

/**
 * CLOB 바인딩 헬퍼.
 * 4000바이트 초과 문자열을 CLOB 타입으로 바인딩.
 */
export function clobBind(
  value: string | null | undefined,
): string | { val: string; type: number } | null {
  if (!value) return null;
  return value.length > 4000 ? { val: value, type: oracledb.CLOB } : value;
}
