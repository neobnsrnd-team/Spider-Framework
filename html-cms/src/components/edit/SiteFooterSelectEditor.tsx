// src/components/edit/SiteFooterSelectEditor.tsx
// site-footer 블록의 계열사 바로가기 / 패밀리사이트 select 옵션을 편집하는 패널
// blockEl: HTMLElement — 대상 site-footer 루트 요소 (DOM 직접 조작)

'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

interface Props {
    blockEl: HTMLElement;
    onClose: () => void;
}

interface SelectState {
    label: string; // 첫 번째 option (드롭다운 제목)
    options: string[]; // 이하 실제 항목
    labelIdx: number; // SECTION_LABELS 인덱스 — data-label-idx 속성으로 DOM과 동기
}

export default function SiteFooterSelectEditor({ blockEl, onClose }: Props) {
    const selects = Array.from(blockEl.querySelectorAll<HTMLSelectElement>('select'));

    // 드래그
    const [pos, setPos] = useState(() => ({
        x: Math.max(8, window.innerWidth / 2 - 150),
        y: 80,
    }));
    const dragging = useRef(false);
    const dragStart = useRef({ mx: 0, my: 0, px: 0, py: 0 });

    const onHeaderMouseDown = useCallback(
        (e: React.MouseEvent) => {
            if ((e.target as HTMLElement).closest('button,input')) return;
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

    // select DOM → state 초기화
    // labelIdx: data-label-idx 속성으로 읽어 섹션 라벨을 DOM 기반으로 유지
    // (첫 드롭다운이 삭제·저장된 뒤 재열 시 순서 어긋남 방지)
    const [data, setData] = useState<SelectState[]>(() =>
        selects.map((sel, i) => ({
            label: sel.options[0]?.text ?? '',
            options: Array.from(sel.options)
                .slice(1)
                .map((o) => o.text),
            labelIdx: parseInt(sel.getAttribute('data-label-idx') ?? String(i), 10),
        })),
    );

    // 삭제 예정인 기존 select 인덱스 집합
    const [deletedIndices, setDeletedIndices] = useState<Set<number>>(new Set());

    // 새로 추가된 드롭다운 목록 (DOM에 없는 상태 — 적용 시 생성)
    const [newSelects, setNewSelects] = useState<SelectState[]>([]);

    // 기존 select가 하나도 없고 새로 추가된 것도 없으면 패널 비표시
    if (selects.length === 0 && newSelects.length === 0) return null;

    // ── 기존 select 조작 ────────────────────────────────────────────────

    // 라벨(첫 option) 변경
    const setLabel = (si: number, value: string) => {
        setData((prev) => prev.map((s, i) => (i === si ? { ...s, label: value } : s)));
    };

    // 항목 텍스트 변경
    const setOption = (si: number, oi: number, value: string) => {
        setData((prev) =>
            prev.map((s, i) => (i === si ? { ...s, options: s.options.map((o, j) => (j === oi ? value : o)) } : s)),
        );
    };

    // 항목 추가
    const addOption = (si: number) => {
        setData((prev) => prev.map((s, i) => (i === si ? { ...s, options: [...s.options, ''] } : s)));
    };

    // 항목 삭제
    const removeOption = (si: number, oi: number) => {
        setData((prev) => prev.map((s, i) => (i === si ? { ...s, options: s.options.filter((_, j) => j !== oi) } : s)));
    };

    // 드롭다운 섹션 전체 삭제 예약
    const removeSelect = (si: number) => {
        setDeletedIndices((prev) => new Set([...prev, si]));
    };

    // ── 새 select 조작 ──────────────────────────────────────────────────

    // 새 드롭다운 섹션 추가
    const addSelect = () => {
        // labelIdx: SECTION_LABELS 범위 밖 값으로 설정 → "새 드롭다운 N" 표시
        setNewSelects((prev) => [...prev, { label: `새 드롭다운 ${prev.length + 1}`, options: [], labelIdx: -1 }]);
    };

    // 새 드롭다운 라벨 변경
    const setNewLabel = (ni: number, value: string) => {
        setNewSelects((prev) => prev.map((s, i) => (i === ni ? { ...s, label: value } : s)));
    };

    // 새 드롭다운 항목 텍스트 변경
    const setNewOption = (ni: number, oi: number, value: string) => {
        setNewSelects((prev) =>
            prev.map((s, i) => (i === ni ? { ...s, options: s.options.map((o, j) => (j === oi ? value : o)) } : s)),
        );
    };

    // 새 드롭다운 항목 추가
    const addNewOption = (ni: number) => {
        setNewSelects((prev) => prev.map((s, i) => (i === ni ? { ...s, options: [...s.options, ''] } : s)));
    };

    // 새 드롭다운 항목 삭제
    const removeNewOption = (ni: number, oi: number) => {
        setNewSelects((prev) =>
            prev.map((s, i) => (i === ni ? { ...s, options: s.options.filter((_, j) => j !== oi) } : s)),
        );
    };

    // 새 드롭다운 섹션 전체 삭제
    const removeNewSelect = (ni: number) => {
        setNewSelects((prev) => prev.filter((_, i) => i !== ni));
    };

    // ── DOM 반영 후 닫기 ────────────────────────────────────────────────

    const handleApply = () => {
        const makeOpt = (text: string) => {
            const o = document.createElement('option');
            o.text = text;
            return o;
        };

        // 기존 select — 삭제 예약된 것은 제거, 나머지는 옵션 갱신
        selects.forEach((sel, si) => {
            if (deletedIndices.has(si)) {
                sel.remove();
                return;
            }
            while (sel.options.length > 0) sel.remove(0);
            sel.add(makeOpt(data[si].label));
            data[si].options.forEach((t) => sel.add(makeOpt(t)));
        });

        // 새 select — DOM 생성 후 기존 select 컨테이너에 추가
        if (newSelects.length > 0) {
            // 기존 select의 부모 컨테이너 (삭제되지 않은 첫 번째 또는 전체 삭제 시 fallback)
            const container =
                selects.find((_, i) => !deletedIndices.has(i))?.parentElement ?? selects[0]?.parentElement;
            if (container) {
                // 기존 select의 style을 복사하여 일관된 디자인 유지
                const refStyle = selects[0]?.getAttribute('style') ?? '';
                newSelects.forEach((ns) => {
                    const sel = document.createElement('select');
                    if (refStyle) sel.setAttribute('style', refStyle);
                    sel.add(makeOpt(ns.label));
                    ns.options.forEach((t) => sel.add(makeOpt(t)));
                    container.appendChild(sel);
                });
            }
        }

        // DOM 조작 후 ContentBuilder 상태 동기화
        (window as Window & { builderReinit?: () => void }).builderReinit?.();
        onClose();
    };

    const SECTION_LABELS = ['계열사 바로가기', '패밀리사이트'];

    // 삭제되지 않은 기존 섹션만 렌더링
    const visibleIndices = data.map((_, i) => i).filter((i) => !deletedIndices.has(i));

    return (
        <div
            data-sf-select-editor
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
            {/* 헤더 */}
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
                <span style={{ fontWeight: 700, color: '#111827' }}>드롭다운 편집</span>
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

            {/* 섹션 목록 */}
            <div style={{ padding: 12, maxHeight: 420, overflowY: 'auto' }}>
                {visibleIndices.length === 0 && (
                    <div
                        style={{
                            padding: '16px 0',
                            textAlign: 'center',
                            fontSize: 12,
                            color: '#9ca3af',
                        }}
                    >
                        드롭다운이 모두 삭제됩니다.
                    </div>
                )}
                {visibleIndices.map((si, renderIdx) => (
                    <div key={si} style={{ marginBottom: renderIdx < visibleIndices.length - 1 ? 16 : 0 }}>
                        {/* 섹션 제목 + 섹션 삭제 버튼 */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: 6,
                            }}
                        >
                            <span style={{ fontSize: 11, color: '#6b7280', fontWeight: 600 }}>
                                {SECTION_LABELS[data[si].labelIdx] ?? `드롭다운 ${si + 1}`}
                            </span>
                            <button
                                onClick={() => removeSelect(si)}
                                title="드롭다운 섹션 삭제"
                                style={{
                                    width: 22,
                                    height: 22,
                                    border: '1px solid #e5e7eb',
                                    borderRadius: 5,
                                    background: '#fff',
                                    color: '#9ca3af',
                                    cursor: 'pointer',
                                    fontSize: 12,
                                    padding: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                }}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLElement).style.borderColor = '#ef4444';
                                    (e.currentTarget as HTMLElement).style.color = '#ef4444';
                                    (e.currentTarget as HTMLElement).style.background = '#fef2f2';
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLElement).style.borderColor = '#e5e7eb';
                                    (e.currentTarget as HTMLElement).style.color = '#9ca3af';
                                    (e.currentTarget as HTMLElement).style.background = '#fff';
                                }}
                            >
                                <svg
                                    width="11"
                                    height="11"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polyline points="3 6 5 6 21 6" />
                                    <path d="M19 6l-1 14H6L5 6" />
                                    <path d="M10 11v6" />
                                    <path d="M14 11v6" />
                                    <path d="M9 6V4h6v2" />
                                </svg>
                            </button>
                        </div>

                        {/* 라벨 (첫 번째 option) */}
                        <div style={{ marginBottom: 4 }}>
                            <input
                                value={data[si].label}
                                onChange={(e) => setLabel(si, e.target.value)}
                                placeholder="드롭다운 제목"
                                style={{
                                    width: '100%',
                                    padding: '7px 10px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: 6,
                                    fontSize: 12,
                                    color: '#374151',
                                    background: '#f9fafb',
                                    boxSizing: 'border-box',
                                    fontFamily: 'inherit',
                                    outline: 'none',
                                    fontWeight: 600,
                                }}
                            />
                        </div>

                        {/* 옵션 목록 */}
                        {data[si].options.map((opt, oi) => (
                            <div key={oi} style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                                <input
                                    value={opt}
                                    onChange={(e) => setOption(si, oi, e.target.value)}
                                    placeholder={`항목 ${oi + 1}`}
                                    style={{
                                        flex: 1,
                                        padding: '7px 10px',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: 6,
                                        fontSize: 12,
                                        color: '#111827',
                                        background: '#fff',
                                        boxSizing: 'border-box',
                                        fontFamily: 'inherit',
                                        outline: 'none',
                                    }}
                                />
                                <button
                                    onClick={() => removeOption(si, oi)}
                                    title="삭제"
                                    style={{
                                        width: 28,
                                        height: 28,
                                        flexShrink: 0,
                                        border: '1px solid #e5e7eb',
                                        borderRadius: 6,
                                        background: '#fff',
                                        color: '#9ca3af',
                                        cursor: 'pointer',
                                        fontSize: 16,
                                        padding: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        alignSelf: 'center',
                                    }}
                                    onMouseEnter={(e) => {
                                        (e.currentTarget as HTMLElement).style.borderColor = '#ef4444';
                                        (e.currentTarget as HTMLElement).style.color = '#ef4444';
                                    }}
                                    onMouseLeave={(e) => {
                                        (e.currentTarget as HTMLElement).style.borderColor = '#e5e7eb';
                                        (e.currentTarget as HTMLElement).style.color = '#9ca3af';
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        ))}

                        {/* 항목 추가 */}
                        <button
                            onClick={() => addOption(si)}
                            style={{
                                width: '100%',
                                padding: '6px',
                                border: '1.5px dashed #d1d5db',
                                borderRadius: 6,
                                background: '#fff',
                                color: '#6b7280',
                                cursor: 'pointer',
                                fontSize: 12,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 4,
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLElement).style.borderColor = '#0046A4';
                                (e.currentTarget as HTMLElement).style.color = '#0046A4';
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.borderColor = '#d1d5db';
                                (e.currentTarget as HTMLElement).style.color = '#6b7280';
                            }}
                        >
                            <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                            >
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            항목 추가
                        </button>
                    </div>
                ))}

                {/* 새로 추가된 드롭다운 섹션 */}
                {newSelects.map((ns, ni) => (
                    <div
                        key={`new-${ni}`}
                        style={{
                            marginTop: visibleIndices.length > 0 || ni > 0 ? 16 : 0,
                            borderLeft: '2px solid #bfdbfe',
                            paddingLeft: 8,
                        }}
                    >
                        {/* 섹션 제목 + 삭제 버튼 */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: 6,
                            }}
                        >
                            <span style={{ fontSize: 11, color: '#3b82f6', fontWeight: 600 }}>
                                새 드롭다운 {ni + 1}
                            </span>
                            <button
                                onClick={() => removeNewSelect(ni)}
                                title="드롭다운 섹션 삭제"
                                style={{
                                    width: 22,
                                    height: 22,
                                    border: '1px solid #e5e7eb',
                                    borderRadius: 5,
                                    background: '#fff',
                                    color: '#9ca3af',
                                    cursor: 'pointer',
                                    fontSize: 12,
                                    padding: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                }}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLElement).style.borderColor = '#ef4444';
                                    (e.currentTarget as HTMLElement).style.color = '#ef4444';
                                    (e.currentTarget as HTMLElement).style.background = '#fef2f2';
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLElement).style.borderColor = '#e5e7eb';
                                    (e.currentTarget as HTMLElement).style.color = '#9ca3af';
                                    (e.currentTarget as HTMLElement).style.background = '#fff';
                                }}
                            >
                                <svg
                                    width="11"
                                    height="11"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polyline points="3 6 5 6 21 6" />
                                    <path d="M19 6l-1 14H6L5 6" />
                                    <path d="M10 11v6" />
                                    <path d="M14 11v6" />
                                    <path d="M9 6V4h6v2" />
                                </svg>
                            </button>
                        </div>

                        {/* 라벨 */}
                        <div style={{ marginBottom: 4 }}>
                            <input
                                value={ns.label}
                                onChange={(e) => setNewLabel(ni, e.target.value)}
                                placeholder="드롭다운 제목"
                                style={{
                                    width: '100%',
                                    padding: '7px 10px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: 6,
                                    fontSize: 12,
                                    color: '#374151',
                                    background: '#f9fafb',
                                    boxSizing: 'border-box',
                                    fontFamily: 'inherit',
                                    outline: 'none',
                                    fontWeight: 600,
                                }}
                            />
                        </div>

                        {/* 옵션 목록 */}
                        {ns.options.map((opt, oi) => (
                            <div key={oi} style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                                <input
                                    value={opt}
                                    onChange={(e) => setNewOption(ni, oi, e.target.value)}
                                    placeholder={`항목 ${oi + 1}`}
                                    style={{
                                        flex: 1,
                                        padding: '7px 10px',
                                        border: '1px solid #e5e7eb',
                                        borderRadius: 6,
                                        fontSize: 12,
                                        color: '#111827',
                                        background: '#fff',
                                        boxSizing: 'border-box',
                                        fontFamily: 'inherit',
                                        outline: 'none',
                                    }}
                                />
                                <button
                                    onClick={() => removeNewOption(ni, oi)}
                                    title="삭제"
                                    style={{
                                        width: 28,
                                        height: 28,
                                        flexShrink: 0,
                                        border: '1px solid #e5e7eb',
                                        borderRadius: 6,
                                        background: '#fff',
                                        color: '#9ca3af',
                                        cursor: 'pointer',
                                        fontSize: 16,
                                        padding: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        alignSelf: 'center',
                                    }}
                                    onMouseEnter={(e) => {
                                        (e.currentTarget as HTMLElement).style.borderColor = '#ef4444';
                                        (e.currentTarget as HTMLElement).style.color = '#ef4444';
                                    }}
                                    onMouseLeave={(e) => {
                                        (e.currentTarget as HTMLElement).style.borderColor = '#e5e7eb';
                                        (e.currentTarget as HTMLElement).style.color = '#9ca3af';
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        ))}

                        {/* 항목 추가 */}
                        <button
                            onClick={() => addNewOption(ni)}
                            style={{
                                width: '100%',
                                padding: '6px',
                                border: '1.5px dashed #d1d5db',
                                borderRadius: 6,
                                background: '#fff',
                                color: '#6b7280',
                                cursor: 'pointer',
                                fontSize: 12,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 4,
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLElement).style.borderColor = '#0046A4';
                                (e.currentTarget as HTMLElement).style.color = '#0046A4';
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.borderColor = '#d1d5db';
                                (e.currentTarget as HTMLElement).style.color = '#6b7280';
                            }}
                        >
                            <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                            >
                                <line x1="12" y1="5" x2="12" y2="19" />
                                <line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            항목 추가
                        </button>
                    </div>
                ))}

                {/* 드롭다운 섹션 추가 버튼 */}
                <button
                    onClick={addSelect}
                    style={{
                        width: '100%',
                        marginTop: 12,
                        padding: '7px',
                        border: '1.5px dashed #93c5fd',
                        borderRadius: 6,
                        background: '#eff6ff',
                        color: '#3b82f6',
                        cursor: 'pointer',
                        fontSize: 12,
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 4,
                    }}
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = '#3b82f6';
                        (e.currentTarget as HTMLElement).style.background = '#dbeafe';
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.borderColor = '#93c5fd';
                        (e.currentTarget as HTMLElement).style.background = '#eff6ff';
                    }}
                >
                    <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                    >
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    드롭다운 추가
                </button>
            </div>

            {/* 버튼 */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 6,
                    padding: '10px 14px 14px',
                    borderTop: '1px solid #f3f4f6',
                }}
            >
                <button
                    onClick={onClose}
                    style={{
                        padding: '6px 14px',
                        border: '1px solid #e5e7eb',
                        borderRadius: 6,
                        background: '#fff',
                        fontSize: 12,
                        color: '#374151',
                        cursor: 'pointer',
                        fontWeight: 600,
                    }}
                >
                    취소
                </button>
                <button
                    onClick={handleApply}
                    style={{
                        padding: '6px 16px',
                        border: 'none',
                        borderRadius: 6,
                        background: '#0046A4',
                        fontSize: 12,
                        color: '#fff',
                        cursor: 'pointer',
                        fontWeight: 600,
                    }}
                >
                    적용
                </button>
            </div>
        </div>
    );
}
