// src/components/edit/InfoAccordionEditor.tsx
// info-accordion block item title editor and reusable table editor entrypoint

'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import TableEditorModal from '@/components/edit/shared/TableEditorModal';
import {
    buildTableHtml,
    createDefaultTableModel,
    hydrateTableModelSizing,
    parseFirstTableFromHtml,
    replaceFirstTableInHtml,
    type TableModel,
} from '@/components/edit/shared/table-html';

interface AccordionItem {
    title: string;
    content: string;
}

interface Props {
    blockEl: HTMLElement;
    onClose: () => void;
}

const FONT_FAMILY = "-apple-system,BlinkMacSystemFont,'Malgun Gothic','Apple SD Gothic Neo',sans-serif";

const CHEVRON_SVG = `<svg class="ia-chevron" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round" width="16" height="16"
     style="flex-shrink:0;transition:transform 0.25s ease;">
    <path d="m6 9 6 6 6-6"/>
</svg>`;

const ACCORDION_SCRIPT =
    `<script>` +
    `(function(){` +
    `var root=document.currentScript&&document.currentScript.closest('[data-spw-block]');` +
    `if(!root||root.getAttribute('data-accordion-inited')==='1')return;` +
    `root.setAttribute('data-accordion-inited','1');` +
    `root.querySelectorAll('.ia-header').forEach(function(btn){` +
    `btn.addEventListener('click',function(){` +
    `var item=btn.closest('.ia-item');` +
    `var body=item.querySelector('.ia-body');` +
    `var chev=btn.querySelector('.ia-chevron');` +
    `var open=item.getAttribute('data-open')==='1';` +
    `if(open){item.setAttribute('data-open','0');body.style.maxHeight='0';chev.style.transform='rotate(0deg)';}` +
    `else{item.setAttribute('data-open','1');body.style.maxHeight='9999px';chev.style.transform='rotate(180deg)';}` +
    `});` +
    `});` +
    `var firstHeader=root.querySelector('.ia-header');` +
    `if(firstHeader){firstHeader.click();}` +
    `})();` +
    `</script>`;

function buildItemsHtml(items: AccordionItem[]): string {
    return items
        .map(
            (item) =>
                `<div class="ia-item" data-open="0" style="border-bottom:1px solid #E5E7EB;">` +
                `<button type="button" class="ia-header" style="width:100%;display:flex;justify-content:space-between;align-items:center;padding:16px 20px;background:none;border:none;cursor:pointer;text-align:left;-webkit-tap-highlight-color:transparent;">` +
                `<span style="font-size:15px;font-weight:600;color:#1A1A2E;line-height:1.3;">${item.title}</span>` +
                CHEVRON_SVG +
                `</button>` +
                `<div class="ia-body" style="max-height:0;overflow:hidden;transition:max-height 0.3s ease;">` +
                `<div style="padding:4px 20px 20px;font-size:13px;color:#374151;line-height:1.7;">` +
                item.content +
                `</div>` +
                `</div>` +
                `</div>`,
        )
        .join('');
}

function applyToBlock(blockEl: HTMLElement, items: AccordionItem[]) {
    blockEl.setAttribute('data-accordion-items', JSON.stringify(items));
    blockEl.querySelectorAll('.ia-item, script').forEach((el) => el.remove());
    blockEl.insertAdjacentHTML('beforeend', buildItemsHtml(items) + ACCORDION_SCRIPT);
    blockEl.removeAttribute('data-accordion-inited');
}

function parseItems(blockEl: HTMLElement): AccordionItem[] {
    const domItems = Array.from(blockEl.querySelectorAll('.ia-item')).map((item) => ({
        title: item.querySelector('span')?.textContent?.trim() ?? '',
        content: item.querySelector('.ia-body div')?.innerHTML ?? '',
    }));

    if (domItems.length > 0) {
        return domItems;
    }

    const raw = blockEl.getAttribute('data-accordion-items');
    if (raw) {
        try {
            return JSON.parse(raw) as AccordionItem[];
        } catch {
            // fall through to legacy DOM parsing
        }
    }
    return [];
}

function hasTable(content: string): boolean {
    return /<table[\s>]/i.test(content);
}

const S = {
    overlay: {
        position: 'fixed' as const,
        inset: 0,
        zIndex: 99998,
        background: 'transparent',
    },
    panel: {
        position: 'fixed' as const,
        width: 520,
        maxHeight: '80vh',
        display: 'flex',
        flexDirection: 'column' as const,
        zIndex: 99999,
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        fontFamily: FONT_FAMILY,
        fontSize: 13,
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 14px',
        borderBottom: '1px solid #f3f4f6',
        borderRadius: '12px 12px 0 0',
        background: '#fafafa',
        flexShrink: 0,
    },
    body: {
        overflowY: 'auto' as const,
        flex: 1,
        padding: '12px 14px',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: 10,
    },
    footer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 6,
        padding: '10px 14px 14px',
        borderTop: '1px solid #f3f4f6',
        flexShrink: 0,
    },
    itemCard: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: 8,
        padding: '10px',
        border: '1px solid #e5e7eb',
        borderRadius: 10,
        background: '#fafafa',
    },
    itemRow: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
    },
    iconBtn: {
        width: 26,
        height: 26,
        border: '1px solid #e5e7eb',
        borderRadius: 5,
        background: '#fff',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        padding: 0,
    } as React.CSSProperties,
    deleteBtn: {
        width: 26,
        height: 26,
        border: '1px solid #fca5a5',
        borderRadius: 5,
        background: '#fff',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        padding: 0,
        color: '#ef4444',
    } as React.CSSProperties,
    input: {
        flex: 1,
        padding: '6px 10px',
        border: '1px solid #e5e7eb',
        borderRadius: 6,
        fontSize: 13,
        color: '#111827',
        background: '#fff',
        boxSizing: 'border-box' as const,
        fontFamily: FONT_FAMILY,
        outline: 'none',
        minWidth: 0,
    },
    helperRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 8,
    },
    helperText: {
        fontSize: 11,
        color: '#6b7280',
    },
    tableBtn: {
        border: '1px solid #c7d8f4',
        background: '#f0f4ff',
        color: '#0046A4',
        borderRadius: 7,
        padding: '6px 10px',
        fontSize: 12,
        fontWeight: 700,
        cursor: 'pointer',
    },
    addBtn: {
        width: '100%',
        padding: '8px',
        border: '1.5px dashed #c7d8f4',
        borderRadius: 8,
        background: '#f0f4ff',
        color: '#0046A4',
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    } as React.CSSProperties,
    cancelBtn: {
        padding: '6px 14px',
        border: '1px solid #e5e7eb',
        borderRadius: 6,
        background: '#fff',
        fontSize: 12,
        color: '#374151',
        cursor: 'pointer',
        fontWeight: 600,
    },
    applyBtn: {
        padding: '6px 16px',
        border: 'none',
        borderRadius: 6,
        background: '#0046A4',
        fontSize: 12,
        color: '#fff',
        cursor: 'pointer',
        fontWeight: 600,
    },
} as const;

export default function InfoAccordionEditor({ blockEl, onClose }: Props) {
    const [items, setItems] = useState<AccordionItem[]>(() => parseItems(blockEl));
    const [pos, setPos] = useState(() => {
        if (typeof window === 'undefined') {
            return { x: 8, y: 24 };
        }

        return {
            x: Math.max(8, window.innerWidth / 2 - 260),
            y: Math.max(24, window.innerHeight / 2 - 240),
        };
    });
    const [editingTableIndex, setEditingTableIndex] = useState<number | null>(null);
    const [tableModel, setTableModel] = useState<TableModel | null>(null);
    const dragging = useRef(false);
    const dragStart = useRef({ mx: 0, my: 0, px: 0, py: 0 });

    const handleHeaderMouseDown = useCallback(
        (e: React.MouseEvent) => {
            if ((e.target as HTMLElement).closest('button')) return;
            dragging.current = true;
            dragStart.current = { mx: e.clientX, my: e.clientY, px: pos.x, py: pos.y };
            e.preventDefault();
        },
        [pos],
    );

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!dragging.current) return;
            setPos({
                x: Math.max(8, dragStart.current.px + e.clientX - dragStart.current.mx),
                y: Math.max(8, dragStart.current.py + e.clientY - dragStart.current.my),
            });
        };

        const handleMouseUp = () => {
            dragging.current = false;
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    const handleTitleChange = (idx: number, value: string) => {
        setItems((prev) => prev.map((item, i) => (i === idx ? { ...item, title: value } : item)));
    };

    const handleAdd = () => {
        setItems((prev) => [...prev, { title: '새 항목', content: '<p style="margin:0;">내용을 입력하세요.</p>' }]);
    };

    const handleDelete = (idx: number) => {
        if (items.length <= 1) return;
        setItems((prev) => prev.filter((_, i) => i !== idx));
    };

    const handleMoveUp = (idx: number) => {
        if (idx === 0) return;
        setItems((prev) => {
            const next = [...prev];
            [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
            return next;
        });
    };

    const handleMoveDown = (idx: number) => {
        if (idx === items.length - 1) return;
        setItems((prev) => {
            const next = [...prev];
            [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
            return next;
        });
    };

    const openTableEditor = (idx: number) => {
        const liveTable =
            blockEl.querySelectorAll<HTMLElement>('.ia-item')[idx]?.querySelector<HTMLTableElement>('.ia-body table') ??
            null;
        const parsed = parseFirstTableFromHtml(items[idx]?.content ?? '');
        setEditingTableIndex(idx);
        setTableModel(hydrateTableModelSizing(parsed ?? createDefaultTableModel(), liveTable));
    };

    const handleApplyTable = (nextTableModel: TableModel) => {
        if (editingTableIndex === null) return;
        const nextTableHtml = buildTableHtml(nextTableModel);
        setItems((prev) =>
            prev.map((item, idx) =>
                idx === editingTableIndex
                    ? {
                          ...item,
                          content: replaceFirstTableInHtml(item.content, nextTableHtml),
                      }
                    : item,
            ),
        );
        setEditingTableIndex(null);
        setTableModel(null);
    };

    const handleApply = () => {
        applyToBlock(blockEl, items);
        onClose();
    };

    return (
        <>
            <div onClick={onClose} style={S.overlay} />

            <div
                data-testid="info-accordion-editor"
                onClick={(e) => e.stopPropagation()}
                style={{ ...S.panel, left: pos.x, top: pos.y }}
            >
                <div onMouseDown={handleHeaderMouseDown} style={{ ...S.header, cursor: 'grab', userSelect: 'none' }}>
                    <span style={{ fontWeight: 700, color: '#111827' }}>이용안내 항목 편집</span>
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
                        x
                    </button>
                </div>

                <div
                    style={{
                        padding: '8px 14px',
                        background: '#f0f4ff',
                        borderBottom: '1px solid #e5e7eb',
                        fontSize: 11,
                        color: '#4b6baf',
                        flexShrink: 0,
                    }}
                >
                    제목 추가, 삭제, 순서 변경과 함께 항목 본문에 들어가는 표를 문자열 HTML 기반으로 편집할 수 있습니다.
                </div>

                <div style={S.body}>
                    {items.map((item, idx) => (
                        <div key={idx} style={S.itemCard}>
                            <div style={S.itemRow}>
                                <span
                                    style={{
                                        fontSize: 11,
                                        fontWeight: 700,
                                        color: '#9ca3af',
                                        minWidth: 16,
                                        flexShrink: 0,
                                    }}
                                >
                                    {idx + 1}
                                </span>

                                <button
                                    type="button"
                                    title="위로"
                                    disabled={idx === 0}
                                    onClick={() => handleMoveUp(idx)}
                                    style={{ ...S.iconBtn, opacity: idx === 0 ? 0.35 : 1 }}
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        width="13"
                                        height="13"
                                        fill="none"
                                        stroke="#374151"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="m18 15-6-6-6 6" />
                                    </svg>
                                </button>

                                <button
                                    type="button"
                                    title="아래로"
                                    disabled={idx === items.length - 1}
                                    onClick={() => handleMoveDown(idx)}
                                    style={{ ...S.iconBtn, opacity: idx === items.length - 1 ? 0.35 : 1 }}
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        width="13"
                                        height="13"
                                        fill="none"
                                        stroke="#374151"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="m6 9 6 6 6-6" />
                                    </svg>
                                </button>

                                <input
                                    type="text"
                                    value={item.title}
                                    onChange={(e) => handleTitleChange(idx, e.target.value)}
                                    style={S.input}
                                    placeholder="항목 제목"
                                />

                                <button
                                    type="button"
                                    title="항목 삭제"
                                    disabled={items.length <= 1}
                                    onClick={() => handleDelete(idx)}
                                    style={{ ...S.deleteBtn, opacity: items.length <= 1 ? 0.35 : 1 }}
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        width="13"
                                        height="13"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M18 6 6 18M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div style={S.helperRow}>
                                <span style={S.helperText}>
                                    {hasTable(item.content)
                                        ? '이 항목에는 편집 가능한 표가 포함되어 있습니다.'
                                        : '표가 없으면 기본 2x2 표를 추가합니다.'}
                                </span>
                                <button
                                    data-testid={`edit-table-${idx}`}
                                    type="button"
                                    onClick={() => openTableEditor(idx)}
                                    style={S.tableBtn}
                                >
                                    {hasTable(item.content) ? '표 편집' : '표 추가'}
                                </button>
                            </div>
                        </div>
                    ))}

                    <button type="button" onClick={handleAdd} style={S.addBtn}>
                        <svg
                            viewBox="0 0 24 24"
                            width="14"
                            height="14"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                        >
                            <path d="M12 5v14M5 12h14" />
                        </svg>
                        항목 추가
                    </button>
                </div>

                <div style={S.footer}>
                    <span style={{ fontSize: 11, color: '#9ca3af' }}>총 {items.length}개 항목</span>
                    <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={onClose} style={S.cancelBtn}>
                            취소
                        </button>
                        <button data-testid="apply-info-accordion-editor" onClick={handleApply} style={S.applyBtn}>
                            적용
                        </button>
                    </div>
                </div>
            </div>

            {editingTableIndex !== null && tableModel && (
                <TableEditorModal
                    initialModel={tableModel}
                    title={`항목 ${editingTableIndex + 1} 표 편집`}
                    onClose={() => {
                        setEditingTableIndex(null);
                        setTableModel(null);
                    }}
                    onApply={handleApplyTable}
                />
            )}
        </>
    );
}
