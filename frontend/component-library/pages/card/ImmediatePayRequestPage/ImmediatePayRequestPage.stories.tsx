/**
 * @file ImmediatePayRequestPage.stories.tsx
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ImmediatePayRequestPage } from './index';

const meta = {
  title: 'Pages/Card/ImmediatePayRequestPage',
  component: ImmediatePayRequestPage,
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
    card: { id: 'card-1', name: '하나 머니 체크카드', maskedNumber: '1234-56**-****-7890' },
    payableAmount: 101000,
    paymentBreakdown: [
      { dateLabel: '2026.04.14 결제', amount: 91100 },
      { dateLabel: '2026.05.14 결제', amount: 9900 },
    ],
    amountHelperText: '금액 입금 시 당사의 입금공제 순서에 따라 처리되며, 특정 건만 처리 할 수 없습니다.',
    cautions: [
      { title: '결제 제한 안내', content: '결제일 당일 출금 가능 잔액이 부족할 경우 즉시결제가 취소될 수 있습니다.' },
      { title: '취소 불가 안내', content: '즉시결제 신청 후에는 취소가 불가합니다. 결제 전 금액을 반드시 확인하세요.' },
    ],
    onChangeCard: () => alert('변경하기'),
    onNext: (type, amount) => alert(`다음: ${type} / ${amount}원`),
    onBack: () => alert('뒤로가기'),
    onClose: () => alert('닫기'),
  },
} satisfies Meta<typeof ImmediatePayRequestPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
