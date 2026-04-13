/**
 * @file TransactionDetailPage.stories.tsx
 * @description 거래 상세 정보 바텀시트 화면 Storybook 스토리.
 *
 * Figma 원본: node-id 1:1159 (Hana Bank Transaction History Detail)
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { TransactionDetailPage, MOCK_WITHDRAWAL, MOCK_DEPOSIT } from './index';

const meta = {
  title: 'Pages/Banking/TransactionDetailPage',
  component: TransactionDetailPage,
  tags: ['autodocs'],
  parameters: {
    brand:  'hana',
    domain: 'banking',
    layout: 'fullscreen',
  },
  decorators: [
    (Story: React.ComponentType) => (
      /* 390px 모바일 뷰포트 — BottomSheet가 충분한 높이를 확보해야 한다 */
      <div style={{ width: 390, minHeight: '100dvh', margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TransactionDetailPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 출금 거래 상세 — 기본 상태 (바텀시트 열림). Figma node-id: 1:1159 */
export const Default: Story = {
  args: {
    initialOpen: true,
    mockData:    MOCK_WITHDRAWAL,
    isLoading:   false,
    editingMemo: false,
  },
};

/** 입금 거래 상세 — 금액과 배지가 success 색상으로 표시된다 */
export const Deposit: Story = {
  args: {
    initialOpen: true,
    mockData:    MOCK_DEPOSIT,
    isLoading:   false,
    editingMemo: false,
  },
};

/** 메모 편집 모드 — 텍스트 입력 필드와 저장/취소 버튼이 표시된다 */
export const MemoEditing: Story = {
  args: {
    initialOpen: true,
    mockData:    MOCK_WITHDRAWAL,
    isLoading:   false,
    editingMemo: true,
  },
};

/** 로딩 상태 — 바텀시트 내부에 EmptyState가 표시된다 */
export const Loading: Story = {
  args: {
    initialOpen: true,
    mockData:    MOCK_WITHDRAWAL,
    isLoading:   true,
    editingMemo: false,
  },
};
