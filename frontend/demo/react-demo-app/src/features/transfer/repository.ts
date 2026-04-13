/**
 * @file repository.ts
 * @description 이체 API 호출·응답 변환 담당 Repository.
 *
 * 실제 API 연동 시 Mock 블록을 제거하고 axios.post('/api/transfer', body)로 교체한다.
 * Hook(useTransferForm)과 Page는 변경하지 않아도 된다.
 *
 * @example
 * const result = await transferRepository.sendTransfer({
 *   fromAccountId: 'acc-001',
 *   toAccountNumber: '01234567890123',  // dash 없는 숫자만
 *   amount: 50000,
 *   memo: '점심값',
 * });
 */

import type {
  TransferApiRequest,
  TransferApiResponse,
  TransferResult,
} from './types';

// ── 출금 계좌별 사용 가능 잔액 Mock ──────────────────────────────────────
// 실제 API 연동 시 /api/accounts/:id 조회로 교체
const MOCK_BALANCE: Record<string, number> = {
  'acc-001': 3000000,
  'acc-002': 1000000,
  'acc-003': 0,        // 외화 계좌 — 원화 이체 불가
};

// ── 서버 응답 → 클라이언트 모델 변환 ────────────────────────────────────

function toTransferResult(raw: TransferApiResponse): TransferResult {
  return {
    transactionId:        raw.transaction_id,
    recipientName:        raw.recipient_name,
    amount:               raw.amount,
    toAccountNumber:      raw.to_account_number,
    myMemo:               raw.my_memo,
    recipientMemo:        raw.recipient_memo,
    balanceAfterTransfer: raw.balance_after_transfer,
  };
}

// ── Repository ────────────────────────────────────────────────────────────

export const transferRepository = {
  /**
   * 출금 계좌의 사용 가능 잔액을 조회한다.
   * 이체 폼 마운트 시 호출하여 잔액 초과 검증에 사용한다.
   *
   * @param fromAccountId - 출금 계좌 ID
   * @returns 사용 가능 잔액 (원화)
   */
  getAvailableBalance: async (fromAccountId: string): Promise<number> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_BALANCE[fromAccountId] ?? 0;
  },

  /**
   * 이체를 실행한다.
   *
   * @param params.fromAccountId   - 출금 계좌 ID
   * @param params.toAccountNumber - 받는 계좌번호 (숫자만, dash 제거)
   * @param params.amount          - 이체 금액 (원화 정수)
   * @param params.memo            - 내 통장 표시 메모
   * @returns 이체 결과 클라이언트 모델
   * @throws Error 이체 실패 시
   */
  sendTransfer: async (params: {
    fromAccountId:   string;
    toAccountNumber: string;
    amount:          number;
    memo:            string;
  }): Promise<TransferResult> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    // 네트워크 지연 시뮬레이션 후 Mock 성공 응답 반환
    const body: TransferApiRequest = {
      from_account_id:   params.fromAccountId,
      to_account_number: params.toAccountNumber,
      amount:            params.amount,
      memo:              params.memo,
    };

    // 실제 API: const { data } = await axios.post<TransferApiResponse>('/api/transfer', body);
    const mockResponse: TransferApiResponse = {
      transaction_id:         `tx-${Date.now()}`,
      status:                 'success',
      recipient_name:         '홍길동',
      amount:                 body.amount,
      to_account_number:      body.to_account_number,
      my_memo:                body.memo,
      recipient_memo:         '이체',
      balance_after_transfer: (MOCK_BALANCE[params.fromAccountId] ?? 0) - body.amount,
    };

    return toTransferResult(mockResponse);
  },
};
