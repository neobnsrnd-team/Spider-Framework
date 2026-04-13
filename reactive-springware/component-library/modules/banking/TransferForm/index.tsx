/**
 * @file index.tsx
 * @description 이체 폼 컴포넌트.
 *
 * 도메인 방침(6.2):
 * - 단일 페이지 폼 (Stepper 미사용)
 * - 이전 필드 완료 시 다음 필드 순차 활성화
 *   1. 받는 계좌번호 입력 → 완료 시 금액 필드 활성화
 *   2. 금액 입력 → 완료 시 메모 필드 및 이체 버튼 활성화
 * - 최종 확인은 부모 컴포넌트의 Modal/BottomSheet에서 처리
 *
 * @example
 * <TransferForm
 *   availableBalance={1234567}
 *   onSubmit={handleTransferSubmit}
 *   submitting={isTransferPending}
 * />
 */
import React, { useState, useCallback } from 'react';
import { cn } from '@lib/cn';
import type { TransferFormProps, TransferFormData } from './types';

/** 계좌번호 유효성 검사 — 숫자와 하이픈(-) 포함 7자 이상 */
function isValidAccount(value: string): boolean {
  return /^[\d-]{7,}$/.test(value.trim());
}

/** 원화 금액 포맷터 */
const krwFormatter = new Intl.NumberFormat('ko-KR');

export function TransferForm({
  availableBalance,
  onSubmit,
  submitting = false,
  className,
}: TransferFormProps) {
  const [toAccount, setToAccount] = useState('');
  const [amount,    setAmount]    = useState<number | null>(null);
  const [memo,      setMemo]      = useState('');

  /* 순차 활성화 상태 */
  const accountDone = isValidAccount(toAccount);
  const amountDone  = amount != null && amount > 0;
  const isOverMax   = availableBalance != null && amount != null && amount > availableBalance;

  const canSubmit = accountDone && amountDone && !isOverMax;

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!canSubmit || !amount) return;
      onSubmit({ toAccount: toAccount.trim(), amount, memo });
    },
    [canSubmit, toAccount, amount, memo, onSubmit],
  );

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={cn('flex flex-col gap-lg', className)}
      aria-label="이체 폼"
    >
      {/* ── 1단계: 받는 계좌번호 ───────────────────────────── */}
      <div className="flex flex-col gap-xs">
        <label htmlFor="tf-account" className="text-xs font-bold text-text-label">
          받는 계좌번호
        </label>
        <input
          id="tf-account"
          type="text"
          inputMode="numeric"
          value={toAccount}
          onChange={e => setToAccount(e.target.value)}
          placeholder="계좌번호를 입력하세요"
          aria-invalid={toAccount.length > 0 && !accountDone}
          className={cn(
            'h-14 px-standard rounded-lg border outline-none text-base font-bold text-text-heading',
            'placeholder:text-text-placeholder placeholder:font-normal',
            'transition-colors duration-150',
            toAccount.length > 0 && !accountDone
              ? 'border-danger bg-danger-surface'
              : 'border-border focus:border-brand-text bg-surface',
          )}
        />
        {toAccount.length > 0 && !accountDone && (
          <p className="text-xs text-danger-text">올바른 계좌번호를 입력해주세요</p>
        )}
      </div>

      {/* ── 2단계: 금액 — 계좌번호 완료 후 활성화 ─────────── */}
      <div
        className={cn(
          'flex flex-col gap-xs transition-opacity duration-200',
          !accountDone && 'opacity-40 pointer-events-none',
        )}
        aria-hidden={!accountDone}
      >
        <label htmlFor="tf-amount" className="text-xs font-bold text-text-label">
          이체 금액
        </label>
        <div
          className={cn(
            'relative flex items-center rounded-lg border transition-colors duration-150',
            isOverMax
              ? 'border-danger bg-danger-surface'
              : 'border-border focus-within:border-brand-text bg-surface',
          )}
        >
          <input
            id="tf-amount"
            type="text"
            inputMode="numeric"
            disabled={!accountDone}
            value={amount != null ? krwFormatter.format(amount) : ''}
            onChange={e => {
              const digits = e.target.value.replace(/\D/g, '');
              setAmount(digits === '' ? null : Number(digits));
            }}
            placeholder="금액을 입력하세요"
            aria-invalid={isOverMax}
            aria-describedby="tf-amount-helper"
            className={cn(
              'flex-1 bg-transparent outline-none h-14 px-standard',
              'text-lg font-bold font-numeric text-text-heading',
              'placeholder:text-text-placeholder placeholder:font-normal placeholder:font-sans',
            )}
          />
          {amount != null && amount > 0 && (
            <span aria-hidden="true" className="shrink-0 pr-standard text-sm text-text-muted">
              원
            </span>
          )}
        </div>
        {/* 잔액 안내 / 초과 에러 */}
        <p
          id="tf-amount-helper"
          className={cn('text-xs', isOverMax ? 'text-danger-text' : 'text-text-muted')}
        >
          {isOverMax && availableBalance != null
            ? `잔액(${krwFormatter.format(availableBalance)}원)을 초과할 수 없습니다`
            : availableBalance != null
            ? `이체 가능 금액: ${krwFormatter.format(availableBalance)}원`
            : ''}
        </p>
      </div>

      {/* ── 3단계: 메모 (선택) — 금액 완료 후 활성화 ──────── */}
      <div
        className={cn(
          'flex flex-col gap-xs transition-opacity duration-200',
          !amountDone && 'opacity-40 pointer-events-none',
        )}
        aria-hidden={!amountDone}
      >
        <label htmlFor="tf-memo" className="text-xs font-bold text-text-label">
          메모 <span className="font-normal text-text-muted">(선택)</span>
        </label>
        <input
          id="tf-memo"
          type="text"
          disabled={!amountDone}
          value={memo}
          onChange={e => setMemo(e.target.value)}
          placeholder="메모를 입력하세요"
          maxLength={50}
          className={cn(
            'h-12 px-standard rounded-lg border outline-none text-sm text-text-base',
            'placeholder:text-text-placeholder',
            'border-border focus:border-brand-text bg-surface',
            'transition-colors duration-150',
          )}
        />
      </div>

      {/* ── 이체 버튼 ─────────────────────────────────────── */}
      <button
        type="submit"
        disabled={!canSubmit || submitting}
        aria-busy={submitting}
        className={cn(
          'w-full h-14 rounded-xl text-lg font-bold',
          'bg-brand text-brand-fg shadow-brand',
          'hover:bg-brand-dark active:bg-brand-darker active:scale-[0.98]',
          'transition-all duration-150',
          'disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none',
        )}
      >
        {submitting ? '처리 중...' : '이체하기'}
      </button>
    </form>
  );
}