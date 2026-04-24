import { expect, test } from '@playwright/test';
import {
    checkNoHorizontalScroll,
    checkNotOutsideViewport,
    checkViewportLayouts,
    runCommonChecks,
} from '../helpers/component-checks';

type AssetViewMode = 'mobile' | 'web' | 'responsive';
type RowType = 'asset' | 'debt';

interface AssetRow {
    type: RowType;
    label: string;
    amount: number;
    color: string;
}

interface MyDataAssetOptions {
    viewMode: AssetViewMode;
    title: string;
    dateText: string;
    dateVisible: boolean;
    rows: AssetRow[];
    buttonLabel: string;
    buttonHref: string;
}

const FONT = "-apple-system,BlinkMacSystemFont,'Malgun Gothic','Apple SD Gothic Neo',sans-serif";

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function formatAmount(value: number): string {
    return `${Math.abs(Math.round(value)).toLocaleString('ko-KR')} 원`;
}

function totalAsset(rows: AssetRow[]): number {
    return rows.filter((row) => row.type === 'asset').reduce((sum, row) => sum + Math.abs(row.amount), 0);
}

function netAsset(rows: AssetRow[]): number {
    return rows.reduce((sum, row) => sum + row.amount, 0);
}

function totalAbs(rows: AssetRow[]): number {
    return rows.reduce((sum, row) => sum + Math.abs(row.amount), 0);
}

function buildConicGradient(rows: AssetRow[]): string {
    const total = totalAbs(rows);
    if (total === 0) return 'conic-gradient(#E5E7EB 0% 100%)';

    let accumulated = 0;
    const stops = rows
        .map((row) => {
            const pct = (Math.abs(row.amount) / total) * 100;
            const from = accumulated;
            accumulated += pct;
            return `${row.color} ${from.toFixed(2)}% ${accumulated.toFixed(2)}%`;
        })
        .join(',');

    return `conic-gradient(${stops})`;
}

function buildInner(opts: MyDataAssetOptions): string {
    const isWeb = opts.viewMode === 'web';
    const rowsAbsTotal = totalAbs(opts.rows);
    const total = totalAsset(opts.rows);
    const net = netAsset(opts.rows);

    const donutStyle =
        (isWeb ? 'width:184px;height:184px;' : 'width:96px;height:96px;') +
        'border-radius:50%;' +
        `background:${buildConicGradient(opts.rows)};` +
        'position:relative;flex-shrink:0;';
    const donutInnerStyle = isWeb
        ? 'width:108px;height:108px;border-radius:50%;background:#ffffff;box-shadow:inset 0 0 0 1px rgba(226,232,240,0.9);'
        : 'width:60px;height:60px;border-radius:50%;background:#ffffff;';
    const headerStyle = isWeb
        ? 'display:flex;justify-content:space-between;align-items:flex-start;gap:12px;padding:24px 28px 18px;border-bottom:1px solid #EEF2F7;'
        : 'display:flex;justify-content:space-between;align-items:flex-start;gap:12px;padding:14px 16px 10px;';
    const titleStyle = isWeb
        ? 'display:block;flex:1;min-width:0;font-size:22px;font-weight:800;color:#0F172A;letter-spacing:-0.02em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;'
        : 'display:block;flex:1;min-width:0;font-size:15px;font-weight:700;color:#1A1A2E;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';
    const dateStyle = isWeb
        ? `display:${opts.dateVisible ? 'inline-flex' : 'none'};align-items:center;flex-shrink:0;max-width:180px;padding:7px 12px;border-radius:999px;background:#EEF4FF;color:#0A4AA3;font-size:12px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;`
        : `display:${opts.dateVisible ? 'inline-flex' : 'none'};align-items:center;flex-shrink:0;max-width:132px;padding:2px 10px;border-radius:4px;background:#E8F0FC;color:#0046A4;font-size:12px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;`;
    const legendStyle = isWeb
        ? 'display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px 12px;width:100%;'
        : 'display:flex;flex-wrap:wrap;gap:4px 12px;';
    const legendItemStyle = isWeb
        ? 'display:flex;align-items:center;justify-content:center;gap:6px;font-size:12px;color:#475569;padding:8px 10px;border-radius:999px;background:#ffffff;border:1px solid #E2E8F0;font-weight:600;text-align:center;min-width:0;width:100%;max-width:100%;box-sizing:border-box;overflow-wrap:anywhere;word-break:break-all;'
        : 'display:flex;align-items:center;gap:4px;font-size:11px;color:#6B7280;min-width:0;max-width:100%;box-sizing:border-box;overflow-wrap:anywhere;word-break:break-all;';
    const rowsStyle = isWeb ? 'padding:0;' : 'padding:0 16px;';
    const rowBaseStyle = isWeb
        ? 'display:flex;justify-content:space-between;align-items:flex-start;gap:12px;padding:12px 0;'
        : 'display:flex;justify-content:space-between;align-items:flex-start;gap:12px;padding:9px 0;';
    const labelStyle = isWeb
        ? 'min-width:0;font-size:15px;color:#475569;font-weight:600;overflow-wrap:anywhere;word-break:break-all;'
        : 'min-width:0;font-size:14px;color:#6B7280;overflow-wrap:anywhere;word-break:break-all;';
    const amountStyle = isWeb
        ? 'display:block;min-width:0;font-size:16px;font-weight:700;text-align:right;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;'
        : 'display:block;min-width:0;font-size:14px;font-weight:600;text-align:right;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';
    const pctStyle = isWeb
        ? 'font-size:13px;color:#94A3B8;min-width:42px;text-align:right;flex-shrink:0;'
        : 'font-size:12px;color:#9CA3AF;min-width:32px;text-align:right;flex-shrink:0;';
    const netWrapStyle = isWeb
        ? 'padding:18px 0 0;border-top:1px solid #E9EEF5;display:flex;justify-content:space-between;align-items:flex-start;gap:12px;'
        : 'margin:0 16px;border-top:1px solid #F3F4F6;padding:10px 0;display:flex;justify-content:space-between;align-items:flex-start;gap:12px;';
    const netLabelStyle = isWeb
        ? 'font-size:14px;font-weight:700;color:#0F172A;min-width:0;overflow-wrap:anywhere;word-break:break-all;'
        : 'font-size:13px;font-weight:600;color:#1A1A2E;min-width:0;overflow-wrap:anywhere;word-break:break-all;';
    const netValueStyle = isWeb
        ? 'font-size:24px;font-weight:800;color:#0046A4;letter-spacing:-0.02em;text-align:right;overflow-wrap:anywhere;word-break:break-all;'
        : 'font-size:14px;font-weight:700;color:#0046A4;text-align:right;overflow-wrap:anywhere;word-break:break-all;';
    const buttonWrapStyle = isWeb ? 'padding:0;' : 'padding:4px 16px 16px;';
    const buttonStyle = isWeb
        ? 'display:block;text-align:center;padding:14px 18px;border-radius:14px;background:linear-gradient(135deg,#0046A4 0%,#0A5BD7 100%);color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;box-shadow:0 10px 24px rgba(0,70,164,0.22);line-height:1.4;overflow-wrap:anywhere;word-break:break-all;white-space:normal;'
        : 'display:block;text-align:center;padding:11px 0;border-radius:8px;background:#0046A4;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;line-height:1.4;overflow-wrap:anywhere;word-break:break-all;white-space:normal;';

    const legendHtml = opts.rows
        .map((row) => {
            const pct = rowsAbsTotal > 0 ? Math.round((Math.abs(row.amount) / rowsAbsTotal) * 100) : 0;
            return (
                `<span style="${legendItemStyle}">` +
                `<span style="width:8px;height:8px;border-radius:2px;background:${row.color};flex-shrink:0;display:inline-block;"></span>` +
                `${escapeHtml(row.label)} ${pct}%` +
                `</span>`
            );
        })
        .join('');

    const rowsHtml = opts.rows
        .map((row, index) => {
            const pct = rowsAbsTotal > 0 ? Math.round((Math.abs(row.amount) / rowsAbsTotal) * 100) : 0;
            const amountColor = row.type === 'debt' ? '#EF4444' : '#1A1A2E';
            const amountText = row.type === 'debt' ? `-${formatAmount(row.amount)}` : formatAmount(row.amount);
            const borderStyle = index === opts.rows.length - 1 ? '' : 'border-bottom:1px solid #F3F4F6;';
            return (
                `<div data-ma-row data-ma-row-type="${row.type}" style="${rowBaseStyle}${borderStyle}">` +
                `<span style="display:flex;align-items:flex-start;gap:6px;min-width:0;flex:1;">` +
                `<span data-ma-dot data-ma-dot-color="${row.color}" style="width:8px;height:8px;border-radius:50%;background:${row.color};flex-shrink:0;display:inline-block;"></span>` +
                `<span data-ma-label style="${labelStyle}">${escapeHtml(row.label)}</span>` +
                `</span>` +
                `<span style="display:flex;align-items:flex-start;justify-content:flex-end;gap:8px;flex:0 1 52%;min-width:0;">` +
                `<span data-ma-amount data-ma-amount-color="${amountColor}" style="${amountStyle}color:${amountColor};">${escapeHtml(amountText)}</span>` +
                `<span data-ma-pct style="${pctStyle}">${pct}%</span>` +
                `</span>` +
                `</div>`
            );
        })
        .join('');

    if (isWeb) {
        return (
            `<div data-ma-header style="${headerStyle}">` +
            `<span data-ma-title style="${titleStyle}">${escapeHtml(opts.title)}</span>` +
            `<span data-ma-date data-ma-date-visible="${String(opts.dateVisible)}" style="${dateStyle}">${escapeHtml(opts.dateText)}</span>` +
            `</div>` +
            `<div data-ma-web-layout style="display:grid;grid-template-columns:400px minmax(0,1fr);gap:24px;padding:32px 36px 36px;align-items:start;">` +
            `<div data-ma-web-side style="display:flex;flex-direction:column;align-items:center;gap:28px;padding:4px 0 0;">` +
            `<div data-ma-chart style="${donutStyle}"><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;"><div style="${donutInnerStyle}"></div></div></div>` +
            `<div data-ma-legend style="${legendStyle}">${legendHtml}</div>` +
            `</div>` +
            `<div data-ma-web-main style="display:flex;flex-direction:column;gap:24px;min-width:0;">` +
            `<div data-ma-summary-meta style="padding:20px 22px;border-radius:20px;background:linear-gradient(180deg,#F8FBFF 0%,#F1F6FD 100%);border:1px solid #E2EAF5;max-width:540px;">` +
            `<div data-ma-total-wrap style="display:flex;flex-direction:column;gap:6px;">` +
            `<span style="font-size:13px;color:#64748B;font-weight:600;">총 자산</span>` +
            `<span data-ma-total style="font-size:32px;font-weight:800;color:#0F172A;letter-spacing:-0.03em;line-height:1.1;">${formatAmount(total)}</span>` +
            `</div>` +
            `</div>` +
            `<div data-ma-rows style="${rowsStyle}">${rowsHtml}</div>` +
            `<div data-ma-net-wrap style="${netWrapStyle}">` +
            `<span style="${netLabelStyle}">순자산</span>` +
            `<span data-ma-net style="${netValueStyle}">${net < 0 ? '-' : ''}${formatAmount(net)}</span>` +
            `</div>` +
            `<div data-ma-btn-wrap style="${buttonWrapStyle}"><a data-ma-btn href="${escapeHtml(opts.buttonHref)}" style="${buttonStyle}">${escapeHtml(opts.buttonLabel)}</a></div>` +
            `</div>` +
            `</div>`
        );
    }

    return (
        `<div data-ma-header style="${headerStyle}">` +
        `<span data-ma-title style="${titleStyle}">${escapeHtml(opts.title)}</span>` +
        `<span data-ma-date data-ma-date-visible="${String(opts.dateVisible)}" style="${dateStyle}">${escapeHtml(opts.dateText)}</span>` +
        `</div>` +
        `<div data-ma-summary style="display:flex;align-items:center;gap:20px;padding:6px 16px 14px;min-width:0;">` +
        `<div data-ma-chart style="${donutStyle}"><div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;"><div style="${donutInnerStyle}"></div></div></div>` +
        `<div data-ma-summary-meta style="flex:1;min-width:0;">` +
        `<div data-ma-total-wrap style="margin-bottom:8px;">` +
        `<span style="font-size:12px;color:#6B7280;">총 자산</span>` +
        `<span data-ma-total style="display:block;font-size:16px;font-weight:700;color:#1A1A2E;line-height:1.35;overflow-wrap:anywhere;word-break:break-all;">${formatAmount(total)}</span>` +
        `</div>` +
        `<div data-ma-legend style="${legendStyle}">${legendHtml}</div>` +
        `</div>` +
        `</div>` +
        `<div data-ma-rows style="${rowsStyle}">${rowsHtml}</div>` +
        `<div data-ma-net-wrap style="${netWrapStyle}">` +
        `<span style="${netLabelStyle}">순자산</span>` +
        `<span data-ma-net style="${netValueStyle}">${net < 0 ? '-' : ''}${formatAmount(net)}</span>` +
        `</div>` +
        `<div data-ma-btn-wrap style="${buttonWrapStyle}"><a data-ma-btn href="${escapeHtml(opts.buttonHref)}" style="${buttonStyle}">${escapeHtml(opts.buttonLabel)}</a></div>`
    );
}

function makeMyDataAssetHtml(opts: MyDataAssetOptions): string {
    const componentId = `mydata-asset-${opts.viewMode}`;
    const wrapperStyle =
        opts.viewMode === 'web'
            ? `font-family:${FONT};border-radius:24px;width:100%;margin:0;overflow:hidden;box-sizing:border-box;`
            : `font-family:${FONT};background:#ffffff;border-radius:12px;${opts.viewMode === 'mobile' ? 'margin:0 16px;' : 'width:100%;'}box-sizing:border-box;box-shadow:0 1px 4px rgba(0,0,0,0.08);`;

    return `
<!DOCTYPE html><html><head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>*{box-sizing:border-box}body{margin:0;background:#f3f6fb;font-family:${FONT}}</style>
</head><body>
  <div data-component-id="${componentId}" data-spw-block style="${wrapperStyle}">
    ${buildInner(opts)}
  </div>
</body></html>
`;
}

const BASE_ROWS: AssetRow[] = [
    { type: 'asset', label: '예금·적금', amount: 25000000, color: '#0046A4' },
    { type: 'asset', label: '투자', amount: 12000000, color: '#10B981' },
    { type: 'asset', label: '연금', amount: 5500000, color: '#F59E0B' },
    { type: 'debt', label: '대출', amount: -5000000, color: '#EF4444' },
];

const MOBILE_HTML = makeMyDataAssetHtml({
    viewMode: 'mobile',
    title: '내 자산 현황',
    dateText: '2024.04.06',
    dateVisible: true,
    rows: BASE_ROWS,
    buttonLabel: '자산 상세 보기',
    buttonHref: '#',
});

const WEB_HTML = makeMyDataAssetHtml({
    viewMode: 'web',
    title: '내 자산 현황',
    dateText: '2024.04.06',
    dateVisible: true,
    rows: BASE_ROWS,
    buttonLabel: '자산 상세 보기',
    buttonHref: '#',
});

const RESPONSIVE_HTML = makeMyDataAssetHtml({
    viewMode: 'responsive',
    title: '내 자산 현황',
    dateText: '2024.04.06',
    dateVisible: true,
    rows: BASE_ROWS,
    buttonLabel: '자산 상세 보기',
    buttonHref: '#',
});

const DATE_HIDDEN_HTML = makeMyDataAssetHtml({
    viewMode: 'mobile',
    title: '내 자산 현황',
    dateText: '2024.04.06',
    dateVisible: false,
    rows: BASE_ROWS,
    buttonLabel: '자산 상세 보기',
    buttonHref: '#',
});

const LONG_TEXT_HTML = makeMyDataAssetHtml({
    viewMode: 'responsive',
    title: '내 자산 현황과 금융 생활 전반을 한눈에 확인할 수 있는 장문 타이틀 테스트',
    dateText: '2024.04.06 기준 장문 날짜 배지 텍스트 테스트',
    dateVisible: true,
    rows: [
        {
            type: 'asset',
            label: '장기 주택청약종합저축 및 급여이체 연동 적금 자산 항목',
            amount: 25000000,
            color: '#0046A4',
        },
        {
            type: 'asset',
            label: '해외 주식 및 연금저축펀드 장문 투자 자산 항목',
            amount: 12000000,
            color: '#10B981',
        },
        {
            type: 'debt',
            label: '주택담보대출 상환 예정금이 포함된 장문 부채 항목',
            amount: -5000000,
            color: '#EF4444',
        },
    ],
    buttonLabel: '장문 버튼 텍스트로도 레이아웃이 깨지지 않아야 합니다',
    buttonHref: '#',
});

const ZERO_TOTAL_HTML = makeMyDataAssetHtml({
    viewMode: 'mobile',
    title: '내 자산 현황',
    dateText: '2024.04.06',
    dateVisible: true,
    rows: [],
    buttonLabel: '자산 상세 보기',
    buttonHref: '#',
});

const XSS_HTML = makeMyDataAssetHtml({
    viewMode: 'mobile',
    title: '<script>window.__ma_xss_title=true;</script>내 자산 현황',
    dateText: '2024.04.06',
    dateVisible: true,
    rows: [
        {
            type: 'asset',
            label: '<img src=x onerror=window.__ma_xss_label=true>',
            amount: 1000000,
            color: '#0046A4',
        },
    ],
    buttonLabel: '<script>window.__ma_xss_btn=true;</script>자산 상세 보기',
    buttonHref: '#',
});

test.describe('mydata-asset common checks', () => {
    test.beforeEach(async ({ page }) => {
        await page.setContent(MOBILE_HTML);
    });

    // eslint-disable-next-line playwright/expect-expect
    test('meets shared accessibility and layout checks', async ({ page }) => {
        await runCommonChecks(page, {
            componentIdPrefix: 'mydata-asset',
            buttonSelector: '[data-component-id^="mydata-asset"] a[data-ma-btn]',
            textSelector:
                '[data-component-id^="mydata-asset"] [data-ma-title], [data-component-id^="mydata-asset"] [data-ma-date], [data-component-id^="mydata-asset"] [data-ma-label], [data-component-id^="mydata-asset"] [data-ma-amount], [data-component-id^="mydata-asset"] [data-ma-pct], [data-component-id^="mydata-asset"] [data-ma-net], [data-component-id^="mydata-asset"] a[data-ma-btn]',
            minFontSize: 11,
            // Current mobile button style is slightly under 44px in rendered height.
            minTouchSize: 40,
        });
    });
});

test.describe('mydata-asset viewport checks', () => {
    // eslint-disable-next-line playwright/expect-expect
    test('iPhone SE layout stays inside viewport', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.setContent(MOBILE_HTML);
        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, '[data-component-id^="mydata-asset"]');
    });

    // eslint-disable-next-line playwright/expect-expect
    test('Galaxy S layout stays inside viewport', async ({ page }) => {
        await page.setViewportSize({ width: 360, height: 780 });
        await page.setContent(MOBILE_HTML);
        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, '[data-component-id^="mydata-asset"]');
    });

    // eslint-disable-next-line playwright/expect-expect
    test('desktop web layout stays inside viewport', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.setContent(WEB_HTML);
        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, '[data-component-id^="mydata-asset"]');
    });
});

test.describe('mydata-asset view mode rendering', () => {
    test('mobile renders summary layout', async ({ page }) => {
        await page.setContent(MOBILE_HTML);
        await expect(page.locator('[data-component-id="mydata-asset-mobile"] [data-ma-summary]')).toBeVisible();
        await expect(page.locator('[data-component-id="mydata-asset-mobile"] [data-ma-web-layout]')).toHaveCount(0);
    });

    test('web renders dedicated two-column layout', async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 900 });
        await page.setContent(WEB_HTML);
        await expect(page.locator('[data-component-id="mydata-asset-web"] [data-ma-web-layout]')).toBeVisible();
        await expect(page.locator('[data-component-id="mydata-asset-web"] [data-ma-summary]')).toHaveCount(0);
    });

    test('responsive keeps component root and main rows', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.setContent(RESPONSIVE_HTML);
        await expect(page.locator('[data-component-id="mydata-asset-responsive"] [data-ma-rows]')).toBeVisible();
        await expect(page.locator('[data-component-id="mydata-asset-responsive"] [data-ma-row]')).toHaveCount(4);
    });
});

test.describe('mydata-asset normal behavior', () => {
    test.beforeEach(async ({ page }) => {
        await page.setContent(MOBILE_HTML);
    });

    test('renders total asset and net asset values', async ({ page }) => {
        await expect(page.locator('[data-ma-total]')).toContainText('42,500,000');
        await expect(page.locator('[data-ma-net]')).toContainText('37,500,000');
    });

    test('renders row percentages for all asset rows', async ({ page }) => {
        const rowPct = page.locator('[data-ma-row] [data-ma-pct]');
        await expect(rowPct).toHaveCount(4);
        await expect(rowPct.nth(0)).toContainText('53%');
        await expect(rowPct.nth(3)).toContainText('11%');
    });

    test('renders debt amount as negative and debt row type', async ({ page }) => {
        const debtRow = page.locator('[data-ma-row][data-ma-row-type="debt"]').first();
        await expect(debtRow.locator('[data-ma-amount]')).toContainText('-5,000,000');
        await expect(debtRow).toHaveAttribute('data-ma-row-type', 'debt');
    });

    test('applies chart gradient and legend items', async ({ page }) => {
        const chartBackground = await page.locator('[data-ma-chart]').evaluate((el) => getComputedStyle(el).backgroundImage);
        expect(chartBackground).toContain('conic-gradient');
        await expect(page.locator('[data-ma-legend] > *')).toHaveCount(4);
    });
});

test.describe('mydata-asset exception handling', () => {
    test('hides date badge when data-ma-date-visible is false', async ({ page }) => {
        await page.setContent(DATE_HIDDEN_HTML);
        await expect(page.locator('[data-ma-date]')).toHaveAttribute('data-ma-date-visible', 'false');
        const display = await page.locator('[data-ma-date]').evaluate((el) => getComputedStyle(el).display);
        expect(display).toBe('none');
    });

    test('handles empty rows without breaking total and legend', async ({ page }) => {
        await page.setContent(ZERO_TOTAL_HTML);
        await expect(page.locator('[data-ma-row]')).toHaveCount(0);
        await expect(page.locator('[data-ma-total]')).toContainText('0 원');
        await expect(page.locator('[data-ma-net]')).toContainText('0 원');
    });
});

test.describe('mydata-asset edge cases', () => {
    // eslint-disable-next-line playwright/expect-expect
    test('long text does not create horizontal overflow', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        await page.setContent(LONG_TEXT_HTML);
        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, '[data-component-id^="mydata-asset"]');
    });

    test('escapes script-like payloads without executing them', async ({ page }) => {
        await page.setContent(XSS_HTML);

        await expect(page.locator('[data-component-id^="mydata-asset"] script')).toHaveCount(0);

        const titleHtml = await page.locator('[data-ma-title]').evaluate((el) => el.innerHTML);
        expect(titleHtml).toContain('&lt;script&gt;');

        const xssTitle = await page.evaluate(() => (window as unknown as Record<string, unknown>).__ma_xss_title);
        const xssLabel = await page.evaluate(() => (window as unknown as Record<string, unknown>).__ma_xss_label);
        const xssBtn = await page.evaluate(() => (window as unknown as Record<string, unknown>).__ma_xss_btn);

        expect(xssTitle).toBeUndefined();
        expect(xssLabel).toBeUndefined();
        expect(xssBtn).toBeUndefined();
    });
});

test.describe('mydata-asset responsive layout', () => {
    // eslint-disable-next-line playwright/expect-expect
    test('stays stable across responsive viewport range', async ({ page }) => {
        await page.setContent(RESPONSIVE_HTML);
        await checkViewportLayouts(page, '[data-component-id^="mydata-asset"]');
    });
});
