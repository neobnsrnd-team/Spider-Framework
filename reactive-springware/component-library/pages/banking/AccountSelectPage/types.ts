/**
 * @file types.ts
 * @description AccountSelectPage 컴포넌트의 TypeScript 타입 정의.
 *
 * 이체 화면에서 출금·입금 계좌를 선택하는 BottomSheet 페이지.
 * "해당금융" 탭(보유 계좌 목록)과 "다른 금융" 탭(미연결 시 EmptyState)으로 구성된다.
 *
 * Figma 원본:
 *   - node-id: 1:1385 (해당금융 탭 — 계좌 리스트)
 *   - node-id: 1:2300 (다른 금융 탭 — 빈 상태 + CTA)
 */
import React from 'react';

/** 선택 가능한 계좌 항목 */
export interface AccountItem {
  /** 항목 고유 식별자 */
  id: string;
  /**
   * 아이콘 슬롯 (lucide-react 아이콘).
   * 미전달 시 AccountSelectItem 내부에서 Landmark 아이콘으로 폴백.
   */
  icon?: React.ReactNode;
  /** 계좌 명칭 (예: "하나 주거래 통장") */
  accountName: string;
  /** 계좌번호 (예: "123-456-789012") */
  accountNumber: string;
  /**
   * 잔액 표시 문자열 (예: "3,000,000원").
   * 포맷 처리는 호출자에서 완료 후 전달한다.
   */
  balance: string;
}

/** 탭 식별자 */
export type AccountSelectTab = 'mine' | 'other';

export interface AccountSelectPageProps {
  /** BottomSheet 열림 여부 */
  open: boolean;
  /** 닫기 핸들러 */
  onClose: () => void;

  /** 현재 활성 탭 */
  activeTab: AccountSelectTab;
  /** 탭 전환 핸들러 */
  onTabChange: (tab: AccountSelectTab) => void;

  // ── 해당금융 탭 ────────────────────────────────────────────
  /** 보유 계좌 목록 */
  accounts: AccountItem[];
  /** 선택된 계좌 id */
  selectedAccountId?: string;
  /** 계좌 선택 핸들러 */
  onAccountSelect: (id: string) => void;

  // ── 다른 금융 탭 ────────────────────────────────────────────
  /**
   * 다른 금융 계좌 목록.
   * 빈 배열이면 EmptyState("연결된 다른 금융 계좌가 없습니다.")를 표시한다.
   */
  otherAccounts: AccountItem[];
  /** 선택된 다른 금융 계좌 id */
  selectedOtherAccountId?: string;
  /** 다른 금융 계좌 선택 핸들러 */
  onOtherAccountSelect: (id: string) => void;
  /**
   * "다른 금융 계좌 연결하기" CTA 핸들러.
   * 미전달 시 빈 상태에서도 CTA 버튼을 표시하지 않는다.
   */
  onConnectOtherAccount?: () => void;
}
