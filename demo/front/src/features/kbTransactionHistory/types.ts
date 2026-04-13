/**
 * @file types.ts
 * @description KB국민은행 거래내역 조회 페이지 타입 정의.
 *
 * 서버 API 응답 구조(snake_case)를 정의한다.
 * 클라이언트 모델로의 변환은 repository에서 수행한다.
 */

/**
 * 서버 API 응답의 단일 거래 항목.
 * snake_case 필드명은 repository에서 camelCase 모델로 변환된다.
 */
export interface TransactionApiItem {
  transaction_id:   string;
  /** ISO 8601 형식. 예: '2023-11-01T14:20:05Z' */
  transaction_date: string;
  description:      string;
  /** 양수: 입금, 음수: 출금 */
  amount:           number;
  balance_after:    number;
  transaction_type: 'deposit' | 'withdrawal' | 'transfer';
}

/**
 * 거래내역 목록 API 페이지 응답.
 * useInfiniteQuery와 함께 사용하여 더보기 페이지네이션을 처리한다.
 */
export interface TransactionPageResponse {
  items:    TransactionApiItem[];
  hasMore:  boolean;
  /** 다음 페이지 번호. hasMore가 false이면 의미 없음 */
  nextPage: number;
}
