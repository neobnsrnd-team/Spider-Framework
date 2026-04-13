/**
 * @file index.tsx
 * @description 체크박스 컴포넌트.
 * 체크박스 입력 + 우측 레이블의 조합으로 구성된다.
 *
 * 접근성:
 * - id prop 전달 시 label htmlFor로 연결 → 레이블 클릭으로도 체크 토글 가능
 * - disabled 상태에서는 opacity로 비활성 시각화, 클릭 차단
 *
 * @example
 * const [checked, setChecked] = useState(false);
 * <Checkbox
 *   id="scheduled-transfer"
 *   checked={checked}
 *   onChange={setChecked}
 *   label="예약이체"
 * />
 *
 * @param checked    - 체크 상태
 * @param onChange   - 상태 변경 핸들러
 * @param label      - 우측 레이블 텍스트 또는 ReactNode
 * @param ariaLabel  - label 없을 때 스크린리더용 접근성 이름 (WCAG 필수)
 * @param disabled   - 비활성화 여부
 * @param id         - input id (label 연결용)
 */
import React, { useId } from 'react';
import { cn } from '@lib/cn';
import type { CheckboxProps } from './types';

export function Checkbox({
  checked,
  onChange,
  label,
  ariaLabel,
  shape = 'square',
  disabled = false,
  id: idProp,
  className,
}: CheckboxProps) {
  /* id prop이 없을 때 자동 생성하여 input-label 접근성 연결 보장 */
  const autoId = useId();
  const inputId = idProp ?? autoId;

  return (
    <div
      className={cn(
        'flex items-center gap-sm',
        disabled && 'opacity-50 cursor-not-allowed',
        className,
      )}
    >
      {/* 숨긴 네이티브 input — 접근성 및 폼 제출 지원 */}
      <input
        type="checkbox"
        id={inputId}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      {/* 커스텀 체크박스 UI
          - label 있음: aria-labelledby로 레이블 텍스트 참조
          - label 없음: ariaLabel prop을 aria-label로 적용 (WCAG — 접근성 이름 필수) */}
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        aria-labelledby={label ? `${inputId}-label` : undefined}
        aria-label={!label ? ariaLabel : undefined}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={cn(
          /* shape prop에 따라 사각형(rounded-xs) 또는 원형(rounded-full) 적용 */
          'shrink-0 size-4 border transition-colors duration-150',
          shape === 'circle' ? 'rounded-full' : 'rounded-xs',
          'flex items-center justify-center',
          checked ? 'bg-brand-text border-brand-text' : 'bg-surface border-border',
          !disabled && 'hover:border-brand-text cursor-pointer',
          disabled && 'cursor-not-allowed',
        )}
      >
        {/* 체크 아이콘 — checked 상태일 때만 표시 */}
        {checked && (
          <svg viewBox="0 0 12 10" fill="none" className="size-2.5" aria-hidden="true">
            <path
              d="M1 5L4.5 8.5L11 1.5"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {/* 레이블 — htmlFor로 숨긴 input과 연결되어 클릭 시 체크 토글
          onClick 핸들러 없이 브라우저 기본 동작(htmlFor)에만 의존한다. */}
      {label && (
        <label
          id={`${inputId}-label`}
          htmlFor={inputId}
          className={cn(
            'text-sm text-text-secondary select-none',
            !disabled && 'cursor-pointer',
            disabled && 'cursor-not-allowed',
          )}
        >
          {label}
        </label>
      )}
    </div>
  );
}
