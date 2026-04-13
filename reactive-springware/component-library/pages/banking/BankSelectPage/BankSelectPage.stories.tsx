/**
 * @file BankSelectPage.stories.tsx
 * @description BankSelectPage 컴포넌트 스토리.
 * 이체 화면에서 출금·입금 금융기관을 선택하는 BottomSheet 페이지.
 *
 * Figma 원본:
 *   - node-id: 1:1282 (은행 탭 — 2열 선택 그리드)
 *   - node-id: 1:1827 (증권사 탭 — 빈 상태 + CTA)
 */
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Building2, TrendingUp, BarChart2, PieChart, LineChart } from 'lucide-react';
import { BankSelectPage } from './index';
import type { BankSelectTab, FinancialItem } from './types';

// ── 샘플 데이터 ──────────────────────────────────────────────────

const SAMPLE_BANKS: FinancialItem[] = [
  { id: 'hana',  icon: <Building2 className="size-5" aria-hidden="true" />, label: '하나은행' },
  { id: 'kb',    icon: <Building2 className="size-5" aria-hidden="true" />, label: 'KB국민은행' },
  { id: 'shin',  icon: <Building2 className="size-5" aria-hidden="true" />, label: '신한은행' },
  { id: 'woo',   icon: <Building2 className="size-5" aria-hidden="true" />, label: '우리은행' },
  { id: 'nh',    icon: <Building2 className="size-5" aria-hidden="true" />, label: 'NH농협은행' },
  { id: 'ibk',   icon: <Building2 className="size-5" aria-hidden="true" />, label: 'IBK기업은행' },
  { id: 'kakao', icon: <Building2 className="size-5" aria-hidden="true" />, label: '카카오뱅크' },
  { id: 'toss',  icon: <Building2 className="size-5" aria-hidden="true" />, label: '토스뱅크' },
];

const SAMPLE_SECURITIES: FinancialItem[] = [
  { id: 'mirae',   icon: <TrendingUp className="size-5" aria-hidden="true" />, label: '미래에셋증권' },
  { id: 'samsung', icon: <BarChart2  className="size-5" aria-hidden="true" />, label: '삼성증권' },
  { id: 'kb-sec',  icon: <PieChart   className="size-5" aria-hidden="true" />, label: 'KB증권' },
  { id: 'nh-sec',  icon: <LineChart  className="size-5" aria-hidden="true" />, label: 'NH투자증권' },
];

const meta = {
  title: 'Pages/Banking/BankSelectPage',
  component: BankSelectPage,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'banking', layout: 'fullscreen' },
  args: {
    open: true,
    onClose: () => {},
    activeTab: 'bank',
    onTabChange: () => {},
    banks: SAMPLE_BANKS,
    selectedBankId: 'hana',
    onBankSelect: () => {},
    securities: SAMPLE_SECURITIES,
    selectedSecuritiesId: undefined,
    onSecuritiesSelect: () => {},
    onConnectSecurities: () => {},
  },
} satisfies Meta<typeof BankSelectPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 은행 탭 — 기본 상태 (Figma node-id: 1:1282) */
export const BankTab: Story = {};

/** 은행 탭 — 선택 없음 */
export const BankTabNoSelection: Story = {
  args: { selectedBankId: undefined },
};

/** 증권사 탭 — 데이터 있음 */
export const SecuritiesTab: Story = {
  args: {
    activeTab: 'securities',
    selectedSecuritiesId: 'mirae',
  },
};

/** 증권사 탭 — 빈 상태 + CTA (Figma node-id: 1:1827) */
export const SecuritiesEmpty: Story = {
  args: {
    activeTab: 'securities',
    securities: [],
  },
};

/** 증권사 탭 — 빈 상태, CTA 없음 (onConnectSecurities 미전달) */
export const SecuritiesEmptyNoCta: Story = {
  args: {
    activeTab: 'securities',
    securities: [],
    onConnectSecurities: undefined,
  },
};

/** 인터랙티브 — 탭 전환·항목 선택 전체 흐름 재현 */
export const Interactive: Story = {
  render: (args) => {
    const [activeTab, setActiveTab] = useState<BankSelectTab>('bank');
    const [selectedBankId, setSelectedBankId] = useState<string | undefined>('hana');
    const [selectedSecuritiesId, setSelectedSecuritiesId] = useState<string | undefined>();

    return (
      <BankSelectPage
        {...args}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        selectedBankId={selectedBankId}
        onBankSelect={setSelectedBankId}
        selectedSecuritiesId={selectedSecuritiesId}
        onSecuritiesSelect={setSelectedSecuritiesId}
        onConnectSecurities={() => alert('증권사 연결하기 클릭')}
        onClose={() => alert('닫기 클릭')}
      />
    );
  },
};
