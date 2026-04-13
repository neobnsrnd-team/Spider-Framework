/**
 * @file types.ts
 * @description 이체 폼 페이지의 TypeScript 타입 정의.
 *
 * 서버 API 타입(snake_case)과 클라이언트 모델(camelCase)을 분리한다.
 * repository.ts가 변환을 담당하므로, hook과 page는 서버 구조 변경에 영향받지 않는다.
 */

// ── 폼 상태 타입 ──────────────────────────────────────────────────────────

/**
 * 이체 폼 입력값 모델.
 * - accountNumber: Input formatPattern으로 포맷된 값 (예: '012-345678-90123')
 * - amount:        숫자 문자열 순수값 (콤마 없이). 표시용 amountDisplay는 hook에서 별도 계산.
 * - memo:          내 통장 표시 메모 (선택, 10자 이내)
 */
export interface TransferFormValues {
  accountNumber: string;
  amount:        string;
  memo:          string;
}

/**
 * 이체 폼 에러 메시지 모델.
 * 각 필드 에러는 string(메시지) 또는 undefined(에러 없음).
 */
export interface TransferFormErrors {
  accountNumber?: string;
  amount?:        string;
  memo?:          string;
}

/**
 * 폼 필드 touched 상태.
 * onBlur 이후 true로 전환 — true인 필드만 실시간 에러 표시 대상이 된다.
 */
export interface TransferFormTouched {
  accountNumber: boolean;
  amount:        boolean;
  memo:          boolean;
}

// ── 서버 API 타입 (snake_case) ───────────────────────────────────────────

/** 이체 API 요청 바디 */
export interface TransferApiRequest {
  from_account_id:   string;
  to_account_number: string;  // 숫자만 (dash 제거)
  amount:            number;
  memo:              string;
}

/** 이체 API 응답 */
export interface TransferApiResponse {
  transaction_id:         string;
  status:                 'success' | 'failed';
  recipient_name:         string;
  amount:                 number;
  to_account_number:      string;
  my_memo:                string;
  recipient_memo:         string;
  balance_after_transfer: number;
}

// ── 클라이언트 결과 타입 (camelCase) ─────────────────────────────────────

/**
 * 이체 성공 후 클라이언트 결과 모델.
 * route state로 /transfer/success 페이지에 전달된다.
 */
export interface TransferResult {
  transactionId:        string;
  recipientName:        string;
  amount:               number;
  toAccountNumber:      string;
  myMemo:               string;
  recipientMemo:        string;
  balanceAfterTransfer: number;
}
