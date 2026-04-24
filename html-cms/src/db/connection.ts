// src/db/connection.ts

import oracledb from 'oracledb';

import {
    ORACLE_USER,
    ORACLE_PASSWORD,
    ORACLE_HOST,
    ORACLE_PORT,
    ORACLE_SERVICE,
    ORACLE_SCHEMA,
    ORACLE_POOL_MAX,
} from '@/lib/env';

let poolInitPromise: Promise<void> | null = null;

// 커넥션 풀 설정 (최초 호출 시 Oracle Client 초기화 + CLOB 설정 포함)
// Promise 캐싱 패턴: 동시 요청이 동일한 Promise를 await하여 레이스 컨디션 방지
async function initPool(): Promise<void> {
    if (poolInitPromise) return poolInitPromise;

    // ORACLE_DISABLED=true: Oracle Client 없는 환경(테스트, CI 등)에서 서버 기동 허용
    // 풀 초기화는 건너뛰고, DB 접근은 getConnection()에서 에러 반환
    if (process.env.ORACLE_DISABLED === 'true') {
        poolInitPromise = Promise.resolve();
        return poolInitPromise;
    }

    poolInitPromise = (async () => {
        try {
            // Thick 모드 사용: Oracle Instant Client 필요 (구버전 Oracle XE 지원)
            oracledb.initOracleClient();
            // CLOB 컬럼을 string으로 자동 변환 (DATA, PAGE_DESC 등)
            oracledb.fetchAsString = [oracledb.CLOB];

            await oracledb.createPool({
                user: ORACLE_USER,
                password: ORACLE_PASSWORD,
                connectString: `${ORACLE_HOST}:${ORACLE_PORT}/${ORACLE_SERVICE}`,
                poolMin: 0, // 공유 Oracle XE 세션 제한 고려 (최대 20개)
                poolMax: ORACLE_POOL_MAX, // 기본 3 — 공유 DB 환경에서 ORA-12516 방지 (env 로 조정 가능)
                poolIncrement: 1,
                poolTimeout: 60, // 1분: 유휴 커넥션 빠른 반환 (Oracle XE 세션 제한 대응)
                queueTimeout: 30000, // 30초: 커넥션 부족 시 대기 시간 확보
            });

            console.warn('Oracle 커넥션 풀 초기화 완료');
        } catch (err: unknown) {
            poolInitPromise = null;
            console.error('Oracle 커넥션 풀 초기화 실패:', err);
            throw err;
        }
    })();

    return poolInitPromise;
}

// 커넥션 획득 (최초 호출 시 풀 자동 초기화, 스키마 설정 포함)
// Oracle XE 세션 제한(약 20개) 대응: 최대 3회 재시도 (0.5초 간격)
const MAX_CONN_RETRIES = 3;
const CONN_RETRY_DELAY = 500;

export async function getConnection(): Promise<oracledb.Connection> {
    if (process.env.ORACLE_DISABLED === 'true') {
        throw new Error('Oracle DB가 비활성화되어 있습니다. (ORACLE_DISABLED=true)');
    }
    await initPool();

    // 커넥션 획득만 재시도 — 스키마 설정 실패는 즉시 throw (커넥션 누수 방지)
    let conn: oracledb.Connection | null = null;

    for (let attempt = 1; attempt <= MAX_CONN_RETRIES; attempt++) {
        try {
            conn = await oracledb.getConnection();
            break;
        } catch (err: unknown) {
            if (attempt < MAX_CONN_RETRIES) {
                console.warn(`커넥션 획득 실패 (${attempt}/${MAX_CONN_RETRIES}회), ${CONN_RETRY_DELAY}ms 후 재시도...`);
                await new Promise((resolve) => setTimeout(resolve, CONN_RETRY_DELAY));
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
            { schemaName: ORACLE_SCHEMA },
        );
    } catch (err: unknown) {
        await conn.close();
        throw err;
    }

    return conn;
}

// 커넥션 풀 종료
export async function closePool(): Promise<void> {
    if (!poolInitPromise) return;
    await oracledb.getPool().close(10);
    poolInitPromise = null;
    console.warn('Oracle 커넥션 풀 종료 완료');
}

// 트랜잭션 래퍼 — 콜백 내 모든 쿼리를 하나의 트랜잭션으로 실행
// 성공 시 COMMIT, 예외 시 ROLLBACK 후 재throw
export async function withTransaction<T>(task: (conn: oracledb.Connection) => Promise<T>): Promise<T> {
    const conn = await getConnection();
    try {
        const result = await task(conn);
        await conn.commit();
        return result;
    } catch (err: unknown) {
        await conn.rollback();
        throw err;
    } finally {
        await conn.close();
    }
}

// CLOB 바인딩 헬퍼 — 4000바이트 초과 문자열을 CLOB 타입으로 바인딩
export function clobBind(value: string | null): string | { val: string; type: number } | null {
    if (!value) return null;
    return value.length > 4000 ? { val: value, type: oracledb.CLOB } : value;
}
