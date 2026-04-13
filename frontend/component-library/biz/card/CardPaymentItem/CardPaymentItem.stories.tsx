/**
 * @file CardPaymentItem.stories.tsx
 * @description CardPaymentItem 컴포넌트 스토리.
 */
import type { Meta, StoryObj } from '@storybook/react';
import { CreditCard, ShoppingBag, Utensils } from 'lucide-react';
import React from 'react';
import { CardPaymentItem } from './index';

const meta = {
  title: 'Biz/Card/CardPaymentItem',
  component: CardPaymentItem,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'card' },
  decorators: [(Story: React.ComponentType) => <div style={{ width: 390, padding: 16 }}><Story /></div>],
  args: {
    icon:         <CreditCard size={18} />,
    cardEnName:   'HANA MONEY CHECK',
    cardName:     '하나 머니 체크카드',
    amount:       15000,
    onDetailClick: () => {},
  },
} satisfies Meta<typeof CardPaymentItem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** 취소/환불 — 음수 금액은 brand 색상으로 표시 */
export const Refund: Story = {
  args: { amount: -15000 },
};

/** 상세보기 버튼 없음 */
export const NoDetail: Story = {
  args: { onDetailClick: undefined },
};

/** 행 전체 클릭 가능 */
export const Clickable: Story = {
  args: { onClick: () => alert('행 클릭') },
};

/** 아이콘 배경 커스텀 */
export const CustomIconBg: Story = {
  args: {
    icon:            <ShoppingBag size={18} />,
    iconBgClassName: 'bg-surface-subtle',
    cardEnName:      'VISA',
    cardName:        '스타벅스',
    amount:          6500,
  },
};

/** 목록 형태 미리보기 */
export const List: Story = {
  render: () => (
    <div className="flex flex-col divide-y divide-border-subtle">
      <CardPaymentItem
        icon={<CreditCard size={18} />}
        cardEnName="HANA MONEY CHECK"
        cardName="하나 머니 체크카드"
        amount={15000}
        onDetailClick={() => {}}
      />
      <CardPaymentItem
        icon={<ShoppingBag size={18} />}
        iconBgClassName="bg-surface-subtle"
        cardEnName="VISA"
        cardName="스타벅스"
        amount={6500}
        onDetailClick={() => {}}
      />
      <CardPaymentItem
        icon={<Utensils size={18} />}
        iconBgClassName="bg-surface-subtle"
        cardEnName="MASTERCARD"
        cardName="배달의민족"
        amount={-22000}
        onDetailClick={() => {}}
      />
    </div>
  ),
};
