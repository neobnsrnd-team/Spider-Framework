/**
 * @file InsuranceSummaryCard.stories.tsx
 * @description InsuranceSummaryCard 컴포넌트 스토리.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { InsuranceSummaryCard } from './index';

const meta = {
  title: 'Biz/Insurance/InsuranceSummaryCard',
  component: InsuranceSummaryCard,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'insurance', layout: 'centered' },
  decorators: [(Story: React.ComponentType) => <div style={{ width: 340 }}><Story /></div>],
  argTypes: {
    type:   { control: 'select', options: ['life', 'health', 'car'] },
    status: { control: 'select', options: ['active', 'pending', 'expired'] },
  },
  args: {
    type: 'health',
    insuranceName: '하나생명 건강보험',
    contractNumber: '2024-001-123456',
    premium: 52000,
    nextPaymentDate: '2026.04.01',
    status: 'active',
  },
} satisfies Meta<typeof InsuranceSummaryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Statuses: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 340 }}>
      <InsuranceSummaryCard
        type="health"
        insuranceName="하나생명 건강보험"
        contractNumber="2024-001-111111"
        premium={52000}
        nextPaymentDate="2026.04.01"
        status="active"
      />
      <InsuranceSummaryCard
        type="life"
        insuranceName="하나생명 종신보험"
        contractNumber="2024-001-222222"
        premium={120000}
        nextPaymentDate="2026.04.15"
        status="pending"
      />
      <InsuranceSummaryCard
        type="car"
        insuranceName="하나손해 자동차보험"
        contractNumber="2023-001-333333"
        premium={80000}
        status="expired"
      />
    </div>
  ),
};

export const Types: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: 340 }}>
      <InsuranceSummaryCard type="life"   insuranceName="종신보험" contractNumber="2024-L-001" premium={150000} status="active" />
      <InsuranceSummaryCard type="health" insuranceName="건강보험" contractNumber="2024-H-001" premium={52000}  status="active" />
      <InsuranceSummaryCard type="car"    insuranceName="자동차보험" contractNumber="2024-C-001" premium={75000} status="active" />
    </div>
  ),
};