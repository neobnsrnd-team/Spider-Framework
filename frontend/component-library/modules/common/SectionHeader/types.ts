/**
 * @file types.ts
 * @description SectionHeader 컴포넌트의 타입 정의.
 *
 * 섹션 제목(좌) + 선택적 액션 링크/버튼(우) 패턴.
 * 3곳 이상 반복되는 "[타이틀] [전체보기 →]" 레이아웃을 표준화.
 *
 * @see component-map.md §3.2-A
 */

export interface SectionHeaderProps {
  /** 섹션 제목 텍스트 */
  title: string;
  /**
   * 제목 우측에 표시할 계좌/항목 수 배지 (예: 2 → '2').
   * 미전달 시 배지 미노출.
   */
  badge?: number;
  /** 우측 액션 레이블 (예: '전체보기'). 미전달 시 액션 영역 미노출 */
  actionLabel?: string;
  /** 액션 클릭 핸들러. actionLabel과 함께 전달해야 동작 */
  onAction?: () => void;
  /** 추가 클래스 */
  className?: string;
}