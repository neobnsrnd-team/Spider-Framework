/**
 * @file Badge.stories.tsx
 * @description Badge 컴포넌트 스토리.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Badge } from './index';

const meta = {
  title: 'Core/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'banking', layout: 'centered' },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'brand', 'success', 'danger', 'warning', 'neutral'] },
    dot:     { control: 'boolean' },
    children:{ control: 'text' },
  },
  args: { children: '주거래', variant: 'brand', dot: false },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="brand">주거래</Badge>
      <Badge variant="success">정상</Badge>
      <Badge variant="danger">연체</Badge>
      <Badge variant="warning">주의</Badge>
      <Badge variant="neutral">일반</Badge>
    </div>
  ),
};

export const DotMode: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Badge variant="success" dot />
      <Badge variant="danger"  dot />
      <Badge variant="warning" dot />
      <Badge variant="brand"   dot />
    </div>
  ),
};

export const BankingUseCases: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Badge variant="brand">주거래</Badge>
      <Badge variant="brand">급여</Badge>
      <Badge variant="success">D-30</Badge>
      <Badge variant="neutral">변동금리</Badge>
      <Badge variant="danger">연체</Badge>
    </div>
  ),
};