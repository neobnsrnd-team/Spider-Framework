/**
 * @file LoginPage.stories.tsx
 * @description 로그인 페이지 Storybook 스토리.
 *
 * Figma 원본: Hana Bank App — node-id: 1-911
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { LoginPage } from '.';

const meta = {
  title: 'Pages/Common/LoginPage',
  component: LoginPage,
  tags: ['autodocs'],
  parameters: {
    brand:  'hana',
    domain: 'banking',
    layout: 'fullscreen',
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: 390, minHeight: '100dvh', margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LoginPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 기본 — 정상 상태 (에러 없음) */
export const Default: Story = {};

/** 에러 상태 — 아이디/비밀번호 불일치 */
export const WithError: Story = {
  args: { hasError: true },
};

/** IBK 기업은행 브랜드 */
export const IbkBrand: Story = {
  parameters: { brand: 'ibk' },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: 390, minHeight: '100dvh', margin: '0 auto' }}>
        <Story />
      </div>
    ),
    (Story: React.ComponentType, { args }: { args: Record<string, unknown> }) => {
      // IBK 브랜드용 brandInitial/brandName 오버라이드는
      // AppBrandHeader 자체 스토리에서 확인 가능.
      return <Story {...args} />;
    },
  ],
};