/**
 * @file types.ts
 * @description 계좌 상세 페이지에서 사용하는 TypeScript 타입 정의.
 *
 * AccountList의 AccountItem보다 풍부한 정보(개설일, 이자율, 최근 거래)를 포함한다.
 * 서버 응답 타입(Raw, snake_case)과 클라이언트 모델(camelCase)을 분리하여
 * API 응답 구조 변경 시 repository.ts만 수정하면 된다.
 */

import type { AccountGroupType } from '@/features/accountList/types';

// ── 서버 API 응답 타입 (snake_case) ─────────────────────────────────────

/** 계좌 상세 API 응답 단일 거래 항목 */
export interface AccountDetailTransactionRaw {
  transaction_id:   string;
  /** ISO 8601 형식 (예: '2026-03-15T14:20:05Z') */
  transaction_date: string;
  description:      string;
  /** 양수: 입금, 음수: 출금 */
  amount:           number;
  transaction_type: 'deposit' | 'withdrawal' | 'transfer';
}

/** 계좌 상세 API 응답 전체 */
export interface AccountDetailApiResponse {
  account_id:           string;
  account_name:         string;
  account_number:       string;
  balance:              number;
  currency:             string;
  account_type:         string;
  /** 개설일 — 'YYYY-MM-DD' 형식 */
  opened_date:          string;
  /** 이자율 (%) — 입출금 통장은 undefined */
  interest_rate?:       number;
  recent_transactions:  AccountDetailTransactionRaw[];
}

// ── 클라이언트 모델 (camelCase) ──────────────────────────────────────────

/**
 * 계좌 상세 화면에 표시할 거래 항목 클라이언트 모델.
 * TransactionList 컴포넌트의 TransactionItem 타입과 호환된다.
 */
export interface AccountDetailTransaction {
  id:     string;
  date:   string;
  title:  string;
  /** 양수: 입금, 음수: 출금 */
  amount: number;
  type:   'deposit' | 'withdrawal' | 'transfer';
}

/**
 * 계좌 상세 클라이언트 모델.
 * AccountItem에서 확장하지 않고 독립적으로 정의하여
 * 두 도메인의 응답 구조 변경이 서로에게 영향을 주지 않도록 한다.
 */
export interface AccountDetail {
  id:                   string;
  name:                 string;
  accountNumber:        string;
  /** 잔액 (숫자) */
  balance:              number;
  /** 화면 표시용 잔액 문자열 — repository에서 포맷 (예: '3,000,000원') */
  balanceDisplay:       string;
  currency:             'KRW' | 'USD' | 'EUR' | 'JPY';
  type:                 AccountGroupType;
  /** 개설일 표시 문자열 — repository에서 포맷 (예: '2019년 3월 15일') */
  openedDateDisplay:    string;
  /** 이자율 표시 문자열 — repository에서 포맷 (예: '연 2.5%'). 해당 없으면 undefined */
  interestRateDisplay?: string;
  /** 최근 거래 3~5건 */
  recentTransactions:   AccountDetailTransaction[];
}
