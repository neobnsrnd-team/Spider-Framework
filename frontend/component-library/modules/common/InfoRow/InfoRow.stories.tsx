/**
 * @file InfoRow.stories.tsx
 * @description InfoRow 컴포넌트 스토리.
 * 이체 확인·계좌 상세 화면의 레이블-값 정보 행.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { InfoRow } from './index';

const meta = {
  title: 'Modules/Common/InfoRow',
  component: InfoRow,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'banking' },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: 342, background: '#fff', padding: '0 24px' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    label: '출금계좌',
    value: '하나 123-456-789012',
    showBorder: true,
  },
} satisfies Meta<typeof InfoRow>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 기본 — 레이블 + 값 */
export const Default: Story = {};

/** 구분선 없음 — 마지막 행 */
export const NoBorder: Story = {
  args: { showBorder: false },
};

/** 값 강조 — 브랜드 색상 (수수료 0원) */
export const BrandValue: Story = {
  args: {
    label: '수수료',
    value: '0원',
    valueClassName: 'text-brand-text',
  },
};

/** 값 큰 텍스트 — 이체금액처럼 핵심 수치를 한 단계 크게 */
export const LargeValue: Story = {
  args: {
    label: '이체금액',
    value: '100,000원',
    valueClassName: 'text-base',
  },
};

/** 이체 확인 화면 목록 전체 — Figma node-id 1:2124 재현 */
export const TransferConfirmList: Story = {
  render: () => (
    <div style={{ width: 342, background: '#fff', padding: '0 24px' }}>
      <InfoRow label="출금계좌"     value="하나 123-456-789012" />
      <InfoRow label="입금계좌"     value="국민 987-654-3210 (홍길동)" />
      <InfoRow label="이체금액"     value="100,000원" valueClassName="text-base" />
      <InfoRow label="수수료"       value="0원" valueClassName="text-brand-text" />
      <InfoRow label="내통장표시"   value="홍길동" />
      <InfoRow label="받는분통장표시" value="김하나" showBorder={false} />
    </div>
  ),
};
