/**
 * @file CardPerformanceBar.stories.tsx
 */
import type { Meta, StoryObj } from '@storybook/react';
import { CardPerformanceBar } from './index';

const meta = {
  title: 'Biz/Card/CardPerformanceBar',
  component: CardPerformanceBar,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'card' },
  args: {
    cardName: '하나 머니 체크카드',
    currentAmount: 180000,
    targetAmount: 300000,
    benefitDescription: '전월 실적 달성 시 캐시백 1%',
    onDetail: () => {},
  },
} satisfies Meta<typeof CardPerformanceBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 진행 중 (60%) */
export const InProgress: Story = {};

/** 달성 완료 */
export const Achieved: Story = {
  args: { currentAmount: 350000 },
};

/** 초기 (0%) */
export const Empty: Story = {
  args: { currentAmount: 0 },
};

/** 혜택 설명 없음 */
export const NoDescription: Story = {
  args: { benefitDescription: undefined, onDetail: undefined },
};
