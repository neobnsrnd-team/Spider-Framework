/**
 * @file HomeDashboardPage.stories.tsx
 * @description 홈 대시보드 페이지 Storybook 스토리.
 *
 * Figma 원본:
 *   - 해당금융 탭 (node-id: 1-202) — 계좌 카드 + 소형 연결 유도 배너
 *   - 다른금융 탭 (node-id: 1-336) — 계좌 미연결 빈상태 카드
 *
 * 스토리에서만 useState로 탭 상태를 관리한다.
 * 실제 앱에서는 useHomeDashboard 훅이 activeTab/onTabChange를 제공한다.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { HomeDashboardPage } from '.';
import type { HomeTab } from './types';

const meta = {
  title: 'Pages/Common/HomeDashboardPage',
  component: HomeDashboardPage,
  tags: ['autodocs'],
  parameters: {
    brand: 'hana',
    domain: 'banking',
    layout: 'fullscreen',
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: 390, minHeight: '100dvh', margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
  /* render를 사용하는 스토리의 타입 오류 방지용 기본 args.
     실제 렌더링은 각 스토리의 render 함수 내 WithTabState가 담당한다. */
  args: {
    activeTab: 'mine' as HomeTab,
    onTabChange: () => {},
  },
} satisfies Meta<typeof HomeDashboardPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 스토리용 래퍼 — useState로 탭 상태를 관리해 컴포넌트에 주입 */
function WithTabState({ initialTab }: { initialTab: HomeTab }) {
  const [activeTab, setActiveTab] = useState<HomeTab>(initialTab);
  return <HomeDashboardPage activeTab={activeTab} onTabChange={setActiveTab} />;
}

/** 해당금융 탭 — 계좌 카드 + 소형 연결 유도 배너 (Figma node-id: 1-202) */
export const MyBankingTab: Story = {
  render: () => <WithTabState initialTab="mine" />,
};

/** 다른금융 탭 — 계좌 미연결 빈상태 카드 (Figma node-id: 1-336) */
export const OtherBankingTab: Story = {
  render: () => <WithTabState initialTab="other" />,
};

/** 자산관리 탭 — 미구현 화면 플레이스홀더 */
export const AssetManagementTab: Story = {
  render: () => <WithTabState initialTab="asset" />,
};

/** IBK 기업은행 브랜드 */
export const IbkBrand: Story = {
  parameters: { brand: 'ibk' },
  render: () => <WithTabState initialTab="mine" />,
};