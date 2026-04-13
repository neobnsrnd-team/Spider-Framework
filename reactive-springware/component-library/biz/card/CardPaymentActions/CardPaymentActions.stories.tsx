/**
 * @file CardPaymentActions.stories.tsx
 * @description CardPaymentActions 컴포넌트 스토리.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { CardPaymentActions } from './index';

const meta = {
  title: 'Biz/Card/CardPaymentActions',
  component: CardPaymentActions,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'card' },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: 390, padding: 16 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    onInstallment:      () => {},
    onImmediatePayment: () => {},
    onRevolving:        () => {},
  },
} satisfies Meta<typeof CardPaymentActions>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
