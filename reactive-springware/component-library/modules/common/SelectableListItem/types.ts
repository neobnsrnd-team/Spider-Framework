/**
 * @file types.ts
 * @description SelectableListItem 컴포넌트 타입 정의.
 */
export interface SelectableListItemProps {
  /** 표시 레이블 */
  label: string;
  /** 선택 여부 */
  isSelected: boolean;
  /** 클릭 핸들러 */
  onClick: () => void;
}
