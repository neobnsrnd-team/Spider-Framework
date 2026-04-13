/**
 * @file index.tsx
 * @description 일반 페이지 레이아웃 컴포넌트.
 * 상단 고정 헤더(타이틀 + 뒤로가기 + 우측 액션)와 스크롤 가능한 본문 영역으로 구성된다.
 * bottomBar prop 전달 시 iOS 스타일 하단 고정 액션 바를 함께 렌더링한다.
 * layoutType: 'page' (계좌 목록·상세, 이체 폼, 이체 완료 화면 등)
 *
 * @example
 * // 기본 사용
 * <PageLayout title="이체하기" onBack={() => router.back()}>
 *   <TransferForm ... />
 * </PageLayout>
 *
 * // 하단 고정 버튼 바 포함
 * <PageLayout
 *   title="이체 완료"
 *   rightAction={<CloseButton />}
 *   bottomBar={
 *     <Inline gap="sm">
 *       <Button variant="outline" size="lg">추가 이체</Button>
 *       <Button variant="primary" size="lg" fullWidth>확인</Button>
 *     </Inline>
 *   }
 * >
 *   <SuccessHero ... />
 * </PageLayout>
 */
import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@lib/cn';
import type { PageLayoutProps } from './types';

export function PageLayout({
  title,
  onBack,
  rightAction,
  bottomBar,
  className,
  children,
  ...props
}: PageLayoutProps) {
  return (
    <div className={cn('flex flex-col min-h-dvh', className)} {...props}>
      {/* ── 상단 고정 헤더 ────────────────────────────── */}
      <header className="sticky top-0 z-sticky bg-surface border-b border-border-subtle">
        {/* relative: 타이틀 absolute 포지셔닝의 기준점 */}
        <div className="relative flex items-center h-14 px-standard">
          {/* 뒤로가기 버튼 — onBack이 전달된 경우만 렌더링 */}
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              aria-label="이전 페이지로 이동"
              className={cn(
                'flex items-center justify-center size-9 rounded-lg -ml-sm',
                'text-text-muted hover:bg-surface-raised hover:text-text-heading',
                'transition-colors duration-150',
              )}
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
          )}

          {/* 페이지 타이틀 — absolute로 헤더 전체 너비 기준 진짜 중앙 정렬.
              px-14(56px): 좌우 버튼(size-9 = 36px + 여백)과 겹치지 않도록 여백 확보.
              pointer-events-none: 절대 위치 타이틀이 좌우 버튼 클릭을 막지 않도록 처리. */}
          <h1 className="absolute inset-x-0 px-14 text-center text-base font-bold text-text-heading truncate pointer-events-none">
            {title}
          </h1>

          {/* 우측 액션 슬롯 (닫기·알림·설정 버튼 등) — ml-auto로 우측 끝에 고정 */}
          {rightAction && <div className="ml-auto shrink-0">{rightAction}</div>}
        </div>
      </header>

      {/* ── 스크롤 가능한 본문 영역 ────────────────────── */}
      {/* overflow-x-hidden: overflow-y-auto 설정 시 CSS 스펙에 의해 overflow-x도 auto로
          강제 변경되어 수평 내용이 잘릴 수 있음. 모바일 레이아웃에서 수평 스크롤은
          불필요하므로 hidden으로 명시적으로 차단한다. */}
      {/* px-standard py-md: 좌우 기본 여백 + 상하 여백 — 고객 프로젝트에서 별도 패딩 없이 바로 사용 가능 */}
      {/* flex flex-col: 자식 컴포넌트가 flex-1을 사용해 남은 높이를 채울 수 있도록 flex 컨테이너로 설정 */}
      <main className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden py-md [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
        {children}
        {/* bottomBar가 있을 때 하단 고정 바 높이만큼 spacer를 추가하여
            마지막 콘텐츠가 고정 바에 가려지지 않도록 한다 */}
        {bottomBar && <div aria-hidden="true" className="h-28 shrink-0" />}
      </main>

      {/* ── 하단 고정 액션 바 (iOS 스타일) ──────────────
          backdrop-blur: 스크롤 중에도 하단 버튼이 배경에 묻히지 않도록 처리
          fixed: 화면 하단에 항상 고정 위치 */}
      {bottomBar && (
        <div className="fixed bottom-0 left-0 right-0 z-sticky backdrop-blur-sm bg-surface/80 border-t border-border-subtle px-standard pt-standard pb-2xl">
          {bottomBar}
        </div>
      )}
    </div>
  );
}
