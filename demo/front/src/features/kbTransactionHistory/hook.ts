/**
 * @file hook.ts
 * @description KB국민은행 거래내역 조회 데이터 패칭·상태 관리 훅.
 *
 * 데모 앱에는 @tanstack/react-query가 설치되어 있지 않으므로
 * Figma 디자인 기준 정적 목업 데이터로 대체한다.
 * 실제 서비스 연동 시: useInfiniteQuery + transactionHistoryRepository 로 교체한다.
 *
 * @returns transactions  - 거래 항목 flat 배열
 * @returns isLoading     - 로딩 중 여부
 * @returns hasMore       - 추가 데이터 존재 여부 (더보기 버튼 표시 조건)
 * @returns filter        - 현재 적용된 조회 조건
 * @returns handleSearch  - 조회 버튼 클릭 핸들러
 * @returns handleLoadMore - 더보기 버튼 클릭 핸들러
 */
import { useState } from 'react';
import type { TransactionItem } from '@neobnsrnd-team/reactive-springware';
import type { TransactionSearchParams } from '@neobnsrnd-team/reactive-springware';

/**
 * 오늘 기준 1개월 기본 조회 조건.
 * 컴포넌트 외부에 선언하여 렌더링마다 재생성되지 않도록 한다.
 */
function getDefaultFilter(): TransactionSearchParams {
  const today       = new Date();
  const oneMonthAgo = new Date(today);
  oneMonthAgo.setMonth(today.getMonth() - 1);

  const fmt = (d: Date) => d.toISOString().split('T')[0]; // 'YYYY-MM-DD'

  return {
    startDate:       fmt(oneMonthAgo),
    endDate:         fmt(today),
    sortOrder:       'recent',
    transactionType: 'all',
  };
}

/**
 * Figma 디자인 기준 목업 거래 데이터.
 * 날짜는 TransactionList 내부에서 ISO 8601 → 'MM월 DD일' 그룹 헤더로 변환된다.
 */
const MOCK_TRANSACTIONS: TransactionItem[] = [
  {
    id:      'tx-1',
    date:    '2023-11-01T14:20:05Z',
    title:   '스타벅스',
    amount:  -5400,
    balance: 2994600,
    type:    'withdrawal',
  },
  {
    id:      'tx-2',
    date:    '2023-11-01T09:00:12Z',
    title:   '급여',
    amount:  2500000,
    balance: 3000000,
    type:    'deposit',
  },
  {
    id:      'tx-3',
    date:    '2023-10-31T21:15:40Z',
    title:   'GS25 강남점',
    amount:  -3200,
    balance: 500000,
    type:    'withdrawal',
  },
  {
    id:      'tx-4',
    date:    '2023-10-31T18:30:22Z',
    title:   '쿠팡결제',
    amount:  -28900,
    balance: 503200,
    type:    'withdrawal',
  },
  {
    id:      'tx-5',
    date:    '2023-10-31T12:45:10Z',
    title:   '이하나',
    amount:  50000,
    balance: 532100,
    type:    'deposit',
  },
];

/** 더보기 클릭 시 추가로 보여줄 목업 거래 데이터 (2페이지) */
const MOCK_TRANSACTIONS_PAGE2: TransactionItem[] = [
  {
    id:      'tx-6',
    date:    '2023-10-30T17:20:00Z',
    title:   '편의점',
    amount:  -2100,
    balance: 482100,
    type:    'withdrawal',
  },
  {
    id:      'tx-7',
    date:    '2023-10-30T10:00:00Z',
    title:   '카페',
    amount:  -4500,
    balance: 484200,
    type:    'withdrawal',
  },
  {
    id:      'tx-8',
    date:    '2023-10-29T15:30:00Z',
    title:   '송금받음',
    amount:  100000,
    balance: 488700,
    type:    'transfer',
  },
];

export const useTransactionHistoryList = () => {
  /** 현재 적용된 조회 조건 */
  const [filter, setFilter] = useState<TransactionSearchParams>(getDefaultFilter);

  /** 현재까지 로드된 거래 항목 누적 배열 */
  const [transactions, setTransactions] = useState<TransactionItem[]>(MOCK_TRANSACTIONS);

  /** 더 불러올 데이터 존재 여부 (2페이지 로드 후 false로 전환) */
  const [hasMore, setHasMore] = useState(true);

  /**
   * 조회 버튼 클릭 핸들러.
   * 실제 서비스에서는 filter 변경 → React Query 재조회.
   * 데모에서는 목업 데이터로 초기화한다.
   */
  const handleSearch = (params: TransactionSearchParams) => {
    setFilter(params);
    setTransactions(MOCK_TRANSACTIONS);
    setHasMore(true);
  };

  /**
   * 더보기 버튼 클릭 핸들러.
   * 실제 서비스에서는 useInfiniteQuery의 fetchNextPage 호출.
   * 데모에서는 2페이지 목업 데이터를 누적한다.
   */
  const handleLoadMore = () => {
    setTransactions((prev) => [...prev, ...MOCK_TRANSACTIONS_PAGE2]);
    /* 2페이지 이후 더보기 버튼 숨김 */
    setHasMore(false);
  };

  return {
    transactions,
    isLoading: false, // 데모: 로딩 없음
    isError:   false, // 데모: 에러 없음
    hasMore,
    filter,
    handleSearch,
    handleLoadMore,
  };
};
