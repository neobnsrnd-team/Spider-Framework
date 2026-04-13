/**
 * @file BlankPageLayout.stories.tsx
 * @description BlankPageLayout 컴포넌트 스토리.
 * 로그인·온보딩 전용 헤더 없는 레이아웃 (layoutType: 'no-header').
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { BlankPageLayout } from './index';

const meta = {
  title: 'Layout/BlankPageLayout',
  component: BlankPageLayout,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'banking' },
  decorators: [(Story: React.ComponentType) => <div style={{ width: 390, height: 700, overflow: 'hidden', border: '1px solid #e2e8f0', borderRadius: 16 }}><Story /></div>],
  argTypes: {
    align: { control: 'select', options: ['top', 'center'] },
  },
  args: { align: 'top' },
} satisfies Meta<typeof BlankPageLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Onboarding: Story = {
  args: { align: 'top' },
  render: (args) => (
    <BlankPageLayout {...args}>
      <div style={{ height: 260, background: 'var(--color-brand, #00857a)', opacity: 0.12 }} />
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ height: 28, background: '#1e293b', borderRadius: 6, opacity: 0.8 }} />
        <div style={{ height: 16, background: '#94a3b8', borderRadius: 4, width: '70%' }} />
        <div style={{ height: 16, background: '#94a3b8', borderRadius: 4, width: '50%' }} />
      </div>
    </BlankPageLayout>
  ),
};

export const Login: Story = {
  args: { align: 'center' },
  render: (args) => (
    <BlankPageLayout {...args}>
      <div style={{ width: '100%', padding: 32, display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center' }}>
        <div style={{ width: 80, height: 80, background: 'var(--color-brand, #00857a)', borderRadius: 20, opacity: 0.15 }} />
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ height: 52, background: '#f1f5f9', borderRadius: 12 }} />
          <div style={{ height: 52, background: '#f1f5f9', borderRadius: 12 }} />
          <div style={{ height: 52, background: 'var(--color-brand, #00857a)', borderRadius: 12, opacity: 0.8 }} />
        </div>
      </div>
    </BlankPageLayout>
  ),
};