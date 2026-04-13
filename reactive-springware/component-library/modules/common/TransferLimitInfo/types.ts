/**
 * @file types.ts
 * @description TransferLimitInfo 컴포넌트 props 타입 정의.
 */

export interface TransferLimitInfoProps {
  /** 1회 이체 한도 (원). 예: 1000000 */
  perTransferLimit: number;
  /** 1일 이체 한도 (원). 예: 5000000 */
  dailyLimit: number;
  /** 오늘 이미 이체한 누적 금액 (원). 전달 시 잔여 한도 함께 표시 */
  usedAmount?: number;
}
