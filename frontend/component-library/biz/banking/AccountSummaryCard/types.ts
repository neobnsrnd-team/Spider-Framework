/**
 * @file types.ts
 * @description AccountSummaryCard 컴포넌트의 TypeScript 타입 정의.
 * 6.1 도메인 방침: 단일 컴포넌트로 예금·적금·대출 계좌 유형을 모두 대응.
 */
import React from 'react';

/**
 * 계좌 유형.
 * - deposit:       예금(입출금) 계좌
 * - savings:       적금·저축 계좌
 * - loan:          대출 계좌 — 금액 danger 색상, 기본 레이블 '대출잔액'
 * - foreignDeposit: 외화예금 계좌 — balanceDisplay로 외화 포맷 전달
 * - retirement:    퇴직연금 계좌 — 기본 레이블 '적립금'
 * - securities:    증권 계좌 — 기본 레이블 '평가금액'
 */
export type AccountType =
  | 'deposit'
  | 'savings'
  | 'loan'
  | 'foreignDeposit'
  | 'retirement'
  | 'securities';

export interface AccountSummaryCardProps {
  /** 계좌 유형. 유형별 금액 레이블·색상·배지 용도가 달라짐 */
  type:           AccountType;
  /** 예: '급여 통장', '청약저축' */
  accountName:    string;
  /** 예: '123-456-789012'. 화면에 마스킹 없이 그대로 표시 */
  accountNumber:  string;
  /** 원화 단위 숫자. 컴포넌트 내부에서 Intl.NumberFormat('ko-KR') 처리 */
  balance:        number;
  /**
   * 화면 표시용 잔액 문자열.
   * 전달 시 balance의 내부 포맷 변환을 건너뛰고 이 값을 그대로 표시.
   * 다중 통화(USD·EUR 등) 또는 Repository에서 이미 포맷한 경우에 사용.
   * (예: '$1,000.00', '총 $1,000.00 (약 1,350,000원)')
   */
  balanceDisplay?: string;
  /**
   * 금액 영역 레이블. 미전달 시 type별 기본값 사용.
   * - deposit: '잔액'
   * - savings: '납입금액'
   * - loan: '대출잔액'
   */
  balanceLabel?:  string;
  /**
   * 배지 텍스트. 미전달 시 배지 영역 렌더링 안 함.
   * - deposit: '주거래', '급여' 등
   * - savings: 'D-30' (만기일) 등
   * - loan: '변동금리', '고정금리' 등
   */
  badgeText?:     string;
  /**
   * 카드 우측 상단 더보기 버튼 종류.
   * - 'chevron': 다음 화면으로 이동하는 > 아이콘
   * - 'ellipsis': 추가 옵션 메뉴를 여는 ... 아이콘
   * 미전달 시 더보기 버튼 미노출.
   */
  moreButton?:    'chevron' | 'ellipsis';
  /** 더보기 버튼 클릭 핸들러. moreButton과 함께 전달해야 동작 */
  onMoreClick?:   () => void;
  onClick?:       () => void;
  /** 이체·내역 버튼 슬롯. 각 버튼은 균등 너비로 확장됨 */
  actions?:       React.ReactNode;
  className?:     string;
}