/**
 * @file SelectableItem.stories.tsx
 * @description SelectableItem 컴포넌트 스토리.
 * 금융권 선택 화면의 선택 가능 아이콘+레이블 카드 타일.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Building2 } from 'lucide-react';
import { SelectableItem } from './index';

const ICON_SELECTED = <Building2 className="size-5" aria-hidden="true" />;
const ICON_DEFAULT  = <Building2 className="size-4" aria-hidden="true" />;

const meta = {
  title: 'Modules/Common/SelectableItem',
  component: SelectableItem,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'banking' },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: 185, padding: 4 }}>
        <Story />
      </div>
    ),
  ],
  args: {
    icon: ICON_DEFAULT,
    label: '하나은행',
    selected: false,
  },
} satisfies Meta<typeof SelectableItem>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 미선택 상태 */
export const Default: Story = {};

/** 선택 상태 */
export const Selected: Story = {
  args: { icon: ICON_SELECTED, selected: true },
};

/** 긴 레이블 — truncate 동작 확인 */
export const LongLabel: Story = {
  args: { label: 'IBK기업은행중앙지점' },
};

/** 2열 그리드 — Figma 원본 레이아웃 재현 */
export const GridLayout: Story = {
  render: () => {
    const [selected, setSelected] = useState('hana');
    const banks = [
      { id: 'hana', label: '하나은행' },
      { id: 'kb',   label: 'KB국민은행' },
      { id: 'shin', label: '신한은행' },
      { id: 'woo',  label: '우리은행' },
      { id: 'nh',   label: 'NH농협은행' },
      { id: 'ibk',  label: 'IBK기업은행' },
    ];
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, width: 342, padding: '0 16px', background: '#fff' }}>
        {banks.map((bank) => (
          <SelectableItem
            key={bank.id}
            icon={<Building2 className={selected === bank.id ? 'size-5' : 'size-4'} aria-hidden="true" />}
            label={bank.label}
            selected={selected === bank.id}
            onClick={() => setSelected(bank.id)}
          />
        ))}
      </div>
    );
  },
};
