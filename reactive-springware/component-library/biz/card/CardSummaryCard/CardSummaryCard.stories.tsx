/**
 * @file CardSummaryCard.stories.tsx
 * @description CardSummaryCard 컴포넌트 스토리.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { CardSummaryCard } from './index';

const meta = {
  title: 'Biz/Card/CardSummaryCard',
  component: CardSummaryCard,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'card', layout: 'centered' },
  decorators: [(Story: React.ComponentType) => <div style={{ width: 340 }}><Story /></div>],
  argTypes: {
    type:      { control: 'select', options: ['credit', 'check', 'prepaid'] },
    amount:    { control: 'number' },
    badgeText: { control: 'text' },
  },
  args: {
    type: 'credit',
    cardName: '하나 머니 체크카드',
    cardNumber: '1234 **** **** 5678',
    amount: 480000,
    limitAmount: 600000,
    badgeText: '포인트 적립',
  },
} satisfies Meta<typeof CardSummaryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Types: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 340 }}>
      <CardSummaryCard
        type="credit"
        cardName="하나 1Q카드"
        cardNumber="1234 **** **** 5678"
        amount={480000}
        limitAmount={600000}
        badgeText="포인트 적립"
      />
      <CardSummaryCard
        type="check"
        cardName="하나 체크카드"
        cardNumber="9876 **** **** 1234"
        amount={1230000}
        badgeText="주거래"
      />
      <CardSummaryCard
        type="prepaid"
        cardName="하나머니 선불카드"
        cardNumber="5555 **** **** 0001"
        amount={15000}
        badgeText="잔액 부족"
      />
    </div>
  ),
};

export const CreditWarning: Story = {
  name: '신용카드 — 한도 경고 (80%+)',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 340 }}>
      <CardSummaryCard type="credit" cardName="정상 (60%)" cardNumber="1234 **** **** 0000" amount={300000} limitAmount={500000} />
      <CardSummaryCard type="credit" cardName="경고 (85%)" cardNumber="1234 **** **** 0001" amount={425000} limitAmount={500000} badgeText="주의" />
      <CardSummaryCard type="credit" cardName="위험 (100%+)" cardNumber="1234 **** **** 0002" amount={510000} limitAmount={500000} badgeText="한도초과" />
    </div>
  ),
};

export const Clickable: Story = {
  args: { onClick: () => alert('카드 클릭') },
};