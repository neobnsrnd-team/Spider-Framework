/**
 * @file SectionHeader.stories.tsx
 * @description SectionHeader 컴포넌트 스토리.
 *
 * Figma variant 대응:
 *   Default          → HasAction=True,  HasBadge=False
 *   TitleOnly        → HasAction=False, HasBadge=False
 *   WithBadge        → HasAction=False, HasBadge=True
 *   WithBadgeAndAction → HasAction=True, HasBadge=True
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { SectionHeader } from './index';

const meta = {
  title: 'Modules/Common/SectionHeader',
  component: SectionHeader,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'banking', layout: 'centered' },
  decorators: [(Story: React.ComponentType) => <div style={{ width: 340, padding: '16px 0' }}><Story /></div>],
  argTypes: {
    title:       { control: 'text' },
    badge:       { control: 'number' },
    actionLabel: { control: 'text' },
    onAction:    { action: '액션 클릭' },
  },
  args: { title: '보유 계좌', actionLabel: '전체보기', onAction: () => {} },
} satisfies Meta<typeof SectionHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma: HasAction=True, HasBadge=False */
export const Default: Story = {};

/** Figma: HasAction=False, HasBadge=False */
export const TitleOnly: Story = {
  args: { actionLabel: undefined },
};

/** Figma: HasAction=False, HasBadge=True */
export const WithBadge: Story = {
  args: { title: '예금', badge: 2, actionLabel: undefined },
};

/** Figma: HasAction=True, HasBadge=True */
export const WithBadgeAndAction: Story = {
  args: { title: '보유 계좌', badge: 3, actionLabel: '전체보기' },
};

/** 다양한 사용 예시 */
export const Usages: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: 340 }}>
      <SectionHeader title="보유 계좌" actionLabel="전체보기" onAction={() => {}} />
      <SectionHeader title="최근 거래" actionLabel="더보기" onAction={() => {}} />
      <SectionHeader title="이번달 지출" />
      <SectionHeader title="예금" badge={2} />
      <SectionHeader title="외화예금" badge={1} />
    </div>
  ),
};

/**
 * 배지(bg-brand-10, text-brand-text)와 액션(hover:text-brand-text)에
 * 브랜드 색상이 올바르게 적용되는지 확인하는 스토리.
 */
export const BrandVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: 358 }}>
      {(['hana', 'kb', 'ibk', 'nh', 'shinhan', 'woori'] as const).map(brand => (
        <div key={brand} data-brand={brand} style={{ padding: '8px 16px' }}>
          <SectionHeader title="보유 계좌" badge={3} actionLabel="전체보기" onAction={() => {}} />
        </div>
      ))}
    </div>
  ),
  parameters: { layout: 'padded' },
};
