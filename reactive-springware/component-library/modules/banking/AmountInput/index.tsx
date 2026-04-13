/**
 * @file index.tsx
 * @description 원화 금액 입력 전용 컴포넌트.
 * 사용자가 입력한 숫자를 Intl.NumberFormat('ko-KR')으로 실시간 포맷하여 표시한다.
 * quickAmounts prop으로 빠른 금액 선택 버튼을 제공한다.
 *
 * 핵심 동작:
 * - 내부적으로 숫자 문자열을 관리, onChange에는 number | null 전달
 * - 입력 중 쉼표(,) 제거 후 숫자만 허용
 * - 포맷 표시는 input 우측에 별도 텍스트로 표시 (input 자체는 숫자만)
 *
 * @example
 * const [amount, setAmount] = useState<number | null>(null);
 * <AmountInput
 *   value={amount}
 *   onChange={setAmount}
 *   label="이체 금액"
 *   quickAmounts={[10000, 50000, 100000, 500000]}
 *   maxAmount={accountBalance}
 * />
 */
import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@lib/cn';
import type { AmountInputProps } from './types';

/** 원화 금액 포맷터 — 컴포넌트 외부에 선언해 재생성 방지 */
const krwFormatter = new Intl.NumberFormat('ko-KR');

/** 숫자 → "1,234,567원" 형식 문자열 변환 */
function formatKRW(value: number): string {
  return `${krwFormatter.format(value)}원`;
}

/** 빠른 금액 선택용 표시 레이블 변환 (1만 이상이면 만원 단위 표기) */
function formatQuickLabel(value: number): string {
  if (value >= 100_000_000) return `${value / 100_000_000}억`;
  if (value >= 10_000)      return `${value / 10_000}만`;
  return krwFormatter.format(value);
}

export function AmountInput({
  value,
  onChange,
  label             = '금액',
  helperText,
  hasError          = false,
  quickAmounts,
  maxAmount,
  transferLimitText,
  disabled          = false,
  placeholder       = '금액을 입력하세요',
  className,
}: AmountInputProps) {
  /* 입력 필드에 표시할 raw 문자열 상태 (숫자만, 쉼표 없음) */
  const [raw, setRaw] = useState<string>(value != null ? String(value) : '');

  /* 외부 value가 변경되면 raw를 동기화 */
  useEffect(() => {
    setRaw(value != null ? String(value) : '');
  }, [value]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      /* 숫자 이외의 문자 제거 */
      const digits = e.target.value.replace(/\D/g, '');
      setRaw(digits);
      const num = digits === '' ? null : Number(digits);
      onChange(num);
    },
    [onChange],
  );

  /** 빠른 금액 버튼 클릭: 현재 값에 더하기 */
  const handleQuickAdd = useCallback(
    (amount: number) => {
      const next = (value ?? 0) + amount;
      const capped = maxAmount != null ? Math.min(next, maxAmount) : next;
      onChange(capped);
    },
    [value, maxAmount, onChange],
  );

  /* maxAmount 초과 여부 판단 */
  const isOverMax = maxAmount != null && value != null && value > maxAmount;
  const errorActive = hasError || isOverMax;

  return (
    <div className={cn('flex flex-col gap-xs', className)}>
      <label className="text-xs font-bold text-text-label">{label}</label>

      {/* 금액 입력 필드 */}
      <div
        className={cn(
          'relative flex items-center rounded-lg border transition-colors duration-150',
          errorActive
            ? 'border-danger bg-danger-surface'
            : 'border-border focus-within:border-brand-text bg-surface',
          disabled && 'opacity-50 cursor-not-allowed bg-surface-raised',
        )}
      >
        <input
          type="text"
          inputMode="numeric"
          value={raw === '' ? '' : krwFormatter.format(Number(raw))}
          onChange={handleChange}
          disabled={disabled}
          placeholder={placeholder}
          aria-label={label}
          aria-invalid={errorActive}
          aria-describedby={helperText ? 'amount-helper' : undefined}
          className={cn(
            'flex-1 bg-transparent outline-none h-14 px-standard',
            'text-lg font-bold font-numeric text-text-heading',
            'placeholder:text-text-placeholder placeholder:font-normal placeholder:font-sans',
          )}
        />
        {/* 단위 표시 */}
        {value != null && value > 0 && (
          <span aria-hidden="true" className="shrink-0 pr-standard text-sm text-text-muted">
            원
          </span>
        )}
      </div>

      {/* 선택된 금액의 한글 표시 */}
      {value != null && value > 0 && (
        <p className="text-xs text-text-muted text-right font-numeric">
          {formatKRW(value)}
        </p>
      )}

      {/* 빠른 금액 선택 버튼 */}
      {quickAmounts && quickAmounts.length > 0 && (
        <div className="flex gap-xs flex-wrap">
          {quickAmounts.map((amount) => (
            <button
              key={amount}
              type="button"
              disabled={disabled}
              onClick={() => handleQuickAdd(amount)}
              className={cn(
                'px-md py-xs rounded-lg text-xs font-bold',
                'bg-brand-5 text-brand-text',
                'hover:bg-brand-10 active:scale-[0.97]',
                'transition-all duration-100',
                'disabled:opacity-40 disabled:cursor-not-allowed',
              )}
            >
              +{formatQuickLabel(amount)}
            </button>
          ))}
        </div>
      )}

      {/* 이체 한도 안내 — transferLimitText와 이체 가능 금액 레이블을 한 행에 표시 */}
      {transferLimitText && (
        <div className="flex items-center justify-between px-xs">
          <span className="text-xs text-text-muted">이체 가능 금액</span>
          <span className="text-xs text-text-placeholder tabular-nums">
            {transferLimitText}
          </span>
        </div>
      )}

      {/* 에러/안내 메시지 */}
      {(helperText || isOverMax) && (
        <p
          id="amount-helper"
          className={cn(
            'text-xs',
            errorActive ? 'text-danger-text' : 'text-text-muted',
          )}
        >
          {isOverMax
            ? `잔액(${formatKRW(maxAmount!)})을 초과할 수 없습니다`
            : helperText}
        </p>
      )}
    </div>
  );
}