/**
 * @file AlertBanner.stories.tsx
 * @description AlertBanner 컴포넌트 스토리.
 * 이체 확인·오류·성공·안내 등 화면 중간 삽입형 배너.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Lock } from 'lucide-react';
import { AlertBanner } from './index';

const meta = {
  title: 'Modules/Common/AlertBanner',
  component: AlertBanner,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'banking' },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: 342, padding: '0 24px', background: '#fff' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    intent: {
      control: 'select',
      options: ['warning', 'danger', 'success', 'info'],
    },
  },
  args: {
    intent: 'warning',
    children: '착오송금 방지를 위해 이체정보를 다시 한번 확인하세요!',
  },
} satisfies Meta<typeof AlertBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma 원본 — 이체 확인 화면 주의 배너 */
export const Warning: Story = {};

/** 오류·위험 */
export const Danger: Story = {
  args: {
    intent: 'danger',
    children: '비밀번호가 5회 이상 틀렸습니다. 잠시 후 다시 시도해 주세요.',
  },
};

/** 완료·성공 */
export const Success: Story = {
  args: {
    intent: 'success',
    children: '이체가 정상적으로 완료되었습니다.',
  },
};

/** 안내·정보 */
export const Info: Story = {
  args: {
    intent: 'info',
    children: '이체 한도는 1일 3,000만 원이며 영업시간 내에만 처리됩니다.',
  },
};

/** 아이콘 직접 지정 */
export const CustomIcon: Story = {
  args: {
    intent: 'info',
    icon: <Lock className="size-[18px]" />,
    children: '보안을 위해 키패드 숫자가 재배열되었습니다.',
  },
};

/** 짧은 단일 행 텍스트 */
export const ShortText: Story = {
  args: {
    intent: 'warning',
    children: '잔액이 부족합니다.',
  },
};

/** 전체 intent 비교 */
export const AllIntents: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '16px 24px', background: '#fff' }}>
      <AlertBanner intent="warning">착오송금 방지를 위해 이체정보를 다시 한번 확인하세요!</AlertBanner>
      <AlertBanner intent="danger">비밀번호가 일치하지 않습니다.</AlertBanner>
      <AlertBanner intent="success">이체가 정상적으로 완료되었습니다.</AlertBanner>
      <AlertBanner intent="info">이체 한도는 1일 3,000만 원입니다.</AlertBanner>
    </div>
  ),
};
