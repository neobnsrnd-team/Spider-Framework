/**
 * @file types.ts
 * @description 이체 폼 컴포넌트의 TypeScript 타입 정의.
 * 6.2 도메인 방침: 단일 페이지 폼 (Stepper 미사용).
 */

export interface TransferFormData {
  /** 받는 계좌번호 */
  toAccount: string;
  /** 이체 금액 (원) */
  amount:    number;
  /** 메모 (선택) */
  memo:      string;
}

export interface TransferFormProps {
  /** 이체 가능 최대 금액 (내 계좌 잔액) */
  availableBalance?: number;
  /** 폼 제출 핸들러. 최종 확인 전에 호출됨 */
  onSubmit:          (data: TransferFormData) => void;
  /** 폼 제출 처리 중 여부 (버튼 로딩 상태) */
  submitting?:       boolean;
  className?:        string;
}