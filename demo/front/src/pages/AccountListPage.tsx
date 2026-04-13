/**
 * @file AccountListPage.tsx
 * @description 전계좌 조회 페이지 (Figma node-id: 1-3 / 1-152).
 *
 * 레이아웃 구조:
 * PageLayout (타이틀: 전계좌 조회, 뒤로가기)
 *   ├── TabNav (variant='underline') — 해당금융 / 다른금융 (금융기관 선택)
 *   ├── TabNav (variant='pill')     — 예금 / 신탁 / 펀드 / 대출 (상품 카테고리)
 *   ├── Stack   — AccountGroupSection × N (해당금융 탭)
 *   │   또는 ConnectPrompt (다른금융 탭 — 연결 계좌 없음)
 *   └── bottomBar — 연결하기 버튼 (다른금융 탭에서만 표시)
 *
 * 상태·이벤트: useAccountList Hook
 * UI 컴포넌트: components/AccountGroupSection, components/AccountItem
 */

import React from 'react';
import { Link2, Menu } from 'lucide-react';
import {
  PageLayout,
  TabNav,
  Stack,
  Button,
  EmptyState,
} from '@neobnsrnd-team/reactive-springware';
import { useAccountList } from '../hooks/useAccountList';
import { AccountGroupSection } from '../components/AccountGroupSection';

/** 금융기관 탭 항목 — '해당금융'(내 계좌) / '다른금융'(타행 연결) */
const INSTITUTION_TABS = [
  { id: 'mine',  label: '해당금융' },
  { id: 'other', label: '다른금융' },
] as const;

/** 상품 카테고리 탭 항목 */
const PRODUCT_CATEGORY_TABS = [
  { id: 'deposit', label: '예금' },
  { id: 'trust',   label: '신탁' },
  { id: 'fund',    label: '펀드' },
  { id: 'loan',    label: '대출' },
] as const;

export function AccountListPage() {
  const {
    groups,
    isLoading,
    error,
    institutionTab,
    productCategory,
    handleInstitutionTabChange,
    handleProductCategoryChange,
    handleBack,
    handleViewHistory,
    handleTransfer,
    handleJoinRetirement,
    handleConnect,
    handleMenu,
  } = useAccountList();

  /** 다른금융 탭 여부 — 빈 상태 메시지와 하단 버튼 표시 조건에 사용 */
  const isOtherTab = institutionTab === 'other';

  return (
    <PageLayout
      title="전계좌 조회"
      onBack={handleBack}
      rightAction={
        <button
          type="button"
          onClick={handleMenu}
          aria-label="메뉴"
          className="flex items-center justify-center size-9 rounded-lg text-text-muted hover:bg-surface-raised hover:text-text-heading transition-colors duration-150"
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>
      }
      /**
       * 다른금융 탭에서만 하단 고정 "연결하기" 버튼 표시 (Figma node-id: 1-152).
       * 해당금융 탭은 bottomBar 없음 — undefined 전달 시 하단 바 미렌더링.
       */
      bottomBar={
        isOtherTab ? (
          <Button variant="primary" size="lg" fullWidth onClick={handleConnect}>
            연결하기
          </Button>
        ) : undefined
      }
    >

      {/* ── 금융기관 탭: 해당금융 / 다른금융 (underline 스타일) ── */}
      <TabNav
        items={INSTITUTION_TABS}
        activeId={institutionTab}
        onTabChange={handleInstitutionTabChange}
        variant="underline"
      />

      {/* ── 상품 카테고리 탭: 예금 / 신탁 / 펀드 / 대출 (pill 스타일) ──
          Figma 디자인에서 카테고리 탭은 밑줄이 아닌 pill 형태로 표시됨 */}
      <TabNav
        items={PRODUCT_CATEGORY_TABS}
        activeId={productCategory}
        onTabChange={handleProductCategoryChange}
        variant="pill"
        fullWidth
        className="px-standard py-sm"
      />

      {/* ── 콘텐츠: isLoading → error → empty → 정상 순서로 처리 ── */}
      {isLoading ? (
        <EmptyState title="불러오는 중..." />
      ) : error ? (
        /* 에러 상태 */
        <EmptyState
          title="계좌 정보를 불러오지 못했습니다"
          description={error}
        />
      ) : groups.length === 0 ? (
        /* 빈 상태 — 탭에 따라 메시지 분기
           다른금융(Figma 1-152): "연결된 다른 금융 계좌가 없습니다." + 연결 안내
           해당금융: 계좌 자체가 없는 경우 (비정상 케이스) */
        <EmptyState
          illustration={
            isOtherTab ? (
              <div className="flex size-14 items-center justify-center rounded-full bg-brand-10">
                <Link2 className="size-7 text-brand" aria-hidden="true" />
              </div>
            ) : undefined
          }
          title={
            isOtherTab
              ? '연결된 다른 금융 계좌가 없습니다.'
              : '계좌 정보를 불러오지 못했습니다'
          }
          description={isOtherTab ? '다른 금융 계좌를 연결해 보세요.' : undefined}
          action={
            isOtherTab ? (
              <Button variant="primary" size="sm" onClick={handleConnect}>
                연결하기
              </Button>
            ) : undefined
          }
        />
      ) : (
        /* 정상 상태: 계좌 그룹 목록 */
        <Stack gap="xl" className="px-standard py-standard">
          {groups.map(group => (
            <AccountGroupSection
              key={group.type}
              group={group}
              onViewHistory={handleViewHistory}
              onTransfer={handleTransfer}
              onJoinRetirement={handleJoinRetirement}
            />
          ))}
        </Stack>
      )}

    </PageLayout>
  );
}
