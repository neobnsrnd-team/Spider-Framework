/**
 * @file index.tsx
 * @description 카드 이용내역 목록 상단 청구 기간 레이블 컴포넌트.
 *
 * 이용기간 시작일~종료일을 시계 아이콘과 함께 한 줄로 표시하고,
 * 하단 구분선으로 목록 헤더 역할을 한다.
 *
 * @param startDate - 이용기간 시작일. 예: '2025.03.01'
 * @param endDate   - 이용기간 종료일. 예: '2025.03.31'
 *
 * @example
 * <BillingPeriodLabel startDate="2025.03.01" endDate="2025.03.31" />
 */
import React from 'react';
import { Clock } from 'lucide-react';
import { cn } from '@lib/cn';
import type { BillingPeriodLabelProps } from './types';

export function BillingPeriodLabel({ startDate, endDate, className }: BillingPeriodLabelProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-sm',
        'pb-sm border-b border-border-subtle',
        className,
      )}
    >
      {/* 기간 아이콘 — 이용기간임을 시각적으로 전달 */}
      <Clock size={14} className="text-text-muted shrink-0" aria-hidden="true" />
      <span className="text-xs text-text-muted">
        이용기간 : {startDate} ~ {endDate}
      </span>
    </div>
  );
}
