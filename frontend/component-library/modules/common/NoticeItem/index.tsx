/**
 * @file index.tsx
 * @description 공지·혜택 목록 항목 컴포넌트.
 * 아이콘 배경 원(좌) + 제목·부제목(중) + 오른쪽 화살표(우)로 구성된 탭 가능 행.
 * 홈 화면 "공지 및 혜택" 섹션의 개별 항목에 사용한다.
 *
 * @example
 * <NoticeItem
 *   icon={<Home className="size-4" />}
 *   iconBgClassName="bg-[#ecfdf5] text-success-text"
 *   title="주택청약 종합저축 안내"
 *   description="내 집 마련의 첫걸음을 시작하세요"
 *   onClick={handleNoticeClick}
 * />
 */
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@lib/cn';
import type { NoticeItemProps } from './types';

export function NoticeItem({
  icon,
  iconBgClassName,
  title,
  description,
  onClick,
  showDivider = true,
  className,
}: NoticeItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-standard p-xs text-left',
        'transition-colors duration-150',
        'hover:bg-surface-subtle active:bg-surface-raised',
        'rounded-lg',
        className,
      )}
    >
      {/* 아이콘 배경 원형 컨테이너 */}
      <span
        aria-hidden="true"
        className={cn(
          'shrink-0 flex items-center justify-center size-10 rounded-lg',
          iconBgClassName ?? 'bg-brand-5 text-brand-text',
        )}
      >
        {icon}
      </span>

      {/* 제목 + 부제목 — 하단 구분선을 텍스트 영역에만 적용하여 아이콘과 분리 */}
      <div
        className={cn(
          'flex-1 min-w-0 pb-md pt-xs',
          /* 마지막 항목이 아닐 때만 구분선 표시 */
          showDivider && 'border-b border-surface-subtle',
        )}
      >
        <p className="text-sm text-text-base leading-snug truncate">{title}</p>
        {description && (
          <p className="text-xs text-text-muted mt-0.5 truncate">{description}</p>
        )}
      </div>

      {/* 오른쪽 화살표 — 탭 가능 항목임을 시각적으로 나타냄 */}
      <ChevronRight
        aria-hidden="true"
        className="shrink-0 size-3.5 text-text-muted"
      />
    </button>
  );
}
