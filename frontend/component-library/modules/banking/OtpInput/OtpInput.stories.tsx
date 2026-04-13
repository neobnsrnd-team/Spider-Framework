/**
 * @file OtpInput.stories.tsx
 * @description OtpInput 컴포넌트 스토리.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { OtpInput } from './index';

const meta = {
  title: 'Modules/Banking/OtpInput',
  component: OtpInput,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'banking', layout: 'centered' },
  argTypes: {
    length:   { control: 'select', options: [4, 6] },
    error:    { control: 'boolean' },
    disabled: { control: 'boolean' },
    masked:   { control: 'boolean' },
  },
  args: { length: 6, error: false, disabled: false, masked: false },
} satisfies Meta<typeof OtpInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Interactive: Story = {
  render: () => {
    const [otp, setOtp] = useState('');
    const [done, setDone] = useState(false);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>인증번호 6자리를 입력하세요</p>
        <OtpInput
          length={6}
          onChange={setOtp}
          onComplete={() => setDone(true)}
          error={done && otp !== '123456'}
        />
        {otp.length > 0 && (
          <p style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
            입력: {otp} {done ? (otp === '123456' ? '✅ 일치' : '❌ 불일치') : ''}
          </p>
        )}
      </div>
    );
  },
};

export const FourDigitPin: Story = {
  args: { length: 4, masked: true },
};

export const ErrorState: Story = {
  args: { error: true },
};