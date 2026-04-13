/**
 * @file AccountSummaryCard.stories.tsx
 * @description AccountSummaryCard 컴포넌트 스토리.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { AccountSummaryCard } from './index';
import { Button } from '../../../core/Button';

const meta = {
  title: 'Biz/Banking/AccountSummaryCard',
  component: AccountSummaryCard,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'banking', layout: 'centered' },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: 340 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    type: {
      control: 'select',
      options: ['deposit', 'savings', 'loan', 'foreignDeposit', 'retirement', 'securities'],
    },
    moreButton: { control: 'select', options: [undefined, 'chevron', 'ellipsis'] },
    balance: { control: 'number' },
    balanceDisplay: { control: 'text' },
    badgeText: { control: 'text' },
    accountName: { control: 'text' },
    accountNumber: { control: 'text' },
  },
  args: {
    type: 'deposit',
    accountName: '급여 통장',
    accountNumber: '123-456789-01234',
    balance: 1234567,
    badgeText: '주거래',
  },
} satisfies Meta<typeof AccountSummaryCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 기본 예금 계좌 — 거래내역·이체 버튼, 균등 너비 */
export const Deposit: Story = {
  args: {
    actions: (
      <>
        <Button size="sm" variant="outline">
          거래내역
        </Button>
        <Button size="sm" variant="primary">
          이체
        </Button>
      </>
    ),
  },
};

/** 더보기 버튼 — chevron (다음 화면 이동) */
export const WithChevron: Story = {
  args: {
    moreButton: 'chevron',
    onMoreClick: () => alert('계좌 상세'),
    actions: (
      <>
        <Button size="sm" variant="primary">
          이체
        </Button>
        <Button size="sm" variant="outline">
          ATM출금
        </Button>
      </>
    ),
  },
};

/** 더보기 버튼 — ellipsis (추가 옵션 메뉴) */
export const WithEllipsis: Story = {
  args: {
    moreButton: 'ellipsis',
    onMoreClick: () => alert('옵션 메뉴'),
    actions: (
      <>
        <Button size="sm" variant="outline">
          거래내역
        </Button>
        <Button size="sm" variant="primary">
          이체
        </Button>
      </>
    ),
  },
};

/** 적금 계좌 — 납입금액 레이블, D-30 배지 */
export const Savings: Story = {
  args: {
    type: 'savings',
    accountName: '청약저축',
    accountNumber: '987-654321-09876',
    balance: 5000000,
    badgeText: 'D-30',
    balanceLabel: '납입금액',
    moreButton: 'chevron',
    onMoreClick: () => {},
  },
};

/** 대출 계좌 — danger 색상, 대출잔액 레이블 */
export const Loan: Story = {
  args: {
    type: 'loan',
    accountName: '신용대출',
    accountNumber: '111-222333-44444',
    balance: 30000000,
    badgeText: '변동금리',
    balanceLabel: '대출잔액',
    moreButton: 'ellipsis',
    onMoreClick: () => {},
  },
};

/** 외화예금 — balanceDisplay로 외화 포맷 전달 */
export const ForeignDeposit: Story = {
  args: {
    type: 'foreignDeposit',
    accountName: '외화 다통화 예금',
    accountNumber: '334-112233-44501',
    balance: 1000,
    balanceDisplay: '$1,000.00',
    badgeText: undefined,
    moreButton: 'chevron',
    onMoreClick: () => {},
    actions: (
      <>
        <Button size="sm" variant="outline">
          거래내역
        </Button>
        <Button size="sm" variant="primary">
          이체
        </Button>
      </>
    ),
  },
};

/** 퇴직연금 — 적립금 레이블 */
export const Retirement: Story = {
  args: {
    type: 'retirement',
    accountName: '확정기여형(DC) 퇴직연금',
    accountNumber: '555-666777-88899',
    balance: 12000000,
    badgeText: undefined,
    moreButton: 'chevron',
    onMoreClick: () => {},
  },
};

/** 배지 없음 */
export const NoBadge: Story = {
  args: { badgeText: undefined },
};

/** 클릭 가능한 인터랙티브 카드 */
export const Clickable: Story = {
  args: {
    moreButton: 'chevron',
    onMoreClick: () => alert('더보기'),
    onClick: () => alert('카드 클릭!'),
  },
};

/** 브랜드 변경 — KB국민은행 */
export const KbBrand: Story = {
  parameters: { brand: 'kb' },
  args: {
    badgeText: '급여',
    moreButton: 'chevron',
    onMoreClick: () => {},
    actions: (
      <>
        <Button size="sm" variant="primary">
          이체
        </Button>
        <Button size="sm" variant="outline">
          ATM출금
        </Button>
      </>
    ),
  },
};
