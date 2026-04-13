/**
 * @file repository.ts
 * @description 전계좌 조회 API 호출, 서버 응답 변환, 에러 처리를 담당하는 Repository.
 *
 * 책임:
 * - 금융기관 탭별 계좌 목록 HTTP 요청
 * - 서버 응답(snake_case) → 클라이언트 모델(camelCase) 변환
 * - 숫자 잔액 → 화면 표시용 문자열 변환 (Page에서 데이터 가공 금지 원칙에 따라 이 계층에서 처리)
 * - HTTP 에러 → 클라이언트 에러 변환
 *
 * 현재는 Figma node-id:1-3 기반 목 데이터를 사용하며,
 * 실제 API 연동 시 이 파일만 수정하면 된다.
 * Hook(hook.ts)과 Page(page.tsx)는 변경하지 않아도 된다.
 *
 * 금지 사항:
 * - useState / useEffect 사용 금지 (Repository는 순수 비동기 함수여야 함)
 * - UI 렌더링 로직 포함 금지
 */

import type {
  AccountListData,
  AccountListResponse,
  AccountItemRaw,
  AccountGroupRaw,
  AccountItem,
  AccountGroup,
  InstitutionTabId,
} from './types';

// ── 목 데이터 (Figma node-id: 1-3 기반) ─────────────────────────────
// '해당금융' 탭에 표시될 계좌 목록.
// 실제 API 연동 시 이 블록 전체를 제거하고 fetch/axios 호출로 대체한다.
const MOCK_MINE_DATA: AccountListResponse = {
  groups: [
    {
      type: 'deposit',
      label: '예금',
      total_balance: 4000000,
      total_balance_currency: 'KRW',
      accounts: [
        {
          account_id: 'acc-001',
          account_name: '하나 주거래 통장',
          account_number: '123-456789-01207',
          balance: 3000000,
          currency: 'KRW',
        },
        {
          account_id: 'acc-002',
          account_name: '주택청약종합저축',
          account_number: '987-654321-00105',
          balance: 1000000,
          currency: 'KRW',
        },
      ],
    },
    {
      type: 'foreignDeposit',
      label: '외화예금',
      total_balance: 1000,
      total_balance_currency: 'USD',
      // 외화 그룹: 원화 환산 추정액을 합계에 병기
      total_balance_approx_krw: 1350000,
      accounts: [
        {
          account_id: 'acc-003',
          account_name: '외화 다통화 예금',
          account_number: '334-112233-44501',
          balance: 1000,
          currency: 'USD',
        },
      ],
    },
    {
      type: 'retirement',
      label: '퇴직연금',
      total_balance: 0,
      total_balance_currency: 'KRW',
      accounts: [],
    },
    {
      type: 'securities',
      label: '증권',
      total_balance: 0,
      total_balance_currency: 'KRW',
      accounts: [],
    },
  ],
};

// ── 표시용 문자열 변환 함수 ───────────────────────────────────────────
// Page에서 데이터 가공을 금지하므로 Repository에서 변환 후 모델에 포함한다.

/**
 * 잔액과 통화를 화면 표시용 문자열로 변환.
 * - KRW: 1,000원
 * - USD: $1,000.00
 */
function toBalanceDisplay(balance: number, currency: string): string {
  if (currency === 'KRW') {
    return `${balance.toLocaleString('ko-KR')}원`;
  }
  if (currency === 'USD') {
    return `$${balance.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  return `${balance.toLocaleString()} ${currency}`;
}

/**
 * 그룹 합계 잔액을 화면 표시용 문자열로 변환.
 * 외화 그룹은 원화 환산 추정액을 괄호로 병기한다.
 * - KRW: 총 4,000,000원
 * - USD: 총 $1,000.00 (약 1,350,000원)
 */
function toGroupTotalDisplay(raw: AccountGroupRaw): string {
  const mainDisplay = `총 ${toBalanceDisplay(raw.total_balance, raw.total_balance_currency)}`;
  if (raw.total_balance_approx_krw !== undefined) {
    return `${mainDisplay} (약 ${raw.total_balance_approx_krw.toLocaleString('ko-KR')}원)`;
  }
  return mainDisplay;
}

// ── 서버 → 클라이언트 모델 변환 함수 ────────────────────────────────

/** 서버 계좌 항목 → 클라이언트 모델 변환 */
function toAccountItem(raw: AccountItemRaw): AccountItem {
  return {
    id:             raw.account_id,
    name:           raw.account_name,
    accountNumber:  raw.account_number,
    balance:        raw.balance,
    currency:       raw.currency as AccountItem['currency'],
    // 표시용 문자열을 Repository에서 미리 변환하여 Page 가공 부담 제거
    balanceDisplay: toBalanceDisplay(raw.balance, raw.currency),
  };
}

/** 서버 계좌 그룹 → 클라이언트 모델 변환 */
function toAccountGroup(raw: AccountGroupRaw): AccountGroup {
  return {
    type:                 raw.type,
    label:                raw.label,
    totalBalance:         raw.total_balance,
    totalBalanceCurrency: raw.total_balance_currency as AccountGroup['totalBalanceCurrency'],
    totalBalanceDisplay:  toGroupTotalDisplay(raw),
    accounts:             raw.accounts.map(toAccountItem),
  };
}

// ── Repository ────────────────────────────────────────────────────────

/**
 * 금융기관 탭별 전계좌 목록 조회.
 *
 * @param institutionTab - 조회할 금융기관 탭
 *   - 'mine': 해당금융 (내 하나은행 계좌)
 *   - 'other': 다른금융 (연결된 타행 계좌)
 * @returns AccountListData - 그룹별 계좌 목록 (표시용 문자열 포함)
 * @throws Error 네트워크 오류 또는 서버 에러 시
 *
 * @example
 * const data = await accountListRepository.getAccountList('mine');
 * console.log(data.groups[0].totalBalanceDisplay); // '총 4,000,000원'
 */
async function getAccountList(institutionTab: InstitutionTabId): Promise<AccountListData> {
  // 네트워크 지연 시뮬레이션 — 실제 API 연동 시 제거
  await new Promise(resolve => setTimeout(resolve, 600));

  // '다른금융' 탭: 연결된 타행 계좌 없음 (빈 상태 목 처리)
  if (institutionTab === 'other') {
    return { groups: [] };
  }

  return { groups: MOCK_MINE_DATA.groups.map(toAccountGroup) };
}

export const accountListRepository = { getAccountList };
