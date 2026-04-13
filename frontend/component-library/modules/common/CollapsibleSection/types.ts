/**
 * @file types.ts
 * @description CollapsibleSection 컴포넌트의 TypeScript 타입 정의.
 *
 * 헤더 클릭으로 내용을 펼치거나 접는 아코디언 패턴.
 * 전계좌 조회 페이지의 계좌 그룹(예금·외화예금 등)처럼
 * 섹션 단위로 접기/펼치기가 필요한 경우에 사용한다.
 */
import type React from 'react';

export interface CollapsibleSectionProps {
  /**
   * 항상 노출되는 헤더 영역.
   * 클릭 시 콘텐츠 표시/숨김이 토글된다.
   */
  header: React.ReactNode;
  /** 펼침 상태에서만 표시되는 콘텐츠 */
  children: React.ReactNode;
  /**
   * 초기 펼침 여부.
   * @default true — 기본적으로 펼쳐진 상태로 렌더링
   */
  defaultExpanded?: boolean;
  /**
   * 헤더 텍스트 영역 정렬.
   * - 'left'  : 텍스트를 왼쪽 정렬 (화살표는 항상 우측 끝 고정)
   * - 'center': 텍스트를 가운데 정렬
   * @default 'center'
   */
  headerAlign?: 'left' | 'center';
  /** 추가 Tailwind 클래스 */
  className?: string;
}
