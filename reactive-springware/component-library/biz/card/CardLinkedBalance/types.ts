/**
 * @file types.ts
 * @description CardLinkedBalance 컴포넌트의 TypeScript 타입 정의.
 */

export interface CardLinkedBalanceProps {
  /** 연결계좌 잔액 (원) */
  balance:    number;
  /** true: 금액 마스킹 표시 */
  hidden:     boolean;
  /** 보기/숨기기 버튼 클릭 */
  onToggle:   () => void;
  className?: string;
}
