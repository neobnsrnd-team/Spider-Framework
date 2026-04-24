// src/components/ui/Modal.tsx
'use client';

import { useEffect } from 'react';

export interface ModalProps {
    /** 모달 헤더 제목 */
    title: string;
    /** 닫기 콜백 (ESC, 오버레이 클릭) */
    onClose: () => void;
    /** 모달 본문 (body + 하단 버튼 자유 구성) */
    children: React.ReactNode;
    /** X 닫기 버튼 표시 여부 (기본: true) */
    showCloseButton?: boolean;
    /** X 버튼 클릭 시 추가 로직 (미제공 시 onClose 호출) */
    onCloseButtonClick?: () => void;
    /** 카드 너비 (기본: '440px') */
    width?: string;
    /** 카드에 추가할 className (padding, 테마 등 커스터마이징) */
    className?: string;
}

export default function Modal({
    title,
    onClose,
    children,
    showCloseButton = true,
    onCloseButtonClick,
    width = '440px',
    className = '',
}: ModalProps) {
    // ESC 키 닫기 — 셸 레벨에서 일괄 처리
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape') onClose();
        }
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    // X 버튼 클릭 핸들러
    function handleCloseButtonClick() {
        if (onCloseButtonClick) {
            onCloseButtonClick();
        } else {
            onClose();
        }
    }

    return (
        <div
            role="dialog"
            aria-modal="true"
            onMouseDown={onClose}
            className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm flex items-center justify-center"
        >
            <div
                onMouseDown={(e) => e.stopPropagation()}
                style={{ width }}
                className={`bg-white rounded-[20px] max-w-[90vw] shadow-[0_24px_64px_rgba(0,70,164,0.15)] ${
                    showCloseButton ? 'overflow-hidden' : ''
                } ${className}`}
            >
                {/* 헤더 */}
                {showCloseButton ? (
                    <div className="flex items-center justify-between px-7 pt-6 pb-4">
                        <h3 className="m-0 text-[17px] font-bold text-[#111827]">{title}</h3>
                        <button
                            onClick={handleCloseButtonClick}
                            className="w-7 h-7 flex items-center justify-center rounded-full border-0 bg-transparent text-[#9ca3af] text-lg cursor-pointer hover:bg-[#f3f4f6]"
                        >
                            ✕
                        </button>
                    </div>
                ) : (
                    <h3 className="m-0 mb-6 text-lg font-bold text-[#111827]">{title}</h3>
                )}

                {children}
            </div>
        </div>
    );
}
