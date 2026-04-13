/**
 * @file index.tsx
 * @description 보유 카드 한 장을 표시하는 칩 형태 아이템 컴포넌트.
 *
 * 카드 아이콘(브랜드 원형 배경) + 카드명 + 마스킹된 카드번호를 가로로 나열한다.
 * CollapsibleSection 내부 카드 목록, 아코디언 카드 확인 영역 등에 공통으로 사용한다.
 *
 * @param name         - 카드명 (예: '하나 머니 체크카드')
 * @param maskedNumber - 마스킹된 카드번호 (예: '1234-****-****-5678')
 */
import React from 'react';
import { CreditCard } from 'lucide-react';

import { Typography } from '../../../core/Typography';
import type { CardChipItemProps } from './types';

export type { CardChipItemProps } from './types';

export function CardChipItem({ name, maskedNumber }: CardChipItemProps) {
  return (
    <div className="flex items-center gap-sm px-sm py-sm">
      {/* 카드 아이콘 — 브랜드 색상 원형 배경으로 카드임을 직관적으로 표시 */}
      <div className="flex items-center justify-center size-8 rounded-full bg-brand-10 text-brand shrink-0">
        <CreditCard className="size-4" aria-hidden="true" />
      </div>
      <div className="flex flex-col gap-xs">
        <Typography variant="body-sm" weight="bold" color="heading">
          {name}
        </Typography>
        <Typography variant="caption" color="muted">
          {maskedNumber}
        </Typography>
      </div>
    </div>
  );
}
