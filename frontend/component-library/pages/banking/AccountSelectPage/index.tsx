/**
 * @file index.tsx
 * @description 출금·입금 계좌 선택 BottomSheet 페이지 컴포넌트.
 *
 * Figma 원본:
 *   - node-id: 1:1385 (해당금융 탭 — 계좌 리스트)
 *   - node-id: 1:2300 (다른 금융 탭 — 빈 상태 + CTA)
 *
 * 이체 화면에서 출금·입금 계좌를 선택하는 화면.
 * "해당금융" 탭에서는 보유 계좌를 스크롤 가능한 목록으로 보여주고,
 * "다른 금융" 탭에서는 연결된 타행 계좌 목록 또는 빈 상태 + CTA를 표시한다.
 *
 * 화면 구성:
 *   1. BottomSheet — 타이틀("출금 계좌 선택") + X 닫기 버튼
 *   2. TabNav — 해당금융 | 다른 금융
 *   3. (해당금융 탭) AccountSelectItem 목록
 *   3. (다른 금융 탭 / 데이터 있음) AccountSelectItem 목록
 *   3. (다른 금융 탭 / 빈 목록) EmptyState + Footer CTA
 *
 * @param open                    - BottomSheet 열림 여부
 * @param onClose                 - 닫기 핸들러
 * @param activeTab               - 현재 활성 탭
 * @param onTabChange             - 탭 전환 핸들러
 * @param accounts                - 보유 계좌 목록 (해당금융 탭)
 * @param selectedAccountId       - 선택된 계좌 id
 * @param onAccountSelect         - 계좌 선택 핸들러
 * @param otherAccounts           - 다른 금융 계좌 목록 (빈 배열이면 EmptyState)
 * @param selectedOtherAccountId  - 선택된 다른 금융 계좌 id
 * @param onOtherAccountSelect    - 다른 금융 계좌 선택 핸들러
 * @param onConnectOtherAccount   - "다른 금융 계좌 연결하기" CTA 핸들러
 */
import React from 'react';
import { Wallet } from 'lucide-react';

/* ── Modules ─────────────────────────────────────────────────────── */
import { BottomSheet } from '../../../modules/common/BottomSheet';
import { TabNav } from '../../../modules/common/TabNav';
import { EmptyState } from '../../../modules/common/EmptyState';
import { AccountSelectItem } from '../../../modules/banking/AccountSelectItem';

/* ── Layout ──────────────────────────────────────────────────────── */
import { Stack } from '../../../layout/Stack';

/* ── Core ────────────────────────────────────────────────────────── */
import { Button } from '../../../core/Button';

import type { AccountSelectPageProps, AccountSelectTab } from './types';

export type { AccountSelectPageProps, AccountSelectTab, AccountItem } from './types';

// ── 탭 정의 (고정값이므로 상수로 분리) ──────────────────────────────

const TABS = [
  { id: 'mine'  as const, label: '해당금융' },
  { id: 'other' as const, label: '다른 금융' },
];

// ── 다른 금융 빈 상태 일러스트 ─────────────────────────────────────

/**
 * 다른 금융 탭 빈 상태에 표시할 일러스트.
 * Figma 원본: 회색 원형 배경 + 지갑 아이콘.
 */
const OtherEmptyIllustration = (
  <div className="flex items-center justify-center size-24 rounded-full bg-surface-raised" aria-hidden="true">
    <Wallet className="size-9 text-text-muted" />
  </div>
);

// ── 메인 컴포넌트 ─────────────────────────────────────────────────

export function AccountSelectPage({
  open,
  onClose,
  activeTab,
  onTabChange,
  accounts,
  selectedAccountId,
  onAccountSelect,
  otherAccounts,
  selectedOtherAccountId,
  onOtherAccountSelect,
  onConnectOtherAccount,
}: AccountSelectPageProps) {
  /* 다른 금융 탭이 활성이고 계좌 목록이 비어있는지 — 빈 상태 분기에 사용 */
  const isOtherEmpty = activeTab === 'other' && otherAccounts.length === 0;

  /* 활성 탭에서 표시할 계좌 목록 */
  const activeAccounts = activeTab === 'mine' ? accounts : otherAccounts;
  const activeSelectedId = activeTab === 'mine' ? selectedAccountId : selectedOtherAccountId;
  const activeOnSelect = activeTab === 'mine' ? onAccountSelect : onOtherAccountSelect;

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title="출금 계좌 선택"
      /* 다른 금융 빈 상태일 때만 Footer CTA 표시 */
      footer={
        isOtherEmpty && onConnectOtherAccount ? (
          <Button fullWidth size="lg" onClick={onConnectOtherAccount}>
            다른 금융 계좌 연결하기
          </Button>
        ) : undefined
      }
    >
      <Stack gap="md">
        {/* 해당금융/다른 금융 가로 탭 */}
        <TabNav
          items={TABS}
          activeId={activeTab}
          onTabChange={(id) => onTabChange(id as AccountSelectTab)}
        />

        {/* 탭 콘텐츠 */}
        {isOtherEmpty ? (
          /* 다른 금융 — 빈 상태 */
          <EmptyState
            illustration={OtherEmptyIllustration}
            title="연결된 다른 금융 계좌가 없습니다."
            description={`다른 은행의 계좌를 연결하고\n편리하게 이체해 보세요.`}
          />
        ) : (
          /* 계좌 목록 — role="listbox"로 스크린 리더가 선택 목록임을 인지하도록 함 */
          <div role="listbox">
            {activeAccounts.map((account) => (
              <AccountSelectItem
                key={account.id}
                icon={account.icon}
                accountName={account.accountName}
                accountNumber={account.accountNumber}
                balance={account.balance}
                selected={activeSelectedId === account.id}
                onClick={() => activeOnSelect(account.id)}
              />
            ))}
          </div>
        )}
      </Stack>
    </BottomSheet>
  );
}
