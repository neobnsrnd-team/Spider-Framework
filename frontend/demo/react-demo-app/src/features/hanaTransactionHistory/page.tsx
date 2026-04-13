/**
 * @file page.tsx
 * @description 하나은행 거래내역 조회 페이지.
 *
 * Figma: "Hana Bank Transaction History" 디자인 기반.
 *
 * 레이아웃 구조:
 * PageLayout (상단 헤더: 뒤로가기 / 타이틀 / 햄버거)
 *   ├── AccountSelectorCard  — 하나 주거래 통장 + 계좌번호 + 변경 버튼
 *   ├── TransactionSearchFilter — 조회 조건 설정 (기간·정렬·유형, 접힌 상태 시작)
 *   ├── AlertBanner          — 조회 실패 시 노출 (정상 시 미노출)
 *   ├── TransactionList      — 날짜별 그룹 거래 목록 (로딩·빈 상태 내부 처리)
 *   └── 더보기 Button        — hasMore=true 일 때만 노출
 */
import React from 'react';
import { Menu, ChevronDown } from 'lucide-react';
import {
  PageLayout,
  AccountSelectorCard,
  TransactionSearchFilter,
  TransactionList,
  AlertBanner,
  Button,
  Stack,
  Inline,
} from '@neobnsrnd-team/reactive-springware';
import { useHanaTransactionHistoryList } from './hook';

export function HanaTransactionHistoryListPage() {
  const { transactions, isLoading, isError, hasMore, filter, handleSearch, handleLoadMore } =
    useHanaTransactionHistoryList();

  return (
    /* data-brand="hana": 하나은행 브랜드 토큰 적용 (청록/초록 계열)
       data-domain="banking": 뱅킹 도메인 배경색·여백 토큰 적용 */
    <div data-brand="hana" data-domain="banking">
      <PageLayout
        title="거래내역 조회"
        onBack={() => {}}
        rightAction={
          /* 햄버거 메뉴 — iconOnly ghost 버튼으로 터치 영역 확보 */
          <Button variant="ghost" iconOnly onClick={() => {}}>
            <Menu size={24} />
          </Button>
        }
      >
        <Stack gap="md" className="pb-standard">
          {/* ── 계좌 선택 카드 ──────────────────────────
           * onAccountChange: 계좌 변경 드롭다운 열기 (실제 연동 시 BottomSheet로 교체) */}

          <div className="mx-standard">
            <AccountSelectorCard
              accountName="하나 주거래 통장"
              accountNumber="123-456-789012"
              onAccountChange={() => {}}
            />
          </div>

          {/* ── 조회 조건 설정 ──────────────────────────
           * defaultExpanded=false: 기본 접힌 상태로 시작.
           * 헤더 터치 시 기간 탭·날짜 입력·정렬·유형 드롭다운이 펼쳐진다. */}
          <TransactionSearchFilter value={filter} onSearch={handleSearch} defaultExpanded={false} />

          {/* ── 조회 실패 안내 ──────────────────────────
           * isError일 때만 노출. TransactionList는 로딩·빈 상태를 내부에서 처리한다. */}
          {isError && (
            <AlertBanner intent="danger">
              거래내역을 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
            </AlertBanner>
          )}

          {/* ── 거래 내역 목록 ──────────────────────────
           * loading=true 시 내부에서 스켈레톤을 렌더링한다.
           * items가 빈 배열이면 emptyMessage를 표시한다. */}
          {!isError && (
            <TransactionList
              items={transactions}
              loading={isLoading}
              emptyMessage="조회된 거래내역이 없어요"
            />
          )}

          {/* ── 더보기 ──────────────────────────────────
           * hasMore=true 이고 에러가 없을 때만 노출.
           * 중복 클릭 방지를 위해 더보기 로딩 중에는 loading 상태를 표시한다. */}
          {!isError && hasMore && (
            <Inline justify="center">
              <Button
                variant="ghost"
                rightIcon={<ChevronDown size={16} />}
                onClick={handleLoadMore}
              >
                더보기
              </Button>
            </Inline>
          )}
        </Stack>
      </PageLayout>
    </div>
  );
}
