/**
 * @file NoticeItem.stories.tsx
 * @description NoticeItem 컴포넌트 스토리.
 * 아이콘 배경 원 + 제목 + 부제목 + 오른쪽 화살표로 구성된 공지/혜택 목록 항목.
 * 홈 화면 "공지 및 혜택" 섹션의 개별 행에 사용.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Home, Gift, Bell, TrendingUp, Shield } from 'lucide-react';
import { NoticeItem } from './index';

const meta = {
  title: 'Modules/Common/NoticeItem',
  component: NoticeItem,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'banking', layout: 'centered' },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: 390, padding: '0 8px', border: '1px solid #e2e8f0', borderRadius: 12 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    title:           { control: 'text' },
    description:     { control: 'text' },
    showDivider:     { control: 'boolean' },
    iconBgClassName: { control: 'text' },
  },
  args: {
    icon:        <Home className="size-4" />,
    title:       '주택청약 종합저축 안내',
    description: '내 집 마련의 첫걸음을 시작하세요',
    showDivider: true,
  },
} satisfies Meta<typeof NoticeItem>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 기본 — 제목 + 부제목 + 구분선 */
export const Default: Story = {};

/** 부제목 없는 항목 */
export const WithoutDescription: Story = {
  args: {
    icon:        <Bell className="size-4" />,
    title:       '서비스 점검 안내 (3월 30일 새벽 2~4시)',
    description: undefined,
  },
};

/** 마지막 항목 — 구분선 없음 */
export const LastItem: Story = {
  args: {
    icon:        <Gift className="size-4" />,
    title:       '신규 고객 이벤트',
    description: '첫 이체 시 최대 5,000원 캐시백',
    showDivider: false,
  },
};

/** 홈 화면 공지 목록 (실사용 예시) */
export const NoticeList: Story = {
  render: () => (
    <div style={{ width: 390, padding: '0 8px', border: '1px solid #e2e8f0', borderRadius: 12 }}>
      <NoticeItem
        icon={<Home className="size-4" />}
        iconBgClassName="bg-[#ecfdf5] text-success-text"
        title="주택청약 종합저축 안내"
        description="내 집 마련의 첫걸음을 시작하세요"
        onClick={() => {}}
      />
      <NoticeItem
        icon={<TrendingUp className="size-4" />}
        iconBgClassName="bg-[#eff6ff] text-[#1d4ed8]"
        title="하나 주가연계 펀드 출시"
        description="연 최대 7.2% 수익 기대, 3개월 특판"
        onClick={() => {}}
      />
      <NoticeItem
        icon={<Shield className="size-4" />}
        title="금융사기 예방 캠페인"
        description="보이스피싱 피해 예방 방법 안내"
        onClick={() => {}}
      />
      <NoticeItem
        icon={<Gift className="size-4" />}
        iconBgClassName="bg-[#fff7ed] text-[#c2410c]"
        title="신규 고객 첫 이체 캐시백 이벤트"
        description="최대 5,000원 즉시 지급"
        onClick={() => {}}
        showDivider={false}
      />
    </div>
  ),
};

/** 다양한 아이콘 배경색 */
export const IconVariants: Story = {
  render: () => (
    <div style={{ width: 390, padding: '0 8px', border: '1px solid #e2e8f0', borderRadius: 12 }}>
      <NoticeItem icon={<Home className="size-4" />}      title="브랜드 기본 배경 (bg-brand-5)"                                           onClick={() => {}} />
      <NoticeItem icon={<TrendingUp className="size-4" />} title="초록색 배경"  iconBgClassName="bg-[#ecfdf5] text-success-text"            onClick={() => {}} />
      <NoticeItem icon={<Bell className="size-4" />}      title="파란색 배경"   iconBgClassName="bg-[#eff6ff] text-[#1d4ed8]"              onClick={() => {}} />
      <NoticeItem icon={<Gift className="size-4" />}      title="주황색 배경"   iconBgClassName="bg-[#fff7ed] text-[#c2410c]" showDivider={false} onClick={() => {}} />
    </div>
  ),
};