/**
 * @file index.tsx
 * @description 레이블(좌) / 값(우) 한 행 배치 컴포넌트.
 *
 * "잔액 ··· 3,000,000원", "나의자산 현황 ··· 총 4,000,000원" 처럼
 * 두 정보를 한 행에 좌우로 배치하는 반복 패턴을 표준화한다.
 * value는 문자열 또는 ReactNode로 전달해 스타일을 자유롭게 제어할 수 있다.
 *
 * @param label - 좌측 레이블 텍스트
 * @param value - 우측 값 (문자열 또는 ReactNode)
 *
 * @example
 * // 단순 문자열
 * <LabelValueRow label="나의자산 현황" value="총 4,000,000원" />
 *
 * @example
 * // 값에 커스텀 스타일 적용
 * <LabelValueRow
 *   label="잔액"
 *   value={
 *     <span className="text-xl font-bold font-numeric text-text-heading">
 *       3,000,000원
 *     </span>
 *   }
 * />
 */
import React from 'react';
import { cn } from '@lib/cn';
import type { LabelValueRowProps } from './types';

export function LabelValueRow({ label, value, className }: LabelValueRowProps) {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      <span className="text-xs text-text-muted">{label}</span>
      {/* value가 string이면 기본 스타일 적용, ReactNode면 그대로 렌더링 */}
      {typeof value === 'string'
        ? <span className="text-sm font-bold text-text-heading">{value}</span>
        : value
      }
    </div>
  );
}
