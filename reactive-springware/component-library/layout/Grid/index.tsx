/**
 * @file index.tsx
 * @description 반응형 CSS 그리드 레이아웃 컴포넌트.
 * cols prop으로 모바일 열 수를, tabletCols prop으로 태블릿 이상 열 수를 제어한다.
 *
 * @example
 * // 홈 퀵메뉴 4열 그리드
 * <Grid cols={4} gap="xs">
 *   <QuickMenuItem ... />
 * </Grid>
 *
 * // 통계 카드 2열 → 태블릿 4열
 * <Grid cols={2} tabletCols={4} gap="md">
 *   <StatCard ... />
 * </Grid>
 */
import React from 'react';
import { cn } from '@lib/cn';
import type { GridProps } from './types';
import type { StackGap } from '../Stack/types';

/** cols → Tailwind grid-cols 클래스 */
const colsClass: Record<NonNullable<GridProps['cols']>, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
};

/** tabletCols → Tailwind md:grid-cols 클래스 */
const tabletColsClass: Record<NonNullable<GridProps['tabletCols']>, string> = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
};

/** gap → Tailwind gap 클래스 */
const gapClass: Record<StackGap, string> = {
  xs:  'gap-xs',
  sm:  'gap-sm',
  md:  'gap-md',
  lg:  'gap-lg',
  xl:  'gap-xl',
  '2xl': 'gap-2xl',
};

/* 고객 프로젝트에서 타입을 직접 import할 수 있도록 re-export */
export type { GridProps } from './types';

export function Grid({
  children,
  cols       = 2,
  tabletCols,
  gap        = 'sm',
  className,
}: GridProps) {
  return (
    <div
      className={cn(
        'grid',
        colsClass[cols],
        tabletCols && tabletColsClass[tabletCols],
        gapClass[gap],
        className,
      )}
    >
      {children}
    </div>
  );
}