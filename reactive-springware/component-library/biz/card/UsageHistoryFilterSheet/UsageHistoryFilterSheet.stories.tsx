/**
 * @file UsageHistoryFilterSheet.stories.tsx
 * @description UsageHistoryFilterSheet 컴포넌트 스토리.
 */
import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Button } from '../../../core/Button';
import { UsageHistoryFilterSheet } from './index';
import type { SearchFilter } from './types';

const MOCK_CARD_OPTIONS = [
  { value: 'card-1', label: '하나 머니 체크카드' },
  { value: 'card-2', label: '하나 플래티넘 신용카드' },
];

function FilterSheetDemo() {
  const [open, setOpen] = useState(false);
  const [applied, setApplied] = useState<SearchFilter | null>(null);

  return (
    <div className="p-md flex flex-col gap-md">
      <Button variant="primary" size="md" onClick={() => setOpen(true)}>
        필터 열기
      </Button>
      {applied && (
        <pre className="text-xs bg-surface-raised p-md rounded-lg overflow-auto">
          {JSON.stringify(applied, null, 2)}
        </pre>
      )}
      <UsageHistoryFilterSheet
        open={open}
        onClose={() => setOpen(false)}
        cardOptions={MOCK_CARD_OPTIONS}
        onApply={(filter) => { setApplied(filter); }}
      />
    </div>
  );
}

const meta = {
  title: 'Biz/Card/UsageHistoryFilterSheet',
  component: UsageHistoryFilterSheet,
  tags: ['autodocs'],
  parameters: { brand: 'hana', domain: 'card', layout: 'fullscreen' },
  decorators: [
    () => (
      <div style={{ width: 390, minHeight: '100dvh', margin: '0 auto' }}>
        <FilterSheetDemo />
      </div>
    ),
  ],
} satisfies Meta<typeof UsageHistoryFilterSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
