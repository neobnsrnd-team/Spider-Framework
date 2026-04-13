/**
 * @file types.ts
 * @description HomeDashboardPage 컴포넌트 타입 정의.
 */

/** 홈 탭 ID 유니온 타입 */
export type HomeTab = 'mine' | 'other' | 'asset';

export interface HomeDashboardPageProps {
  /** 현재 활성 탭 — 실제 앱에서는 useHomeDashboard 훅에서 주입 */
  activeTab: HomeTab;
  /** 탭 전환 핸들러 — 실제 앱에서는 useHomeDashboard 훅에서 주입 */
  onTabChange: (tab: HomeTab) => void;
}