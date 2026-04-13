/**
 * @file index.tsx
 * @description 섹션 단위 레이아웃 컴포넌트.
 * SectionHeader(제목 + 액션)와 콘텐츠 영역을 수직으로 묶어
 * 페이지 내 반복되는 섹션 패턴을 하나의 컴포넌트로 표현한다.
 *
 * title이 없는 경우 SectionHeader 없이 콘텐츠만 수직 배치한다.
 * 내부 간격은 gap prop으로 제어한다.
 *
 * @param title       - 섹션 제목 (SectionHeader 노출 여부 결정)
 * @param badge       - 제목 옆 숫자 배지
 * @param actionLabel - 우측 액션 링크 텍스트 (예: '전체보기')
 * @param onAction    - 액션 클릭 핸들러
 * @param children    - 섹션 내부 콘텐츠
 * @param gap         - 항목 간 간격 토큰. 기본: 'md'
 * @param className   - 추가 Tailwind 클래스
 *
 * @example
 * // 제목 + 콘텐츠
 * <Section title="보유 계좌" actionLabel="전체보기" onAction={handleViewAll}>
 *   <AccountSummaryCard ... />
 * </Section>
 *
 * @example
 * // 제목 없이 콘텐츠만 수직 배치
 * <Section gap="sm">
 *   <SearchInput />
 *   <TransactionList items={data} />
 * </Section>
 */
import React from 'react';
import { cn } from '@lib/cn';
import { SectionHeader } from '../../modules/common/SectionHeader';
import type { SectionProps } from './types';

export type { SectionProps } from './types';

// gap 토큰 → Tailwind 클래스 매핑
const gapMap: Record<NonNullable<SectionProps['gap']>, string> = {
  xs: 'gap-xs',
  sm: 'gap-sm',
  md: 'gap-md',
  lg: 'gap-lg',
  xl: 'gap-xl',
};

export function Section({
  title,
  badge,
  actionLabel,
  onAction,
  children,
  gap = 'md',
  className,
}: SectionProps) {
  return (
    <div className={cn('flex flex-col', gapMap[gap], className)}>
      {/* title이 전달된 경우에만 SectionHeader 렌더링 */}
      {title && (
        <SectionHeader
          title={title}
          badge={badge}
          actionLabel={actionLabel}
          onAction={onAction}
        />
      )}
      {children}
    </div>
  );
}
