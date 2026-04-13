/**
 * @file AccountSelectCard.stories.tsx
 */
import type { Meta, StoryObj } from '@storybook/react';
import { AccountSelectCard } from './index';

const meta = {
  title: 'Biz/Card/AccountSelectCard',
  component: AccountSelectCard,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'card' },
  args: {
    bankName: '하나은행',
    maskedAccount: '123-****-5678',
    isSelected: false,
    onClick: () => {},
  },
} satisfies Meta<typeof AccountSelectCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Selected: Story = { args: { isSelected: true } };
export const OtherBank: Story = {
  args: { bankName: '국민은행', maskedAccount: '456-****-9012' },
};
