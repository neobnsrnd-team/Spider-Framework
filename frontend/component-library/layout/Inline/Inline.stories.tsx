/**
 * @file Inline.stories.tsx
 * @description Inline 레이아웃 컴포넌트 스토리.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Inline } from './index';

const Chip = ({ label }: { label: string }) => (
  <div style={{ background: 'var(--color-brand-10)', borderRadius: 20, padding: '4px 12px', fontSize: 13, color: 'var(--color-brand-text)', whiteSpace: 'nowrap' }}>
    {label}
  </div>
);

const meta = {
  title: 'Layout/Inline',
  component: Inline,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'banking', layout: 'centered' },
  argTypes: {
    gap:     { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
    align:   { control: 'select', options: ['start', 'center', 'end', 'baseline', 'stretch'] },
    justify: { control: 'select', options: ['start', 'center', 'end', 'between', 'around', 'evenly'] },
    wrap:    { control: 'boolean' },
  },
  args: { gap: 'sm', align: 'center' },
} satisfies Meta<typeof Inline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <div style={{ width: 320, border: '1px dashed #e2e8f0', borderRadius: 8, padding: 12 }}>
      <Inline {...args}>
        <Chip label="이체" /><Chip label="조회" /><Chip label="설정" />
      </Inline>
    </div>
  ),
};

export const JustifyBetween: Story = {
  name: '양끝 정렬 — 섹션 헤더 패턴',
  render: () => (
    <div style={{ width: 320 }}>
      <Inline justify="between" align="center">
        <span style={{ fontWeight: 700, fontSize: 16 }}>보유 계좌</span>
        <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>전체보기 →</span>
      </Inline>
    </div>
  ),
};

export const Wrap: Story = {
  name: '줄바꿈 — 태그 목록',
  render: () => (
    <div style={{ width: 280 }}>
      <Inline gap="xs" wrap>
        {['이체', '조회', '설정', 'QR결제', '공과금', '적금', '외환', '보험'].map(t => (
          <Chip key={t} label={t} />
        ))}
      </Inline>
    </div>
  ),
};