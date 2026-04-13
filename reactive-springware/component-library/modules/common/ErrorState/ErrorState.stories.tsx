/**
 * @file ErrorState.stories.tsx
 * @description ErrorState 컴포넌트 스토리.
 * API 실패·네트워크 오류 등 에러 상태 UI.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { ErrorState } from './index';

const meta = {
  title: 'Modules/Common/ErrorState',
  component: ErrorState,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'banking', layout: 'centered' },
  decorators: [(Story: React.ComponentType) => <div style={{ width: 340 }}><Story /></div>],
  argTypes: {
    title:       { control: 'text' },
    description: { control: 'text' },
    retryLabel:  { control: 'text' },
  },
  args: {
    title:       '오류가 발생했습니다',
    description: '데이터를 불러오지 못했습니다.',
  },
} satisfies Meta<typeof ErrorState>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 기본 에러 상태 */
export const Default: Story = {};

/** 재시도 버튼 포함 */
export const WithRetry: Story = {
  args: {
    description: '거래 내역을 불러오지 못했습니다.',
    onRetry: () => alert('재시도'),
  },
};

/** 커스텀 메시지 */
export const NetworkError: Story = {
  args: {
    title:       '네트워크 오류',
    description: '인터넷 연결을 확인한 후 다시 시도해 주세요.',
    onRetry:     () => alert('재시도'),
    retryLabel:  '새로고침',
  },
};
