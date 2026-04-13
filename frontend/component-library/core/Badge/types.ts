/**
 * @file types.ts
 * @description Badge 컴포넌트의 TypeScript 타입 정의
 */
import React from 'react';

/** primary: 시스템 공통 파란색 | brand: 현재 은행 브랜드색 */
export type BadgeVariant = 'primary' | 'brand' | 'success' | 'danger' | 'warning' | 'neutral';

export interface BadgeProps {
  /** 배지 색상 변형. 기본: 'neutral' */
  variant?:   BadgeVariant;
  /** dot 모드일 때는 children 없이도 사용 가능 */
  children?:  React.ReactNode;
  /** true이면 텍스트 없이 점(dot)만 표시 */
  dot?:       boolean;
  className?: string;
}