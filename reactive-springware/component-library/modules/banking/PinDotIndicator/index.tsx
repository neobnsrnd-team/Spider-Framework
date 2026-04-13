/**
 * @file index.tsx
 * @description PIN·비밀번호 입력 진행 상태를 도트로 표시하는 컴포넌트.
 *
 * 계좌 비밀번호 입력 화면처럼 숫자 키패드로 PIN을 입력할 때
 * 몇 자리가 입력됐는지를 원형 도트로 시각화한다.
 * - 입력된 자리: 브랜드 색상 채워진 원 (bg-brand)
 * - 미입력 자리: 테두리만 있는 빈 원 (border-border-subtle)
 *
 * @param length      - 전체 도트 수 (비밀번호 자릿수). 기본: 4
 * @param filledCount - 채워진 도트 수 (현재 입력된 자릿수)
 * @param className   - 추가 Tailwind 클래스
 *
 * @example
 * // 4자리 중 2자리 입력된 상태
 * <PinDotIndicator filledCount={2} />
 */
import React from 'react';
import { cn } from '@lib/cn';
import type { PinDotIndicatorProps } from './types';

export type { PinDotIndicatorProps } from './types';

export function PinDotIndicator({ length = 4, filledCount, className }: PinDotIndicatorProps) {
  return (
    /* aria-live="polite": 도트 상태가 바뀔 때 스크린리더가 입력 진행 상황을 읽어줌 */
    <div
      className={cn('flex items-center gap-5', className)}
      aria-label={`비밀번호 ${filledCount}자리 입력됨`}
      aria-live="polite"
    >
      {Array.from({ length }, (_, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={cn(
            /* Figma 원본 도트 크기: 16px */
            'size-4 rounded-full shrink-0',
            i < filledCount
              /* 입력 완료 자리: 브랜드 색 채워진 원 */
              ? 'bg-brand'
              /* 미입력 자리: 테두리만 있는 빈 원 */
              : 'border-2 border-border-subtle',
          )}
        />
      ))}
    </div>
  );
}
