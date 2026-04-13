/**
 * @file NumberKeypad.stories.tsx
 * @description NumberKeypad 컴포넌트 스토리.
 * 계좌 비밀번호 입력 화면의 보안 숫자 키패드.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { NumberKeypad } from './index';

/** Figma 원본과 동일한 기본 셔플 순서 */
const DEFAULT_DIGITS = [8, 3, 1, 5, 0, 9, 2, 7, 4, 6];

/** Fisher-Yates 셔플 — 재배열 버튼 클릭 시 호출 */
function shuffle(arr: number[]): number[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const meta = {
  title: 'Modules/Banking/NumberKeypad',
  component: NumberKeypad,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'banking' },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: 390, margin: '0 auto', background: '#fff', padding: '0 16px' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    digits: DEFAULT_DIGITS,
    onDigitPress: () => {},
    onDelete: () => {},
    onShuffle: () => {},
  },
} satisfies Meta<typeof NumberKeypad>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma 원본 상태 — 8,3,1 / 5,0,9 / 2,7,4 / 재배열,6,⌫ */
export const Default: Story = {};

/** 인터랙티브 — 실제 PIN 입력 + 재배열 동작 확인 */
export const Interactive: Story = {
  render: () => {
    const [digits, setDigits] = useState(DEFAULT_DIGITS);
    const [pin, setPin] = useState('');

    const handleDigitPress = (d: number) => {
      if (pin.length < 4) setPin((p) => p + d);
    };
    const handleDelete = () => setPin((p) => p.slice(0, -1));
    const handleShuffle = () => setDigits(shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]));

    return (
      <div style={{ width: 390, margin: '0 auto', background: '#fff', padding: '24px 16px' }}>
        <p style={{ textAlign: 'center', fontSize: 13, color: '#64748b', marginBottom: 16 }}>
          입력된 PIN: {pin.replace(/./g, '●') || '없음'} ({pin.length}/4)
        </p>
        <NumberKeypad
          digits={digits}
          onDigitPress={handleDigitPress}
          onDelete={handleDelete}
          onShuffle={handleShuffle}
        />
      </div>
    );
  },
};
