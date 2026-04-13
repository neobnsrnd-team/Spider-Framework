/**
 * @file types.ts
 * @description UsageHistoryFilterSheet 컴포넌트 타입 정의.
 */

export interface CardOption {
  value: string;
  label: string;
}

export type ApprovalType = 'approved' | 'confirmed';
export type CardType     = 'all' | 'credit' | 'check';
export type RegionType   = 'all' | 'domestic' | 'overseas';
export type UsageType    = 'all' | 'lump' | 'installment' | 'cashAdvance' | 'cancel';
export type PeriodType   = 'thisMonth' | '1month' | '3months' | 'custom';

export interface SearchFilter {
  approval:      ApprovalType;
  cardType:      CardType;
  /** 선택된 카드 value. 'all' 이면 전체 */
  selectedCard:  string;
  region:        RegionType;
  usageType:     UsageType;
  period:        PeriodType;
  /** period === 'custom' 일 때 선택된 월. 예: '2026-03' */
  customMonth?:  string;
}

export interface UsageHistoryFilterSheetProps {
  open: boolean;
  onClose: () => void;
  cardOptions: CardOption[];
  /** 필터 확정 시 호출. filter.customMonth에 선택 월이 담긴다. */
  onApply: (filter: SearchFilter) => void;
}
