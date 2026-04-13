/**
 * @file RecentRecipientItem.stories.tsx
 */
import type { Meta, StoryObj } from '@storybook/react';
import { RecentRecipientItem } from './index';

const meta = {
  title: 'Modules/Common/RecentRecipientItem',
  component: RecentRecipientItem,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'card' },
  args: {
    name: '홍길동',
    bankName: '하나은행',
    maskedAccount: '123-****-5678',
    onClick: () => {},
  },
} satisfies Meta<typeof RecentRecipientItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const OtherBank: Story = {
  args: { name: '김철수', bankName: 'KB국민은행', maskedAccount: '456-****-9012' },
};
