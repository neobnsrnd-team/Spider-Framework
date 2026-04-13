/**
 * @file index.tsx
 * @description 아이콘 + 레이블 선택 가능 카드 타일 컴포넌트.
 *
 * Figma 원본: Hana Bank App node-id: 1:1282 (금융권 선택 화면 은행 카드)
 *
 * 선택 여부에 따라 배경·아이콘 원·텍스트 색상이 자동으로 전환된다.
 * Grid cols={2}와 함께 사용하여 2열 선택 그리드를 구성한다.
 *
 * @param icon      - 아이콘 슬롯 (lucide-react 아이콘)
 * @param label     - 표시 레이블
 * @param selected  - 선택 상태. 기본: false
 * @param onClick   - 클릭 핸들러
 * @param className - 추가 Tailwind 클래스
 *
 * @example
 * <Grid cols={2} gap="sm">
 *   <SelectableItem icon={<Building2 className="size-5" />} label="하나은행" selected onClick={...} />
 *   <SelectableItem icon={<Building2 className="size-4" />} label="KB국민은행" onClick={...} />
 * </Grid>
 */
import React from 'react';
import { cn } from '@lib/cn';
import type { SelectableItemProps } from './types';

export type { SelectableItemProps } from './types';

export function SelectableItem({ icon, label, selected = false, onClick, className }: SelectableItemProps) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      onClick={onClick}
      className={cn(
        'flex items-center gap-md p-md rounded-xl w-full text-left',
        'transition-all duration-150',
        selected
          /* 선택: 브랜드 반투명 배경 + 브랜드 테두리 */
          ? 'bg-brand-5 border border-brand-20'
          /* 미선택: 중립 배경 + 투명 테두리(레이아웃 유지용) */
          : 'bg-surface-subtle border border-transparent hover:bg-surface-raised active:bg-surface-raised',
        className,
      )}
    >
      {/* 아이콘 원형 컨테이너 — 선택 상태에 따라 배경·색상 전환 */}
      <span
        className={cn(
          'flex items-center justify-center size-10 rounded-full shrink-0',
          selected
            /* 선택: 브랜드 배경에 흰 아이콘 */
            ? 'bg-brand text-brand-fg'
            /* 미선택: 흰 배경에 회색 아이콘 */
            : 'bg-surface border border-border-subtle text-text-muted',
        )}
        aria-hidden="true"
      >
        {icon}
      </span>

      {/* 레이블 — truncate로 긴 이름 말줄임 처리 */}
      <span
        className={cn(
          'text-sm truncate',
          selected ? 'text-brand-text' : 'text-text-label',
        )}
      >
        {label}
      </span>
    </button>
  );
}
