/**
 * @file types.ts
 * @description PinDotIndicator 컴포넌트의 TypeScript 타입 정의.
 *
 * 계좌 비밀번호·PIN 입력 화면에서 입력 진행 상태를 도트(원형)로 표시하는 컴포넌트.
 * 입력된 자릿수만큼 도트가 채워지고 나머지는 빈 원으로 표시된다.
 */

export interface PinDotIndicatorProps {
  /**
   * 전체 도트 수 (비밀번호 자릿수).
   * 기본값: 4 — 계좌 비밀번호 4자리에 맞춤
   */
  length?: number;
  /**
   * 채워진(입력된) 도트 수.
   * 0 ≤ filledCount ≤ length 범위여야 한다.
   */
  filledCount: number;
  /** 추가 Tailwind 클래스 */
  className?: string;
}
