// src/components/edit/AppHeaderBorderEditor.tsx
// app-header 블록 하단 구분선(border-bottom)의 색상·굵기를 편집하는 드래그 가능 패널
// blockEl: HTMLElement — 대상 app-header 루트 요소 (DOM 직접 조작)

'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

// 색상 프리셋
const COLOR_PRESETS = [
    { label: 'IBK 블루', value: '#0046A4' },
    { label: '하나 초록', value: '#008B5E' },
    { label: 'KB 노랑', value: '#F0B50A' },
    { label: '신한 파랑', value: '#005BAC' },
    { label: '우리 하늘', value: '#0070C0' },
    { label: '검정', value: '#111827' },
    { label: '회색', value: '#D1D5DB' },
    { label: '빨강', value: '#DC2626' },
];

// 굵기 프리셋 (px)
const WIDTH_PRESETS = [0, 1, 1.5, 2, 2.5, 3, 4];

function parseBorderBottom(el: HTMLElement): { color: string; width: number } {
    // border-bottom: none 인 경우 먼저 처리
    if (el.style.borderBottomStyle === 'none' || el.style.borderBottom === 'none') {
        return { color: '#0046A4', width: 0 };
    }
    const colorRaw =
        el.style.borderBottomColor || el.style.borderBottom.match(/#[0-9a-fA-F]{3,8}|rgb[^)]+\)/)?.[0] || '#0046A4';
    const widthRaw = parseFloat(el.style.borderBottomWidth || '2.5');
    return { color: colorRaw, width: isNaN(widthRaw) ? 2.5 : widthRaw };
}

interface Props {
    blockEl: HTMLElement;
    onClose: () => void;
}

export default function AppHeaderBorderEditor({ blockEl, onClose }: Props) {
    const initial = parseBorderBottom(blockEl);
    const [color, setColor] = useState(initial.color);
    const [width, setWidth] = useState(initial.width);
    // 직접 입력 필드 전용 문자열 state — 소수점 입력 중 강제 변환 방지
    const [widthInput, setWidthInput] = useState(String(initial.width));

    // 드래그
    const [pos, setPos] = useState(() => ({
        x: Math.max(8, window.innerWidth / 2 - 140),
        y: 80,
    }));
    const dragging = useRef(false);
    const dragStart = useRef({ mx: 0, my: 0, px: 0, py: 0 });

    const onHeaderMouseDown = useCallback(
        (e: React.MouseEvent) => {
            if ((e.target as HTMLElement).closest('button,input,label')) return;
            dragging.current = true;
            dragStart.current = { mx: e.clientX, my: e.clientY, px: pos.x, py: pos.y };
            e.preventDefault();
        },
        [pos],
    );

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            if (!dragging.current) return;
            setPos({
                x: dragStart.current.px + e.clientX - dragStart.current.mx,
                y: dragStart.current.py + e.clientY - dragStart.current.my,
            });
        };
        const onUp = () => {
            dragging.current = false;
        };
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
        return () => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
        };
    }, []);

    // 변경 즉시 DOM에 반영
    const applyColor = useCallback(
        (c: string) => {
            setColor(c);
            if (width === 0) {
                blockEl.style.borderBottom = 'none';
            } else {
                blockEl.style.borderBottom = `${width}px solid ${c}`;
            }
        },
        [blockEl, width],
    );

    const applyWidth = useCallback(
        (w: number) => {
            setWidth(w);
            setWidthInput(String(w));
            if (w === 0) {
                blockEl.style.borderBottom = 'none';
            } else {
                blockEl.style.borderBottom = `${w}px solid ${color}`;
            }
        },
        [blockEl, color],
    );

    return (
        <div
            data-ah-border-editor
            style={{
                position: 'fixed',
                left: pos.x,
                top: pos.y,
                width: 280,
                zIndex: 99999,
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: 12,
                boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                fontFamily: "-apple-system,BlinkMacSystemFont,'Malgun Gothic','Apple SD Gothic Neo',sans-serif",
                fontSize: 13,
            }}
        >
            {/* ── 헤더 ── */}
            <div
                onMouseDown={onHeaderMouseDown}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderBottom: '1px solid #f3f4f6',
                    borderRadius: '12px 12px 0 0',
                    background: '#fafafa',
                    cursor: 'grab',
                    userSelect: 'none',
                }}
            >
                <span style={{ fontWeight: 700, color: '#111827' }}>구분선 편집</span>
                <button
                    onClick={onClose}
                    style={{
                        width: 24,
                        height: 24,
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        color: '#6b7280',
                        fontSize: 18,
                        padding: 0,
                        lineHeight: 1,
                    }}
                >
                    ×
                </button>
            </div>

            <div style={{ padding: '14px 14px 16px' }}>
                {/* ── 미리보기 ── */}
                <div
                    style={{
                        height: 32,
                        background: '#f9fafb',
                        border: '1px solid #e5e7eb',
                        borderRadius: 6,
                        marginBottom: 14,
                        display: 'flex',
                        alignItems: 'flex-end',
                        overflow: 'hidden',
                    }}
                >
                    <div
                        style={{
                            width: '100%',
                            borderBottom: width === 0 ? 'none' : `${width}px solid ${color}`,
                        }}
                    />
                </div>

                {/* ── 굵기 ── */}
                <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 600, marginBottom: 6 }}>굵기</div>
                    <div style={{ display: 'flex', gap: 4 }}>
                        {WIDTH_PRESETS.map((w) => (
                            <button
                                key={w}
                                onClick={() => applyWidth(w)}
                                style={{
                                    flex: 1,
                                    padding: '5px 0',
                                    border: `1.5px solid ${width === w ? '#0046A4' : '#e5e7eb'}`,
                                    borderRadius: 6,
                                    background: width === w ? '#ebf4ff' : '#fff',
                                    color: width === w ? '#0046A4' : '#374151',
                                    cursor: 'pointer',
                                    fontSize: 11,
                                    fontWeight: width === w ? 700 : 400,
                                }}
                            >
                                {w === 0 ? '없음' : `${w}`}
                            </button>
                        ))}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                        <span style={{ fontSize: 11, color: '#6b7280', flexShrink: 0 }}>직접 입력</span>
                        <input
                            type="number"
                            min={0}
                            max={20}
                            step={0.5}
                            value={widthInput}
                            onChange={(e) => {
                                // 입력 중 문자열 그대로 유지 — 소수점 입력 시 강제 변환 방지
                                setWidthInput(e.target.value);
                            }}
                            onBlur={(e) => {
                                // 포커스 아웃 시점에 DOM 반영
                                const val = parseFloat(e.target.value);
                                const clamped = isNaN(val) ? 0 : Math.min(20, Math.max(0, val));
                                setWidthInput(String(clamped));
                                applyWidth(clamped);
                            }}
                            style={{
                                width: 60,
                                padding: '4px 8px',
                                border: '1.5px solid #e5e7eb',
                                borderRadius: 6,
                                fontSize: 12,
                                outline: 'none',
                                boxSizing: 'border-box',
                            }}
                        />
                        <span style={{ fontSize: 11, color: '#6b7280' }}>px</span>
                    </div>
                </div>

                {/* ── 색상 ── */}
                <div>
                    <div style={{ fontSize: 11, color: '#6b7280', fontWeight: 600, marginBottom: 6 }}>색상</div>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
                        {COLOR_PRESETS.map(({ value }) => (
                            <button
                                key={value}
                                title={value}
                                onClick={() => applyColor(value)}
                                style={{
                                    width: 24,
                                    height: 24,
                                    borderRadius: 5,
                                    background: value,
                                    border: color === value ? '2.5px solid #0046A4' : '2px solid transparent',
                                    cursor: 'pointer',
                                    padding: 0,
                                    outline: 'none',
                                    flexShrink: 0,
                                    boxShadow: '0 0 0 1px rgba(0,0,0,0.1)',
                                    opacity: width === 0 ? 0.35 : 1,
                                }}
                                disabled={width === 0}
                            />
                        ))}
                        {/* 직접 입력 */}
                        <label
                            title="직접 선택"
                            style={{
                                width: 24,
                                height: 24,
                                borderRadius: 5,
                                border: '2px solid #d1d5db',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                overflow: 'hidden',
                                flexShrink: 0,
                                background: 'conic-gradient(red, yellow, lime, cyan, blue, magenta, red)',
                                opacity: width === 0 ? 0.35 : 1,
                            }}
                        >
                            <input
                                type="color"
                                value={color.startsWith('#') ? color : '#0046A4'}
                                disabled={width === 0}
                                onChange={(e) => applyColor(e.target.value)}
                                style={{ opacity: 0, width: 1, height: 1, padding: 0, border: 'none' }}
                            />
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}
