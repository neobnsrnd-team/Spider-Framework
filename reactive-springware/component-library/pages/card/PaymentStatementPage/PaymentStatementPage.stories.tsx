/**
 * @file PaymentStatementPage.stories.tsx
 * @description 결제예정금액 / 이용대금명세서 페이지 스토리.
 */
import type { Meta, StoryObj } from '@storybook/react';
import { CreditCard, ShoppingBag, Utensils, Coffee } from 'lucide-react';
import React from 'react';
import { PaymentStatementPage } from './index';

const MOCK_CARD_OPTIONS = [
  { value: 'card-1', label: '하나 머니 체크카드' },
  { value: 'card-2', label: '하나 플래티넘 신용카드' },
];

const MOCK_PAYMENT_ITEMS = [
  {
    id: 'item-1',
    icon: <CreditCard size={18} />,
    cardEnName: 'HANA MONEY CHECK',
    cardName: '하나 머니 체크카드',
    amount: 150000,
    onDetailClick: () => {},
  },
  {
    id: 'item-2',
    icon: <ShoppingBag size={18} />,
    iconBgClassName: 'bg-surface-subtle',
    cardEnName: 'HANA PLATINUM CREDIT',
    cardName: '하나 플래티넘 신용카드',
    amount: 200000,
    onDetailClick: () => {},
  },
  {
    id: 'item-3',
    icon: <Utensils size={18} />,
    iconBgClassName: 'bg-surface-subtle',
    cardEnName: 'HANA MONEY CHECK',
    cardName: '스타벅스 결제취소',
    amount: -6500,
    onDetailClick: () => {},
  },
];

const MOCK_STATEMENT_ITEMS = [
  {
    id: 'stmt-1',
    icon: <CreditCard size={18} />,
    cardEnName: 'HANA PLATINUM CREDIT',
    cardName: '하나 플래티넘 신용카드',
    amount: 200000,
    onDetailClick: () => {},
  },
  {
    id: 'stmt-2',
    icon: <Coffee size={18} />,
    iconBgClassName: 'bg-surface-subtle',
    cardEnName: 'HANA MONEY CHECK',
    cardName: '하나 머니 체크카드',
    amount: 150000,
    onDetailClick: () => {},
  },
];

const MOCK_INFO_SECTIONS = [
  {
    title: '결제정보',
    rows: [
      { label: '결제 계좌', value: '하나은행\n123456****1234' },
      { label: '결제일', value: '매월 14일' },
    ],
  },
  {
    title: '카드 이용기간',
    rows: [
      { label: '일시불/할부', value: '2026.03.13\n~ 2026.04.12' },
      { label: '단기카드대출(현금서비스)', value: '2026.02.26\n~ 2026.03.25' },
    ],
  },
];

const meta = {
  title: 'Pages/Card/PaymentStatementPage',
  component: PaymentStatementPage,
  tags: ['autodocs'],
  parameters: {
    brand: 'hana',
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
    cardOptions: MOCK_CARD_OPTIONS,
    paymentData: {
      dateFull: '2026.04.14',
      dateYM: '26년 4월',
      dateMD: '04.08',
      totalAmount: 350000,
      revolving: 0,
      cardLoan: 0,
      cashAdvance: 0,
      infoSections: MOCK_INFO_SECTIONS,
      paymentItems: MOCK_PAYMENT_ITEMS,
    },
    statementData: {
      totalAmount: 350000,
      badge: '예정',
      paymentItems: MOCK_STATEMENT_ITEMS,
      infoSections: MOCK_INFO_SECTIONS,
    },
    onBack: () => {},
    onClose: () => {},
    onCardChange: () => {},
    onDateClick: () => {},
    onRevolving: () => {},
    onCardLoan: () => {},
    onCashAdvance: () => {},
    onStatementDetail: () => {},
    onInstallment: () => {},
    onImmediatePayment: () => {},
  },
} satisfies Meta<typeof PaymentStatementPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 결제예정금액 탭 초기 표시 */
export const Default: Story = {};

/** 이용대금명세서 탭 초기 표시 */
export const StatementTab: Story = {
  args: { initialTab: 'statement' },
};

/** 두 번째 카드 초기 선택 */
export const SecondCard: Story = {
  args: { initialCardValue: 'card-2' },
};
