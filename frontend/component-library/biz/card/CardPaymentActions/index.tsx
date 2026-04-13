/**
 * @file index.tsx
 * @description 카드 결제 액션 버튼 그룹 컴포넌트.
 *
 * 분할납부 / 즉시결제 / 일부결제금액이월약정(리볼빙) 3개의 outline 버튼을
 * 균등 너비로 한 행에 배치한다.
 *
 * StatementTotalCard, UsageHistoryPage 결제 요약 카드 등
 * 카드 결제 액션이 필요한 곳에서 공통으로 사용한다.
 *
 * @param onInstallment      - 분할납부 버튼 클릭
 * @param onImmediatePayment - 즉시결제 버튼 클릭
 * @param onRevolving        - 리볼빙 버튼 클릭
 *
 * @example
 * <CardPaymentActions
 *   onInstallment={() => {}}
 *   onImmediatePayment={() => {}}
 *   onRevolving={() => {}}
 * />
 */
import React from 'react';
import { cn } from '@lib/cn';
import { Button } from '../../../core/Button';
import type { CardPaymentActionsProps } from './types';

const ACTIONS = [
  { key: 'installment',    label: '분할납부' },
  { key: 'immediate',      label: '즉시결제' },
  { key: 'revolving',      label: '일부결제금액이월약정(리볼빙)' },
] as const;

export function CardPaymentActions({
  onInstallment,
  onImmediatePayment,
  onRevolving,
  className,
}: CardPaymentActionsProps) {
  const handlers: Record<typeof ACTIONS[number]['key'], (() => void) | undefined> = {
    installment: onInstallment,
    immediate:   onImmediatePayment,
    revolving:   onRevolving,
  };

  return (
    <div className={cn('flex gap-xs', className)}>
      {ACTIONS.map(({ key, label }) => (
        <Button
          key={key}
          variant="outline"
          size="sm"
          fullWidth
          onClick={handlers[key]}
          /* break-keep: 한글 어절 단위 줄바꿈 / whitespace-normal: 버튼 내 줄바꿈 허용
           * h-auto py-xs: 텍스트가 두 줄이 되어도 자연스럽게 높이 확장 */
          className="break-keep whitespace-normal h-auto py-xs text-xs"
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
