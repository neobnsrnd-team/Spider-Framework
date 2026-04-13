/**
 * @file TransactionHistoryPage.stories.tsx
 * @description 거래내역 조회 페이지 Storybook 스토리.
 *
 * Figma 원본:
 *   - 기본 상태      (node-id: 1:2201) — 필터 접힘 + 거래 목록
 *   - 필터 펼침 상태 (node-id: 1:1881) — 조회 조건 설정 패널 오픈
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { TransactionHistoryPage } from './index';

const meta = {
  title: 'Pages/Banking/TransactionHistoryPage',
  component: TransactionHistoryPage,
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
} satisfies Meta<typeof TransactionHistoryPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 거래 내역 정상 표시 — 필터 접힌 상태. Figma node-id: 1:2201 */
export const Default: Story = {
  args: { initialState: 'data', filterExpanded: false },
};

/** 조회 조건 설정 펼침 상태 — 퀵 기간 탭·날짜 입력·드롭다운 노출. Figma node-id: 1:1881 */
export const FilterExpanded: Story = {
  args: { initialState: 'data', filterExpanded: true },
};

/** 로딩 상태 — TransactionList 스켈레톤 UI */
export const Loading: Story = {
  args: { initialState: 'loading', filterExpanded: false },
};

/** 빈 목록 — 조회된 거래 내역 없음 */
export const Empty: Story = {
  args: { initialState: 'empty', filterExpanded: false },
};

/** 에러 상태 — 데이터 로드 실패 */
export const Error: Story = {
  args: { initialState: 'error', filterExpanded: false },
};
