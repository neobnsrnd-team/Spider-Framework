// e2e/components/finance-calendar.spec.ts
// finance-calendar 컴포넌트 자동화 QA (Issue #311)

import { test, expect } from '@playwright/test';
import {
    runCommonChecks,
    checkNoHorizontalScroll,
    checkNotOutsideViewport,
    checkViewportLayouts,
} from '../helpers/component-checks';

// ── 테스트용 HTML ─────────────────────────────────────────────────────────
// 실제 컴포넌트 구조(data-fc-* 속성)를 사용 — migrate-finance-calendar-to-html.ts 와 동일한 DOM 구조

/** 실제 컴포넌트의 escapeHtml(src/lib/html-utils.ts)과 동일한 로직 */
function escapeHtml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * 캘린더 그리드 + 이벤트 목록을 포함한 finance-calendar HTML 생성
 * - data-fc-grid + data-fc-events (JSON) : 캘린더 그리드
 * - data-fc-event-list : 이벤트 목록
 */
const makeCalendarHtml = (opts: {
    year: number;
    month: number;
    events: { day: number; label: string; amount?: number; color: string }[];
}) => {
    const { year, month, events } = opts;
    const mm = String(month).padStart(2, '0');
    const eventsJson = JSON.stringify(events).replace(/"/g, '&quot;');

    // 간소화된 달력 그리드: 요일 헤더 + 날짜 셀 (1~말일)
    const lastDay = new Date(year, month, 0).getDate();
    const firstDow = new Date(year, month - 1, 1).getDay();
    const cellW = `${(100 / 7).toFixed(4)}%`;
    const dowLabels = ['일', '월', '화', '수', '목', '금', '토'];
    const dowColors = ['#EF4444', '#374151', '#374151', '#374151', '#374151', '#374151', '#3B82F6'];

    const headerCells = dowLabels
        .map(
            (d, i) =>
                `<div style="width:${cellW};text-align:center;padding:6px 0;font-size:12px;font-weight:600;color:${dowColors[i]};">${d}</div>`,
        )
        .join('');

    const totalCells = Math.ceil((firstDow + lastDay) / 7) * 7;
    let dayCells = '';
    for (let i = 0; i < totalCells; i++) {
        const day = i - firstDow + 1;
        const isValid = day >= 1 && day <= lastDay;
        const dayEvents = isValid ? events.filter((e) => e.day === day) : [];
        const dots = dayEvents
            .map(
                (ev) =>
                    `<span style="width:5px;height:5px;border-radius:50%;background:${ev.color};display:inline-block;margin:0 1px;"></span>`,
            )
            .join('');
        dayCells +=
            `<div style="width:${cellW};text-align:center;padding:4px 0 2px;">` +
            `<span style="font-size:12px;${isValid ? '' : 'visibility:hidden;'}">${isValid ? day : ''}</span>` +
            (dots
                ? `<div style="display:flex;justify-content:center;gap:2px;margin-top:2px;">${dots}</div>`
                : '<div style="height:9px;"></div>') +
            `</div>`;
    }

    const gridHtml =
        `<div style="display:flex;flex-wrap:wrap;border-bottom:1px solid #F3F4F6;">${headerCells}</div>` +
        `<div style="display:flex;flex-wrap:wrap;">${dayCells}</div>`;

    // 이벤트 목록
    const sortedEvents = [...events].filter((e) => e.day >= 1 && e.day <= lastDay).sort((a, b) => a.day - b.day);
    const eventListHtml = sortedEvents
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

    return `
<!DOCTYPE html><html><head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>* { box-sizing: border-box; } body { margin: 0; }</style>
</head><body>
  <div data-component-id="finance-calendar-mobile" data-spw-block
       style="font-family:-apple-system,sans-serif;background:#fff;border-radius:12px;margin:0 16px;box-shadow:0 1px 4px rgba(0,0,0,0.08);">
    <div style="display:flex;justify-content:space-between;align-items:center;padding:14px 16px 10px;">
      <span data-fc-title style="font-size:15px;font-weight:700;color:#1A1A2E;">금융 일정</span>
      <span data-fc-year="${year}" data-fc-month="${month}" style="font-size:13px;font-weight:600;color:#374151;">${year}.${mm}</span>
    </div>
    <div data-fc-grid style="padding:0 8px;" data-fc-events="${eventsJson}">
      ${gridHtml}
    </div>
    <div data-fc-event-list style="padding:4px 16px 12px;">
      ${eventListHtml}
    </div>
  </div>
</body></html>
`;
};

// ── 테스트 데이터 ─────────────────────────────────────────────────────────

const NORMAL_HTML = makeCalendarHtml({
    year: 2026,
    month: 4,
    events: [
        { day: 10, label: '카드값', amount: -320000, color: '#EF4444' },
        { day: 16, label: '적금 만기', color: '#10B981' },
        { day: 25, label: '보험료', amount: -85000, color: '#F59E0B' },
    ],
});

const EMPTY_EVENTS_HTML = makeCalendarHtml({
    year: 2026,
    month: 4,
    events: [],
});

const MULTI_SAME_DAY_HTML = makeCalendarHtml({
    year: 2026,
    month: 4,
    events: [
        { day: 15, label: '카드값', amount: -150000, color: '#EF4444' },
        { day: 15, label: '적금 이체', amount: -300000, color: '#3B82F6' },
    ],
});

const LONG_LABEL_HTML = makeCalendarHtml({
    year: 2026,
    month: 4,
    events: [
        {
            day: 10,
            label: 'IBK 기업은행 정기적금 자동이체 만기해지 예정일 안내',
            amount: -500000,
            color: '#EF4444',
        },
    ],
});

const FEB_HTML = makeCalendarHtml({
    year: 2026,
    month: 2,
    events: [{ day: 28, label: '보험료', amount: -120000, color: '#F59E0B' }],
});

const XSS_HTML = makeCalendarHtml({
    year: 2026,
    month: 4,
    events: [
        { day: 5, label: '<script>alert(1)</script>XSS테스트', color: '#EF4444' },
    ],
});

// ── 공통 체크 ─────────────────────────────────────────────────────────────

test.describe('finance-calendar — 공통 체크', () => {
    test.beforeEach(async ({ page }) => {
        await page.setContent(NORMAL_HTML);
    });

    test('공통 레이아웃·접근성 기준 충족 (가로스크롤·뷰포트·폰트·터치·alt)', async ({ page }) => {
        await runCommonChecks(page, {
            componentIdPrefix: 'finance-calendar',
            minFontSize: 12,
            minTouchSize: 44,
        });
    });
});

// ── 기기별 뷰포트 체크 ────────────────────────────────────────────────────

test.describe('finance-calendar — 기기별 뷰포트', () => {
    test('iPhone SE (375px) — 가로 스크롤 없음·뷰포트 이탈 없음', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.setContent(NORMAL_HTML);
        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, '[data-component-id^="finance-calendar"]');
    });

    test('Galaxy S (360px) — 가로 스크롤 없음·뷰포트 이탈 없음', async ({ page }) => {
        await page.setViewportSize({ width: 360, height: 780 });
        await page.setContent(NORMAL_HTML);
        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, '[data-component-id^="finance-calendar"]');
    });

    test('iPhone Pro Max (430px) — 가로 스크롤 없음·뷰포트 이탈 없음', async ({ page }) => {
        await page.setViewportSize({ width: 430, height: 932 });
        await page.setContent(NORMAL_HTML);
        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, '[data-component-id^="finance-calendar"]');
    });
});

// ── 반응형 브레이크포인트 체크 ────────────────────────────────────────────

test.describe('finance-calendar — 반응형 브레이크포인트', () => {
    test('767px — 모바일 경계에서 가로 스크롤 없음', async ({ page }) => {
        await page.setViewportSize({ width: 767, height: 900 });
        await page.setContent(NORMAL_HTML);
        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, '[data-component-id^="finance-calendar"]');
    });

    test('768px — 태블릿 경계에서 가로 스크롤 없음', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.setContent(NORMAL_HTML);
        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, '[data-component-id^="finance-calendar"]');
    });

    test('1440px — 표준 데스크탑에서 뷰포트 이탈 없음', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.setContent(NORMAL_HTML);
        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, '[data-component-id^="finance-calendar"]');
    });
});

// ── 뷰어(/view) 렌더링 확인 ───────────────────────────────────────────────

test.describe('finance-calendar — 뷰어 렌더링', () => {
    // eslint-disable-next-line playwright/no-skipped-test
    test.skip(!!process.env.CI, 'CI 환경: Oracle DB 없어 저장된 페이지 데이터 없음 — 로컬에서만 실행');

    test('/view 접근 시 에러 페이지가 아닌 정상 렌더링됨', async ({ page }) => {
        await page.goto('/view');
        await page.waitForLoadState('domcontentloaded');
        await expect(page).not.toHaveTitle(/error|500|404/i);
        await expect(page.locator('body')).toBeVisible();
    });
});

// ── 정상 동작 ─────────────────────────────────────────────────────────────

test.describe('finance-calendar — 정상 동작', () => {
    test.beforeEach(async ({ page }) => {
        await page.setContent(NORMAL_HTML);
    });

    test('달력 그리드(data-fc-grid)가 렌더링됨', async ({ page }) => {
        const grid = page.locator('[data-component-id^="finance-calendar"] [data-fc-grid]');
        await expect(grid).toBeAttached();
        // 요일 헤더(일~토) 7개 이상의 셀이 있어야 함
        const cells = grid.locator('div > div');
        expect(await cells.count()).toBeGreaterThanOrEqual(7);
    });

    test('이벤트 목록(data-fc-event-list)에 항목이 표시됨', async ({ page }) => {
        const eventList = page.locator(
            '[data-component-id^="finance-calendar"] [data-fc-event-list] > div',
        );
        await expect(eventList).toHaveCount(3);
    });

    test('연/월 정보(data-fc-year, data-fc-month)가 올바르게 표시됨', async ({ page }) => {
        const yearMonth = page.locator('[data-fc-year][data-fc-month]');
        await expect(yearMonth).toHaveAttribute('data-fc-year', '2026');
        await expect(yearMonth).toHaveAttribute('data-fc-month', '4');
        const text = await yearMonth.textContent();
        expect(text).toContain('2026');
    });

    test('이벤트 색상이 인디케이터에 적용됨', async ({ page }) => {
        // 이벤트 목록의 색상 dot (첫 번째: #EF4444)
        const firstDot = page
            .locator('[data-fc-event-list] > div:first-child span')
            .first();
        const bg = await firstDot.evaluate((el) => getComputedStyle(el).backgroundColor);
        // #EF4444 → rgb(239, 68, 68)
        expect(bg).toBe('rgb(239, 68, 68)');
    });

    test('제목(data-fc-title)이 표시됨', async ({ page }) => {
        const title = page.locator('[data-fc-title]');
        await expect(title).toBeVisible();
        const text = await title.textContent();
        expect(text).toContain('금융 일정');
    });
});

// ── 예외 처리 ─────────────────────────────────────────────────────────────

test.describe('finance-calendar — 예외 처리', () => {
    test('이벤트 0개 → 빈 달력 정상 표시', async ({ page }) => {
        await page.setContent(EMPTY_EVENTS_HTML);
        // 그리드는 존재
        await expect(
            page.locator('[data-component-id^="finance-calendar"] [data-fc-grid]'),
        ).toBeAttached();
        // 이벤트 목록은 비어 있음
        const items = page.locator('[data-fc-event-list] > div');
        await expect(items).toHaveCount(0);
        // data-fc-events 속성은 빈 배열
        await expect(page.locator('[data-fc-grid]')).toHaveAttribute('data-fc-events', '[]');
    });

    test('동일 날짜 이벤트 2개 → 모두 표시됨', async ({ page }) => {
        await page.setContent(MULTI_SAME_DAY_HTML);
        const items = page.locator('[data-fc-event-list] > div');
        await expect(items).toHaveCount(2);
        // 두 항목 모두 15일 날짜를 포함
        for (let i = 0; i < 2; i++) {
            const text = await items.nth(i).textContent();
            expect(text).toContain('15');
        }
    });

    test('2월 달력(28일) — 레이아웃 깨짐 없음 (요일 7열·날짜 셀 수·행 수 검증)', async ({ page }) => {
        await page.setContent(FEB_HTML);
        await checkNoHorizontalScroll(page);

        const grid = page.locator('[data-fc-grid]');
        await expect(grid).toBeAttached();

        // data-fc-grid 직계 자식: [0]=헤더 행, [1]=날짜 행
        const gridChildren = grid.locator(':scope > div');
        await expect(gridChildren).toHaveCount(2);

        // 요일 헤더 행: 정확히 7개
        const headerCells = gridChildren.nth(0).locator(':scope > div');
        await expect(headerCells).toHaveCount(7);

        // 2026년 2월: 1일이 일요일, 28일 → 4주 = 28셀 (여백 없음)
        const dateCells = gridChildren.nth(1).locator(':scope > div');
        await expect(dateCells).toHaveCount(28);

        // 각 셀이 그리드 범위 밖으로 삐져나가지 않음
        const gridBox = await grid.boundingBox();
        const firstBox = await dateCells.first().boundingBox();
        const lastBox = await dateCells.last().boundingBox();

        expect(firstBox!.x).toBeGreaterThanOrEqual(gridBox!.x);
        expect(lastBox!.x + lastBox!.width).toBeLessThanOrEqual(gridBox!.x + gridBox!.width + 1);
    });
});

// ── 엣지 케이스 ───────────────────────────────────────────────────────────

test.describe('finance-calendar — 엣지 케이스', () => {
    test('레이블 20자 이상 — 레이아웃 깨짐 없음', async ({ page }) => {
        await page.setContent(LONG_LABEL_HTML);
        await checkNoHorizontalScroll(page);

        const item = page.locator('[data-fc-event-list] > div').first();
        await expect(item).toBeVisible();
        const box = await item.boundingBox();
        expect(box).not.toBeNull();
        expect(box!.height).toBeGreaterThan(0);
    });

    test('XSS — raw <script> 문자열이 이스케이프되어 실행되지 않음', async ({ page }) => {
        await page.setContent(XSS_HTML);

        // script 태그가 DOM에 삽입되지 않음
        const injected = await page.evaluate(
            () => document.querySelector('[data-component-id^="finance-calendar"] script'),
        );
        expect(injected).toBeNull();

        // escapeHtml이 적용되어 레이블이 텍스트로만 렌더링됨 (innerHTML에 &lt;script&gt; 포함)
        const labelEl = page.locator('[data-fc-event-list] > div:first-child span').nth(2);
        const innerHTML = await labelEl.evaluate((el) => el.innerHTML);
        // escapeHtml에 의해 &lt;script&gt; 형태로 이스케이프됨
        expect(innerHTML).toContain('&lt;script&gt;');
        expect(innerHTML).not.toContain('<script>');
    });
});

// ── 반응형 뷰포트 레이아웃 ────────────────────────────────────────────────────

test.describe('finance-calendar — 반응형 뷰포트 레이아웃', () => {
    // eslint-disable-next-line playwright/expect-expect
    test('360~1440px 전 뷰포트에서 가로 스크롤·뷰포트 이탈 없음', async ({ page }) => {
        await page.setContent(NORMAL_HTML);
        await checkViewportLayouts(page, '[data-component-id^="finance-calendar"]');
    });
});
