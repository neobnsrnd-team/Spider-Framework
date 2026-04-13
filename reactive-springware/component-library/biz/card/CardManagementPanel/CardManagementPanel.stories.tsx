/**
 * @file CardManagementPanel.stories.tsx
 * @description CardManagementPanel 컴포넌트 스토리.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { CardManagementPanel } from './index';

const meta = {
  title: 'Biz/Card/CardManagementPanel',
  component: CardManagementPanel,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'card' },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: 390, padding: 16 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    rows: [
      { label: '카드정보 확인', subText: '1234 **** **** 5678', onClick: () => {} },
      { label: '결제계좌', subText: '하나은행 123-****-5678', onClick: () => {} },
      { label: '카드 비밀번호 설정', onClick: () => {} },
      { label: '해외 결제 신청', onClick: () => {} },
      { label: '이용한도 조회/변경', onClick: () => {} },
      { label: '분실/도난 신고', onClick: () => {} },
      { label: '카드 재발급 신청', onClick: () => {} },
      { label: '카드이용정지 등록/해제', onClick: () => {} },
      { label: '카드 해지', onClick: () => {} },
    ],
  },
} satisfies Meta<typeof CardManagementPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 기본 4개 행 */
export const Default: Story = {};

/** 행 추가 예시 */
export const ExtraRows: Story = {
  args: {
    rows: [
      { label: '카드정보 확인', subText: '1234 **** **** 5678', onClick: () => {} },
      { label: '결제계좌', subText: '하나은행 123-****-5678', onClick: () => {} },
      { label: '카드 비밀번호 설정', onClick: () => {} },
      { label: '해외 결제 신청', onClick: () => {} },
      { label: '카드 이용한도 조회', onClick: () => {} },
      { label: '카드 분실/도난 신고', onClick: () => {} },
    ],
  },
};
