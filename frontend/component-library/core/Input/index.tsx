/**
 * @file index.tsx
 * @description 범용 텍스트 입력 컴포넌트.
 * label, helperText, validationState, leftIcon, rightElement을 지원한다.
 * 에러 상태에서는 테두리와 helperText가 danger 색상으로 변경된다.
 *
 * @example
 * <Input
 *   label="받는 계좌번호"
 *   placeholder="계좌번호를 입력하세요"
 *   validationState={error ? 'error' : 'default'}
 *   helperText={error || '숫자만 입력해주세요'}
 *   fullWidth
 * />
 */
import React from 'react';
import { cn } from '@lib/cn';
import type { InputProps, InputValidationState } from './types';

/**
 * 한국 휴대폰번호 포맷을 자릿수에 따라 동적으로 적용한다.
 * - ~7자리  : XXX-X...       (중간 구분자만)
 * - 8~10자리: XXX-XXX-XXXX   (3-3-4)
 * - 11자리  : XXX-XXXX-XXXX  (3-4-4)
 * 최대 11자리까지 허용하며, 숫자 이외 입력은 무시한다.
 */
function applyPhoneFormat(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 3)  return digits;
  if (digits.length <= 7)  return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  if (digits.length <= 10) return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  /* 11자리: 010-XXXX-XXXX */
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

/**
 * formatPattern의 '#' 자리에 숫자를 순서대로 채워 포맷 문자열을 반환한다.
 * - '#' 이외의 문자(예: '-')는 구분자로 그대로 삽입된다.
 * - 패턴의 '#' 개수를 초과하는 숫자는 잘린다.
 *
 * @example
 * applyFormat('01234567890123', '###-######-#####')
 * // → '012-345678-90123'
 */
function applyFormat(raw: string, pattern: string): string {
  /* 숫자만 추출 */
  const digits = raw.replace(/\D/g, '');
  /* 패턴의 최대 자릿수만큼만 허용 */
  const maxDigits = (pattern.match(/#/g) ?? []).length;
  const limited = digits.slice(0, maxDigits);

  let result = '';
  let digitIndex = 0;
  for (const char of pattern) {
    if (digitIndex >= limited.length) break;
    if (char === '#') {
      result += limited[digitIndex++];
    } else {
      /* 구분자: 다음에 표시할 숫자가 남아있을 때만 삽입 (trailing separator 방지) */
      result += char;
    }
  }
  return result;
}

/** validationState별 입력 필드 테두리/배경 스타일 */
const fieldStyles: Record<InputValidationState, string> = {
  default: 'border-border focus-within:border-brand-text bg-surface',
  error:   'border-danger   bg-danger-surface',
  success: 'border-success  bg-success-surface',
};

/** validationState별 helperText 색상 */
const helperStyles: Record<InputValidationState, string> = {
  default: 'text-text-muted',
  error:   'text-danger-text',
  success: 'text-success-text',
};

/** size별 높이·패딩·텍스트 크기 */
const sizeStyles: Record<NonNullable<InputProps['size']>, string> = {
  md: 'h-12 px-md text-sm',
  lg: 'h-14 px-standard text-base',
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label, helperText, validationState = 'default',
      size = 'md', leftIcon, rightElement, fullWidth = false,
      id, className, disabled, formatPattern, phoneFormat, onChange, value, ...props
    },
    ref,
  ) => {
    /* label과 input을 연결할 id (prop으로 받거나 내부 생성) */
    const inputId = id ?? `input-${Math.random().toString(36).slice(2, 9)}`;

    /* phoneFormat > formatPattern 우선순위로 표시값에 포맷 적용 */
    const displayValue = (() => {
      if (value === undefined) return value;
      const raw = String(value);
      if (phoneFormat)    return applyPhoneFormat(raw);
      if (formatPattern)  return applyFormat(raw, formatPattern);
      return value;
    })();

    /**
     * phoneFormat / formatPattern이 있을 때 onChange를 가로채 포맷된 값으로 교체한다.
     * e.target.value를 직접 수정해 부모 핸들러가 포맷된 문자열을 받도록 한다.
     */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!onChange) return;
      if (phoneFormat) {
        e.target.value = applyPhoneFormat(e.target.value);
      } else if (formatPattern) {
        e.target.value = applyFormat(e.target.value, formatPattern);
      }
      onChange(e);
    };

    return (
      <div className={cn('flex flex-col gap-xs', fullWidth && 'w-full', className)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-bold text-text-label"
          >
            {label}
          </label>
        )}

        {/* 입력 필드 컨테이너 — 테두리와 아이콘 슬롯을 포함 */}
        <div
          className={cn(
            'relative flex items-center rounded-lg border transition-colors duration-150',
            fieldStyles[validationState],
            disabled && 'opacity-50 cursor-not-allowed bg-surface-raised',
            fullWidth && 'w-full',
          )}
        >
          {leftIcon && (
            <span aria-hidden="true" className="shrink-0 pl-md text-text-muted">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-invalid={validationState === 'error'}
            aria-describedby={helperText ? `${inputId}-helper` : undefined}
            /* phoneFormat / formatPattern 사용 시: 포맷된 값으로 표시, inputMode를 numeric으로 고정 */
            value={displayValue}
            onChange={handleChange}
            inputMode={phoneFormat || formatPattern ? 'numeric' : props.inputMode}
            className={cn(
              'flex-1 bg-transparent outline-none placeholder:text-text-placeholder text-text-base',
              sizeStyles[size],
              /* leftIcon이 있으면 좌측 패딩 제거 (컨테이너 padding으로 처리) */
              leftIcon && 'pl-sm',
              /* rightElement이 있으면 우측 패딩 제거 */
              rightElement && 'pr-sm',
            )}
            {...props}
          />
          {rightElement && (
            <span className="shrink-0 pr-md">{rightElement}</span>
          )}
        </div>

        {helperText && (
          <p
            id={`${inputId}-helper`}
            className={cn('text-xs', helperStyles[validationState])}
          >
            {helperText}
          </p>
        )}
      </div>
    );
  },
);
Input.displayName = 'Input';