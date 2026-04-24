// src/hooks/useDraggable.ts
'use client';

import { useRef, useState, useEffect } from 'react';

export interface UseDraggableReturn {
    modalRef: React.RefObject<HTMLDivElement | null>;
    handleRef: React.RefObject<HTMLDivElement | null>;
    isDragging: boolean;
}

/**
 * 모달 드래그 이동 훅
 * handleRef 영역을 잡고 드래그하면 modalRef 요소가 이동합니다.
 * 마우스 및 터치 이벤트를 모두 지원합니다.
 * isOpen이 true가 될 때 이벤트 리스너를 등록하고, false가 되면 위치를 초기화합니다.
 */
export function useDraggable(isOpen: boolean): UseDraggableReturn {
    // 1. ref
    const modalRef = useRef<HTMLDivElement>(null);
    const handleRef = useRef<HTMLDivElement>(null);

    // 2. 드래그 내부 상태 (ref — 렌더 없이 이벤트 핸들러에서 직접 참조)
    const isDraggingRef = useRef(false);
    const pos = useRef({ x: 0, y: 0 });
    const dragStart = useRef({ mouseX: 0, mouseY: 0, posX: 0, posY: 0 });

    // 3. 외부에 노출할 isDragging state (오버레이 닫기 방지용)
    const [isDragging, setIsDragging] = useState(false);

    // 4. effect — isOpen 변경 시 이벤트 등록/해제 및 위치 초기화
    useEffect(() => {
        if (!isOpen) return;

        const handle = handleRef.current;
        const modal = modalRef.current;
        if (!handle || !modal) return;

        // 모달 열릴 때 위치 초기화
        pos.current = { x: 0, y: 0 };
        modal.style.transform = '';

        // 드래그 시작 공통 로직
        const startDrag = (clientX: number, clientY: number, target: EventTarget | null) => {
            if ((target as HTMLElement).closest('button, input, textarea, select, a')) return false;
            isDraggingRef.current = true;
            setIsDragging(true);
            dragStart.current = {
                mouseX: clientX,
                mouseY: clientY,
                posX: pos.current.x,
                posY: pos.current.y,
            };
            return true;
        };

        // 드래그 이동 공통 로직
        const moveDrag = (clientX: number, clientY: number) => {
            if (!isDraggingRef.current) return;
            pos.current = {
                x: dragStart.current.posX + clientX - dragStart.current.mouseX,
                y: dragStart.current.posY + clientY - dragStart.current.mouseY,
            };
            // 성능을 위해 DOM 직접 조작 (setState 호출 없음)
            modal.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
        };

        // 드래그 종료 공통 로직 — setTimeout으로 click 이벤트보다 늦게 상태 초기화
        const endDrag = () => {
            if (!isDraggingRef.current) return;
            isDraggingRef.current = false;
            setTimeout(() => setIsDragging(false), 0);
        };

        // 마우스 이벤트
        const onMouseDown = (e: MouseEvent) => {
            if (startDrag(e.clientX, e.clientY, e.target)) {
                e.preventDefault();
            }
        };
        const onMouseMove = (e: MouseEvent) => moveDrag(e.clientX, e.clientY);
        const onMouseUp = () => endDrag();

        // 터치 이벤트
        const onTouchStart = (e: TouchEvent) => {
            const touch = e.touches[0];
            if (startDrag(touch.clientX, touch.clientY, e.target)) {
                e.preventDefault();
            }
        };
        const onTouchMove = (e: TouchEvent) => {
            const touch = e.touches[0];
            moveDrag(touch.clientX, touch.clientY);
        };
        const onTouchEnd = () => endDrag();

        handle.addEventListener('mousedown', onMouseDown);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);

        handle.addEventListener('touchstart', onTouchStart, { passive: false });
        document.addEventListener('touchmove', onTouchMove);
        document.addEventListener('touchend', onTouchEnd);

        return () => {
            handle.removeEventListener('mousedown', onMouseDown);
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);

            handle.removeEventListener('touchstart', onTouchStart);
            document.removeEventListener('touchmove', onTouchMove);
            document.removeEventListener('touchend', onTouchEnd);

            isDraggingRef.current = false;
            setIsDragging(false);
        };
    }, [isOpen]);

    return { modalRef, handleRef, isDragging };
}
