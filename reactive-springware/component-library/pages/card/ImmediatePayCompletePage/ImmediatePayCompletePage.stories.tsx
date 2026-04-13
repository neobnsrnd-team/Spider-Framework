/**
 * @file ImmediatePayCompletePage.stories.tsx
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ImmediatePayCompletePage } from './index';

const meta = {
  title: 'Pages/Card/ImmediatePayCompletePage',
  component: ImmediatePayCompletePage,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'card', layout: 'fullscreen' },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: 390, minHeight: '100dvh', margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    cardName:    '하나 머니 체크카드',
    amount:      1234567,
    account:     '하나은행 123-456789-01***',
    completedAt: '2026.04.09 14:32',
    onConfirm:   () => alert('확인'),
  },
} satisfies Meta<typeof ImmediatePayCompletePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
