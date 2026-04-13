/**
 * @file AccountPasswordPage.stories.tsx
 * @description AccountPasswordPage 컴포넌트 스토리.
 * 계좌 비밀번호 입력 BottomSheet 화면 — 이체·출금 플로우에서 사용.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { AccountPasswordPage } from './index';

/** Figma 원본과 동일한 기본 셔플 순서 */
const DEFAULT_DIGITS = [8, 3, 1, 5, 0, 9, 2, 7, 4, 6];

/** Fisher-Yates 셔플 */
function shuffle(arr: number[]): number[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

const meta = {
  title: 'Pages/Banking/AccountPasswordPage',
  component: AccountPasswordPage,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'banking' },
} satisfies Meta<typeof AccountPasswordPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma 원본 — BottomSheet 열린 상태, 2자리 입력 */
export const Default: Story = {
  args: {
    open: true,
    onClose: () => {},
    pin: '12',
    digits: DEFAULT_DIGITS,
    onDigitPress: () => {},
    onDelete: () => {},
    onShuffle: () => {},
  },
};

/** 입력 없음 — 모든 도트 빈 상태 */
export const EmptyPin: Story = {
  args: {
    ...Default.args,
    pin: '',
  },
};

/** 입력 완료 — 4자리 모두 입력 */
export const FullPin: Story = {
  args: {
    ...Default.args,
    pin: '1234',
  },
};

/** 인터랙티브 — 실제 키패드 입력 동작 확인 */
export const Interactive: Story = {
  render: () => {
    const [open, setOpen] = useState(true);
    const [pin, setPin] = useState('');
    const [digits, setDigits] = useState(DEFAULT_DIGITS);

    const handleDigitPress = (d: number) => {
      if (pin.length < 4) {
        const next = pin + d;
        setPin(next);
        /* 4자리 완성 시 자동으로 BottomSheet 닫힘 시뮬레이션 */
        if (next.length === 4) {
          setTimeout(() => { setOpen(false); setPin(''); }, 300);
        }
      }
    };

    return (
      <div style={{ position: 'relative', height: '100dvh', background: '#f8fafc' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 16 }}>
          <p style={{ fontSize: 14, color: '#64748b' }}>이체 확인 화면 (배경)</p>
          <button
            type="button"
            onClick={() => { setOpen(true); setPin(''); }}
            style={{ padding: '10px 20px', background: '#008485', color: '#fff', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14 }}
          >
            계좌 비밀번호 입력 열기
          </button>
        </div>
        <AccountPasswordPage
          open={open}
          onClose={() => setOpen(false)}
          pin={pin}
          digits={digits}
          onDigitPress={handleDigitPress}
          onDelete={() => setPin((p) => p.slice(0, -1))}
          onShuffle={() => setDigits(shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]))}
        />
      </div>
    );
  },
};
