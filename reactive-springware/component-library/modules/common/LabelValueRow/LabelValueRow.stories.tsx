/**
 * @file LabelValueRow.stories.tsx
 * @description LabelValueRow 컴포넌트 스토리.
 * 레이블(좌) / 값(우) 한 행 배치 패턴.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { LabelValueRow } from './index';

const meta = {
  title: 'Modules/Common/LabelValueRow',
  component: LabelValueRow,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'banking', layout: 'centered' },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: 320, padding: '16px' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    label: { control: 'text' },
    value: { control: 'text' },
  },
  args: {
    label: '나의자산 현황',
    value: '총 4,000,000원',
  },
} satisfies Meta<typeof LabelValueRow>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 기본 — 문자열 값 */
export const Default: Story = {};

/** 잔액 레이블 + 원화 금액 */
export const BalanceRow: Story = {
  args: { label: '잔액', value: '3,000,000원' },
};

/** 대출잔액 (danger 색상 값) */
export const LoanBalance: Story = {
  render: () => (
    <LabelValueRow
      label="대출잔액"
      value={
        <span className="text-xl font-bold font-numeric tabular-nums text-red-500">
          30,000,000원
        </span>
      }
    />
  ),
};

/** 외화예금 — 외화 포맷 값 */
export const ForeignCurrency: Story = {
  args: {
    label: '잔액',
    value: '$1,000.00',
  },
};

/** 목록 형태로 여러 행 사용 예시 */
export const MultipleRows: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <LabelValueRow label="나의자산 현황" value="총 4,000,000원" />
      <LabelValueRow label="잔액"         value="3,000,000원" />
      <LabelValueRow label="통화"         value="KRW" />
      <LabelValueRow label="계좌 수"      value="2개" />
    </div>
  ),
};
