/**
 * @file index.tsx
 * @description 섹션 헤더 컴포넌트 — 타이틀(좌) + 선택적 액션 링크(우) 레이아웃.
 *
 * Figma의 "[제목 텍스트] [전체보기 →]" 패턴이 3곳 이상 반복되는 경우
 * 이 컴포넌트를 사용한다. (component-map.md §3.2-A)
 *
 * Figma 대응: SectionHeader (HasAction × HasBadge 4가지 variant)
 *
 * @param title - 섹션 제목 (text-xl font-bold text-text-heading)
 * @param badge - 제목 우측 배지 숫자 (number → 문자열 자동 변환. Figma에서는 고정값 '3'으로 표현)
 * @param actionLabel - 우측 액션 텍스트 (예: '전체보기'). 미전달 시 미노출
 * @param onAction - 액션 클릭 핸들러
 * @param className - 추가 Tailwind 클래스
 *
 * @example
 * // 액션 없는 단순 헤더
 * <SectionHeader title="최근 거래" />
 *
 * @example
 * // 전체보기 링크 포함
 * <SectionHeader
 *   title="보유 계좌"
 *   actionLabel="전체보기"
 *   onAction={() => navigate('/accounts')}
 * />
 */
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@lib/cn';
import type { SectionHeaderProps } from './types';

export function SectionHeader({
  title,
  badge,
  actionLabel,
  onAction,
  className,
}: SectionHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      {/* 제목 + 배지 묶음 (좌측) */}
      <div className="flex items-center gap-xs">
        {/* 섹션 제목 — text-xl(20px) font-bold */}
        <h2 className="text-xl font-bold text-text-heading">{title}</h2>
        {/* 계좌/항목 수 배지 — badge가 전달된 경우에만 노출 */}
        {badge !== undefined && (
          <span className="inline-flex items-center rounded-full px-sm py-0.5 text-xs font-bold bg-brand-10 text-brand-text">
            {badge}
          </span>
        )}
      </div>

      {/* 액션 버튼 — actionLabel이 있을 때만 렌더링 */}
      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className={cn(
            'inline-flex items-center gap-xs',
            'text-xs font-medium text-text-secondary',
            /* 호버 시 브랜드 색상으로 전환 */
            'hover:text-brand-text',
            'transition-colors duration-150',
            /* 클릭 영역 확보 (터치 최소 44px) */
            'p-xs -m-xs',
          )}
          aria-label={`${title} ${actionLabel}`}
        >
          {actionLabel}
          <ChevronRight className="size-3.5 shrink-0" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}