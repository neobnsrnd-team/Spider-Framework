/**
 * @file types.ts
 * @description AppBrandHeader 컴포넌트의 TypeScript 타입 정의.
 *
 * 앱 로그인·온보딩 화면 상단에 표시되는 브랜드 헤더.
 * PageLayout 헤더(뒤로가기 + 타이틀)와 달리 브랜드 로고만 중앙에 노출한다.
 */

export interface AppBrandHeaderProps {
  /**
   * 브랜드 이니셜 — 원형 배지 내부에 표시.
   * 예: 'H' (하나은행), 'K' (국민은행), 'S' (신한은행)
   */
  brandInitial: string;
  /**
   * 브랜드명 — 이니셜 배지 오른쪽에 표시.
   * 예: '하나은행'
   */
  brandName: string;
  className?: string;
}