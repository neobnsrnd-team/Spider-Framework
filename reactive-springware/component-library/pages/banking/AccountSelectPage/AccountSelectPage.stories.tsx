/**
 * @file AccountSelectPage.stories.tsx
 * @description AccountSelectPage 컴포넌트 스토리.
 * 이체 화면에서 출금·입금 계좌를 선택하는 BottomSheet 페이지.
 *
 * Figma 원본:
 *   - node-id: 1:1385 (해당금융 탭 — 계좌 리스트)
 *   - node-id: 1:2300 (다른 금융 탭 — 빈 상태 + CTA)
 */
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Landmark } from 'lucide-react';
import { AccountSelectPage } from './index';
import type { AccountSelectTab, AccountItem } from './types';

// ── 샘플 데이터 ──────────────────────────────────────────────────

const ICON = <Landmark className="size-5" aria-hidden="true" />;

const SAMPLE_ACCOUNTS: AccountItem[] = [
  { id: 'hana',  icon: ICON, accountName: '하나 주거래 통장',  accountNumber: '123-456-789012', balance: '3,000,000원' },
  { id: 'cksa',  icon: ICON, accountName: '주택청약종합저축',   accountNumber: '111-222-333333', balance: '1,000,000원' },
  { id: 'eplus', icon: ICON, accountName: 'e-플러스 적금',      accountNumber: '444-555-666666', balance: '500,000원' },
];

const SAMPLE_OTHER_ACCOUNTS: AccountItem[] = [
  { id: 'kb',   icon: ICON, accountName: 'KB국민은행 입출금',   accountNumber: '111-22-3333333', balance: '2,500,000원' },
  { id: 'shin', icon: ICON, accountName: '신한은행 저축예금',    accountNumber: '110-234-567890', balance: '800,000원' },
];

const meta = {
  title: 'Pages/Banking/AccountSelectPage',
  component: AccountSelectPage,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'banking', layout: 'fullscreen' },
  args: {
    open: true,
    onClose: () => {},
    activeTab: 'mine',
    onTabChange: () => {},
    accounts: SAMPLE_ACCOUNTS,
    selectedAccountId: 'hana',
    onAccountSelect: () => {},
    otherAccounts: SAMPLE_OTHER_ACCOUNTS,
    selectedOtherAccountId: undefined,
    onOtherAccountSelect: () => {},
    onConnectOtherAccount: () => {},
  },
} satisfies Meta<typeof AccountSelectPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 해당금융 탭 — 기본 상태 (Figma node-id: 1:1385) */
export const MineTab: Story = {};

/** 해당금융 탭 — 선택 없음 */
export const MineTabNoSelection: Story = {
  args: { selectedAccountId: undefined },
};

/** 다른 금융 탭 — 연결된 계좌 있음 */
export const OtherTab: Story = {
  args: {
    activeTab: 'other',
    selectedOtherAccountId: 'kb',
  },
};

/** 다른 금융 탭 — 빈 상태 + CTA (Figma node-id: 1:2300) */
export const OtherTabEmpty: Story = {
  args: {
    activeTab: 'other',
    otherAccounts: [],
  },
};

/** 다른 금융 탭 — 빈 상태, CTA 없음 (onConnectOtherAccount 미전달) */
export const OtherTabEmptyNoCta: Story = {
  args: {
    activeTab: 'other',
    otherAccounts: [],
    onConnectOtherAccount: undefined,
  },
};

/** 인터랙티브 — 탭 전환·계좌 선택 전체 흐름 재현 */
export const Interactive: Story = {
  render: (args) => {
    const [activeTab, setActiveTab] = useState<AccountSelectTab>('mine');
    const [selectedAccountId, setSelectedAccountId] = useState<string | undefined>('hana');
    const [selectedOtherAccountId, setSelectedOtherAccountId] = useState<string | undefined>();

    return (
      <AccountSelectPage
        {...args}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        selectedAccountId={selectedAccountId}
        onAccountSelect={setSelectedAccountId}
        selectedOtherAccountId={selectedOtherAccountId}
        onOtherAccountSelect={setSelectedOtherAccountId}
        onConnectOtherAccount={() => alert('다른 금융 계좌 연결하기 클릭')}
        onClose={() => alert('닫기 클릭')}
      />
    );
  },
};
