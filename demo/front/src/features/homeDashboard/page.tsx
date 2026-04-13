/**
 * @file page.tsx
 * @description 홈 대시보드 페이지 (Figma node-id: 1-202).
 *
 * 레이아웃 구조:
 * HomePageLayout (상단 헤더 + 스크롤 본문 + 하단 여백)
 *   ├── TabNav            — 해당금융 / 다른금융 / 자산관리 탭
 *   ├── AccountSummaryCard — 주계좌 잔액 + 이체 / ATM출금 버튼
 *   ├── BannerCarousel    — 타행 연결 유도 배너
 *   ├── QuickMenuGrid     — 전계좌조회 / 이체 / 내역조회 (3열)
 *   └── NoticeItem × N   — 공지 및 혜택 목록
 * BottomNav               — 자산 / 상품 / 홈 / 카드 / 챗봇 (fixed)
 *
 * 데이터·이벤트 출처: useHomeDashboard Hook (hook.ts)
 */
import {
  Wallet,
  ShoppingBag,
  Home,
  CreditCard,
  MessageSquare,
  ArrowRightLeft,
  CreditCard as AtmIcon,
  Search,
  Clock,
  Bell,
} from 'lucide-react';
import {
  HomePageLayout,
  TabNav,
  NoticeItem,
  BottomNav,
  AccountSummaryCard,
  BannerCarousel,
  QuickMenuGrid,
  Button,
  SectionHeader,
  Card,
  Stack,
} from '@neobnsrnd-team/reactive-springware';
import { useHomeDashboard } from './hook';

/** 하나은행 로고 자리표시자 — 실제 배포 시 SVG 에셋으로 교체 */
function HanaLogo() {
  return (
    <span
      aria-label="하나은행 로고"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 22,
        height: 22,
        borderRadius: 6,
        background: 'var(--color-brand)',
        color: '#fff',
        fontSize: 11,
        fontWeight: 800,
        lineHeight: 1,
        letterSpacing: '-0.5px',
        flexShrink: 0,
      }}
    >
      H
    </span>
  );
}

export function HomeDashboardPage() {
  const {
    data,
    activeTab,
    activeBottomTab,
    handleTabChange,
    handleBottomNavChange,
    handleTransfer,
    handleAtmWithdraw,
    handleAllAccounts,
    handleQuickTransfer,
    handleHistory,
    handleConnectionBanner,
    handleNoticeClick,
    handleNotification,
  } = useHomeDashboard();

  /** 하단 네비게이션 탭 항목 */
  const bottomNavItems = [
    {
      id: 'asset',
      icon: <Wallet className="size-5" />,
      label: '자산',
      onClick: () => handleBottomNavChange('asset'),
    },
    {
      id: 'product',
      icon: <ShoppingBag className="size-5" />,
      label: '상품',
      onClick: () => handleBottomNavChange('product'),
    },
    {
      id: 'home',
      icon: <Home className="size-6" />,
      label: '홈',
      onClick: () => handleBottomNavChange('home'),
    },
    {
      id: 'card',
      icon: <CreditCard className="size-5" />,
      label: '카드',
      onClick: () => handleBottomNavChange('card'),
    },
    {
      id: 'chat',
      icon: <MessageSquare className="size-5" />,
      label: '챗봇',
      onClick: () => handleBottomNavChange('chat'),
    },
  ];

  /** 상단 탭 목록 */
  const tabItems = [
    { id: 'mine', label: '해당금융' },
    { id: 'other', label: '다른금융' },
    { id: 'asset', label: '자산관리' },
  ];

  /** 퀵메뉴 항목 */
  const quickMenuItems = [
    {
      id: 'all-accounts',
      icon: <Search className="size-5" />,
      label: '전계좌조회',
      onClick: handleAllAccounts,
    },
    {
      id: 'transfer',
      icon: <ArrowRightLeft className="size-5" />,
      label: '이체',
      onClick: handleQuickTransfer,
    },
    {
      id: 'history',
      icon: <Clock className="size-5" />,
      label: '내역조회',
      onClick: handleHistory,
    },
  ];

  return (
    <>
      <HomePageLayout
        title="하나은행"
        logo={<HanaLogo />}
        greeting={`${data.userName}님, 안녕하세요`}
        rightAction={
          /* Bell 아이콘 버튼 — 알림 페이지로 이동 */
          <Button
            variant="ghost"
            size="md"
            iconOnly
            leftIcon={<Bell className="size-5" />}
            onClick={handleNotification}
            aria-label="알림"
          />
        }
        withBottomNav
      >
        {/* ── 탭 네비게이션 ─────────────────────────────── */}
        <TabNav
          items={tabItems}
          activeId={activeTab}
          onTabChange={handleTabChange}
          className="px-standard"
        />

        {/* ── 주계좌 요약 카드 ──────────────────────────── */}
        <Stack gap="md" className="px-standard pt-standard">
          <AccountSummaryCard
            type="deposit"
            accountName={data.mainAccount.accountName}
            accountNumber={data.mainAccount.accountNumber}
            balance={data.mainAccount.balance}
            badgeText={data.mainAccount.badgeText}
            moreButton="chevron"
            onMoreClick={handleAllAccounts}
            actions={
              <>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<ArrowRightLeft className="size-3.5" />}
                  onClick={handleTransfer}
                >
                  이체
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<AtmIcon className="size-3.5" />}
                  onClick={handleAtmWithdraw}
                >
                  ATM출금
                </Button>
              </>
            }
          />
        </Stack>

        {/* ── 타행 연결 유도 배너 ───────────────────────── */}
        <div className="px-standard pt-standard">
          <BannerCarousel
            items={[
              {
                id: 'connection-banner',
                variant: 'info',
                title: data.connectionBanner.title,
                description: data.connectionBanner.description,
                action: (
                  <Button variant="outline" size="sm" onClick={handleConnectionBanner}>
                    {data.connectionBanner.actionLabel}
                  </Button>
                ),
              },
            ]}
          />
        </div>

        {/* ── 퀵메뉴 그리드 (3열) ──────────────────────── */}
        <div className="px-standard pt-standard">
          <Card>
            <QuickMenuGrid items={quickMenuItems} cols={3} />
          </Card>
        </div>

        {/* ── 공지 및 혜택 목록 ─────────────────────────── */}
        <div className="px-standard pt-standard pb-standard">
          <SectionHeader title="공지 및 혜택" className="pb-3" />
          <Card>
            {data.notices.map((notice, index) => (
              <NoticeItem
                key={notice.id}
                /* 마지막 항목은 구분선 제거 */
                showDivider={index < data.notices.length - 1}
                icon={<Bell className="size-4" />}
                iconBgClassName={notice.iconBgClassName}
                title={notice.title}
                description={notice.description}
                onClick={() => handleNoticeClick(notice.id)}
              />
            ))}
          </Card>
        </div>
      </HomePageLayout>

      {/* ── 하단 고정 탭바 ────────────────────────────────
       * HomePageLayout의 withBottomNav=true가 본문 하단에
       * pb-nav 여백을 자동으로 확보하므로 콘텐츠가 가려지지 않는다. */}
      <BottomNav items={bottomNavItems} activeId={activeBottomTab} />
    </>
  );
}
