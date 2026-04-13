/**
 * @file types.ts
 * @description Button 컴포넌트의 TypeScript 타입 정의
 */
import React from 'react';

export type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize    = 'sm' | 'md' | 'lg';
/**
 * 버튼 내부 콘텐츠 정렬 방향.
 * - `center` (기본): 텍스트+아이콘을 가운데 정렬
 * - `between`: 아코디언 트리거 등에서 좌우 분리
 */
export type ButtonJustify = 'center' | 'between';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** 버튼 외형 변형. 기본: 'primary' */
  variant?:   ButtonVariant;
  /** 버튼 크기. 기본: 'md' */
  size?:      ButtonSize;
  /** true이면 로딩 스피너 표시 및 aria-busy 처리 */
  loading?:   boolean;
  /** true이면 정방형 아이콘 전용 버튼 (텍스트 숨김) */
  iconOnly?:  boolean;
  leftIcon?:  React.ReactNode;
  rightIcon?: React.ReactNode;
  /** true이면 w-full 적용 */
  fullWidth?: boolean;
  /** 내부 정렬. 기본: 'center' */
  justify?:   ButtonJustify;
}

export interface ButtonGroupProps {
  children:   React.ReactNode;
  className?: string;
}
