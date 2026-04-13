/**
 * @file BankSelectGrid.stories.tsx
 */
import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { BankSelectGrid } from './index';

const SAMPLE_BANKS = [
  { code: 'hana',    name: '하나은행' },
  { code: 'kb',      name: 'KB국민' },
  { code: 'shinhan', name: '신한은행' },
  { code: 'woori',   name: '우리은행' },
  { code: 'nh',      name: 'NH농협' },
  { code: 'ibk',     name: 'IBK기업' },
  { code: 'kakao',   name: '카카오뱅크' },
  { code: 'toss',    name: '토스뱅크' },
];

const meta = {
  title: 'Modules/Common/BankSelectGrid',
  component: BankSelectGrid,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'card' },
  args: {
    banks: SAMPLE_BANKS,
    selectedCode: '',
    onSelect: () => {},
    columns: 4,
  },
} satisfies Meta<typeof BankSelectGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Selected: Story = {
  args: { selectedCode: 'hana' },
};

export const ThreeColumns: Story = {
  args: { columns: 3, banks: SAMPLE_BANKS.slice(0, 6) },
};

/** 인터랙티브: 클릭으로 은행 선택 */
export const Interactive: Story = {
  render: (args) => {
    const [selected, setSelected] = useState('');
    return <BankSelectGrid {...args} selectedCode={selected} onSelect={setSelected} />;
  },
};
