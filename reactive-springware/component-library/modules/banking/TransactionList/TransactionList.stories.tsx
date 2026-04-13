/**
 * @file TransactionList.stories.tsx
 * @description TransactionList 컴포넌트 스토리.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { TransactionList } from './index';
import type { TransactionItem } from './types';

const SAMPLE_ITEMS: TransactionItem[] = [
  { id: '1', date: '2026-03-26T09:00:00Z', title: '스타벅스',     amount: -6500,    balance: 1228067, type: 'withdrawal' },
  { id: '2', date: '2026-03-26T08:00:00Z', title: '급여 입금',    amount: 3200000,  balance: 1234567, type: 'deposit'    },
  { id: '3', date: '2026-03-25T15:30:00Z', title: '홍길동',       amount: -50000,   balance: 3034567, type: 'transfer'   },
  { id: '4', date: '2026-03-25T12:00:00Z', title: 'GS25',         amount: -3200,    balance: 3084567, type: 'withdrawal' },
  { id: '5', date: '2026-03-24T11:00:00Z', title: '이자 입금',    amount: 1250,     balance: 3087767, type: 'deposit'    },
  { id: '6', date: '2026-03-24T09:00:00Z', title: '관리비',       amount: -120000,  balance: 3086517, type: 'withdrawal' },
];

const meta = {
  title: 'Modules/Banking/TransactionList',
  component: TransactionList,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'banking' },
  args: { items: SAMPLE_ITEMS },
} satisfies Meta<typeof TransactionList>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 날짜별 sticky 헤더 + 입출금 색상 분기 */
export const Default: Story = {
  decorators: [(Story) => (
    <div style={{ width: 390, height: 600, overflowY: 'auto', border: '1px solid var(--color-border)', borderRadius: 12 }}>
      <Story />
    </div>
  )],
};

/** 로딩 상태 — 스켈레톤 UI */
export const Loading: Story = {
  args: { loading: true },
  decorators: [(Story) => <div style={{ width: 390 }}><Story /></div>],
};

/** 빈 목록 */
export const Empty: Story = {
  args: { items: [] },
  decorators: [(Story) => <div style={{ width: 390 }}><Story /></div>],
};

/** 날짜 헤더 형식: 'YYYY년 MM월 DD일' — dateHeaderFormat="year-month-day" */
export const DateHeaderYearMonthDay: Story = {
  args: { dateHeaderFormat: 'year-month-day' },
  decorators: [(Story) => (
    <div style={{ width: 390, height: 600, overflowY: 'auto', border: '1px solid var(--color-border)', borderRadius: 12 }}>
      <Story />
    </div>
  )],
};

/**
 * 항목 클릭 가능 — onItemClick 전달 시 각 항목이 <button>으로 렌더링된다.
 * 거래 상세 바텀시트 오픈 등 항목 클릭 연동이 필요한 경우 사용한다.
 */
export const WithItemClick: Story = {
  args: {
    onItemClick: (item) => alert(`[클릭] ${item.title} — ${item.id}`),
  },
  decorators: [(Story) => (
    <div style={{ width: 390, height: 600, overflowY: 'auto', border: '1px solid var(--color-border)', borderRadius: 12 }}>
      <Story />
    </div>
  )],
};

/** 커스텀 빈 목록 메시지 — emptyMessage prop 지정 */
export const CustomEmptyMessage: Story = {
  args: {
    items:        [],
    emptyMessage: '조회 기간 내 거래 내역이 없어요',
  },
  decorators: [(Story) => <div style={{ width: 390 }}><Story /></div>],
};

/**
 * 잔액 미표시 — balance가 없는 항목은 잔액 행을 렌더링하지 않는다.
 * balance는 optional이며 전달하지 않으면 금액만 표시된다.
 */
export const WithoutBalance: Story = {
  args: {
    items: [
      { id: 'nb-1', date: '2026-03-26T14:00:00Z', title: '스타벅스',  amount: 6500,   type: 'withdrawal' },
      { id: 'nb-2', date: '2026-03-26T09:00:00Z', title: '급여 입금', amount: 3200000, type: 'deposit'    },
      { id: 'nb-3', date: '2026-03-25T18:00:00Z', title: '홍길동',   amount: 50000,  type: 'transfer'   },
    ],
  },
  decorators: [(Story) => (
    <div style={{ width: 390, border: '1px solid var(--color-border)', borderRadius: 12 }}>
      <Story />
    </div>
  )],
};
