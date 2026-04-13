/**
 * @file BannerCarousel.stories.tsx
 * @description BannerCarousel 컴포넌트 스토리.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { BannerCarousel } from './index';

const meta = {
  title: 'Biz/Common/BannerCarousel',
  component: BannerCarousel,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'banking', layout: 'centered' },
} satisfies Meta<typeof BannerCarousel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 배너 1개 — 자동재생/인디케이터 비활성 */
export const SingleBanner: Story = {
  args: {
    items: [{ id: '1', variant: 'promo', title: '하나원큐 특별 금리 이벤트', description: '최대 연 4.5% 적금 한정 출시' }],
  },
  decorators: [(Story) => <div style={{ width: 390, padding: 16 }}><Story /></div>],
};

/** 배너 3개 — 자동재생(3초) + 스와이프 + 인디케이터 활성 */
export const MultipleWithAutoPlay: Story = {
  args: {
    items: [
      { id: '1', variant: 'promo',   title: '하나원큐 특별 금리 이벤트', description: '최대 연 4.5% 적금 한정 출시' },
      { id: '2', variant: 'info',    title: '서비스 점검 안내', description: '3월 27일 02:00 ~ 04:00 일부 서비스 중단' },
      { id: '3', variant: 'warning', title: '보안 업데이트 권장', description: '최신 앱 버전으로 업데이트해주세요' },
    ],
    autoPlayInterval: 3000,
  },
  decorators: [(Story) => <div style={{ width: 390, padding: 16 }}><Story /></div>],
};

/** KB국민은행 브랜드 */
export const KbBrand: Story = {
  parameters: { brand: 'kb' },
  args: {
    items: [
      { id: '1', variant: 'promo', title: 'KB 특별 이벤트', description: '포인트 적립 2배 이벤트' },
      { id: '2', variant: 'info',  title: '공지사항', description: 'KB스타뱅킹 업데이트 안내' },
    ],
  },
  decorators: [(Story) => <div style={{ width: 390, padding: 16 }}><Story /></div>],
};