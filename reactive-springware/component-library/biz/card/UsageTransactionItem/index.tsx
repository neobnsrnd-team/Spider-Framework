/**
 * @file index.tsx
 * @description 이용내역 단건 행 + 상세 BottomSheet 통합 컴포넌트.
 *
 * onClick prop 전달 여부에 따라 동작이 달라진다.
 * - onClick 전달: 행이 버튼으로 렌더링되고, 클릭 시 상세 BottomSheet를 노출한다.
 * - onClick 미전달: 행이 단순 div로 렌더링되고, 상세 BottomSheet를 노출하지 않는다.
 *
 * 상세 BottomSheet의 open/close 상태는 컴포넌트 내부에서 관리한다.
 *
 * @param tx       - 이용내역 단건 데이터
 * @param onClick  - 행 클릭 핸들러. 전달 시 상세 BottomSheet 활성화
 *
 * @example
 * // 상세 BottomSheet 활성화
 * <UsageTransactionItem tx={tx} onClick={() => {}} />
 *
 * // 상세 BottomSheet 없이 단순 표시
 * <UsageTransactionItem tx={tx} />
 */
import React, { useState } from 'react';
import { cn } from '@lib/cn';

import { Typography }         from '../../../core/Typography';
import { BottomSheet }        from '../../../modules/common/BottomSheet';
import { CollapsibleSection } from '../../../modules/common/CollapsibleSection';
import { Divider }            from '../../../modules/common/Divider';

import type { Transaction, UsageTransactionItemProps } from './types';

export type { Transaction, MerchantInfo, UsageTransactionItemProps } from './types';

function formatAmount(n: number) {
  return `${Math.abs(n).toLocaleString('ko-KR')}원`;
}

// ── 상세 BottomSheet ──────────────────────────────────────

function DetailSheet({
  tx,
  open,
  onClose,
}: {
  tx: Transaction;
  open: boolean;
  onClose: () => void;
}) {
  const isRefund = tx.amount < 0;

  const rows = [
    { label: '거래일',   value: tx.date },
    { label: '거래구분', value: tx.type },
    { label: '승인번호', value: tx.approvalNumber },
    { label: '거래상태', value: tx.status },
    { label: '이용카드', value: tx.cardName },
  ];

  return (
    <BottomSheet open={open} onClose={onClose} title="이용내역 상세" snap="auto">
      <div className="flex flex-col items-center gap-xs pb-lg">
        <Typography variant="body" color="muted">{tx.merchant}</Typography>
        <Typography
          variant="heading"
          weight="bold"
          numeric
          className={isRefund ? 'text-brand' : 'text-text-heading'}
        >
          {isRefund ? '-' : ''}{formatAmount(tx.amount)}
        </Typography>
      </div>

      <Divider />

      <div className="flex flex-col gap-sm p-lg">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex justify-between items-center">
            <Typography variant="body-sm" color="muted">{label}</Typography>
            <Typography variant="body-sm" color="heading">{value}</Typography>
          </div>
        ))}
      </div>

      {tx.merchantInfo && (
        <CollapsibleSection
          header={<span className="text-sm font-medium text-text-heading">가맹점 정보</span>}
          defaultExpanded={false}
          headerAlign="left"
          className="bg-surface-raised rounded-md mx-lg"
        >
          <div className="flex flex-col gap-sm">
            {tx.merchantInfo.address && (
              <div className="flex justify-between gap-md">
                <Typography variant="caption" color="muted" className="shrink-0">주소</Typography>
                <Typography variant="caption" color="heading" className="text-right">{tx.merchantInfo.address}</Typography>
              </div>
            )}
            {tx.merchantInfo.phone && (
              <div className="flex justify-between">
                <Typography variant="caption" color="muted">전화번호</Typography>
                <Typography variant="caption" color="heading">{tx.merchantInfo.phone}</Typography>
              </div>
            )}
            {tx.merchantInfo.businessType && (
              <div className="flex justify-between">
                <Typography variant="caption" color="muted">업종</Typography>
                <Typography variant="caption" color="heading">{tx.merchantInfo.businessType}</Typography>
              </div>
            )}
          </div>
        </CollapsibleSection>
      )}
    </BottomSheet>
  );
}

// ── 메인 컴포넌트 ─────────────────────────────────────────

export function UsageTransactionItem({ tx, onClick }: UsageTransactionItemProps) {
  const [open, setOpen] = useState(false);
  const isRefund    = tx.amount < 0;
  const isClickable = !!onClick;

  const rowContent = (
    <>
      <div className="flex flex-col gap-0.5 min-w-0 text-left">
        <Typography variant="body-sm" weight="bold" color="heading" className="truncate">
          {tx.merchant}
        </Typography>
        <Typography variant="caption" color="muted" className="truncate">
          {tx.date} · {tx.type} · {tx.cardName}
        </Typography>
      </div>
      <Typography
        variant="body-sm"
        weight="bold"
        className={cn('shrink-0', isRefund ? 'text-brand' : 'text-text-heading')}
      >
        {isRefund ? '-' : ''}{formatAmount(tx.amount)}
      </Typography>
    </>
  );

  const rowCls = cn(
    'flex items-center justify-between w-full py-md gap-md',
    isClickable && 'hover:bg-surface-subtle transition-colors duration-150 cursor-pointer',
  );

  return (
    <>
      {isClickable ? (
        <button
          type="button"
          onClick={() => { setOpen(true); onClick(); }}
          className={rowCls}
        >
          {rowContent}
        </button>
      ) : (
        <div className={rowCls}>{rowContent}</div>
      )}

      {/* onClick이 있을 때만 상세 BottomSheet 렌더링 */}
      {isClickable && (
        <DetailSheet tx={tx} open={open} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
