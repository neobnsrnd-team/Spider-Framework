/**
 * @file types.ts
 * @description CardChipItem 컴포넌트 props 타입 정의.
 */

export interface CardChipItemProps {
  /** 카드명. 예: '하나 머니 체크카드' */
  name: string;
  /** 마스킹된 카드번호. 예: '1234-****-****-5678' */
  maskedNumber: string;
}
