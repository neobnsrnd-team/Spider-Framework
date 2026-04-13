/**
 * @file types.ts
 * @description CardPillTab 컴포넌트 타입 정의.
 */
export interface CardPillTabProps {
  /** 탭 레이블 (카드명 등) */
  label: string;
  /** 선택 여부 */
  isSelected: boolean;
  /** 클릭 핸들러 */
  onClick: () => void;
}
