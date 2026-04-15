/**
 * @file db.js
 * @description Oracle DB 커넥션 풀 관리 모듈
 *
 * Thick Mode 사용 — Oracle Instant Client가 필요합니다.
 *   이유: 접속 대상 Oracle 서버가 11g(XE)로, Thin Mode 는 Oracle 12.1 이상만 지원합니다.
 *
 * .env 에 ORACLE_CLIENT_PATH 를 설정하면 해당 경로의 Instant Client 를 사용합니다.
 * ORACLE_CLIENT_PATH 가 없으면 시스템 PATH 에서 자동 탐색합니다.
 *
 * 사용 흐름:
 *   1. 앱 기동 시 initPool() 한 번 호출
 *   2. 쿼리가 필요한 곳에서 withConnection(fn) 을 사용하면
 *      커넥션 획득 → 쿼리 실행 → 자동 반납까지 처리됩니다.
 */

'use strict';

const oracledb = require('oracledb');

// ── Thick Mode 초기화 ────────────────────────────────────────────────────────
// initOracleClient() 는 require() 직후, 다른 oracledb 호출보다 먼저 실행해야 합니다.
// Oracle Client가 없는 환경에서도 SSE 등 DB 불필요 기능은 동작할 수 있도록 try-catch 처리.
const clientOpts = {};
if (process.env.ORACLE_CLIENT_PATH) {
  clientOpts.libDir = process.env.ORACLE_CLIENT_PATH;
}
oracledb.initOracleClient(clientOpts);
console.log('[DB] Thick Mode 초기화 완료 (Oracle Client 경로:', clientOpts.libDir || 'PATH 자동탐색', ')');

// ── 전역 출력 형식 설정 ──────────────────────────────────────────────────────

// DATE/TIMESTAMP → JSON 직렬화 시 타임존 문제를 피하기 위해 문자열로 수신
oracledb.fetchTypeHandler = function (metadata) {
  if (metadata.dbType === oracledb.DB_TYPE_DATE ||
      metadata.dbType === oracledb.DB_TYPE_TIMESTAMP) {
    return { type: oracledb.STRING, converter: (v) => (v ? String(v) : null) };
  }
};

// 결과를 컬럼명 키의 오브젝트 배열로 반환 (기본값 ARRAY 대신)
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

// ── 풀 싱글톤 ────────────────────────────────────────────────────────────────
/** @type {oracledb.Pool | null} */
let _pool = null;

/**
 * 커넥션 풀을 생성합니다. 앱 기동 시 딱 한 번 호출하세요.
 *
 * @returns {Promise<oracledb.Pool>}
 */
async function initPool() {
  if (_pool) return _pool;

  _pool = await oracledb.createPool({
    user:          process.env.DB_USER,
    password:      process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT_STRING,

    poolMin:       Number(process.env.DB_POOL_MIN)       || 2,
    poolMax:       Number(process.env.DB_POOL_MAX)       || 10,
    poolIncrement: Number(process.env.DB_POOL_INCREMENT) || 1,
    poolTimeout:   60,
    enableStatistics: false,
  });

  console.log('[DB] Oracle 커넥션 풀 생성 완료');
  return _pool;
}

/**
 * 커넥션을 풀에서 빌려 callback(conn) 을 실행하고, 완료 후 자동 반납합니다.
 *
 * @template T
 * @param {(conn: oracledb.Connection) => Promise<T>} callback
 * @returns {Promise<T>}
 */
async function withConnection(callback) {
  if (!_pool) throw new Error('[DB] 풀이 초기화되지 않았습니다. initPool() 을 먼저 호출하세요.');

  const conn = await _pool.getConnection();
  try {
    return await callback(conn);
  } finally {
    await conn.close();
  }
}

/**
 * 앱 종료 시 풀을 정상 해제합니다.
 */
async function closePool() {
  if (_pool) {
    await _pool.close(10);
    _pool = null;
    console.log('[DB] Oracle 커넥션 풀 종료 완료');
  }
}

module.exports = { initPool, withConnection, closePool };
