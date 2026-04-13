/**
 * @file index.tsx
 * @description 단계 진행 상태를 점(dot)으로 표시하는 컴포넌트.
 *
 * 현재 단계는 브랜드 색상의 큰 점, 나머지는 작은 회색 점으로 표시해
 * 전체 n단계 중 몇 번째인지 직관적으로 안내한다.
 *
 * @param total   - 전체 단계 수
 * @param current - 현재 단계 (1-based)
 *
 * @example
 * <StepIndicator total={4} current={2} />
 */
import React from 'react';
import { cn } from '@lib/cn';
import type { StepIndicatorProps } from './types';

export type { StepIndicatorProps } from './types';

export function StepIndicator({ total, current, className }: StepIndicatorProps) {
  return (
    <div className={cn('flex items-center gap-xs', className)} aria-label={`${total}단계 중 ${current}단계`}>
      {Array.from({ length: total }, (_, i) => {
        const isActive = i + 1 === current;
        return (
          <span
            key={i}
            className={cn(
              'rounded-full transition-all duration-200',
              isActive
                ? /* 현재 단계: 브랜드 색상, 넓은 pill 형태 */
                  'w-4 h-2 bg-brand'
                : /* 나머지 단계: 작은 회색 점 */
                  'w-2 h-2 bg-border',
            )}
            aria-hidden="true"
          />
        );
      })}
    </div>
  );
}
