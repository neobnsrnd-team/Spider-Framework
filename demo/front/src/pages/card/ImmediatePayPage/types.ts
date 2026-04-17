/**
 * @file types.ts
 * @description ImmediatePayPage 컴포넌트 타입 정의.
 *
 * 즉시결제 화면(STEP 1 — 결제정보 선택)에서 사용하는 타입.
 */

/** 결제 유형 — 총 이용금액 결제 vs 이용건별 결제 */
export type PaymentType = 'total' | 'per-item';

/** 카드 정보 단일 항목 */
export interface CardInfo {
  /** 고유 식별자 */
  id: string;
  /** 카드명. 예: '하나 머니 체크카드' */
  name: string;
  /** 마스킹된 카드번호. 예: '1234-56**-****-7890' */
  maskedNumber: string;
  /** 결제은행명. POC_카드리스트.결제은행명 */
  paymentBank: string;
  /** 결제계좌. POC_카드리스트.결제계좌 */
  paymentAccount: string;
}

export interface ImmediatePayPageProps {
  /** 보유 카드 목록 — Select 옵션 및 아코디언 카드 목록에 공통 사용 */
  cards: CardInfo[];
  /** 초기 선택 카드 id */
  initialCardId?: string;
  /** 초기 결제 유형 (기본: 'total') */
  initialPaymentType?: PaymentType;
  /** 결제 유형 변경 핸들러 */
  onPaymentTypeChange?: (type: PaymentType) => void;
  /** 카드 변경 핸들러 */
  onCardChange?: (cardId: string) => void;
  /** 뒤로가기 핸들러 */
  onBack?: () => void;
  /** 닫기(X) 핸들러 */
  onClose?: () => void;
  /** 다음 버튼 클릭 핸들러. 현재 선택된 카드 id를 전달한다. */
  onNext?: (cardId: string) => void;
}
