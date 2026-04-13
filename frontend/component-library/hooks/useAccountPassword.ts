/**
 * @file useAccountPassword.ts
 * @description 계좌 비밀번호 입력 BottomSheet 상태 관리 훅.
 *
 * AccountPasswordPage에 필요한 모든 상태(open, pin, digits)와
 * 이벤트 핸들러(handleOpen, handleClose, handleDigitPress, handleDelete, handleShuffle)를
 * 한 곳에서 관리한다.
 *
 * @param options.pinLength  - 비밀번호 자릿수. 기본: 4
 * @param options.onConfirm  - PIN 입력 완료 시 호출 (완성된 PIN 문자열 전달)
 *
 * @returns {UseAccountPasswordReturn} AccountPasswordPage에 spread해서 사용하는 props 집합
 *
 * @example
 * // Page에서 사용 예시
 * const passwordProps = useAccountPassword({
 *   onConfirm: (pin) => transferRepository.confirm(pin),
 * });
 *
 * return (
 *   <>
 *     <Button onClick={passwordProps.handleOpen}>비밀번호 입력</Button>
 *     <AccountPasswordPage {...passwordProps} onClose={passwordProps.handleClose} />
 *   </>
 * );
 */
import { useState, useCallback } from 'react';

// ── 유틸 ──────────────────────────────────────────────────────────

/**
 * Fisher-Yates 셔플 알고리즘으로 배열을 임의 순서로 재배열한다.
 * 원본 배열을 변경하지 않고 새 배열을 반환한다.
 *
 * Math.random() 대신 window.crypto.getRandomValues()를 사용한다.
 * 비밀번호 키패드 셔플에 예측 가능한 난수를 사용하면 입력 패턴 추론 공격에
 * 취약해지므로 암호학적으로 안전한 난수 생성기를 사용한다.
 */
function shuffleArray(arr: number[]): number[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    /* crypto.getRandomValues로 [0, i+1) 범위의 안전한 난수 생성 */
    const randomBuffer = new Uint32Array(1);
    window.crypto.getRandomValues(randomBuffer);
    const j = randomBuffer[0] % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/** 0~9 숫자 배열의 기준 순서 */
const BASE_DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

// ── 타입 ──────────────────────────────────────────────────────────

export interface UseAccountPasswordOptions {
  /**
   * 비밀번호 자릿수. 기본: 4
   * 입력이 pinLength에 도달하면 onConfirm이 자동 호출된다.
   */
  pinLength?: number;
  /**
   * PIN 입력 완료 시 호출되는 콜백.
   * @param pin - 완성된 PIN 문자열 (숫자 문자열, 길이 = pinLength)
   */
  onConfirm?: (pin: string) => void;
}

export interface UseAccountPasswordReturn {
  /** BottomSheet 열림 여부 — AccountPasswordPage의 open prop에 전달 */
  open: boolean;
  /** 현재 입력된 PIN 문자열 (0 ~ pinLength 자리) */
  pin: string;
  /**
   * 셔플된 숫자 배열 (길이 10).
   * BottomSheet를 열거나 재배열 버튼을 누를 때마다 새로 셔플된다.
   */
  digits: number[];
  /** BottomSheet를 열고 숫자를 재셔플한다 */
  handleOpen: () => void;
  /** BottomSheet를 닫고 PIN을 초기화한다 */
  handleClose: () => void;
  /** 숫자 버튼 클릭 — PIN에 숫자를 추가하고, 완성 시 onConfirm 호출 */
  handleDigitPress: (digit: number) => void;
  /** 지우기 버튼 클릭 — PIN 마지막 자리를 제거 */
  handleDelete: () => void;
  /** 재배열 버튼 클릭 — 숫자 위치를 다시 셔플 */
  handleShuffle: () => void;
}

// ── 훅 ──────────────────────────────────────────────────────────

export function useAccountPassword({
  pinLength = 4,
  onConfirm,
}: UseAccountPasswordOptions = {}): UseAccountPasswordReturn {
  const [open, setOpen] = useState(false);
  const [pin, setPin] = useState('');
  /* 초기 마운트 시에도 셔플하여 첫 open 전 digits 상태를 무작위로 초기화 */
  const [digits, setDigits] = useState<number[]>(() => shuffleArray(BASE_DIGITS));

  const handleOpen = useCallback(() => {
    /* 열릴 때마다 숫자를 재배열하여 이전 위치 노출 방지 */
    setDigits(shuffleArray(BASE_DIGITS));
    setPin('');
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    /* 닫힐 때 PIN 초기화 — 잔존 입력값 노출 방지 */
    setPin('');
  }, []);

  const handleDigitPress = useCallback(
    (digit: number) => {
      setPin((prev) => {
        /* pinLength 초과 입력 무시 */
        if (prev.length >= pinLength) return prev;

        const next = prev + digit;

        /* pinLength에 도달하면 onConfirm 호출 (다음 렌더 후 실행) */
        if (next.length === pinLength) {
          onConfirm?.(next);
        }

        return next;
      });
    },
    [pinLength, onConfirm],
  );

  const handleDelete = useCallback(() => {
    setPin((prev) => prev.slice(0, -1));
  }, []);

  const handleShuffle = useCallback(() => {
    setDigits(shuffleArray(BASE_DIGITS));
  }, []);

  return {
    open,
    pin,
    digits,
    handleOpen,
    handleClose,
    handleDigitPress,
    handleDelete,
    handleShuffle,
  };
}
