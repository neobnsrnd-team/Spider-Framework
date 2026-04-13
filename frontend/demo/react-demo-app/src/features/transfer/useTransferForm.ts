/**
 * @file useTransferForm.ts
 * @description 이체 폼 상태·유효성 검사·제출 처리 Hook.
 *
 * 검증 전략 — "첫 blur 이후 실시간" 패턴:
 *   - 사용자가 필드에서 나갈 때(onBlur) touched[field] = true
 *   - touched가 true인 필드에 한해 onChange마다 즉시 재검증
 *   - 덕분에 첫 타이핑 중에는 에러가 보이지 않아 UX가 자연스럽다.
 *
 * @param fromAccountId - URL QueryParam에서 추출한 출금 계좌 ID
 *
 * @returns values          - 현재 폼 입력값
 * @returns errors          - 필드별 에러 메시지 (undefined = 에러 없음)
 * @returns touched         - 필드별 blur 여부
 * @returns isValid         - 제출 버튼 활성화 여부 (에러 없음 + 필수값 존재)
 * @returns isSubmitting    - 이체 API 호출 중 여부 (버튼 loading 상태)
 * @returns availableBalance - 출금 가능 잔액 (잔액 초과 검증에 사용)
 * @returns amountDisplay   - 금액 콤마 표시 문자열 (Input rightElement에 표시)
 * @returns handleChange    - 필드 onChange 핸들러
 * @returns handleBlur      - 필드 onBlur 핸들러
 * @returns handleSubmit    - 이체하기 버튼 onSubmit 핸들러
 */

import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { transferRepository } from './repository';
import type {
  TransferFormValues,
  TransferFormErrors,
  TransferFormTouched,
} from './types';

// ── 계좌번호 유효성 검사 ─────────────────────────────────────────────────
// formatPattern="###-######-#####" 기준 완성형: '012-345678-90123' (16자 + 2 dash = 18자)
// 숫자만 추출해서 길이로 검사 — 패턴이 바뀌어도 이 함수만 수정하면 됨
const ACCOUNT_NUMBER_DIGITS = 14; // 은행마다 다를 수 있어 상수화
function extractDigits(value: string): string {
  return value.replace(/\D/g, '');
}

/** 단일 필드 검증. 에러 메시지 또는 undefined 반환. */
function validateField(
  field: keyof TransferFormValues,
  value: string,
  availableBalance: number,
  allValues: TransferFormValues,
): string | undefined {
  switch (field) {
    case 'accountNumber': {
      if (!value) return '계좌번호를 입력해 주세요.';
      const digits = extractDigits(value);
      if (digits.length < ACCOUNT_NUMBER_DIGITS)
        return `계좌번호 ${ACCOUNT_NUMBER_DIGITS}자리를 입력해 주세요.`;
      return undefined;
    }
    case 'amount': {
      if (!value) return '이체 금액을 입력해 주세요.';
      const num = Number(value.replace(/,/g, ''));
      if (isNaN(num) || num <= 0) return '1원 이상 입력해 주세요.';
      if (num > availableBalance)
        return `잔액이 부족합니다. (출금 가능: ${availableBalance.toLocaleString('ko-KR')}원)`;
      return undefined;
    }
    case 'memo': {
      if (value.length > 10) return '메모는 10자 이내로 입력해 주세요.';
      return undefined;
    }
  }
}

/** 모든 필드 일괄 검증. 에러가 하나라도 있으면 errors 객체 반환. */
function validateAll(
  values: TransferFormValues,
  availableBalance: number,
): TransferFormErrors {
  return {
    accountNumber: validateField('accountNumber', values.accountNumber, availableBalance, values),
    amount:        validateField('amount',        values.amount,        availableBalance, values),
    memo:          validateField('memo',          values.memo,          availableBalance, values),
  };
}

// ── Hook ─────────────────────────────────────────────────────────────────

export function useTransferForm(fromAccountId: string) {
  const navigate = useNavigate();

  /* ── 폼 상태 (rules/04-state-data.md §5: 폼 상태는 useState) ── */
  const [values, setValues] = useState<TransferFormValues>({
    accountNumber: '',
    amount:        '',
    memo:          '',
  });
  const [touched, setTouched] = useState<TransferFormTouched>({
    accountNumber: false,
    amount:        false,
    memo:          false,
  });
  const [errors, setErrors] = useState<TransferFormErrors>({});

  /* ── 출금 가능 잔액 조회 (서버 데이터 → useQuery) ── */
  const { data: availableBalance = 0 } = useQuery({
    queryKey: ['transfer', 'balance', fromAccountId],
    queryFn:  () => transferRepository.getAvailableBalance(fromAccountId),
    enabled:  Boolean(fromAccountId),
  });

  /* ── 이체 실행 (useMutation, rules/04-state-data.md §9) ── */
  const mutation = useMutation({
    mutationFn: (params: { toAccountNumber: string; amount: number; memo: string }) =>
      transferRepository.sendTransfer({
        fromAccountId,
        toAccountNumber: params.toAccountNumber,
        amount:          params.amount,
        memo:            params.memo,
      }),
    onSuccess: (result) => {
      // 이체 성공 → 결과를 route state로 전달하고 완료 페이지로 이동
      navigate('/transfer/success', { state: result });
    },
    onError: (err) => {
      // 서버 에러는 amount 에러 슬롯에 표시
      setErrors(prev => ({
        ...prev,
        amount: err instanceof Error ? err.message : '이체에 실패했습니다. 다시 시도해 주세요.',
      }));
    },
  });

  /* ── onChange 핸들러 ── */
  const handleChange = useCallback((
    field: keyof TransferFormValues,
    value: string,
  ) => {
    const next = { ...values, [field]: value };
    setValues(next);

    // touched된 필드만 즉시 재검증
    if (touched[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: validateField(field, value, availableBalance, next),
      }));
    }
  }, [values, touched, availableBalance]);

  /* ── onBlur 핸들러 — touched 전환 + 최초 검증 ── */
  const handleBlur = useCallback((field: keyof TransferFormValues) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    setErrors(prev => ({
      ...prev,
      [field]: validateField(field, values[field], availableBalance, values),
    }));
  }, [values, availableBalance]);

  /* ── 제출 핸들러 ── */
  const handleSubmit = useCallback(() => {
    // 제출 시 모든 필드 touched 처리 + 전체 검증
    setTouched({ accountNumber: true, amount: true, memo: true });
    const allErrors = validateAll(values, availableBalance);
    setErrors(allErrors);

    // 에러가 하나라도 있으면 중단
    if (Object.values(allErrors).some(Boolean)) return;

    const digits = extractDigits(values.accountNumber);
    const amount = Number(values.amount.replace(/,/g, ''));
    mutation.mutate({ toAccountNumber: digits, amount, memo: values.memo });
  }, [values, availableBalance, mutation]);

  /* ── 파생 상태 ── */
  const amountDisplay = useMemo(() => {
    const num = Number(values.amount.replace(/,/g, ''));
    return isNaN(num) || num === 0 ? '' : `${num.toLocaleString('ko-KR')}원`;
  }, [values.amount]);

  /**
   * 이체하기 버튼 활성화 조건:
   *   - 필수 필드(계좌번호, 금액) 입력됨
   *   - 현재 표시 에러 없음
   *   - 제출 중 아님
   */
  const isValid =
    Boolean(values.accountNumber) &&
    Boolean(values.amount) &&
    !errors.accountNumber &&
    !errors.amount &&
    !errors.memo &&
    !mutation.isPending;

  return {
    values,
    errors,
    touched,
    isValid,
    isSubmitting:     mutation.isPending,
    availableBalance,
    amountDisplay,
    handleChange,
    handleBlur,
    handleSubmit,
  };
}
