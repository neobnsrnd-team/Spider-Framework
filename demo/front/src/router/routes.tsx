/**
 * @file routes.tsx
 * @description 하위 호환성 유지용 re-export.
 *
 * 라우트 설정은 아래 구조로 분리되었다:
 *   src/constants/paths.ts        — 경로 상수
 *   src/mocks/cardMocks.tsx       — Mock 데이터
 *   src/routes/RouteWrappers.tsx  — Route Wrapper 컴포넌트
 *   src/routes/index.tsx          — pageRoutes / modalRoutes 설정
 */
export { pageRoutes, modalRoutes } from '@/routes';
export type { RouteConfig }        from '@/routes';
