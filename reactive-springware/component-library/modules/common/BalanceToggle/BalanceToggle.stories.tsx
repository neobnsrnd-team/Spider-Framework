/**
 * @file BalanceToggle.stories.tsx
 * @description BalanceToggle 컴포넌트 스토리.
 */
import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import { BalanceToggle } from './index'

const meta = {
  title: 'Modules/Common/BalanceToggle',
  component: BalanceToggle,
  tags: ['autodocs'],
  parameters: { brand: 'hana', layout: 'centered' },
  argTypes: {
    hidden: { control: 'boolean' },
  },
  args: {
    hidden: false,
    onToggle: () => {},
  },
} satisfies Meta<typeof BalanceToggle>

export default meta
type Story = StoryObj<typeof meta>

export const Visible: Story = {
  args: { hidden: false },
}

export const Hidden: Story = {
  args: { hidden: true },
}

/** 실제 토글 동작 확인용 */
export const Interactive: Story = {
  render: () => {
    const [hidden, setHidden] = useState(false)
    return (
      <BalanceToggle
        hidden={hidden}
        onToggle={() => setHidden(v => !v)}
      />
    )
  },
}
