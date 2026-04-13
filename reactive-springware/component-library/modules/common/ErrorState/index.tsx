/**
 * @file index.tsx
 * @description API 호출 실패·네트워크 오류 등 에러 상태를 표시하는 공통 컴포넌트.
 * isError 상태에서 렌더링하며, 재시도 버튼을 선택적으로 노출한다.
 *
 * EmptyState(데이터 없음)와 역할이 다르다:
 * - EmptyState: 정상 응답이지만 데이터가 없는 경우
 * - ErrorState: API 요청 자체가 실패한 경우
 *
 * @param title       - 에러 제목. 기본: '오류가 발생했습니다'
 * @param description - 에러 상세 설명
 * @param onRetry     - 재시도 버튼 핸들러 (전달 시 버튼 노출)
 * @param retryLabel  - 재시도 버튼 레이블. 기본: '다시 시도'
 * @param className   - 추가 Tailwind 클래스
 *
 * @example
 * // 기본 사용
 * if (isError) return <ErrorState description="데이터를 불러오지 못했습니다." />;
 *
 * @example
 * // 재시도 버튼 포함
 * if (isError) return (
 *   <ErrorState
 *     description="거래 내역을 불러오지 못했습니다."
 *     onRetry={() => refetch()}
 *   />
 * );
 */
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@lib/cn';
import type { ErrorStateProps } from './types';

export type { ErrorStateProps } from './types';

export function ErrorState({
  title = '오류가 발생했습니다',
  description,
  onRetry,
  retryLabel = '다시 시도',
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center px-xl py-2xl gap-lg',
        className,
      )}
      role="alert"
      aria-label={title}
    >
      {/* 에러를 시각적으로 인지할 수 있도록 danger 색상 아이콘 사용 */}
      <span className="text-danger" aria-hidden="true">
        <AlertCircle size={48} />
      </span>

      <div className="flex flex-col gap-sm">
        <p className="text-base font-bold text-text-heading">{title}</p>
        {description && (
          <p className="text-sm text-text-muted leading-relaxed">{description}</p>
        )}
      </div>

      {/* onRetry 전달 시에만 버튼 노출 — 재시도 불가 에러는 버튼 생략 */}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-sm px-lg py-sm text-sm font-medium rounded-xl border border-border-base text-text-base hover:bg-surface-subtle active:bg-surface-subtle transition-colors"
        >
          {retryLabel}
        </button>
      )}
    </div>
  );
}
