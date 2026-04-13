/**
 * @file index.tsx
 * @description 잔액 숨기기/보이기 토글 컴포넌트.
 *
 * 금액·잔액 표시 영역 우측 상단에 배치하여 사용자가 금액을 숨기거나
 * 다시 표시할 수 있도록 한다. 뱅킹·카드·보험 등 도메인에 관계없이
 * 잔액 숨김 기능이 필요한 모든 화면에서 재사용 가능하다.
 *
 * @param hidden   - true = 잔액 숨김 상태. 토글 오른쪽 활성, 레이블 "보이기"
 * @param onToggle - 토글 클릭 시 부모로 상태 전환 요청을 전달하는 핸들러
 *
 * @example
 * const [hidden, setHidden] = useState(false)
 * <BalanceToggle hidden={hidden} onToggle={() => setHidden(v => !v)} />
 */
import React from 'react'
import { cn } from '@lib/cn'
import type { BalanceToggleProps } from './types'

export function BalanceToggle({ hidden, onToggle, className }: BalanceToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={hidden ? '잔액 보이기' : '잔액 숨기기'}
      aria-pressed={hidden}
      className={cn('flex flex-col items-end gap-xs cursor-pointer', className)}
    >
      {/* 현재 상태에 따라 레이블 전환 */}
      <span className="text-[10px] font-bold tracking-widest uppercase text-text-muted select-none">
        {hidden ? '보이기' : '숨기기'}
      </span>

      {/* 토글 pill: hidden 상태에서 원이 오른쪽으로 이동 */}
      <span
        className={cn(
          'relative flex h-6 w-12 items-center rounded-full p-1',
          'transition-colors duration-150',
          /* 숨김 상태에서 브랜드 색상, 표시 상태에서 비활성 회색 */
          hidden ? 'bg-brand' : 'bg-surface-raised',
        )}
      >
        <span
          className={cn(
            'absolute size-4 rounded-full bg-surface shadow-sm',
            'transition-transform duration-150',
            hidden ? 'translate-x-6' : 'translate-x-0',
          )}
        />
      </span>
    </button>
  )
}
