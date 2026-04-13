/**
 * @file index.tsx
 * @description 레이블-값 정보 행 컴포넌트.
 *
 * Figma 원본: Hana Bank App node-id: 1:2124 (이체 확인 화면의 정보 행)
 *
 * 이체 확인·계좌 상세처럼 key-value 형식의 정보를 본문 수준(14px)으로 나열할 때 사용한다.
 * Card 내부의 요약 정보(12px)를 표시하는 CardRow와 달리, 정보 자체가 메인 콘텐츠인
 * 경우에 적합하다.
 *
 * @param label         - 행 좌측 레이블
 * @param value         - 행 우측 값
 * @param valueClassName - 값 텍스트 추가 클래스 (색상·크기 override)
 * @param showBorder    - 하단 구분선 표시 여부. 기본: true
 * @param className     - 추가 Tailwind 클래스
 *
 * @example
 * <InfoRow label="출금계좌" value="하나 123-456-789012" />
 * <InfoRow label="이체금액" value="100,000원" valueClassName="text-base" />
 * <InfoRow label="수수료"   value="0원" valueClassName="text-brand-text" showBorder={false} />
 */
import React from 'react';
import { cn } from '@lib/cn';
import type { InfoRowProps } from './types';

export type { InfoRowProps } from './types';

export function InfoRow({ label, value, valueClassName, showBorder = true, className }: InfoRowProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-md py-sm',
        /* showBorder: 행 간 경계를 얇은 border로 구분. 마지막 행은 false */
        showBorder && 'border-b border-border-subtle',
        className,
      )}
    >
      {/* 레이블: secondary(#475569) 색상으로 값과 시각적 계층 구분 */}
      <span className="text-sm text-text-secondary shrink-0">{label}</span>
      {/* 값: 우측 정렬, 긴 텍스트는 줄바꿈 허용 */}
      <span className={cn('text-sm text-text-heading text-right', valueClassName)}>{value}</span>
    </div>
  );
}
