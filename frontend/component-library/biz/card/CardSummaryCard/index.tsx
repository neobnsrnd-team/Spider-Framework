/**
 * @file index.tsx
 * @description 카드 요약 카드 컴포넌트.
 *
 * AccountSummaryCard와 동일한 레이아웃 구조를 따름:
 * - 상단: 카드명 + 배지
 * - 중단: 마스킹 카드번호
 * - 금액 영역: type에 따라 레이블·색상·한도 표시 분기
 * - 하단: actions 슬롯
 *
 * credit 타입에서 limitAmount가 있으면 사용률(%)을 계산하여 색상 경고를 표시:
 * - 80% 미만: 기본 text-text-heading
 * - 80~99%: warning 색상
 * - 100% 이상: danger 색상
 *
 * @example
 * <CardSummaryCard
 *   type="credit"
 *   cardName="하나 머니 체크카드"
 *   cardNumber="1234 **** **** 5678"
 *   amount={480000}
 *   limitAmount={600000}
 *   badgeText="포인트 적립"
 *   actions={<Button size="sm" variant="outline">결제내역</Button>}
 * />
 */
import React from 'react';
import { cn } from '@lib/cn';
import type { CardSummaryCardProps, CardType } from './types';

/** 원화 금액 포맷터 */
const krwFormatter = new Intl.NumberFormat('ko-KR');

/** type별 기본 금액 레이블 */
const defaultAmountLabel: Record<CardType, string> = {
  credit:  '이번달 사용금액',
  check:   '연결계좌 잔액',
  prepaid: '충전 잔액',
};

/**
 * credit 타입의 사용률(%)에 따른 금액 색상 결정.
 * - limitAmount 미전달 시 기본 색상 반환
 */
function creditAmountColor(amount: number, limitAmount?: number): string {
  if (!limitAmount || limitAmount === 0) return 'text-text-heading';
  const ratio = amount / limitAmount;
  if (ratio >= 1)   return 'text-danger';       // 한도 초과
  if (ratio >= 0.8) return 'text-warning-text'; // 80% 이상 경고
  return 'text-text-heading';
}

/** type별 금액 색상 — credit은 사용률 기반, 나머지는 고정 */
function resolveAmountColor(type: CardType, amount: number, limitAmount?: number): string {
  if (type === 'credit') return creditAmountColor(amount, limitAmount);
  return 'text-text-heading';
}

export function CardSummaryCard({
  type,
  cardName,
  cardNumber,
  amount,
  limitAmount,
  badgeText,
  onClick,
  actions,
  className,
}: CardSummaryCardProps) {
  const Tag = onClick ? 'button' : 'div';

  const amountLabel    = defaultAmountLabel[type];
  const formattedAmount = `${krwFormatter.format(amount)}원`;
  /* credit + limitAmount 있을 때 한도 표시 문자열 */
  const formattedLimit  = limitAmount != null ? `한도 ${krwFormatter.format(limitAmount)}원` : undefined;
  const amountColor     = resolveAmountColor(type, amount, limitAmount);

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
      {/* ── 상단: 카드명 + 배지 ─────────────────────────── */}
      <div className="flex items-center gap-sm mb-xs">
        <span className="text-sm font-bold text-text-heading truncate">{cardName}</span>
        {/* badgeText가 있을 때만 배지 렌더링 */}
        {badgeText && (
          <span className="shrink-0 px-sm py-0.5 rounded-full text-xs font-bold bg-brand-10 text-brand-text">
            {badgeText}
          </span>
        )}
      </div>

      {/* ── 마스킹 카드번호 ───────────────────────────────── */}
      <p className="text-xs text-text-muted mb-md font-numeric tracking-wider">{cardNumber}</p>

      {/* ── 금액 영역 ────────────────────────────────────── */}
      {/* actions 있을 때만 mb-lg 적용 — 없으면 하단 여백을 잡지 않음 */}
      <div className={cn(actions && 'mb-lg')}>
        <p className="text-xs text-text-muted mb-xs">{amountLabel}</p>
        <p
          className={cn('text-xl font-bold font-numeric tabular-nums', amountColor)}
          aria-label={`${amountLabel} ${formattedAmount}`}
        >
          {formattedAmount}
        </p>
        {/* credit + limitAmount 있을 때 한도 서브텍스트 표시 */}
        {formattedLimit && (
          <p className="text-xs text-text-muted mt-xs font-numeric">{formattedLimit}</p>
        )}
      </div>

      {/* ── 액션 버튼 슬롯 ───────────────────────────────── */}
      {actions && (
        <div
          className="flex gap-sm"
          /* 카드 자체 onClick으로 이벤트가 버블링되지 않도록 방지 */
          onClick={e => e.stopPropagation()}
        >
          {actions}
        </div>
      )}
    </Tag>
  );
}