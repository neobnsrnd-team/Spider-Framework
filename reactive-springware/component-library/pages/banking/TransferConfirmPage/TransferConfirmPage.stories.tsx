/**
 * @file TransferConfirmPage.stories.tsx
 * @description TransferConfirmPage 컴포넌트 스토리.
 * 이체 확인 BottomSheet — 이체 실행 전 정보 요약·확인 화면.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { TransferConfirmPage } from './index';

/** Figma 원본과 동일한 기본 이체 데이터 */
const FIGMA_ARGS = {
  open: true,
  onClose: () => {},
  onConfirm: () => {},
  onAddTransfer: () => {},
  recipientName: '홍길동',
  amount: 100_000,
  fromAccount: '하나 123-456-789012',
  toAccount: '국민 987-654-3210 (홍길동)',
  fee: 0,
  myMemo: '홍길동',
  recipientMemo: '김하나',
} as const;

const meta = {
  title: 'Pages/Banking/TransferConfirmPage',
  component: TransferConfirmPage,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'banking' },
} satisfies Meta<typeof TransferConfirmPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma 원본 — 100,000원 이체 확인 */
export const Default: Story = {
  args: FIGMA_ARGS,
};

/** 수수료 있음 — 수수료 1,000원 (브랜드 색 없음) */
export const WithFee: Story = {
  args: {
    ...FIGMA_ARGS,
    fee: 1_000,
  },
};

/** 통장 메모 없음 — 내통장표시·받는분통장표시 미전달 */
export const NoMemo: Story = {
  args: {
    ...FIGMA_ARGS,
    myMemo: undefined,
    recipientMemo: undefined,
  },
};

/** 추가이체 버튼 없음 — onAddTransfer 미전달 */
export const NoAddTransfer: Story = {
  args: {
    ...FIGMA_ARGS,
    onAddTransfer: undefined,
  },
};

/** 대금액 이체 */
export const LargeAmount: Story = {
  args: {
    ...FIGMA_ARGS,
    recipientName: '이순신',
    amount: 30_000_000,
    fee: 500,
  },
};

/** 인터랙티브 — 전체 이체 플로우 시뮬레이션 */
export const Interactive: Story = {
  render: () => {
    const [open, setOpen] = useState(false);
    const [result, setResult] = useState<'idle' | 'confirmed' | 'cancelled'>('idle');

    const handleConfirm = () => {
      setOpen(false);
      setResult('confirmed');
    };
    const handleClose = () => {
      setOpen(false);
      setResult('cancelled');
    };

    return (
      <div style={{ position: 'relative', height: '100dvh', background: '#f8fafc' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 16 }}>
          <p style={{ fontSize: 14, color: '#64748b' }}>
            {result === 'confirmed' && '✅ 이체가 확인되었습니다.'}
            {result === 'cancelled' && '❌ 이체가 취소되었습니다.'}
            {result === 'idle' && '이체 버튼을 눌러 확인 화면을 열어보세요.'}
          </p>
          <button
            type="button"
            onClick={() => { setOpen(true); setResult('idle'); }}
            style={{ padding: '10px 20px', background: '#008485', color: '#fff', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 14 }}
          >
            이체 확인 열기
          </button>
        </div>
        <TransferConfirmPage
          open={open}
          onClose={handleClose}
          onConfirm={handleConfirm}
          onAddTransfer={() => alert('추가이체 화면으로 이동')}
          recipientName="홍길동"
          amount={100_000}
          fromAccount="하나 123-456-789012"
          toAccount="국민 987-654-3210 (홍길동)"
          fee={0}
          myMemo="홍길동"
          recipientMemo="김하나"
        />
      </div>
    );
  },
};
