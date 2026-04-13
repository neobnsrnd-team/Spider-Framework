/**
 * @file Section.stories.tsx
 * @description Section 컴포넌트 스토리.
 * SectionHeader + 콘텐츠를 묶는 섹션 레이아웃.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Section } from './index';

const meta = {
  title: 'Layout/Section',
  component: Section,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'banking', layout: 'padded' },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: 390, background: '#fff', padding: '24px' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    title:       { control: 'text' },
    actionLabel: { control: 'text' },
    gap: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
  },
} satisfies Meta<typeof Section>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 제목 + 콘텐츠 */
export const WithTitle: Story = {
  args: {
    title: '보유 계좌',
    children: (
      <div style={{ height: 80, background: 'var(--color-surface-subtle)', borderRadius: 12 }} />
    ),
  },
};

/** 전체보기 액션 포함 */
export const WithAction: Story = {
  args: {
    title:       '최근 거래',
    actionLabel: '전체보기',
    onAction:    () => alert('전체보기'),
    children: (
      <div style={{ height: 120, background: 'var(--color-surface-subtle)', borderRadius: 12 }} />
    ),
  },
};

/** 배지 + 액션 */
export const WithBadge: Story = {
  args: {
    title:       '알림',
    badge:       3,
    actionLabel: '전체보기',
    onAction:    () => alert('전체보기'),
    children: (
      <div style={{ height: 80, background: 'var(--color-surface-subtle)', borderRadius: 12 }} />
    ),
  },
};

/** 제목 없이 콘텐츠만 수직 배치 */
export const NoTitle: Story = {
  args: {
    gap: 'sm',
    children: (
      <>
        <div style={{ height: 44, background: 'var(--color-surface-subtle)', borderRadius: 8 }} />
        <div style={{ height: 120, background: 'var(--color-surface-subtle)', borderRadius: 12 }} />
      </>
    ),
  },
};
