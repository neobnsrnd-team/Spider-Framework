/**
 * @file types.ts
 * @description StepIndicator 컴포넌트 타입 정의.
 */

export interface StepIndicatorProps {
  /** 전체 단계 수 */
  total: number;
  /** 현재 진행 중인 단계 (1-based) */
  current: number;
  /** 추가 Tailwind 클래스 */
  className?: string;
}
