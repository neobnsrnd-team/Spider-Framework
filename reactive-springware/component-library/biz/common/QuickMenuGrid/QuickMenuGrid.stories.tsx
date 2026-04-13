/**
 * @file QuickMenuGrid.stories.tsx
 * @description QuickMenuGrid 컴포넌트 스토리.
 */
import type { Meta, StoryObj } from '@storybook/react';
import { CreditCard, History, QrCode, ReceiptText, Send, Settings, ShieldCheck, Wallet } from 'lucide-react';
import React from 'react';
import { QuickMenuGrid } from './index';

const SAMPLE_ITEMS = [
  { id: '1', icon: <Send size={22} />,        label: '이체',     onClick: () => {} },
  { id: '2', icon: <History size={22} />,     label: '거래내역', onClick: () => {},  badge: 3 },
  { id: '3', icon: <CreditCard size={22} />,  label: '카드',     onClick: () => {} },
  { id: '4', icon: <QrCode size={22} />,      label: 'QR결제',   onClick: () => {} },
  { id: '5', icon: <Wallet size={22} />,      label: '적금',     onClick: () => {} },
  { id: '6', icon: <ReceiptText size={22} />, label: '공과금',   onClick: () => {} },
  { id: '7', icon: <ShieldCheck size={22} />, label: '보험',     onClick: () => {} },
  { id: '8', icon: <Settings size={22} />,    label: '설정',     onClick: () => {} },
];

const meta = {
  title: 'Biz/Common/QuickMenuGrid',
  component: QuickMenuGrid,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'banking' },
  decorators: [(Story: React.ComponentType) => <div style={{ width: 390, padding: 16 }}><Story /></div>],
  argTypes: {
    cols: { control: 'select', options: [2, 3, 4] },
  },
  args: { items: SAMPLE_ITEMS, cols: 4 },
} satisfies Meta<typeof QuickMenuGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ThreeCols: Story = {
  args: { cols: 3, items: SAMPLE_ITEMS.slice(0, 6) },
};

export const WithBadges: Story = {
  args: {
    items: SAMPLE_ITEMS.map((item, i) =>
      i % 3 === 1 ? { ...item, badge: i + 1 } : item
    ),
  },
};

/** 아이콘 컨테이너를 각이 둥근 사각형으로 표시 */
export const RoundedSquare: Story = {
  args: { items: SAMPLE_ITEMS.map(item => ({ ...item, iconShape: 'rounded' as const })) },
};

/** circle / rounded 혼합 — 두 형태 비교 */
export const MixedShape: Story = {
  args: {
    items: SAMPLE_ITEMS.map((item, i) => ({
      ...item,
      iconShape: (i % 2 === 0 ? 'circle' : 'rounded') as 'circle' | 'rounded',
    })),
  },
};