/**
 * @file CardDashboardPage.stories.tsx
 * @description CardDashboardPage 스토리.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { CardDashboardPage } from './index';

const meta = {
  title: 'Pages/Card/CardDashboardPage',
  component: CardDashboardPage,
  tags: ['autodocs'],
  parameters: {
    brand:  'card',
    domain: 'card',
    layout: 'fullscreen',
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: 390, minHeight: '100dvh', margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    onNotification:    () => {},
    onMenu:            () => {},
    onStatementDetail: () => {},
    onShortLoan:       () => {},
    onLongLoan:        () => {},
    onRevolving:       () => {},
    onCardRecommend:   () => {},
    onFinanceLoan:     () => {},
    onInsurance:       () => {},
    onCardPerformance: () => {},
    onUsageHistory:    () => {},
    onMyCards:         () => {},
    onCoupons:         () => {},
    onLimitCheck:      () => {},
    onInstallment:     () => {},
    onCardApply:       () => {},
  },
} satisfies Meta<typeof CardDashboardPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
