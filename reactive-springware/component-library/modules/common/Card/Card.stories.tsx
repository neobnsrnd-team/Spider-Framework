/**
 * @file Card.stories.tsx
 * @description Card 컴포넌트 스토리.
 */
import type { Meta, StoryObj } from '@storybook/react';
import { ChevronRight } from 'lucide-react';
import React from 'react';
import { Card, CardHeader, CardRow } from './index';

const meta = {
  title: 'Modules/Common/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'banking', layout: 'centered' },
  decorators: [(Story: React.ComponentType) => <div style={{ width: 340 }}><Story /></div>],
  argTypes: {
    interactive: { control: 'boolean' },
    onClick:     { action: 'card 클릭' },
  },
  args: { interactive: false },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader title="급여 통장" subtitle="하나은행 입출금" />
      <CardRow label="잔액" value="1,234,567원" />
      <CardRow label="계좌번호" value="123-456-789012" />
    </Card>
  ),
};

export const WithIconHeader: Story = {
  render: () => (
    <Card>
      <CardHeader
        title="최근 거래 요약"
        subtitle="2026년 3월"
        icon={<span style={{ fontSize: 18 }}>📊</span>}
        action={<ChevronRight size={16} style={{ color: 'var(--color-text-muted)' }} />}
      />
      <CardRow label="입금" value="2,500,000원" valueClassName="text-success-text" />
      <CardRow label="출금" value="1,265,433원" valueClassName="text-danger-text" />
      <CardRow label="순수 증감" value="+1,234,567원" />
    </Card>
  ),
};

export const Interactive: Story = {
  args: { interactive: true, onClick: () => alert('카드 클릭') },
  render: (args) => (
    <Card {...args}>
      <CardHeader title="클릭 가능한 카드" subtitle="hover/active 효과 있음" />
      <CardRow label="항목 1" value="값 1" />
    </Card>
  ),
};