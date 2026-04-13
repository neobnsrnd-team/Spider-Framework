/**
 * @file StatementTotalCard.stories.tsx
 * @description StatementTotalCard 컴포넌트 스토리.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { StatementTotalCard } from './index';

const meta = {
  title: 'Biz/Card/StatementTotalCard',
  component: StatementTotalCard,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'card' },
  decorators: [(Story: React.ComponentType) => <div style={{ width: 390, padding: 16 }}><Story /></div>],
  args: {
    amount: 350000,
    badge: '예정',
    onDetailClick: () => {},
    onInstallment: () => {},
    onImmediatePayment: () => {},
    onRevolving: () => {},
  },
} satisfies Meta<typeof StatementTotalCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 배지 + 이용내역 링크 + 버튼 3개 */
export const Default: Story = {};

/** 배지 없음 — 결제 완료 상태 */
export const NoBadge: Story = {
  args: { badge: undefined },
};

/** 이용내역 화살표 없음 */
export const NoDetail: Story = {
  args: { onDetailClick: undefined },
};
