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
   * @param pin - 입력된 PIN 문자열
   */
  onConfirm: (pin: string) => void;
  /** 시트 상단 타이틀. 기본: '비밀번호 입력' */
  title?: string;
  /** PIN 자릿수. 기본: 4 */
  pinLength?: number;
}
