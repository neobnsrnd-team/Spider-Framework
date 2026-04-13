/**
 * @file ActionLinkItem.stories.tsx
 * @description ActionLinkItem 컴포넌트 스토리.
 * 아이콘 원형 배경 + 텍스트 레이블 + 오른쪽 화살표로 구성된 카드형 보조 액션 행.
 * 이체 완료 화면의 "카카오톡 공유", "자주 쓰는 계좌 등록" 패턴에 사용.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Share2, Star, Bell, FileText, RefreshCw } from 'lucide-react';
import { ActionLinkItem } from './index';

const meta = {
  title: 'Modules/Common/ActionLinkItem',
  component: ActionLinkItem,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'banking', layout: 'centered' },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: 390, padding: '0 16px' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    label:           { control: 'text' },
    iconBgClassName: { control: 'text' },
    size:            { control: 'radio', options: ['md', 'sm'] },
  },
  args: {
    icon:  <Share2 className="size-5" />,
    label: '카카오톡으로 공유',
  },
} satisfies Meta<typeof ActionLinkItem>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 기본 — 브랜드 배경 아이콘 */
export const Default: Story = {};

/** 카카오톡 노란 배경 */
export const KakaoShare: Story = {
  args: {
    icon:            <Share2 className="size-5" />,
    label:           '카카오톡으로 공유',
    iconBgClassName: 'bg-[#fee500] text-[#3c1e1e]',
  },
};

/** 이체 완료 화면에서 자주 사용되는 액션 목록 */
export const TransferCompleteActions: Story = {
  render: () => (
    <div style={{ width: 390, padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <ActionLinkItem
        icon={<Share2 className="size-5" />}
        label="카카오톡으로 공유"
        iconBgClassName="bg-[#fee500] text-[#3c1e1e]"
        onClick={() => {}}
      />
      <ActionLinkItem
        icon={<Star className="size-5" />}
        label="자주 쓰는 계좌 등록"
        onClick={() => {}}
      />
      <ActionLinkItem
        icon={<Bell className="size-5" />}
        label="이체 알림 설정"
        onClick={() => {}}
      />
      <ActionLinkItem
        icon={<FileText className="size-5" />}
        label="거래 명세서 보기"
        onClick={() => {}}
      />
    </div>
  ),
};

/** sm 사이즈 — 상하 패딩 축소 (목록 나열 시 간격 조밀) */
export const SmallSize: Story = {
  args: {
    icon: <Star className="size-5" />,
    label: '자주 쓰는 계좌 등록',
    size: 'sm',
  },
};

/** border 없음 — 목록 행 형태 (전체 메뉴 화면 메뉴 목록 등) */
export const NoBorder: Story = {
  args: {
    icon:       <Star className="size-5" />,
    label:      '자주 쓰는 계좌 등록',
    showBorder: false,
  },
};

/** border 없음 목록 — 연속 행 나열 시 시각적 비교 */
export const NoBorderList: Story = {
  render: () => (
    <div style={{ width: 390, padding: '0 16px', display: 'flex', flexDirection: 'column' }}>
      <ActionLinkItem icon={<Share2 className="size-5" />}    label="홈"          showBorder={false} onClick={() => {}} />
      <ActionLinkItem icon={<Star className="size-5" />}      label="전계좌조회"  showBorder={false} onClick={() => {}} />
      <ActionLinkItem icon={<Bell className="size-5" />}      label="거래내역조회" showBorder={false} onClick={() => {}} />
      <ActionLinkItem icon={<RefreshCw className="size-5" />} label="이체"        showBorder={false} onClick={() => {}} />
    </div>
  ),
};

/** 다양한 아이콘 배경색 */
export const IconVariants: Story = {
  render: () => (
    <div style={{ width: 390, padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      <ActionLinkItem icon={<Share2 className="size-5" />}    label="브랜드 기본 배경" onClick={() => {}} />
      <ActionLinkItem icon={<Star className="size-5" />}      label="노란색 배경"       iconBgClassName="bg-[#fef9c3] text-[#854d0e]" onClick={() => {}} />
      <ActionLinkItem icon={<Bell className="size-5" />}      label="초록색 배경"       iconBgClassName="bg-[#dcfce7] text-[#166534]" onClick={() => {}} />
      <ActionLinkItem icon={<RefreshCw className="size-5" />} label="파란색 배경"       iconBgClassName="bg-[#dbeafe] text-[#1e40af]" onClick={() => {}} />
    </div>
  ),
};