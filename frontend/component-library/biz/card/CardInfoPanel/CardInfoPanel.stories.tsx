/**
 * @file CardInfoPanel.stories.tsx
 * @description CardInfoPanel 컴포넌트 스토리.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { CardInfoPanel } from './index';

const PAYMENT_SECTION = {
  title: '결제정보',
  rows: [
    { label: '결제 계좌', value: '하나은행\n123456****1234' },
    { label: '결제일',   value: '매월 25일' },
  ],
};

const PERIOD_SECTION = {
  title: '카드 이용기간',
  rows: [
    { label: '일시불/할부',           value: '2026.03.13\n~ 2026.04.12' },
    { label: '단기카드대출(현금서비스)', value: '2026.02.26\n~ 2026.03.25' },
  ],
};

const meta = {
  title: 'Biz/Card/CardInfoPanel',
  component: CardInfoPanel,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'card' },
  decorators: [(Story: React.ComponentType) => <div style={{ width: 390, padding: 16 }}><Story /></div>],
  args: { sections: [PAYMENT_SECTION, PERIOD_SECTION] },
} satisfies Meta<typeof CardInfoPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 결제정보 + 카드 이용기간 2섹션 */
export const Default: Story = {};

/** 결제정보 단일 섹션 */
export const PaymentOnly: Story = {
  args: { sections: [PAYMENT_SECTION] },
};

/** 카드 이용기간 단일 섹션 */
export const PeriodOnly: Story = {
  args: { sections: [PERIOD_SECTION] },
};
