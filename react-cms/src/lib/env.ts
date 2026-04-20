/**
 * @file env.ts
 * @description 서버 사이드 전용 환경변수 모듈.
 * Vite dev 서버(플러그인)에서만 실행되며 클라이언트 번들에 포함되지 않습니다.
 *
 * getter 방식을 사용하여 process.env를 호출 시점에 읽습니다.
 * Vite는 .env 파일을 서버 초기화 중에 process.env에 주입하므로,
 * 모듈 로드 시점(config 평가 단계)이 아닌 첫 DB 접근 시점에 읽어야 합니다.
 */

export const oracleEnv = {
  get user()      { return process.env.ORACLE_USER        ?? ''; },
  get password()  { return process.env.ORACLE_PASSWORD    ?? ''; },
  get host()      { return process.env.ORACLE_HOST        ?? ''; },
  get port()      { return process.env.ORACLE_PORT        ?? '1521'; },
  get service()   { return process.env.ORACLE_SERVICE     ?? 'XE'; },
  get schema()    { return process.env.ORACLE_SCHEMA      ?? ''; },
  /** Instant Client 설치 경로. 비어 있으면 PATH에서 자동 탐색. */
  get clientDir() { return process.env.ORACLE_CLIENT_DIR  ?? ''; },
};
