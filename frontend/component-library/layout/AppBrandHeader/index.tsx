/**
 * @file index.tsx
 * @description 앱 브랜드 로고 헤더 컴포넌트.
 * layoutType: 'no-header' 화면(로그인·온보딩)의 최상단에 배치한다.
 *
 * PageLayout의 헤더(뒤로가기 + 타이틀)와 달리 이 컴포넌트는
 * 브랜드 이니셜 배지 + 브랜드명만 중앙 정렬로 표시한다.
 * BlankPageLayout과 함께 사용하는 것을 전제로 설계되었다.
 *
 * @param brandInitial - 브랜드 이니셜 (예: 'H')
 * @param brandName    - 브랜드명 (예: '하나은행')
 * @param className    - 추가 Tailwind 클래스
 *
 * @example
 * <BlankPageLayout>
 *   <AppBrandHeader brandInitial="H" brandName="하나은행" />
 *   ...
 * </BlankPageLayout>
 */
import React from 'react';
import { cn } from '@lib/cn';
import type { AppBrandHeaderProps } from './types';

export type { AppBrandHeaderProps } from './types';

export function AppBrandHeader({
  brandInitial,
  brandName,
  className,
}: AppBrandHeaderProps) {
  return (
    <header
      className={cn(
        'flex items-center justify-center',
        /* PageLayout 헤더와 동일한 높이(h-14 = 56px)를 유지해 레이아웃 일관성 확보 */
        'h-14 px-standard',
        'bg-surface',
        className,
      )}
    >
      <div className="flex items-center gap-xs">
        {/* 브랜드 이니셜 원형 배지 — 브랜드 컬러로 채워진 24px 원 */}
        <span
          className="flex items-center justify-center size-6 rounded-full bg-brand text-brand-fg text-[10px] font-bold leading-none"
          aria-hidden="true"
        >
          {brandInitial}
        </span>

        {/* 브랜드명 — text-brand-text로 브랜드 고유 색상 적용 */}
        <span className="text-lg font-bold text-brand-text tracking-tight">
          {brandName}
        </span>
      </div>
    </header>
  );
}