/**
 * @file TransferInputPage.stories.tsx
 * @description 이체 입력 페이지 Storybook 스토리.
 *
 * Figma 원본:
 *   - 계좌번호 탭 기본 상태  (node-id: 1:1075)
 *   - 연락처송금 탭 상태     (node-id: 1:997)
 *   - 통장표시내용/CMS 펼침 (node-id: 1:2349)
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { TransferInputPage } from './index';

const meta = {
  title: 'Pages/Banking/TransferInputPage',
  component: TransferInputPage,
  tags: ['autodocs'],
  parameters: {
    brand:  'hana',
    domain: 'banking',
    layout: 'fullscreen',
  },
  decorators: [
    (Story: React.ComponentType) => (
      /* 모바일 뷰포트(390px) 기준으로 렌더링 */
      <div style={{ width: 390, minHeight: '100dvh', margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TransferInputPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 계좌번호 탭 기본 상태 — 필터 칩 + 금융권 선택 + 계좌번호 입력, CMS 접힘.
 * Figma node-id: 1:1075
 */
export const Default: Story = {
  args: {
    initialTab:         'account',
    cmsSectionExpanded: false,
  },
};

/**
 * 연락처송금 탭 활성 — 안내 배너 + 휴대폰번호 + 받는 분 이름 입력.
 * Figma node-id: 1:997
 */
export const ContactTab: Story = {
  args: {
    initialTab:         'contact',
    cmsSectionExpanded: false,
  },
};

/**
 * 통장표시내용/CMS 펼침 — 계좌번호 탭 + 내 통장·받는 통장·CMS 코드·송금 메시지 폼 노출.
 * Figma node-id: 1:2349
 */
export const CmsExpanded: Story = {
  args: {
    initialTab:         'account',
    cmsSectionExpanded: true,
  },
};
