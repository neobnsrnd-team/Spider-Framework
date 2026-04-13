/**
 * @file BottomNav.stories.tsx
 * @description BottomNav 컴포넌트 스토리.
 * 홈 화면 하단 고정 탭 네비게이션 (자산·상품·홈·카드·챗봇).
 */
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Wallet, ShoppingBag, Home, CreditCard, MessageSquare } from 'lucide-react';
import { BottomNav } from './index';

/** 하나은행 앱 기본 탭 항목 */
const DEFAULT_ITEMS = [
  { id: 'asset',   icon: <Wallet        className="size-5" />, label: '자산',  onClick: () => {} },
  { id: 'product', icon: <ShoppingBag   className="size-5" />, label: '상품',  onClick: () => {} },
  { id: 'home',    icon: <Home          className="size-6" />, label: '홈',    onClick: () => {} },
  { id: 'card',    icon: <CreditCard    className="size-5" />, label: '카드',  onClick: () => {} },
  { id: 'chat',    icon: <MessageSquare className="size-5" />, label: '챗봇',  onClick: () => {} },
];

const meta = {
  title: 'Layout/BottomNav',
  component: BottomNav,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'banking' },
  decorators: [
    (Story: React.ComponentType) => (
      /* BottomNav는 fixed이므로 relative 컨테이너 안에서 시각화 */
      <div style={{ width: 390, height: 100, position: 'relative', overflow: 'hidden', border: '1px solid #e2e8f0', borderRadius: 16 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    activeId: { control: 'select', options: ['asset', 'product', 'home', 'card', 'chat'] },
  },
  args: {
    items: DEFAULT_ITEMS,
    activeId: 'home',
  },
} satisfies Meta<typeof BottomNav>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 기본 상태 — '홈' 탭 활성 */
export const Default: Story = {};

/** 각 탭이 활성화된 상태 비교 */
export const AllActiveStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {DEFAULT_ITEMS.map((item) => (
        <div key={item.id} style={{ position: 'relative', width: 390, height: 80, border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
          <p style={{ position: 'absolute', top: 4, left: 8, fontSize: 10, color: '#94a3b8' }}>activeId: {item.id}</p>
          <BottomNav items={DEFAULT_ITEMS} activeId={item.id} />
        </div>
      ))}
    </div>
  ),
};

/** 인터랙티브 — 탭 클릭 시 활성 탭 변경 */
export const Interactive: Story = {
  render: () => {
    const [activeId, setActiveId] = useState('home');
    const items = DEFAULT_ITEMS.map((item) => ({
      ...item,
      onClick: () => setActiveId(item.id),
    }));
    return (
      <div style={{ width: 390, height: 100, position: 'relative', border: '1px solid #e2e8f0', borderRadius: 16, overflow: 'hidden' }}>
        <BottomNav items={items} activeId={activeId} />
      </div>
    );
  },
};