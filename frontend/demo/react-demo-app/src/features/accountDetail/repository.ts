/**
 * @file repository.ts
 * @description 계좌 상세 조회 API 호출·데이터 가공·모델 변환 담당.
 *
 * 서버 응답(snake_case)을 클라이언트 모델(AccountDetail)로 변환한다.
 * Hook은 이 파일의 함수만 호출하며, axios 또는 fetch 변경 시 이 파일만 수정한다.
 *
 * @example
 * const account = await accountDetailRepository.getAccountById('acc-001');
 * console.log(account.balanceDisplay); // '3,000,000원'
 */

import type {
  AccountDetailApiResponse,
  AccountDetailTransactionRaw,
  AccountDetailTransaction,
  AccountDetail,
} from './types';
import type { AccountGroupType } from '@/features/accountList/types';

// ── 목업 데이터 (계좌 ID별 정적 응답) ──────────────────────────────────
// 실제 API 연동 시 이 블록을 제거하고 axios.get(`/api/accounts/${id}`)으로 교체한다.

const MOCK_DB: Record<string, AccountDetailApiResponse> = {
  'acc-001': {
    account_id:     'acc-001',
    account_name:   '하나 주거래 통장',
    account_number: '123-456789-01207',
    balance:        3000000,
    currency:       'KRW',
    account_type:   'deposit',
    opened_date:    '2019-03-15',
    recent_transactions: [
      { transaction_id: 'tx-1', transaction_date: '2026-04-05T14:20:00Z', description: '스타벅스',       amount: -5400,    transaction_type: 'withdrawal' },
      { transaction_id: 'tx-2', transaction_date: '2026-04-01T09:00:00Z', description: '급여',           amount: 2500000,  transaction_type: 'deposit'    },
      { transaction_id: 'tx-3', transaction_date: '2026-03-31T21:00:00Z', description: 'GS25 강남점',    amount: -3200,    transaction_type: 'withdrawal' },
      { transaction_id: 'tx-4', transaction_date: '2026-03-30T18:30:00Z', description: '쿠팡결제',       amount: -28900,   transaction_type: 'withdrawal' },
      { transaction_id: 'tx-5', transaction_date: '2026-03-29T12:00:00Z', description: '이체받음',       amount: 50000,    transaction_type: 'transfer'   },
    ],
  },
  'acc-002': {
    account_id:     'acc-002',
    account_name:   '주택청약종합저축',
    account_number: '987-654321-00105',
    balance:        1000000,
    currency:       'KRW',
    account_type:   'deposit',
    opened_date:    '2021-07-10',
    interest_rate:  2.1,
    recent_transactions: [
      { transaction_id: 'tx-s1', transaction_date: '2026-04-01T09:00:00Z', description: '자동납입',      amount: 100000,   transaction_type: 'deposit'    },
      { transaction_id: 'tx-s2', transaction_date: '2026-03-01T09:00:00Z', description: '자동납입',      amount: 100000,   transaction_type: 'deposit'    },
    ],
  },
  'acc-003': {
    account_id:     'acc-003',
    account_name:   '외화 다통화 예금',
    account_number: '334-112233-44501',
    balance:        1000,
    currency:       'USD',
    account_type:   'foreignDeposit',
    opened_date:    '2022-11-20',
    interest_rate:  0.5,
    recent_transactions: [],
  },
};

// ── 표시용 문자열 변환 함수 ───────────────────────────────────────────────

/** 잔액 + 통화 → 화면 표시용 문자열 */
function toBalanceDisplay(balance: number, currency: string): string {
  if (currency === 'KRW') return `${balance.toLocaleString('ko-KR')}원`;
  if (currency === 'USD') return `$${balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return `${balance.toLocaleString()} ${currency}`;
}

/** 'YYYY-MM-DD' → 'YYYY년 M월 D일' */
function toDateDisplay(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

/** 이자율 숫자 → '연 X.X%' 문자열 */
function toInterestRateDisplay(rate: number): string {
  return `연 ${rate.toFixed(1)}%`;
}

// ── 서버 → 클라이언트 모델 변환 함수 ─────────────────────────────────────

function toTransaction(raw: AccountDetailTransactionRaw): AccountDetailTransaction {
  return {
    id:     raw.transaction_id,
    date:   raw.transaction_date,
    title:  raw.description,
    amount: raw.amount,
    type:   raw.transaction_type,
  };
}

function toAccountDetail(raw: AccountDetailApiResponse): AccountDetail {
  return {
    id:                  raw.account_id,
    name:                raw.account_name,
    accountNumber:       raw.account_number,
    balance:             raw.balance,
    balanceDisplay:      toBalanceDisplay(raw.balance, raw.currency),
    currency:            raw.currency as AccountDetail['currency'],
    type:                raw.account_type as AccountGroupType,
    openedDateDisplay:   toDateDisplay(raw.opened_date),
    interestRateDisplay: raw.interest_rate != null
                           ? toInterestRateDisplay(raw.interest_rate)
                           : undefined,
    recentTransactions:  raw.recent_transactions.map(toTransaction),
  };
}

// ── Repository ─────────────────────────────────────────────────────────────

export const accountDetailRepository = {
  /**
   * 계좌 ID로 상세 정보를 단건 조회한다.
   *
   * @param id - 조회할 계좌 ID (AccountItem.id 값과 동일)
   * @returns 계좌 상세 클라이언트 모델
   * @throws Error 계좌를 찾을 수 없는 경우 (404 상당)
   *
   * @example
   * const detail = await accountDetailRepository.getAccountById('acc-001');
   */
  getAccountById: async (id: string): Promise<AccountDetail> => {
    // 네트워크 지연 시뮬레이션 — 실제 API 연동 시 axios.get(`/api/accounts/${id}`)으로 교체
    await new Promise(resolve => setTimeout(resolve, 500));

    const raw = MOCK_DB[id];
    if (!raw) {
      // 실제 axios 환경에서는 error.response.status === 404 분기로 처리
      throw new Error('계좌 정보를 찾을 수 없습니다.');
    }

    return toAccountDetail(raw);
  },
};
