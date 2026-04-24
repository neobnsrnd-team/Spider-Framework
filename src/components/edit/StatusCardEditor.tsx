// src/components/edit/StatusCardEditor.tsx
// 현황 카드 통합 편집 모달 — point-reward · loan-status 통합 (Issue #285)

'use client';

import { useState, useCallback, useEffect } from 'react';

import { escapeHtml, rgbToHex } from '@/lib/html-utils';

// ── 타입 ──────────────────────────────────────────────────────────────────

type RowType = 'text' | 'progress';

interface TextRow {
    type: 'text';
    label: string;
    value: string;
    valueColor: string; // hex
}

interface ProgressRow {
    type: 'progress';
    label: string;
    pct: number; // 0~100
    barColor: string; // hex, 기본값 브랜드 색상 #0046A4
}

type StatusCardRow = TextRow | ProgressRow;

interface BtnConfig {
    label: string;
    href: string;
    visible: boolean;
}

export interface StatusCardEditorProps {
    blockEl: HTMLElement;
    onClose: () => void;
}

// ── 블록 파싱 ─────────────────────────────────────────────────────────────

function parseBlock(blockEl: HTMLElement): {
    title: string;
    badgeText: string;
    badgeVisible: boolean;
    rows: StatusCardRow[];
    primaryBtn: BtnConfig;
    secondaryBtn: BtnConfig;
} {
    const titleEl = blockEl.querySelector<HTMLElement>('[data-sc-title]');
    const title = titleEl?.textContent?.trim() ?? '현황 카드';

    const badgeEl = blockEl.querySelector<HTMLElement>('[data-sc-badge]');
    const badgeText = badgeEl?.textContent?.trim() ?? '';
    const badgeVisible = badgeEl?.getAttribute('data-sc-badge-visible') !== 'false';

    const rowEls = blockEl.querySelectorAll<HTMLElement>('[data-sc-row]');
    const rows: StatusCardRow[] = Array.from(rowEls).map((row) => {
        const rowType = (row.getAttribute('data-sc-row-type') ?? 'text') as RowType;
        const labelEl = row.querySelector<HTMLElement>('[data-sc-label]');
        const label = labelEl?.textContent?.trim() ?? '';

        if (rowType === 'progress') {
            const pctEl = row.querySelector<HTMLElement>('[data-sc-progress-pct]');
            const barEl = row.querySelector<HTMLElement>('[data-sc-progress-bar]');
            const pctRaw = pctEl?.textContent?.replace('%', '').trim() ?? '0';
            // 바 색상: data-sc-progress-color 속성 → 없으면 inline style → 기본값
            const barColor =
                barEl?.getAttribute('data-sc-progress-color') ?? rgbToHex(barEl?.style.background ?? '', '#0046A4');
            return {
                type: 'progress',
                label,
                pct: Math.min(100, Math.max(0, Number(pctRaw) || 0)),
                barColor,
            } satisfies ProgressRow;
        }

        const valueEl = row.querySelector<HTMLElement>('[data-sc-value]');
        const valueColor =
            valueEl?.getAttribute('data-sc-value-color') ?? rgbToHex(valueEl?.style.color ?? '', '#1A1A2E');
        return {
            type: 'text',
            label,
            value: valueEl?.textContent?.trim() ?? '',
            valueColor,
        } satisfies TextRow;
    });

    const primaryEl = blockEl.querySelector<HTMLAnchorElement>('[data-sc-btn="primary"]');
    const secondaryEl = blockEl.querySelector<HTMLAnchorElement>('[data-sc-btn="secondary"]');

    const primaryBtn: BtnConfig = {
        label: primaryEl?.textContent?.trim() ?? '확인',
        href: primaryEl?.getAttribute('href') ?? '#',
        visible: true, // primary는 항상 표시
    };
    const secondaryBtn: BtnConfig = {
        label: secondaryEl?.textContent?.trim() ?? '내역 보기',
        href: secondaryEl?.getAttribute('href') ?? '#',
        visible: secondaryEl?.getAttribute('data-sc-btn-visible') !== 'false',
    };

    return { title, badgeText, badgeVisible, rows, primaryBtn, secondaryBtn };
}

// ── 컴포넌트 ──────────────────────────────────────────────────────────────

export default function StatusCardEditor({ blockEl, onClose }: StatusCardEditorProps) {
    const parsed = parseBlock(blockEl);

    // ── state ──
    const [title, setTitle] = useState(parsed.title);
    const [badgeText, setBadgeText] = useState(parsed.badgeText);
    const [badgeVisible, setBadgeVisible] = useState(parsed.badgeVisible);
    const [rows, setRows] = useState<StatusCardRow[]>(parsed.rows);
    const [primaryBtn, setPrimaryBtn] = useState<BtnConfig>(parsed.primaryBtn);
    const [secondaryBtn, setSecondaryBtn] = useState<BtnConfig>(parsed.secondaryBtn);

    // ── callback ──
    const handleApply = useCallback(() => {
        // 제목 (textContent — XSS 자동 방지)
        const titleEl = blockEl.querySelector<HTMLElement>('[data-sc-title]');
        if (titleEl) titleEl.textContent = title;

        // 뱃지
        const badgeEl = blockEl.querySelector<HTMLElement>('[data-sc-badge]');
        if (badgeEl) {
            badgeEl.textContent = badgeText;
            badgeEl.setAttribute('data-sc-badge-visible', String(badgeVisible));
            badgeEl.style.display = badgeVisible ? 'inline-block' : 'none';
        }

        // 행 목록 — 마지막 행만 border 없음
        const rowContainer = blockEl.querySelector<HTMLElement>('[data-sc-rows]');
        if (rowContainer) {
            rowContainer.innerHTML = rows
                .map((row, idx) => {
                    const isLast = idx === rows.length - 1;
                    const borderStyle = isLast ? '' : 'border-bottom:1px solid #F3F4F6;';

                    if (row.type === 'progress') {
                        return (
                            `<div data-sc-row data-sc-row-type="progress" style="padding:10px 0;${borderStyle}">` +
                            `<div style="display:flex;justify-content:space-between;margin-bottom:6px;">` +
                            `<span data-sc-label style="font-size:14px;color:#6B7280;">${escapeHtml(row.label)}</span>` +
                            `<span data-sc-progress-pct data-sc-progress-color="${row.barColor}" style="font-size:14px;font-weight:600;color:${row.barColor};">${row.pct}%</span>` +
                            `</div>` +
                            `<div style="height:6px;border-radius:3px;background:#F3F4F6;">` +
                            `<div data-sc-progress-bar data-sc-progress-color="${row.barColor}" style="height:100%;border-radius:3px;background:${row.barColor};width:${row.pct}%;"></div>` +
                            `</div>` +
                            `</div>`
                        );
                    }

                    return (
                        `<div data-sc-row data-sc-row-type="text" style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;${borderStyle}">` +
                        `<span data-sc-label style="font-size:14px;color:#6B7280;">${escapeHtml(row.label)}</span>` +
                        `<span data-sc-value data-sc-value-color="${row.valueColor}" style="font-size:14px;font-weight:600;color:${row.valueColor};">${escapeHtml(row.value)}</span>` +
                        `</div>`
                    );
                })
                .join('');
        }

        // Primary 버튼
        const primaryEl = blockEl.querySelector<HTMLAnchorElement>('[data-sc-btn="primary"]');
        if (primaryEl) {
            primaryEl.textContent = primaryBtn.label;
            primaryEl.setAttribute('href', primaryBtn.href);
        }

        // Secondary 버튼
        const secondaryEl = blockEl.querySelector<HTMLAnchorElement>('[data-sc-btn="secondary"]');
        if (secondaryEl) {
            secondaryEl.textContent = secondaryBtn.label;
            secondaryEl.setAttribute('href', secondaryBtn.href);
            secondaryEl.setAttribute('data-sc-btn-visible', String(secondaryBtn.visible));
            secondaryEl.style.display = secondaryBtn.visible ? 'block' : 'none';
        }

        onClose();
    }, [blockEl, title, badgeText, badgeVisible, rows, primaryBtn, secondaryBtn, onClose]);

    // ── effect ──
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    // ── 행 편집 헬퍼 ──
    const updateRow = (idx: number, patch: Partial<StatusCardRow>) =>
        setRows((prev) => prev.map((r, i) => (i === idx ? ({ ...r, ...patch } as StatusCardRow) : r)));

    const addTextRow = () =>
        setRows((prev) => [...prev, { type: 'text', label: '항목', value: '값', valueColor: '#1A1A2E' }]);

    const addProgressRow = () =>
        setRows((prev) => [...prev, { type: 'progress', label: '진행률', pct: 0, barColor: '#0046A4' }]);

    const removeRow = (idx: number) => setRows((prev) => prev.filter((_, i) => i !== idx));

    const moveRowUp = (idx: number) =>
        setRows((prev) => {
            if (idx === 0) return prev;
            const next = [...prev];
            [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
            return next;
        });

    const moveRowDown = (idx: number) =>
        setRows((prev) => {
            if (idx === prev.length - 1) return prev;
            const next = [...prev];
            [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
            return next;
        });

    // ── 스타일 공통 ──
    const inputStyle: React.CSSProperties = {
        width: '100%',
        padding: '8px 10px',
        borderRadius: 6,
        border: '1px solid #E5E7EB',
        fontSize: 13,
        boxSizing: 'border-box',
    };
    const labelStyle: React.CSSProperties = {
        fontSize: 13,
        color: '#6B7280',
        display: 'block',
        marginBottom: 4,
    };
    const sectionStyle: React.CSSProperties = { marginBottom: 16 };

    // ── 렌더 ──
    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 99999,
                background: 'rgba(0,0,0,0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
            onClick={onClose}
        >
            <div
                style={{
                    background: '#fff',
                    borderRadius: 12,
                    padding: 24,
                    width: 460,
                    maxHeight: '85vh',
                    overflowY: 'auto',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                    fontFamily: "-apple-system,BlinkMacSystemFont,'Malgun Gothic','Apple SD Gothic Neo',sans-serif",
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 700, color: '#1A1A2E' }}>현황 카드 편집</h3>

                {/* 제목 */}
                <div style={sectionStyle}>
                    <span style={labelStyle}>제목</span>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} />
                </div>

                {/* 뱃지 */}
                <div style={{ ...sectionStyle, display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                    <label style={{ flex: 1 }}>
                        <span style={labelStyle}>뱃지 텍스트</span>
                        <input
                            type="text"
                            value={badgeText}
                            onChange={(e) => setBadgeText(e.target.value)}
                            disabled={!badgeVisible}
                            style={{ ...inputStyle, opacity: badgeVisible ? 1 : 0.4 }}
                        />
                    </label>
                    <label
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            paddingBottom: 8,
                            cursor: 'pointer',
                            userSelect: 'none',
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={badgeVisible}
                            onChange={(e) => setBadgeVisible(e.target.checked)}
                            style={{ width: 16, height: 16 }}
                        />
                        <span style={{ fontSize: 13, color: '#6B7280' }}>표시</span>
                    </label>
                </div>

                {/* 행 목록 */}
                <div style={sectionStyle}>
                    <span style={labelStyle}>항목</span>
                    {rows.map((row, idx) => (
                        <div
                            key={idx}
                            style={{
                                marginBottom: 8,
                                padding: '8px 10px',
                                borderRadius: 6,
                                border: '1px solid #F3F4F6',
                                background: '#FAFAFA',
                            }}
                        >
                            {/* 공통: 레이블 */}
                            <div style={{ display: 'flex', gap: 6, marginBottom: 6, alignItems: 'center' }}>
                                <span style={{ fontSize: 11, color: '#9CA3AF', minWidth: 36 }}>
                                    {row.type === 'progress' ? '진행률' : '텍스트'}
                                </span>
                                <input
                                    type="text"
                                    value={row.label}
                                    onChange={(e) => updateRow(idx, { label: e.target.value })}
                                    placeholder="레이블"
                                    style={{
                                        flex: 1,
                                        padding: '6px 8px',
                                        borderRadius: 6,
                                        border: '1px solid #E5E7EB',
                                        fontSize: 13,
                                    }}
                                />
                                <button
                                    onClick={() => moveRowUp(idx)}
                                    disabled={idx === 0}
                                    title="위로"
                                    style={{
                                        width: 28,
                                        height: 28,
                                        border: '1px solid #E5E7EB',
                                        borderRadius: 4,
                                        background: '#fff',
                                        color: idx === 0 ? '#D1D5DB' : '#6B7280',
                                        cursor: idx === 0 ? 'default' : 'pointer',
                                        fontSize: 12,
                                        flexShrink: 0,
                                    }}
                                >
                                    ▲
                                </button>
                                <button
                                    onClick={() => moveRowDown(idx)}
                                    disabled={idx === rows.length - 1}
                                    title="아래로"
                                    style={{
                                        width: 28,
                                        height: 28,
                                        border: '1px solid #E5E7EB',
                                        borderRadius: 4,
                                        background: '#fff',
                                        color: idx === rows.length - 1 ? '#D1D5DB' : '#6B7280',
                                        cursor: idx === rows.length - 1 ? 'default' : 'pointer',
                                        fontSize: 12,
                                        flexShrink: 0,
                                    }}
                                >
                                    ▼
                                </button>
                                <button
                                    onClick={() => removeRow(idx)}
                                    style={{
                                        width: 28,
                                        height: 28,
                                        border: 'none',
                                        borderRadius: 4,
                                        background: '#FEE2E2',
                                        color: '#DC2626',
                                        cursor: 'pointer',
                                        fontSize: 16,
                                        flexShrink: 0,
                                    }}
                                >
                                    ×
                                </button>
                            </div>

                            {/* 텍스트 행: 값 + 색상 */}
                            {row.type === 'text' && (
                                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                    <input
                                        type="text"
                                        value={row.value}
                                        onChange={(e) => updateRow(idx, { value: e.target.value })}
                                        placeholder="값"
                                        style={{
                                            flex: 1,
                                            padding: '6px 8px',
                                            borderRadius: 6,
                                            border: '1px solid #E5E7EB',
                                            fontSize: 13,
                                        }}
                                    />
                                    <input
                                        type="color"
                                        value={row.valueColor}
                                        onChange={(e) => updateRow(idx, { valueColor: e.target.value })}
                                        title="값 색상"
                                        style={{
                                            width: 32,
                                            height: 32,
                                            padding: 2,
                                            border: '1px solid #E5E7EB',
                                            borderRadius: 4,
                                            cursor: 'pointer',
                                        }}
                                    />
                                </div>
                            )}

                            {/* 진행률 행: % 입력 + 바 색상 */}
                            {row.type === 'progress' && (
                                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                    <input
                                        type="number"
                                        min={0}
                                        max={100}
                                        value={row.pct}
                                        onChange={(e) =>
                                            updateRow(idx, {
                                                pct: Math.min(100, Math.max(0, Number(e.target.value) || 0)),
                                            })
                                        }
                                        style={{
                                            width: 70,
                                            padding: '6px 8px',
                                            borderRadius: 6,
                                            border: '1px solid #E5E7EB',
                                            fontSize: 13,
                                        }}
                                    />
                                    <span style={{ fontSize: 13, color: '#6B7280' }}>%</span>
                                    {/* 진행률 바 미리보기 */}
                                    <div
                                        style={{
                                            flex: 1,
                                            height: 6,
                                            borderRadius: 3,
                                            background: '#F3F4F6',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <div
                                            style={{
                                                height: '100%',
                                                borderRadius: 3,
                                                background: row.barColor,
                                                width: `${row.pct}%`,
                                                transition: 'width 0.2s',
                                            }}
                                        />
                                    </div>
                                    <input
                                        type="color"
                                        value={row.barColor}
                                        onChange={(e) => updateRow(idx, { barColor: e.target.value })}
                                        title="바 색상"
                                        style={{
                                            width: 32,
                                            height: 32,
                                            padding: 2,
                                            border: '1px solid #E5E7EB',
                                            borderRadius: 4,
                                            cursor: 'pointer',
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    ))}

                    {/* 행 추가 버튼 */}
                    <div style={{ display: 'flex', gap: 6 }}>
                        <button
                            onClick={addTextRow}
                            style={{
                                flex: 1,
                                padding: '7px 0',
                                borderRadius: 6,
                                border: '1px dashed #D1D5DB',
                                background: 'transparent',
                                color: '#6B7280',
                                fontSize: 13,
                                cursor: 'pointer',
                            }}
                        >
                            + 텍스트 행
                        </button>
                        <button
                            onClick={addProgressRow}
                            style={{
                                flex: 1,
                                padding: '7px 0',
                                borderRadius: 6,
                                border: '1px dashed #0046A4',
                                background: 'transparent',
                                color: '#0046A4',
                                fontSize: 13,
                                cursor: 'pointer',
                            }}
                        >
                            + 진행률 바
                        </button>
                    </div>
                </div>

                {/* Primary 버튼 */}
                <div style={{ ...sectionStyle, display: 'flex', gap: 8 }}>
                    <label style={{ flex: 1 }}>
                        <span style={labelStyle}>버튼 텍스트</span>
                        <input
                            type="text"
                            value={primaryBtn.label}
                            onChange={(e) => setPrimaryBtn((b) => ({ ...b, label: e.target.value }))}
                            style={inputStyle}
                        />
                    </label>
                    <label style={{ flex: 1 }}>
                        <span style={labelStyle}>버튼 링크</span>
                        <input
                            type="text"
                            value={primaryBtn.href}
                            onChange={(e) => setPrimaryBtn((b) => ({ ...b, href: e.target.value }))}
                            placeholder="#"
                            style={inputStyle}
                        />
                    </label>
                </div>

                {/* Secondary 버튼 */}
                <div
                    style={{
                        ...sectionStyle,
                        padding: '10px 12px',
                        borderRadius: 8,
                        border: '1px solid #F3F4F6',
                        background: '#FAFAFA',
                    }}
                >
                    <label
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            marginBottom: secondaryBtn.visible ? 10 : 0,
                            cursor: 'pointer',
                            userSelect: 'none',
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={secondaryBtn.visible}
                            onChange={(e) => setSecondaryBtn((b) => ({ ...b, visible: e.target.checked }))}
                            style={{ width: 16, height: 16 }}
                        />
                        <span style={{ fontSize: 13, color: '#6B7280' }}>보조 버튼 표시</span>
                    </label>
                    {secondaryBtn.visible && (
                        <div style={{ display: 'flex', gap: 8 }}>
                            <label style={{ flex: 1 }}>
                                <span style={labelStyle}>텍스트</span>
                                <input
                                    type="text"
                                    value={secondaryBtn.label}
                                    onChange={(e) => setSecondaryBtn((b) => ({ ...b, label: e.target.value }))}
                                    style={inputStyle}
                                />
                            </label>
                            <label style={{ flex: 1 }}>
                                <span style={labelStyle}>링크</span>
                                <input
                                    type="text"
                                    value={secondaryBtn.href}
                                    onChange={(e) => setSecondaryBtn((b) => ({ ...b, href: e.target.value }))}
                                    placeholder="#"
                                    style={inputStyle}
                                />
                            </label>
                        </div>
                    )}
                </div>

                {/* 액션 버튼 */}
                <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
                    <button
                        onClick={onClose}
                        style={{
                            flex: 1,
                            padding: '10px 0',
                            borderRadius: 8,
                            border: '1px solid #E5E7EB',
                            background: '#fff',
                            color: '#6B7280',
                            fontSize: 14,
                            cursor: 'pointer',
                        }}
                    >
                        취소
                    </button>
                    <button
                        onClick={handleApply}
                        style={{
                            flex: 2,
                            padding: '10px 0',
                            borderRadius: 8,
                            border: 'none',
                            background: '#0046A4',
                            color: '#fff',
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: 'pointer',
                        }}
                    >
                        적용
                    </button>
                </div>
            </div>
        </div>
    );
}
