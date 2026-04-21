/**
 * @file client-env.ts
 * @description 클라이언트 사이드 환경변수 파생 상수 모음.
 * Vite가 빌드 시 `import.meta.env`를 정적으로 치환하므로 브라우저에서 안전하게 사용할 수 있다.
 *
 * 서버 사이드 전용 환경변수는 `src/lib/env.ts`를 사용한다.
 */

/**
 * BASE_URL이 '/'가 아니면 nginx 프록시를 거쳐 admin과 연동되는 모드.
 * - admin 연동 모드 (npm run dev:proxy, BASE_URL=/react-cms/): 인증 가드 활성화, DB 저장
 * - 단독 실행 모드 (npm run dev, BASE_URL=/):                  인증 없이 파일 시스템 저장
 */
export const isAdminMode = import.meta.env.BASE_URL !== "/";

/**
 * Vite dev 서버의 CMS API 접두사.
 * - 프록시 모드(BASE_URL=/react-cms/): '/react-cms/__cms' → nginx가 Vite로 라우팅
 * - 단독 모드(BASE_URL=/):             '/__cms'           → Vite 직접 처리
 */
export const cmsBase = `${import.meta.env.BASE_URL.replace(/\/$/, "")}/__cms`;
