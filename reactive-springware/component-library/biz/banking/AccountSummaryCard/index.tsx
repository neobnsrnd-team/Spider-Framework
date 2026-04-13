/**
 * @file index.tsx
 * @description 계좌 요약 카드 컴포넌트.
 *
 * 도메인 방침(6.1):
 * - type prop('deposit' | 'savings' | 'loan')으로 내부 요소 분기
 * - 금액은 number로 수신 → 컴포넌트 내부 Intl.NumberFormat('ko-KR') 처리
 * - badgeText prop 존재 시에만 배지 노출
 * - loan 타입에서는 금액을 danger 색상으로 표시
 *
 * @example
 * <AccountSummaryCard
 *   type="deposit"
 *   accountName="급여 통장"
 *   accountNumber="123-456-789012"
 *   balance={1234567}
 *   badgeText="주거래"
 *   actions={
 *     <>
 *       <Button size="sm" variant="outline">이체</Button>
 *       <Button size="sm" variant="ghost">내역</Button>
 *     </>
 *   }
 *   onClick={handleCardClick}
 * />
 */
import React from 'react';
import { ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@lib/cn';
import { LabelValueRow } from '../../../modules/common/LabelValueRow';
import type { AccountSummaryCardProps, AccountType } from './types';

/** 원화 금액 포맷터 */
const krwFormatter = new Intl.NumberFormat('ko-KR');

/** type별 기본 금액 레이블 */
const defaultBalanceLabel: Record<AccountType, string> = {
  deposit:        '잔액',
  savings:        '납입금액',
  loan:           '대출잔액',
  foreignDeposit: '잔액',
  retirement:     '적립금',
  securities:     '평가금액',
};

/** type별 금액 텍스트 색상 — loan은 danger 계열 */
const balanceColorClass: Record<AccountType, string> = {
  deposit:        'text-text-heading',
  savings:        'text-text-heading',
  loan:           'text-danger',
  foreignDeposit: 'text-text-heading',
  retirement:     'text-text-heading',
  securities:     'text-text-heading',
};

export function AccountSummaryCard({
  type,
  accountName,
  accountNumber,
  balance,
  balanceDisplay,
  balanceLabel,
  badgeText,
  moreButton,
  onMoreClick,
  onClick,
  actions,
  className,
}: AccountSummaryCardProps) {
  const Tag = onClick ? 'button' : 'div';

  const resolvedLabel = balanceLabel ?? defaultBalanceLabel[type];
  /* balanceDisplay가 제공된 경우 그대로 사용 (외화·기포맷 값).
     없으면 balance를 원화로 내부 포맷. */
  const displayBalance = balanceDisplay ?? `${krwFormatter.format(balance)}원`;

  return (
    <Tag
      onClick={onClick}
      className={cn(
        'w-full text-left',
        'bg-surface rounded-xl p-lg',
        'border border-border-subtle shadow-sm',
        'transition-all duration-150',
        onClick && 'cursor-pointer hover:border-brand hover:shadow-brand active:scale-[0.99]',
        className,
      )}
    >
      {/* ── 상단: 계좌명 + 배지 / 더보기 버튼 ──────────── */}
      <div className="flex items-center justify-between mb-xs">
        <div className="flex items-center gap-sm min-w-0">
          <span className="text-sm font-bold text-text-heading truncate">{accountName}</span>
          {/* badgeText가 있을 때만 배지 렌더링 */}
          {badgeText && (
            <span className="shrink-0 px-sm py-0.5 rounded-full text-xs font-bold bg-brand-10 text-brand-text">
              {badgeText}
            </span>
          )}
        </div>

        {/* 더보기 버튼 — moreButton prop이 있을 때만 렌더링 */}
        {moreButton && (
          <button
            type="button"
            onClick={e => { e.stopPropagation(); onMoreClick?.(); }}
            className="shrink-0 p-xs -mr-xs text-text-muted hover:text-text-heading transition-colors"
            aria-label="더보기"
          >
            {moreButton === 'chevron'
              ? <ChevronRight className="size-4" aria-hidden="true" />
              : <MoreHorizontal className="size-4" aria-hidden="true" />
            }
          </button>
        )}
      </div>

      {/* ── 계좌번호 ─────────────────────────────────────── */}
      <p className="text-xs text-text-muted mb-md">{accountNumber}</p>

      {/* ── 금액 영역: 레이블(좌) / 금액(우) ────────────── */}
      <LabelValueRow
        label={resolvedLabel}
        value={
          <span
            className={cn('text-xl font-bold font-numeric tabular-nums', balanceColorClass[type])}
            aria-label={`${resolvedLabel} ${displayBalance}`}
          >
            {displayBalance}
          </span>
        }
        /* actions 있을 때만 mb-lg 적용 — 없으면 하단 여백을 잡지 않음 */
        className={cn(actions && 'mb-lg')}
      />

      {/* ── 액션 버튼 슬롯: 버튼이 균등하게 전체 너비 채움 ── */}
      {actions && (
        <div
          className="flex gap-sm [&>*]:flex-1"
          /* 클릭 이벤트가 카드 onClick으로 전파되지 않도록 방지 */
          onClick={e => e.stopPropagation()}
        >
          {actions}
        </div>
      )}
    </Tag>
  );
}