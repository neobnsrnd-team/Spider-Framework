/**
 * @file index.tsx
 * @description 아이콘 배경 원 + 레이블 + 오른쪽 화살표로 구성된 탭 가능 액션 링크 컴포넌트.
 * 이체 완료 화면의 "카카오톡으로 공유", "자주 쓰는 계좌로 등록" 같은 보조 액션 행에 사용한다.
 *
 * @example
 * <ActionLinkItem
 *   icon={<Share2 className="size-5" />}
 *   iconBgClassName="bg-[#fee500]"
 *   label="이체 결과를 카카오톡으로 공유하기"
 *   onClick={handleShareKakao}
 * />
 *
 * <ActionLinkItem
 *   icon={<Star className="size-5 text-brand-text" />}
 *   label="자주 쓰는 계좌로 등록하기"
 *   onClick={handleSaveFavorite}
 * />
 */
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@lib/cn';
import type { ActionLinkItemProps } from './types';

/** size prop → 상하 패딩 클래스 */
const paddingClass: Record<NonNullable<ActionLinkItemProps['size']>, string> = {
  /* md(기본): 상하 16px — 카드형 단독 액션에 적합 */
  md: 'py-standard px-standard',
  /* sm: 상하 8px — showBorder=false 목록 행처럼 촘촘하게 나열할 때 적합 */
  sm: 'py-sm px-standard',
};

export function ActionLinkItem({
  icon,
  iconBgClassName,
  label,
  size = 'md',
  showBorder = true,
  onClick,
  className,
}: ActionLinkItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-standard',
        paddingClass[size],
        'bg-surface rounded-xl text-left cursor-pointer',
        'transition-all duration-150 ease-in-out active:scale-[0.99]',
        /* showBorder=true(기본): 카드 형태 — 테두리·그림자·호버 효과 적용
           showBorder=false: 목록 행 형태 — 테두리 없이 flat하게 표시 */
        showBorder
          ? 'border border-border-subtle shadow-xs hover:border-brand hover:shadow-sm'
          : 'hover:bg-surface-raised',
        className,
      )}
    >
      {/* 아이콘 배경 원
          기본: 브랜드 청록색 반투명 배경
          iconBgClassName으로 브랜드별 색상 오버라이드 가능 (예: 카카오톡 노란색) */}
      <span
        aria-hidden="true"
        className={cn(
          'shrink-0 flex items-center justify-center size-10 rounded-lg',
          iconBgClassName ?? 'bg-brand-10 text-brand-text',
        )}
      >
        {icon}
      </span>

      {/* 레이블 텍스트 — 남은 공간을 채우고 넘칠 경우 말줄임 처리 */}
      <span className="flex-1 text-sm text-text-secondary min-w-0 truncate">
        {label}
      </span>

      {/* 오른쪽 화살표 아이콘 — 탭 가능한 행임을 시각적으로 나타냄 */}
      <ChevronRight
        aria-hidden="true"
        className="shrink-0 size-3 text-text-muted"
      />
    </button>
  );
}
