/**
 * @file CardPillTab.stories.tsx
 */
import type { Meta, StoryObj } from '@storybook/react';
import { CardPillTab } from './index';

const meta = {
  title: 'Biz/Card/CardPillTab',
  component: CardPillTab,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'card' },
  args: { label: '하나 머니 체크카드', isSelected: false, onClick: () => {} },
} satisfies Meta<typeof CardPillTab>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Selected: Story = { args: { isSelected: true } };
