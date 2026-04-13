/**
 * @file PinDotIndicator.stories.tsx
 * @description PinDotIndicator 컴포넌트 스토리.
 * 계좌 비밀번호 / PIN 입력 화면의 진행 도트 인디케이터.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { PinDotIndicator } from './index';

const meta = {
  title: 'Modules/Banking/PinDotIndicator',
  component: PinDotIndicator,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'banking' },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    length: { control: { type: 'number', min: 1, max: 8 } },
    filledCount: { control: { type: 'number', min: 0, max: 8 } },
  },
  args: {
    length: 4,
    filledCount: 0,
  },
} satisfies Meta<typeof PinDotIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 입력 없음 — 모든 도트가 빈 원 */
export const Empty: Story = { args: { filledCount: 0 } };

/** 일부 입력 — 2자리 입력된 상태 */
export const HalfFilled: Story = { args: { filledCount: 2 } };

/** 전체 입력 완료 — 모든 도트가 채워진 원 */
export const FullFilled: Story = { args: { filledCount: 4 } };

/** 6자리 PIN */
export const SixDigits: Story = { args: { length: 6, filledCount: 3 } };

/** 인터랙티브 — 클릭으로 filledCount 조작 */
export const Interactive: Story = {
  render: () => {
    const [count, setCount] = useState(0);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <PinDotIndicator filledCount={count} />
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            onClick={() => setCount((c) => Math.min(c + 1, 4))}
            style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #e2e8f0', cursor: 'pointer' }}
          >
            + 추가
          </button>
          <button
            type="button"
            onClick={() => setCount((c) => Math.max(c - 1, 0))}
            style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #e2e8f0', cursor: 'pointer' }}
          >
            - 삭제
          </button>
        </div>
        <p style={{ fontSize: 11, color: '#94a3b8' }}>입력: {count}자리</p>
      </div>
    );
  },
};
