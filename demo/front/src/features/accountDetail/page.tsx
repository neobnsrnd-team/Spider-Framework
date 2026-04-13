/**
 * @file page.tsx
 * @description 계좌 상세 페이지 — List-Detail 내비게이션 패턴의 레퍼런스 구현.
 *
 * 레이아웃 구조:
 * PageLayout (타이틀: 계좌명, 뒤로가기)
 *   ├── AccountSummaryCard  — 잔액 + 이체 버튼
 *   ├── Section "계좌 정보" — LabelValueRow (개설일, 이자율)
 *   └── Section "최근 거래" — TransactionList (최근 5건) + 전체보기 버튼
 *
 * 데이터 상태 처리 순서 (rules/04-state-data.md §7):
 *   isLoading → isError (+ onRetry) → !data (방어) → 정상 렌더링
 *
 * URL: /accounts/:id  (react-router-dom useParams)
 * 상태·이벤트: useAccountDetail Hook (hook.ts)
 */

import React from 'react';
import { useParams } from 'react-router-dom';
import { ArrowRightLeft, ChevronRight } from 'lucide-react';
import {
  PageLayout,
  Stack,
  Inline,
  Section,
  AccountSummaryCard,
  LabelValueRow,
  TransactionList,
  Button,
  EmptyState,
  ErrorState,
} from '@neobnsrnd-team/reactive-springware';
import { useAccountDetail } from './hook';

export function AccountDetailPage() {
  // URL 파라미터에서 계좌 ID 추출 — page는 ID 파싱만 담당, 나머지는 hook에 위임
  const { id = '' } = useParams<{ id: string }>();
  const {
    data,
    isLoading,
    isError,
    refetch,
    handleBack,
    handleViewAllTransactions,
    handleTransfer,
  } = useAccountDetail(id);

  // ── 1. 로딩 중 처리 ────────────────────────────────────────────────────
  // PageLayout을 유지하여 뒤로가기 버튼이 항상 노출되도록 한다.
  if (isLoading) {
    return (
      <PageLayout title="계좌 상세" onBack={handleBack}>
        <EmptyState title="불러오는 중..." />
      </PageLayout>
    );
  }

  // ── 2. 에러 처리 ─────────────────────────────────────────────────────────
  // ErrorState.onRetry 에 refetch 를 연결하여 사용자가 재시도할 수 있도록 한다.
  if (isError) {
    return (
      <PageLayout title="계좌 상세" onBack={handleBack}>
        <ErrorState description="계좌 정보를 불러오지 못했습니다." onRetry={() => void refetch()} />
      </PageLayout>
    );
  }

  // ── 3. 빈 데이터 방어 처리 ───────────────────────────────────────────────
  // isLoading=false & isError=false 이지만 data가 없는 경계 케이스(404 등) 대응.
  if (!data) {
    return (
      <PageLayout title="계좌 상세" onBack={handleBack}>
        <EmptyState
          title="계좌 정보가 없습니다."
          description="잘못된 계좌 ID이거나 삭제된 계좌입니다."
          action={
            <Button variant="outline" onClick={handleBack}>
              목록으로 돌아가기
            </Button>
          }
        />
      </PageLayout>
    );
  }

  // ── 4. 정상 렌더링 ──────────────────────────────────────────────────────
  return (
    <div data-domain="banking">
      <PageLayout title={data.name} onBack={handleBack}>
        <Stack gap="md" className="pb-standard">
          {/* ── 계좌 요약 카드 ─────────────────────────────────────────── */}
          <Stack className="px-standard">
            <AccountSummaryCard
              type={data.type}
              accountName={data.name}
              accountNumber={data.accountNumber}
              balance={data.balance}
              balanceDisplay={data.balanceDisplay}
              actions={
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<ArrowRightLeft className="size-3.5" />}
                  onClick={handleTransfer}
                >
                  이체
                </Button>
              }
            />
          </Stack>

          {/* ── 계좌 정보 섹션 ─────────────────────────────────────────── */}
          <Section title="계좌 정보" className="px-standard">
            <Stack gap="sm">
              <LabelValueRow label="계좌번호" value={data.accountNumber} />
              <LabelValueRow label="개설일" value={data.openedDateDisplay} />
              {/* 이자율은 청약저축·외화예금 등 해당 상품에만 표시 */}
              {data.interestRateDisplay && (
                <LabelValueRow label="이자율" value={data.interestRateDisplay} />
              )}
            </Stack>
          </Section>

          {/* ── 최근 거래내역 섹션 ──────────────────────────────────────── */}
          <Section title="최근 거래내역" className="px-standard">
            {data.recentTransactions.length === 0 ? (
              /* 빈 거래 상태 — 신규 계좌 또는 외화계좌에서 발생 */
              <EmptyState title="거래 내역이 없습니다." />
            ) : (
              <Stack gap="sm">
                <TransactionList items={data.recentTransactions} />
                <Inline justify="center">
                  <Button
                    variant="ghost"
                    size="sm"
                    rightIcon={<ChevronRight className="size-4" />}
                    onClick={handleViewAllTransactions}
                  >
                    전체 거래내역 보기
                  </Button>
                </Inline>
              </Stack>
            )}
          </Section>
        </Stack>
      </PageLayout>
    </div>
  );
}
