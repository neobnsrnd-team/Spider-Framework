/**
 * @file types.ts
 * @description TransferSuccessPage 컴포넌트 타입 정의.
 */

export interface TransferSuccessPageProps {
  /** 받는 사람 이름 */
  recipientName:        string;
  /** 이체 금액 — 원화 단위 숫자. 컴포넌트 내부에서 포맷 처리 */
  amount:               number;
  /** 받는 계좌 표시 문자열 (예: '국민 987-654-321012') */
  targetAccount:        string;
  /** 내 통장 표시 메모 */
  myMemo:               string;
  /** 받는 분 통장 표시 메모 */
  recipientMemo:        string;
  /** 이체 후 잔액 — 원화 단위 숫자. 컴포넌트 내부에서 포맷 처리 */
  balanceAfterTransfer: number;
  /** 카카오톡 공유 액션 표시 여부 */
  showKakaoShare:       boolean;
}
