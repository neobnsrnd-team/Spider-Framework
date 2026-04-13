/**
 * @file SummaryCard.stories.tsx
 * @description SummaryCard 컴포넌트 스토리.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Building2, Wallet } from 'lucide-react';
import { SummaryCard } from './index';

const meta = {
  title: 'Biz/Card/SummaryCard',
  component: SummaryCard,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'card', layout: 'centered' },
  decorators: [
    (Story: React.ComponentType) => (
      <div data-brand="hana" data-domain="card" style={{ width: 342 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    variant: { control: 'select', options: ['asset', 'spending'] },
    amount: { control: 'number' },
  },
} satisfies Meta<typeof SummaryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Asset: Story = {
  args: {
    variant: 'asset',
    title: '총 자산',
    amount: 42850000,
    icon: <Building2 size={36} />,
    actions: [
      { label: '내 계좌', onClick: () => {} },
      { label: '금융진단', onClick: () => {} },
      { label: '보험진단', onClick: () => {} },
    ],
  },
};

export const Spending: Story = {
  args: {
    variant: 'spending',
    title: '이번 달 소비',
    amount: 842300,
    icon: <Wallet size={32} />,
    actions: [
      { label: '가계부', onClick: () => {} },
      { label: '소비브리핑', onClick: () => {}, active: true },
      { label: '고정지출', onClick: () => {} },
    ],
  },
};
