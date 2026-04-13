/**
 * @file types.ts
 * @description OtpInput 컴포넌트의 타입 정의.
 *
 * 6자리 PIN/OTP 입력 전용 컴포넌트.
 * 각 자릿수가 독립 input으로 구성되며, 자동 포커스 이동을 처리.
 *
 * @see component-map.md §6.7
 */

/** OTP 자릿수. 기본 6자리, 필요 시 4자리 PIN 용도로도 사용 */
export type OtpLength = 4 | 6;

export interface OtpInputProps {
  /** OTP 자릿수. 기본: 6 */
  length?: OtpLength;
  /** 입력 완료(length개 모두 입력) 시 호출. 완성된 OTP 문자열 전달 */
  onComplete?: (otp: string) => void;
  /** 각 자릿수 변경 시 호출 */
  onChange?: (otp: string) => void;
  /** 에러 상태 여부 (빨간 테두리 표시) */
  error?: boolean;
  /** 비활성화 여부 */
  disabled?: boolean;
  /** 숫자 마스킹 여부 (비밀번호 스타일). 기본: false */
  masked?: boolean;
  /** 추가 클래스 */
  className?: string;
}