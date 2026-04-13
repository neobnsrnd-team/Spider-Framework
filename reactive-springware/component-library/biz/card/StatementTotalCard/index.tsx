/**
 * @file index.tsx
 * @description 이용대금명세서 총 결제금액 카드 컴포넌트.
 *
 * "총 결제금액" 레이블 + 선택적 '예정' 배지, 금액(우측 화살표 클릭 시 이용내역 이동),
 * 분할납부·즉시결제·리볼빙 3개 액션 버튼으로 구성된다.
 *
 * @param amount            - 총 결제금액 (원)
 * @param badge             - '예정' 배지 텍스트. 미전달 시 배지 미노출
 * @param onDetailClick     - 금액 우측 화살표 클릭 → 이용내역 화면 이동
 * @param onInstallment     - 분할납부 버튼 클릭
 * @param onImmediatePayment- 즉시결제 버튼 클릭
 * @param onRevolving       - 일부결제금액이월약정(리볼빙) 버튼 클릭
 *
 * @example
 * <StatementTotalCard
 *   amount={350000}
 *   badge="예정"
 *   onDetailClick={() => router.push('/card/history')}
 *   onInstallment={() => {}}
 *   onImmediatePayment={() => {}}
 *   onRevolving={() => {}}
 * />
 */
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@lib/cn';
import type { StatementTotalCardProps } from './types';
import { Badge } from '../../../core/Badge';
import { CardPaymentActions } from '../CardPaymentActions';

/** 금액을 한국식 원화 형식으로 변환. 예: 350000 → '350,000원' */
function formatAmount(amount: number): string {
  return `${amount.toLocaleString('ko-KR')}원`;
}

export function StatementTotalCard({
  amount,
  badge,
  onDetailClick,
  onInstallment,
  onImmediatePayment,
  onRevolving,
  className,
}: StatementTotalCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-md',
        'bg-surface rounded-2xl overflow-hidden shadow-card',
        'px-md pt-md pb-lg',
        className,
      )}
    >
      {/* 상단: 레이블 + 배지 */}
      <div className="flex items-center gap-xs">
        <span className="text-sm text-text-muted">총 결제금액</span>
        {/* badge가 '예정'일 때만 노출 */}
        {badge && <Badge variant="brand">{badge}</Badge>}
      </div>

      {/* 중단: 금액 + 우측 화살표 */}
      <button
        type="button"
        onClick={onDetailClick}
        disabled={!onDetailClick}
        className="flex items-center disabled:cursor-default group"
        aria-label="이용내역 보기"
      >
        <span className="text-3xl font-bold text-text-heading">{formatAmount(amount)}</span>
        {/* onDetailClick 전달 시 화살표 노출 */}
        {onDetailClick && (
          <ChevronRight
            size={24}
            className="text-text-muted group-hover:text-brand transition-colors duration-150"
          />
        )}
      </button>

      {/* 하단: 결제 액션 버튼 3개 */}
      <CardPaymentActions
        onInstallment={onInstallment}
        onImmediatePayment={onImmediatePayment}
        onRevolving={onRevolving}
      />
    </div>
  );
}
