/**
 * @file CollapsibleSection.stories.tsx
 * @description CollapsibleSection 컴포넌트 스토리.
 * 헤더 클릭으로 콘텐츠를 접고 펼치는 아코디언 패턴.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { CollapsibleSection } from './index';

const meta = {
  title: 'Modules/Common/CollapsibleSection',
  component: CollapsibleSection,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'banking', layout: 'centered' },
  decorators: [
    (Story: React.ComponentType) => (
      <div style={{ width: 360, padding: '16px', border: '1px solid #e2e8f0', borderRadius: 12 }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    defaultExpanded: { control: 'boolean' },
  },
  args: {
    defaultExpanded: true,
    header: <span style={{ fontSize: 18, fontWeight: 700 }}>예금</span>,
    children: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ padding: '12px', background: '#f8fafc', borderRadius: 8 }}>
          하나 주거래 통장 — 3,000,000원
        </div>
        <div style={{ padding: '12px', background: '#f8fafc', borderRadius: 8 }}>
          주택청약종합저축 — 1,000,000원
        </div>
      </div>
    ),
  },
} satisfies Meta<typeof CollapsibleSection>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 기본 — 헤더 가운데 정렬 + 펼쳐진 상태 */
export const Default: Story = {};

/** 헤더 왼쪽 정렬 — 화살표는 우측 끝 고정 */
export const HeaderLeftAlign: Story = {
  args: { headerAlign: 'left' },
};

/** 초기 접힌 상태 */
export const InitiallyCollapsed: Story = {
  args: { defaultExpanded: false },
};

/** 복수 아코디언 — 전계좌 조회 그룹 예시 */
export const MultipleGroups: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: 360 }}>
      <CollapsibleSection
        header={<span style={{ fontSize: 18, fontWeight: 700 }}>예금</span>}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ padding: '12px', background: '#f8fafc', borderRadius: 8 }}>
            하나 주거래 통장 — 3,000,000원
          </div>
          <div style={{ padding: '12px', background: '#f8fafc', borderRadius: 8 }}>
            주택청약종합저축 — 1,000,000원
          </div>
        </div>
      </CollapsibleSection>
      <CollapsibleSection
        header={<span style={{ fontSize: 18, fontWeight: 700 }}>외화예금</span>}
      >
        <div style={{ padding: '12px', background: '#f8fafc', borderRadius: 8 }}>
          외화 다통화 예금 — $1,000.00
        </div>
      </CollapsibleSection>
      <CollapsibleSection
        header={<span style={{ fontSize: 18, fontWeight: 700 }}>퇴직연금</span>}
        defaultExpanded={false}
      >
        <div style={{ padding: '12px', color: '#94a3b8', fontSize: 13 }}>
          보유하신 퇴직연금 계좌가 없습니다.
        </div>
      </CollapsibleSection>
    </div>
  ),
};
