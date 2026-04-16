/**
 * @file types.ts
 * @description ImmediatePayCompletePage (STEP 4 — 완료/오류) 타입 정의.
 */

export interface ImmediatePayCompletePageProps {
  /** 결제에 사용된 카드명. 예: '하나 머니 체크카드' */
  cardName: string;
  /** 마스킹된 카드번호. 예: '1234-56**-****-7890' */
  cardNumber: string;
  /** 결제 금액 (원) */
  amount: number;
  /** 출금 계좌. 예: '하나은행 123-456789-01***' */
  account: string;
  /** 결제 후 이용가능한도 (원) */
  availableLimit: number;
  /** 처리일시. 예: '2026.04.09 14:32' */
  completedAt: string;
  /**
   * 결제 처리 중 발생한 오류 메시지.
   * 값이 있으면 오류 화면을 표시하고, 없으면 성공 화면을 표시한다.
   */
  error?: string;
  /** 확인 버튼 클릭 (홈 또는 이전 화면으로 이동) */
  onConfirm?: () => void;
}
