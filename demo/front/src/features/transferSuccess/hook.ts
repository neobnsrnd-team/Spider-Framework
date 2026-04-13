/**
 * @file hook.ts
 * @description 이체 완료 페이지의 상태 및 이벤트 핸들러 Hook.
 *
 * 책임:
 * - 이체 완료 데이터 제공
 *   (실제 환경에서는 직전 이체 API 응답 또는 route state에서 수신)
 * - 추가 이체 / 확인 / 카카오톡 공유 / 자주 쓰는 계좌 등록 핸들러 정의
 *
 * 금지 사항:
 * - UI 렌더링 포함 금지
 * - 직접 axios 호출 금지 (Repository를 통해서만 가능)
 * - Page에서 직접 useState로 상태 생성 금지 (이 Hook을 통해서만 접근)
 */

import { useCallback } from 'react';
import type { TransferSuccessData } from './types';

/** useTransferSuccess Hook 반환 타입 */
export interface UseTransferSuccessReturn {
  /** 이체 완료 데이터 */
  data: TransferSuccessData;
  /** 추가 이체 버튼 클릭 핸들러 — 이체 폼 화면으로 이동 */
  handleAddTransfer: () => void;
  /** 확인 버튼 클릭 핸들러 — 홈 또는 계좌 상세 화면으로 이동 */
  handleConfirm: () => void;
  /** 카카오톡 공유 클릭 핸들러 — Kakao SDK 호출 */
  handleShareKakao: () => void;
  /** 자주 쓰는 계좌 등록 클릭 핸들러 — 즐겨찾기 API 호출 */
  handleSaveFavorite: () => void;
}

export function useTransferSuccess(): UseTransferSuccessReturn {
  /**
   * 데모용 이체 완료 데이터.
   * 실제 구현에서는 이체 API 응답(transferRepository.transfer())의 결과를
   * route state 또는 전역 상태(Zustand 등)를 통해 이 화면으로 전달받는다.
   */
  const data: TransferSuccessData = {
    recipientName:        '홍길동',
    amount:               50000,
    targetAccount:        '국민 987-654-321012',
    myMemo:               '점심값',
    recipientMemo:        '김하나',
    balanceAfterTransfer: 2900000,
  };

  /**
   * 추가 이체: 이체 폼 화면으로 돌아간다.
   * 실제 구현: router.push('/transfer') 또는 navigation.navigate('Transfer')
   */
  const handleAddTransfer = useCallback(() => {
    console.log('추가 이체 — 이체 폼 화면으로 이동');
  }, []);

  /**
   * 확인: 홈 화면 또는 계좌 상세 화면으로 이동한다.
   * 실제 구현: router.push('/home') 또는 navigation.popToTop()
   */
  const handleConfirm = useCallback(() => {
    console.log('확인 — 홈 화면으로 이동');
  }, []);

  /**
   * 카카오톡 공유: Kakao JavaScript SDK를 호출하여 이체 결과를 친구에게 공유한다.
   * 실제 구현: Kakao.Share.sendDefault({ objectType: 'text', text: '...' })
   */
  const handleShareKakao = useCallback(() => {
    console.log('카카오톡 공유 — Kakao SDK 호출');
  }, []);

  /**
   * 자주 쓰는 계좌 등록: 즐겨찾기 Repository를 호출하여 계좌를 등록한다.
   * 실제 구현: favoriteRepository.addFavoriteAccount({ account: data.targetAccount })
   */
  const handleSaveFavorite = useCallback(() => {
    console.log('자주 쓰는 계좌 등록 — favoriteRepository 호출');
  }, []);

  return {
    data,
    handleAddTransfer,
    handleConfirm,
    handleShareKakao,
    handleSaveFavorite,
  };
}
