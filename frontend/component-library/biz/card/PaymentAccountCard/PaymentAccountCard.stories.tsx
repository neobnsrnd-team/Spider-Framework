/**
 * @file PaymentAccountCard.stories.tsx
 * @description PaymentAccountCard 컴포넌트 스토리.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Landmark, Building } from 'lucide-react';
import { PaymentAccountCard } from './index';

const meta = {
  title: 'Biz/Card/PaymentAccountCard',
  component: PaymentAccountCard,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'card' },
  args: {
    hours: '365일 06:00~23:30',
  },
} satisfies Meta<typeof PaymentAccountCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 당행 (하나은행) — Landmark 아이콘 */
export const HanaBank: Story = {
  args: {
    title: '하나은행 결제계좌',
    icon: <Landmark className="size-5" />,
  },
};

/** 타행 — Building 아이콘 */
export const OtherBank: Story = {
  args: {
    title: '타행 결제계좌',
    icon: <Building className="size-5" />,
  },
};
