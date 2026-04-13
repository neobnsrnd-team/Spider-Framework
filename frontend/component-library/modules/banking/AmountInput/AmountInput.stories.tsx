/**
 * @file AmountInput.stories.tsx
 * @description AmountInput 컴포넌트 스토리.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { AmountInput } from './index';

const meta = {
  title: 'Modules/Banking/AmountInput',
  component: AmountInput,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'banking', layout: 'centered' },
  argTypes: {
    maxAmount: { control: 'number' },
    hasError:  { control: 'boolean' },
    disabled:  { control: 'boolean' },
  },
  args: { value: null, onChange: () => {}, label: '이체 금액' },
} satisfies Meta<typeof AmountInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 빠른 금액 선택 버튼 포함 (실제 동작) */
export const WithQuickAmounts: Story = {
  render: () => {
    const [amount, setAmount] = useState<number | null>(null);
    return (
      <div style={{ width: 320 }}>
        <AmountInput
          value={amount}
          onChange={setAmount}
          label="이체 금액"
          quickAmounts={[10000, 50000, 100000, 500000]}
          maxAmount={1234567}
        />
        <p style={{ marginTop: 8, fontSize: 12, color: 'var(--color-text-muted)' }}>
          선택된 금액: {amount?.toLocaleString('ko-KR') ?? '없음'}원
        </p>
      </div>
    );
  },
};

/** 잔액 초과 에러 상태 */
export const OverMaxError: Story = {
  render: () => {
    const [amount, setAmount] = useState<number | null>(2000000);
    return (
      <div style={{ width: 320 }}>
        <AmountInput
          value={amount}
          onChange={setAmount}
          label="이체 금액"
          maxAmount={1234567}
        />
      </div>
    );
  },
};

/** 이체 한도 텍스트 — transferLimitText prop으로 우측 한도 안내 표시 */
export const WithTransferLimit: Story = {
  render: () => {
    const [amount, setAmount] = useState<number | null>(null);
    return (
      <div style={{ width: 320 }}>
        <AmountInput
          value={amount}
          onChange={setAmount}
          label="이체 금액"
          transferLimitText="1회 5,000,000원 / 1일 10,000,000원"
          maxAmount={3000000}
        />
      </div>
    );
  },
};

/** 비활성화 상태 */
export const Disabled: Story = {
  args: { value: 500000, disabled: true },
  decorators: [(Story) => <div style={{ width: 320 }}><Story /></div>],
};