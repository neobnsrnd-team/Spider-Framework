/**
 * @file index.tsx
 * @description 내카드관리 화면 연결계좌 잔액 컴포넌트.
 *
 * "연결계좌 잔액" 레이블 옆에 배지 버튼(보기/숨기기)을 배치하고,
 * 클릭 시 금액 마스킹 상태를 전환한다.
 * hidden 상태 관리는 외부 Hook 담당.
 *
 * 반응형 동작:
 * - 레이블: text-xs → sm:text-sm
 * - 금액: text-xl → sm:text-2xl
 *
 * @param balance  - 연결계좌 잔액 (원)
 * @param hidden   - true: 금액 마스킹
 * @param onToggle - 보기/숨기기 배지 클릭 핸들러
 *
 * @example
 * const [hidden, setHidden] = useState(false);
 * <CardLinkedBalance balance={1200000} hidden={hidden} onToggle={() => setHidden(h => !h)} />
 */
import React from 'react';
import { cn } from '@lib/cn';
import { Badge } from '../../../core/Badge';
import type { CardLinkedBalanceProps } from './types';

/** 금액을 한국식 원화 형식으로 변환. 예: 1200000 → '1,200,000원' */
function formatAmount(amount: number): string {
  return `${amount.toLocaleString('ko-KR')}원`;
}

export function CardLinkedBalance({
  balance,
  hidden,
  onToggle,
  className,
}: CardLinkedBalanceProps) {
  return (
    <div className={cn('flex flex-col gap-xs', className)}>
      <span className="text-xs sm:text-sm text-text-muted">사용가능 한도 금액</span>

      {/* 금액 + 보기/숨기기 배지 버튼 */}
      <div className="flex items-center gap-xs">
        <span className="text-xl sm:text-2xl font-bold text-text-heading">
          {hidden ? '잔액 숨김 중' : formatAmount(balance)}
        </span>
        {/* 배지를 버튼으로 감싸 클릭 이벤트 부여 */}
        <button
          type="button"
          onClick={onToggle}
          aria-label={hidden ? '잔액 보기' : '잔액 숨기기'}
          className="cursor-pointer"
        >
          <Badge variant="neutral">{hidden ? '보기' : '숨기기'}</Badge>
        </button>
      </div>
    </div>
  );
}
