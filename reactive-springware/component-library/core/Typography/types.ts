/**
 * @file types.ts
 * @description Typography 컴포넌트의 TypeScript 타입 정의.
 * 이전 명칭 'Text'에서 변경 — DOM 내장 Text 인터페이스와의 충돌 방지.
 */
import React from 'react';

export type TypographyVariant = 'heading' | 'subheading' | 'body-lg' | 'body' | 'body-sm' | 'caption';
export type TypographyWeight  = 'normal' | 'medium' | 'bold';
export type TypographyColor   = 'heading' | 'base' | 'label' | 'secondary' | 'muted' | 'brand' | 'danger' | 'success';

export interface TypographyProps {
  /** 텍스트 크기 변형. 기본: 'body' */
  variant?:   TypographyVariant;
  /** 폰트 굵기. 기본: variant별 기본값 적용 */
  weight?:    TypographyWeight;
  /** 텍스트 색상. 기본: 'base' */
  color?:     TypographyColor;
  /** true이면 font-numeric(Manrope) 적용 — 금액·숫자 표시용 */
  numeric?:   boolean;
  /** 렌더링할 HTML 태그. 기본: 'p' */
  as?:        React.ElementType;
  children:   React.ReactNode;
  className?: string;
}

/* 하위 호환성 — 기존 TextProps 참조가 있는 고객 코드를 위해 alias 유지 */
export type TextProps    = TypographyProps;
export type TextVariant  = TypographyVariant;
export type TextWeight   = TypographyWeight;
export type TextColor    = TypographyColor;