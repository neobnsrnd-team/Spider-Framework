/**
 * @file CardChipItem.stories.tsx
 */
import type { Meta, StoryObj } from '@storybook/react';
import { CardChipItem } from './index';

const meta = {
  title: 'Biz/Card/CardChipItem',
  component: CardChipItem,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'card' },
  args: {
    name: '하나 머니 체크카드',
    maskedNumber: '1234-****-****-5678',
  },
} satisfies Meta<typeof CardChipItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const LongName: Story = {
  args: { name: '하나 VIPS 프리미엄 신용카드', maskedNumber: '9876-****-****-1234' },
};
