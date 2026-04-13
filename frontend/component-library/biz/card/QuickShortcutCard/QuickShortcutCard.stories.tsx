/**
 * @file QuickShortcutCard.stories.tsx
 * @description QuickShortcutCard 컴포넌트 스토리.
 */
import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { Ticket, CreditCard, Gift } from 'lucide-react'
import { QuickShortcutCard } from './index'

const meta = {
  title: 'Biz/Card/QuickShortcutCard',
  component: QuickShortcutCard,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'card', layout: 'centered' },
  decorators: [
    (Story: React.ComponentType) => (
      <div data-brand="hana" data-domain="card" style={{ width: 163 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    title:    { control: 'text' },
    subtitle: { control: 'text' },
  },
} satisfies Meta<typeof QuickShortcutCard>

export default meta
type Story = StoryObj<typeof meta>

export const Coupon: Story = {
  args: {
    title: '내 쿠폰',
    subtitle: '3장 사용가능',
    icon: <Ticket size={19} />,
    onClick: () => {},
  },
}

export const CardApply: Story = {
  args: {
    title: '카드 신청',
    subtitle: '맞춤형 추천',
    icon: <CreditCard size={21} />,
    onClick: () => {},
  },
}

export const Benefit: Story = {
  args: {
    title: '내 혜택',
    subtitle: '신규 혜택 2건',
    icon: <Gift size={19} />,
    onClick: () => {},
  },
}

/** 2열 그리드 배치 예시 */
export const GridLayout: Story = {
  decorators: [
    (Story: React.ComponentType) => (
      <div data-brand="hana" data-domain="card" style={{ width: 342 }}>
        <Story />
      </div>
    ),
  ],
  render: () => (
    <div className="grid grid-cols-2 gap-md" data-brand="hana" data-domain="card">
      <QuickShortcutCard title="내 쿠폰"  subtitle="3장 사용가능" icon={<Ticket size={19} />}    onClick={() => {}} />
      <QuickShortcutCard title="카드 신청" subtitle="맞춤형 추천"  icon={<CreditCard size={21} />} onClick={() => {}} />
    </div>
  ),
}
