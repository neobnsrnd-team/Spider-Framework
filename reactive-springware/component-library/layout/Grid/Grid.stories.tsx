/**
 * @file Grid.stories.tsx
 * @description Grid 레이아웃 컴포넌트 스토리.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Grid } from './index';

const Cell = ({ label }: { label: string }) => (
  <div style={{ background: 'var(--color-brand-5)', border: '1px solid var(--color-brand-20)', borderRadius: 8, padding: '12px 8px', textAlign: 'center', fontSize: 13, color: 'var(--color-brand-text)' }}>
    {label}
  </div>
);

const meta = {
  title: 'Layout/Grid',
  component: Grid,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'banking' },
  decorators: [(Story: React.ComponentType) => <div style={{ width: 360, padding: 16 }}><Story /></div>],
  argTypes: {
    cols:       { control: 'select', options: [1, 2, 3, 4] },
    tabletCols: { control: 'select', options: [2, 3, 4] },
    gap:        { control: 'select', options: ['xs', 'sm', 'md', 'lg'] },
  },
  args: { cols: 4, gap: 'sm' },
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Grid {...args}>
      {['이체', '조회', '환전', '설정', '적금', '보험', 'QR', '더보기'].map(l => (
        <Cell key={l} label={l} />
      ))}
    </Grid>
  ),
};

export const TwoCols: Story = {
  args: { cols: 2, gap: 'md' },
  render: (args) => (
    <Grid {...args}>
      {['계좌 잔액', '이번달 지출', '적금 현황', '대출 잔액'].map(l => (
        <Cell key={l} label={l} />
      ))}
    </Grid>
  ),
};