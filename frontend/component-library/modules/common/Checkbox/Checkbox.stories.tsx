/**
 * @file Checkbox.stories.tsx
 * @description Checkbox 컴포넌트 스토리.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Checkbox } from './index';

const meta = {
  title: 'Modules/Common/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'banking', layout: 'centered' },
  args: {
    checked:  false,
    onChange: () => {},
    label:    '예약이체',
  },
  argTypes: {
    checked:  { control: 'boolean' },
    disabled: { control: 'boolean' },
    label:    { control: 'text' },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 기본 — 미체크 상태 (실제 동작) */
export const Default: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return <Checkbox checked={checked} onChange={setChecked} label="예약이체" />;
  },
};

/** 체크된 상태 */
export const Checked: Story = {
  args: { checked: true },
};

/** 비활성화 — 미체크 */
export const Disabled: Story = {
  args: { checked: false, disabled: true },
};

/** 비활성화 — 체크됨 */
export const DisabledChecked: Story = {
  args: { checked: true, disabled: true },
};

/** 레이블 없음 — label prop 미전달 */
export const WithoutLabel: Story = {
  args: { checked: false, label: undefined },
};

/** ReactNode 레이블 — 텍스트 외 JSX 요소 사용 가능 */
export const WithReactNodeLabel: Story = {
  render: () => {
    const [checked, setChecked] = useState(false);
    return (
      <Checkbox
        checked={checked}
        onChange={setChecked}
        label={
          <span>
            <strong>예약이체</strong>{' '}
            <span style={{ color: 'var(--color-text-muted)', fontSize: 12 }}>
              (원하는 날짜에 자동 이체)
            </span>
          </span>
        }
      />
    );
  },
};
