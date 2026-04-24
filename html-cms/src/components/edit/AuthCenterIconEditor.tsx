// src/components/edit/AuthCenterIconEditor.tsx
// auth-center 블록의 항목 아이콘을 교체하는 드래그 가능 패널
// blockEl: HTMLElement — 대상 auth-center 루트 요소 (DOM 직접 조작)

'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { openCmsFilesPicker } from '@/lib/cms-file-picker';

// 아이콘 SVG 내부 path (svg 래퍼는 buildIconHtml에서 생성)
// stroke="currentColor" → 부모 .ac-icon-wrap의 color CSS로 제어
const AC_ICONS: Record<string, string> = {
    cert: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>',
    lock: '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    phone: '<rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/><path d="M9 7h6"/><path d="M9 11h6"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>',
    key: '<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 3 3L22 7l-3-3"/>',
    fingerprint:
        '<path d="M2 12C2 6.5 6.5 2 12 2a10 10 0 0 1 8 4"/><path d="M5 19.5C5.5 18 6 15 6 12c0-1.9.5-3.7 1.5-5.2"/><path d="M11 19.9c-.3-.8-.5-1.7-.5-2.9 0-3.5 3-5 5-5 1 0 2 .3 3 .8"/><path d="M10 12a2 2 0 0 1 4 0c0 2.5-3 5-3 5"/><path d="M12 12v.5"/><path d="M14.5 17.5c.3-.9.5-1.9.5-3.2 0-1-.3-2-.9-2.8"/>',
    id_card:
        '<rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8" cy="12" r="2"/><path d="M13 11h4"/><path d="M13 15h4"/>',
    password:
        '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/><line x1="8" y1="16" x2="8.01" y2="16"/><line x1="12" y1="16" x2="12.01" y2="16"/><line x1="16" y1="16" x2="16.01" y2="16"/>',
    bank_card: '<rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>',
    qr: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><path d="M14 14h3v3h-3z"/><path d="M17 14v3"/><path d="M14 17h3"/>',
    checkmark: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
    refresh: '<polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>',
};

const AC_ICON_LABELS: Record<string, string> = {
    cert: '공동인증',
    lock: '잠금',
    phone: '모바일',
    shield: '보안',
    key: '열쇠',
    fingerprint: '지문',
    id_card: '신분증',
    password: '비밀번호',
    bank_card: '카드',
    qr: 'QR',
    checkmark: '확인',
    refresh: '갱신',
};

// 아이콘 색상 프리셋
const ICON_COLOR_PRESETS = ['#0046A4', '#FF6600', '#059669', '#374151', '#DC2626', '#7C3AED', '#0891B2', '#CA8A04'];

// 배경 색상 프리셋
const BG_COLOR_PRESETS = ['#E8F0FC', '#FFF3EC', '#F0FFF4', '#F3F4F6', '#FEF2F2', '#F5F3FF', '#ECFEFF', '#FEFCE8'];

function buildIconHtml(key: string): string {
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="22" height="22">${AC_ICONS[key]}</svg>`;
}

function readIconColor(itemEl: HTMLElement): string {
    const wrap = itemEl.querySelector<HTMLElement>('.ac-icon-wrap');
    return wrap?.style.color || '#0046A4';
}

function readBgColor(itemEl: HTMLElement): string {
    const wrap = itemEl.querySelector<HTMLElement>('.ac-icon-wrap');
    return wrap?.style.background || '#E8F0FC';
}

interface Props {
    blockEl: HTMLElement;
    onClose: () => void;
}

export default function AuthCenterIconEditor({ blockEl, onClose }: Props) {
    const [pos, setPos] = useState(() => ({
        x: Math.max(8, window.innerWidth / 2 - 130),
        y: 80,
    }));
    const [pickerIdx, setPickerIdx] = useState<number | null>(null);
    const [iconColor, setIconColor] = useState('#0046A4');
    const [bgColor, setBgColor] = useState('#E8F0FC');
    const [tick, setTick] = useState(0);

    // 드래그
    const dragging = useRef(false);
    const dragStart = useRef({ mx: 0, my: 0, px: 0, py: 0 });

    const onHeaderMouseDown = useCallback(
        (e: React.MouseEvent) => {
            if ((e.target as HTMLElement).closest('button')) return;
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

    // 피커 열기 — 현재 아이템의 색상/배경 읽어서 초기화
    const openPicker = useCallback(
        (idx: number, itemEl: HTMLElement) => {
            if (pickerIdx === idx) {
                setPickerIdx(null);
            } else {
                setIconColor(readIconColor(itemEl));
                setBgColor(readBgColor(itemEl));
                setPickerIdx(idx);
            }
        },
        [pickerIdx],
    );

    // 아이콘 교체 — .ac-icon-wrap 내부 SVG 교체
    const applyIcon = useCallback((itemEl: HTMLElement, key: string) => {
        const wrap = itemEl.querySelector<HTMLElement>('.ac-icon-wrap');
        if (wrap) wrap.innerHTML = buildIconHtml(key);
        setPickerIdx(null);
        setTick((n) => n + 1);
    }, []);

    // 아이콘 색상 변경 — .ac-icon-wrap의 color CSS
    const applyIconColor = useCallback((itemEl: HTMLElement, color: string) => {
        const wrap = itemEl.querySelector<HTMLElement>('.ac-icon-wrap');
        if (wrap) wrap.style.color = color;
        setIconColor(color);
        setTick((n) => n + 1);
    }, []);

    // 배경 색상 변경 — .ac-icon-wrap의 background CSS
    const applyBgColor = useCallback((itemEl: HTMLElement, color: string) => {
        const wrap = itemEl.querySelector<HTMLElement>('.ac-icon-wrap');
        if (wrap) wrap.style.background = color;
        setBgColor(color);
        setTick((n) => n + 1);
    }, []);

    // 이미지 업로드
    const uploadImage = useCallback((itemEl: HTMLElement) => {
        try {
            openCmsFilesPicker((url) => {
                const wrap = itemEl.querySelector<HTMLElement>('.ac-icon-wrap');
                if (wrap) {
                    wrap.innerHTML = `<img src="${url}" alt="" style="width:22px;height:22px;object-fit:contain;" />`;
                }
                setPickerIdx(null);
                setTick((n) => n + 1);
            });
        } catch (err: unknown) {
            console.error('cms/files 이미지 선택 실패:', err);
        }
    }, []);

    const items = Array.from(blockEl.querySelectorAll<HTMLElement>('.ac-item'));
    void tick;

    return (
        <div
            data-ac-icon-editor
            style={{
                position: 'fixed',
                left: pos.x,
                top: pos.y,
                width: 260,
                zIndex: 99999,
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: 12,
                boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                fontFamily: "-apple-system,BlinkMacSystemFont,'Malgun Gothic','Apple SD Gothic Neo',sans-serif",
                fontSize: 13,
            }}
        >
            {/* ── 드래그 헤더 ── */}
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
                <span style={{ fontWeight: 700, color: '#111827' }}>아이콘 편집</span>
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

            {/* ── 항목 목록 ── */}
            <div style={{ padding: 12, maxHeight: 440, overflowY: 'auto' }}>
                {items.length === 0 && (
                    <p style={{ color: '#9ca3af', textAlign: 'center', margin: '16px 0' }}>항목 없음</p>
                )}
                {items.map((item, idx) => {
                    const wrap = item.querySelector<HTMLElement>('.ac-icon-wrap');
                    const iconHtml = wrap?.innerHTML ?? '';
                    const hasSvg = iconHtml.includes('<svg');
                    const isOpen = pickerIdx === idx;

                    return (
                        <div key={idx} style={{ marginBottom: 6 }}>
                            {/* 항목 행 */}
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 8,
                                    padding: '8px 10px',
                                    background: '#f9fafb',
                                    border: `1px solid ${isOpen ? '#0046A4' : '#e5e7eb'}`,
                                    borderRadius: 8,
                                }}
                            >
                                {/* 아이콘 미리보기 — 실제 배경·색상 반영 */}
                                <div
                                    style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: 10,
                                        background: wrap?.style.background || '#E8F0FC',
                                        color: wrap?.style.color || '#0046A4',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        flexShrink: 0,
                                    }}
                                    dangerouslySetInnerHTML={{ __html: iconHtml }}
                                />
                                <button
                                    onClick={() => openPicker(idx, item)}
                                    style={{
                                        marginLeft: 'auto',
                                        padding: '4px 10px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: 6,
                                        background: isOpen ? '#0046A4' : '#fff',
                                        color: isOpen ? '#fff' : '#374151',
                                        cursor: 'pointer',
                                        fontSize: 12,
                                        fontWeight: 600,
                                        flexShrink: 0,
                                    }}
                                >
                                    변경
                                </button>
                            </div>

                            {/* 아이콘 피커 */}
                            {isOpen && (
                                <div
                                    style={{
                                        marginTop: 4,
                                        padding: 10,
                                        background: '#fff',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: 8,
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                    }}
                                >
                                    {/* SVG 아이콘 그리드 */}
                                    <div
                                        style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(4, 1fr)',
                                            gap: 4,
                                            marginBottom: 10,
                                        }}
                                    >
                                        {Object.entries(AC_ICONS).map(([key, path]) => (
                                            <button
                                                key={key}
                                                title={AC_ICON_LABELS[key]}
                                                onClick={() => applyIcon(item, key)}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    padding: '6px',
                                                    border: '1.5px solid transparent',
                                                    borderRadius: 8,
                                                    background: '#f9fafb',
                                                    cursor: 'pointer',
                                                    color: iconColor,
                                                }}
                                                onMouseEnter={(e) => {
                                                    (e.currentTarget as HTMLElement).style.borderColor = '#0046A4';
                                                    (e.currentTarget as HTMLElement).style.background = '#ebf4ff';
                                                }}
                                                onMouseLeave={(e) => {
                                                    (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
                                                    (e.currentTarget as HTMLElement).style.background = '#f9fafb';
                                                }}
                                            >
                                                <span
                                                    style={{ display: 'flex', width: 20, height: 20 }}
                                                    dangerouslySetInnerHTML={{
                                                        __html: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="20" height="20">${path}</svg>`,
                                                    }}
                                                />
                                            </button>
                                        ))}
                                    </div>

                                    {/* 아이콘 색상 */}
                                    <div style={{ marginBottom: 8 }}>
                                        <div
                                            style={{
                                                fontSize: 10,
                                                color: '#6b7280',
                                                fontWeight: 600,
                                                marginBottom: 4,
                                            }}
                                        >
                                            아이콘 색상
                                        </div>
                                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                            {ICON_COLOR_PRESETS.map((color) => (
                                                <button
                                                    key={color}
                                                    title={color}
                                                    onClick={() => applyIconColor(item, color)}
                                                    style={{
                                                        width: 20,
                                                        height: 20,
                                                        borderRadius: 4,
                                                        background: color,
                                                        border:
                                                            iconColor === color
                                                                ? '2px solid #0046A4'
                                                                : '2px solid transparent',
                                                        cursor: 'pointer',
                                                        padding: 0,
                                                        outline: 'none',
                                                        flexShrink: 0,
                                                        opacity: hasSvg ? 1 : 0.35,
                                                    }}
                                                />
                                            ))}
                                            <label
                                                title="직접 선택"
                                                style={{
                                                    width: 20,
                                                    height: 20,
                                                    borderRadius: 4,
                                                    border: '2px solid #d1d5db',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    overflow: 'hidden',
                                                    flexShrink: 0,
                                                    opacity: hasSvg ? 1 : 0.35,
                                                    background:
                                                        'conic-gradient(red, yellow, lime, cyan, blue, magenta, red)',
                                                }}
                                            >
                                                <input
                                                    type="color"
                                                    value={iconColor}
                                                    disabled={!hasSvg}
                                                    onChange={(e) => applyIconColor(item, e.target.value)}
                                                    style={{
                                                        opacity: 0,
                                                        width: 1,
                                                        height: 1,
                                                        padding: 0,
                                                        border: 'none',
                                                    }}
                                                />
                                            </label>
                                        </div>
                                        {!hasSvg && (
                                            <p style={{ fontSize: 10, color: '#9ca3af', margin: '2px 0 0' }}>
                                                이미지는 색상 변경 불가
                                            </p>
                                        )}
                                    </div>

                                    {/* 배경 색상 */}
                                    <div style={{ marginBottom: 10 }}>
                                        <div
                                            style={{
                                                fontSize: 10,
                                                color: '#6b7280',
                                                fontWeight: 600,
                                                marginBottom: 4,
                                            }}
                                        >
                                            배경 색상
                                        </div>
                                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                            {BG_COLOR_PRESETS.map((color) => (
                                                <button
                                                    key={color}
                                                    title={color}
                                                    onClick={() => applyBgColor(item, color)}
                                                    style={{
                                                        width: 20,
                                                        height: 20,
                                                        borderRadius: 4,
                                                        background: color,
                                                        border:
                                                            bgColor === color
                                                                ? '2px solid #0046A4'
                                                                : '2px solid #d1d5db',
                                                        cursor: 'pointer',
                                                        padding: 0,
                                                        outline: 'none',
                                                        flexShrink: 0,
                                                    }}
                                                />
                                            ))}
                                            <label
                                                title="직접 선택"
                                                style={{
                                                    width: 20,
                                                    height: 20,
                                                    borderRadius: 4,
                                                    border: '2px solid #d1d5db',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    overflow: 'hidden',
                                                    flexShrink: 0,
                                                    background:
                                                        'conic-gradient(red, yellow, lime, cyan, blue, magenta, red)',
                                                }}
                                            >
                                                <input
                                                    type="color"
                                                    value={bgColor}
                                                    onChange={(e) => applyBgColor(item, e.target.value)}
                                                    style={{
                                                        opacity: 0,
                                                        width: 1,
                                                        height: 1,
                                                        padding: 0,
                                                        border: 'none',
                                                    }}
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    {/* 이미지 업로드 */}
                                    <button
                                        onClick={() => uploadImage(item)}
                                        style={{
                                            width: '100%',
                                            padding: 7,
                                            border: '1.5px dashed #d1d5db',
                                            borderRadius: 8,
                                            background: '#fff',
                                            color: '#374151',
                                            cursor: 'pointer',
                                            fontSize: 12,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: 6,
                                        }}
                                        onMouseEnter={(e) => {
                                            (e.currentTarget as HTMLElement).style.borderColor = '#0046A4';
                                            (e.currentTarget as HTMLElement).style.color = '#0046A4';
                                        }}
                                        onMouseLeave={(e) => {
                                            (e.currentTarget as HTMLElement).style.borderColor = '#d1d5db';
                                            (e.currentTarget as HTMLElement).style.color = '#374151';
                                        }}
                                    >
                                        <svg
                                            width="13"
                                            height="13"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        >
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                            <polyline points="17 8 12 3 7 8" />
                                            <line x1="12" y1="3" x2="12" y2="15" />
                                        </svg>
                                        이미지 업로드
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
