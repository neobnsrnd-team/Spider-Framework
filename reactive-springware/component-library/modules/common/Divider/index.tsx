/**
 * @file index.tsx
 * @description 섹션 구분을 위한 단순 수평선 컴포넌트.
 *
 * 계좌상세·이체 확인처럼 정보 영역과 목록 영역을 시각적으로 분리할 때 사용한다.
 * DividerWithLabel과 달리 텍스트 없이 순수한 선(border)만 렌더링한다.
 *
 * @param className - 추가 Tailwind 클래스 (색상·두께 override 시)
 *
 * @example
 * <Stack gap="md">
 *   <InfoRow label="출금가능액" value="2,950,000원" />
 *   <Divider />
 *   <SectionHeader title="거래내역" />
 * </Stack>
 */
import React from 'react';
import { cn } from '@lib/cn';

export interface DividerProps {
  /** 추가 Tailwind 클래스 */
  className?: string;
}

export function Divider({ className }: DividerProps) {
  return (
    /* border-border-subtle: design-tokens 기본 구분선 색상 */
    <hr
      className={cn('border-0 border-t border-border-subtle my-0', className)}
      aria-hidden="true"
    />
  );
}
