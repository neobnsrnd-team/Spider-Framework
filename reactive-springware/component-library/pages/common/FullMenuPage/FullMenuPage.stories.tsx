/**
 * @file FullMenuPage.stories.tsx
 * @description 전체 메뉴 페이지 Storybook 스토리.
 *
 * Figma 원본: Hana Bank App node-id: 1:458
 * 홈 대시보드 햄버거 메뉴 → 전체 메뉴(사이트맵) 화면
 *
 * 스토리에서만 useState로 카테고리 상태를 관리한다.
 * 실제 앱에서는 useFullMenu 훅이 activeCategory/onCategoryChange를 제공한다.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { FullMenuPage } from '.';
import type { MenuCategoryId } from './types';

const meta = {
  title: 'Pages/Common/FullMenuPage',
  component: FullMenuPage,
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
     실제 렌더링은 각 스토리의 render 함수 내 WithCategoryState가 담당한다. */
  args: {
    activeCategory: 'banking' as MenuCategoryId,
    onCategoryChange: () => {},
  },
} satisfies Meta<typeof FullMenuPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 스토리용 래퍼 — useState로 카테고리 상태를 관리해 컴포넌트에 주입 */
function WithCategoryState() {
  const [activeCategory, setActiveCategory] = useState<MenuCategoryId>('banking');
  return (
    <FullMenuPage
      activeCategory={activeCategory}
      onCategoryChange={setActiveCategory}
      onClose={() => console.log('닫기')}
      onHome={() => console.log('홈으로')}
      onLogout={() => console.log('로그아웃')}
    />
  );
}

/** 기본 상태 — 뱅킹 카테고리 활성 (Figma 원본 재현) */
export const Default: Story = {
  render: () => <WithCategoryState />,
};

/** IBK 기업은행 브랜드 */
export const IbkBrand: Story = {
  parameters: { brand: 'ibk' },
  render: () => <WithCategoryState />,
};