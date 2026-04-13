/**
 * @file TransactionSearchFilter.stories.tsx
 * @description TransactionSearchFilter 컴포넌트 스토리.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { TransactionSearchFilter } from './index';
import type { TransactionSearchParams } from './types';

const DEFAULT_VALUE: TransactionSearchParams = {
  startDate:       '2023-10-01',
  endDate:         '2023-11-01',
  sortOrder:       'recent',
  transactionType: 'all',
};

const meta = {
  title: 'Modules/Banking/TransactionSearchFilter',
  component: TransactionSearchFilter,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'banking' },
  decorators: [(Story: React.ComponentType) => <div style={{ width: 390 }}><Story /></div>],
  args: {
    value:    DEFAULT_VALUE,
    onSearch: (params: TransactionSearchParams) => console.log('onSearch', params),
  },
} satisfies Meta<typeof TransactionSearchFilter>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 기본 — 접힌 상태. 현재 기간 요약 표시 */
export const Default: Story = {};

/** 펼친 상태 — 퀵 기간 탭 / 날짜 입력 / 정렬·유형 드롭다운 / 조회 버튼 노출 */
export const Expanded: Story = {
  args: { defaultExpanded: true },
};

/** 입금만 필터 — transactionType: deposit 초기값 */
export const FilterDeposit: Story = {
  args: {
    defaultExpanded: true,
    value: { ...DEFAULT_VALUE, transactionType: 'deposit' },
  },
};

/** 과거순 정렬 초기값 */
export const SortOld: Story = {
  args: {
    defaultExpanded: true,
    value: { ...DEFAULT_VALUE, sortOrder: 'old' },
  },
};

/** 브랜드 변경 — IBK기업은행 */
export const IbkBrand: Story = {
  parameters: { brand: 'ibk' },
  args: { defaultExpanded: true },
};