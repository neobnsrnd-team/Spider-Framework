/**
 * @file index.tsx
 * @description 범용 버튼 컴포넌트.
 * variant prop으로 primary/outline/ghost/danger 스타일을 제어한다.
 * loading 상태에서는 스피너를 표시하고 버튼을 비활성화한다.
 *
 * @example
 * <Button variant="primary" size="lg" fullWidth onClick={handleSubmit}>
 *   이체하기
 * </Button>
 *
 * <Button variant="outline" loading={isPending}>
 *   처리 중...
 * </Button>
 */
import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@lib/cn';
import type { ButtonProps, ButtonGroupProps } from './types';

/** variant별 배경·텍스트·hover 스타일 */
const variantStyles: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: cn(
    'bg-brand text-brand-fg',
    'shadow-brand',
    'hover:bg-brand-dark',
    'active:bg-brand-darker active:scale-[0.98]',
    'disabled:bg-text-disabled disabled:text-surface disabled:shadow-none',
  ),
  outline: cn(
    'bg-transparent text-brand-text',
    'border border-brand',
    'hover:bg-brand-5',
    'active:bg-brand-10 active:scale-[0.98]',
    'disabled:border-border disabled:text-text-disabled',
  ),
  ghost: cn(
    'bg-transparent text-brand-text',
    'hover:bg-brand-5',
    'active:bg-brand-10 active:scale-[0.98]',
    'disabled:text-text-disabled',
  ),
  danger: cn(
    'bg-danger text-white',
    'shadow-[0px_4px_14px_-4px_rgba(225,29,72,0.4)]',
    'hover:bg-danger-dark',
    'active:bg-danger-darker active:scale-[0.98]',
    'disabled:bg-text-disabled disabled:text-surface disabled:shadow-none',
  ),
};

/** size별 높이·패딩·텍스트·간격·라운드 */
const sizeStyles: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'h-8  px-md       text-xs gap-xs rounded-lg',
  md: 'h-10 px-standard text-sm gap-sm rounded-xl',
  lg: 'h-14 px-xl       text-lg gap-sm rounded-xl',
};

/** iconOnly 모드에서는 정방형으로 고정 */
const iconOnlySizeStyles: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'size-8  rounded-lg',
  md: 'size-10 rounded-xl',
  lg: 'size-14 rounded-xl',
};

function Spinner({ size }: { size: NonNullable<ButtonProps['size']> }) {
  const dim = size === 'sm' ? 'size-3' : 'size-4';
  return <Loader2 aria-hidden="true" className={cn(dim, 'animate-spin')} />;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary', size = 'md', loading = false, iconOnly = false,
      leftIcon, rightIcon, fullWidth = false, justify = 'center',
      disabled, className, children, ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;
    const gap = size === 'sm' ? 'gap-xs' : 'gap-sm';

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading}
        className={cn(
          'relative inline-flex items-center',
          justify === 'between' ? 'justify-between' : 'justify-center',
          'font-bold select-none whitespace-nowrap cursor-pointer',
          'outline-none focus-visible:ring-brand',
          'transition-all duration-150 ease-in-out',
          variantStyles[variant],
          iconOnly ? iconOnlySizeStyles[size] : sizeStyles[size],
          fullWidth && 'w-full',
          isDisabled && 'cursor-not-allowed opacity-60',
          className,
        )}
        {...props}
      >
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center rounded-[inherit] bg-inherit">
            <Spinner size={size} />
          </span>
        )}
        {justify === 'between' ? (
          /* between 모드: leftIcon+children을 왼쪽, rightIcon을 오른쪽으로 분리 */
          <>
            <span className={cn('inline-flex items-center', gap, loading && 'invisible')}>
              {leftIcon && <span aria-hidden="true" className="shrink-0">{leftIcon}</span>}
              {!iconOnly && children}
            </span>
            {rightIcon && (
              <span aria-hidden="true" className={cn('shrink-0', loading && 'invisible')}>
                {rightIcon}
              </span>
            )}
          </>
        ) : (
          /* center 모드(기본): 모두 하나의 span으로 묶어 가운데 정렬 */
          <span className={cn('inline-flex items-center', gap, loading && 'invisible')}>
            {leftIcon && <span aria-hidden="true" className="shrink-0">{leftIcon}</span>}
            {!iconOnly && children}
            {rightIcon && <span aria-hidden="true" className="shrink-0">{rightIcon}</span>}
          </span>
        )}
      </button>
    );
  },
);
Button.displayName = 'Button';

/** 버튼 그룹: 가로로 나열하는 래퍼 */
export function ButtonGroup({ children, className }: ButtonGroupProps) {
  return (
    <div role="group" className={cn('flex gap-sm', className)}>
      {children}
    </div>
  );
}