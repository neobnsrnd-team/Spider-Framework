/**
 * @file Button.stories.tsx
 * @description Button 컴포넌트 스토리.
 */
import type { Meta, StoryObj } from '@storybook/react';
import { ChevronDown, Plus, Trash2 } from 'lucide-react';
import React from 'react';
import { Button } from './index';

const meta = {
  title: 'Core/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'banking', layout: 'centered' },
  argTypes: {
    variant:   { control: 'select', options: ['primary', 'outline', 'ghost', 'danger'] },
    size:      { control: 'select', options: ['sm', 'md', 'lg'] },
    loading:   { control: 'boolean' },
    disabled:  { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    iconOnly:  { control: 'boolean' },
    justify:   { control: 'select', options: ['center', 'between'] },
    children:  { control: 'text' },
    onClick:   { action: 'clicked' },
  },
  args: {
    children: '버튼', variant: 'primary', size: 'md',
    loading: false, disabled: false, fullWidth: false,
    iconOnly: false, justify: 'center',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Button variant="primary">Primary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      <Button leftIcon={<Plus size={16} />}>항목 추가</Button>
      <Button variant="outline" rightIcon={<ChevronDown size={16} />}>펼치기</Button>
      <Button variant="danger" leftIcon={<Trash2 size={16} />}>삭제</Button>
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12 }}>
      <Button loading>로딩 중</Button>
      <Button variant="outline" loading>로딩 중</Button>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 12 }}>
      <Button disabled>비활성</Button>
      <Button variant="outline" disabled>비활성</Button>
    </div>
  ),
};

export const FullWidth: Story = {
  args: { fullWidth: true, children: '이체하기' },
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
};

export const JustifyBetween: Story = {
  args: {
    variant: 'outline', justify: 'between', fullWidth: true,
    rightIcon: <ChevronDown size={16} />, children: '섹션 펼치기',
  },
  decorators: [(Story) => <div style={{ width: 280 }}><Story /></div>],
};