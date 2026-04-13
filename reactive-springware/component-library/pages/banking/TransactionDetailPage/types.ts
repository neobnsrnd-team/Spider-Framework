/**
 * @file types.ts
 * @description TransactionDetailPage 컴포넌트 타입 정의.
 */

/** 거래 유형 — 바텀시트 내 금액 색상·배지 변형 결정에 사용 */
export type TransactionDetailType = 'deposit' | 'withdrawal';

/**
 * 거래 상세 목업 데이터 구조.
 * Storybook args와 실제 API 응답을 가공한 displayValue 형태를 모두 포함한다.
 */
export interface TransactionDetailMockData {
  type:                 TransactionDetailType;
  /** 표시용 금액 문자열 (예: '- 50,000원') */
  displayAmount:        string;
  /** 표시용 거래 일시 문자열 (예: '2023.11.01 14:20:05') */
  displayDate:          string;
  memo:                 string;
  transactionCategory:  string;
  description:          string;
  counterAccount:       string;
  counterAccountHolder: string;
}

export interface TransactionDetailPageProps {
  /** 바텀시트 초기 오픈 여부. 기본: true */
  initialOpen?:  boolean;
  /** 렌더링할 거래 상세 목업 데이터 */
  mockData?:     TransactionDetailMockData;
  /** 로딩 상태 시뮬레이션 여부 */
  isLoading?:    boolean;
  /** 메모 편집 모드로 초기화 여부 */
  editingMemo?:  boolean;
}
