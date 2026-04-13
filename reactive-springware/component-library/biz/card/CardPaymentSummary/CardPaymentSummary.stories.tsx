/**
 * @file CardPaymentSummary.stories.tsx
 * @description CardPaymentSummary 컴포넌트 스토리.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { CardPaymentSummary } from './index';

const meta = {
  title: 'Biz/Card/CardPaymentSummary',
  component: CardPaymentSummary,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'card' },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: 390, padding: 16 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    dateFull: '2026.04.08',
    dateYM: '26년 4월',
    dateMD: '04.08',
    totalAmount: 350000,
    onDateClick: () => {},
    onRevolving: () => {},
    onCardLoan: () => {},
    onCashAdvance: () => {},
  },
} satisfies Meta<typeof CardPaymentSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** 리볼빙·카드론·현금서비스 모두 0인 경우 */
export const NoExtras: Story = {
  args: {
    revolving: 0,
    cardLoan: 0,
    cashAdvance: 0,
  },
};

/** 세부 항목 모두 있는 경우 */
export const WithAllExtras: Story = {
  args: {
    totalAmount: 820000,
    revolving: 200000,
    cardLoan: 300000,
    cashAdvance: 50000,
  },
};
