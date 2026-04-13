/**
 * @file index.tsx
 * @description 카드 이용실적 진행 바 컴포넌트.
 *
 * 이번달 이용금액과 혜택 달성을 위한 목표 실적을 진행 바(progress bar)로 시각화한다.
 * 달성률에 따라 바 색상이 채워지고, 미달 금액을 안내 문구로 표시한다.
 * 목표 달성 시 완료 메시지를 표시한다.
 *
 * @param cardName           - 카드명
 * @param currentAmount      - 이번달 이용금액 (원)
 * @param targetAmount       - 목표 실적 금액 (원)
 * @param benefitDescription - 달성 시 혜택 설명
 * @param onDetail           - 실적 상세 클릭 핸들러
 */
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@lib/cn';

import { Typography } from '../../../core/Typography';
import type { CardPerformanceBarProps } from './types';

export type { CardPerformanceBarProps } from './types';

/** 숫자 포맷터 (콤마 구분) */
const numFmt = new Intl.NumberFormat('ko-KR');

export function CardPerformanceBar({
  cardName,
  currentAmount,
  targetAmount,
  benefitDescription,
  onDetail,
}: CardPerformanceBarProps) {
  /** 달성률 — 0~100 사이로 클램프 */
  const percent = Math.min(Math.round((currentAmount / targetAmount) * 100), 100);
  const isAchieved = currentAmount >= targetAmount;
  /** 목표까지 남은 금액 */
  const remaining = Math.max(targetAmount - currentAmount, 0);

  return (
    <div className="flex flex-col gap-sm bg-surface rounded-xl border border-border-subtle px-md py-md shadow-card">

      {/* ── 카드명 + 상세 링크 ─────────────────────── */}
      <div className="flex items-center justify-between">
        <Typography variant="caption" weight="bold" color="heading">
          {cardName}
        </Typography>
        {onDetail && (
          <button
            type="button"
            onClick={onDetail}
            className="flex items-center gap-xs text-text-muted hover:text-text-heading transition-colors duration-150"
            aria-label="실적 상세보기"
          >
            <Typography variant="caption" color="muted">실적 상세</Typography>
            <ChevronRight className="size-3.5" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* ── 이용금액 / 목표금액 ────────────────────── */}
      <div className="flex items-end justify-between">
        <Typography variant="body-sm" weight="bold" color={isAchieved ? 'brand' : 'heading'} numeric>
          {numFmt.format(currentAmount)}원
        </Typography>
        <Typography variant="caption" color="muted" numeric>
          목표 {numFmt.format(targetAmount)}원
        </Typography>
      </div>

      {/* ── 진행 바 ────────────────────────────────── */}
      <div
        className="w-full h-2 bg-surface-raised rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`이용실적 ${percent}% 달성`}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500',
            isAchieved ? 'bg-brand' : 'bg-brand-10 border border-brand',
          )}
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* ── 달성 안내 문구 ─────────────────────────── */}
      {isAchieved ? (
        <Typography variant="caption" color="brand">
          ✓ 전월 실적 달성 완료
        </Typography>
      ) : (
        <Typography variant="caption" color="muted">
          {numFmt.format(remaining)}원 더 이용하면 실적 달성
          {benefitDescription && ` (${benefitDescription})`}
        </Typography>
      )}

    </div>
  );
}
