/**
 * @file index.tsx
 * @description 가로 방향 flex 레이아웃 컴포넌트.
 * 버튼 행, 배지 그룹, 레이블-값 좌우 분리 등 가로 나열 패턴에 사용한다.
 *
 * @example
 * // 섹션 헤더: 타이틀 ↔ 전체보기 버튼 좌우 분리
 * <Inline justify="between" align="center" className="mb-md">
 *   <Typography variant="subheading">최근 거래</Typography>
 *   <button className="text-xs text-brand-text">전체보기</button>
 * </Inline>
 *
 * // 버튼 행
 * <Inline gap="sm" justify="end">
 *   <Button variant="outline">취소</Button>
 *   <Button>확인</Button>
 * </Inline>
 */
import React from 'react';
import { cn } from '@lib/cn';
import type { InlineProps, InlineAlign, InlineJustify } from './types';
import type { StackGap } from '../Stack/types';

/** gap → Tailwind gap 클래스 */
const gapClass: Record<StackGap, string> = {
  xs:  'gap-xs',
  sm:  'gap-sm',
  md:  'gap-md',
  lg:  'gap-lg',
  xl:  'gap-xl',
  '2xl': 'gap-2xl',
};

/** align → Tailwind items 클래스 */
const alignClass: Record<InlineAlign, string> = {
  start:    'items-start',
  center:   'items-center',
  end:      'items-end',
  baseline: 'items-baseline',
  stretch:  'items-stretch',
};

/** justify → Tailwind justify 클래스 */
const justifyClass: Record<InlineJustify, string> = {
  start:   'justify-start',
  center:  'justify-center',
  end:     'justify-end',
  between: 'justify-between',
  around:  'justify-around',
  evenly:  'justify-evenly',
};

/* 고객 프로젝트에서 타입을 직접 import할 수 있도록 re-export */
export type { InlineProps, InlineAlign, InlineJustify } from './types';

export function Inline({
  children,
  gap     = 'sm',
  align   = 'center',
  justify = 'start',
  wrap    = false,
  as: Tag = 'div',
  className,
}: InlineProps) {
  return (
    <Tag
      className={cn(
        'flex',
        gapClass[gap],
        alignClass[align],
        justifyClass[justify],
        wrap && 'flex-wrap',
        className,
      )}
    >
      {children}
    </Tag>
  );
}