/**
 * @file BrandBanner.stories.tsx
 * @description BrandBanner 컴포넌트 스토리.
 * 전체 메뉴 화면 하단의 브랜드 컬러 프로모션 배너.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Star, ChevronRight, Gift } from 'lucide-react';
import { BrandBanner } from './index';

const meta = {
  title: 'Biz/Common/BrandBanner',
  component: BrandBanner,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'banking', layout: 'centered' },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: 390, padding: '16px' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    onClick: { action: '배너 클릭' },
  },
  args: {
    subtitle: '개인 맞춤 혜택',
    title: '나만을 위한 특별한 한아멤버스',
    icon: <Star className="size-5 text-white" />,
    onClick: () => {},
  },
} satisfies Meta<typeof BrandBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 기본 상태 — 소제목 + 타이틀 + 별 아이콘 */
export const Default: Story = {};

/** 아이콘 없음 */
export const NoIcon: Story = {
  args: { icon: undefined },
};

/** 소제목 없음 */
export const NoSubtitle: Story = {
  args: { subtitle: undefined },
};

/** Gift 아이콘 변형 */
export const WithGiftIcon: Story = {
  args: {
    subtitle: '이벤트',
    title: '지금 가입하면 스타벅스 쿠폰 증정!',
    icon: <Gift className="size-5 text-white" />,
  },
};

/** 클릭 불가 정적 배너 */
export const StaticBanner: Story = {
  args: { onClick: undefined },
};
