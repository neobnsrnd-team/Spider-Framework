/**
 * @file ImmediatePayMethodPage.stories.tsx
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ImmediatePayMethodPage } from './index';

const meta = {
  title: 'Pages/Card/ImmediatePayMethodPage',
  component: ImmediatePayMethodPage,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'card', layout: 'fullscreen' },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: 390, minHeight: '100dvh', margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    summaryItems: [
      { label: '청구단위', value: '하나 머니 체크카드 1234-56**-****-7890' },
      { label: '이용구분', value: '일시불' },
      { label: '결제금액', value: '1,234,567원' },
    ],
    accounts: [
      { id: 'acc-1', bankName: '하나은행',  maskedAccount: '123-456789-01***' },
      { id: 'acc-2', bankName: '국민은행',  maskedAccount: '987-654321-99***' },
    ],
    initialAccountId: 'acc-1',
    onApply: (id) => alert(`신청: ${id}`),
    onBack: () => alert('뒤로가기'),
    onClose: () => alert('닫기'),
  },
} satisfies Meta<typeof ImmediatePayMethodPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
