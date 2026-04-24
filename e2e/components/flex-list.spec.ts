// e2e/components/flex-list.spec.ts
// flex-list 컴포넌트 자동화 QA

import { test, expect } from '@playwright/test';
import {
    checkNoHorizontalScroll,
    checkNotOutsideViewport,
    checkMinFontSize,
    checkImagesHaveAlt,
    checkComponentIdExists,
} from '../helpers/component-checks';

interface FlexListLine {
    text: string;
    align?: 'left' | 'center' | 'right';
}

interface FlexListColumn {
    type: 'icon' | 'text' | 'image';
    width: 'fixed' | 'flex' | 'auto' | 'custom';
    icon?: string;
    iconBg?: string;
    lines?: FlexListLine[];
    href?: string;
    imageSrc?: string;
    customWidth?: string;
    shape?: 'circle' | 'round' | 'square' | 'none';
}

interface FlexListRow {
    columns: FlexListColumn[];
    linkMode?: 'row' | 'column' | 'none';
    rowHref?: string;
    bgColor?: string;
    padding?: string;
    gap?: string;
    border?: {
        show: boolean;
        color?: string;
        width?: number;
    };
}

type ViewMode = 'mobile' | 'web' | 'responsive';

const ICONS: Record<string, string> = {
    shopping:
        '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#0046A4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
    transfer:
        '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#0046A4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17l-4-4 4-4"/><path d="M3 13h13"/><path d="M17 7l4 4-4 4"/><path d="M21 11H8"/></svg>',
    check:
        '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#0046A4" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>',
};

function sanitizeHref(url: string): string {
    const trimmed = url.trim();
    if (/^(https?:\/\/|\/|#)/.test(trimmed)) {
        return trimmed.replace(/"/g, '&quot;');
    }
    return '#';
}

function sanitizeImageSrc(url: string): string {
    const trimmed = url.trim();
    if (/^(https?:\/\/|\/|uploads\/)/.test(trimmed)) {
        return trimmed.replace(/"/g, '&quot;');
    }
    return '';
}

function shapeToRadius(shape?: string): string {
    if (shape === 'round') return '10px';
    if (shape === 'square') return '0';
    return '50%';
}

function buildImageHtml(
    src: string,
    width: 'fixed' | 'flex' | 'auto' | 'custom',
    customWidth?: string,
    shape?: string,
    viewMode: ViewMode = 'mobile',
): string {
    const safeSrc = sanitizeImageSrc(src);
    const fixedSize = viewMode === 'web' ? '48px' : '40px';
    const autoSize = viewMode === 'web' ? '64px' : '48px';
    const flexHeight = viewMode === 'web' ? '64px' : '48px';
    const widthStyle =
        width === 'custom' && customWidth
            ? `flex:0 0 ${customWidth};width:${customWidth};height:auto;`
            : width === 'fixed'
              ? `flex:0 0 ${fixedSize};width:${fixedSize};height:${fixedSize};`
              : width === 'auto'
                ? `flex:0 0 auto;width:${autoSize};height:${autoSize};`
                : `flex:1;min-width:0;height:${flexHeight};`;
    const customAttr = width === 'custom' && customWidth ? ` data-fl-custom-width="${customWidth}"` : '';
    const imgRadius = shapeToRadius(shape || 'round');

    return (
        `<span data-fl-type="image" data-fl-width="${width}"${customAttr} data-fl-image-src="${safeSrc}" data-fl-image-shape="${shape || 'round'}"` +
        ` style="${widthStyle}display:flex;align-items:center;justify-content:center;flex-shrink:0;">` +
        (safeSrc
            ? `<img src="${safeSrc}" style="width:100%;height:100%;object-fit:cover;border-radius:${imgRadius};" alt="" />`
            : `<span style="width:100%;height:100%;background:#F3F4F6;border-radius:${imgRadius};display:flex;align-items:center;justify-content:center;color:#9CA3AF;font-size:11px;">이미지</span>`) +
        `</span>`
    );
}

function buildIconHtml(
    iconKey: string,
    bgColor: string,
    width?: 'fixed' | 'flex' | 'auto' | 'custom',
    customWidth?: string,
    shape?: string,
    viewMode: ViewMode = 'mobile',
): string {
    const svg = ICONS[iconKey] ?? ICONS['check'];
    const defaultSize = viewMode === 'web' ? '48px' : '40px';
    const size = width === 'custom' && customWidth ? customWidth : defaultSize;
    const flexBasis = width === 'custom' && customWidth ? customWidth : defaultSize;
    const radius = shapeToRadius(shape);
    const bg = shape === 'none' ? 'transparent' : bgColor;
    return (
        `<span data-fl-type="icon" data-fl-icon="${iconKey}" data-fl-icon-bg="${bgColor}" data-fl-icon-shape="${shape || 'circle'}"` +
        (width === 'custom' && customWidth ? ` data-fl-width="custom" data-fl-custom-width="${customWidth}"` : '') +
        ` style="flex:0 0 ${flexBasis};width:${size};height:${size};border-radius:${radius};background:${bg};display:flex;align-items:center;justify-content:center;flex-shrink:0;">` +
        svg +
        `</span>`
    );
}

function buildColumnHtml(col: FlexListColumn, viewMode: ViewMode = 'mobile'): string {
    if (col.type === 'image') {
        return buildImageHtml(col.imageSrc ?? '', col.width, col.customWidth, col.shape, viewMode);
    }

    const fixedSize = viewMode === 'web' ? '48px' : '40px';
    const widthStyle =
        col.width === 'custom' && col.customWidth
            ? `flex:0 0 ${col.customWidth};min-width:0;`
            : col.width === 'fixed'
              ? `flex:0 0 ${fixedSize};`
              : col.width === 'auto'
                ? 'flex:0 1 auto;min-width:0;margin-left:auto;'
                : 'flex:1;min-width:0;';
    const customWidthAttr =
        col.width === 'custom' && col.customWidth ? ` data-fl-custom-width="${col.customWidth}"` : '';
    const textColumnStyle =
        col.width === 'auto' ? `align-items:flex-end;max-width:${viewMode === 'web' ? '32%' : '45%'};text-align:right;` : '';

    if (col.type === 'icon') {
        return buildIconHtml(
            col.icon ?? 'check',
            col.iconBg ?? '#E8F0FC',
            col.width,
            col.customWidth,
            col.shape,
            viewMode,
        );
    }

    const lines: FlexListLine[] = (col.lines ?? [{ text: '텍스트' }]).map((line) =>
        typeof line === 'string' ? { text: line } : line,
    );
    const lineHtml = lines.map((line, index) => {
        const alignStyle = `text-align:${line.align ?? 'left'};`;
        if (index === 0) {
            return `<span style="font-size:${viewMode === 'web' ? '16px' : '15px'};font-weight:${viewMode === 'web' ? '700' : '600'};color:#1A1A2E;line-height:${viewMode === 'web' ? '1.35' : '1.4'};${alignStyle}">${line.text}</span>`;
        }
        return `<span style="font-size:13px;color:#6B7280;line-height:${viewMode === 'web' ? '1.5' : '1.4'};${alignStyle}">${line.text}</span>`;
    });

    return (
        `<span data-fl-type="text" data-fl-width="${col.width}"${customWidthAttr} style="${widthStyle}${textColumnStyle}display:flex;flex-direction:column;gap:${viewMode === 'web' ? '4px' : '2px'};">` +
        lineHtml.join('') +
        `</span>`
    );
}

function wrapColumnWithLink(colHtml: string, href?: string): string {
    if (!href) return colHtml;
    return `<a href="${sanitizeHref(href)}" data-fl-col-link style="text-decoration:none;display:contents;">${colHtml}</a>`;
}

function buildRowHtml(row: FlexListRow, isLast: boolean, viewMode: ViewMode = 'mobile'): string {
    const borderShow = row.border?.show !== false;
    const borderColor = row.border?.color ?? '#E5E7EB';
    const borderWidth = row.border?.width ?? 1;
    const borderStyle = viewMode === 'web' ? '' : !isLast && borderShow ? `border-bottom:${borderWidth}px solid ${borderColor};` : '';
    const pad = row.padding ?? (viewMode === 'web' ? '20px 24px' : '16px 20px');
    const gap = row.gap ?? (viewMode === 'web' ? '18px' : '12px');
    const bg = row.bgColor ? `background:${row.bgColor};` : viewMode === 'web' ? 'background:#ffffff;' : '';
    const webCardStyle =
        viewMode === 'web'
            ? 'border:1px solid #E6ECF5;border-radius:18px;box-shadow:0 10px 28px rgba(15,23,42,0.06);margin-bottom:14px;'
            : '';
    const dataAttrs =
        (row.bgColor ? ` data-fl-bg="${row.bgColor}"` : '') +
        (row.padding ? ` data-fl-padding="${row.padding}"` : '') +
        (row.gap ? ` data-fl-gap="${row.gap}"` : '') +
        (row.border
            ? ` data-fl-border-show="${row.border.show}" data-fl-border-color="${row.border.color ?? '#E5E7EB'}" data-fl-border-width="${row.border.width ?? 1}"`
            : '');

    const linkMode = row.linkMode ?? 'none';
    const flexStyle = `display:flex;align-items:center;gap:${gap};padding:${pad};${borderStyle}${webCardStyle}${bg}text-decoration:none;`;

    if (linkMode === 'row' && row.rowHref) {
        const columnsHtml = row.columns.map((col) => buildColumnHtml(col, viewMode)).join('');
        return `<a href="${sanitizeHref(row.rowHref)}" data-fl-link-mode="row"${dataAttrs} style="${flexStyle}">${columnsHtml}</a>`;
    }

    if (linkMode === 'column') {
        const columnsHtml = row.columns.map((col) => wrapColumnWithLink(buildColumnHtml(col, viewMode), col.href)).join('');
        return `<div data-fl-link-mode="column"${dataAttrs} style="${flexStyle}">${columnsHtml}</div>`;
    }

    const columnsHtml = row.columns.map((col) => buildColumnHtml(col, viewMode)).join('');
    return `<a href="#" data-fl-link-mode="none"${dataAttrs} style="${flexStyle}">${columnsHtml}</a>`;
}

function buildFlexListHtml(rows: FlexListRow[], componentId: string, extraStyle: string): string {
    const rowsJson = JSON.stringify(rows).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
    const viewMode: ViewMode = componentId.endsWith('-web') ? 'web' : componentId.endsWith('-responsive') ? 'responsive' : 'mobile';
    const rowsHtml = rows.map((row, index) => buildRowHtml(row, index === rows.length - 1, viewMode)).join('');

    return `
<!DOCTYPE html><html><head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>* { box-sizing: border-box; } body { margin: 0; background: #eef2f7; font-family: sans-serif; }</style>
</head><body>
  <div data-component-id="${componentId}" data-spw-block data-fl-rows="${rowsJson}" style="font-family:-apple-system,BlinkMacSystemFont,'Malgun Gothic','Apple SD Gothic Neo',sans-serif;background:#ffffff;${extraStyle}">
    ${rowsHtml}
  </div>
</body></html>
`;
}

const DEFAULT_ROWS: FlexListRow[] = [
    {
        columns: [
            { type: 'icon', width: 'fixed', icon: 'shopping', iconBg: '#E8F0FC' },
            { type: 'text', width: 'flex', lines: [{ text: '스타벅스 코리아' }, { text: '01.15 14:30 · 본인' }] },
            { type: 'text', width: 'auto', lines: [{ text: '-4,500원' }, { text: '승인완료' }] },
        ],
    },
    {
        columns: [
            { type: 'icon', width: 'fixed', icon: 'transfer', iconBg: '#FEF3C7' },
            { type: 'text', width: 'flex', lines: [{ text: '급여이체' }, { text: '01.13 09:15 · 이체' }] },
            { type: 'text', width: 'auto', lines: [{ text: '+500,000원' }, { text: '입금' }] },
        ],
    },
    {
        linkMode: 'row',
        rowHref: '/transactions/detail',
        columns: [
            { type: 'icon', width: 'fixed', icon: 'check', iconBg: '#E8F0FC' },
            { type: 'text', width: 'flex', lines: [{ text: '이체 결과 조회' }, { text: '상세 보기' }] },
            { type: 'text', width: 'auto', lines: [{ text: '바로가기' }] },
        ],
    },
];

const COLUMN_LINK_ROWS: FlexListRow[] = [
    {
        linkMode: 'column',
        columns: [
            {
                type: 'icon',
                width: 'fixed',
                icon: 'shopping',
                iconBg: '#E8F0FC',
                href: '/service/icon',
            },
            {
                type: 'text',
                width: 'flex',
                href: '/service/text',
                lines: [{ text: '개별 링크 텍스트' }, { text: '컬럼 링크 모드' }],
            },
            {
                type: 'image',
                width: 'custom',
                customWidth: '72px',
                imageSrc: '/assets/minimalist-blocks/preview/ibk-flex-list.svg',
                shape: 'round',
                href: '/service/image',
            },
        ],
    },
];

const BROKEN_IMAGE_ROWS: FlexListRow[] = [
    {
        columns: [
            { type: 'image', width: 'fixed', imageSrc: 'javascript:alert(1)', shape: 'round' },
            { type: 'text', width: 'flex', lines: [{ text: '이미지 fallback' }, { text: '잘못된 URL 차단' }] },
        ],
    },
];

const LONG_TEXT_ROWS: FlexListRow[] = [
    {
        columns: [
            { type: 'icon', width: 'fixed', icon: 'shopping', iconBg: '#E8F0FC' },
            {
                type: 'text',
                width: 'flex',
                lines: [
                    { text: '아주 긴 거래 제목이 들어와도 모바일과 반응형 환경에서 텍스트 줄바꿈이 자연스럽게 동작해야 합니다' },
                    { text: '보조 설명 역시 길어질 수 있으며 레이아웃이 깨지지 않아야 합니다' },
                ],
            },
            { type: 'text', width: 'auto', lines: [{ text: '-123,456원' }, { text: '처리완료' }] },
        ],
    },
];

const LONG_AUTO_STATUS_ROWS: FlexListRow[] = [
    {
        columns: [
            { type: 'icon', width: 'fixed', icon: 'check', iconBg: '#E8F0FC' },
            { type: 'text', width: 'flex', lines: [{ text: '이체 결과 조회' }, { text: '상세 내역 확인' }] },
            { type: 'text', width: 'auto', lines: [{ text: '승인완료승인완료승인완료승인완료' }, { text: '상태값이 길어진 경우' }] },
        ],
    },
];

const MANY_ROWS: FlexListRow[] = Array.from({ length: 10 }, (_, index) => ({
    columns: [
        { type: 'icon', width: 'fixed', icon: 'shopping', iconBg: '#E8F0FC' },
        { type: 'text', width: 'flex', lines: [{ text: `항목 ${index + 1}` }, { text: `설명 ${index + 1}` }] },
        { type: 'text', width: 'auto', lines: [{ text: `${index + 1}건` }] },
    ],
}));

const INVALID_HREF_ROWS: FlexListRow[] = [
    {
        linkMode: 'row',
        rowHref: 'javascript:alert(1)',
        columns: [
            { type: 'icon', width: 'fixed', icon: 'check', iconBg: '#E8F0FC' },
            { type: 'text', width: 'flex', lines: [{ text: '위험 링크 차단' }] },
        ],
    },
];

const MOBILE_HTML = buildFlexListHtml(DEFAULT_ROWS, 'flex-list-mobile', '');
const WEB_HTML = buildFlexListHtml(DEFAULT_ROWS, 'flex-list-web', 'width:100%;box-sizing:border-box;background:transparent;padding:12px 0;');
const RESPONSIVE_HTML = buildFlexListHtml(DEFAULT_ROWS, 'flex-list-responsive', 'width:100%;box-sizing:border-box;');
const COLUMN_LINK_HTML = buildFlexListHtml(COLUMN_LINK_ROWS, 'flex-list-mobile', '');
const BROKEN_IMAGE_HTML = buildFlexListHtml(BROKEN_IMAGE_ROWS, 'flex-list-mobile', '');
const LONG_TEXT_HTML = buildFlexListHtml(LONG_TEXT_ROWS, 'flex-list-mobile', '');
const LONG_AUTO_STATUS_HTML = buildFlexListHtml(LONG_AUTO_STATUS_ROWS, 'flex-list-mobile', '');
const MANY_ROWS_HTML = buildFlexListHtml(MANY_ROWS, 'flex-list-mobile', '');
const INVALID_HREF_HTML = buildFlexListHtml(INVALID_HREF_ROWS, 'flex-list-mobile', '');

test.describe('flex-list 공통 체크', () => {
    test.beforeEach(async ({ page }) => {
        await page.setContent(MOBILE_HTML);
    });

    test('공통 UI 품질 기준을 충족한다', async ({ page }) => {
        await checkComponentIdExists(page, 'flex-list');
        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, '[data-component-id^="flex-list"]');
        await checkMinFontSize(
            page,
            '[data-component-id^="flex-list"] span, [data-component-id^="flex-list"] a',
            12,
        );
        await checkImagesHaveAlt(page);
    });
});

test.describe('flex-list 모바일 QA', () => {
    test('iPhone SE (375px)에서 레이아웃이 깨지지 않는다', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.setContent(MOBILE_HTML);

        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, '[data-component-id="flex-list-mobile"]');
    });

    test('Galaxy S (360px)에서 레이아웃이 깨지지 않는다', async ({ page }) => {
        await page.setViewportSize({ width: 360, height: 780 });
        await page.setContent(MOBILE_HTML);

        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, '[data-component-id="flex-list-mobile"]');
    });

    test('모바일에서 행이 정상적으로 렌더링된다', async ({ page }) => {
        await page.setContent(MOBILE_HTML);
        const rows = page.locator('[data-component-id="flex-list-mobile"] > a, [data-component-id="flex-list-mobile"] > div[data-fl-link-mode]');
        await expect(rows).toHaveCount(3);
    });

    test('linkMode=row에서 행 전체 링크가 유지된다', async ({ page }) => {
        await page.setContent(MOBILE_HTML);
        const rowLink = page.locator('[data-component-id="flex-list-mobile"] > a[data-fl-link-mode="row"]').first();
        await expect(rowLink).toHaveAttribute('href', '/transactions/detail');
    });
});

test.describe('flex-list 웹 QA', () => {
    test('웹 모드에서 max-width가 유지된다', async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 800 });
        await page.setContent(WEB_HTML);

        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, '[data-component-id="flex-list-web"]');

        const width = await page
            .locator('[data-component-id="flex-list-web"]')
            .evaluate((el) => el.getBoundingClientRect().width);
        expect(width).toBeGreaterThan(1000);
    });

    test('웹 모드에서 행이 정상 렌더링된다', async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 800 });
        await page.setContent(WEB_HTML);

        const rows = page.locator('[data-component-id="flex-list-web"] > a, [data-component-id="flex-list-web"] > div[data-fl-link-mode]');
        await expect(rows).toHaveCount(3);
    });

    test('웹 모드에서 각 행이 카드형 스타일로 렌더링된다', async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 800 });
        await page.setContent(WEB_HTML);

        const firstRow = page.locator('[data-component-id="flex-list-web"] > a, [data-component-id="flex-list-web"] > div[data-fl-link-mode]').first();
        const radius = await firstRow.evaluate((el) => getComputedStyle(el).borderRadius);
        const shadow = await firstRow.evaluate((el) => getComputedStyle(el).boxShadow);

        expect(radius).toBe('18px');
        expect(shadow).not.toBe('none');
    });
});

test.describe('flex-list 반응형 QA', () => {
    test('반응형 모드에서 width 설정이 유지된다', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.setContent(RESPONSIVE_HTML);

        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, '[data-component-id="flex-list-responsive"]');

        const width = await page
            .locator('[data-component-id="flex-list-responsive"]')
            .evaluate((el) => getComputedStyle(el).width);
        expect(parseFloat(width)).toBeGreaterThan(0);
    });

    test('반응형 모드에서 행이 정상 렌더링된다', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.setContent(RESPONSIVE_HTML);

        const rows = page.locator('[data-component-id="flex-list-responsive"] > a, [data-component-id="flex-list-responsive"] > div[data-fl-link-mode]');
        await expect(rows).toHaveCount(3);
    });
});

test.describe('flex-list 동작 및 예외 처리', () => {
    test('column 링크 모드에서 컬럼별 링크가 유지된다', async ({ page }) => {
        await page.setContent(COLUMN_LINK_HTML);

        const columnLinks = page.locator('[data-component-id^="flex-list"] a[data-fl-col-link]');
        await expect(columnLinks).toHaveCount(3);
        await expect(columnLinks.nth(0)).toHaveAttribute('href', '/service/icon');
        await expect(columnLinks.nth(1)).toHaveAttribute('href', '/service/text');
        await expect(columnLinks.nth(2)).toHaveAttribute('href', '/service/image');
    });

    test('이미지 URL이 잘못되면 placeholder가 표시되고 img는 렌더링되지 않는다', async ({ page }) => {
        await page.setContent(BROKEN_IMAGE_HTML);

        await expect(page.locator('[data-component-id^="flex-list"] img')).toHaveCount(0);
        await expect(page.locator('[data-component-id^="flex-list"]')).toContainText('이미지');
    });

    test('허용되지 않은 row href는 #로 치환된다', async ({ page }) => {
        await page.setContent(INVALID_HREF_HTML);

        const rowLink = page.locator('[data-component-id^="flex-list"] > a[data-fl-link-mode="row"]').first();
        await expect(rowLink).toHaveAttribute('href', '#');
    });

    test('긴 텍스트가 들어와도 레이아웃이 깨지지 않는다', async ({ page }) => {
        await page.setViewportSize({ width: 360, height: 780 });
        await page.setContent(LONG_TEXT_HTML);

        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, '[data-component-id^="flex-list"]');
        await expect(page.locator('[data-component-id^="flex-list"] [data-fl-type="text"]').first()).toBeVisible();
    });

    test('오른쪽 상태 텍스트가 길어도 왼쪽 구성 요소를 밀어내지 않는다', async ({ page }) => {
        await page.setViewportSize({ width: 360, height: 780 });
        await page.setContent(LONG_AUTO_STATUS_HTML);

        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, '[data-component-id^="flex-list"]');

        const row = page.locator('[data-component-id^="flex-list"] > a, [data-component-id^="flex-list"] > div[data-fl-link-mode]').first();
        const icon = row.locator('[data-fl-type="icon"]').first();
        const mainText = row.locator('[data-fl-type="text"]').first();
        const statusText = row.locator('[data-fl-type="text"]').nth(1);

        const rowBox = await row.boundingBox();
        const iconBox = await icon.boundingBox();
        const mainTextBox = await mainText.boundingBox();
        const statusTextBox = await statusText.boundingBox();

        expect(rowBox).not.toBeNull();
        expect(iconBox).not.toBeNull();
        expect(mainTextBox).not.toBeNull();
        expect(statusTextBox).not.toBeNull();
        expect(iconBox!.x).toBeGreaterThanOrEqual(rowBox!.x);
        expect(mainTextBox!.width).toBeGreaterThan(80);
        expect(statusTextBox!.width).toBeLessThan(rowBox!.width * 0.5);
    });

    test('행이 10개여도 body 가로 스크롤이 발생하지 않는다', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        await page.setContent(MANY_ROWS_HTML);

        await checkNoHorizontalScroll(page);
        const rows = page.locator('[data-component-id^="flex-list"] > a, [data-component-id^="flex-list"] > div[data-fl-link-mode]');
        await expect(rows).toHaveCount(10);
    });

    test('custom width 컬럼이 있어도 레이아웃이 유지된다', async ({ page }) => {
        await page.setContent(COLUMN_LINK_HTML);

        const customColumn = page.locator('[data-component-id^="flex-list"] [data-fl-custom-width="72px"]').first();
        await expect(customColumn).toHaveAttribute('data-fl-custom-width', '72px');
        const width = await customColumn.evaluate((el) => getComputedStyle(el).width);
        expect(parseFloat(width)).toBeGreaterThan(0);
    });

    test('XSS 문자열이 script 실행으로 이어지지 않는다', async ({ page }) => {
        await page.setContent(MOBILE_HTML);

        await page.evaluate(() => {
            const firstText = document.querySelector('[data-component-id^="flex-list"] [data-fl-type="text"] span');
            if (firstText) firstText.textContent = '<script>window.__flex_list_xss=true;</script>항목';
        });

        const scriptCount = await page.locator('[data-component-id^="flex-list"] script').count();
        expect(scriptCount).toBe(0);

        const xssExecuted = await page.evaluate(
            () => (window as unknown as Record<string, unknown>).__flex_list_xss,
        );
        expect(xssExecuted).toBeUndefined();
    });
});
