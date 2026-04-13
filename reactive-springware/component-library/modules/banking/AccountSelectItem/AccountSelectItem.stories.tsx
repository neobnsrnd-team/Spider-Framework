/**
 * @file AccountSelectItem.stories.tsx
 * @description AccountSelectItem 컴포넌트 스토리.
 * 출금/입금 계좌 선택 BottomSheet의 계좌 리스트 아이템.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Landmark } from 'lucide-react';
import { AccountSelectItem } from './index';

const ICON = <Landmark className="size-5" aria-hidden="true" />;

const meta = {
  title: 'Modules/Banking/AccountSelectItem',
  component: AccountSelectItem,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'banking' },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: 390, background: '#fff' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    icon: ICON,
    accountName: '하나 주거래 통장',
    accountNumber: '123-456-789012',
    balance: '3,000,000원',
    selected: false,
  },
} satisfies Meta<typeof AccountSelectItem>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 미선택 상태 */
export const Default: Story = {};

/** 선택 상태 — 브랜드 배경 + 체크 아이콘 */
export const Selected: Story = {
  args: { selected: true },
};

/** 긴 계좌명 — truncate 동작 확인 */
export const LongAccountName: Story = {
  args: { accountName: '하나 주거래 우대 통장 (급여 자동이체)' },
};

/** 계좌 목록 — Figma 원본 레이아웃 재현 (node-id: 1:1385) */
export const AccountList: Story = {
  render: () => {
    const [selectedId, setSelectedId] = useState('hana');
    const accounts = [
      { id: 'hana',  accountName: '하나 주거래 통장',    accountNumber: '123-456-789012', balance: '3,000,000원' },
      { id: 'cksa',  accountName: '주택청약종합저축',     accountNumber: '111-222-333333', balance: '1,000,000원' },
      { id: 'eplus', accountName: 'e-플러스 적금',        accountNumber: '444-555-666666', balance: '500,000원' },
    ];
    return (
      /* decorator가 이미 동일한 width/background div로 감싸주므로 추가 래퍼 불필요 */
      <>
        {accounts.map((acc) => (
          <AccountSelectItem
            key={acc.id}
            icon={ICON}
            accountName={acc.accountName}
            accountNumber={acc.accountNumber}
            balance={acc.balance}
            selected={selectedId === acc.id}
            onClick={() => setSelectedId(acc.id)}
          />
        ))}
      </>
    );
  },
};
