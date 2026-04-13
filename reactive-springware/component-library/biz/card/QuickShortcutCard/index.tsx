/**
 * @file index.tsx
 * @description 카드 도메인 빠른 바로가기 카드 컴포넌트.
 *
 * 2열 그리드로 배치하여 "내 쿠폰", "카드 신청" 등 자주 사용하는 기능의
 * 진입점을 소형 카드 형태로 제공한다.
 * 좌측 텍스트 영역(타이틀 + 서브텍스트)과 우측 아이콘으로 구성된다.
 *
 * @param title    - 메인 타이틀 (e.g. "내 쿠폰")
 * @param subtitle - 서브 텍스트 (e.g. "3장 사용가능")
 * @param icon     - 우측 아이콘 (lucide-react ReactNode)
 * @param onClick  - 카드 클릭 핸들러
 *
 * @example
 * <Grid cols={2} gap="md">
 *   <QuickShortcutCard
 *     title="내 쿠폰"
 *     subtitle="3장 사용가능"
 *     icon={<Ticket size={19} />}
 *     onClick={() => navigate('/coupon')}
 *   />
 *   <QuickShortcutCard
 *     title="카드 신청"
 *     subtitle="맞춤형 추천"
 *     icon={<CreditCard size={21} />}
 *     onClick={() => navigate('/card/apply')}
 *   />
 * </Grid>
 */
import React from 'react';
import { cn } from '@lib/cn';
import type { QuickShortcutCardProps } from './types';

export function QuickShortcutCard({
  title,
  subtitle,
  icon,
  onClick,
  className,
}: QuickShortcutCardProps) {
  const Tag = onClick ? 'button' : 'div';

  return (
    <Tag
      onClick={onClick}
      className={cn(
        'w-full text-left',
        'flex items-center justify-between gap-md',
        'bg-surface rounded-xl',
        'border border-border-subtle shadow-sm',
        'p-lg',
        'transition-all duration-150',
        onClick && 'cursor-pointer hover:border-brand hover:shadow-md active:scale-[0.99]',
        className,
      )}
    >
      {/* 좌측: 타이틀 + 서브텍스트 */}
      <div className="flex flex-col gap-xs min-w-0">
        <span className="text-sm font-bold text-text-heading truncate">{title}</span>
        {/* 서브텍스트: 브랜드 컬러 or 뮤트 컬러는 subtitle 내용에 따라 결정 */}
        <span className="text-[10px] font-bold text-brand-text">{subtitle}</span>
      </div>

      {/* 우측: 아이콘 슬롯 */}
      {icon && <span className="shrink-0 text-text-muted">{icon}</span>}
    </Tag>
  );
}
