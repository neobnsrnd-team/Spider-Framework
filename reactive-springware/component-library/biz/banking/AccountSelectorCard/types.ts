/**
 * @file types.ts
 * @description AccountSelectorCard 컴포넌트의 TypeScript 타입 정의.
 *
 * AccountSummaryCard(잔액 표시 전용)와 달리,
 * 거래내역 조회 등 계좌를 선택·변경할 수 있는 상황에서 사용한다.
 */
import React from 'react';

export interface AccountSelectorCardProps {
  /** 계좌명. 예: '하나 주거래 통장' */
  accountName: string;
  /** 계좌번호. 예: '123-456-789012'. 마스킹 없이 그대로 표시 */
  accountNumber: string;
  /**
   * 우측 원형 버튼 내 아이콘.
   * 미전달 시 WalletMinimal 아이콘을 기본으로 사용한다.
   */
  icon?: React.ReactNode;
  /**
   * 계좌명 영역 클릭 시 콜백.
   * 계좌 변경 드롭다운 혹은 BottomSheet를 열 때 사용한다.
   */
  onAccountChange?: () => void;
  /** 우측 원형 아이콘 버튼 클릭 시 콜백. 예: 계좌 상세 이동 */
  onIconClick?: () => void;
  /**
   * 우측 원형 아이콘 버튼의 aria-label.
   * 미전달 시 기본값 '계좌 상세' 사용.
   * 카드 상세·이체 등 다른 용도로 재사용 시 실제 기능에 맞게 전달한다.
   */
  iconAriaLabel?: string;
  /**
   * 출금가능금액 표시 문자열.
   * 전달 시 계좌번호 아래에 브랜드 색상으로 렌더링된다.
   * 예: '출금가능금액: 3,000,000원'
   */
  availableBalance?: string;
  className?: string;
}