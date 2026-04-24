'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import {
    addTableColumn,
    addTableRow,
    deleteTableColumn,
    deleteTableRow,
    getColumnWidth,
    getRowHeight,
    type TableModel,
    updateCellStyle,
    updateColumnWidth,
    updateRowHeight,
} from './table-html';

interface Props {
    initialModel: TableModel;
    title?: string;
    onApply: (model: TableModel) => void;
    onClose: () => void;
}

interface CellSelection {
    row: number;
    col: number;
}

const FONT_FAMILY = "-apple-system,BlinkMacSystemFont,'Malgun Gothic','Apple SD Gothic Neo',sans-serif";

function normalizeColorForInput(color?: string): string {
    if (!color) return '#ffffff';

    const hexMatch = color.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (hexMatch) {
        const hex = hexMatch[1];
        return hex.length === 3
            ? `#${hex
                  .split('')
                  .map((ch) => ch + ch)
                  .join('')
                  .toLowerCase()}`
            : `#${hex.toLowerCase()}`;
    }

    const rgbMatch = color.match(
        /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(?:0|1|0?\.\d+))?\s*\)$/i,
    );
    if (!rgbMatch) return '#ffffff';

    const toHex = (value: string) => {
        const clamped = Math.max(0, Math.min(255, Number.parseInt(value, 10) || 0));
        return clamped.toString(16).padStart(2, '0');
    };

    return `#${toHex(rgbMatch[1])}${toHex(rgbMatch[2])}${toHex(rgbMatch[3])}`;
}

const S = {
    overlay: {
        position: 'fixed' as const,
        inset: 0,
        zIndex: 100000,
        background: 'rgba(17, 24, 39, 0.08)',
    },
    panel: {
        position: 'fixed' as const,
        width: 860,
        maxWidth: 'calc(100vw - 24px)',
        maxHeight: 'calc(100vh - 24px)',
        zIndex: 100001,
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: 14,
        boxShadow: '0 24px 48px rgba(15,23,42,0.18)',
        display: 'flex',
        flexDirection: 'column' as const,
        fontFamily: FONT_FAMILY,
        fontSize: 13,
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 16px',
        borderBottom: '1px solid #f3f4f6',
        background: '#fafafa',
        borderRadius: '14px 14px 0 0',
        cursor: 'grab',
        userSelect: 'none' as const,
    },
    body: {
        display: 'grid',
        gridTemplateColumns: '260px minmax(0, 1fr)',
        gap: 0,
        minHeight: 0,
        flex: 1,
    },
    sidebar: {
        borderRight: '1px solid #f3f4f6',
        padding: 14,
        overflowY: 'auto' as const,
        display: 'flex',
        flexDirection: 'column' as const,
        gap: 14,
    },
    section: {
        display: 'flex',
        flexDirection: 'column' as const,
        gap: 8,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: 700,
        color: '#6b7280',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.04em',
    },
    actionRow: {
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap' as const,
    },
    miniButton: {
        border: '1px solid #d1d5db',
        background: '#fff',
        borderRadius: 8,
        padding: '7px 10px',
        fontSize: 12,
        fontWeight: 600,
        color: '#374151',
        cursor: 'pointer',
    } as React.CSSProperties,
    label: {
        fontSize: 12,
        color: '#374151',
        fontWeight: 600,
    },
    input: {
        width: '100%',
        padding: '8px 10px',
        border: '1px solid #d1d5db',
        borderRadius: 8,
        fontSize: 12,
        color: '#111827',
        background: '#fff',
        boxSizing: 'border-box' as const,
        fontFamily: FONT_FAMILY,
    },
    previewWrap: {
        padding: 16,
        overflow: 'auto' as const,
        background: '#f8fafc',
    },
    previewGrid: {
        display: 'grid',
        gap: 8,
        minWidth: 'max-content',
    },
    cellCard: {
        display: 'flex',
        flexDirection: 'column' as const,
        border: '1px solid #d1d5db',
        borderRadius: 10,
        background: '#fff',
        minWidth: 150,
    },
    cellMeta: {
        padding: '6px 8px',
        borderBottom: '1px solid #f3f4f6',
        fontSize: 11,
        color: '#6b7280',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cellTextarea: {
        minHeight: 84,
        border: 'none',
        outline: 'none',
        resize: 'vertical' as const,
        padding: 10,
        fontSize: 12,
        lineHeight: 1.5,
        fontFamily: FONT_FAMILY,
        background: 'transparent',
    },
    footer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 8,
        padding: '12px 16px 16px',
        borderTop: '1px solid #f3f4f6',
    },
    secondaryBtn: {
        border: '1px solid #d1d5db',
        background: '#fff',
        borderRadius: 8,
        padding: '8px 14px',
        fontSize: 12,
        fontWeight: 600,
        color: '#374151',
        cursor: 'pointer',
    },
    primaryBtn: {
        border: 'none',
        background: '#0046A4',
        borderRadius: 8,
        padding: '8px 16px',
        fontSize: 12,
        fontWeight: 700,
        color: '#fff',
        cursor: 'pointer',
    },
} as const;

function normalizeCssSize(value: string): string {
    const trimmed = value.trim();
    if (!trimmed) return '';
    if (/^\d+$/.test(trimmed)) return `${trimmed}px`;
    return trimmed;
}

export default function TableEditorModal({ initialModel, title = '표 편집', onApply, onClose }: Props) {
    const [model, setModel] = useState<TableModel>(initialModel);
    const [selected, setSelected] = useState<CellSelection>({ row: 0, col: 0 });
    const [pos, setPos] = useState(() => ({
        x: Math.max(12, window.innerWidth / 2 - 430),
        y: Math.max(12, window.innerHeight / 2 - 260),
    }));
    const dragging = useRef(false);
    const dragStart = useRef({ mx: 0, my: 0, px: 0, py: 0 });

    const selectedCell = model.rows[selected.row]?.[selected.col];

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
        const handleMove = (e: MouseEvent) => {
            if (!dragging.current) return;
            setPos({
                x: Math.max(12, dragStart.current.px + e.clientX - dragStart.current.mx),
                y: Math.max(12, dragStart.current.py + e.clientY - dragStart.current.my),
            });
        };
        const handleUp = () => {
            dragging.current = false;
        };

        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', handleUp);
        return () => {
            document.removeEventListener('mousemove', handleMove);
            document.removeEventListener('mouseup', handleUp);
        };
    }, []);

    const updateSelectedCell = (styleKey: string, value: string) => {
        setModel((prev) => updateCellStyle(prev, selected.row, selected.col, styleKey, value));
    };

    return (
        <>
            <div onClick={onClose} style={S.overlay} />
            <div data-testid="table-editor-modal" style={{ ...S.panel, left: pos.x, top: pos.y }}>
                <div onMouseDown={handleHeaderMouseDown} style={S.header}>
                    <span style={{ fontWeight: 700, color: '#111827' }}>{title}</span>
                    <button
                        onClick={onClose}
                        style={{
                            border: 'none',
                            background: 'none',
                            color: '#6b7280',
                            fontSize: 18,
                            cursor: 'pointer',
                            padding: 0,
                            lineHeight: 1,
                        }}
                    >
                        x
                    </button>
                </div>

                <div style={S.body}>
                    <div style={S.sidebar}>
                        <div style={S.section}>
                            <span style={S.sectionTitle}>구조</span>
                            <div style={S.actionRow}>
                                <button
                                    type="button"
                                    onClick={() => setModel((prev) => addTableRow(prev))}
                                    style={S.miniButton}
                                >
                                    행 추가
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setModel((prev) => addTableColumn(prev))}
                                    style={S.miniButton}
                                >
                                    열 추가
                                </button>
                            </div>
                        </div>

                        <div style={S.section}>
                            <span style={S.sectionTitle}>열 너비</span>
                            {Array.from({ length: model.rows[0]?.length ?? 0 }, (_, colIdx) => (
                                <div key={colIdx} style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                                    <label style={{ ...S.label, flex: 1 }}>
                                        열 {colIdx + 1}
                                        <input
                                            style={S.input}
                                            value={getColumnWidth(model, colIdx)}
                                            placeholder="예: 120px 또는 25%"
                                            onChange={(e) =>
                                                setModel((prev) =>
                                                    updateColumnWidth(prev, colIdx, normalizeCssSize(e.target.value)),
                                                )
                                            }
                                        />
                                    </label>
                                    <button
                                        type="button"
                                        data-testid={`delete-table-column-${colIdx}`}
                                        disabled={(model.rows[0]?.length ?? 0) <= 1}
                                        onClick={() => {
                                            setModel((prev) => deleteTableColumn(prev, colIdx));
                                            setSelected((prev) => ({
                                                row: prev.row,
                                                col: Math.max(0, Math.min(prev.col, (model.rows[0]?.length ?? 1) - 2)),
                                            }));
                                        }}
                                        style={{
                                            ...S.miniButton,
                                            color: '#b91c1c',
                                            borderColor: '#fecaca',
                                            opacity: (model.rows[0]?.length ?? 0) <= 1 ? 0.4 : 1,
                                        }}
                                    >
                                        열 삭제
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div style={S.section}>
                            <span style={S.sectionTitle}>행 높이</span>
                            {model.rows.map((_, rowIdx) => (
                                <div key={rowIdx} style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                                    <label style={{ ...S.label, flex: 1 }}>
                                        행 {rowIdx + 1}
                                        <input
                                            style={S.input}
                                            value={getRowHeight(model, rowIdx)}
                                            placeholder="예: 48px"
                                            onChange={(e) =>
                                                setModel((prev) =>
                                                    updateRowHeight(prev, rowIdx, normalizeCssSize(e.target.value)),
                                                )
                                            }
                                        />
                                    </label>
                                    <button
                                        type="button"
                                        data-testid={`delete-table-row-${rowIdx}`}
                                        disabled={model.rows.length <= 1}
                                        onClick={() => {
                                            setModel((prev) => deleteTableRow(prev, rowIdx));
                                            setSelected((prev) => ({
                                                row: Math.max(0, Math.min(prev.row, model.rows.length - 2)),
                                                col: prev.col,
                                            }));
                                        }}
                                        style={{
                                            ...S.miniButton,
                                            color: '#b91c1c',
                                            borderColor: '#fecaca',
                                            opacity: model.rows.length <= 1 ? 0.4 : 1,
                                        }}
                                    >
                                        행 삭제
                                    </button>
                                </div>
                            ))}
                        </div>

                        {selectedCell && (
                            <div style={S.section}>
                                <span style={S.sectionTitle}>선택 셀</span>
                                <label style={S.label}>
                                    배경색
                                    <input
                                        type="color"
                                        style={{ ...S.input, padding: 4, height: 38 }}
                                        value={normalizeColorForInput(selectedCell.styles['background-color'])}
                                        onChange={(e) => updateSelectedCell('background-color', e.target.value)}
                                    />
                                </label>
                                <label style={S.label}>
                                    가로 정렬
                                    <select
                                        value={selectedCell.styles['text-align'] ?? 'left'}
                                        onChange={(e) => updateSelectedCell('text-align', e.target.value)}
                                        style={S.input}
                                    >
                                        <option value="left">왼쪽</option>
                                        <option value="center">가운데</option>
                                        <option value="right">오른쪽</option>
                                    </select>
                                </label>
                                <label style={S.label}>
                                    세로 정렬
                                    <select
                                        value={selectedCell.styles['vertical-align'] ?? 'top'}
                                        onChange={(e) => updateSelectedCell('vertical-align', e.target.value)}
                                        style={S.input}
                                    >
                                        <option value="top">위</option>
                                        <option value="middle">가운데</option>
                                        <option value="bottom">아래</option>
                                    </select>
                                </label>
                            </div>
                        )}
                    </div>

                    <div style={S.previewWrap}>
                        <div
                            style={{
                                ...S.previewGrid,
                                gridTemplateColumns: `repeat(${model.rows[0]?.length ?? 1}, minmax(150px, 1fr))`,
                            }}
                        >
                            {model.rows.map((row, rowIdx) =>
                                row.map((cell, colIdx) => {
                                    const isSelected = selected.row === rowIdx && selected.col === colIdx;
                                    return (
                                        <div
                                            key={`${rowIdx}-${colIdx}`}
                                            style={{
                                                ...S.cellCard,
                                                borderColor: isSelected ? '#0046A4' : '#d1d5db',
                                                boxShadow: isSelected ? '0 0 0 2px rgba(0,70,164,0.12)' : 'none',
                                                background: cell.styles['background-color'] ?? '#fff',
                                            }}
                                            onClick={() => setSelected({ row: rowIdx, col: colIdx })}
                                        >
                                            <div style={S.cellMeta}>
                                                <span>
                                                    {rowIdx + 1}-{colIdx + 1}
                                                </span>
                                                <span>{cell.tagName.toUpperCase()}</span>
                                            </div>
                                            <textarea
                                                style={{
                                                    ...S.cellTextarea,
                                                    textAlign:
                                                        (cell.styles[
                                                            'text-align'
                                                        ] as React.CSSProperties['textAlign']) ?? 'left',
                                                    minHeight: cell.styles.height || '84px',
                                                }}
                                                value={cell.content.replace(/<br\s*\/?>/gi, '\n')}
                                                placeholder="셀 내용을 입력하세요"
                                                onFocus={() => setSelected({ row: rowIdx, col: colIdx })}
                                                onChange={(e) =>
                                                    setModel((prev) => {
                                                        const nextRows = prev.rows.map((prevRow, prevRowIdx) =>
                                                            prevRow.map((prevCell, prevColIdx) =>
                                                                prevRowIdx === rowIdx && prevColIdx === colIdx
                                                                    ? {
                                                                          ...prevCell,
                                                                          content: e.target.value
                                                                              ? e.target.value.replace(/\n/g, '<br>')
                                                                              : '<br>',
                                                                      }
                                                                    : prevCell,
                                                            ),
                                                        );
                                                        return { ...prev, rows: nextRows };
                                                    })
                                                }
                                            />
                                        </div>
                                    );
                                }),
                            )}
                        </div>
                    </div>
                </div>

                <div style={S.footer}>
                    <span style={{ fontSize: 11, color: '#6b7280' }}>
                        {model.rows.length}행 {model.rows[0]?.length ?? 0}열
                    </span>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button data-testid="cancel-table-editor" onClick={onClose} style={S.secondaryBtn}>
                            취소
                        </button>
                        <button data-testid="apply-table-editor" onClick={() => onApply(model)} style={S.primaryBtn}>
                            적용
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
