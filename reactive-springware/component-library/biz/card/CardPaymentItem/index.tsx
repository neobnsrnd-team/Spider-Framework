/**
 * @file index.tsx
 * @description 카드 이용내역 목록의 개별 결제 항목 행 컴포넌트.
 *
 * 왼쪽 원형 아이콘 + 카드명(영문/한글) + 오른쪽 금액·상세보기로 구성된
 * 한 행 레이아웃이다.
 *
 * - amount가 음수인 경우 취소/환불을 의미하며 텍스트 색상이 brand로 변경됨
 * - onDetailClick 미전달 시 "상세보기" 버튼이 렌더링되지 않음
 * - onClick 전달 시 행 전체가 버튼으로 동작
 *
 * @param icon             - 가맹점·서비스 아이콘 (React 노드)
 * @param iconBgClassName  - 아이콘 배경 Tailwind 클래스 (기본: bg-brand-10)
 * @param cardEnName       - 카드 영문명. 예: 'HANA MONEY CHECK'
 * @param cardName         - 카드 한글명 또는 가맹점명. 예: '하나 머니 체크카드'
 * @param amount           - 결제 금액 (원). 음수면 취소/환불
 * @param onDetailClick    - 상세보기 버튼 클릭 핸들러
 * @param onClick          - 행 전체 클릭 핸들러
 *
 * @example
 * <CardPaymentItem
 *   icon={<CreditCard size={18} />}
 *   cardEnName="HANA MONEY CHECK"
 *   cardName="하나 머니 체크카드"
 *   amount={15000}
 *   onDetailClick={() => router.push('/card/detail')}
 * />
 */
import React from 'react';
import { cn } from '@lib/cn';
import type { CardPaymentItemProps } from './types';

/** 금액을 한국식 원화 형식으로 변환. 예: 15000 → '15,000원' */
function formatAmount(amount: number): string {
  return `${Math.abs(amount).toLocaleString('ko-KR')}원`;
}

export function CardPaymentItem({
  icon,
  iconBgClassName,
  cardEnName,
  cardName,
  amount,
  onDetailClick,
  onClick,
  className,
}: CardPaymentItemProps) {
  /* 음수 금액 = 취소/환불 → brand 색상으로 구분 */
  const isRefund = amount < 0;

  const content = (
    <>
      {/* 아이콘 영역 */}
      <span
        className={cn(
          'shrink-0 flex items-center justify-center size-12 rounded-full text-brand',
          /* 외부에서 배경색 커스텀 가능. 기본값은 bg-brand-10 */
          iconBgClassName ?? 'bg-brand-10',
        )}
        aria-hidden="true"
      >
        {icon}
      </span>

      {/* 카드 정보 — 영문명(보조)과 한글명(주) 세로 배열 */}
      <div className="flex-1 min-w-0 flex flex-col gap-[2px]">
        <span className="text-xs text-text-muted truncate">{cardEnName}</span>
        <span className="text-sm font-bold text-text-heading truncate">{cardName}</span>
      </div>

      {/* 금액 + 상세보기 */}
      <div className="shrink-0 flex flex-col items-end gap-[2px]">
        <span
          className={cn(
            'text-sm font-bold',
            /* 취소/환불은 brand 색상, 일반 결제는 heading 색상 */
            isRefund ? 'text-brand' : 'text-text-heading',
          )}
        >
          {isRefund ? '-' : ''}{formatAmount(amount)}
        </span>

        {/* 상세보기 버튼 — onDetailClick 미전달 시 렌더링하지 않음 */}
        {onDetailClick && (
          <button
            type="button"
            onClick={(e) => {
              /* 행 전체 onClick 이벤트로 버블링되지 않도록 차단 */
              e.stopPropagation();
              onDetailClick();
            }}
            className="text-xs text-brand hover:underline"
          >
            상세보기
          </button>
        )}
      </div>
    </>
  );

  /* onClick이 있으면 행 전체를 버튼으로 감쌈 */
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'flex items-center gap-md w-full',
          'py-md px-0',
          'hover:bg-surface-subtle transition-colors duration-150 rounded-xl',
          className,
        )}
      >
        {content}
      </button>
    );
  }

  return (
    <div className={cn('flex items-center gap-md w-full py-md', className)}>
      {content}
    </div>
  );
}
