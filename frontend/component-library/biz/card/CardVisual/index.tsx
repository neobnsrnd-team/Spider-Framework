/**
 * @file index.tsx
 * @description 내카드관리 화면 카드 UI 컴포넌트.
 *
 * 풀 모드(compact=false): 카드 이미지 + 브랜드 + 카드명 세로 배치.
 * compact 모드(compact=true): 브랜드 + 카드명을 한 줄로 표시하며 말줄임 처리.
 * 스크롤로 카드 영역을 벗어날 때 페이지에서 compact=true로 전환해 스티키 헤더에 사용한다.
 *
 * 반응형 동작:
 * - 카드 이미지 최대 너비: 260px(모바일) → 320px(sm) → 400px(md)
 * - 카드명 폰트: text-base → sm:text-lg
 *
 * @param cardImage - 카드 이미지 슬롯
 * @param brand     - 카드 브랜드 (VISA | Mastercard | AMEX | JCB | UnionPay)
 * @param cardName  - 카드명
 * @param compact   - true: 한 줄 요약 모드 (스티키 헤더용)
 *
 * @example
 * <CardVisual cardImage={<img src={cardImg} alt="카드" />} brand="VISA" cardName="하나 머니 체크카드" />
 * <CardVisual cardImage={<img src={cardImg} alt="카드" />} brand="VISA" cardName="하나 머니 체크카드" compact />
 */
import React from 'react';
import { cn } from '@lib/cn';
import type { CardVisualProps } from './types';

export function CardVisual({ cardImage, brand, cardName, compact = false, className }: CardVisualProps) {
  /* compact 모드: 브랜드 + 카드명 한 줄 말줄임 */
  if (compact) {
    return (
      <div className={cn('flex items-center gap-sm min-w-0', className)}>
        <span className="text-xs sm:text-sm font-bold text-text-muted shrink-0">{brand}</span>
        <span className="text-sm sm:text-base font-bold text-text-heading truncate">{cardName}</span>
      </div>
    );
  }

  /* 풀 모드: 카드 이미지 + 브랜드 + 카드명 */
  return (
    <div className={cn('flex flex-col items-center gap-md sm:gap-lg', className)}>
      {/* 카드 이미지 슬롯 — 반응형 최대 너비 + 16:10 비율 유지 */}
      <div className="w-full max-w-[260px] sm:max-w-[320px] md:max-w-[400px] aspect-[16/10] rounded-2xl overflow-hidden shadow-card">
        {cardImage}
      </div>
      {/* 브랜드 + 카드명 */}
      <div className="flex flex-col items-center gap-xs text-center">
        <span className="text-xs sm:text-sm font-bold text-text-muted">{brand}</span>
        <span className="text-base sm:text-lg font-bold text-text-heading">{cardName}</span>
      </div>
    </div>
  );
}
