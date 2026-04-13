/**
 * @file index.tsx
 * @description 카드 컴포넌트 및 서브 컴포넌트 (CardHeader, CardRow).
 * onClick 전달 시 <button>으로 렌더링되어 접근성을 보장한다.
 * interactive prop으로 hover 인터랙션을 독립적으로 제어할 수 있다.
 *
 * @example
 * <Card onClick={handleCardClick} interactive>
 *   <CardHeader title="급여 통장" subtitle="하나은행" />
 *   <CardRow label="잔액" value="1,234,567원" valueClassName="text-brand-text" />
 * </Card>
 */
import React from 'react';
import { cn } from '@lib/cn';
import type { CardProps, CardHeaderProps, CardRowProps, CardActionRowProps, CardHighlightProps } from './types';

export function Card({ children, className, onClick, interactive = false, noPadding = false }: CardProps) {
  /* onClick이 있으면 <button>으로 렌더링하여 키보드 접근성 확보 */
  const Tag = onClick ? 'button' : 'div';

  return (
    <Tag
      onClick={onClick}
      className={cn(
        'w-full text-left',
        'bg-surface rounded-xl',
        'border border-border-subtle shadow-sm',
        /* noPadding: CardHighlight 등 전체 너비 섹션 구성 시 padding을 내부에서 직접 제어 */
        !noPadding && 'p-standard',
        /* noPadding 사용 시 overflow-hidden으로 자식 요소의 rounded 경계 처리 */
        noPadding && 'overflow-hidden',
        'transition-all duration-150 ease-in-out',
        /* 인터랙티브 상태에서만 hover/active 효과 적용 */
        (interactive || onClick) && [
          'cursor-pointer',
          'hover:border-brand hover:shadow-md',
          'active:scale-[0.99]',
        ],
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function CardHeader({ title, subtitle, action, icon }: CardHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-md mb-md last:mb-0">
      <div className="flex items-center gap-sm min-w-0">
        {icon && (
          /* 아이콘을 브랜드 배경의 원형 컨테이너에 배치 */
          <span className="shrink-0 flex items-center justify-center size-10 rounded-lg bg-brand-5 text-brand-text">
            {icon}
          </span>
        )}
        <div className="min-w-0">
          <p className="text-sm font-bold text-text-heading truncate">{title}</p>
          {subtitle && <p className="text-xs text-text-muted truncate">{subtitle}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

/** 카드 내 레이블-값 행 패턴 (예: 잔액: 1,234,567원) */
export function CardRow({ label, value, valueClassName }: CardRowProps) {
  return (
    <div className="flex items-center justify-between gap-md py-xs border-b border-border-subtle last:border-b-0">
      <span className="text-xs text-text-muted">{label}</span>
      <span className={cn('text-sm font-bold text-text-heading tabular-nums', valueClassName)}>
        {value}
      </span>
    </div>
  );
}

/**
 * 구분선 없는 레이블-값 행 패턴.
 * CardRow와 동일한 레이아웃이지만 하단 border를 렌더링하지 않는다.
 * 카드 내부 여백(padding)만으로 행 간격을 표현하고 싶을 때 사용한다.
 *
 * @example
 * <Card noPadding>
 *   <Stack gap="md" className="p-standard">
 *     <CardRowPlain label="받는 계좌"      value="국민 987-654-321012" />
 *     <CardRowPlain label="내 통장 표시"   value="점심값" />
 *     <CardRowPlain label="받는 분 통장 표시" value="김하나" />
 *   </Stack>
 *   <CardHighlight label="이체 후 잔액" value="2,900,000원" />
 * </Card>
 */
export function CardRowPlain({ label, value, valueClassName }: CardRowProps) {
  return (
    <div className="flex items-center justify-between gap-md py-xs">
      <span className="text-xs text-text-muted">{label}</span>
      <span className={cn('text-sm text-text-heading tabular-nums', valueClassName)}>
        {value}
      </span>
    </div>
  );
}

/**
 * 카드 내 레이블 + ReactNode 우측 콘텐츠 행 패턴.
 * 편집 아이콘이나 이체 버튼처럼 우측에 인터랙티브 요소가 필요한 행에 사용한다.
 */
export function CardActionRow({ label, children, className }: CardActionRowProps) {
  return (
    <div className={cn('flex items-center justify-between gap-md py-xs border-b border-border-subtle last:border-b-0', className)}>
      {/* 레이블: 최소 너비를 지정해 우측 콘텐츠와 겹치지 않도록 함 */}
      <span className="text-xs text-text-muted shrink-0 min-w-[80px]">{label}</span>
      <div className="flex items-center gap-sm">
        {children}
      </div>
    </div>
  );
}

/**
 * 구분선 없는 레이블 + ReactNode 우측 콘텐츠 행 패턴.
 * CardActionRow와 동일한 레이아웃이지만 하단 border를 렌더링하지 않는다.
 */
export function CardActionRowPlain({ label, children, className }: CardActionRowProps) {
  return (
    <div className={cn('flex items-center justify-between gap-md py-xs', className)}>
      <span className="text-xs text-text-muted shrink-0 min-w-[80px]">{label}</span>
      <div className="flex items-center gap-sm">
        {children}
      </div>
    </div>
  );
}

/**
 * 카드 하단 강조 섹션 컴포넌트.
 * 이체 후 잔액처럼 핵심 수치를 브랜드 색상 배경 위에 강조 표시할 때 사용한다.
 * Card의 noPadding prop과 함께 사용하면 카드 좌우 경계까지 꽉 채울 수 있다.
 *
 * @example
 * <Card noPadding>
 *   <Stack gap="md" className="p-standard">
 *     <CardRow label="받는 계좌" value="국민 987-654-321012" />
 *   </Stack>
 *   <CardHighlight label="이체 후 잔액" value="2,900,000원" />
 * </Card>
 */
export function CardHighlight({ label, value, valueClassName }: CardHighlightProps) {
  return (
    <div className="flex items-center justify-between gap-md px-standard py-lg border-t border-brand-10 bg-brand-5">
      {/* 레이블: 브랜드 색상으로 강조 섹션임을 시각적으로 구분 */}
      <span className="text-sm text-brand-text">{label}</span>
      <span className={cn('text-lg font-bold text-text-heading tabular-nums', valueClassName)}>
        {value}
      </span>
    </div>
  );
}