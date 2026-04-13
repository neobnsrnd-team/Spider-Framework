/**
 * @file types.ts
 * @description FullMenuPage 컴포넌트 타입 정의.
 */

/** 카테고리 id 유니온 타입 */
export type MenuCategoryId = 'banking' | 'management' | 'card' | 'product' | 'forex';

export interface FullMenuPageProps {
  /** 닫기(X) 클릭 시 전체 메뉴를 닫는 핸들러 */
  onClose?: () => void;
  /** 홈 아이콘 클릭 시 홈 화면으로 이동하는 핸들러 */
  onHome?: () => void;
  /** 로그아웃 버튼 클릭 핸들러 */
  onLogout?: () => void;
  /** 현재 활성 카테고리 — 실제 앱에서는 useFullMenu 훅에서 주입 */
  activeCategory: MenuCategoryId;
  /** 카테고리 전환 핸들러 — 실제 앱에서는 useFullMenu 훅에서 주입 */
  onCategoryChange: (id: MenuCategoryId) => void;
}