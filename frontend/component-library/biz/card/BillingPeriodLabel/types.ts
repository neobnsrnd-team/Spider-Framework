/**
 * @file types.ts
 * @description BillingPeriodLabel 컴포넌트의 TypeScript 타입 정의.
 *
 * 카드 이용내역 목록 상단에 표시되는 청구 기간 레이블 전용.
 */

export interface BillingPeriodLabelProps {
  /** 이용기간 시작일. 예: '2025.03.01' */
  startDate:  string;
  /** 이용기간 종료일. 예: '2025.03.31' */
  endDate:    string;
  className?: string;
}
