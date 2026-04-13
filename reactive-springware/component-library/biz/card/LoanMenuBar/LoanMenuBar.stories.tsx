/**
 * @file LoanMenuBar.stories.tsx
 * @description LoanMenuBar 컴포넌트 스토리.
 */
import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { CreditCard, Banknote, RefreshCw } from 'lucide-react'
import { LoanMenuBar } from './index'

const meta = {
  title: 'Biz/Card/LoanMenuBar',
  component: LoanMenuBar,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'card', layout: 'centered' },
  decorators: [
    (Story: React.ComponentType) => (
      <div data-brand="hana" data-domain="card" style={{ width: 342 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LoanMenuBar>

export default meta
type Story = StoryObj<typeof meta>

const defaultItems = [
  { id: 'short',     icon: <CreditCard size={14} />, label: '단기카드대출', onClick: () => {} },
  { id: 'long',      icon: <Banknote   size={14} />, label: '장기카드대출', onClick: () => {} },
  { id: 'revolving', icon: <RefreshCw  size={14} />, label: '리볼빙',       onClick: () => {} },
]

export const Default: Story = {
  args: { items: defaultItems },
}

export const TwoItems: Story = {
  args: {
    items: [
      { id: 'short', icon: <CreditCard size={14} />, label: '단기카드대출', onClick: () => {} },
      { id: 'long',  icon: <Banknote   size={14} />, label: '장기카드대출', onClick: () => {} },
    ],
  },
}
