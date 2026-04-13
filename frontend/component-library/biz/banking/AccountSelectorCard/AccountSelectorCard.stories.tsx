/**
 * @file AccountSelectorCard.stories.tsx
 * @description AccountSelectorCard 컴포넌트 스토리.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { CreditCard } from 'lucide-react';
import { AccountSelectorCard } from './index';

const meta = {
  title: 'Biz/Banking/AccountSelectorCard',
  component: AccountSelectorCard,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'banking', layout: 'centered' },
  decorators: [(Story: React.ComponentType) => <div style={{ width: 340 }}><Story /></div>],
  argTypes: {
    accountName:   { control: 'text' },
    accountNumber: { control: 'text' },
  },
  args: {
    accountName:   '하나 주거래 통장',
    accountNumber: '123-456-789012',
  },
} satisfies Meta<typeof AccountSelectorCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 기본 — 계좌 변경 드롭다운 + 우측 아이콘 버튼 */
export const Default: Story = {
  args: {
    onAccountChange: () => alert('계좌 변경'),
    onIconClick:     () => alert('계좌 상세'),
  },
};

/** 계좌 변경 불가 — onAccountChange 미전달 시 드롭다운 화살표 숨김 */
export const ReadOnly: Story = {
  args: {
    onIconClick: () => alert('계좌 상세'),
  },
};

/** 우측 아이콘 없음 — onIconClick 미전달 시 버튼 비활성화 */
export const NoIconAction: Story = {
  args: {
    onAccountChange: () => alert('계좌 변경'),
  },
};

/** 커스텀 아이콘 — icon prop으로 기본 Landmark 대신 다른 아이콘 사용 */
export const CustomIcon: Story = {
  args: {
    onAccountChange: () => alert('계좌 변경'),
    onIconClick:     () => alert('카드 상세'),
    icon: <CreditCard size={18} aria-hidden="true" />,
    accountName:   '하나 체크카드',
    accountNumber: '4567-****-****-8901',
  },
};

/** 출금가능금액 표시 — 이체 화면 출금 계좌 카드 패턴 */
export const WithAvailableBalance: Story = {
  args: {
    availableBalance: '출금가능금액: 3,000,000원',
    onAccountChange:  () => alert('계좌 변경'),
    onIconClick:      () => alert('변경'),
    iconAriaLabel:    '출금 계좌 변경',
  },
};

/** 브랜드 변경 — KB국민은행 */
export const KbBrand: Story = {
  parameters: { brand: 'kb' },
  args: {
    onAccountChange: () => alert('계좌 변경'),
    onIconClick:     () => alert('계좌 상세'),
  },
};