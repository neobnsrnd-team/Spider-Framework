/**
 * @file UsageTransactionItem.stories.tsx
 * @description UsageTransactionItem 컴포넌트 스토리.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { CreditCard } from 'lucide-react';
import { UsageTransactionItem } from './index';

const MOCK_TX = {
  id:             'tx-1',
  merchant:       '스타벅스 강남점',
  amount:         6500,
  date:           '2026.04.08',
  type:           '일시불',
  approvalNumber: '20260408001',
  status:         '승인',
  cardName:       '하나 머니 체크카드',
  merchantInfo: {
    address:      '서울 강남구 테헤란로 101',
    phone:        '02-1234-5678',
    businessType: '음식점',
  },
};

const meta = {
  title: 'Biz/Card/UsageTransactionItem',
  component: UsageTransactionItem,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'card' },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: 390, padding: 16 }}>
        <Story />
      </div>
    ),
  ],
  args: { tx: MOCK_TX },
} satisfies Meta<typeof UsageTransactionItem>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 클릭 시 상세 BottomSheet 노출 */
export const WithDetail: Story = {
  args: { onClick: () => {} },
};

/** onClick 미전달 — 단순 표시, 상세 시트 없음 */
export const StaticRow: Story = {};

/** 취소/환불 — 음수 금액은 brand 색상 */
export const Refund: Story = {
  args: { tx: { ...MOCK_TX, amount: -6500, type: '취소', status: '취소' }, onClick: () => {} },
};
