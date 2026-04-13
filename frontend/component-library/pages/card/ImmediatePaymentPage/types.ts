/**
 * @file types.ts
 * @description ImmediatePaymentPage 컴포넌트 타입 정의.
 */
export type { PaymentAccountCardProps as PaymentAccountItem } from '../../../biz/card/PaymentAccountCard';

/** 유의사항 단일 항목 */
export interface CautionItem {
  /** 유의사항 제목. 예: '출금 제한 안내' */
  title: string;
  /** 유의사항 본문 */
  content: string;
}

export interface ImmediatePaymentPageProps {
  /** 하나은행 결제계좌 카드 데이터 */
  hanaAccount: import('../../../biz/card/PaymentAccountCard').PaymentAccountCardProps;
  /** 타행 결제계좌 카드 데이터 */
  otherAccount: import('../../../biz/card/PaymentAccountCard').PaymentAccountCardProps;
  /** 유의사항 항목 목록 */
  cautions: CautionItem[];
  /** 즉시결제(선결제) 버튼 클릭 */
  onImmediatePayment?: () => void;
  /** 건별즉시결제(건별선결제) 버튼 클릭 */
  onItemPayment?: () => void;
  /** 매주 자동 선결제 버튼 클릭 */
  onAutoPayment?: () => void;
  /** 뒤로가기 핸들러 */
  onBack?: () => void;
  /** 닫기(X) 핸들러 */
  onClose?: () => void;
}
