/**
 * @file Modal.stories.tsx
 * @description Modal 컴포넌트 스토리.
 *
 * footer 버튼은 Button / ButtonGroup 컴포넌트를 사용한다.
 * - 두 버튼(취소+확인): ButtonGroup + 각 Button fullWidth → 동일 너비 균등 분할
 * - 단일 버튼: Button fullWidth
 * - 중앙 타이틀: titleAlign="center" prop
 */
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Modal } from './index';
import { Button, ButtonGroup } from '../../../core/Button';

const meta = {
  title: 'Modules/Common/Modal',
  component: Modal,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'banking', layout: 'centered' },
  argTypes: {
    size:                 { control: 'select', options: ['sm', 'md', 'lg', 'fullscreen'] },
    open:                 { control: 'boolean' },
    title:                { control: 'text' },
    titleAlign:           { control: 'select', options: ['left', 'center'] },
    disableBackdropClose: { control: 'boolean' },
  },
  args: {
    open:                 true,
    title:                '이체 확인',
    size:                 'md',
    disableBackdropClose: false,
    titleAlign:           'left',
    /* required props — render 함수에서 실제 값으로 대체되므로 placeholder */
    onClose:  () => {},
    children: null as unknown as React.ReactNode,
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 기본 — 좌측 타이틀, 두 버튼(취소·확인) 동일 너비 균등 분할 */
export const Default: Story = {
  render: (args) => (
    <Modal
      {...args}
      footer={
        /* 두 버튼: flex-1로 동일 너비 분할 */
        <ButtonGroup>
          <Button variant="outline" fullWidth onClick={() => {}}>취소</Button>
          <Button variant="primary" fullWidth onClick={() => {}}>확인</Button>
        </ButtonGroup>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--color-text-muted)' }}>받는 분</span>
          <span style={{ fontWeight: 700 }}>홍길동</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--color-text-muted)' }}>계좌번호</span>
          <span>123-456-789012</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--color-text-muted)' }}>이체 금액</span>
          <span style={{ fontWeight: 700, color: 'var(--color-brand)' }}>50,000원</span>
        </div>
      </div>
    </Modal>
  ),
};

/** 중앙 타이틀 — titleAlign="center", X 버튼 절대 우측 배치 */
export const CenteredTitle: Story = {
  args: { title: '주의', titleAlign: 'center' },
  render: (args) => (
    <Modal
      {...args}
      footer={
        <ButtonGroup>
          <Button variant="outline" fullWidth onClick={() => {}}>취소</Button>
          <Button variant="primary" fullWidth onClick={() => {}}>확인</Button>
        </ButtonGroup>
      }
    >
      <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', textAlign: 'center' }}>
        이 작업은 되돌릴 수 없습니다.<br />정말 진행하시겠습니까?
      </p>
    </Modal>
  ),
};

/** 단일 버튼 — 확인 버튼 1개, fullWidth */
export const SingleButton: Story = {
  args: { title: '안내' },
  render: (args) => (
    <Modal
      {...args}
      footer={
        <Button variant="primary" fullWidth onClick={() => {}}>확인</Button>
      }
    >
      <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
        작업이 완료되었습니다.
      </p>
    </Modal>
  ),
};

/** 단일 버튼 + 중앙 타이틀 */
export const SingleButtonCentered: Story = {
  args: { title: '완료', titleAlign: 'center' },
  render: (args) => (
    <Modal
      {...args}
      footer={
        <Button variant="primary" fullWidth onClick={() => {}}>확인</Button>
      }
    >
      <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', textAlign: 'center' }}>
        이체가 완료되었습니다.
      </p>
    </Modal>
  ),
};

/** 모달 열기 버튼으로 제어 */
export const Controlled: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    return (
      <div>
        <Button variant="primary" onClick={() => setOpen(true)}>
          모달 열기
        </Button>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          title="확인"
          footer={
            <Button variant="primary" fullWidth onClick={() => setOpen(false)}>
              닫기
            </Button>
          }
        >
          <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', textAlign: 'center' }}>
            작업이 완료되었습니다.
          </p>
        </Modal>
      </div>
    );
  },
};

/** size 프리셋 비교 */
export const Sizes: Story = {
  render: () => {
    const [size, setSize] = useState<'sm' | 'md' | 'lg' | null>(null);
    return (
      <div style={{ display: 'flex', gap: 8 }}>
        {(['sm', 'md', 'lg'] as const).map(s => (
          <Button key={s} variant="outline" onClick={() => setSize(s)}>
            {s}
          </Button>
        ))}
        {size && (
          <Modal
            open
            title={`size="${size}"`}
            onClose={() => setSize(null)}
            size={size}
            footer={
              <ButtonGroup>
                <Button variant="outline" fullWidth onClick={() => setSize(null)}>취소</Button>
                <Button variant="primary" fullWidth onClick={() => setSize(null)}>확인</Button>
              </ButtonGroup>
            }
          >
            <p style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>
              모달 크기: {size}
            </p>
          </Modal>
        )}
      </div>
    );
  },
};
