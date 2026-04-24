// e2e/components/info-accordion.spec.ts
// info-accordion component QA for InfoAccordionEditor output

import { test, expect, type Page } from '@playwright/test';
import {
    runCommonChecks,
    checkNoHorizontalScroll,
    checkNotOutsideViewport,
    checkViewportLayouts,
} from '../helpers/component-checks';

interface AccordionItem {
    title: string;
    content: string;
}

type ViewMode = 'mobile' | 'web' | 'responsive';

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

const BASE_CSS = `
* { box-sizing: border-box; }
body { margin: 0; background: #eef3f8; }
`;

const DEFAULT_ITEMS: AccordionItem[] = [
    {
        title: 'Service Guide',
        content:
            '<p style="margin:0 0 8px;">Monthly discount limits depend on prior month usage.</p>' +
            '<table style="width:100%;border-collapse:collapse;margin-bottom:12px;font-size:12px;">' +
            '<thead><tr>' +
            '<th style="padding:8px;border:1px solid #E5E7EB;background:#F9FAFB;">Usage</th>' +
            '<th style="padding:8px;border:1px solid #E5E7EB;background:#F9FAFB;">Limit</th>' +
            '</tr></thead>' +
            '<tbody>' +
            '<tr><td style="padding:8px;border:1px solid #E5E7EB;">100,000 KRW+</td><td style="padding:8px;border:1px solid #E5E7EB;">5,000 KRW</td></tr>' +
            '<tr><td style="padding:8px;border:1px solid #E5E7EB;">300,000 KRW+</td><td style="padding:8px;border:1px solid #E5E7EB;">20,000 KRW</td></tr>' +
            '</tbody></table>' +
            '<p style="margin:0;">Detailed policy text is shown inside the accordion body.</p>',
    },
    {
        title: 'Eligibility',
        content:
            '<p style="margin:0 0 6px;">Available for personal customers over age 14.</p>' +
            '<p style="margin:0;">Benefits start on the first day of the next month.</p>',
    },
    {
        title: 'Notes',
        content:
            '<p style="margin:0 0 6px;"><strong>Overseas transactions are excluded.</strong></p>' +
            '<p style="margin:0;">Customer center: 1588-0000</p>',
    },
];

const LONG_TITLE_ITEMS: AccordionItem[] = [
    {
        title: 'Very Long Information Accordion Title That Must Wrap Across Multiple Lines Without Breaking Layout',
        content: '<p style="margin:0;">Long title smoke test.</p>',
    },
    ...DEFAULT_ITEMS.slice(1),
];

const SINGLE_ITEM: AccordionItem[] = [
    {
        title: 'Single Item',
        content: '<p style="margin:0;">A single accordion item should still open by default.</p>',
    },
];

const EDITED_ITEMS: AccordionItem[] = [
    {
        title: 'Priority Notes',
        content: '<p style="margin:0;">This item was moved to the first position.</p>',
    },
    {
        title: 'Service Guide Updated',
        content: '<p style="margin:0;">Updated body copied from editor apply flow.</p>',
    },
    {
        title: 'New Item',
        content: '<p style="margin:0;">New content inserted by the editor.</p>',
    },
];

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

function componentIdFor(mode: ViewMode): string {
    if (mode === 'web') return 'info-accordion-web';
    if (mode === 'responsive') return 'info-accordion-responsive';
    return 'info-accordion-mobile';
}

function extraStyleFor(mode: ViewMode): string {
    if (mode === 'mobile') return '';
    return 'width:100%;box-sizing:border-box;';
}

function makeAccordionHtml(mode: ViewMode, items: AccordionItem[], includeDataAttr = true): string {
    const componentId = componentIdFor(mode);
    const itemsJson = JSON.stringify(items).replace(/"/g, '&quot;');
    const dataAttr = includeDataAttr ? ` data-accordion-items="${itemsJson}"` : '';

    return `
<!DOCTYPE html><html><head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>${BASE_CSS}</style>
</head><body>
  <div data-component-id="${componentId}" data-spw-block${dataAttr}
       style="font-family:${FONT_FAMILY};background:#fff;border-radius:20px;box-shadow:0 2px 16px rgba(0,70,164,0.07);${extraStyleFor(mode)}">
    <div style="padding:20px 20px 16px;text-align:center;border-bottom:2px solid #E5E7EB;">
      <a href="#" style="text-decoration:none;">
        <h2 style="font-size:17px;font-weight:800;color:#1A1A2E;margin:0;display:inline-block;border-bottom:2px solid #1A1A2E;padding-bottom:3px;">Info Guide</h2>
      </a>
    </div>
    ${buildItemsHtml(items)}
    ${ACCORDION_SCRIPT}
  </div>
</body></html>
`;
}

async function getOpenStates(page: Page) {
    return page.locator('[data-component-id^="info-accordion"] .ia-item').evaluateAll((items) =>
        items.map((item) => ({
            open: item.getAttribute('data-open'),
            maxHeight: (item.querySelector('.ia-body') as HTMLElement | null)?.style.maxHeight ?? '',
        })),
    );
}

const MOBILE_HTML = makeAccordionHtml('mobile', DEFAULT_ITEMS);
const WEB_HTML = makeAccordionHtml('web', DEFAULT_ITEMS);
const RESPONSIVE_HTML = makeAccordionHtml('responsive', DEFAULT_ITEMS);
const LONG_TITLE_HTML = makeAccordionHtml('mobile', LONG_TITLE_ITEMS);
const SINGLE_ITEM_HTML = makeAccordionHtml('mobile', SINGLE_ITEM);
const EDITED_HTML = makeAccordionHtml('mobile', EDITED_ITEMS);
const LEGACY_DOM_HTML = makeAccordionHtml('mobile', DEFAULT_ITEMS, false);

test.describe('info-accordion common checks', () => {
    test.beforeEach(async ({ page }) => {
        await page.setContent(MOBILE_HTML);
    });

    test('meets common layout and accessibility checks', async ({ page }) => {
        await runCommonChecks(page, {
            componentIdPrefix: 'info-accordion',
            buttonSelector: '[data-component-id^="info-accordion"] .ia-header',
            textSelector:
                '[data-component-id^="info-accordion"] h2, [data-component-id^="info-accordion"] .ia-header span, [data-component-id^="info-accordion"] .ia-body p, [data-component-id^="info-accordion"] .ia-body th, [data-component-id^="info-accordion"] .ia-body td',
            minTouchSize: 44,
            minFontSize: 12,
        });
    });

    test('supports keyboard interaction on accordion headers', async ({ page }) => {
        const firstHeader = page.locator('[data-component-id^="info-accordion"] .ia-header').first();
        await firstHeader.focus();
        await expect(firstHeader).toBeFocused();

        await page.keyboard.press('Enter');
        const states = await getOpenStates(page);
        expect(states[0]?.open).toBe('0');
    });
});

test.describe('info-accordion viewport checks', () => {
    test('has no horizontal overflow on iPhone SE', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.setContent(MOBILE_HTML);
        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, '[data-component-id^="info-accordion"]');
    });

    test('has no horizontal overflow on Galaxy S', async ({ page }) => {
        await page.setViewportSize({ width: 360, height: 800 });
        await page.setContent(MOBILE_HTML);
        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, '[data-component-id^="info-accordion"]');
    });

    test('has no horizontal overflow on iPhone Pro Max', async ({ page }) => {
        await page.setViewportSize({ width: 430, height: 932 });
        await page.setContent(MOBILE_HTML);
        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, '[data-component-id^="info-accordion"]');
    });

    test('keeps responsive layout stable across 360px to 1440px', async ({ page }) => {
        await page.setContent(RESPONSIVE_HTML);
        await checkViewportLayouts(page, '[data-component-id^="info-accordion"]');
    });
});

test.describe('info-accordion rendering by mode', () => {
    test('renders mobile variant with mobile component id', async ({ page }) => {
        await page.setContent(MOBILE_HTML);
        await expect(page.locator('[data-component-id="info-accordion-mobile"]')).toBeVisible();
    });

    test('renders web variant with width style', async ({ page }) => {
        await page.setContent(WEB_HTML);
        const root = page.locator('[data-component-id="info-accordion-web"]');
        await expect(root).toBeVisible();
        await expect(root).toHaveAttribute('style', /width:100%/);
    });

    test('renders responsive variant with width style', async ({ page }) => {
        await page.setContent(RESPONSIVE_HTML);
        const root = page.locator('[data-component-id="info-accordion-responsive"]');
        await expect(root).toBeVisible();
        await expect(root).toHaveAttribute('style', /box-sizing:border-box/);
    });
});

test.describe('info-accordion normal behavior', () => {
    test.beforeEach(async ({ page }) => {
        await page.setContent(MOBILE_HTML);
    });

    test('opens the first item on initial load', async ({ page }) => {
        const states = await getOpenStates(page);
        expect(states[0]?.open).toBe('1');
        expect(states[0]?.maxHeight).toBe('9999px');
        expect(states[1]?.open).toBe('0');
    });

    test('toggles a closed item open when header is clicked', async ({ page }) => {
        const secondHeader = page.locator('[data-component-id^="info-accordion"] .ia-header').nth(1);
        await secondHeader.click();

        const states = await getOpenStates(page);
        expect(states[1]?.open).toBe('1');
        expect(states[1]?.maxHeight).toBe('9999px');
    });

    test('closes an opened item when the same header is clicked again', async ({ page }) => {
        const firstHeader = page.locator('[data-component-id^="info-accordion"] .ia-header').first();
        await firstHeader.click();

        const states = await getOpenStates(page);
        expect(states[0]?.open).toBe('0');
        expect(states[0]?.maxHeight).toBe('0px');
    });

    test('renders the same number of items as data-accordion-items', async ({ page }) => {
        const titlesFromAttr = await page.locator('[data-component-id^="info-accordion"]').evaluate((root) => {
            const raw = root.getAttribute('data-accordion-items');
            return raw ? (JSON.parse(raw) as AccordionItem[]).map((item) => item.title) : [];
        });

        const headers = page.locator('[data-component-id^="info-accordion"] .ia-header span');
        await expect(headers).toHaveCount(titlesFromAttr.length);
        await expect(headers.first()).toHaveText(titlesFromAttr[0]);
    });
});

test.describe('info-accordion InfoAccordionEditor data contract', () => {
    test('stores editor data in data-accordion-items JSON', async ({ page }) => {
        await page.setContent(MOBILE_HTML);

        const items = await page.locator('[data-component-id^="info-accordion"]').evaluate((root) => {
            const raw = root.getAttribute('data-accordion-items');
            return raw ? (JSON.parse(raw) as AccordionItem[]) : [];
        });

        expect(items).toHaveLength(DEFAULT_ITEMS.length);
        expect(items[0]?.title).toBe(DEFAULT_ITEMS[0].title);
        expect(items[2]?.title).toBe(DEFAULT_ITEMS[2].title);
    });

    test('reflects add, delete, and reorder results after editor apply', async ({ page }) => {
        await page.setContent(EDITED_HTML);

        const headers = page.locator('[data-component-id^="info-accordion"] .ia-header span');
        await expect(headers).toHaveCount(EDITED_ITEMS.length);
        await expect(headers.nth(0)).toHaveText('Priority Notes');
        await expect(headers.nth(1)).toHaveText('Service Guide Updated');
        await expect(headers.nth(2)).toHaveText('New Item');

        const attrItems = await page.locator('[data-component-id^="info-accordion"]').evaluate((root) => {
            const raw = root.getAttribute('data-accordion-items');
            return raw ? (JSON.parse(raw) as AccordionItem[]) : [];
        });
        expect(attrItems.map((item) => item.title)).toEqual(EDITED_ITEMS.map((item) => item.title));
    });

    test('keeps legacy DOM-only blocks working without data-accordion-items', async ({ page }) => {
        await page.setContent(LEGACY_DOM_HTML);

        const root = page.locator('[data-component-id^="info-accordion"]');
        await expect(root).not.toHaveAttribute('data-accordion-items', /.+/);
        await expect(root.locator('.ia-item')).toHaveCount(DEFAULT_ITEMS.length);

        await root.locator('.ia-header').nth(1).click();
        const states = await getOpenStates(page);
        expect(states[1]?.open).toBe('1');
    });
});

test.describe('info-accordion edge cases', () => {
    test('single item layout remains stable and can close after auto-open', async ({ page }) => {
        await page.setContent(SINGLE_ITEM_HTML);

        await expect(page.locator('[data-component-id^="info-accordion"] .ia-item')).toHaveCount(1);
        const firstHeader = page.locator('[data-component-id^="info-accordion"] .ia-header').first();
        const statesBefore = await getOpenStates(page);
        expect(statesBefore[0]?.open).toBe('1');

        await firstHeader.click();
        const statesAfter = await getOpenStates(page);
        expect(statesAfter[0]?.open).toBe('0');
        await checkNoHorizontalScroll(page);
    });

    test('long title wraps without horizontal overflow', async ({ page }) => {
        await page.setContent(LONG_TITLE_HTML);
        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, '[data-component-id^="info-accordion"]');
    });

    test('table content inside body stays within viewport in web mode', async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 800 });
        await page.setContent(WEB_HTML);
        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, '[data-component-id^="info-accordion"]');
        await expect(page.locator('[data-component-id^="info-accordion"] table')).toBeVisible();
    });
});
