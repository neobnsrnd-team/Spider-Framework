/**
 * @file types.ts
 * @description PaymentStatementPage 컴포넌트 타입 정의.
 *
 * 결제예정금액(payment) / 이용대금명세서(statement) 두 탭을 모두 포함하는 페이지 전용.
 */
import type React from 'react';
import type { CardInfoSection } from '@cl/biz/card/CardInfoPanel/types';

export type { CardInfoSection };

/** 탭 식별자 */
export type StatementTab = 'payment' | 'statement';

/** 카드 선택 드롭다운 옵션 */
export interface CardOption {
  /** select value. 예: 'card-1' */
  value: string;
  /** select 표시 레이블. 예: '하나 머니 체크카드' */
  label: string;
}

/** 카드별 결제 항목 — CardPaymentItem 1행에 대응 */
export interface CardPaymentEntry {
  id: string;
  /** 가맹점·서비스 아이콘 */
  icon: React.ReactNode;
  /** 아이콘 배경 Tailwind 클래스. 미전달 시 기본 bg-brand-10 */
  iconBgClassName?: string;
  /** 카드 영문명. 예: 'HANA MONEY CHECK' */
  cardEnName: string;
  /** 카드 한글명 또는 가맹점명 */
  cardName: string;
  /** 결제 금액(원). 음수면 취소/환불 */
  amount: number;
  /** 상세보기 클릭 핸들러 */
  onDetailClick?: () => void;
  /** 행 전체 클릭 핸들러 */
  onClick?: () => void;
}

/** ── 결제예정금액 탭 데이터 ───────────────────────────────── */
export interface PaymentTabData {
  /** CardPaymentSummary — 출금예정일 (예: '2026.04.08') */
  dateFull: string;
  /** CardPaymentSummary — 청구 년월 (예: '26년 4월') */
  dateYM: string;
  /** CardPaymentSummary — 기준 날짜 (예: '04.08') */
  dateMD: string;
  /** 총 청구금액 (원) */
  totalAmount: number;
  /** 리볼빙 금액 */
  revolving?: number;
  /** 카드론 금액 */
  cardLoan?: number;
  /** 현금서비스 금액 */
  cashAdvance?: number;
  /** CardInfoPanel 섹션 목록 */
  infoSections: CardInfoSection[];
  /** 카드별 결제 항목 목록 */
  paymentItems: CardPaymentEntry[];
}

/** ── 이용대금명세서 탭 데이터 ───────────────────────────────── */
export interface StatementTabData {
  /** 총 결제금액 (원) */
  totalAmount: number;
  /** StatementTotalCard 배지 텍스트 */
  badge?: '예정';
  /** 카드별 결제 항목 목록 */
  paymentItems: CardPaymentEntry[];
  /** CardInfoPanel 섹션 목록 */
  infoSections: CardInfoSection[];
}

export interface PaymentStatementPageProps {
  /** 초기 활성 탭 (기본: 'payment') */
  initialTab?: StatementTab;
  /** 카드 선택 드롭다운 목록 */
  cardOptions: CardOption[];
  /** 초기 선택 카드 value */
  initialCardValue?: string;
  /** 결제예정금액 탭 데이터 */
  paymentData: PaymentTabData;
  /** 이용대금명세서 탭 데이터 */
  statementData: StatementTabData;
  /** 카드 변경 핸들러 */
  onCardChange?: (value: string) => void;
  /** 날짜(년월) 클릭 핸들러 */
  onDateClick?: () => void;
  /** 리볼빙 버튼 클릭 */
  onRevolving?: () => void;
  /** 카드론 버튼 클릭 */
  onCardLoan?: () => void;
  /** 현금서비스 버튼 클릭 */
  onCashAdvance?: () => void;
  /** StatementTotalCard 이용내역 화살표 클릭 */
  onStatementDetail?: () => void;
  /** 분할납부 버튼 클릭 */
  onInstallment?: () => void;
  /** 즉시결제 버튼 클릭 */
  onImmediatePayment?: () => void;
  /** 뒤로가기 핸들러 */
  onBack?: () => void;
  /** 닫기(X) 핸들러 */
  onClose?: () => void;
}
