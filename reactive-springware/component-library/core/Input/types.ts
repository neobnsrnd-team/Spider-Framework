/**
 * @file types.ts
 * @description Input 컴포넌트의 TypeScript 타입 정의
 */
import React from 'react';

export type InputSize            = 'md' | 'lg';
export type InputValidationState = 'default' | 'error' | 'success';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** 입력 필드 레이블 */
  label?:           string;
  /** 안내 문구 또는 에러 메시지. validationState='error' 시 빨간색으로 표시 */
  helperText?:      string;
  /** 유효성 상태. 기본: 'default' */
  validationState?: InputValidationState;
  /**
   * 입력 필드 높이. 기본: 'md'.
   * HTMLInputElement의 size(number)와 충돌하므로 Omit 후 재정의.
   */
  size?:            InputSize;
  leftIcon?:        React.ReactNode;
  /** 우측 버튼/단위 슬롯 (인증번호 전송, 단위 텍스트 등) */
  rightElement?:    React.ReactNode;
  /** true이면 w-full 적용 */
  fullWidth?:       boolean;
  /**
   * 입력값 포맷 패턴. `#`은 숫자 한 자리, 그 외 문자는 구분자로 그대로 삽입된다.
   * 숫자만 입력받고, 최대 자릿수는 패턴의 `#` 개수로 자동 제한된다.
   *
   * @example
   * '###-######-#####'  // 하나은행  → 012-345678-90123
   * '######-##-######'  // KB국민은행 → 012345-67-890123
   */
  formatPattern?:   string;
  /**
   * 한국 휴대폰번호 포맷 적용 여부.
   * 자릿수에 따라 포맷이 동적으로 전환된다.
   * - 10자리: 010-XXX-XXXX  (3-3-4)
   * - 11자리: 010-XXXX-XXXX (3-4-4)
   * `formatPattern`과 함께 사용하면 `phoneFormat`이 우선 적용된다.
   */
  phoneFormat?:     boolean;
}