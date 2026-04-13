/**
 * @file repository.ts
 * @description KB국민은행 거래내역 조회 API 호출·데이터 가공·모델 변환 담당.
 *
 * 서버 응답(snake_case)을 클라이언트 모델(TransactionItem, camelCase)로 변환한다.
 * API 응답 구조가 바뀌어도 이 파일만 수정하면 hook·page는 변경하지 않아도 된다.
 *
 * @example
 * const page = await transactionHistoryRepository.getTransactionList(filter, 1);
 * // { items: TransactionItem[], hasMore: boolean, nextPage: number }
 */
import axios from 'axios';
import type { TransactionItem } from '@neobnsrnd-team/reactive-springware';
import type { TransactionSearchParams } from '@neobnsrnd-team/reactive-springware';
import type { TransactionApiItem, TransactionPageResponse } from './types';

/**
 * 서버 API 응답 단일 항목을 클라이언트 TransactionItem 모델로 변환한다.
 * @param item - 서버 응답 항목 (snake_case)
 * @returns 클라이언트 모델 (camelCase)
 */
function toTransactionItem(item: TransactionApiItem): TransactionItem {
  return {
    id:      item.transaction_id,
    date:    item.transaction_date,
    title:   item.description,
    amount:  item.amount,
    balance: item.balance_after,
    type:    item.transaction_type,
  };
}

export const transactionHistoryRepository = {
  /**
   * 거래내역 목록을 페이지 단위로 조회한다.
   * @param filter - 조회 조건 (기간·정렬·거래유형)
   * @param page   - 페이지 번호 (1부터 시작)
   * @returns 거래 항목 목록 + 추가 페이지 존재 여부
   */
  getTransactionList: async (
    filter: TransactionSearchParams,
    page: number,
  ): Promise<TransactionPageResponse> => {
    try {
      const { data } = await axios.get('/api/transactions', {
        params: {
          start_date:       filter.startDate,
          end_date:         filter.endDate,
          sort_order:       filter.sortOrder,
          transaction_type: filter.transactionType,
          page,
          size: 20,
        },
      });

      return {
        items:    data.items.map(toTransactionItem),
        hasMore:  data.has_more,
        nextPage: data.next_page,
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        throw new Error('거래내역을 찾을 수 없습니다.');
      }
      throw error;
    }
  },
};
