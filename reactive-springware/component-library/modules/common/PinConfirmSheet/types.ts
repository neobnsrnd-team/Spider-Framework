/**
 * @file types.ts
 * @description PinConfirmSheet 컴포넌트 타입 정의.
 */

export interface PinConfirmSheetProps {
  /** 시트 열림 여부 */
  open: boolean;
  /** 닫기 핸들러 */
  onClose: () => void;
  /**
   * PIN 입력 완료 핸들러.
   * pinLength 자리가 모두 입력되면 자동 호출된다.
   * async 함수를 전달해도 된다 (API 호출 등).
   * @param pin - 입력된 PIN 문자열
   */
  onConfirm: (pin: string) => void | Promise<void>;
  /** 시트 상단 타이틀. 기본: '비밀번호 입력' */
  title?: string;
  /** PIN 자릿수. 기본: 4 */
  pinLength?: number;
  /**
   * 외부에서 주입하는 에러 메시지.
   * 값이 설정되면 도트 아래에 표시하고 입력된 PIN을 초기화한다.
   */
  errorMessage?: string;
}
