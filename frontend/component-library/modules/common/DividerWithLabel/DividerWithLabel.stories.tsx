/**
 * @file DividerWithLabel.stories.tsx
 * @description DividerWithLabel 컴포넌트 스토리.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { DividerWithLabel } from './index';

const meta = {
  title: 'Modules/Common/DividerWithLabel',
  component: DividerWithLabel,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'banking' },
  decorators: [(Story: React.ComponentType) => <div style={{ width: 390, padding: '24px' }}><Story /></div>],
  args: {
    label: '다른 로그인 방식',
  },
} satisfies Meta<typeof DividerWithLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 기본 — 로그인 화면 대체 수단 구분선 */
export const Default: Story = {};

/** 짧은 레이블 — '또는' */
export const ShortLabel: Story = {
  args: { label: '또는' },
};

/** IBK 기업은행 브랜드 */
export const IbkBrand: Story = {
  parameters: { brand: 'ibk' },
};