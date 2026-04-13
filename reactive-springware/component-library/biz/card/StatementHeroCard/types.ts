/**
 * @file types.ts
 * @description StatementHeroCard 컴포넌트 타입 정의.
 */

export interface StatementHeroCardProps {
  /** 원화 명세서 금액 (정수, 자동 포맷) */
  amount: number;
  /**
   * 결제일 표시 텍스트
   * @example "12월 25일"
   */
  dueDate: string;
  /**
   * 카드 상단 설명 레이블
   * @default "이번 달 명세서"
   */
  label?: string;
  /** 상세 화살표 클릭 핸들러 (전달 시 화살표 아이콘 노출) */
  onDetail?: () => void;
  /** true이면 금액을 마스킹 처리하여 숨긴다 */
  hidden?: boolean;
  className?: string;
}
