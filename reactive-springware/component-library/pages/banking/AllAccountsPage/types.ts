/**
 * @file types.ts
 * @description AllAccountsPage 컴포넌트 타입 정의.
 *
 * 전계좌 조회 페이지의 props 타입.
 * 해당금융(내 계좌)과 다른금융(연결 계좌) 탭 전환을 하나의 페이지에서 처리한다.
 */

/** 상단 탭 — 해당금융: 내 하나은행 계좌, 다른금융: 연결된 타행 계좌 */
export type AllAccountsTab = 'mine' | 'other';

/** 세그먼트 필터 탭 — 해당금융 탭 내 계좌 유형 분류 */
export type AccountSegment = 'all' | 'deposit' | 'trust' | 'fund' | 'loan';

/** 페이지 렌더링 상태 (Storybook args 제어용) */
export type AllAccountsPageState = 'loading' | 'data' | 'error';

export interface AllAccountsPageProps {
  /**
   * 초기 활성 탭.
   * - 'mine': 해당금융 (기본)
   * - 'other': 다른금융
   */
  initialTab?: AllAccountsTab;
  /**
   * 초기 렌더링 상태 (Storybook 시각 확인용).
   * 실제 앱에서는 Hook의 isLoading·isError로 제어한다.
   */
  initialState?: AllAccountsPageState;
  /** 뒤로가기 버튼 클릭 핸들러 */
  onBack?: () => void;
  /** 연결하기 버튼 클릭 핸들러 (다른금융 탭 빈 상태에서 표시) */
  onConnectAccount?: () => void;
  /** 계좌 카드 클릭 핸들러 */
  onAccountClick?: (accountId: string) => void;
  /** 거래내역 버튼 클릭 핸들러 */
  onTransactionHistory?: (accountId: string) => void;
  /** 이체 버튼 클릭 핸들러 */
  onTransfer?: (accountId: string) => void;
}
