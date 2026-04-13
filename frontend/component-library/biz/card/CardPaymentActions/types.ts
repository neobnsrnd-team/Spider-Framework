/**
 * @file types.ts
 * @description CardPaymentActions 컴포넌트 타입 정의.
 */

export interface CardPaymentActionsProps {
  /** 분할납부 버튼 클릭 핸들러 */
  onInstallment?: () => void;
  /** 즉시결제 버튼 클릭 핸들러 */
  onImmediatePayment?: () => void;
  /** 일부결제금액이월약정(리볼빙) 버튼 클릭 핸들러 */
  onRevolving?: () => void;
  className?: string;
}
