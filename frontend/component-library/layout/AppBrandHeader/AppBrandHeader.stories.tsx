/**
 * @file AppBrandHeader.stories.tsx
 * @description AppBrandHeader 컴포넌트 스토리.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { AppBrandHeader } from './index';

const meta = {
  title: 'Layout/AppBrandHeader',
  component: AppBrandHeader,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'banking' },
  decorators: [(Story: React.ComponentType) => <div style={{ width: 390 }}><Story /></div>],
  args: {
    brandInitial: 'H',
    brandName: '하나은행',
  },
} satisfies Meta<typeof AppBrandHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 기본 — 하나은행 브랜드 */
export const Default: Story = {};

/** IBK 기업은행 브랜드 */
export const IbkBrand: Story = {
  parameters: { brand: 'ibk' },
  args: { brandInitial: 'I', brandName: 'IBK기업은행' },
};

/** KB 국민은행 브랜드 */
export const KbBrand: Story = {
  parameters: { brand: 'kb' },
  args: { brandInitial: 'K', brandName: '국민은행' },
};