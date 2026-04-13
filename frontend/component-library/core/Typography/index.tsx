/**
 * @file index.tsx
 * @description 타이포그래피 유틸 컴포넌트.
 * variant prop으로 heading~caption 스케일을 선택하고,
 * numeric prop으로 금액/숫자에 적합한 Manrope 폰트를 적용한다.
 *
 * 컴포넌트명: Typography
 *
 * @example
 * <Typography variant="heading" weight="bold">잔액 조회</Typography>
 * <Typography variant="body-sm" color="muted">최근 거래일: 2026.03.26</Typography>
 * <Typography variant="subheading" numeric color="brand">1,234,567원</Typography>
 */
import React from 'react';
import { cn } from '@lib/cn';
import type { TypographyProps, TypographyVariant, TypographyWeight, TypographyColor } from './types';

/** variant별 폰트 크기 클래스 */
const variantStyles: Record<TypographyVariant, string> = {
  heading:    'text-2xl',
  subheading: 'text-xl',
  'body-lg':  'text-lg',
  body:       'text-base',
  'body-sm':  'text-sm',
  caption:    'text-xs',
};

/** variant별 기본 폰트 굵기 (명시적 weight prop으로 override 가능) */
const defaultWeight: Record<TypographyVariant, TypographyWeight> = {
  heading:    'bold',
  subheading: 'bold',
  'body-lg':  'normal',
  body:       'normal',
  'body-sm':  'normal',
  caption:    'normal',
};

const weightStyles: Record<TypographyWeight, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  bold:   'font-bold',
};

const colorStyles: Record<TypographyColor, string> = {
  heading:   'text-text-heading',
  base:      'text-text-base',
  label:     'text-text-label',
  secondary: 'text-text-secondary',
  muted:     'text-text-muted',
  brand:     'text-brand-text',
  danger:    'text-danger-text',
  success:   'text-success-text',
};

export function Typography({
  variant  = 'body',
  weight,
  color    = 'base',
  numeric  = false,
  as: Tag  = 'p',
  children,
  className,
}: TypographyProps) {
  const resolvedWeight = weight ?? defaultWeight[variant];

  return (
    <Tag
      className={cn(
        variantStyles[variant],
        weightStyles[resolvedWeight],
        colorStyles[color],
        /* numeric: 금액·숫자 표시 시 Manrope 폰트로 전환 */
        numeric && 'font-numeric',
        className,
      )}
    >
      {children}
    </Tag>
  );
}

