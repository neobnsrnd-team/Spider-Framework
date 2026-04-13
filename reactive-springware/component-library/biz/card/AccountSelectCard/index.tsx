/**
 * @file index.tsx
 * @description 출금계좌 선택 카드 컴포넌트.
 *
 * 계좌 목록에서 하나의 계좌를 선택하는 버튼 형태의 카드.
 * 선택 시 브랜드 색상 테두리·배경으로 강조되고, 우측에 체크 아이콘이 표시된다.
 * 출금계좌 선택이 필요한 모든 화면에서 공통으로 사용한다.
 *
 * @param bankName       - 은행명 (예: '하나은행')
 * @param maskedAccount  - 마스킹된 계좌번호 (예: '123-****-5678')
 * @param isSelected     - 선택 여부
 * @param onClick        - 클릭 핸들러
 */
import React from 'react';
import { Building2, CheckCircle } from 'lucide-react';
import { cn } from '@lib/cn';

import { Typography } from '../../../core/Typography';
import type { AccountSelectCardProps } from './types';

export type { AccountSelectCardProps } from './types';

export function AccountSelectCard({ bankName, maskedAccount, isSelected, onClick }: AccountSelectCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex items-center justify-between w-full rounded-xl px-md py-md',
        'border transition-colors duration-150',
        isSelected
          ? 'border-brand bg-brand-10'
          : 'border-border bg-surface hover:bg-surface-raised',
      )}
      aria-pressed={isSelected}
    >
      <div className="flex items-center gap-sm">
        {/* 은행 아이콘 원형 배경 */}
        <div className="flex items-center justify-center size-8 rounded-full bg-surface-raised shrink-0">
          <Building2 className="size-4 text-text-muted" aria-hidden="true" />
        </div>
        <div className="flex flex-col gap-xs text-left">
          <Typography variant="body-sm" weight="bold" color="heading">
            {bankName}
          </Typography>
          <Typography variant="caption" color="muted">
            {maskedAccount}
          </Typography>
        </div>
      </div>

      {/* 선택 시에만 체크 아이콘 표시 */}
      {isSelected && (
        <CheckCircle className="size-5 text-brand shrink-0" aria-hidden="true" />
      )}
    </button>
  );
}
