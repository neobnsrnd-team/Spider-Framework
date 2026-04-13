/**
 * @file BottomSheet.stories.tsx
 * @description BottomSheet 컴포넌트 스토리.
 *
 * footer 버튼은 Button / ButtonGroup 컴포넌트를 사용한다.
 * - 두 버튼(취소+확인): ButtonGroup + 각 Button fullWidth → 동일 너비 균등 분할
 * - 단일 버튼: Button fullWidth
 * Modal과 달리 뷰포트 크기와 무관하게 항상 하단 고정.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { BottomSheet } from './index';
import { Button, ButtonGroup } from '../../../core/Button';

const meta = {
  title: 'Modules/Common/BottomSheet',
  component: BottomSheet,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'banking', layout: 'centered' },
  argTypes: {
    snap:                 { control: 'select', options: ['auto', 'half', 'full'] },
    open:                 { control: 'boolean' },
    title:                { control: 'text' },
    disableBackdropClose: { control: 'boolean' },
    hideCloseButton:      { control: 'boolean' },
  },
  args: {
    open:                 true,
    title:                '이체 확인',
    snap:                 'auto',
    disableBackdropClose: false,
    hideCloseButton:      false,
    onClose:              () => {},
    children:             null as unknown as React.ReactNode,
  },
} satisfies Meta<typeof BottomSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 기본 — 두 버튼(취소·확인) 동일 너비 균등 분할 */
export const Default: Story = {
  render: (args) => (
    <BottomSheet
      {...args}
      footer={
        <ButtonGroup>
          <Button variant="outline" fullWidth onClick={() => {}}>취소</Button>
          <Button variant="primary" fullWidth onClick={() => {}}>이체 확인</Button>
        </ButtonGroup>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14 }}>
        {[
          ['받는 분', '홍길동'],
          ['계좌번호', '123-456-789012'],
          ['이체 금액', '50,000원'],
          ['메모', '점심값'],
        ].map(([label, value]) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--color-text-muted)' }}>{label}</span>
            <span style={{ fontWeight: label === '이체 금액' ? 700 : 400 }}>{value}</span>
          </div>
        ))}
      </div>
    </BottomSheet>
  ),
};

/** 단일 버튼 — 확인 버튼 1개 fullWidth */
export const SingleButton: Story = {
  args: { title: '옵션 선택' },
  render: (args) => (
    <BottomSheet
      {...args}
      footer={
        <Button variant="primary" fullWidth onClick={() => {}}>확인</Button>
      }
    >
      <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
        시트 본문 콘텐츠 영역입니다.
      </p>
    </BottomSheet>
  ),
};

/** 버튼으로 제어 */
export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <Button variant="primary" onClick={() => setOpen(true)}>
          시트 열기
        </Button>
        <BottomSheet
          open={open}
          onClose={() => setOpen(false)}
          title="옵션 선택"
          footer={
            <Button variant="primary" fullWidth onClick={() => setOpen(false)}>
              확인
            </Button>
          }
        >
          <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
            시트 본문 콘텐츠 영역입니다.
          </p>
        </BottomSheet>
      </div>
    );
  },
};

/** snap="half" — 화면 절반 높이 고정 */
export const HalfSnap: Story = {
  args: { snap: 'half', title: '날짜 선택' },
  render: (args) => (
    <BottomSheet
      {...args}
      footer={
        <Button variant="primary" fullWidth onClick={() => {}}>선택 완료</Button>
      }
    >
      <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
        snap="half" — 화면 절반 높이 고정
      </p>
    </BottomSheet>
  ),
};

/** disableBackdropClose — 백드롭 클릭으로 닫기 비활성화 */
export const DisabledBackdrop: Story = {
  args: { disableBackdropClose: true, title: '필수 약관 동의' },
  render: (args) => (
    <BottomSheet
      {...args}
      footer={
        <Button variant="primary" fullWidth onClick={() => {}}>모두 동의하고 계속</Button>
      }
    >
      <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
        백드롭 클릭으로 닫을 수 없는 필수 액션 시트입니다.
      </p>
    </BottomSheet>
  ),
};
