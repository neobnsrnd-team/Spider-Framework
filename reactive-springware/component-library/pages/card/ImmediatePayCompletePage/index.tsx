/**
 * @file index.tsx
 * @description 즉시결제 완료 페이지 (STEP 4).
 *
 * 화면 구성:
 *   - 완료 아이콘 + "즉시결제 신청이 완료되었습니다." 메시지
 *   - 결제 정보 요약 (카드명 / 결제금액 / 출금계좌 / 처리일시)
 *   - 하단 고정 확인 버튼
 *
 * @param cardName    - 결제 카드명
 * @param amount      - 결제 금액 (원)
 * @param account     - 출금 계좌
 * @param completedAt - 처리일시
 * @param onConfirm   - 확인 버튼 클릭
 */
import React from 'react';
import { CheckCircle } from 'lucide-react';

import { PageLayout } from '../../../layout/PageLayout';
import { Button } from '../../../core/Button';
import { Typography } from '../../../core/Typography';
import { LabelValueRow } from '../../../modules/common/LabelValueRow';
import { Divider } from '../../../modules/common/Divider';

import type { ImmediatePayCompletePageProps } from './types';

function formatAmount(n: number) {
  return `${n.toLocaleString('ko-KR')}원`;
}

export function ImmediatePayCompletePage({
  cardName,
  amount,
  account,
  completedAt,
  onConfirm,
}: ImmediatePayCompletePageProps) {
  return (
    <PageLayout
      title="즉시결제"
      bottomBar={
        <Button variant="primary" size="lg" fullWidth onClick={onConfirm}>
          확인
        </Button>
      }
    >
      <div className="flex flex-col gap-lg px-standard pt-md pb-xl">
        {/* ── 완료 아이콘 + 메시지 ────────────────────────────────
         * 체크 아이콘으로 성공 상태를 시각적으로 전달한다. */}

        <div className="flex flex-col items-center gap-md py-xl">
          <div className="flex items-center justify-center size-16 rounded-full bg-brand-10">
            <CheckCircle className="size-9 text-brand" aria-hidden="true" />
          </div>
          <Typography variant="subheading" weight="bold" color="heading">
            즉시결제 신청이 완료되었습니다.
          </Typography>
        </div>

        <Divider />

        {/* ── 결제 정보 요약 ──────────────────────────────────────── */}
        <div className="flex flex-col gap-sm bg-surface rounded-xl px-md py-md shadow-card">
          <Typography variant="body-sm" weight="bold" color="heading">
            결제 정보
          </Typography>
          <div className="flex flex-col gap-xs">
            <LabelValueRow label="카드명" value={cardName} />
            <LabelValueRow label="결제금액" value={formatAmount(amount)} />
            <LabelValueRow label="출금계좌" value={account} />
            <LabelValueRow label="처리일시" value={completedAt} />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
