/**
 * @file types.ts
 * @description AccountPasswordPage 컴포넌트의 TypeScript 타입 정의.
 *
 * 계좌 비밀번호 입력 BottomSheet 화면.
 * PIN 상태와 숫자 배열은 외부(Hook)에서 관리하고 props로 전달한다.
 *
 * Figma 원본: Hana Bank App node-id: 1:1576
 */

export interface AccountPasswordPageProps {
  /** BottomSheet 열림 여부 */
  open: boolean;
  /** 닫기 핸들러 (X 버튼·백드롭 클릭 공통) */
  onClose: () => void;
  /**
   * 현재 입력된 PIN 문자열 (0~4자리).
   * PinDotIndicator에 filledCount로 전달된다.
   */
  pin: string;
  /**
   * 셔플된 숫자 배열 (길이 10, 값 0~9 각 1회).
   * NumberKeypad에 그대로 전달된다.
   */
  digits: number[];
  /** 숫자 버튼 클릭 핸들러 */
  onDigitPress: (digit: number) => void;
  /** 지우기 버튼 클릭 핸들러 */
  onDelete: () => void;
  /** 재배열 버튼 클릭 핸들러 */
  onShuffle: () => void;
}
