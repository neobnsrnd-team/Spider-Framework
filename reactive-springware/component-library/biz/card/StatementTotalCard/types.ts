/**
 * @file types.ts
 * @description StatementTotalCard 컴포넌트의 TypeScript 타입 정의.
 *
 * 이용대금명세서 화면의 총 결제금액 카드 전용.
 */

export interface StatementTotalCardProps {
  /** 총 결제금액 (원) */
  amount: number;
  /**
   * 금액 상단 배지 텍스트.
   * - '예정': 결제 예정 상태
   * - 미전달: 배지 미노출
   */
  badge?: '예정';
  /** 금액 우측 화살표 클릭 → 이용내역 화면 이동 */
  onDetailClick?: () => void;
  /** 분할납부 버튼 클릭 핸들러 */
  onInstallment?: () => void;
  /** 즉시결제 버튼 클릭 핸들러 */
  onImmediatePayment?: () => void;
  /** 일부결제금액이월약정(리볼빙) 버튼 클릭 핸들러 */
  onRevolving?: () => void;
  className?: string;
}
