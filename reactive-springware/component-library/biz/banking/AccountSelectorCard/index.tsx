/**
 * @file index.tsx
 * @description 거래내역 조회 화면 상단에서 계좌를 선택·변경하는 카드 컴포넌트.
 *
 * AccountSummaryCard(잔액·액션 버튼 포함)와 구분되는 사용 시나리오:
 * - 잔액 표시 없이 계좌명·계좌번호만 노출
 * - 계좌명 클릭으로 계좌 변경 트리거 (드롭다운 화살표로 변경 가능성 표시)
 * - 우측 원형 버튼으로 계좌 관련 추가 동작 연결
 *
 * @example
 * <AccountSelectorCard
 *   accountName="하나 주거래 통장"
 *   accountNumber="123-456-789012"
 *   onAccountChange={handleOpenAccountPicker}
 *   onIconClick={handleGoToAccountDetail}
 * />
 */
import React from 'react';
import { ChevronDown, WalletMinimal } from 'lucide-react';
import { cn } from '@lib/cn';
import type { AccountSelectorCardProps } from './types';

export function AccountSelectorCard({
  accountName,
  accountNumber,
  icon,
  onAccountChange,
  onIconClick,
  iconAriaLabel = '계좌 상세',
  availableBalance,
  className,
}: AccountSelectorCardProps) {
  return (
    <div
      className={cn(
        'w-full bg-surface',
        /* Figma: 24px radius — AccountSummaryCard(12px)보다 더 둥글게 */
        'rounded-3xl',
        'border border-border-subtle shadow-sm',
        'flex items-center justify-between',
        'px-lg py-[21px]',
        className,
      )}
    >
      {/* ── 좌측: 계좌명 + 계좌번호 ─────────────────────────── */}
      <div className="flex flex-col gap-xs min-w-0">
        {/* 계좌명 영역: 클릭 시 계좌 변경 드롭다운 트리거 */}
        <button
          type="button"
          onClick={onAccountChange}
          disabled={!onAccountChange}
          className={cn(
            'flex items-center gap-sm text-left',
            onAccountChange && 'cursor-pointer',
            !onAccountChange && 'cursor-default',
          )}
          aria-label={`계좌 변경: ${accountName}`}
        >
          <span className="text-body-lg font-normal text-text-heading truncate">
            {accountName}
          </span>
          {/* onAccountChange가 있을 때만 변경 가능함을 시각적으로 표시 */}
          {onAccountChange && (
            <ChevronDown
              size={10}
              className="shrink-0 text-text-muted"
              aria-hidden="true"
            />
          )}
        </button>

        {/* 계좌번호: 브랜드 색상으로 강조 */}
        <p className="text-sm font-medium text-brand-text tabular-nums">
          {accountNumber}
        </p>

        {/* 출금가능금액 — availableBalance prop 전달 시만 표시 */}
        {availableBalance && (
          <p className="text-sm font-medium text-brand-text">
            {availableBalance}
          </p>
        )}
      </div>

      {/* ── 우측: 원형 아이콘 버튼 ──────────────────────────── */}
      <button
        type="button"
        onClick={onIconClick}
        disabled={!onIconClick}
        className={cn(
          'shrink-0 flex items-center justify-center',
          'size-12 rounded-full',
          /* Figma: rgba(0,132,133,0.1) = brand-10 */
          'bg-brand-10 text-brand-text',
          'transition-opacity duration-150',
          onIconClick && 'hover:opacity-80 active:opacity-60',
          !onIconClick && 'cursor-default',
        )}
        aria-label={iconAriaLabel}
      >
        {/* icon prop 미전달 시 WalletMinimal 아이콘을 기본으로 사용 */}
        {icon ?? <WalletMinimal size={18} aria-hidden="true" />}
      </button>
    </div>
  );
}