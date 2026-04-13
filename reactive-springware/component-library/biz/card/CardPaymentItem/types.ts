/**
 * @file types.ts
 * @description CardPaymentItem 컴포넌트의 TypeScript 타입 정의.
 *
 * 카드 이용내역 목록의 개별 결제 항목 행 전용.
 */
import React from 'react';

export interface CardPaymentItemProps {
  /** 가맹점·서비스 아이콘 (lucide-react 등 React 노드) */
  icon:               React.ReactNode;
  /**
   * 아이콘 배경 Tailwind 클래스.
   * 미전달 시 기본 bg-brand-10 사용.
   * 예: 'bg-surface-subtle', 'bg-danger-surface'
   */
  iconBgClassName?:   string;
  /** 카드 영문명. 예: 'HANA MONEY CHECK' */
  cardEnName:         string;
  /** 카드 한글명 또는 가맹점명. 예: '하나 머니 체크카드' */
  cardName:           string;
  /** 결제 금액 (원). 양수: 결제, 음수: 취소/환불 */
  amount:             number;
  /** "상세보기" 버튼 클릭 핸들러. 미전달 시 버튼 미노출 */
  onDetailClick?:     () => void;
  /** 행 전체 클릭 핸들러 */
  onClick?:           () => void;
  className?:         string;
}
