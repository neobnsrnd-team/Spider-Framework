/**
 * @file types.ts
 * @description TransactionHistoryPage 컴포넌트 타입 정의.
 */

/**
 * 거래내역 조회 페이지 렌더링 상태.
 * - data    : 정상 데이터 표시
 * - loading : 스켈레톤 로딩 중
 * - empty   : 조회 결과 없음
 * - error   : 데이터 로드 실패
 */
export type TransactionHistoryPageState = 'data' | 'loading' | 'empty' | 'error';

export interface TransactionHistoryPageProps {
  /**
   * 초기 렌더링 상태.
   * 실제 앱에서는 useTransactionHistory 훅에서 파생된다.
   * Storybook args 제어용으로만 사용한다.
   */
  initialState?:   TransactionHistoryPageState;
  /**
   * 조회 조건 설정 패널 초기 펼침 여부.
   * true 시 퀵 기간 탭·날짜 입력·드롭다운·조회 버튼이 펼쳐진 상태로 시작된다.
   */
  filterExpanded?: boolean;
}
