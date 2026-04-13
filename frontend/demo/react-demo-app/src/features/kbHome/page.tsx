/**
 * @file page.tsx
 * @description KB국민은행 홈 페이지 (Figma node-id: 1-202).
 *
 * 레이아웃 구조:
 * HomePageLayout (상단 헤더 + 스크롤 본문 + 하단 여백)
 *   ├── 인사말 텍스트          — "안녕하세요, 홍길동 님!"
 *   ├── AlertBanner (isError)  — API 오류 시에만 렌더링
 *   ├── TabNav                 — 해당금융(active) / 다른금융 / 자산관리
 *   ├── AccountSummaryCard     — KB 주거래 통장 잔액 + 이체 / ATM출금 버튼
 *   ├── 다른 금융 연결 Card    — "계좌를 연결하고 한눈에 관리하세요" + 연결하기 버튼
 *   ├── QuickMenuGrid          — 3개 퀵메뉴 (전계좌 조회 / 이체 / 내역조회)
 *   ├── BrandBanner            — "참여하면 100% 당첨! 이벤트 확인하기"
 *   └── SectionHeader + NoticeItem 목록 — "공지 및 혜택" 3개 항목
 * BottomNav                    — 자산 / 상품 / 홈 / 카드 / 챗봇 (fixed)
 *
 * 상태·이벤트: useKbHome Hook (hook.ts)
 * 데이터·변환: kbHomeRepository (repository.ts)
 * 타입 정의:   types.ts
 */
import React from 'react';
import {
  Wallet,
  ShoppingBag,
  Home,
  CreditCard,
  MessageSquare,
  ArrowRightLeft,
  List,
  Clock,
  Link2,
  Percent,
  Wrench,
  Gift,
} from 'lucide-react';
import {
  HomePageLayout,
  BottomNav,
  AccountSummaryCard,
  BrandBanner,
  QuickMenuGrid,
  Button,
  Stack,
  TabNav,
  Card,
  SectionHeader,
  NoticeItem,
  AlertBanner,
} from '@neobnsrnd-team/reactive-springware';
import { useKbHome } from './hook';
import type { KbHomeNoticeCategory } from './types';

// ── 로컬 UI 헬퍼 ──────────────────────────────────────────────────────

/** KB국민은행 로고 자리표시자 — 실제 배포 시 SVG 에셋으로 교체 */
function KbLogo() {
  return (
    <span
      aria-label="KB국민은행 로고"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 22,
        height: 22,
        borderRadius: 6,
        /* KB 브랜드 컬러: --brand-primary 토큰 참조 */
        background: 'var(--color-brand)',
        color: '#fff',
        fontSize: 10,
        fontWeight: 800,
        lineHeight: 1,
        flexShrink: 0,
      }}
    >
      KB
    </span>
  );
}

/**
 * 공지 카테고리 → 아이콘 매핑.
 * iconBgClassName 은 repository 에서 결정되며,
 * 아이콘 자체(ReactNode)는 UI 관심사이므로 page 에서 처리한다 (rules/03-component.md).
 */
const CATEGORY_ICON: Record<KbHomeNoticeCategory, React.ReactNode> = {
  housing:     <Home    className="size-4" />,  // 주택·청약
  promotion:   <Percent className="size-4" />,  // 금리 우대·이벤트
  maintenance: <Wrench  className="size-4" />,  // 서비스 점검
};

// ── 정적 UI 설정 (컴포넌트 외부에 선언하여 리렌더링 시 재생성 방지) ──────

/** 금융 구분 탭 항목 — TabNav items prop 에 전달 */
const TAB_ITEMS = [
  { id: 'mine',  label: '해당금융' },
  { id: 'other', label: '다른금융' },
  { id: 'asset', label: '자산관리' },
];

// ── 메인 컴포넌트 ─────────────────────────────────────────────────────

export function KbHomePage() {
  const {
    activeTab,
    handleTabChange,
    accountInfo,
    noticeItems,
    bannerInfo,
    isLoading,
    isError,
  } = useKbHome();

  /* ── 하단 네비게이션 탭 (정적 UI 설정) ──────────────────────────────
   * onClick 핸들러는 실제 서비스에서 navigate() 로 교체한다. */
  const bottomNavItems = [
    { id: 'asset',   icon: <Wallet        className="size-5" />, label: '자산',  onClick: () => {} },
    { id: 'product', icon: <ShoppingBag   className="size-5" />, label: '상품',  onClick: () => {} },
    { id: 'home',    icon: <Home          className="size-6" />, label: '홈',    onClick: () => {} },
    { id: 'card',    icon: <CreditCard    className="size-5" />, label: '카드',  onClick: () => {} },
    { id: 'chat',    icon: <MessageSquare className="size-5" />, label: '챗봇',  onClick: () => {} },
  ];

  /* ── 퀵메뉴 항목 (정적 UI 설정) ────────────────────────────────────
   * Figma 디자인 기준 3개: 전계좌 조회 / 이체 / 내역조회 */
  const quickMenuItems = [
    { id: 'allAccounts', icon: <List           className="size-5" />, label: '전계좌 조회', onClick: () => {} },
    { id: 'transfer',    icon: <ArrowRightLeft className="size-5" />, label: '이체',        onClick: () => {} },
    { id: 'history',     icon: <Clock          className="size-5" />, label: '내역조회',    onClick: () => {} },
  ];

  return (
    /* data-brand="kb": KB국민은행 브랜드 토큰 적용 (노란색 계열)
       data-domain="banking": 뱅킹 도메인 배경색 토큰 적용 */
    <div data-brand="kb" data-domain="banking">
      <HomePageLayout title="KB국민은행" logo={<KbLogo />} hasNotification withBottomNav>

        {/* ── 인사말 ────────────────────────────────────────
         * Figma: "안녕하세요, 홍길동님!" → 실제 서비스에서 사용자명 동적 주입 */}
        <Stack className="px-standard pt-standard pb-xs">
          <p className="text-2xl font-bold text-text-heading">안녕하세요, 홍길동 님!</p>
        </Stack>

        {/* ── 에러 배너 (API 실패 시에만 표시) ─────────────
         * isLoading / isError / 정상 순서 처리 원칙 (rules/04-state-data.md) */}
        {isError && (
          <Stack className="px-standard pt-sm">
            <AlertBanner intent="danger">
              홈 정보를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
            </AlertBanner>
          </Stack>
        )}

        {/* ── 금융 구분 탭 (해당금융 / 다른금융 / 자산관리) ─ */}
        <Stack className="px-standard pt-sm">
          <TabNav
            items={TAB_ITEMS}
            activeId={activeTab}
            onTabChange={handleTabChange}
            variant="underline"
            fullWidth
          />
        </Stack>

        {/* ── KB 주거래 통장 요약 카드 ──────────────────────
         * accountInfo 는 로딩 완료 후 주입되므로 null 체크 필수 */}
        {accountInfo && (
          <Stack className="px-standard pt-sm">
            <AccountSummaryCard
              type={accountInfo.type}
              accountName={accountInfo.accountName}
              accountNumber={accountInfo.accountNumber}
              balance={accountInfo.balance}
              badgeText={accountInfo.badgeText}
              moreButton="ellipsis"
              actions={
                <>
                  {/* ATM출금: Figma 원본 기준 outline 버튼 */}
                  <Button variant="outline" size="sm" onClick={() => {}}>
                    ATM출금
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<ArrowRightLeft className="size-3.5" />}
                    onClick={() => {}}
                  >
                    이체
                  </Button>
                </>
              }
            />
          </Stack>
        )}

        {/* ── 다른 금융 연결 유도 카드 ──────────────────────
         * Figma: 브랜드 컬러 배경의 CTA 카드. "다른 금융 계좌를 연결하고 한눈에 관리하세요" */}
        <Stack className="px-standard pt-sm">
          <Card className="bg-brand-5 border-brand-10">
            <Stack gap="sm">
              <Stack gap="xs">
                <p className="text-sm font-bold text-brand-text flex items-center gap-xs">
                  <Link2 className="size-4 shrink-0" aria-hidden="true" />
                  다른 금융 연결
                </p>
                <p className="text-xs text-text-secondary">
                  다른 금융 계좌를 연결하고 한눈에 관리하세요
                </p>
              </Stack>
              <div className="flex justify-end">
                <Button variant="primary" size="sm" onClick={() => {}}>
                  연결하기
                </Button>
              </div>
            </Stack>
          </Card>
        </Stack>

        {/* ── 퀵메뉴 그리드 (3열 × 1행) ────────────────── */}
        <Stack className="px-standard pt-standard">
          <QuickMenuGrid items={quickMenuItems} cols={3} />
        </Stack>

        {/* ── KB 이벤트 배너 ────────────────────────────────
         * bannerInfo 는 로딩 완료 후 주입되므로 null 체크 필수 */}
        {bannerInfo && (
          <Stack className="px-standard pt-standard">
            <BrandBanner
              subtitle={bannerInfo.subtitle}
              title={bannerInfo.title}
              icon={<Gift className="size-5 text-white" />}
              onClick={() => {}}
            />
          </Stack>
        )}

        {/* ── 공지 및 혜택 섹션 ─────────────────────────────
         * 로딩 중이거나 항목이 없으면 섹션 자체를 숨긴다. */}
        {!isLoading && noticeItems.length > 0 && (
          <Stack className="px-standard pt-standard pb-standard">
            <SectionHeader
              title="공지 및 혜택"
              actionLabel="더보기"
              onAction={() => {}}
            />
            <Stack className="mt-sm">
              {noticeItems.map((item, index) => (
                <NoticeItem
                  key={item.id}
                  icon={CATEGORY_ICON[item.category]}
                  iconBgClassName={item.iconBgClassName}
                  title={item.title}
                  description={item.description}
                  /* 마지막 항목은 구분선 제거 */
                  showDivider={index < noticeItems.length - 1}
                  onClick={() => {}}
                />
              ))}
            </Stack>
          </Stack>
        )}

      </HomePageLayout>

      {/* ── 하단 고정 탭바 ────────────────────────────────
       * withBottomNav=true 가 본문에 pb-nav 여백을 자동 확보한다. */}
      <BottomNav items={bottomNavItems} activeId="home" />
    </div>
  );
}
