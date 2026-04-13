/**
 * @file CardHeader.stories.tsx
 * @description Card 서브 컴포넌트(CardHeader, CardRow, CardRowPlain,
 * CardActionRow, CardActionRowPlain, CardHighlight) 스토리.
 *
 * 각 서브 컴포넌트를 독립적으로 검색·확인할 수 있도록 별도 파일로 분리한다.
 * Card 컴포넌트 조합 스토리는 Card.stories.tsx를 참고한다.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { BookOpen, ChevronRight, Pencil, ArrowRight } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardRow,
  CardRowPlain,
  CardActionRow,
  CardActionRowPlain,
  CardHighlight,
} from './index';

/* ── CardHeader ─────────────────────────────────────────────── */

const cardHeaderMeta = {
  title: 'Modules/Common/Card/CardHeader',
  component: CardHeader,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'banking', layout: 'centered' },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: 340 }}>
        <Card><Story /></Card>
      </div>
    ),
  ],
} satisfies Meta<typeof CardHeader>;

export default cardHeaderMeta;
type Story = StoryObj<typeof cardHeaderMeta>;

/** 타이틀만 표시 */
export const TitleOnly: Story = {
  args: { title: '하나 주거래 통장' },
};

/** 타이틀 + 서브타이틀 */
export const WithSubtitle: Story = {
  args: {
    title: '하나 주거래 통장',
    subtitle: '123-456-789012',
  },
};

/** 좌측 아이콘 + 타이틀 + 서브타이틀 */
export const WithIcon: Story = {
  args: {
    title: '최근 거래 요약',
    subtitle: '2026년 3월',
    icon: <span style={{ fontSize: 18 }}>📊</span>,
  },
};

/** 우측 액션 버튼 */
export const WithAction: Story = {
  args: {
    title: '거래 내역',
    subtitle: '최근 30일',
    action: <ChevronRight size={16} style={{ color: 'var(--color-text-muted)' }} />,
  },
};

/**
 * 계좌 선택 카드 패턴 — 아이콘 원형 컨테이너 포함.
 * TransactionHistoryPage의 AccountCard에서 사용하는 형태.
 */
export const AccountCardPattern: Story = {
  args: {
    title: '하나 주거래 통장',
    subtitle: '123-456-789012',
    action: (
      <span
        className="flex items-center justify-center size-12 rounded-full bg-brand-10 text-brand-text"
        aria-hidden="true"
      >
        <BookOpen size={20} />
      </span>
    ),
  },
};

/* ── CardRow ─────────────────────────────────────────────────── */

/**
 * 구분선 있는 레이블-값 행.
 * @see Card.stories.tsx — Default 스토리에서 조합 형태 확인 가능
 */
export const CardRowDefault: Story = {
  name: 'CardRow',
  render: () => (
    <>
      <CardRow label="잔액"    value="1,234,567원" valueClassName="text-brand-text" />
      <CardRow label="계좌번호" value="123-456-789012" />
      <CardRow label="출금"    value="-50,000원" valueClassName="text-danger-text" />
    </>
  ),
};

/**
 * 구분선 없는 레이블-값 행.
 * 카드 내 padding 간격만으로 행 구분을 표현하고 싶을 때 사용한다.
 */
export const CardRowPlainDefault: Story = {
  name: 'CardRowPlain',
  render: () => (
    <>
      <CardRowPlain label="받는 계좌"        value="국민 987-654-321012" />
      <CardRowPlain label="내 통장 표시"     value="점심값" />
      <CardRowPlain label="받는 분 통장 표시" value="김하나" />
    </>
  ),
};

/* ── CardActionRow ───────────────────────────────────────────── */

/**
 * 구분선 있는 레이블 + ReactNode 우측 콘텐츠 행.
 * 편집 버튼, 이체 버튼 등 인터랙티브 요소가 우측에 필요한 행에 사용한다.
 */
export const CardActionRowDefault: Story = {
  name: 'CardActionRow',
  render: () => (
    <>
      <CardActionRow label="메모">
        <span className="text-sm text-text-heading">점심값</span>
        <button type="button" aria-label="메모 편집" className="text-text-muted">
          <Pencil size={14} />
        </button>
      </CardActionRow>
      <CardActionRow label="상대 계좌">
        <span className="text-sm text-text-heading">홍길동</span>
        <button type="button" className="text-xs text-brand-text font-medium flex items-center gap-xs">
          이체하기 <ArrowRight size={12} />
        </button>
      </CardActionRow>
    </>
  ),
};

/**
 * 구분선 없는 레이블 + ReactNode 우측 콘텐츠 행.
 * CardActionRow와 동일하나 하단 border가 없다.
 */
export const CardActionRowPlainDefault: Story = {
  name: 'CardActionRowPlain',
  render: () => (
    <>
      <CardActionRowPlain label="메모">
        <span className="text-sm text-text-heading">점심값</span>
        <button type="button" aria-label="메모 편집" className="text-text-muted">
          <Pencil size={14} />
        </button>
      </CardActionRowPlain>
    </>
  ),
};

/* ── CardHighlight ───────────────────────────────────────────── */

/**
 * 카드 하단 강조 섹션.
 * Card noPadding prop과 함께 사용해야 좌우 경계까지 꽉 채울 수 있다.
 */
export const CardHighlightDefault: Story = {
  name: 'CardHighlight',
  render: () => (
    <div style={{ width: 340 }}>
      <Card noPadding>
        <div className="p-standard">
          <CardRowPlain label="받는 계좌"    value="국민 987-654-321012" />
          <CardRowPlain label="이체 금액"    value="100,000원" />
        </div>
        <CardHighlight label="이체 후 잔액" value="2,900,000원" />
      </Card>
    </div>
  ),
  /* CardHighlight는 Card noPadding 내부에서만 의미 있으므로 decorator 대신 직접 렌더링 */
  decorators: [],
};
