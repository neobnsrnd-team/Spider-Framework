/**
 * @file TabNav.stories.tsx
 * @description TabNav 컴포넌트 스토리.
 * - underline: 홈 화면의 해당금융·다른금융·자산관리 수평 탭 네비게이션.
 * - pill: 전계좌 조회 페이지의 상품 카테고리 필터 탭.
 *         활성 탭 배경(bg-brand-10) 바로 바깥에 brand-10 테두리가 감싸는 형태.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { TabNav } from './index';

const BANKING_TABS = [
  { id: 'mine',   label: '해당금융' },
  { id: 'others', label: '다른금융' },
  { id: 'asset',  label: '자산관리' },
];

const meta = {
  title: 'Modules/Common/TabNav',
  component: TabNav,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'banking' },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: 390, padding: '0 0 8px', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    activeId:   { control: 'select', options: BANKING_TABS.map((t) => t.id) },
    variant:    { control: 'select', options: ['underline', 'pill'] },
    fullWidth:  { control: 'boolean' },
  },
  args: {
    items: BANKING_TABS,
    activeId: 'mine',
    onTabChange: () => {},
    variant: 'underline',
    fullWidth: false,
  },
} satisfies Meta<typeof TabNav>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 기본 상태 — 첫 번째 탭 활성 */
export const Default: Story = {};

/** 인터랙티브 — 탭 클릭 시 활성 탭 이동 */
export const Interactive: Story = {
  render: () => {
    const [activeId, setActiveId] = useState('mine');
    return (
      <div style={{ width: 390, border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
        <TabNav
          items={BANKING_TABS}
          activeId={activeId}
          onTabChange={setActiveId}
        />
        <p style={{ padding: '12px 16px', fontSize: 13, color: '#64748b' }}>
          선택된 탭: <strong>{activeId}</strong>
        </p>
      </div>
    );
  },
};

/** 탭 2개 */
export const TwoTabs: Story = {
  args: {
    items: [
      { id: 'deposit', label: '입출금' },
      { id: 'savings', label: '적금' },
    ],
    activeId: 'deposit',
  },
};

/** 탭 4개 */
export const FourTabs: Story = {
  args: {
    items: [
      { id: 'all',       label: '전체' },
      { id: 'deposit',   label: '입출금' },
      { id: 'savings',   label: '적금·예금' },
      { id: 'loan',      label: '대출' },
    ],
    activeId: 'all',
  },
};

/** underline fullWidth — 탭이 컨테이너 너비를 균등 분할 */
export const UnderlineFullWidth: Story = {
  args: { fullWidth: true },
};

/** pill 변형 — 활성 탭 배경(brand-10) 바로 바깥에 brand-10 테두리가 감싸는 형태 */
export const PillVariant: Story = {
  render: () => {
    const items = [
      { id: 'deposit', label: '예금' },
      { id: 'trust',   label: '신탁' },
      { id: 'fund',    label: '펀드' },
      { id: 'loan',    label: '대출' },
    ];
    return (
      <div style={{ width: 390, padding: '16px' }}>
        <TabNav items={items} activeId="deposit" onTabChange={() => {}} variant="pill" fullWidth />
      </div>
    );
  },
};

/** pill 인터랙티브 — 탭 클릭 시 테두리가 선택 배경에 맞춰 이동하는 것 확인 */
export const PillInteractive: Story = {
  render: () => {
    const [activeId, setActiveId] = React.useState('deposit');
    const items = [
      { id: 'deposit', label: '예금' },
      { id: 'trust',   label: '신탁' },
      { id: 'fund',    label: '펀드' },
      { id: 'loan',    label: '대출' },
    ];
    return (
      <div style={{ width: 390, padding: '16px' }}>
        <TabNav items={items} activeId={activeId} onTabChange={setActiveId} variant="pill" fullWidth />
        <p style={{ padding: '12px 0 0', fontSize: 13, color: '#64748b' }}>
          선택된 카테고리: <strong>{activeId}</strong>
        </p>
      </div>
    );
  },
};