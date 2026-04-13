/**
 * @file UsageHistoryPage.stories.tsx
 * @description 카드 이용내역 페이지 스토리.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { UsageHistoryPage } from './index';
import type { Transaction } from './types';

/** 목 이용내역 20건 생성 */
const MERCHANTS = [
  '스타벅스 강남점', '이마트 역삼점', 'GS25 테헤란로점', '올리브영 강남',
  '맥도날드 삼성점', '쿠팡', '배달의민족', '교보문고', '넷플릭스', '카카오페이',
];

const MOCK_TRANSACTIONS: Transaction[] = Array.from({ length: 25 }, (_, i) => ({
  id:             `tx-${i + 1}`,
  merchant:       MERCHANTS[i % MERCHANTS.length],
  amount:         i === 3 ? -15000 : (i + 1) * 13500,
  date:           `2026.04.${String(i + 1).padStart(2, '0')}`,
  type:           i % 4 === 0 ? '할부(3개월)' : i % 4 === 3 ? '취소' : '일시불',
  approvalNumber: `2026${String(i + 1).padStart(8, '0')}`,
  status:         i % 4 === 3 ? '취소' : i % 3 === 0 ? '결제확정' : '승인',
  cardName:       i % 2 === 0 ? '하나 머니 체크카드' : '하나 플래티넘 신용카드',
  merchantInfo: i % 3 === 0 ? {
    address:      `서울 강남구 테헤란로 ${(i + 1) * 10}길 ${i + 1}`,
    phone:        `02-${1000 + i}-${4000 + i}`,
    businessType: '음식점',
  } : undefined,
}));

const MOCK_CARD_OPTIONS = [
  { value: 'card-1', label: '하나 머니 체크카드' },
  { value: 'card-2', label: '하나 플래티넘 신용카드' },
];

const meta = {
  title: 'Pages/Card/UsageHistoryPage',
  component: UsageHistoryPage,
  tags: ['autodocs'],
  parameters: {
    brand:  'hana',
    domain: 'card',
    layout: 'fullscreen',
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: 390, minHeight: '100dvh', margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    transactions:   MOCK_TRANSACTIONS,
    totalCount:     25,
    paymentSummary: { date: '2026년 4월 14일', totalAmount: 350_000 },
    cardOptions:    MOCK_CARD_OPTIONS,
    onBack:              () => {},
    onClose:             () => {},
    onLoadMore:          () => {},
    onInstallment:       () => {},
    onImmediatePayment:  () => {},
    onRevolving:         () => {},
    onSearch:            () => {},
  },
} satisfies Meta<typeof UsageHistoryPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** 이용내역 없음 */
export const Empty: Story = {
  args: { transactions: [], totalCount: 0 },
};
