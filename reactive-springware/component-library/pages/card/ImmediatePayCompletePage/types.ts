/**
 * @file types.ts
 * @description ImmediatePayCompletePage (STEP 4 — 완료) 타입 정의.
 */

export interface ImmediatePayCompletePageProps {
  /** 결제에 사용된 카드명. 예: '하나 머니 체크카드' */
  cardName: string;
  /** 결제 금액 (원) */
  amount: number;
  /** 출금 계좌. 예: '하나은행 123-456789-01***' */
  account: string;
  /** 처리일시. 예: '2026.04.09 14:32' */
  completedAt: string;
  /** 확인 버튼 클릭 (홈 또는 이전 화면으로 이동) */
  onConfirm?: () => void;
}
