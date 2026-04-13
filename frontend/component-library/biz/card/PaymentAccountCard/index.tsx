/**
 * @file index.tsx
 * @description 결제 계좌 안내 카드 컴포넌트.
 *
 * 즉시결제(선결제) 화면에서 당행/타행 결제 계좌를 안내하는 카드.
 * 왼쪽: 아이콘 / 가운데: 계좌 명칭 + 출금 가능 시간
 *
 * @param title - 결제 계좌 명칭. 예: '하나은행 결제계좌'
 * @param hours - 출금 가능 시간. 예: '365일 06:00~23:30'
 * @param icon  - 당행/타행을 구분하는 아이콘 (lucide-react 컴포넌트)
 */
import React from 'react';
import { Typography } from '../../../core/Typography';
import type { PaymentAccountCardProps } from './types';

export type { PaymentAccountCardProps } from './types';

export function PaymentAccountCard({ title, hours, icon }: PaymentAccountCardProps) {
  return (
    <div className="flex items-center justify-between w-full gap-md bg-surface rounded-md border border-border px-md py-md shadow-card">
      <div className="flex flex-col gap-xs">
        <Typography variant="body-sm" weight="bold" color="heading">
          {title}
        </Typography>
        <Typography variant="caption" color="muted">
          {hours}
        </Typography>
      </div>
      {/* 당행/타행 구분 아이콘 */}
      <div className="flex items-center justify-center size-10 rounded-full bg-brand-10 text-brand shrink-0">
        {icon}
      </div>
    </div>
  );
}
