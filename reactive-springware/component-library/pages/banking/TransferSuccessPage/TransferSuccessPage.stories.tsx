/**
 * @file TransferSuccessPage.stories.tsx
 * @description 이체 완료 페이지 Storybook 스토리.
 *
 * Figma 원본: node-id 1:1641 (Hana Bank Transfer Success)
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { TransferSuccessPage } from './index';

const meta = {
  title: 'Pages/Banking/TransferSuccessPage',
  component: TransferSuccessPage,
  tags: ['autodocs'],
  parameters: {
    brand:  'hana',
    domain: 'banking',
    layout: 'fullscreen',
  },
  decorators: [
    (Story: React.ComponentType) => (
      /* 모바일 뷰포트(390px) 기준으로 렌더링 */
      <div style={{ width: 390, minHeight: '100dvh', margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    recipientName:        '홍길동',
    amount:               50000,
    targetAccount:        '국민 987-654-321012',
    myMemo:               '점심값',
    recipientMemo:        '김하나',
    balanceAfterTransfer: 2900000,
    showKakaoShare:       false,
  },
  argTypes: {
    amount:               { control: 'number' },
    balanceAfterTransfer: { control: 'number' },
    showKakaoShare:       { control: 'boolean' },
  },
} satisfies Meta<typeof TransferSuccessPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 기본 이체 완료 화면 — SuccessHero + 요약 카드 + 즐겨찾기 등록 */
export const Default: Story = {};

/** 카카오톡 공유 액션 포함 — 이체 결과 공유 버튼이 추가로 표시된다 */
export const WithKakaoShare: Story = {
  args: { showKakaoShare: true },
};

/** 대금액 이체 케이스 */
export const LargeAmount: Story = {
  args: {
    recipientName:        '김철수',
    amount:               3000000,
    balanceAfterTransfer: 500000,
    showKakaoShare:       true,
  },
};
