/**
 * @file CardLinkedBalance.stories.tsx
 * @description CardLinkedBalance 컴포넌트 스토리.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { CardLinkedBalance } from './index';

const meta = {
  title: 'Biz/Card/CardLinkedBalance',
  component: CardLinkedBalance,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'card' },
  decorators: [(Story: React.ComponentType) => <div style={{ width: 390, padding: 16 }}><Story /></div>],
  args: {
    balance: 1200000,
    hidden: false,
    onToggle: () => {},
  },
} satisfies Meta<typeof CardLinkedBalance>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 잔액 노출 */
export const Default: Story = {};

/** 잔액 숨김 */
export const Hidden: Story = {
  args: { hidden: true },
};
