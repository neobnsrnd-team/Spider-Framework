/**
 * @file types.ts
 * @description ImmediatePayMethodPage (STEP 3 — 결제방식 선택) 타입 정의.
 */

/** 결제 유형 */
export type PaymentType = 'total' | 'per-item';

/** 신청정보 확인 단일 항목 */
export interface SummaryItem {
  /** 항목 레이블. 예: '청구단위' */
  label: string;
  /** 항목 값. 예: '하나 머니 체크카드' */
  value: string;
}

/** 출금계좌 단일 항목 */
export interface AccountInfo {
  id: string;
  /** 은행명. 예: '하나은행' */
  bankName: string;
  /** 마스킹된 계좌번호. 예: '123-456789-01***' */
  maskedAccount: string;
}

export interface ImmediatePayMethodPageProps {
  /** STEP 1에서 선택된 결제 유형 */
  initialPaymentType?: PaymentType;
  /** 신청정보 확인 항목 목록 (STEP 1·2 선택값 요약) */
  summaryItems: SummaryItem[];
  /** 출금계좌 목록 */
  accounts: AccountInfo[];
  /** 초기 선택 계좌 id */
  initialAccountId?: string;
  /** 신청 버튼 클릭. 선택된 계좌 id를 전달 */
  onApply?: (accountId: string) => void;
  onBack?: () => void;
  onClose?: () => void;
}
