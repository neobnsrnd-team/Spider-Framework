// e2e/components/status-card.spec.ts
// status-card(현황 카드) 컴포넌트 자동화 QA (Issue #324)

import { test, expect } from '@playwright/test';
import {
    runCommonChecks,
    checkNoHorizontalScroll,
    checkNotOutsideViewport,
} from '../helpers/component-checks';

// ── 헬퍼 ──────────────────────────────────────────────────────────────────

function escapeHtml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// ── 테스트용 HTML 빌더 ───────────────────────────────────────────────────
// scripts/migrate-status-card-to-html.ts 의 DOM 구조와 동일

const FONT = "-apple-system,BlinkMacSystemFont,'Malgun Gothic','Apple SD Gothic Neo',sans-serif";

function buildHeader(title: string, badge?: string): string {
    const badgeHtml = badge
        ? `<span data-sc-badge data-sc-badge-visible="true" style="display:inline-block;padding:2px 10px;border-radius:4px;background:#E8F0FC;color:#0046A4;font-size:12px;font-weight:600;">${escapeHtml(badge)}</span>`
        : `<span data-sc-badge data-sc-badge-visible="false" style="display:none;padding:2px 10px;border-radius:4px;background:#E8F0FC;color:#0046A4;font-size:12px;font-weight:600;">뱃지</span>`;
    return (
        `<div data-sc-header style="padding:16px 16px 8px;">` +
            `<div data-sc-title style="font-size:15px;font-weight:700;color:#1A1A2E;margin-bottom:6px;">${escapeHtml(title)}</div>` +
            badgeHtml +
        `</div>`
    );
}

function buildTextRow(label: string, value: string, color = '#1A1A2E'): string {
    return (
        `<div data-sc-row data-sc-row-type="text" style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #F3F4F6;">` +
            `<span data-sc-label style="font-size:14px;color:#6B7280;">${escapeHtml(label)}</span>` +
            `<span data-sc-value data-sc-value-color="${color}" style="font-size:14px;font-weight:600;color:${color};">${escapeHtml(value)}</span>` +
        `</div>`
    );
}

function buildProgressRow(label: string, pct: number, color = '#0046A4'): string {
    return (
        `<div data-sc-row data-sc-row-type="progress" style="padding:10px 0;">` +
            `<div style="display:flex;justify-content:space-between;margin-bottom:6px;">` +
                `<span data-sc-label style="font-size:14px;color:#6B7280;">${escapeHtml(label)}</span>` +
                `<span data-sc-progress-pct data-sc-progress-color="${color}" style="font-size:14px;font-weight:600;color:${color};">${pct}%</span>` +
            `</div>` +
            `<div style="height:6px;border-radius:3px;background:#F3F4F6;">` +
                `<div data-sc-progress-bar data-sc-progress-color="${color}" style="height:100%;border-radius:3px;background:${color};width:${pct}%;"></div>` +
            `</div>` +
        `</div>`
    );
}

interface ButtonOpts {
    primaryLabel?: string;
    primaryVisible?: boolean;
    secondaryLabel?: string;
    secondaryVisible?: boolean;
}

function buildButtons(opts: ButtonOpts = {}): string {
    const {
        primaryLabel = '확인하기',
        primaryVisible = true,
        secondaryLabel = '내역 보기',
        secondaryVisible = false,
    } = opts;
    return (
        `<div data-sc-buttons style="padding:12px 16px 16px;display:flex;gap:8px;">` +
            `<a data-sc-btn="primary" data-sc-btn-visible="${primaryVisible}" href="#" style="${primaryVisible ? 'flex:1;display:block' : 'display:none;flex:1'};text-align:center;padding:10px 0;border-radius:8px;background:#0046A4;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;">${escapeHtml(primaryLabel)}</a>` +
            `<a data-sc-btn="secondary" data-sc-btn-visible="${secondaryVisible}" href="#" style="${secondaryVisible ? 'flex:1;display:block' : 'display:none;flex:1'};text-align:center;padding:10px 0;border-radius:8px;border:1px solid #0046A4;color:#0046A4;font-size:14px;font-weight:600;text-decoration:none;">${escapeHtml(secondaryLabel)}</a>` +
        `</div>`
    );
}

interface MakeHtmlOptions {
    title?: string;
    badge?: string;
    buttons?: ButtonOpts;
    variant?: 'mobile' | 'web' | 'responsive';
}

function makeHtml(rows: string[], opts: MakeHtmlOptions = {}): string {
    const {
        title = '포인트·리워드 현황',
        badge,
        buttons,
        variant = 'mobile',
    } = opts;

    let rootStyle: string;
    switch (variant) {
        case 'web':
            rootStyle = `font-family:${FONT};background:#ffffff;border-radius:12px;max-width:480px;margin:0 auto;box-shadow:0 1px 4px rgba(0,0,0,0.08);`;
            break;
        case 'responsive':
            rootStyle = `font-family:${FONT};background:#ffffff;border-radius:12px;width:100%;box-sizing:border-box;box-shadow:0 1px 4px rgba(0,0,0,0.08);`;
            break;
        default:
            rootStyle = `font-family:${FONT};background:#ffffff;border-radius:12px;margin:0 16px;box-shadow:0 1px 4px rgba(0,0,0,0.08);`;
    }

    return `
<!DOCTYPE html><html><head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>* { box-sizing: border-box; } body { margin: 0; }</style>
</head><body>
  <div data-component-id="status-card-${variant}" data-spw-block style="${rootStyle}">
    ${buildHeader(title, badge)}
    <div data-sc-rows style="padding:0 16px;">
      ${rows.join('\n      ')}
    </div>
    ${buildButtons(buttons)}
  </div>
</body></html>
`;
}

// ── 테스트 데이터 상수 ────────────────────────────────────────────────────

const DEFAULT_ROWS = [
    buildTextRow('항목 1', '값 1'),
    buildTextRow('항목 2', '값 2'),
    buildProgressRow('진행률', 40),
];

const NORMAL_HTML = makeHtml(DEFAULT_ROWS);
const WEB_HTML = makeHtml(DEFAULT_ROWS, { variant: 'web' });

const EMPTY_ROWS_HTML = makeHtml([]);

const PROGRESS_0_HTML = makeHtml([buildProgressRow('진행률', 0)]);
const PROGRESS_OVER_HTML = makeHtml([buildProgressRow('초과 진행률', 120)]);

const LONG_VALUE_HTML = makeHtml([
    buildTextRow('매우 긴 항목', '이것은 매우 긴 값 텍스트로 레이아웃이 깨지는지 확인합니다 서른자 이상의 문자열'),
]);

const MANY_ROWS_HTML = makeHtml(
    Array.from({ length: 12 }, (_, i) => buildTextRow(`항목 ${i + 1}`, `값 ${i + 1}`)),
);

const XSS_HTML = makeHtml([
    buildTextRow('<script>window.__xss=1</script>XSS라벨', '<img onerror="window.__alert=1" src=x>XSS값'),
]);

const COLOR_HTML = makeHtml([
    buildTextRow('빨간 값', '12,345원', '#E53E3E'),
    buildProgressRow('파란 바', 60, '#2563EB'),
]);

// ── 공통 체크 ─────────────────────────────────────────────────────────────

test.describe('status-card — 공통 체크', () => {
    test.beforeEach(async ({ page }) => {
        await page.setContent(NORMAL_HTML);
    });

    test('공통 레이아웃·접근성 기준 충족', async ({ page }) => {
        await runCommonChecks(page, {
            componentIdPrefix: 'status-card',
            // 버튼 높이 38px (padding 10px + font 14px) — 네이티브 버튼 스타일
            minTouchSize: 38,
        });
    });
});

// ── 기기별 뷰포트 ─────────────────────────────────────────────────────────

test.describe('status-card — 기기별 뷰포트', () => {
    const ROOT = '[data-component-id^="status-card"]';

    test('iPhone SE (375px)', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.setContent(NORMAL_HTML);
        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, ROOT);
    });

    test('Galaxy S (360px)', async ({ page }) => {
        await page.setViewportSize({ width: 360, height: 780 });
        await page.setContent(NORMAL_HTML);
        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, ROOT);
    });

    test('iPhone Pro Max (430px)', async ({ page }) => {
        await page.setViewportSize({ width: 430, height: 932 });
        await page.setContent(NORMAL_HTML);
        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, ROOT);
    });
});

// ── 반응형 브레이크포인트 ─────────────────────────────────────────────────

test.describe('status-card — 반응형 브레이크포인트', () => {
    const ROOT = '[data-component-id^="status-card"]';

    test('767px — 모바일 경계', async ({ page }) => {
        await page.setViewportSize({ width: 767, height: 900 });
        await page.setContent(NORMAL_HTML);
        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, ROOT);
    });

    test('768px — 태블릿 경계', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.setContent(NORMAL_HTML);
        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, ROOT);
    });

    test('1440px — 데스크탑', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.setContent(WEB_HTML);
        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, ROOT);
    });
});

// ── 뷰어(/view) 렌더링 ───────────────────────────────────────────────────

test.describe('status-card — 뷰어 렌더링', () => {
    // eslint-disable-next-line playwright/no-skipped-test
    test.skip(!!process.env.CI, 'CI 환경: Oracle DB 없음 — 로컬에서만 실행');

    test('/view 접근 시 정상 렌더링됨', async ({ page }) => {
        await page.goto('/view');
        await page.waitForLoadState('domcontentloaded');
        await expect(page).not.toHaveTitle(/error|500|404/i);
        await expect(page.locator('body')).toBeVisible();
    });
});

// ── 정상 동작 ─────────────────────────────────────────────────────────────

test.describe('status-card — 정상 동작', () => {
    test.beforeEach(async ({ page }) => {
        await page.setContent(NORMAL_HTML);
    });

    test('헤더(제목)가 렌더링됨', async ({ page }) => {
        const title = page.locator('[data-sc-title]');
        await expect(title).toContainText('포인트·리워드 현황');
    });

    test('텍스트 행(레이블·값)이 렌더링됨', async ({ page }) => {
        const textRows = page.locator('[data-sc-row][data-sc-row-type="text"]');
        expect(await textRows.count()).toBe(2);

        await expect(page.locator('[data-sc-label]').first()).toContainText('항목 1');
        await expect(page.locator('[data-sc-value]').first()).toContainText('값 1');
    });

    test('프로그레스바 행(레이블·진행률·바)이 렌더링됨', async ({ page }) => {
        const progressRows = page.locator('[data-sc-row][data-sc-row-type="progress"]');
        expect(await progressRows.count()).toBe(1);

        await expect(page.locator('[data-sc-progress-pct]').first()).toContainText('40%');
        await expect(page.locator('[data-sc-progress-bar]')).toBeAttached();
    });

    test('프로그레스바 width가 설정된 % 값과 일치', async ({ page }) => {
        const bar = page.locator('[data-sc-progress-bar]');
        const width = await bar.evaluate((el) => el.style.width);
        expect(width).toBe('40%');
    });

    test('버튼(primary)이 렌더링됨', async ({ page }) => {
        const btn = page.locator('[data-sc-btn="primary"]');
        await expect(btn).toBeVisible();
        await expect(btn).toContainText('확인하기');
    });

    test('값 텍스트 색상이 설정값과 일치', async ({ page }) => {
        await page.setContent(COLOR_HTML);

        const redValue = page.locator('[data-sc-value][data-sc-value-color="#E53E3E"]');
        const color = await redValue.evaluate((el) => getComputedStyle(el).color);
        // #E53E3E → rgb(229, 62, 62)
        expect(color).toBe('rgb(229, 62, 62)');
    });

    test('프로그레스바 색상이 설정값과 일치', async ({ page }) => {
        await page.setContent(COLOR_HTML);

        const blueBar = page.locator('[data-sc-progress-bar][data-sc-progress-color="#2563EB"]');
        const bg = await blueBar.evaluate((el) => getComputedStyle(el).backgroundColor);
        // #2563EB → rgb(37, 99, 235)
        expect(bg).toBe('rgb(37, 99, 235)');
    });
});

// ── 레이아웃 모드 ─────────────────────────────────────────────────────────

test.describe('status-card — 레이아웃 모드', () => {
    test('모바일 — margin 16px 카드', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.setContent(NORMAL_HTML);

        const root = page.locator('[data-component-id="status-card-mobile"]');
        const margin = await root.evaluate((el) => getComputedStyle(el).margin);
        // margin: 0 16px → "0px 16px"
        expect(margin).toContain('16px');
    });

    test('웹 — max-width 480px 중앙 정렬', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.setContent(WEB_HTML);

        const root = page.locator('[data-component-id="status-card-web"]');
        const maxW = await root.evaluate((el) => getComputedStyle(el).maxWidth);
        expect(maxW).toBe('480px');

        const marginLeft = await root.evaluate((el) => getComputedStyle(el).marginLeft);
        const marginRight = await root.evaluate((el) => getComputedStyle(el).marginRight);
        // auto margin → 같은 값
        expect(marginLeft).toBe(marginRight);
    });
});

// ── 예외 처리 ─────────────────────────────────────────────────────────────

test.describe('status-card — 예외 처리', () => {
    test('프로그레스바 0% → 바 width 0', async ({ page }) => {
        await page.setContent(PROGRESS_0_HTML);

        const bar = page.locator('[data-sc-progress-bar]');
        const width = await bar.evaluate((el) => el.style.width);
        expect(width).toBe('0%');
        await expect(page.locator('[data-sc-progress-pct]')).toContainText('0%');
    });

    test('프로그레스바 120% 초과 → 컴포넌트 렌더링 정상', async ({ page }) => {
        await page.setContent(PROGRESS_OVER_HTML);

        // 120% 텍스트가 표시됨
        await expect(page.locator('[data-sc-progress-pct]')).toContainText('120%');
        // 프로그레스바가 존재함 (width:120%로 overflow 발생 가능하지만 컴포넌트 자체는 렌더링됨)
        await expect(page.locator('[data-sc-progress-bar]')).toBeAttached();
        // 컴포넌트 루트가 정상 렌더링됨
        await expect(page.locator('[data-component-id^="status-card"]')).toBeVisible();
    });

    test('행 0개 → 빈 카드 정상 렌더링', async ({ page }) => {
        await page.setContent(EMPTY_ROWS_HTML);

        await expect(page.locator('[data-component-id^="status-card"]')).toBeAttached();
        await expect(page.locator('[data-sc-title]')).toContainText('포인트·리워드 현황');

        const rows = page.locator('[data-sc-row]');
        expect(await rows.count()).toBe(0);

        await checkNoHorizontalScroll(page);
    });
});

// ── 엣지 케이스 ───────────────────────────────────────────────────────────

test.describe('status-card — 엣지 케이스', () => {
    test('값 텍스트 30자+ → 레이아웃 유지 (가로 스크롤 없음)', async ({ page }) => {
        await page.setContent(LONG_VALUE_HTML);
        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, '[data-component-id^="status-card"]');
    });

    test('행 12개 이상 → 카드 높이 자연 확장', async ({ page }) => {
        await page.setContent(MANY_ROWS_HTML);

        const rows = page.locator('[data-sc-row]');
        expect(await rows.count()).toBe(12);

        await checkNoHorizontalScroll(page);
    });

    test('XSS — 레이블/값에 script 삽입 시 실행되지 않음', async ({ page }) => {
        await page.setContent(XSS_HTML);

        // script 엘리먼트가 DOM에 삽입되지 않음
        const scriptCount = await page.evaluate(
            () => document.querySelectorAll('[data-component-id^="status-card"] script').length,
        );
        expect(scriptCount).toBe(0);

        // window.__xss 설정되지 않음
        const xssFired = await page.evaluate(() => (window as Record<string, unknown>).__xss);
        expect(xssFired).toBeUndefined();

        // window.__alert 설정되지 않음
        const alertFired = await page.evaluate(() => (window as Record<string, unknown>).__alert);
        expect(alertFired).toBeUndefined();
    });
});
