/**
 * @file index.tsx
 * @description 이체 확인 BottomSheet 페이지 컴포넌트.
 *
 * Figma 원본: Hana Bank App node-id: 1:2124
 * 이체 실행 직전 사용자에게 이체 정보를 요약·확인시키는 화면.
 * "예" 클릭 → onConfirm (보통 PIN 입력 화면으로 연결)
 * "아니오" 클릭 → onClose (BottomSheet 닫기)
 *
 * 화면 구성 (BottomSheet 내부):
 *   1. 멀티컬러 타이틀 — "{수취인}님께 {금액}원을 이체 하시겠습니까?"
 *   2. 이체 정보 목록 — 출금계좌·입금계좌·이체금액·수수료·내통장표시·받는분통장표시
 *   3. 주의 배너 — 착오송금 방지 안내
 *   4. 추가이체 링크 (onAddTransfer prop 전달 시만 표시)
 *   5. Footer — "아니오" / "예" 버튼
 *
 * @param open           - BottomSheet 열림 여부
 * @param onClose        - 닫기 핸들러
 * @param onConfirm      - 확인("예") 핸들러
 * @param onAddTransfer  - 추가이체 링크 핸들러 (선택)
 * @param recipientName  - 수취인 이름
 * @param amount         - 이체 금액 (원 단위 숫자)
 * @param fromAccount    - 출금 계좌
 * @param toAccount      - 입금 계좌
 * @param fee            - 수수료. 기본: 0
 * @param myMemo         - 내 통장 표시
 * @param recipientMemo  - 받는 분 통장 표시
 */
import React from 'react';
import { Plus } from 'lucide-react';

/* ── Modules ─────────────────────────────────────────────────────── */
import { BottomSheet } from '../../../modules/common/BottomSheet';
import { InfoRow } from '../../../modules/common/InfoRow';
import { AlertBanner } from '../../../modules/common/AlertBanner';

/* ── Core ────────────────────────────────────────────────────────── */
import { Button } from '../../../core/Button';
import { Typography } from '../../../core/Typography';

/* ── Layout ──────────────────────────────────────────────────────── */
import { Stack } from '../../../layout/Stack';
import { Inline } from '../../../layout/Inline';

import type { TransferConfirmPageProps } from './types';

export type { TransferConfirmPageProps } from './types';

// ── 서브 컴포넌트 ─────────────────────────────────────────────────

/**
 * BottomSheet footer 슬롯: "아니오" 아웃라인 버튼 + "예" 프라이머리 버튼.
 * "아니오"는 자연 너비, "예"는 flex-1 으로 남은 공간을 채운다.
 */
function ConfirmFooter({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  return (
    <Inline gap="md">
      <Button variant="outline" size="lg" onClick={onClose}>
        아니오
      </Button>
      <Button size="lg" fullWidth onClick={onConfirm}>
        예
      </Button>
    </Inline>
  );
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────────

export function TransferConfirmPage({
  open,
  onClose,
  onConfirm,
  onAddTransfer,
  recipientName,
  amount,
  fromAccount,
  toAccount,
  fee = 0,
  myMemo,
  recipientMemo,
}: TransferConfirmPageProps) {
  /* 금액 포맷: 100000 → "100,000" */
  const formattedAmount = amount.toLocaleString('ko-KR');
  /* 수수료 포맷 및 색상: 0원이면 브랜드 색 강조 */
  const formattedFee = fee.toLocaleString('ko-KR');
  const feeValueClass = fee === 0 ? 'text-brand-text' : undefined;

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      footer={<ConfirmFooter onClose={onClose} onConfirm={onConfirm} />}
      /* 이체 확인 화면: Footer의 "아니오"/"예" 버튼으로 닫기를 처리하므로 X 버튼 불필요 */
      hideCloseButton
    >
      <Stack gap="xl">
        {/* 멀티컬러 타이틀 — 수취인·금액을 브랜드 색으로 강조 */}
        <Typography as="h2" variant="subheading" className="text-center whitespace-pre-line">
          {/* 수취인명과 이체금액만 브랜드 색 */}
          <span className="text-brand-text">{recipientName}</span>
          {'님께 '}
          <span className="text-brand-text">{formattedAmount}원</span>
          {'을\n이체 하시겠습니까?'}
        </Typography>

        {/* 이체 정보 목록 — 배열+filter로 선택 항목 유무와 무관하게 마지막 행 구분선을 동적 처리 */}
        <div>
          {(
            [
              { label: '출금계좌', value: fromAccount },
              { label: '입금계좌', value: toAccount },
              {
                label: '이체금액',
                value: `${formattedAmount}원`,
                /* 이체금액은 한 단계 큰 텍스트로 주목도 강조 */
                valueClassName: 'text-base',
              },
              { label: '수수료', value: `${formattedFee}원`, valueClassName: feeValueClass },
              /* 선택 항목: 값이 있을 때만 배열에 포함 */
              myMemo ? { label: '내통장표시', value: myMemo } : null,
              recipientMemo ? { label: '받는분통장표시', value: recipientMemo } : null,
            ] as ({ label: string; value: string; valueClassName?: string } | null)[]
          )
            .filter((item): item is { label: string; value: string; valueClassName?: string } => item !== null)
            .map((item, index, arr) => (
              <InfoRow
                key={item.label}
                label={item.label}
                value={item.value}
                valueClassName={item.valueClassName}
                /* 마지막 행만 구분선 제거 */
                showBorder={index < arr.length - 1}
              />
            ))}
        </div>

        {/* 주의 배너 — 착오송금 방지 안내 */}
        <AlertBanner intent="warning">
          착오송금 방지를 위해 이체정보를 다시 한번 확인하세요!
        </AlertBanner>

        {/* 추가이체 링크 — onAddTransfer prop이 있을 때만 표시 */}
        {onAddTransfer && (
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Plus className="size-3" aria-hidden="true" />}
              onClick={onAddTransfer}
            >
              추가이체
            </Button>
          </div>
        )}
      </Stack>
    </BottomSheet>
  );
}
