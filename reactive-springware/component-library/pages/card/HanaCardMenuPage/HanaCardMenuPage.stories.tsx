/**
 * @file HanaCardMenuPage.stories.tsx
 * @description HanaCardMenuPage 스토리.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import {
  Receipt,
  FileText,
  Wallet,
  Settings,
  Gift,
  CreditCard,
  Headphones,
} from 'lucide-react';

import { HanaCardMenuPage } from './index';
import type { MenuItem } from './types';

/** 메뉴 항목 mock 데이터 */
const MENU_ITEMS: MenuItem[] = [
  { id: 'usage-history',     category: 'history',    label: '이용내역',        icon: <Receipt  className="size-5" />, onClick: () => {} },
  { id: 'statement',         category: 'history',    label: '이용대금명세서',   icon: <FileText className="size-5" />, onClick: () => {} },
  { id: 'immediate-payment', category: 'payment',    label: '즉시결제',         icon: <Wallet   className="size-5" />, onClick: () => {} },
  { id: 'card-management',   category: 'management', label: '카드 관리',        icon: <Settings className="size-5" />, onClick: () => {} },
  { id: 'benefits',          category: 'benefit',    label: '혜택/포인트 조회', icon: <Gift     className="size-5" />, onClick: () => {} },
  { id: 'card-apply',        category: 'service',    label: '카드 신청',        icon: <CreditCard className="size-5" />, onClick: () => {} },
  { id: 'customer-service',  category: 'service',    label: '고객센터',         icon: <Headphones className="size-5" />, onClick: () => {} },
];

const meta = {
  title: 'Pages/Card/HanaCardMenuPage',
  component: HanaCardMenuPage,
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
    userName:   '홍길동님',
    lastLogin:  '2026.04.09 10:00:00',
    categories: [
      { id: 'all',        label: '전체' },
      { id: 'history',    label: '이용내역' },
      { id: 'payment',    label: '결제' },
      { id: 'management', label: '카드관리' },
      { id: 'benefit',    label: '혜택' },
      { id: 'service',    label: '서비스' },
    ],
    menuItems:  MENU_ITEMS,
    onBack:           () => {},
    onProfileManage:  () => console.log('내 정보 관리'),
    onLogout:         () => console.log('로그아웃'),
  },
} satisfies Meta<typeof HanaCardMenuPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
