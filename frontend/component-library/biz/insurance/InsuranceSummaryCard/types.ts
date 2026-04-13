/**
 * @file types.ts
 * @description InsuranceSummaryCard 컴포넌트의 TypeScript 타입 정의.
 *
 * 보험 도메인 요약 카드 — 생명/건강/자동차 보험 계약 정보를 공통 레이아웃으로 표시.
 * AccountSummaryCard와 일관된 인터페이스 설계를 따름.
 */
import React from 'react';

/**
 * 보험 유형.
 * - life: 생명보험 — 사망·만기 보장
 * - health: 건강보험 — 실손·암 보장
 * - car: 자동차보험 — 차량 보장
 */
export type InsuranceType = 'life' | 'health' | 'car';

/**
 * 보험 계약 상태.
 * - active: 정상 유지 중
 * - pending: 납입 유예
 * - expired: 만기 또는 해지
 */
export type InsuranceStatus = 'active' | 'pending' | 'expired';

export interface InsuranceSummaryCardProps {
  /** 보험 유형. 유형별 아이콘·레이블이 달라짐 */
  type:              InsuranceType;
  /** 보험 상품명. 예: '하나생명 통합종신보험', '하나손해 운전자보험' */
  insuranceName:     string;
  /**
   * 계약 번호 또는 증권 번호.
   * 예: '2024-001-123456'
   */
  contractNumber:    string;
  /**
   * 월 납입 보험료 (원화 단위 숫자).
   * 내부에서 Intl.NumberFormat('ko-KR') 처리.
   */
  premium:           number;
  /**
   * 다음 납입일. 예: '2026.04.01'
   * 표시용 문자열로 직접 전달 (포맷은 호출자 책임)
   */
  nextPaymentDate?:  string;
  /** 계약 상태. 상태별 배지 색상이 달라짐 */
  status:            InsuranceStatus;
  /**
   * 배지 텍스트 override. 미전달 시 status 기반 기본 텍스트 사용.
   * - active: '정상'
   * - pending: '유예'
   * - expired: '만기'
   */
  badgeText?:        string;
  onClick?:          () => void;
  /** 보장 내역·청구 버튼 슬롯 */
  actions?:          React.ReactNode;
  className?:        string;
}