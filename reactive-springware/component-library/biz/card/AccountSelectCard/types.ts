/**
 * @file types.ts
 * @description AccountSelectCard 컴포넌트 props 타입 정의.
 */

export interface AccountSelectCardProps {
  /** 은행명. 예: '하나은행' */
  bankName: string;
  /** 마스킹된 계좌번호. 예: '123-****-5678' */
  maskedAccount: string;
  /** 선택 여부 */
  isSelected: boolean;
  /** 클릭 핸들러 */
  onClick: () => void;
}
