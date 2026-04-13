/**
 * @file index.tsx
 * @description 카드 목록 가로 스크롤 영역의 pill 형태 탭 버튼 컴포넌트.
 *
 * 선택된 탭: 브랜드 배경·흰 텍스트
 * 미선택 탭: 회색 배경·보조 텍스트
 *
 * @param label      - 탭 레이블 (카드명 등)
 * @param isSelected - 선택 여부
 * @param onClick    - 클릭 핸들러
 */
import React from 'react';
import { cn } from '@lib/cn';
import type { CardPillTabProps } from './types';

export type { CardPillTabProps } from './types';

export function CardPillTab({ label, isSelected, onClick }: CardPillTabProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'px-md py-xs rounded-full text-sm whitespace-nowrap transition-colors duration-150',
        isSelected
          ? 'bg-brand text-brand-fg font-bold'
          : 'bg-surface-raised text-text-secondary font-medium hover:bg-surface-subtle',
      )}
      aria-pressed={isSelected}
    >
      {label}
    </button>
  );
}
