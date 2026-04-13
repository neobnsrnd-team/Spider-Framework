/**
 * @file AllAccountsPage.stories.tsx
 * @description 전계좌 조회 페이지 Storybook 스토리.
 *
 * Figma 원본:
 *   - 해당금융 탭 (node-id: 1:3)   — 내 하나은행 계좌 목록
 *   - 다른금융 탭 (node-id: 1:152) — 연결된 타행 계좌 없음 (빈 상태)
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { AllAccountsPage } from './index';

const meta = {
  title: 'Pages/Banking/AllAccountsPage',
  component: AllAccountsPage,
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
} satisfies Meta<typeof AllAccountsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 해당금융 탭 — 내 계좌 목록 정상 표시. Figma node-id: 1:3 */
export const MineTab: Story = {
  args: { initialTab: 'mine', initialState: 'data' },
};

/** 다른금융 탭 — 연결된 타행 계좌 없음 빈 상태. Figma node-id: 1:152 */
export const OtherTab: Story = {
  args: { initialTab: 'other', initialState: 'data' },
};

/** 로딩 상태 — 계좌 목록 스켈레톤 UI */
export const Loading: Story = {
  args: { initialTab: 'mine', initialState: 'loading' },
};

/** 에러 상태 — 계좌 정보 로드 실패 */
export const Error: Story = {
  args: { initialTab: 'mine', initialState: 'error' },
};
