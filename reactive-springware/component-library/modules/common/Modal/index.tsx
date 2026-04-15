/**
 * @file index.tsx
 * @description 오버레이 모달 컴포넌트.
 * React Portal로 document.body에 렌더링하며, z-modal(50)으로 최상위 레이어를 유지한다.
 *
 * 항상 화면 중앙에 팝업으로 표시되며, 배경은 dim 처리된다.
 * Bottom Sheet가 필요한 경우 BottomSheet 컴포넌트를 사용한다.
 *
 * @example
 * <Modal open={open} onClose={() => setOpen(false)} title="이체 확인"
 *   footer={
 *     <div className="flex gap-sm">
 *       <Button variant="outline" fullWidth onClick={() => setOpen(false)}>취소</Button>
 *       <Button fullWidth onClick={handleConfirm}>이체 확인</Button>
 *     </div>
 *   }
 * >
 *   <CardRow label="받는 분" value="홍길동" />
 *   <CardRow label="금액" value="1,000,000원" />
 * </Modal>
 */
import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@lib/cn';
import type { ModalProps, ModalSize, ModalTitleAlign } from './types';
export type { ModalProps, ModalSize, ModalTitleAlign } from './types';

/** 데스크톱(md 이상)에서 적용할 최대 너비 클래스 */
/**
 * 모달 크기별 최대 너비 클래스.
 * Tailwind v4에서 max-w-sm/md/lg는 --spacing-sm/md/lg(8px/12px/20px)를 참조하므로
 * 피그마 컴포넌트 기준 고정 픽셀값(arbitrary value)을 사용한다.
 * - sm: 320px / md: 360px / lg: 390px (createModal.ts MODAL_SIZE_CONFIG 기준)
 */
const PANEL_SIZE: Record<ModalSize, string> = {
  sm: 'max-w-[320px]',
  md: 'max-w-[360px]',
  lg: 'max-w-[390px]',
  /* fullscreen: w-screen(=100vw) 대신 w-full 사용 — 스크롤바 너비 포함 가로 스크롤 방지 */
  fullscreen: 'max-w-none w-full max-h-none rounded-none',
};

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  disableBackdropClose = false,
  titleAlign = 'left',
  className,
}: ModalProps) {
  /* ESC 키로 닫기 */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose],
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener('keydown', handleKeyDown);
    /* 모달이 열린 동안 body 스크롤 잠금 */
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return createPortal(
    /*
     * 백드롭: fixed inset-0으로 뷰포트 전체 덮기, bg-black/50으로 dim 처리
     * items-center justify-center → 항상 화면 중앙에 팝업 표시
     */
    <div
      role="presentation"
      onClick={disableBackdropClose ? undefined : onClose}
      className="fixed inset-0 z-modal flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'flex flex-col',
          /* mx-4: 좌우 여백으로 뷰포트 엣지에 붙지 않도록 */
          'w-full mx-4 max-h-[90dvh] overflow-hidden',
          'bg-surface shadow-2xl',
          'rounded-2xl',
          PANEL_SIZE[size],
          className,
        )}
      >
        {/* 헤더 (고정) — titleAlign 에 따라 레이아웃 분기 */}
        {titleAlign === 'center' ? (
          /*
           * center 모드: 타이틀 중앙 정렬, X 버튼 절대 우측 배치.
           * BottomSheet 헤더와 동일한 패턴 (경고·안내 모달에서 사용).
           */
          <div className="relative flex shrink-0 items-center justify-center px-xl pt-md pb-md">
            {title && (
              <h2 id="modal-title" className="text-base font-bold text-text-heading text-center">
                {title}
              </h2>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="모달 닫기"
              className={cn(
                'absolute right-xl flex items-center justify-center size-8 rounded-lg',
                'text-text-muted hover:bg-surface-raised hover:text-text-heading',
                'transition-colors duration-150',
              )}
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        ) : (
          /*
           * left 모드(기본): 타이틀 좌측, X 버튼 우측 (justify-between).
           * 일반 확인·선택 모달에서 사용.
           */
          <div className="flex shrink-0 items-center justify-between px-xl pt-md pb-md">
            {title ? (
              <h2 id="modal-title" className="text-base font-bold text-text-heading">
                {title}
              </h2>
            ) : (
              /* 닫기 버튼을 오른쪽으로 밀기 위한 spacer */
              <span aria-hidden="true" />
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="모달 닫기"
              className={cn(
                'ml-auto flex items-center justify-center size-8 rounded-lg',
                'text-text-muted hover:bg-surface-raised hover:text-text-heading',
                'transition-colors duration-150',
              )}
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        )}

        {/*
         * 본문 (스크롤 영역)
         * flex-1 + min-h-0: 헤더·푸터를 제외한 공간을 차지하면서 내부 스크롤 허용
         * min-h-0 없으면 flex 컬럼에서 overflow-y-auto가 동작하지 않음
         */}
        <div className="flex-1 min-h-0 overflow-y-auto px-xl pb-md">{children}</div>

        {/* 푸터 (고정) */}
        {footer && <div className="shrink-0 px-xl pt-md pb-xl">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}
