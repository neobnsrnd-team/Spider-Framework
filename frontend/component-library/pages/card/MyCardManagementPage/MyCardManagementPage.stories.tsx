/**
 * @file MyCardManagementPage.stories.tsx
 * @description 하나카드 내카드관리 페이지 스토리.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { MyCardManagementPage } from './index';

/** 카드 이미지 플레이스홀더 — 실제 배포 시 카드 이미지 에셋으로 교체 */
function CardImagePlaceholder({ color }: { color: string }) {
  return (
    <div
      style={{ width: '100%', height: '100%', background: color, borderRadius: 12 }}
      aria-hidden="true"
    />
  );
}

const MOCK_CARDS = [
  {
    id:      'card-1',
    name:    '하나 머니 체크카드',
    brand:   'VISA' as const,
    image:   <CardImagePlaceholder color="linear-gradient(135deg, #008485, #14b8a6)" />,
    balance: 1_200_000,
  },
  {
    id:      'card-2',
    name:    '하나 플래티넘 신용카드',
    brand:   'Mastercard' as const,
    image:   <CardImagePlaceholder color="linear-gradient(135deg, #1a1a2e, #16213e)" />,
    balance: 850_000,
  },
];

const MOCK_ROWS = [
  { label: '카드정보 확인',      subText: '1234 **** **** 5678', onClick: () => {} },
  { label: '결제계좌',           subText: '하나은행 123-****-5678', onClick: () => {} },
  { label: '카드 비밀번호 설정', onClick: () => {} },
  { label: '해외 결제 신청',     onClick: () => {} },
  { label: '이용한도 조회/변경', onClick: () => {} },
  { label: '분실/도난 신고',     onClick: () => {} },
  { label: '카드 재발급 신청',   onClick: () => {} },
  { label: '카드이용정지 등록/해제', onClick: () => {} },
  { label: '카드 해지',          onClick: () => {} },
];

const meta = {
  title: 'Pages/Card/MyCardManagementPage',
  component: MyCardManagementPage,
  tags: ['autodocs'],
  parameters: {
    brand:  'hana',
    domain: 'card',
    layout: 'fullscreen',
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: 390, minHeight: '100dvh', margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    cards:          MOCK_CARDS,
    managementRows: MOCK_ROWS,
    onBack:         () => {},
    onClose:        () => {},
  },
} satisfies Meta<typeof MyCardManagementPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** 두 번째 카드 초기 선택 */
export const SecondCard: Story = {
  args: { initialCardId: 'card-2' },
};
