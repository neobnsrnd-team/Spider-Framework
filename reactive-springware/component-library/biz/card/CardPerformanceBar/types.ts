/**
 * @file types.ts
 * @description CardPerformanceBar 컴포넌트 props 타입 정의.
 */

export interface CardPerformanceBarProps {
  /** 카드명. 예: '하나 머니 체크카드' */
  cardName: string;
  /** 이번달 이용금액 (원) */
  currentAmount: number;
  /** 혜택 달성을 위한 목표 실적 금액 (원) */
  targetAmount: number;
  /** 목표 달성 시 제공되는 혜택 설명. 예: '전월 실적 달성 시 캐시백 1%' */
  benefitDescription?: string;
  /** 실적 상세 클릭 핸들러 */
  onDetail?: () => void;
}
