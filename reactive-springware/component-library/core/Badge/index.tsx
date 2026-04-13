/**
 * @file index.tsx
 * @description 상태·카테고리 표시용 배지 컴포넌트.
 * variant prop으로 브랜드/시맨틱 색상을 선택하며, dot prop으로 점 표시 전환이 가능하다.
 *
 * @example
 * <Badge variant="brand">주거래</Badge>
 * <Badge variant="danger">연체</Badge>
 * <Badge variant="success" dot />
 */
import React from 'react';
import { cn } from '@lib/cn';
import type { BadgeProps, BadgeVariant } from './types';

/** variant별 배경·텍스트 색상 */
const variantStyles: Record<BadgeVariant, string> = {
  primary: 'bg-primary-surface text-primary-text',
  brand:   'bg-brand-10 text-brand-text',
  success: 'bg-success-surface text-success-text',
  danger:  'bg-danger-surface text-danger-text',
  warning: 'bg-warning-surface text-warning-text',
  /* neutral: 강조 없는 기본 회색 배지 */
  neutral: 'bg-surface-raised text-text-secondary',
};

export function Badge({ variant = 'neutral', children, dot = false, className }: BadgeProps) {
  if (dot) {
    /* 점 표시 전용 — 텍스트 없이 원형 인디케이터만 */
    return (
      <span
        aria-hidden="true"
        className={cn(
          'inline-block size-2 rounded-full',
          variantStyles[variant],
          className,
        )}
      />
    );
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-sm py-0.5 text-xs font-bold',
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}