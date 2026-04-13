/**
 * @file index.tsx
 * @description 텍스트 레이블이 중앙에 있는 수평 구분선 컴포넌트.
 *
 * 좌우에 얇은 선을 두고 가운데에 텍스트를 배치하는 구분선 패턴.
 * 로그인 화면의 "다른 로그인 방식" 또는 "또는" 구분선처럼
 * 두 영역 사이의 시각적 경계를 표시할 때 사용한다.
 *
 * @param label     - 구분선 중앙에 표시할 텍스트
 * @param className - 추가 Tailwind 클래스
 *
 * @example
 * <DividerWithLabel label="다른 로그인 방식" />
 *
 * @example
 * <DividerWithLabel label="또는" className="my-xl" />
 */
import React from 'react';
import { cn } from '@lib/cn';
import type { DividerWithLabelProps } from './types';

export type { DividerWithLabelProps } from './types';

export function DividerWithLabel({ label, className }: DividerWithLabelProps) {
  return (
    <div
      className={cn('flex items-center gap-md', className)}
      role="separator"
      aria-label={label}
    >
      {/* 좌측 수평선 — flex-1로 남은 공간을 채움 */}
      <div className="flex-1 h-px bg-border" aria-hidden="true" />

      {/* 중앙 레이블 — uppercase + tracking-widest로 Figma 디자인 재현 */}
      <span className="shrink-0 text-xs font-bold text-text-muted tracking-widest uppercase">
        {label}
      </span>

      {/* 우측 수평선 */}
      <div className="flex-1 h-px bg-border" aria-hidden="true" />
    </div>
  );
}