/**
 * @file index.tsx
 * @description 계좌 비밀번호 입력 BottomSheet 페이지 컴포넌트.
 *
 * Figma 원본: Hana Bank App node-id: 1:1576
 * 이체·출금 등의 플로우에서 계좌 비밀번호 4자리를 입력받는 보안 화면.
 *
 * 화면 구성 (BottomSheet 내부):
 *   1. 타이틀 — "계좌 비밀번호 입력" (BottomSheet 표준 헤더)
 *   2. 부제목 — "출금 계좌의 비밀번호 4자리를 입력하세요."
 *   3. PIN 도트 인디케이터 — 4개 원형 도트 (입력 진행 상태 표시)
 *   4. 숫자 키패드 — 3×4 셔플 키패드
 *   5. 보안 안내 — "보안을 위해 키패드 숫자가 재배열되었습니다."
 *
 * 실제 앱 구현 시 주의사항:
 * - pin, digits, onDigitPress, onDelete, onShuffle는 useAccountPassword 훅에서 관리한다.
 * - PIN 4자리 완성 시 onDigitPress 내부에서 onConfirm을 호출한다.
 *
 * @param open         - BottomSheet 열림 여부
 * @param onClose      - 닫기 핸들러
 * @param pin          - 현재 입력된 PIN 문자열 (0~4자리)
 * @param digits       - 셔플된 숫자 배열 (길이 10)
 * @param onDigitPress - 숫자 버튼 클릭 핸들러
 * @param onDelete     - 지우기 버튼 클릭 핸들러
 * @param onShuffle    - 재배열 버튼 클릭 핸들러
 */
import React from 'react';
import { Lock } from 'lucide-react';

/* ── Modules ─────────────────────────────────────────────────────── */
import { BottomSheet } from '../../../modules/common/BottomSheet';
import { PinDotIndicator } from '../../../modules/banking/PinDotIndicator';
import { NumberKeypad } from '../../../modules/banking/NumberKeypad';

/* ── Layout ──────────────────────────────────────────────────────── */
import { Stack } from '../../../layout/Stack';
import { Inline } from '../../../layout/Inline';

/* ── Core ────────────────────────────────────────────────────────── */
import { Typography } from '../../../core/Typography';

import type { AccountPasswordPageProps } from './types';

export type { AccountPasswordPageProps } from './types';

export function AccountPasswordPage({
  open,
  onClose,
  pin,
  digits,
  onDigitPress,
  onDelete,
  onShuffle,
}: AccountPasswordPageProps) {
  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      /* Figma 원본 타이틀 텍스트 */
      title="계좌 비밀번호 입력"
    >
      <Stack gap="md">
        {/* 부제목 — 입력 안내 문구 */}
        <Typography variant="body-sm" color="muted" className="text-center">
          출금 계좌의 비밀번호 4자리를 입력하세요.
        </Typography>

        {/* PIN 도트 인디케이터 — 중앙 정렬 */}
        <div className="flex justify-center py-md">
          <PinDotIndicator filledCount={pin.length} />
        </div>

        {/* 숫자 키패드 */}
        <NumberKeypad
          digits={digits}
          onDigitPress={onDigitPress}
          onDelete={onDelete}
          onShuffle={onShuffle}
        />

        {/* 보안 안내 — opacity-60으로 강조 완화 */}
        <Inline gap="xs" align="center" justify="center" className="opacity-60 py-sm">
          <Lock className="size-3 text-text-secondary shrink-0" aria-hidden="true" />
          <Typography variant="caption" color="secondary">
            보안을 위해 키패드 숫자가 재배열되었습니다.
          </Typography>
        </Inline>
      </Stack>
    </BottomSheet>
  );
}
