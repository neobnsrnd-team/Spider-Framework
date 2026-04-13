/**
 * @file types.ts
 * @description Section 컴포넌트의 TypeScript 타입 정의.
 * SectionHeader + 콘텐츠 영역을 하나의 단위로 묶는 레이아웃 컴포넌트.
 */
import React from 'react';

export interface SectionProps {
  /** 섹션 제목. 전달 시 SectionHeader 노출, 미전달 시 제목 없이 콘텐츠만 렌더링 */
  title?: string;
  /** 제목 옆 숫자 배지 (항목 수 등) */
  badge?: number;
  /** 우측 액션 레이블 (예: '전체보기') */
  actionLabel?: string;
  /** 액션 클릭 핸들러 */
  onAction?: () => void;
  /** 섹션 내부 콘텐츠 */
  children: React.ReactNode;
  /** SectionHeader와 children 사이, 그리고 children 내부 항목 간격. 기본: 'md' */
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}
