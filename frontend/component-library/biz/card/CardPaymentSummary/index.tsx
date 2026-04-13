/**
 * @file index.tsx
 * @description 카드 이용내역 화면 상단 청구 요약 카드 컴포넌트.
 *
 * 총 청구금액을 크게 강조하고, 리볼빙·카드론·현금서비스 세부 항목을
 * 3열 그리드로 표시한다. 하단 회색 영역에 결제 계좌와 결제일을 노출한다.
 *
 * 표시 규칙:
 * - revolving / cardLoan / cashAdvance 가 0 또는 미전달이면 '0원'으로 표시
 * - 중간 열에 border-x 구분선을 적용해 시각적 분리
 *
 * @param month          - 청구 월. 예: '3월'
 * @param totalAmount    - 총 청구금액 (원)
 * @param revolving      - 리볼빙 금액 (원)
 * @param cardLoan       - 카드론 금액 (원)
 * @param cashAdvance    - 현금서비스 금액 (원)
 * @param paymentAccount - 결제 계좌. 예: '하나은행 123-456789-01234'
 * @param paymentDate    - 결제일. 예: '매월 14일'
 *
 * @example
 * <CardPaymentSummary
 *   month="3월"
 *   totalAmount={350000}
 *   revolving={50000}
 *   cardLoan={0}
 *   cashAdvance={0}
 *   paymentAccount="하나은행 123-456789-01234"
 *   paymentDate="매월 14일"
 * />
 */
import React from 'react';
import { cn } from '@lib/cn';
import type { CardPaymentSummaryProps } from './types';
import { Typography } from '../../../core/Typography';
import { ChevronDown, ChevronRight } from 'lucide-react';

/** 금액을 한국식 원화 형식으로 변환. 예: 350000 → '350,000원' */
function formatAmount(amount: number): string {
  return `${amount.toLocaleString('ko-KR')}원`;
}

interface SummaryColProps {
  /** 버튼에 표시할 전체 서비스명. 예: '일부결제금액이월약정(리볼빙)' */
  label: string;
  amount: number;
  /** 중간 열: 좌우 border 구분선 적용 */
  bordered?: boolean;
  /** 전달 시 레이블을 클릭 가능한 버튼으로 렌더링 */
  onClick?: () => void;
}

/** 청구 세부 항목 1열 — 서비스명 버튼 + 금액 */
function SummaryCol({ label, amount, bordered, onClick }: SummaryColProps) {
  return (
    <div
      className={cn(
        'flex-1 flex flex-col items-center gap-xs px-xs',
        bordered && 'border-x border-border-subtle',
      )}
    >
      {/* onClick 전달 시 버튼, 미전달 시 일반 텍스트 */}
      {onClick ? (
        <button
          type="button"
          onClick={onClick}
          className="text-xs text-brand hover:underline text-center leading-tight break-keep whitespace-pre-wrap"
        >
          {label.split('\\n').join('\n')}
        </button>
      ) : (
        <span className="text-xs text-text-muted text-center leading-tight">
          {label.split('\\n').join('\n')}
        </span>
      )}
      {/* 금액이 0이면 영역 미노출 */}
      {amount > 0 && (
        <span className="text-sm font-bold text-text-heading">{formatAmount(amount)}</span>
      )}
    </div>
  );
}

export function CardPaymentSummary({
  dateFull,
  dateYM,
  dateMD,
  totalAmount,
  revolving = 0,
  cardLoan = 0,
  cashAdvance = 0,
  onRevolving,
  onCardLoan,
  onCashAdvance,
  onDateClick,
  className,
}: CardPaymentSummaryProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-md',
        'bg-surface rounded-2xl overflow-hidden',
        'shadow-card',
        className,
      )}
    >
      {/* 상단: 총 청구금액 */}
      <div className="flex flex-col items-center gap-xs pt-lg px-md">
        {/* 날짜 영역 — onDateClick 전달 시 버튼으로 렌더링해 날짜 선택 모달 진입 */}
        <button
          type="button"
          onClick={onDateClick}
          disabled={!onDateClick}
          className="flex items-center gap-xs text-lg text-text-muted disabled:cursor-default"
        >
          {dateYM}
          <ChevronDown className="size-4" />
        </button>
        <span className="text-sm text-text-muted">
          {dateFull} 출금예정 ({dateMD}기준)
        </span>
        <span className="text-3xl font-bold text-brand pt-lg">{formatAmount(totalAmount)}</span>
      </div>

      {/* 하단: 세부 항목 3열 그리드 — 각 레이블은 해당 서비스 진입 버튼 */}
      <div className="flex items-start pb-md pt-lg -mx-xs">
        <SummaryCol
          label="일부결제금액\n이월약정(리볼빙)"
          amount={revolving}
          onClick={onRevolving}
        />
        {/* 중간 열에 border-x 적용해 좌우 항목과 시각적으로 구분 */}
        <SummaryCol
          label="장기카드대출\n(카드론)"
          amount={cardLoan}
          bordered
          onClick={onCardLoan}
        />
        <SummaryCol
          label="단기카드대출\n(현금서비스)"
          amount={cashAdvance}
          onClick={onCashAdvance}
        />
      </div>
    </div>
  );
}
