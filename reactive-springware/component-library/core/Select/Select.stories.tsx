/**
 * @file Select.stories.tsx
 * @description Select 커스텀 드롭다운 컴포넌트 스토리.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Select } from './index';

const SORT_OPTIONS = [
  { value: 'recent', label: '최근순' },
  { value: 'old',    label: '과거순' },
];

const TYPE_OPTIONS = [
  { value: 'all',        label: '전체' },
  { value: 'deposit',    label: '입금' },
  { value: 'withdrawal', label: '출금' },
];

const meta = {
  title: 'Core/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'banking', layout: 'centered' },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: 160, padding: '40px 0' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 정렬 순서 선택 */
export const SortOrder: Story = {
  render: () => {
    const [value, setValue] = useState('recent');
    return (
      <Select
        options={SORT_OPTIONS}
        value={value}
        onChange={setValue}
        aria-label="정렬 순서"
      />
    );
  },
};

/** 거래 유형 선택 */
export const TransactionType: Story = {
  render: () => {
    const [value, setValue] = useState('all');
    return (
      <Select
        options={TYPE_OPTIONS}
        value={value}
        onChange={setValue}
        aria-label="거래 유형"
      />
    );
  },
};

/** 두 Select 나란히 — TransactionSearchFilter 내 실제 사용 형태 */
export const SideBySide: Story = {
  render: () => {
    const [sort, setSort]   = useState('recent');
    const [type, setType]   = useState('all');
    return (
      <div style={{ display: 'flex', gap: 8, width: 280 }}>
        <Select options={SORT_OPTIONS} value={sort} onChange={setSort} aria-label="정렬 순서" className="flex-1" />
        <Select options={TYPE_OPTIONS} value={type} onChange={setType} aria-label="거래 유형" className="flex-1" />
      </div>
    );
  },
  decorators: [],
};
