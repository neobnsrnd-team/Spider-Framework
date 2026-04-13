/**
 * @file AccountDetailPage.stories.tsx
 * @description 계좌상세 페이지 Storybook 스토리.
 *
 * Figma 원본: node-id: 1:692
 *   - 계좌 정보 Hero + 예금자보호 안내 + 거래내역 목록
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { AccountDetailPage } from './index';

const meta = {
  title: 'Pages/Banking/AccountDetailPage',
  component: AccountDetailPage,
  tags: ['autodocs'],
  parameters: {
    brand:  'hana',
    domain: 'banking',
    layout: 'fullscreen',
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: 390, minHeight: '100dvh', margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AccountDetailPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 예금 계좌 상세 — 거래내역 정상 표시. Figma node-id: 1:692 */
export const Deposit: Story = {
  args: {
    accountType:      'deposit',
    accountName:      '하나 청년도약계좌',
    accountNumber:    '180-910058-09304',
    balance:          3000000,
    availableBalance: 2950000,
    initialState:     'data',
  },
};

/** 대출 계좌 — 대출잔액은 danger 색상으로 표시 */
export const Loan: Story = {
  args: {
    accountType:      'loan',
    accountName:      '하나 전세자금대출',
    accountNumber:    '180-920058-00101',
    balance:          50000000,
    availableBalance: 0,
    initialState:     'data',
  },
};

/** 로딩 상태 — 계좌 정보 스켈레톤 UI */
export const Loading: Story = {
  args: { initialState: 'loading' },
};

/** 에러 상태 — 데이터 로드 실패 */
export const Error: Story = {
  args: { initialState: 'error' },
};
