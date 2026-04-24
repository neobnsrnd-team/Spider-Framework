// src/components/edit/BranchLocatorEditor.tsx
// branch-locator 블록의 지도 URL + 지점 목록을 편집하는 드래그 가능 플로팅 패널
// blockEl: HTMLElement — 대상 branch-locator 루트 요소 (DOM 직접 조작)

'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

const PHONE_SVG =
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">` +
    `<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.61 4.9 2 2 0 0 1 3.6 2.71h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.09a16 16 0 0 0 6 6l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.28 18 2 2 0 0 1 22 16.92z"/>` +
    `</svg>`;

function buildNewItemHtml(type: 'branch' | 'atm'): string {
    const iconBg = type === 'atm' ? '#FF6600' : '#0046A4';
    const iconFs = type === 'atm' ? '10px' : '14px';
    const iconLbl = type === 'atm' ? 'ATM' : '영';
    return (
        `<div data-bl-item="${type}" data-bl-map-src="" style="display:flex;align-items:center;gap:12px;padding:12px 20px;border-bottom:1px solid #F3F4F6;min-height:64px;">` +
        `<div style="width:40px;height:40px;border-radius:12px;background:${iconBg};display:flex;align-items:center;justify-content:center;font-size:${iconFs};font-weight:800;letter-spacing:-0.5px;flex-shrink:0;color:#fff;">${iconLbl}</div>` +
        `<div style="flex:1;display:flex;flex-direction:column;gap:2px;min-width:0;">` +
        `<span data-bl-name style="font-size:14px;font-weight:600;color:#1A1A2E;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">새 지점명</span>` +
        `<span data-bl-addr style="font-size:12px;color:#6B7280;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">주소를 입력하세요</span>` +
        `<span data-bl-hours style="font-size:11px;color:#9CA3AF;">평일 09:00~16:00</span>` +
        `</div>` +
        `<a href="tel:1566-2566" style="width:44px;height:44px;border-radius:12px;background:#E8F0FC;color:#0046A4;display:flex;align-items:center;justify-content:center;text-decoration:none;flex-shrink:0;">${PHONE_SVG}</a>` +
        `</div>`
    );
}

interface Props {
    blockEl: HTMLElement;
    onClose: () => void;
}

export default function BranchLocatorEditor({ blockEl, onClose }: Props) {
    const [pos, setPos] = useState(() => ({
        x: Math.max(8, window.innerWidth / 2 - 150),
        y: 80,
    }));
    const [mapUrl, setMapUrl] = useState(() => {
        const src = blockEl.querySelector<HTMLIFrameElement>('[data-bl-map]')?.getAttribute('src') ?? '';
        return src === 'about:blank' ? '' : src;
    });
    const [tick, setTick] = useState(0);

    // embed URL 여부 검사 — Google Maps embed / Kakao 지도 embed 형식만 허용
    const isEmbedUrl = (url: string) => {
        if (!url.trim()) return true; // 빈 값은 경고 없음
        return (
            url.includes('google.com/maps/embed') ||
            url.includes('map.kakao.com/link/embed') ||
            url.includes('maps.google.com/maps?')
        );
    };
    const showUrlWarning = mapUrl.trim() !== '' && !isEmbedUrl(mapUrl);

    // 드래그
    const dragging = useRef(false);
    const dragStart = useRef({ mx: 0, my: 0, px: 0, py: 0 });

    const onHeaderMouseDown = useCallback(
        (e: React.MouseEvent) => {
            if ((e.target as HTMLElement).closest('button, input, select')) return;
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

    // 지도 URL 적용
    const applyMapUrl = useCallback(() => {
        const iframe = blockEl.querySelector<HTMLIFrameElement>('[data-bl-map]');
        const placeholder = blockEl.querySelector<HTMLElement>('[data-bl-map-ph]');
        const trimmed = mapUrl.trim();
        if (iframe) iframe.setAttribute('src', trimmed || 'about:blank');
        if (placeholder) placeholder.style.display = trimmed ? 'none' : 'flex';
    }, [blockEl, mapUrl]);

    // 지점 아이템 DOM 목록 (tick으로 리렌더 트리거)
    const items = Array.from(blockEl.querySelectorAll<HTMLElement>('[data-bl-item]'));
    void tick;

    // 지점 추가
    const addItem = useCallback(
        (type: 'branch' | 'atm') => {
            const list = blockEl.querySelector('[data-bl-list]');
            if (!list) return;
            const tmp = document.createElement('div');
            tmp.innerHTML = buildNewItemHtml(type);
            const newItem = tmp.firstElementChild as HTMLElement;
            if (newItem) list.appendChild(newItem);
            setTick((n) => n + 1);
        },
        [blockEl],
    );

    // 지점 삭제
    const deleteItem = useCallback((itemEl: HTMLElement) => {
        itemEl.remove();
        setTick((n) => n + 1);
    }, []);

    const panelStyle: React.CSSProperties = {
        position: 'fixed',
        left: pos.x,
        top: pos.y,
        width: 300,
        zIndex: 99999,
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        fontFamily: "-apple-system,BlinkMacSystemFont,'Malgun Gothic','Apple SD Gothic Neo',sans-serif",
        fontSize: 13,
    };

    return (
        <div data-bl-editor style={panelStyle}>
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
                <span style={{ fontWeight: 700, color: '#111827' }}>지점 찾기 편집</span>
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

            <div style={{ maxHeight: 520, overflowY: 'auto' }}>
                {/* ── 지도 URL ── */}
                <div style={{ padding: '12px 14px', borderBottom: '1px solid #f3f4f6' }}>
                    <label
                        style={{ display: 'block', fontSize: 11, color: '#6b7280', fontWeight: 600, marginBottom: 6 }}
                    >
                        지도 embed URL
                    </label>
                    <div style={{ display: 'flex', gap: 6 }}>
                        <input
                            type="text"
                            value={mapUrl}
                            onChange={(e) => setMapUrl(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') applyMapUrl();
                            }}
                            placeholder="Google Maps / Kakao 지도 embed URL"
                            style={{
                                flex: 1,
                                padding: '6px 8px',
                                border: `1px solid ${showUrlWarning ? '#f87171' : '#e5e7eb'}`,
                                borderRadius: 6,
                                fontSize: 12,
                                color: '#111827',
                                outline: 'none',
                                background: showUrlWarning ? '#fff5f5' : '#f9fafb',
                            }}
                        />
                        <button
                            onClick={applyMapUrl}
                            style={{
                                padding: '6px 10px',
                                border: 'none',
                                borderRadius: 6,
                                background: '#0046A4',
                                color: '#fff',
                                fontSize: 12,
                                fontWeight: 600,
                                cursor: 'pointer',
                                flexShrink: 0,
                            }}
                        >
                            적용
                        </button>
                    </div>
                    {showUrlWarning ? (
                        <p style={{ fontSize: 10, color: '#ef4444', margin: '4px 0 0', lineHeight: 1.5 }}>
                            ⚠️ 일반 공유 링크는 iframe에서 차단됩니다. Google Maps: 공유 → <strong>지도 퍼가기</strong>{' '}
                            탭의 embed URL을 사용하세요.
                        </p>
                    ) : (
                        <p style={{ fontSize: 10, color: '#9ca3af', margin: '4px 0 0', lineHeight: 1.5 }}>
                            Google Maps: 공유 → 지도 퍼가기 → embed URL 복사
                        </p>
                    )}
                </div>

                {/* ── 지점 목록 ── */}
                <div style={{ padding: '10px 14px 4px', display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ fontSize: 11, color: '#6b7280', fontWeight: 600 }}>지점 목록</span>
                    <span style={{ fontSize: 10, color: '#9ca3af' }}>
                        지점명·주소·영업시간·전화번호는 블록에서 직접 클릭해 수정하세요
                    </span>
                </div>

                {items.length === 0 && (
                    <p style={{ color: '#9ca3af', textAlign: 'center', margin: '12px 0', fontSize: 12 }}>지점 없음</p>
                )}

                {items.map((item, idx) => {
                    const type = (item.getAttribute('data-bl-item') ?? 'branch') as 'branch' | 'atm';
                    const name = item.querySelector('[data-bl-name]')?.textContent ?? '';
                    const mapSrc = item.getAttribute('data-bl-map-src') ?? '';
                    return (
                        <ItemRow
                            key={`${type}-${name}-${idx}`}
                            type={type}
                            name={name}
                            mapSrc={mapSrc}
                            onMapSrcChange={(url) => item.setAttribute('data-bl-map-src', url)}
                            onDelete={() => deleteItem(item)}
                        />
                    );
                })}

                {/* ── 지점 추가 버튼 ── */}
                <div style={{ padding: '8px 14px 14px', display: 'flex', gap: 6 }}>
                    <button onClick={() => addItem('branch')} style={addBtnStyle('#0046A4')}>
                        + 영업점
                    </button>
                    <button onClick={() => addItem('atm')} style={addBtnStyle('#FF6600')}>
                        + ATM
                    </button>
                </div>
            </div>
        </div>
    );
}

function addBtnStyle(color: string): React.CSSProperties {
    return {
        flex: 1,
        padding: '7px 0',
        border: `1.5px dashed ${color}`,
        borderRadius: 8,
        background: '#fff',
        color,
        fontSize: 12,
        fontWeight: 600,
        cursor: 'pointer',
    };
}

// ── 개별 지점 행 ────────────────────────────────────────────────────────────
// 추가/삭제 + 개별 지도 embed URL 입력 담당
// 지점명·주소·영업시간·전화번호는 캔버스 인라인 직접 편집
function ItemRow({
    type,
    name,
    mapSrc,
    onMapSrcChange,
    onDelete,
}: {
    type: 'branch' | 'atm';
    name: string;
    mapSrc: string;
    onMapSrcChange: (url: string) => void;
    onDelete: () => void;
}) {
    const [localSrc, setLocalSrc] = useState(mapSrc);

    // mapSrc prop이 외부(DOM)에서 변경될 때 로컬 상태 동기화 (인덱스 이동으로 인한 stale state 방지)
    useEffect(() => {
        setLocalSrc(mapSrc);
    }, [mapSrc]);

    const isValidSrc =
        !localSrc.trim() ||
        localSrc.startsWith('https://www.google.com/maps/embed') ||
        localSrc.startsWith('https://map.kakao.com/link/embed') ||
        localSrc.startsWith('https://maps.google.com/maps?');

    return (
        <div
            style={{
                margin: '0 14px 6px',
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                background: '#f9fafb',
                overflow: 'hidden',
            }}
        >
            {/* 상단 행: 타입 배지 + 지점명 + 삭제 */}
            <div style={{ display: 'flex', alignItems: 'center', padding: '8px 10px', gap: 8 }}>
                <div
                    style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        background: type === 'atm' ? '#FF6600' : '#0046A4',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: type === 'atm' ? 9 : 12,
                        fontWeight: 800,
                        flexShrink: 0,
                    }}
                >
                    {type === 'atm' ? 'ATM' : '영'}
                </div>
                <span
                    style={{
                        flex: 1,
                        fontSize: 12,
                        fontWeight: 500,
                        color: '#374151',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                    }}
                >
                    {name || '(이름 없음)'}
                </span>
                <button
                    onClick={onDelete}
                    style={{
                        width: 28,
                        height: 28,
                        border: 'none',
                        background: 'transparent',
                        color: '#dc2626',
                        cursor: 'pointer',
                        flexShrink: 0,
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6" />
                        <path d="M14 11v6" />
                        <path d="M9 6V4h6v2" />
                    </svg>
                </button>
            </div>
            {/* 지도 embed URL 입력 */}
            <div style={{ padding: '0 10px 8px' }}>
                <input
                    type="text"
                    value={localSrc}
                    onChange={(e) => {
                        setLocalSrc(e.target.value);
                        onMapSrcChange(e.target.value);
                    }}
                    placeholder="지도 embed URL (클릭 시 표시)"
                    style={{
                        width: '100%',
                        padding: '4px 7px',
                        border: `1px solid ${isValidSrc ? '#e5e7eb' : '#fca5a5'}`,
                        borderRadius: 5,
                        fontSize: 10,
                        color: '#374151',
                        background: isValidSrc ? '#fff' : '#fef2f2',
                        outline: 'none',
                        boxSizing: 'border-box',
                    }}
                />
                {!isValidSrc && (
                    <p style={{ fontSize: 9, color: '#ef4444', margin: '2px 0 0', lineHeight: 1.4 }}>
                        Google Maps: 공유 → 지도 퍼가기 → embed URL
                    </p>
                )}
            </div>
        </div>
    );
}
