/**
 * @file SidebarNav.stories.tsx
 * @description SidebarNav 컴포넌트 스토리.
 * 전체 메뉴 화면의 좌측 카테고리 세로 탭 네비게이션.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { SidebarNav } from './index';

const BANKING_CATEGORIES = [
  { id: 'banking',    label: '뱅킹' },
  { id: 'management', label: '관리' },
  { id: 'card',       label: '카드' },
  { id: 'product',    label: '상품가입' },
  { id: 'forex',      label: '외환' },
];

const meta = {
  title: 'Modules/Common/SidebarNav',
  component: SidebarNav,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'banking' },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: 117, border: '1px solid #f1f5f9', borderRadius: 8, overflow: 'hidden', background: '#f8fafc' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    activeId: { control: 'select', options: BANKING_CATEGORIES.map((c) => c.id) },
  },
  args: {
    items: BANKING_CATEGORIES,
    activeId: 'banking',
    onItemChange: () => {},
  },
} satisfies Meta<typeof SidebarNav>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 기본 상태 — 첫 번째 항목 활성 */
export const Default: Story = {};

/** 중간 항목 활성 */
export const MiddleActive: Story = {
  args: { activeId: 'card' },
};

/** 인터랙티브 — 항목 클릭 시 활성 이동 */
export const Interactive: Story = {
  render: () => {
    const [activeId, setActiveId] = useState('banking');
    return (
      <div style={{ width: 117, border: '1px solid #f1f5f9', overflow: 'hidden', background: '#f8fafc' }}>
        <SidebarNav
          items={BANKING_CATEGORIES}
          activeId={activeId}
          onItemChange={setActiveId}
        />
        <p style={{ padding: '8px 16px', fontSize: 11, color: '#94a3b8' }}>
          선택: {activeId}
        </p>
      </div>
    );
  },
};
