/**
 * @file TransferForm.stories.tsx
 * @description TransferForm 컴포넌트 스토리.
 * 단일 페이지 폼 방침(component-map.md §6.2) 기반 이체 폼.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { TransferForm } from './index';
import type { TransferFormData } from './types';

const meta = {
  title: 'Modules/Banking/TransferForm',
  component: TransferForm,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'banking' },
  decorators: [(Story: React.ComponentType) => <div style={{ width: 390, padding: '0 0 24px' }}><Story /></div>],
  argTypes: {
    availableBalance: { control: 'number' },
    submitting:       { control: 'boolean' },
  },
  args: { availableBalance: 1234567, submitting: false },
} satisfies Meta<typeof TransferForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [submitted, setSubmitted] = useState<TransferFormData | null>(null);
    return (
      <div>
        <TransferForm
          {...args}
          onSubmit={(data) => {
            setSubmitted(data);
            alert(`이체 확인\n받는 계좌: ${data.toAccount}\n금액: ${data.amount.toLocaleString()}원\n메모: ${data.memo || '없음'}`);
          }}
        />
        {submitted && (
          <div style={{ margin: '16px', padding: 12, background: '#f0fdf4', borderRadius: 8, fontSize: 12, color: '#15803d' }}>
            ✅ 제출됨: {JSON.stringify(submitted)}
          </div>
        )}
      </div>
    );
  },
};

export const Submitting: Story = {
  args: { submitting: true },
  render: (args) => <TransferForm {...args} onSubmit={() => {}} />,
};

export const LowBalance: Story = {
  args: { availableBalance: 5000 },
  render: (args) => <TransferForm {...args} onSubmit={() => {}} />,
};