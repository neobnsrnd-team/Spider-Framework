// scripts/migrate-finance-calendar-to-html.ts
// 금융 일정 캘린더 컴포넌트 DB 등록 (Issue #290)

import 'dotenv/config';
import { getComponentById, updateComponent, createComponent } from '../src/db/repository/component.repository';
import { closePool } from '../src/db/connection';
import { escapeHtml } from '../src/lib/html-utils';

const FONT = "-apple-system,BlinkMacSystemFont,'Malgun Gothic','Apple SD Gothic Neo',sans-serif";
const THUMBNAIL = '/assets/minimalist-blocks/preview/ibk-finance-calendar.svg';

// ── 타입 ──────────────────────────────────────────────────────────────────

interface FcEvent {
    day: number;
    label: string;
    amount?: number;
    color: string;
}

// ── 캘린더 그리드 생성 ────────────────────────────────────────────────────

function buildGridHTML(year: number, month: number, events: FcEvent[]): string {
    const firstDow = new Date(year, month - 1, 1).getDay(); // 0=일
    const lastDay = new Date(year, month, 0).getDate();
    const today = new Date();
    const isCurrentMonth = today.getFullYear() === year && today.getMonth() + 1 === month;
    const todayDay = isCurrentMonth ? today.getDate() : -1;

    // 이벤트 맵: day → events[]
    const eventMap = new Map<number, FcEvent[]>();
    events.forEach((ev) => {
        const list = eventMap.get(ev.day) ?? [];
        list.push(ev);
        eventMap.set(ev.day, list);
    });

    const CELL_W = `${(100 / 7).toFixed(4)}%`;
    const DOW_LABELS = ['일', '월', '화', '수', '목', '금', '토'];
    const DOW_COLORS = ['#EF4444', '#374151', '#374151', '#374151', '#374151', '#374151', '#3B82F6'];

    // 요일 헤더
    const headerCells = DOW_LABELS.map((d, i) =>
        `<div style="width:${CELL_W};text-align:center;padding:6px 0;font-size:12px;font-weight:600;color:${DOW_COLORS[i]};">${d}</div>`
    ).join('');

    // 날짜 셀
    const totalCells = Math.ceil((firstDow + lastDay) / 7) * 7;
    let dayCells = '';
    for (let i = 0; i < totalCells; i++) {
        const day = i - firstDow + 1;
        const dow = i % 7; // 0=일, 6=토
        const isValid = day >= 1 && day <= lastDay;
        const isToday = isValid && day === todayDay;
        const dayColor = dow === 0 ? '#EF4444' : dow === 6 ? '#3B82F6' : '#374151';
        const dayEvents = isValid ? (eventMap.get(day) ?? []) : [];

        const todayStyle = isToday
            ? 'width:24px;height:24px;border-radius:50%;background:#0046A4;display:inline-flex;align-items:center;justify-content:center;color:#fff;'
            : `color:${dayColor};`;

        const dots = dayEvents
            .map((ev) => `<span style="width:5px;height:5px;border-radius:50%;background:${ev.color};display:inline-block;margin:0 1px;"></span>`)
            .join('');

        dayCells +=
            `<div style="width:${CELL_W};text-align:center;padding:4px 0 2px;">` +
            `<span style="font-size:12px;${isToday ? '' : `color:${dayColor};`}${isValid ? '' : 'visibility:hidden;'}">` +
            (isToday ? `<span style="${todayStyle}font-size:12px;">${day}</span>` : (isValid ? String(day) : '')) +
            `</span>` +
            (dots ? `<div style="display:flex;justify-content:center;gap:2px;margin-top:2px;">${dots}</div>` : '<div style="height:9px;"></div>') +
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

// ── 공통 내부 HTML ─────────────────────────────────────────────────────────

function buildInner(year: number, month: number, events: FcEvent[]): string {
    const mm = String(month).padStart(2, '0');
    const eventsJson = JSON.stringify(events).replace(/"/g, '&quot;');

    return (
        // 헤더
        `<div style="display:flex;justify-content:space-between;align-items:center;padding:14px 16px 10px;">` +
            `<span data-fc-title style="font-size:15px;font-weight:700;color:#1A1A2E;">금융 일정</span>` +
            `<span data-fc-year="${year}" data-fc-month="${month}" style="font-size:13px;font-weight:600;color:#374151;">${year}.${mm}</span>` +
        `</div>` +

        // 캘린더 그리드
        `<div data-fc-grid style="padding:0 8px;" data-fc-events="${eventsJson}">` +
            buildGridHTML(year, month, events) +
        `</div>` +

        // 이벤트 목록
        `<div data-fc-event-list style="padding:4px 16px 12px;">` +
            buildEventListHTML(year, month, events) +
        `</div>`
    );
}

// ── variant HTML ──────────────────────────────────────────────────────────

const NOW = new Date();
const YEAR = NOW.getFullYear();
const MONTH = NOW.getMonth() + 1;

const SAMPLE_EVENTS: FcEvent[] = [
    { day: 10, label: '카드값', amount: -320000, color: '#EF4444' },
    { day: 16, label: '적금 만기', color: '#10B981' },
    { day: 25, label: '보험료', amount: -85000, color: '#F59E0B' },
];

const MOBILE_HTML =
    `<div data-component-id="finance-calendar-mobile" data-spw-block style="font-family:${FONT};background:#ffffff;border-radius:12px;margin:0 16px;box-shadow:0 1px 4px rgba(0,0,0,0.08);">${buildInner(YEAR, MONTH, SAMPLE_EVENTS)}</div>`;

const WEB_HTML =
    `<div data-component-id="finance-calendar-web" data-spw-block style="font-family:${FONT};background:#ffffff;border-radius:12px;max-width:480px;margin:0 auto;box-shadow:0 1px 4px rgba(0,0,0,0.08);">${buildInner(YEAR, MONTH, SAMPLE_EVENTS)}</div>`;

const RESPONSIVE_HTML =
    `<div data-component-id="finance-calendar-responsive" data-spw-block style="font-family:${FONT};background:#ffffff;border-radius:12px;width:100%;box-sizing:border-box;box-shadow:0 1px 4px rgba(0,0,0,0.08);">${buildInner(YEAR, MONTH, SAMPLE_EVENTS)}</div>`;

const VARIANTS = [
    { id: 'finance-calendar-mobile',     html: MOBILE_HTML,     viewMode: 'mobile'     as const },
    { id: 'finance-calendar-web',        html: WEB_HTML,        viewMode: 'web'        as const },
    { id: 'finance-calendar-responsive', html: RESPONSIVE_HTML, viewMode: 'responsive' as const },
];

// ── 실행 ──────────────────────────────────────────────────────────────────

async function main() {
    for (const v of VARIANTS) {
        const existing = await getComponentById(v.id);
        if (existing) {
            await updateComponent({
                componentId:        v.id,
                componentType:      existing.COMPONENT_TYPE,
                viewMode:           existing.VIEW_MODE,
                componentThumbnail: existing.COMPONENT_THUMBNAIL ?? undefined,
                data: { ...((existing.DATA ?? {}) as Record<string, unknown>), html: v.html },
                lastModifierId: 'system',
            });
            process.stdout.write(`[업데이트] ${v.id}\n`);
        } else {
            await createComponent({
                componentId:        v.id,
                componentType:      'finance',
                viewMode:           v.viewMode,
                componentThumbnail: THUMBNAIL,
                data: {
                    id:          v.id.replace(`-${v.viewMode}`, ''),
                    label:       '금융 일정 캘린더',
                    description: '납부일·만기일 등 금융 일정을 월별 캘린더로 표시하는 컴포넌트',
                    preview:     THUMBNAIL,
                    html:        v.html,
                    viewMode:    v.viewMode,
                },
                createUserId:   'system',
                createUserName: '시스템',
            });
            process.stdout.write(`[생성] ${v.id}\n`);
        }
    }

    await closePool();
    process.stdout.write('완료\n');
}

main().catch((err: unknown) => {
    process.stderr.write(`실패: ${err}\n`);
    process.exit(1);
});
