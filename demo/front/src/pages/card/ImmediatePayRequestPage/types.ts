/**
 * @file types.ts
 * @description ImmediatePayRequestPage (STEP 2 — 즉시결제 신청) 타입 정의.
 */

/** 선택된 카드 정보 */
export interface CardInfo {
  id: string;
  /** 카드명. 예: '하나 머니 체크카드' */
  name: string;
  /** 마스킹된 카드번호. 예: '1234-56**-****-7890' */
  maskedNumber: string;
}

/** 결제 유형 — 총 이용금액 결제 또는 이용건별 결제 */
export type PaymentType = 'total' | 'per-item';

/** 이용구분 — 일시불 또는 결제금액 선택 */
export type UsageType = 'lump' | 'amount';

/** 결제 예정 상세 항목 (날짜별 결제금액 분할) */
export interface PaymentBreakdownItem {
  /** 결제 예정일. 예: '2026.04.14 결제' */
  dateLabel: string;
  /** 결제 금액 (원) */
  amount: number;
}

/** 꼭! 알아두세요 안내 항목 */
export interface CautionItem {
  title: string;
  content: string;
}

export interface ImmediatePayRequestPageProps {
  /** STEP 1에서 선택된 결제 유형 */
  initialPaymentType?: PaymentType;
  /** STEP 1에서 선택된 카드 정보 */
  card: CardInfo;
  /** 결제가능금액 (원) */
  payableAmount: number;
  /** 날짜별 결제금액 분할 내역 */
  paymentBreakdown?: PaymentBreakdownItem[];
  /** 결제할 금액 입력란 안내 문구 */
  amountHelperText?: string;
  /** 꼭! 알아두세요 항목 목록 */
  cautions: CautionItem[];
  /** 변경하기 버튼 클릭 — STEP 1로 이동 */
  onChangeCard?: () => void;
  /** 다음 버튼 클릭. 선택된 이용구분·결제금액을 전달 */
  onNext?: (usageType: UsageType, payAmount: number) => void;
  onBack?: () => void;
  onClose?: () => void;
}
