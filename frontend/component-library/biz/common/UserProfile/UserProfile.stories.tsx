/**
 * @file UserProfile.stories.tsx
 * @description UserProfile 컴포넌트 스토리.
 * 전체 메뉴 화면 상단 사용자 프로필 영역.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { UserProfile } from './index';

const meta = {
  title: 'Biz/Common/UserProfile',
  component: UserProfile,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'banking' },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: 390, border: '1px solid #f1f5f9', borderRadius: 8, background: '#ffffff' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    onProfileManageClick: { action: '내 정보 관리 클릭' },
    onLogoutClick: { action: '로그아웃 클릭' },
  },
  args: {
    name: '김하나님',
    lastLogin: '2023.11.01 10:30:15',
    onProfileManageClick: () => {},
    onLogoutClick: () => {},
  },
} satisfies Meta<typeof UserProfile>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 기본 상태 — 이름 + 최근 접속 + 설정 버튼(드롭다운: 내 정보 관리 · 로그아웃) */
export const Default: Story = {};

/** 최근 접속 없음 */
export const NoLastLogin: Story = {
  args: { lastLogin: undefined },
};

/** 설정 버튼 없음 — 핸들러 미전달 시 버튼 미표시 */
export const NoSettingsButton: Story = {
  args: { onProfileManageClick: undefined, onLogoutClick: undefined },
};

/** 긴 이름 */
export const LongName: Story = {
  args: { name: '홍길동하나은행고객님' },
};
