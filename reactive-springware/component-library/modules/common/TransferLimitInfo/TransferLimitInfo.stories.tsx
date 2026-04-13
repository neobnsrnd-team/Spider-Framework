/**
 * @file TransferLimitInfo.stories.tsx
 */
import type { Meta, StoryObj } from '@storybook/react';
import { TransferLimitInfo } from './index';

const meta = {
  title: 'Modules/Common/TransferLimitInfo',
  component: TransferLimitInfo,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'card' },
  args: {
    perTransferLimit: 1000000,
    dailyLimit: 5000000,
  },
} satisfies Meta<typeof TransferLimitInfo>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 한도만 표시 */
export const Default: Story = {};

/** 오늘 사용 금액 + 잔여 한도 함께 표시 */
export const WithUsedAmount: Story = {
  args: { usedAmount: 1500000 },
};

/** 한도 초과(잔여 0원) */
export const LimitExceeded: Story = {
  args: { usedAmount: 5000000 },
};
