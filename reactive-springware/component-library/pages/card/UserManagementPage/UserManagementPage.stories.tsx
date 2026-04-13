/**
 * @file UserManagementPage.stories.tsx
 * @description UserManagementPage 스토리.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import { UserManagementPage } from './index';
import type { UserItem } from './types';

/** 사용자 목록 mock 데이터 */
const MOCK_USERS: UserItem[] = [
  { id: '1', userId: 'admin01',  userName: '김관리자', pwErrorCount: 0, status: 'normal'     },
  { id: '2', userId: 'user01',   userName: '이사용자', pwErrorCount: 2, status: 'normal'     },
  { id: '3', userId: 'user02',   userName: '박사용자', pwErrorCount: 5, status: 'terminated' },
  { id: '4', userId: 'manager1', userName: '최매니저', pwErrorCount: 1, status: 'normal'     },
];

const meta = {
  title: 'Pages/Card/UserManagementPage',
  component: UserManagementPage,
  tags: ['autodocs'],
  parameters: {
    brand:  'hana',
    domain: 'card',
    layout: 'fullscreen',
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: 390, minHeight: '100dvh', margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    users:         MOCK_USERS,
    onBack:        () => {},
    onMenuClick:   () => {},
    onAddUser:     (form) => console.log('add user:', form),
    onEditUser:    (form) => console.log('edit user:', form),
    onDeleteUser:  (userId) => console.log('delete user:', userId),
  },
} satisfies Meta<typeof UserManagementPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** 사용자가 없는 빈 상태 */
export const Empty: Story = {
  args: { users: [] },
};
