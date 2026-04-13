/**
 * @file SuccessHero.stories.tsx
 * @description SuccessHero 컴포넌트 스토리.
 * 이체·결제 완료 등 성공 결과 화면의 히어로 섹션.
 * Confetti 팝인 + 부유 애니메이션, 성공 아이콘, 결과 타이틀, 부제목으로 구성.
 */
import type { Meta, StoryObj } from '@storybook/react';
import { SuccessHero } from './index';

const meta = {
  title: 'Modules/Common/SuccessHero',
  component: SuccessHero,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'banking', layout: 'centered' },
  decorators: [
    (Story: any) => (
      <div style={{ width: 390, border: '1px solid #e2e8f0', borderRadius: 16, overflow: 'hidden', background: '#fff' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    recipientName: { control: 'text' },
    amount:        { control: 'text' },
    subtitle:      { control: 'text' },
  },
  args: {
    recipientName: '홍길동',
    amount:        '50,000원',
  },
} satisfies Meta<typeof SuccessHero>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 기본 — 이체 완료 화면 */
export const Default: Story = {};

/** 부제목 커스텀 */
export const CustomSubtitle: Story = {
  args: {
    recipientName: '김하나',
    amount:        '1,000,000원',
    subtitle:      '이체가 정상적으로 처리되었습니다.',
  },
};

/** 소액 이체 */
export const SmallAmount: Story = {
  args: {
    recipientName: '이철수',
    amount:        '3,500원',
    subtitle:      '커피 한 잔 쐈어요 ☕',
  },
};

/** 대금 결제 완료 */
export const PaymentComplete: Story = {
  args: {
    recipientName: 'GS25 강남점',
    amount:        '28,900원',
    subtitle:      '결제가 완료되었습니다.',
  },
};