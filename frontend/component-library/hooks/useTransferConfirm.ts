/**
 * @file useTransferConfirm.ts
 * @description 이체 확인 BottomSheet 상태 관리 훅.
 *
 * TransferConfirmPage의 open/close 상태를 관리하고,
 * "예" 확인 시 onConfirm 콜백을 호출한다.
 *
 * 이체 플로우에서의 위치:
 *   이체 정보 입력(TransferForm)
 *     → 이체 확인(TransferConfirmPage) ← 이 훅이 담당
 *       → 비밀번호 입력(AccountPasswordPage / useAccountPassword)
 *         → 이체 완료(TransferSuccessPage)
 *
 * @param options.onConfirm     - "예" 버튼 클릭 시 호출 (다음 단계 진행)
 * @param options.onAddTransfer - "추가이체" 링크 클릭 시 호출 (선택)
 *
 * @example
 * const confirmProps = useTransferConfirm({
 *   onConfirm: () => passwordProps.handleOpen(), // PIN 입력으로 진행
 * });
 *
 * return (
 *   <>
 *     <Button onClick={confirmProps.handleOpen}>이체</Button>
 *     <TransferConfirmPage
 *       {...transferData}
 *       open={confirmProps.open}
 *       onClose={confirmProps.handleClose}
 *       onConfirm={confirmProps.handleConfirm}
 *     />
 *   </>
 * );
 */
import { useState, useCallback, useMemo } from 'react';

export interface UseTransferConfirmOptions {
  /**
   * "예" 버튼 클릭 시 호출되는 콜백.
   * BottomSheet는 자동으로 닫히지 않으므로, 콜백 내에서 필요 시 handleClose를 호출한다.
   * 보통 PIN 입력 화면(useAccountPassword.handleOpen)으로 연결한다.
   */
  onConfirm?: () => void;
  /** "추가이체" 링크 클릭 시 호출. 미전달 시 추가이체 버튼 미노출 */
  onAddTransfer?: () => void;
}

export interface UseTransferConfirmReturn {
  /** BottomSheet 열림 여부 */
  open: boolean;
  /** 이체 확인 BottomSheet를 연다 */
  handleOpen: () => void;
  /** BottomSheet를 닫는다 ("아니오" 또는 외부 닫기) */
  handleClose: () => void;
  /**
   * "예" 버튼 핸들러.
   * onConfirm 콜백을 호출한다. BottomSheet 닫힘 여부는 콜백이 결정한다.
   * (PIN 입력 등 다음 단계 완료 후 닫는 패턴을 지원하기 위해 자동 닫힘 없음)
   */
  handleConfirm: () => void;
  /**
   * 추가이체 핸들러.
   * onAddTransfer 콜백을 호출하고 현재 BottomSheet를 닫는다.
   * undefined이면 TransferConfirmPage에서 추가이체 버튼이 렌더링되지 않는다.
   */
  handleAddTransfer: (() => void) | undefined;
}

export function useTransferConfirm({
  onConfirm,
  onAddTransfer,
}: UseTransferConfirmOptions = {}): UseTransferConfirmReturn {
  const [open, setOpen] = useState(false);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const handleConfirm = useCallback(() => {
    /* 자동으로 닫지 않음 — PIN 입력 등 후속 플로우 완료 시점에 닫는 것이 UX상 자연스럽다 */
    onConfirm?.();
  }, [onConfirm]);

  const handleAddTransfer = useMemo(
    () =>
      onAddTransfer
        ? () => {
            /* 추가이체 진입 전 현재 화면을 닫아 중첩 방지 */
            setOpen(false);
            onAddTransfer();
          }
        : undefined,
    [onAddTransfer],
  );

  return {
    open,
    handleOpen,
    handleClose,
    handleConfirm,
    handleAddTransfer,
  };
}
