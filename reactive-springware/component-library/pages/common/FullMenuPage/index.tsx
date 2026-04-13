/**
 * @file index.tsx
 * @description 전체 메뉴(사이트맵) 페이지 컴포넌트.
 *
 * Figma 원본: Hana Bank App node-id: 1:458
 * 홈 대시보드에서 햄버거 메뉴 클릭 시 표시되는 전체 메뉴 화면.
 *
 * 화면 구성:
 *   1. 헤더 — 홈 이동 · 로그아웃 · 닫기 버튼
 *   2. 유저 프로필 — 아바타 · 이름 · 최근 접속 · 설정 버튼
 *   3. 퀵 서비스 그리드 — 인증센터 · 고객센터 · 안심케어 · 이벤트/혜택
 *   4. 메뉴 검색 바
 *   5. 2열 네비게이션 — 좌측 카테고리 사이드바 + 우측 메뉴 목록
 *   6. 하단 브랜드 배너
 *
 * 실제 앱 구현 시 주의사항:
 * - activeCategory, onCategoryChange는 useFullMenu 훅에서 받아 주입한다.
 *
 * @param onClose          - 닫기(X) 버튼 클릭 핸들러 (전체 메뉴 오버레이 닫기)
 * @param onHome           - 홈 아이콘 버튼 클릭 핸들러 (홈 화면 이동)
 * @param onLogout         - 로그아웃 버튼 클릭 핸들러
 * @param activeCategory   - 현재 활성 카테고리
 * @param onCategoryChange - 카테고리 전환 핸들러
 */
import React from 'react';
import {
  Home,
  X,
  Search,
  ShieldCheck,
  Headphones,
  Shield,
  Gift,
  Building2,
  ClipboardList,
  ArrowLeftRight,
  Wallet,
  Banknote,
  Settings,
  RefreshCw,
  FileText,
  CreditCard,
  TrendingUp,
  Plus,
  Globe,
  Star,
} from 'lucide-react';

/* ── Layout ──────────────────────────────────────────────────── */
import { PageLayout } from '../../../layout/PageLayout';
import { Stack } from '../../../layout/Stack';
import { Inline } from '../../../layout/Inline';

/* ── Core ────────────────────────────────────────────────────── */
import { Button } from '../../../core/Button';
import { Input } from '../../../core/Input';
import { Typography } from '../../../core/Typography';

/* ── Modules ─────────────────────────────────────────────────── */
import { SidebarNav } from '../../../modules/common/SidebarNav';
import { ActionLinkItem } from '../../../modules/common/ActionLinkItem';

/* ── Biz ─────────────────────────────────────────────────────── */
import { QuickMenuGrid } from '../../../biz/common/QuickMenuGrid';
import { UserProfile } from '../../../biz/common/UserProfile';
import { BrandBanner } from '../../../biz/common/BrandBanner';

import type { FullMenuPageProps, MenuCategoryId } from './types';

export type { FullMenuPageProps, MenuCategoryId } from './types';

// ── 상수 ──────────────────────────────────────────────────────

/** 좌측 사이드바 카테고리 목록 */
const MENU_CATEGORIES = [
  { id: 'banking' as const, label: '뱅킹' },
  { id: 'management' as const, label: '관리' },
  { id: 'card' as const, label: '카드' },
  { id: 'product' as const, label: '상품가입' },
  { id: 'forex' as const, label: '외환' },
];

/** 카테고리별 메뉴 아이템 */
const MENU_ITEMS: Record<MenuCategoryId, { id: string; icon: React.ReactNode; label: string }[]> = {
  banking: [
    { id: 'home', icon: <Home size={16} />, label: '홈' },
    { id: 'all-accounts', icon: <Building2 size={16} />, label: '전계좌조회' },
    { id: 'transactions', icon: <ClipboardList size={16} />, label: '거래내역조회' },
    { id: 'transfer', icon: <ArrowLeftRight size={16} />, label: '이체' },
    { id: 'deposit-savings', icon: <Wallet size={16} />, label: '예금/적금' },
    { id: 'loan', icon: <Banknote size={16} />, label: '대출' },
  ],
  management: [
    { id: 'account-mgmt', icon: <Settings size={16} />, label: '계좌관리' },
    { id: 'auto-transfer', icon: <RefreshCw size={16} />, label: '자동이체' },
    { id: 'certificate', icon: <FileText size={16} />, label: '증명서발급' },
  ],
  card: [
    { id: 'card-history', icon: <CreditCard size={16} />, label: '카드이용내역' },
    { id: 'card-payment', icon: <Banknote size={16} />, label: '카드대금결제' },
    { id: 'card-apply', icon: <Plus size={16} />, label: '카드신청' },
  ],
  product: [
    { id: 'open-account', icon: <Wallet size={16} />, label: '통장개설' },
    { id: 'fund', icon: <TrendingUp size={16} />, label: '펀드가입' },
    { id: 'insurance', icon: <Shield size={16} />, label: '보험가입' },
  ],
  forex: [
    { id: 'exchange', icon: <ArrowLeftRight size={16} />, label: '환전' },
    { id: 'remittance', icon: <Globe size={16} />, label: '해외송금' },
    { id: 'exchange-rate', icon: <TrendingUp size={16} />, label: '환율조회' },
  ],
};

/** 퀵 서비스 그리드 항목 — 전체 메뉴 화면 상단 4개 바로가기 */
const QUICK_SERVICE_ITEMS = [
  {
    id: 'auth-center',
    icon: <ShieldCheck size={20} />,
    label: '인증센터',
    onClick: () => console.log('인증센터'),
  },
  {
    id: 'customer-center',
    icon: <Headphones size={20} />,
    label: '고객센터',
    onClick: () => console.log('고객센터'),
  },
  {
    id: 'safe-care',
    icon: <Shield size={20} />,
    label: '안심케어',
    onClick: () => console.log('안심케어'),
  },
  {
    id: 'event',
    icon: <Gift size={20} />,
    label: '이벤트/혜택',
    onClick: () => console.log('이벤트/혜택'),
  },
];

// ── 헤더 우측 액션 ─────────────────────────────────────────────

/**
 * PageLayout rightAction 슬롯에 전달할 헤더 우측 버튼 그룹.
 * 로그아웃 텍스트 버튼 + X 닫기 버튼으로 구성된다.
 */
function HeaderRightActions({
  onLogout,
  onClose,
}: {
  onLogout?: () => void;
  onClose?: () => void;
}) {
  return (
    <Inline gap="md" align="center">
      <Button variant="ghost" size="sm" onClick={onLogout}>
        로그아웃
      </Button>
      <Button
        variant="ghost"
        size="sm"
        iconOnly
        aria-label="전체 메뉴 닫기"
        leftIcon={<X size={16} aria-hidden="true" />}
        onClick={onClose}
      />
    </Inline>
  );
}

// ── 메인 페이지 컴포넌트 ──────────────────────────────────────

export function FullMenuPage({ onClose, onHome, onLogout, activeCategory, onCategoryChange }: FullMenuPageProps) {
  const currentItems = MENU_ITEMS[activeCategory];
  const currentCategory = MENU_CATEGORIES.find((c) => c.id === activeCategory);

  return (
    <PageLayout
      title=""
      /* onHome을 PageLayout 표준 뒤로가기(onBack)에 매핑 */
      onBack={onHome}
      rightAction={<HeaderRightActions onLogout={onLogout} onClose={onClose} />}
    >
      {/* 유저 프로필 */}
      <UserProfile
        name="김하나님"
        lastLogin="2026.01.01 10:30:15"
        onProfileManageClick={() => console.log('내 정보 관리')}
        onLogoutClick={() => console.log('로그아웃')}
      />

      {/* 퀵 서비스 그리드 */}
      <div className="px-standard py-sm">
        <QuickMenuGrid cols={4} items={QUICK_SERVICE_ITEMS} />
      </div>

      {/* 메뉴 검색 바 */}
      <div className="px-standard py-sm">
        <Input
          placeholder="궁금하신 메뉴를 검색해 보세요"
          leftIcon={<Search className="size-4" aria-hidden="true" />}
          fullWidth
        />
      </div>

      {/* ── 2열 네비게이션 영역 ──────────────────────────────
            좌측 고정폭(117px) 사이드바 + 우측 가변 콘텐츠 영역.
            Inline이 아닌 flex로 직접 처리하는 이유:
            사이드바는 고정폭, 콘텐츠는 flex-1 가변폭으로 달리 처리해야 해서
            Inline의 gap 기반 배분 방식과 맞지 않음 */}
      <div className="flex min-h-[500px] border-t border-border-subtle">
        {/* 좌측: 카테고리 사이드바 */}
        <SidebarNav
          items={MENU_CATEGORIES}
          activeId={activeCategory}
          onItemChange={(id) => onCategoryChange(id as MenuCategoryId)}
          /* w-[117px]: Figma 원본 사이드바 너비(117px) 그대로 유지 */
          className="w-[117px] shrink-0 bg-surface-raised border-r border-border-subtle"
        />

        {/* 우측: 선택된 카테고리의 메뉴 목록 */}
        <div className="flex-1 min-w-0">
          <Stack gap="xl" className="p-xl">
            {/* 카테고리 소제목 — 12px uppercase (Figma 원본 스타일 재현) */}
            <Typography variant="caption" color="muted" className="uppercase tracking-widest">
              {currentCategory?.label} 메뉴
            </Typography>

            {/* 메뉴 아이템 목록 */}
            <Stack gap="xs">
              {currentItems.map((item) => (
                <ActionLinkItem
                  key={item.id}
                  icon={item.icon}
                  label={item.label}
                  size="sm"
                  showBorder={false}
                  onClick={() => console.log(`${item.label} 클릭`)}
                />
              ))}
            </Stack>
          </Stack>
        </div>
      </div>

      {/* 하단 브랜드 배너 */}
      <div className="bg-surface-raised px-standard py-md">
        <BrandBanner
          subtitle="개인 맞춤 혜택"
          title="나만을 위한 특별한 한아멤버스"
          icon={<Star className="size-5 text-white" aria-hidden="true" />}
          onClick={() => console.log('멤버십 배너 클릭')}
        />
      </div>
    </PageLayout>
  );
}
