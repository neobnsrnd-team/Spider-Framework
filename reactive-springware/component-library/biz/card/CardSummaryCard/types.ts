/**
 * @file types.ts
 * @description CardSummaryCard 컴포넌트의 TypeScript 타입 정의.
 *
 * 카드 도메인 요약 카드 — 신용/체크/선불 카드 정보를 공통 레이아웃으로 표시.
 * AccountSummaryCard와 일관된 인터페이스 설계를 따름.
 */
import React from 'react';

/**
 * 카드 유형.
 * - credit: 신용카드 — 사용금액 + 한도 표시, warning/danger 색상 분기
 * - check: 체크카드 — 연결 계좌 잔액 표시
 * - prepaid: 선불카드 — 충전 잔액 표시
 */
export type CardType = 'credit' | 'check' | 'prepaid';

export interface CardSummaryCardProps {
  /** 카드 유형. 유형별 레이블·색상이 달라짐 */
  type:             CardType;
  /** 카드 상품명. 예: '하나 머니 체크카드', '1Q카드' */
  cardName:         string;
  /**
   * 마스킹된 카드 번호. 예: '1234 **** **** 5678'
   * 컴포넌트는 그대로 표시하며 마스킹 처리는 호출자 책임
   */
  cardNumber:       string;
  /**
   * 기준 금액.
   * - credit: 당월 사용금액
   * - check/prepaid: 잔액
   */
  amount:           number;
  /**
   * 한도 금액 (credit 타입 전용).
   * 전달 시 "사용금액 / 한도" 형태로 표시하며 한도 대비 사용률 색상 분기.
   */
  limitAmount?:     number;
  /**
   * 배지 텍스트. 미전달 시 배지 미노출.
   * - credit: '포인트 적립', '캐시백' 등 혜택 유형
   * - check: '주거래' 등
   * - prepaid: '잔액 부족' 경고 배지 등
   */
  badgeText?:       string;
  onClick?:         () => void;
  /** 결제내역·충전 버튼 슬롯 */
  actions?:         React.ReactNode;
  className?:       string;
}