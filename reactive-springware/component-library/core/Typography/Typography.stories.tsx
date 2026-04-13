/**
 * @file Text.stories.tsx
 * @description Typography 컴포넌트 스토리.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Typography } from './index';

const meta = {
  title: 'Core/Typography',
  component: Typography,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'banking', layout: 'centered' },
  argTypes: {
    variant: { control: 'select', options: ['heading', 'subheading', 'body-lg', 'body', 'body-sm', 'caption'] },
    weight:  { control: 'select', options: ['normal', 'medium', 'bold'] },
    color:   { control: 'select', options: ['heading', 'base', 'label', 'secondary', 'muted', 'brand', 'danger', 'success'] },
    numeric: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: { variant: 'body', children: '텍스트 예시' },
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Typography variant="heading">Heading — 잔액 조회</Typography>
      <Typography variant="subheading">Subheading — 보유 계좌</Typography>
      <Typography variant="body-lg">Body Large — 계좌 안내 문구</Typography>
      <Typography variant="body">Body — 일반 본문 텍스트</Typography>
      <Typography variant="body-sm">Body Small — 부가 설명</Typography>
      <Typography variant="caption">Caption — 날짜 · 출처</Typography>
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Typography color="heading">heading — 제목 색상</Typography>
      <Typography color="base">base — 본문 기본</Typography>
      <Typography color="secondary">secondary — 보조 텍스트</Typography>
      <Typography color="muted">muted — 비활성 안내</Typography>
      <Typography color="brand">brand — 브랜드 강조</Typography>
      <Typography color="danger">danger — 오류 메시지</Typography>
      <Typography color="success">success — 완료 메시지</Typography>
    </div>
  ),
};

export const Numeric: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Typography variant="heading" numeric>1,234,567원</Typography>
      <Typography variant="body" numeric>거래 금액: 50,000원</Typography>
      <Typography variant="caption" numeric color="muted">잔액 기준: 2026.03.26</Typography>
    </div>
  ),
};