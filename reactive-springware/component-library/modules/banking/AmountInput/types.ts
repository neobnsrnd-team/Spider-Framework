/**
 * @file types.ts
 * @description AmountInput 컴포넌트의 TypeScript 타입 정의
 * 이체 폼 등에서 원화 금액을 입력받는 필드 전용 타입
 */
export interface AmountInputProps {
  /** 원화 단위 숫자 값. 부모에서 관리하는 controlled 값 */
  value:       number | null;
  /** 값 변경 시 호출. 유효한 숫자 또는 null 전달 */
  onChange:    (value: number | null) => void;
  /** 입력 필드 레이블. 기본: '금액' */
  label?:      string;
  /** 도움말 또는 에러 메시지 */
  helperText?: string;
  /** 에러 상태 여부 */
  hasError?:   boolean;
  /** 빠른 금액 선택 버튼 목록 (단위: 원). 예: [10000, 50000, 100000] */
  quickAmounts?: number[];
  /** 최대 입력 가능 금액 (원). 초과 시 hasError로 처리 */
  maxAmount?:  number;
  /**
   * 이체 한도 안내 텍스트. 금액 입력 행 우측에 표시된다.
   * 예: '1회 5,000,000원 / 1일 10,000,000원'
   */
  transferLimitText?: string;
  disabled?:   boolean;
  /** 플레이스홀더. 기본: '금액을 입력하세요' */
  placeholder?: string;
  className?:  string;
}