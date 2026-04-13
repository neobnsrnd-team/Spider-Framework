/**
 * @file types.ts
 * @description DividerWithLabel 컴포넌트의 TypeScript 타입 정의.
 *
 * 좌우 수평선 사이에 텍스트 레이블을 표시하는 구분선.
 * 로그인 화면의 "다른 로그인 방식" 같은 섹션 구분에 사용한다.
 */

export interface DividerWithLabelProps {
  /** 구분선 중앙에 표시할 텍스트 (예: '다른 로그인 방식') */
  label: string;
  className?: string;
}