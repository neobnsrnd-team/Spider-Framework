/**
 * @file CardBenefitSummary.stories.tsx
 */
import type { Meta, StoryObj } from '@storybook/react';
import { CardBenefitSummary } from './index';

const meta = {
  title: 'Biz/Card/CardBenefitSummary',
  component: CardBenefitSummary,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'card' },
  args: {
    points: 12500,
    benefits: [
      { label: '할인', amount: 8400 },
      { label: '캐시백', amount: 3200 },
    ],
    onPointDetail: () => {},
    onBenefitDetail: () => {},
  },
} satisfies Meta<typeof CardBenefitSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NoHandlers: Story = {
  args: { onPointDetail: undefined, onBenefitDetail: undefined },
};

export const SingleBenefit: Story = {
  args: {
    points: 0,
    benefits: [{ label: '캐시백', amount: 5000 }],
  },
};
