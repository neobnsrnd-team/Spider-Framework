/**
 * @file index.tsx
 * @description 최근 이체 수취인 목록 단일 항목 컴포넌트.
 *
 * 수취인명·은행명·마스킹 계좌번호를 가로 행으로 표시한다.
 * 클릭 시 해당 수취인 정보로 이체 폼이 자동 채워진다.
 * 최근 수취인 목록, BottomSheet 내 수취인 선택 등에 공통으로 사용한다.
 *
 * @param name           - 수취인명
 * @param bankName       - 은행명
 * @param maskedAccount  - 마스킹된 계좌번호
 * @param onClick        - 클릭 핸들러
 */
import React from 'react';
import { User, ChevronRight } from 'lucide-react';

import { Typography } from '../../../core/Typography';
import type { RecentRecipientItemProps } from './types';

export type { RecentRecipientItemProps } from './types';

export function RecentRecipientItem({ name, bankName, maskedAccount, onClick }: RecentRecipientItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center justify-between w-full px-md py-sm hover:bg-surface-raised transition-colors duration-100 border-b border-border-subtle last:border-b-0"
    >
      <div className="flex items-center gap-sm">
        {/* 수취인 아이콘 — 사람 모양으로 수취인임을 직관적으로 표시 */}
        <div className="flex items-center justify-center size-9 rounded-full bg-surface-raised shrink-0">
          <User className="size-4 text-text-muted" aria-hidden="true" />
        </div>
        <div className="flex flex-col gap-xs text-left">
          <Typography variant="body-sm" weight="bold" color="heading">
            {name}
          </Typography>
          <Typography variant="caption" color="muted">
            {bankName} {maskedAccount}
          </Typography>
        </div>
      </div>
      <ChevronRight className="size-4 text-text-muted shrink-0" aria-hidden="true" />
    </button>
  );
}
