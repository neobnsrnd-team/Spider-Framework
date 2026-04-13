/**
 * @file types.ts
 * @description SummaryCard 컴포넌트 타입 정의.
 */
import React from 'react';

/**
 * asset  — 총 자산 카드. 좌측 액센트 바 없음, 금액 강조 색상 브랜드
 * spending — 이번 달 소비 카드. 좌측 도메인 액센트 바 적용, 금액 기본 색상
 */
export type SummaryCardVariant = 'asset' | 'spending';

export interface SummaryCardAction {
  /** 버튼 레이블 */
  label: string;
  /** 버튼 클릭 핸들러 */
  onClick: () => void;
  /**
   * 활성 상태. true 시 도메인 액센트 배경(--domain-card-accent)으로 강조
   * @default false
   */
  active?: boolean;
}

export interface SummaryCardProps {
  /** 카드 유형 — 레이아웃과 색상에 영향 */
  variant: SummaryCardVariant;
  /** 한글 메인 제목 (e.g. "총 자산", "이번 달 소비") */
  title: string;
  /** 원화 금액 (정수, 자동 포맷) */
  amount: number;
  /** 우측 상단 아이콘 슬롯 */
  icon?: React.ReactNode;
  /** 하단 액션 버튼 목록 */
  actions?: SummaryCardAction[];
  /** 카드 전체 클릭 핸들러 */
  onClick?: () => void;
  /** true이면 금액을 마스킹 처리하여 숨긴다 */
  hidden?: boolean;
  className?: string;
}
