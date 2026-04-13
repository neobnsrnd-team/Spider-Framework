/**
 * @file index.tsx
 * @description 세로 방향 flex 레이아웃 컴포넌트.
 * 폼 필드 목록, 카드 목록 등 세로로 나열하는 모든 상황에 사용한다.
 * gap prop으로 globals.css 간격 토큰(xs~2xl)을 직접 제어한다.
 *
 * @example
 * // 이체 폼 필드 나열
 * <Stack gap="lg">
 *   <Input label="받는 계좌번호" />
 *   <AmountInput label="금액" />
 *   <Input label="메모" />
 * </Stack>
 *
 * // 카드 목록
 * <Stack gap="sm" as="ul">
 *   {accounts.map(a => <li key={a.id}><AccountSummaryCard {...a} /></li>)}
 * </Stack>
 */
import React from 'react';
import { cn } from '@lib/cn';
import type { StackProps, StackGap, StackAlign } from './types';

/** gap prop → Tailwind gap 클래스 */
const gapClass: Record<StackGap, string> = {
  xs:  'gap-xs',
  sm:  'gap-sm',
  md:  'gap-md',
  lg:  'gap-lg',
  xl:  'gap-xl',
  '2xl': 'gap-2xl',
};

/** align prop → Tailwind items 클래스 */
const alignClass: Record<StackAlign, string> = {
  start:   'items-start',
  center:  'items-center',
  end:     'items-end',
  stretch: 'items-stretch',
};

/* 고객 프로젝트에서 타입을 직접 import할 수 있도록 re-export */
export type { StackProps, StackGap, StackAlign } from './types';

export function Stack({
  children,
  gap   = 'md',
  align = 'stretch',
  as: Tag = 'div',
  className,
}: StackProps) {
  return (
    <Tag
      className={cn(
        'flex flex-col',
        gapClass[gap],
        alignClass[align],
        className,
      )}
    >
      {children}
    </Tag>
  );
}