/**
 * @file CardVisual.stories.tsx
 * @description CardVisual 컴포넌트 스토리.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { CardVisual } from './index';

/** 카드 이미지 placeholder */
const CardImagePlaceholder = () => (
  <div className="w-full h-full bg-linear-to-br from-brand to-brand-dark flex items-end p-md">
    <span className="text-white font-bold text-lg">하나카드</span>
  </div>
);

const meta = {
  title: 'Biz/Card/CardVisual',
  component: CardVisual,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'card' },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: 390, padding: 16 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    cardImage: <CardImagePlaceholder />,
    brand: 'VISA',
    cardName: '하나 머니 체크카드',
  },
} satisfies Meta<typeof CardVisual>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 풀 모드 — 카드 이미지 + 브랜드 + 카드명 */
export const Default: Story = {};

/** compact 모드 — 스크롤 시 스티키 헤더용 */
export const Compact: Story = {
  args: { compact: true },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: 390, padding: 16, background: '#fff' }}>
        <Story />
      </div>
    ),
  ],
};

export const Mastercard: Story = {
  args: { brand: 'Mastercard', cardName: '1Q 카드' },
};
