/**
 * @file HomePageLayout.stories.tsx
 * @description HomePageLayout 컴포넌트 스토리.
 * 홈/메인 대시보드 전용 레이아웃 (layoutType: 'home').
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { HomePageLayout } from './index';

const meta = {
  title: 'Layout/HomePageLayout',
  component: HomePageLayout,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'banking' },
  decorators: [(Story: React.ComponentType) => <div style={{ width: 390, height: 700, overflow: 'hidden', border: '1px solid #e2e8f0', borderRadius: 16 }}><Story /></div>],
  argTypes: {
    withBottomNav:   { control: 'boolean' },
    hasNotification: { control: 'boolean' },
    title:           { control: 'text' },
  },
  args: {
    title: '하나은행',
    withBottomNav: true,
    hasNotification: false,
  },
} satisfies Meta<typeof HomePageLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <HomePageLayout {...args}>
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ height: 120, background: 'var(--color-brand, #00857a)', borderRadius: 12, opacity: 0.15 }} />
        <div style={{ height: 80, background: '#f1f5f9', borderRadius: 12 }} />
        <div style={{ height: 80, background: '#f1f5f9', borderRadius: 12 }} />
        <div style={{ height: 80, background: '#f1f5f9', borderRadius: 12 }} />
      </div>
    </HomePageLayout>
  ),
};

export const WithNotification: Story = {
  args: { hasNotification: true },
  render: (args) => (
    <HomePageLayout {...args}>
      <div style={{ padding: 16, color: '#94a3b8', fontSize: 14 }}>벨 아이콘에 알림 뱃지 표시</div>
    </HomePageLayout>
  ),
};

export const CustomRightAction: Story = {
  render: (args) => (
    <HomePageLayout
      {...args}
      rightAction={
        <div style={{ display: 'flex', gap: 4 }}>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px 8px', fontSize: 13, color: '#64748b' }}>검색</button>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px 8px', fontSize: 13, color: '#64748b' }}>설정</button>
        </div>
      }
    >
      <div style={{ padding: 16, color: '#94a3b8', fontSize: 14 }}>커스텀 우측 액션</div>
    </HomePageLayout>
  ),
};