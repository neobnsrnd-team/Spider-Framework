/**
 * @file types.ts
 * @description CardVisual 컴포넌트의 TypeScript 타입 정의.
 */
import React from 'react';

export type CardBrand = 'VISA' | 'Mastercard' | 'AMEX' | 'JCB' | 'UnionPay';

export interface CardVisualProps {
  /** 카드 이미지 슬롯 (img 또는 SVG 컴포넌트) */
  cardImage:  React.ReactNode;
  /** 카드 브랜드 */
  brand:      CardBrand;
  /** 카드명. 예: '하나 머니 체크카드' */
  cardName:   string;
  /**
   * compact 모드.
   * true: 스크롤로 카드 영역을 벗어났을 때 스티키 헤더용 — 브랜드+카드명 한 줄 말줄임.
   * false(기본): 카드 이미지 + 브랜드 + 카드명 풀 레이아웃.
   */
  compact?:   boolean;
  className?: string;
}
