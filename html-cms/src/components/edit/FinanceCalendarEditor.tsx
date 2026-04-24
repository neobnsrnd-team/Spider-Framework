// src/components/edit/FinanceCalendarEditor.tsx
// 금융 일정 캘린더 편집 모달 (Issue #290)

'use client';

import { useState, useCallback, useEffect } from 'react';

import { escapeHtml } from '@/lib/html-utils';

// ── 타입 ──────────────────────────────────────────────────────────────────

interface FcEvent {
    day: number; // 1~31
    label: string;
    amount?: number; // 없으면 목록에 미표시
    color: string; // hex
}

export interface FinanceCalendarEditorProps {
    blockEl: HTMLElement;
    onClose: () => void;
}

// ── 캘린더 그리드 생성 (마이그레이션 스크립트와 동일 로직) ──────────────

function buildGridHTML(year: number, month: number, events: FcEvent[]): string {
    const firstDow = new Date(year, month - 1, 1).getDay();
    const lastDay = new Date(year, month, 0).getDate();
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() + 1 === month;
    const todayDay = isCurrentMonth ? today.getDate() : -1;

    const eventMap = new Map<number, FcEvent[]>();
    events.forEach((ev) => {
        const list = eventMap.get(ev.day) ?? [];
        list.push(ev);
        eventMap.set(ev.day, list);
    });

    const CELL_W = `${(100 / 7).toFixed(4)}%`;
    const DOW_LABELS = ['일', '월', '화', '수', '목', '금', '토'];
    const DOW_COLORS = ['#EF4444', '#374151', '#374151', '#374151', '#374151', '#374151', '#3B82F6'];

    const headerCells = DOW_LABELS.map(
        (d, i) =>
            `<div style="width:${CELL_W};text-align:center;padding:6px 0;font-size:12px;font-weight:600;color:${DOW_COLORS[i]};">${d}</div>`,
    ).join('');

    const totalCells = Math.ceil((firstDow + lastDay) / 7) * 7;
    let dayCells = '';
    for (let i = 0; i < totalCells; i++) {
        const day = i - firstDow + 1;
        const dow = i % 7;
        const isValid = day >= 1 && day <= lastDay;
        const isToday = isValid && day === todayDay;
        const dayColor = dow === 0 ? '#EF4444' : dow === 6 ? '#3B82F6' : '#374151';
        const dayEvents = isValid ? (eventMap.get(day) ?? []) : [];

        const todayStyle =
            'width:24px;height:24px;border-radius:50%;background:#0046A4;display:inline-flex;align-items:center;justify-content:center;color:#fff;';
        const dots = dayEvents
            .map(
                (ev) =>
                    `<span style="width:5px;height:5px;border-radius:50%;background:${ev.color};display:inline-block;margin:0 1px;"></span>`,
            )
            .join('');

        dayCells +=
            `<div style="width:${CELL_W};text-align:center;padding:4px 0 2px;">` +
            `<span style="font-size:12px;${isValid ? '' : 'visibility:hidden;'}${isToday ? '' : `color:${dayColor};`}">` +
            (isToday ? `<span style="${todayStyle}font-size:12px;">${day}</span>` : isValid ? String(day) : '') +
            `</span>` +
            (dots
                ? `<div style="display:flex;justify-content:center;gap:2px;margin-top:2px;">${dots}</div>`
                : '<div style="height:9px;"></div>') +
            `</div>`;
    }

    return (
        `<div style="display:flex;flex-wrap:wrap;border-bottom:1px solid #F3F4F6;">${headerCells}</div>` +
        `<div style="display:flex;flex-wrap:wrap;">${dayCells}</div>`
    );
}

// ── 이벤트 목록 생성 ──────────────────────────────────────────────────────

function buildEventListHTML(year: number, month: number, events: FcEvent[]): string {
    const lastDay = new Date(year, month, 0).getDate();
    const validEvents = events.filter((ev) => ev.day >= 1 && ev.day <= lastDay);
    if (validEvents.length === 0) return '';
    const sorted = [...validEvents].sort((a, b) => a.day - b.day);
    const mm = String(month).padStart(2, '0');

    return sorted
        .map((ev) => {
            const dd = String(ev.day).padStart(2, '0');
            const amountStr =
                ev.amount !== undefined
                    ? `<span style="font-size:13px;font-weight:600;color:${ev.amount < 0 ? '#EF4444' : '#0046A4'};white-space:nowrap;">${ev.amount < 0 ? '-' : '+'}${Math.abs(ev.amount).toLocaleString('ko-KR')} 원</span>`
                    : '';
            return (
                `<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid #F9FAFB;">` +
                `<span style="width:8px;height:8px;border-radius:50%;background:${ev.color};flex-shrink:0;"></span>` +
                `<span style="font-size:12px;color:#9CA3AF;flex-shrink:0;">${year}.${mm}.${dd}</span>` +
                `<span style="font-size:13px;color:#374151;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(ev.label)}</span>` +
                amountStr +
                `</div>`
            );
        })
        .join('');
}

// ── 블록 파싱 ─────────────────────────────────────────────────────────────

function parseBlock(blockEl: HTMLElement): {
    title: string;
    year: number;
    month: number;
    events: FcEvent[];
} {
    const titleEl = blockEl.querySelector<HTMLElement>('[data-fc-title]');
    const title = titleEl?.textContent?.trim() ?? '금융 일정';

    const ymEl = blockEl.querySelector<HTMLElement>('[data-fc-year]');
    const now = new Date();
    const year = Number(ymEl?.getAttribute('data-fc-year') ?? now.getFullYear());
    const month = Number(ymEl?.getAttribute('data-fc-month') ?? now.getMonth() + 1);

    const gridEl = blockEl.querySelector<HTMLElement>('[data-fc-grid]');
    let events: FcEvent[] = [];
    try {
        const raw = gridEl?.getAttribute('data-fc-events') ?? '[]';
        events = JSON.parse(raw) as FcEvent[];
    } catch (err: unknown) {
        console.warn('금융 일정 이벤트 JSON 파싱 실패, 빈 목록으로 초기화:', err);
        events = [];
    }

    return { title, year, month, events };
}

// ── 컴포넌트 ──────────────────────────────────────────────────────────────

export default function FinanceCalendarEditor({ blockEl, onClose }: FinanceCalendarEditorProps) {
    // parseBlock lazy init — 매 렌더마다 호출 방지
    const [initialData] = useState(() => parseBlock(blockEl));

    // ── state ──
    const [title, setTitle] = useState(initialData.title);
    const [year, setYear] = useState(initialData.year);
    const [month, setMonth] = useState(initialData.month);
    const [events, setEvents] = useState<FcEvent[]>(initialData.events);

    // 월 이동
    const prevMonth = () => {
        if (month === 1) {
            setYear((y) => y - 1);
            setMonth(12);
        } else setMonth((m) => m - 1);
    };
    const nextMonth = () => {
        if (month === 12) {
            setYear((y) => y + 1);
            setMonth(1);
        } else setMonth((m) => m + 1);
    };

    // ── callback ──
    const handleApply = useCallback(() => {
        // 제목
        const titleEl = blockEl.querySelector<HTMLElement>('[data-fc-title]');
        if (titleEl) titleEl.textContent = title;

        // 연도·월 속성
        const ymEl = blockEl.querySelector<HTMLElement>('[data-fc-year]');
        if (ymEl) {
            ymEl.setAttribute('data-fc-year', String(year));
            ymEl.setAttribute('data-fc-month', String(month));
            ymEl.textContent = `${year}.${String(month).padStart(2, '0')}`;
        }

        // 이벤트 JSON 저장 (setAttribute는 브라우저가 인코딩 처리하므로 raw JSON 사용)
        const gridEl = blockEl.querySelector<HTMLElement>('[data-fc-grid]');
        if (gridEl) {
            gridEl.setAttribute('data-fc-events', JSON.stringify(events));
            gridEl.innerHTML = buildGridHTML(year, month, events);
        }

        // 이벤트 목록 재생성
        const listEl = blockEl.querySelector<HTMLElement>('[data-fc-event-list]');
        if (listEl) {
            listEl.innerHTML = buildEventListHTML(year, month, events);
        }

        onClose();
    }, [blockEl, title, year, month, events, onClose]);

    // ── effect ──
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    // ── 이벤트 편집 헬퍼 ──
    const updateEvent = (idx: number, patch: Partial<FcEvent>) =>
        setEvents((prev) => prev.map((e, i) => (i === idx ? { ...e, ...patch } : e)));

    const addEvent = () => setEvents((prev) => [...prev, { day: 1, label: '일정', color: '#0046A4' }]);

    const removeEvent = (idx: number) => setEvents((prev) => prev.filter((_, i) => i !== idx));

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
        >
            <div
                style={{
                    background: '#fff',
                    borderRadius: 12,
                    padding: 24,
                    width: 480,
                    maxHeight: '88vh',
                    overflowY: 'auto',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
                    fontFamily: "-apple-system,BlinkMacSystemFont,'Malgun Gothic','Apple SD Gothic Neo',sans-serif",
                }}
            >
                {/* 헤더 */}
                <div
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}
                >
                    <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#1A1A2E' }}>
                        금융 일정 캘린더 편집
                    </h3>
                    <button
                        onClick={onClose}
                        title="닫기"
                        style={{
                            width: 28,
                            height: 28,
                            border: 'none',
                            borderRadius: 4,
                            background: 'transparent',
                            color: '#9CA3AF',
                            cursor: 'pointer',
                            fontSize: 18,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        ×
                    </button>
                </div>

                {/* 카드 제목 */}
                <div style={sectionStyle}>
                    <span style={labelStyle}>카드 제목</span>
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} style={inputStyle} />
                </div>

                {/* 표시 월 */}
                <div style={{ ...sectionStyle, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ ...labelStyle, marginBottom: 0 }}>표시 월</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <button
                            onClick={prevMonth}
                            style={{
                                width: 28,
                                height: 28,
                                border: '1px solid #E5E7EB',
                                borderRadius: 6,
                                background: '#fff',
                                cursor: 'pointer',
                                fontSize: 14,
                                color: '#6B7280',
                            }}
                        >
                            ◀
                        </button>
                        <span
                            style={{
                                fontSize: 14,
                                fontWeight: 600,
                                color: '#1A1A2E',
                                minWidth: 70,
                                textAlign: 'center',
                            }}
                        >
                            {year}.{String(month).padStart(2, '0')}
                        </span>
                        <button
                            onClick={nextMonth}
                            style={{
                                width: 28,
                                height: 28,
                                border: '1px solid #E5E7EB',
                                borderRadius: 6,
                                background: '#fff',
                                cursor: 'pointer',
                                fontSize: 14,
                                color: '#6B7280',
                            }}
                        >
                            ▶
                        </button>
                    </div>
                </div>

                {/* 이벤트 목록 */}
                <div style={sectionStyle}>
                    <span style={{ ...labelStyle, marginBottom: 8 }}>이벤트</span>

                    {events.map((ev, idx) => (
                        <div
                            key={idx}
                            style={{
                                marginBottom: 8,
                                padding: '10px 10px 8px',
                                borderRadius: 6,
                                border: '1px solid #F3F4F6',
                                background: '#FAFAFA',
                            }}
                        >
                            {/* 날짜 + 레이블 + 삭제 */}
                            <div style={{ display: 'flex', gap: 6, marginBottom: 6, alignItems: 'center' }}>
                                <input
                                    type="number"
                                    min={1}
                                    max={31}
                                    value={ev.day}
                                    onChange={(e) =>
                                        updateEvent(idx, {
                                            day: Math.min(31, Math.max(1, Number(e.target.value) || 1)),
                                        })
                                    }
                                    style={{
                                        width: 52,
                                        padding: '6px 8px',
                                        borderRadius: 6,
                                        border: '1px solid #E5E7EB',
                                        fontSize: 13,
                                        textAlign: 'center',
                                    }}
                                />
                                <span style={{ fontSize: 12, color: '#9CA3AF', flexShrink: 0 }}>일</span>
                                <input
                                    type="text"
                                    value={ev.label}
                                    onChange={(e) => updateEvent(idx, { label: e.target.value })}
                                    placeholder="일정 이름"
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
                                    value={ev.color}
                                    onChange={(e) => updateEvent(idx, { color: e.target.value })}
                                    title="색상"
                                    style={{
                                        width: 32,
                                        height: 32,
                                        padding: 2,
                                        border: '1px solid #E5E7EB',
                                        borderRadius: 4,
                                        cursor: 'pointer',
                                        flexShrink: 0,
                                    }}
                                />
                                <button
                                    onClick={() => removeEvent(idx)}
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

                            {/* 금액 (선택) */}
                            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                                <label
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 5,
                                        cursor: 'pointer',
                                        userSelect: 'none',
                                        flexShrink: 0,
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={ev.amount !== undefined}
                                        onChange={(e) => updateEvent(idx, { amount: e.target.checked ? 0 : undefined })}
                                        style={{ width: 14, height: 14 }}
                                    />
                                    <span style={{ fontSize: 12, color: '#6B7280' }}>금액</span>
                                </label>
                                {ev.amount !== undefined && (
                                    <>
                                        <select
                                            value={ev.amount < 0 || Object.is(ev.amount, -0) ? '-' : '+'}
                                            onChange={(e) =>
                                                updateEvent(idx, {
                                                    amount:
                                                        e.target.value === '-'
                                                            ? -Math.abs(ev.amount ?? 0)
                                                            : Math.abs(ev.amount ?? 0),
                                                })
                                            }
                                            style={{
                                                padding: '5px 4px',
                                                borderRadius: 6,
                                                border: '1px solid #E5E7EB',
                                                fontSize: 13,
                                            }}
                                        >
                                            <option value="-">지출 (−)</option>
                                            <option value="+">수입 (+)</option>
                                        </select>
                                        <input
                                            type="number"
                                            min={0}
                                            value={Math.round(Math.abs(ev.amount ?? 0))}
                                            onChange={(e) => {
                                                const abs = Math.round(Math.abs(parseInt(e.target.value, 10) || 0));
                                                const sign = (ev.amount ?? 0) < 0 || Object.is(ev.amount, -0) ? -1 : 1;
                                                updateEvent(idx, { amount: sign * abs });
                                            }}
                                            placeholder="금액 (원)"
                                            style={{
                                                flex: 1,
                                                padding: '6px 8px',
                                                borderRadius: 6,
                                                border: '1px solid #E5E7EB',
                                                fontSize: 13,
                                            }}
                                        />
                                        <span style={{ fontSize: 12, color: '#9CA3AF', flexShrink: 0 }}>원</span>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={addEvent}
                        style={{
                            width: '100%',
                            padding: '8px 0',
                            borderRadius: 6,
                            border: '1px dashed #0046A4',
                            background: 'transparent',
                            color: '#0046A4',
                            fontSize: 13,
                            cursor: 'pointer',
                        }}
                    >
                        + 이벤트 추가
                    </button>
                </div>

                {/* 액션 버튼 */}
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
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
