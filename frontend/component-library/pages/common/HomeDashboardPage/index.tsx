/**
 * @file index.tsx
 * @description 홈 대시보드 페이지 컴포넌트.
 *
 * Figma 원본:
 *   - 해당금융 탭 (node-id: 1-202) — 계좌 카드 + 소형 연결 유도 배너
 *   - 다른금융 탭 (node-id: 1-336) — 계좌 미연결 빈상태 카드
 *
 * 실제 앱 구현 시 주의사항:
 * - activeTab, onTabChange는 useHomeDashboard 훅에서 받아 주입한다.
 * - 계좌 데이터(AccountSummaryCard props)는 useAccountList 훅에서 주입한다.
 * - 공지 데이터(NoticeItem props)는 useNoticeList 훅에서 주입한다.
 *
 * @param activeTab   - 현재 활성 탭
 * @param onTabChange - 탭 전환 핸들러
 */
import React from 'react';
import {
  User,
  Bell,
  Menu,
  Link2,
  ListChecks,
  ArrowLeftRight,
  ClipboardList,
  Home as HomeOutline,
  TrendingUp,
  Settings,
  Building2,
  PieChart,
  Package,
  CreditCard,
  MessageCircle,
} from 'lucide-react';

/* ── Layout ──────────────────────────────────────────────────── */
import { HomePageLayout } from '../../../layout/HomePageLayout';
import { BottomNav } from '../../../layout/BottomNav';
import { Stack } from '../../../layout/Stack';
import { Inline } from '../../../layout/Inline';

/* ── Core ────────────────────────────────────────────────────── */
import { Typography } from '../../../core/Typography';
import { Button } from '../../../core/Button';

/* ── Modules ─────────────────────────────────────────────────── */
import { TabNav } from '../../../modules/common/TabNav';
import { Card } from '../../../modules/common/Card';
import { EmptyState } from '../../../modules/common/EmptyState';
import { BannerCarousel } from '../../../biz/common/BannerCarousel';
import { SectionHeader } from '../../../modules/common/SectionHeader';
import { NoticeItem } from '../../../modules/common/NoticeItem';

/* ── Biz ─────────────────────────────────────────────────────── */
import { AccountSummaryCard } from '../../../biz/banking/AccountSummaryCard';
import { QuickMenuGrid } from '../../../biz/common/QuickMenuGrid';

import type { HomeDashboardPageProps, HomeTab } from './types';

export type { HomeDashboardPageProps, HomeTab } from './types';

// ── 상수 ──────────────────────────────────────────────────────

/** 탭 네비게이션 항목 */
const TAB_ITEMS = [
  { id: 'mine', label: '해당금융' },
  { id: 'other', label: '다른금융' },
  { id: 'asset', label: '자산관리' },
];

/** 퀵 액션 그리드 항목 — 두 탭 모두 공통 */
const QUICK_MENU_ITEMS = [
  {
    id: 'all-accounts',
    icon: <ListChecks size={20} />,
    label: '전계좌 조회',
    onClick: () => console.log('전계좌 조회'),
  },
  {
    id: 'transfer',
    icon: <ArrowLeftRight size={20} />,
    label: '이체',
    onClick: () => console.log('이체'),
  },
  {
    id: 'history',
    icon: <ClipboardList size={20} />,
    label: '내역조회',
    onClick: () => console.log('내역조회'),
  },
];

/** 프로모션 배너 항목 */
const BANNER_ITEMS = [
  {
    id: 'promo-event',
    title: '참여하면 100% 당첨!',
    description: '이벤트 확인하기 →',
    variant: 'promo' as const,
    onClick: () => console.log('배너 클릭'),
  },
];

/** 하단 탭바 항목 */
const BOTTOM_NAV_ITEMS = [
  {
    id: 'asset',
    icon: <PieChart size={20} />,
    label: '자산',
    onClick: () => console.log('자산'),
  },
  {
    id: 'product',
    icon: <Package size={20} />,
    label: '상품',
    onClick: () => console.log('상품'),
  },
  {
    id: 'home',
    icon: <HomeOutline size={24} />,
    label: '홈',
    onClick: () => console.log('홈'),
  },
  {
    id: 'card',
    icon: <CreditCard size={20} />,
    label: '카드',
    onClick: () => console.log('카드'),
  },
  {
    id: 'chat',
    icon: <MessageCircle size={20} />,
    label: '챗봇',
    onClick: () => console.log('챗봇'),
  },
];

// ── 헤더 우측 액션 ─────────────────────────────────────────────

/**
 * 헤더 우측 아이콘 버튼 그룹.
 * - 내 정보(User), 알림(Bell + 빨간 배지), 전체 메뉴(Menu)
 * HomePageLayout의 rightAction 슬롯에 전달한다.
 */
function HeaderRightActions() {
  return (
    <Inline gap="xs" align="center">
      {/* 내 정보 */}
      <Button
        variant="ghost" size="sm" iconOnly aria-label="내 정보"
        leftIcon={<User size={16} aria-hidden="true" />}
      />

      {/* 알림 — 빨간 배지 표시 */}
      <div className="relative">
        {/* iconOnly 모드에서는 icon을 leftIcon prop으로 전달해야 렌더링됨 */}
        <Button
          variant="ghost" size="sm" iconOnly aria-label="알림 (새 알림 있음)"
          leftIcon={<Bell size={16} aria-hidden="true" />}
        />
        {/* 빨간 알림 배지 — 새 알림 존재 시 표시 */}
        <span
          aria-hidden="true"
          className="absolute top-1 right-1 size-2 rounded-full bg-danger border-2 border-surface"
        />
      </div>

      {/* 전체 메뉴 */}
      <Button
        variant="ghost" size="sm" iconOnly aria-label="전체 메뉴"
        leftIcon={<Menu size={18} aria-hidden="true" />}
      />
    </Inline>
  );
}

// ── 탭별 콘텐츠 컴포넌트 ─────────────────────────────────────

/**
 * 해당금융 탭 (node-id: 1-202).
 * 계좌 요약 카드 + 다른 금융 연결 유도 소형 배너.
 */
function MyBankingContent() {
  return (
    <Stack gap="md">
      {/* 계좌 요약 카드 */}
      <AccountSummaryCard
        type="deposit"
        accountName="하나 주거래 통장"
        accountNumber="123-456-789012"
        balance={2500000}
        moreButton="chevron"
        onMoreClick={() => console.log('계좌 상세')}
        actions={
          /* Inline 래퍼 없이 직접 전달 — AccountSummaryCard 내부 [&>*]:flex-1 로 균등 배치 */
          <>
            <Button
              variant="primary"
              size="sm"
              onClick={() => console.log('이체')}
            >
              이체
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => console.log('ATM출금')}
            >
              ATM출금
            </Button>
          </>
        }
      />

      {/* 다른 금융 연결 유도 소형 배너
          bg-brand-5 / border-brand-10: twMerge로 Card 기본 bg-surface / border-border-subtle를 override */}
      <Card className="bg-brand-5 border-brand-10 shadow-none rounded-3xl">
        <Inline justify="between" align="center" gap="md">
          <Stack gap="xs" className="flex-1">
            <Typography variant="body-sm" color="secondary">
              다른 금융 계좌를 연결하고
            </Typography>
            <Typography variant="body-sm" color="secondary">
              한눈에 관리하세요
            </Typography>
          </Stack>
          <Button variant="primary" size="sm" onClick={() => console.log('연결하기')}>
            연결하기
          </Button>
        </Inline>
      </Card>
    </Stack>
  );
}

/**
 * 다른금융 탭 (node-id: 1-336).
 * 계좌 미연결 시 표시하는 빈상태 카드.
 * 점선 테두리(border-dashed) + 아이콘 + 텍스트 + 연결하기 버튼.
 */
function OtherBankingContent() {
  return (
    /* border-dashed: twMerge로 Card 기본 border-border-subtle solid를 dashed로 override */
    <Card className="border-dashed bg-surface-raised shadow-none">
      <EmptyState
        illustration={
          /* 흰 원형 배경 위에 연결 아이콘 — Figma 원본 구조 재현 */
          <span className="flex items-center justify-center size-16 rounded-full bg-surface shadow-sm">
            <Link2 size={24} className="text-brand-text" aria-hidden="true" />
          </span>
        }
        title="다른 금융 계좌를 연결하고 한눈에 관리하세요"
        action={
          <Button variant="primary" onClick={() => console.log('연결하기')}>
            연결하기
          </Button>
        }
      />
    </Card>
  );
}

/**
 * 자산관리 탭.
 * Figma 미제공 화면 — 추후 구현 예정. EmptyState로 임시 표시.
 */
function AssetManagementContent() {
  return (
    <EmptyState
      title="자산관리 서비스 준비 중"
      description="곧 더 나은 자산관리 기능을 만나보실 수 있어요"
    />
  );
}

/**
 * 공지 및 혜택 섹션 — 두 탭 공통.
 * SectionHeader + NoticeItem 3개로 구성.
 */
function NoticeSection() {
  return (
    <Stack gap="sm">
      <SectionHeader
        title="공지 및 혜택"
        actionLabel="더보기"
        onAction={() => console.log('공지 더보기')}
      />

      <Stack gap="xs">
        {/* 주택청약 — 녹색 배경 (success-surface) */}
        <NoticeItem
          icon={<HomeOutline size={16} />}
          iconBgClassName="bg-success-surface text-success-text"
          title="주택청약 종합저축 안내"
          description="내 집 마련의 첫걸음을 시작하세요"
          onClick={() => console.log('주택청약 클릭')}
        />

        {/* 금리 우대 — 파란 배경 (info-surface) */}
        <NoticeItem
          icon={<TrendingUp size={16} />}
          iconBgClassName="bg-info-surface text-info-text"
          title="금리 우대 적금 홍보"
          description="최대 연 5.0% 금리 혜택!"
          onClick={() => console.log('금리 우대 클릭')}
        />

        {/* 서비스 점검 — 회색 배경 (surface-raised) / 마지막 항목이므로 구분선 제거 */}
        <NoticeItem
          icon={<Settings size={16} />}
          iconBgClassName="bg-surface-raised text-text-muted"
          title="서비스 점검 공지사항"
          description="안정적인 서비스 제공을 위한 점검 안내"
          onClick={() => console.log('공지 클릭')}
          showDivider={false}
        />
      </Stack>
    </Stack>
  );
}

// ── 메인 페이지 컴포넌트 ──────────────────────────────────────

export function HomeDashboardPage({ activeTab, onTabChange }: HomeDashboardPageProps) {
  return (
    <HomePageLayout
      title="Hana Bank"
      /* 건물 아이콘 — Figma 원본의 하나은행 로고 영역을 근사치로 표현 */
      logo={<Building2 size={20} className="text-brand-text" aria-hidden="true" />}
      rightAction={<HeaderRightActions />}
      withBottomNav
    >
      {/* ── 인사 텍스트 ─────────────────────────────────── */}
      <div className="px-standard pt-xl pb-md">
        <Typography as="h2" variant="heading" color="heading">
          안녕하세요, 김하나님!
        </Typography>
      </div>

      {/* ── 탭 네비게이션 ────────────────────────────────── */}
      <TabNav
        items={TAB_ITEMS}
        activeId={activeTab}
        onTabChange={(id) => onTabChange(id as HomeTab)}
        className="px-standard"
      />

      {/* ── 탭별 콘텐츠 영역 + 공통 하단 섹션 ────────────── */}
      <Stack gap="md" className="px-standard py-lg">
        {/* 탭별 콘텐츠 — 조건부 렌더링 */}
        {activeTab === 'mine' && <MyBankingContent />}
        {activeTab === 'other' && <OtherBankingContent />}
        {activeTab === 'asset' && <AssetManagementContent />}

        {/* 퀵 액션 그리드 — 모든 탭 공통 */}
        <QuickMenuGrid cols={3} items={QUICK_MENU_ITEMS} />

        {/* 프로모션 배너 — 모든 탭 공통 */}
        <BannerCarousel items={BANNER_ITEMS} />

        {/* 공지 및 혜택 — 모든 탭 공통 */}
        <NoticeSection />
      </Stack>

      {/* ── 하단 고정 탭바 ───────────────────────────────────
          fixed position이므로 children 내부 어느 위치에 두어도 화면 하단에 고정됨.
          HomePageLayout의 withBottomNav=true가 자동으로 pb-nav 여백을 처리함 */}
      <BottomNav activeId="home" items={BOTTOM_NAV_ITEMS} />
    </HomePageLayout>
  );
}