/**
 * @file ImmediatePaymentPage.stories.tsx
 * @description ImmediatePaymentPage 컴포넌트 스토리.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Landmark, Building } from 'lucide-react';
import { ImmediatePaymentPage } from './index';

const MOCK_CAUTIONS = [
  {
    title: '출금 제한 안내',
    content:
      '출금 가능 시간 이외에는 즉시결제 서비스를 이용하실 수 없습니다. 이용 가능 시간을 확인하시고 결제를 진행해 주세요.',
  },
  {
    title: '결제 취소 안내',
    content:
      '즉시결제(선결제) 후에는 취소가 불가합니다. 결제 전에 금액과 결제수단을 반드시 확인하시기 바랍니다.',
  },
  {
    title: '한도 안내',
    content:
      '1일 즉시결제 가능 금액은 최대 1,000만원이며, 카드 한도 및 잔액에 따라 제한될 수 있습니다.',
  },
  {
    title: '자동 선결제 안내',
    content:
      '매주 자동 선결제 서비스는 설정한 요일에 자동으로 결제가 진행됩니다. 출금 계좌의 잔액을 미리 확인해 주세요.',
  },
];

const meta = {
  title: 'Pages/Card/ImmediatePaymentPage',
  component: ImmediatePaymentPage,
  tags: ['autodocs'],
  parameters: {
    brand: 'hana',
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
    hanaAccount: {
      title: '하나은행 결제계좌',
      hours: '365일 06:00~23:30',
      icon: <Landmark className="size-5" />,
    },
    otherAccount: {
      title: '타행 결제계좌',
      hours: '365일 06:00~23:30',
      icon: <Building className="size-5" />,
    },
    cautions: MOCK_CAUTIONS,
    onImmediatePayment: () => alert('즉시결제(선결제)'),
    onItemPayment: () => alert('건별즉시결제(건별선결제)'),
    onAutoPayment: () => alert('매주 자동 선결제'),
    onBack: () => alert('뒤로가기'),
    onClose: () => alert('닫기'),
  },
} satisfies Meta<typeof ImmediatePaymentPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
