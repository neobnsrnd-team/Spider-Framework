/**
 * @file index.tsx
 * @description 이체 한도 안내 컴포넌트.
 *
 * 1회·1일 이체 한도와 오늘 사용 누적 금액을 표시한다.
 * usedAmount 전달 시 잔여 한도를 함께 계산해 보여준다.
 * 이체 입력 화면 하단 또는 한도 안내 섹션에 사용한다.
 *
 * @param perTransferLimit - 1회 이체 한도 (원)
 * @param dailyLimit       - 1일 이체 한도 (원)
 * @param usedAmount       - 오늘 이체 누적 금액 (원, 선택)
 */
import React from 'react';

import { Typography } from '../../../core/Typography';
import { LabelValueRow } from '../../common/LabelValueRow';
import type { TransferLimitInfoProps } from './types';

/** 원화 금액을 '1,000,000원' 형식으로 포맷 */
function formatAmount(amount: number): string {
  return `${amount.toLocaleString('ko-KR')}원`;
}

export type { TransferLimitInfoProps } from './types';

export function TransferLimitInfo({ perTransferLimit, dailyLimit, usedAmount }: TransferLimitInfoProps) {
  /** 1일 잔여 한도 — usedAmount 전달 시에만 계산 */
  const remainingLimit = usedAmount !== undefined ? Math.max(dailyLimit - usedAmount, 0) : undefined;

  return (
    <div className="flex flex-col gap-xs bg-surface-raised rounded-xl px-md py-md">
      <Typography variant="caption" weight="bold" color="secondary" className="mb-xs">
        이체 한도 안내
      </Typography>
      <LabelValueRow label="1회 이체 한도" value={formatAmount(perTransferLimit)} />
      <LabelValueRow label="1일 이체 한도" value={formatAmount(dailyLimit)} />
      {usedAmount !== undefined && (
        <LabelValueRow label="오늘 이체 누적" value={formatAmount(usedAmount)} />
      )}
      {remainingLimit !== undefined && (
        <LabelValueRow label="1일 잔여 한도" value={formatAmount(remainingLimit)} />
      )}
    </div>
  );
}
