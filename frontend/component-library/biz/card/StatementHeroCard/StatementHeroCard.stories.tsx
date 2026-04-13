/**
 * @file StatementHeroCard.stories.tsx
 * @description StatementHeroCard 컴포넌트 스토리.
 */
import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { StatementHeroCard } from './index'

const meta = {
  title: 'Biz/Card/StatementHeroCard',
  component: StatementHeroCard,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'card', layout: 'centered' },
  decorators: [
    (Story: React.ComponentType) => (
      <div data-brand="hana" data-domain="card" style={{ width: 342 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    amount:  { control: 'number' },
    dueDate: { control: 'text' },
    label:   { control: 'text' },
  },
  args: {
    amount: 1250000,
    dueDate: '12월 25일',
    label: '이번 달 명세서',
  },
} satisfies Meta<typeof StatementHeroCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { onDetail: undefined },
}

export const WithDetail: Story = {
  args: { onDetail: () => {} },
}

export const HighAmount: Story = {
  args: { amount: 5890000, dueDate: '1월 15일', onDetail: () => {} },
}
