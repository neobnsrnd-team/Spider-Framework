/**
 * @file Stack.stories.tsx
 * @description Stack 레이아웃 컴포넌트 스토리.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Stack } from './index';

const Box = ({ label }: { label: string }) => (
  <div style={{ background: 'var(--color-brand-10)', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: 'var(--color-brand-text)' }}>
    {label}
  </div>
);

const meta = {
  title: 'Layout/Stack',
  component: Stack,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'banking', layout: 'centered' },
  argTypes: {
    gap:   { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] },
    align: { control: 'select', options: ['start', 'center', 'end', 'stretch'] },
  },
  args: { gap: 'md' },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Stack {...args}>
      <Box label="첫 번째 항목" />
      <Box label="두 번째 항목" />
      <Box label="세 번째 항목" />
    </Stack>
  ),
};

export const GapVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 32 }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map(gap => (
        <div key={gap}>
          <p style={{ fontSize: 11, marginBottom: 6, color: 'var(--color-text-muted)' }}>gap="{gap}"</p>
          <Stack gap={gap}>
            <Box label="A" /><Box label="B" /><Box label="C" />
          </Stack>
        </div>
      ))}
    </div>
  ),
};