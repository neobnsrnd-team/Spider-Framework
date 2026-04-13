/**
 * @file ImmediatePayPage.stories.tsx
 * @description ImmediatePayPage 컴포넌트 스토리.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ImmediatePayPage } from './index';

const MOCK_CARDS = [
  { id: 'card-1', name: '하나 머니 체크카드',       maskedNumber: '1234-56**-****-7890' },
  { id: 'card-2', name: '하나 플래티넘 신용카드',    maskedNumber: '9876-54**-****-3210' },
  { id: 'card-3', name: '하나 비즈니스 신용카드',    maskedNumber: '1111-22**-****-3333' },
];

const meta = {
  title: 'Pages/Card/ImmediatePayPage',
  component: ImmediatePayPage,
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
    cards: MOCK_CARDS,
    initialCardId: 'card-1',
    initialPaymentType: 'total',
    onPaymentTypeChange: (type) => console.log('결제 유형:', type),
    onCardChange: (id) => console.log('카드 선택:', id),
    onBack: () => alert('뒤로가기'),
    onClose: () => alert('닫기'),
    onNext: () => alert('다음'),
  },
} satisfies Meta<typeof ImmediatePayPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const PerItem: Story = {
  args: { initialPaymentType: 'per-item' },
};
