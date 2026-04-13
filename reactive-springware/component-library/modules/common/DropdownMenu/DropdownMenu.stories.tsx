/**
 * @file DropdownMenu.stories.tsx
 * @description DropdownMenu 스토리.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Settings, User, LogOut } from 'lucide-react';

import { DropdownMenu } from './index';

const meta = {
  title: 'Modules/Common/DropdownMenu',
  component: DropdownMenu,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    items: [
      { label: '내 정보 관리', icon: <User className="size-4" />, onClick: () => console.log('내 정보 관리') },
      { label: '로그아웃', icon: <LogOut className="size-4" />, onClick: () => console.log('로그아웃'), variant: 'danger' },
    ],
    align: 'right',
    children: (
      <button
        type="button"
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          width: 40, height: 40, borderRadius: '50%',
          border: '1px solid #e5e7eb', background: '#fff', cursor: 'pointer',
        }}
        aria-label="설정"
      >
        <Settings size={16} />
      </button>
    ),
  },
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AlignLeft: Story = {
  args: { align: 'left' },
};
