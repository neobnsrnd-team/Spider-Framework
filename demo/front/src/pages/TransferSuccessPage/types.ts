/**
 * @file types.ts
 * @description 이체 완료 페이지에서 사용하는 TypeScript 타입 정의.
 *
 * 서버 응답 타입(raw)과 클라이언트 도메인 타입을 분리하여
 * Repository 레이어에서 변환 책임을 명확히 한다.
 */

// ──────────────────────────────────────────────
// 클라이언트 도메인 타입 (camelCase)
// ──────────────────────────────────────────────

/** 이체 완료 후 화면에 표시할 이체 결과 데이터 */
export interface TransferSuccessData {
  /** 받는 사람 이름 (예: "홍길동") */
  recipientName: string;
  /** 이체 금액 — 원화 단위 숫자 (예: 50000) */
  amount: number;
  /** 받는 계좌 표시 문자열 (예: "국민 987-654-321012") */
  targetAccount: string;
  /** 내 통장 표시 메모 (예: "점심값") */
  myMemo: string;
  /** 받는 분 통장 표시 메모 (예: "김하나") */
  recipientMemo: string;
  /** 이체 후 출금 계좌 잔액 — 원화 단위 숫자 (예: 2900000) */
  balanceAfterTransfer: number;
}
