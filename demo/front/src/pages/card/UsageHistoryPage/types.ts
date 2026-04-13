/**
 * @file types.ts
 * @description UsageHistoryPage 컴포넌트 타입 정의.
 *
 * Transaction·SearchFilter 등 세부 타입은 biz 컴포넌트에서 re-export한다.
 */
export type { Transaction, MerchantInfo } from '@cl/biz/card/UsageTransactionItem';
export type { SearchFilter, CardOption }  from '@cl/biz/card/UsageHistoryFilterSheet';

/** 페이지 상단 결제 요약 카드 데이터 */
export interface UsagePaymentSummary {
  /** 결제 예정일. 예: '2026년 4월 14일' */
  date: string;
  /** 총 청구금액(원) */
  totalAmount: number;
}

export interface UsageHistoryPageProps {
  transactions:       import('../../../biz/card/UsageTransactionItem').Transaction[];
  totalCount:         number;
  paymentSummary:     UsagePaymentSummary;
  cardOptions:        import('../../../biz/card/UsageHistoryFilterSheet').CardOption[];
  onLoadMore?:        () => void;
  onInstallment?:     () => void;
  onImmediatePayment?: () => void;
  onRevolving?:       () => void;
  onSearch?:          (filter: import('../../../biz/card/UsageHistoryFilterSheet').SearchFilter) => void;
  onBack?:            () => void;
  onClose?:           () => void;
}
