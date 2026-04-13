/**
 * @file index.tsx
 * @description 카드 도메인 요약 카드 컴포넌트 (variant: 'asset' | 'spending').
 *
 * 두 variant는 동일한 구조(레이블 + 제목 + 금액 + 아이콘 + 액션 버튼 그룹)를 공유하며
 * 아래 항목에서만 차이가 난다.
 *
 * | 항목         | asset              | spending                          |
 * |--------------|--------------------|------------------------------------|
 * | 왼쪽 액센트 바 | 없음              | --domain-card-accent (lime) 4px 바 |
 * | 금액 색상    | 브랜드(brand-text) | 기본 헤딩(text-heading)            |
 * | 액션 active  | 회색 배경           | 도메인 액센트 배경 + 액센트 텍스트  |
 *
 * 액션 버튼의 active 색상에 `--domain-card-accent` CSS 변수를 사용하므로
 * 반드시 `[data-domain='card']` 컨텍스트 내에서 렌더링되어야 한다.
 *
 * @param variant  - 'asset' | 'spending'
 * @param title    - 한글 제목 (e.g. "총 자산")
 * @param amount   - 원화 금액 (정수)
 * @param icon     - 우측 상단 아이콘 슬롯 (ReactNode)
 * @param actions  - 하단 액션 버튼 목록
 * @param onClick  - 카드 전체 클릭 핸들러
 *
 * @example
 * <SummaryCard
 *   variant="asset"
 *   title="총 자산"
 *   amount={42850000}
 *   icon={<Building2 size={36} />}
 *   actions={[
 *     { label: '내 계좌', onClick: handleMyAccount },
 *     { label: '금융진단', onClick: handleDiagnosis },
 *   ]}
 * />
 */
import React from 'react';
import { cn } from '@lib/cn';
import type { SummaryCardProps } from './types';

/** 원화 금액 포맷터 */
const krwFormatter = new Intl.NumberFormat('ko-KR');

export function SummaryCard({
  variant,
  title,
  amount,
  icon,
  actions,
  onClick,
  hidden = false,
  className,
}: SummaryCardProps) {
  const Tag = onClick ? 'button' : 'div';
  const formattedAmount = `${krwFormatter.format(amount)}원`;
  const isSpending = variant === 'spending';

  return (
    <Tag
      onClick={onClick}
      className={cn(
        'w-full text-left',
        'bg-surface rounded-xl shadow-sm',
        'border border-border-subtle',
        'transition-all duration-150',
        /* spending variant: 왼쪽 도메인 액센트 바 (4px) */
        isSpending && 'border-l-4 border-l-[var(--domain-card-accent)]',
        /* 클릭 가능한 카드에만 hover/active 효과 */
        onClick && 'cursor-pointer hover:shadow-md active:scale-[0.99]',
        className,
      )}
    >
      <div
        className={cn(
          'flex flex-col gap-lg',
          /* spending variant: border-l 만큼 시각 보정 — 내부 padding 균일 유지 */
          isSpending ? 'p-xl' : 'p-xl',
        )}
      >
        {/* ── 상단: 레이블 + 제목 + 금액 / 우측 아이콘 ── */}
        <div className="flex items-start justify-between gap-md">
          <div className="flex flex-col gap-xs">
            {/* 한글 메인 제목 */}
            <span className="text-xl font-bold text-text-heading">{title}</span>
            {/* 금액: asset은 브랜드 색상, spending은 기본 헤딩 색상 / hidden이면 마스킹 */}
            <span
              className={cn(
                'text-lg font-bold tabular-nums font-numeric',
                isSpending ? 'text-text-heading' : 'text-brand-text',
              )}
              aria-label={hidden ? '금액 숨김' : `${title} ${formattedAmount}`}
            >
              {hidden ? '금액 숨김 중' : formattedAmount}
            </span>
          </div>

          {/* 우측 아이콘 슬롯 */}
          {icon && (
            <span className="shrink-0 flex items-center justify-center size-12 rounded-full bg-brand-10 text-brand">
              {icon}
            </span>
          )}
        </div>

        {/* ── 하단: 액션 버튼 그룹 ── */}
        {actions && actions.length > 0 && (
          <div
            className="flex gap-sm"
            /* 카드 onClick 버블링 방지 */
            onClick={(e) => e.stopPropagation()}
          >
            {actions.map((action) => (
              <button
                key={action.label}
                type="button"
                onClick={action.onClick}
                className={cn(
                  'flex-1 py-md rounded-full text-xs font-bold transition-colors duration-150',
                  action.active
                    ? /* 활성 상태: 도메인 액센트 배경 + 액센트 텍스트 */
                      'bg-[var(--domain-card-accent)] text-[var(--domain-card-accent-text)]'
                    : /* 비활성 상태: 회색 배경 + 헤딩 텍스트 */
                      'bg-surface-raised text-text-heading',
                )}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </Tag>
  );
}
