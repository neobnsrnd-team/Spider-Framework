/**
 * @file index.tsx
 * @description PIN 입력 하단 시트 컴포넌트.
 *
 * BottomSheet + PinDotIndicator + NumberKeypad를 조합하여
 * 즉시결제·계좌 비밀번호 등 PIN 확인이 필요한 화면에서 재사용한다.
 *
 * 동작:
 * - 숫자 키패드로 PIN을 입력하면 PinDotIndicator가 채워진다.
 * - pinLength 자리가 완성되면 onConfirm이 자동 호출된다.
 * - 재배열 버튼으로 키패드 순서를 셔플할 수 있다.
 * - 닫힐 때 입력 상태가 초기화된다.
 *
 * @param open       - 시트 열림 여부
 * @param onClose    - 닫기 핸들러
 * @param onConfirm  - PIN 완료 핸들러 (pinLength 자리 입력 시 자동 호출)
 * @param title      - 시트 타이틀 (기본: '비밀번호 입력')
 * @param pinLength  - PIN 자릿수 (기본: 4)
 *
 * @example
 * <PinConfirmSheet
 *   open={pinOpen}
 *   onClose={() => setPinOpen(false)}
 *   onConfirm={(pin) => { console.log(pin); navigate('/next'); }}
 * />
 */
import React, { useState, useEffect, useCallback } from 'react';
import { BottomSheet }      from '../BottomSheet';
import { PinDotIndicator }  from '../../banking/PinDotIndicator';
import { NumberKeypad }     from '../../banking/NumberKeypad';
import { Typography }       from '../../../core/Typography';
import type { PinConfirmSheetProps } from './types';

export type { PinConfirmSheetProps } from './types';

/** 배열을 무작위로 섞어 반환한다 (Fisher-Yates 셔플). */
function shuffle(arr: number[]): number[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const INITIAL_DIGITS = () => shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);

export function PinConfirmSheet({
  open,
  onClose,
  onConfirm,
  title = '비밀번호 입력',
  pinLength = 4,
}: PinConfirmSheetProps) {
  const [pin,    setPin]    = useState('');
  const [digits, setDigits] = useState<number[]>(INITIAL_DIGITS);

  /* 시트가 닫힐 때 입력 상태 초기화 */
  useEffect(() => {
    if (!open) {
      setPin('');
      setDigits(INITIAL_DIGITS());
    }
  }, [open]);

  /* pinLength 자리 완성 시 자동 확인 */
  useEffect(() => {
    if (pin.length === pinLength) {
      /* 렌더 완료 후 호출해 마지막 도트가 채워지는 것을 보여줌 */
      const id = setTimeout(() => onConfirm(pin), 150);
      return () => clearTimeout(id);
    }
  }, [pin, pinLength, onConfirm]);

  const handleDigit = useCallback((d: number) => {
    setPin((p) => (p.length < pinLength ? p + d : p));
  }, [pinLength]);

  const handleDelete = useCallback(() => {
    setPin((p) => p.slice(0, -1));
  }, []);

  const handleShuffle = useCallback(() => {
    setDigits(INITIAL_DIGITS());
  }, []);

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={title}
      disableBackdropClose
      hideCloseButton={false}
    >
      {/* PIN 도트 */}
      <div className="flex flex-col items-center gap-xl py-xl">
        <Typography variant="body" color="muted">
          결제 비밀번호를 입력하세요
        </Typography>
        <PinDotIndicator length={pinLength} filledCount={pin.length} />
      </div>

      {/* 숫자 키패드 */}
      <NumberKeypad
        digits={digits}
        onDigitPress={handleDigit}
        onDelete={handleDelete}
        onShuffle={handleShuffle}
      />
    </BottomSheet>
  );
}
