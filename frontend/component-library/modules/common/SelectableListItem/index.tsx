/**
 * @file index.tsx
 * @description BottomSheet 목록에서 단일 항목을 선택하는 행 컴포넌트.
 *
 * 선택된 항목은 브랜드 색상·볼드, 하단 구분선으로 항목을 분리한다.
 * 월 선택·카드 선택 등 BottomSheet 내 목록 패턴에 공통 사용한다.
 *
 * @param label      - 표시 레이블
 * @param isSelected - 선택 여부
 * @param onClick    - 클릭 핸들러
 */
import React from 'react';
import { cn } from '@lib/cn';
import type { SelectableListItemProps } from './types';

export type { SelectableListItemProps } from './types';

export function SelectableListItem({ label, isSelected, onClick }: SelectableListItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full text-left px-md py-lg',
        'border-b border-border-subtle last:border-b-0',
        'transition-colors duration-100',
        isSelected
          ? 'text-brand font-bold'
          : 'text-text-heading hover:bg-surface-raised',
      )}
      aria-pressed={isSelected}
    >
      {label}
    </button>
  );
}
