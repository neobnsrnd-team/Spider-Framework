/**
 * @file BillingPeriodLabel.stories.tsx
 * @description BillingPeriodLabel 컴포넌트 스토리.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { BillingPeriodLabel } from './index';

const meta = {
  title: 'Biz/Card/BillingPeriodLabel',
  component: BillingPeriodLabel,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'card' },
  decorators: [(Story: React.ComponentType) => <div style={{ width: 390, padding: 16 }}><Story /></div>],
  args: {
    startDate: '2025.03.01',
    endDate:   '2025.03.31',
  },
} satisfies Meta<typeof BillingPeriodLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ShortPeriod: Story = {
  args: {
    startDate: '2025.03.15',
    endDate:   '2025.03.31',
  },
};
