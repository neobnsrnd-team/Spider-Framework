/**
 * @file types.ts
 * @description 전계좌 조회 페이지에서 사용하는 타입 정의.
 *
 * 서버 응답 타입(Raw)과 클라이언트 모델 타입을 분리하여
 * API 응답 구조 변경 시 repository.ts 만 수정하면 된다.
 */

/** 금융기관 탭: 해당금융(내 계좌) / 다른금융(타행 연결 계좌) */
export type InstitutionTabId = 'mine' | 'other';

/** 상품 카테고리 탭: 예금 / 신탁 / 펀드 / 대출 */
export type ProductCategoryId = 'deposit' | 'trust' | 'fund' | 'loan';

/** 계좌 그룹 구분 */
export type AccountGroupType = 'deposit' | 'foreignDeposit' | 'retirement' | 'securities';

/** 개별 계좌 항목 — 클라이언트 모델 */
export interface AccountItem {
  id: string;
  /** 계좌 상품명 */
  name: string;
  /** 계좌번호 */
  accountNumber: string;
  /** 잔액 (숫자) */
  balance: number;
  /** 통화 코드 */
  currency: 'KRW' | 'USD' | 'EUR' | 'JPY';
  /** 화면 표시용 잔액 문자열 — repository에서 변환 (예: '3,000,000원', '$1,000.00') */
  balanceDisplay: string;
}

/** 계좌 그룹 — 클라이언트 모델 */
export interface AccountGroup {
  type: AccountGroupType;
  /** 화면에 표시할 그룹명 (예: '예금', '외화예금') */
  label: string;
  /** 그룹 합계 잔액 (숫자) */
  totalBalance: number;
  /** 합계 잔액 통화 코드 */
  totalBalanceCurrency: 'KRW' | 'USD';
  /** 화면 표시용 합계 잔액 문자열 — repository에서 변환 (예: '총 4,000,000원') */
  totalBalanceDisplay: string;
  /** 그룹 내 계좌 목록 */
  accounts: AccountItem[];
}

/** 전계좌 조회 페이지 최종 데이터 */
export interface AccountListData {
  groups: AccountGroup[];
}

// ── 서버 응답 타입 (Raw) ─────────────────────────────────────────────
// 실제 API 연동 시 서버가 이 형태로 응답하며,
// repository.ts에서 클라이언트 모델로 변환한다.

/** 서버 응답 개별 계좌 항목 */
export interface AccountItemRaw {
  account_id: string;
  account_name: string;
  account_number: string;
  balance: number;
  currency: string;
}

/** 서버 응답 계좌 그룹 */
export interface AccountGroupRaw {
  type: AccountGroupType;
  label: string;
  total_balance: number;
  total_balance_currency: string;
  /** 외화 그룹의 원화 환산 추정액 — KRW 그룹에서는 undefined */
  total_balance_approx_krw?: number;
  accounts: AccountItemRaw[];
}

/** 서버 응답 전체 구조 */
export interface AccountListResponse {
  groups: AccountGroupRaw[];
}
