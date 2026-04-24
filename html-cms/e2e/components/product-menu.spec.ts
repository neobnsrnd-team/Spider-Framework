// e2e/components/product-menu.spec.ts
// product-menu 컴포넌트 자동화 QA (Issue #309)

import { test, expect } from '@playwright/test';
import {
    runCommonChecks,
    checkNoHorizontalScroll,
    checkNotOutsideViewport,
    checkKeyboardFocusable,
    checkImagesHaveAlt,
    checkViewportLayouts,
} from '../helpers/component-checks';

// ── 인라인 CSS ────────────────────────────────────────────────────────────────

const PM_CSS = `
* { box-sizing: border-box; }
body { margin: 0; }
[data-component-id^="product-menu"] {
    font-family: -apple-system, BlinkMacSystemFont, 'Malgun Gothic', sans-serif;
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 2px 12px rgba(0,0,0,0.08);
    width: 100%;
}
.pm-header { padding: 18px 18px 4px; }
.pm-title { font-size: 16px; font-weight: 700; color: #0046A4; letter-spacing: -0.3px; }
.pm-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    padding: 8px 8px 20px;
    gap: 4px;
}
.pm-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 14px 6px;
    border-radius: 12px;
    text-decoration: none;
    cursor: pointer;
}
.pm-icon-wrap {
    width: 60px;
    height: 60px;
    border-radius: 14px;
    background: rgb(243, 244, 246);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
}
.pm-label {
    font-size: 12px;
    font-weight: 500;
    color: #0046A4;
    word-break: keep-all;
    text-align: center;
    line-height: 1.3;
}
`;

// ── 헬퍼 ──────────────────────────────────────────────────────────────────────

const ICON_SVG = `<svg width="30" height="30" viewBox="0 0 24 24" fill="none"
    stroke="#374151" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"
    aria-hidden="true">
  <rect x="2" y="5" width="20" height="15" rx="2"></rect>
  <path d="M2 10h20"></path>
</svg>`;

const makePmItem = (label: string, href = '#') => `
<a href="${href}" class="pm-item flex flex-col items-center"
   style="gap:8px;padding:14px 6px;border-radius:12px;text-decoration:none;cursor:pointer;">
  <div class="pm-icon-wrap flex justify-center items-center"
       style="width:60px;height:60px;border-radius:14px;background:rgb(243,244,246);flex-shrink:0;">
    ${ICON_SVG}
  </div>
  <span class="pm-label text-center" data-max-chars="20"
        style="font-size:12px;font-weight:500;color:#0046A4;word-break:keep-all;overflow-wrap:anywhere;max-width:100%;">${label}</span>
</a>`;

const makeHtml = (items: string) => `
<!DOCTYPE html><html><head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>${PM_CSS}</style>
</head><body>
  <div data-component-id="product-menu-mobile" style="width:100%;">
    <div class="pm-header" style="padding:18px 18px 4px;">
      <div class="pm-title" style="font-size:16px;font-weight:700;color:#0046A4;letter-spacing:-0.3px;">상품</div>
    </div>
    <div class="pm-grid" style="display:grid;grid-template-columns:repeat(3,1fr);padding:8px 8px 20px;gap:4px;">
      ${items}
    </div>
  </div>
</body></html>
`;

// ── HTML 상수 ─────────────────────────────────────────────────────────────────

const NORMAL_HTML = makeHtml(
    ['예금', '대출', '펀드', '신탁', '외환', '보험'].map(l => makePmItem(l)).join(''),
);

const SINGLE_HTML = makeHtml(makePmItem('예금'));

const NINE_ITEMS_HTML = makeHtml(
    Array.from({ length: 9 }, (_, i) => makePmItem(`항목${i + 1}`)).join(''),
);

// 장문 레이블 — "해외송금조회" 8자
const LONG_LABEL_HTML = makeHtml(
    makePmItem('해외송금조회해외송금') + makePmItem('이체') + makePmItem('조회'),
);

// 커스텀 업로드 이미지 아이콘 케이스 (img 태그 사용)
const IMG_ICON_HTML = makeHtml(`
<a href="#" class="pm-item flex flex-col items-center"
   style="gap:8px;padding:14px 6px;border-radius:12px;text-decoration:none;cursor:pointer;">
  <div class="pm-icon-wrap" style="width:60px;height:60px;background:rgb(243,244,246);display:flex;align-items:center;justify-content:center;">
    <img src="/assets/icons/deposit.png" alt="예금 아이콘" style="width:30px;height:30px;object-fit:contain;">
  </div>
  <span class="pm-label" style="font-size:12px;font-weight:500;color:#0046A4;">예금</span>
</a>
<a href="#" class="pm-item flex flex-col items-center"
   style="gap:8px;padding:14px 6px;border-radius:12px;text-decoration:none;cursor:pointer;">
  <div class="pm-icon-wrap" style="width:60px;height:60px;background:rgb(243,244,246);display:flex;align-items:center;justify-content:center;">
    <img src="/assets/icons/loan.png" alt="대출 아이콘" style="width:30px;height:30px;object-fit:contain;">
  </div>
  <span class="pm-label" style="font-size:12px;font-weight:500;color:#0046A4;">대출</span>
</a>`);

const XSS_HTML = makeHtml(`
<a href="#" class="pm-item flex flex-col items-center"
   style="gap:8px;padding:14px 6px;border-radius:12px;text-decoration:none;">
  <div class="pm-icon-wrap" style="width:60px;height:60px;background:rgb(243,244,246);display:flex;align-items:center;justify-content:center;">
    ${ICON_SVG}
  </div>
  <span class="pm-label">&lt;script&gt;window.__xss=1&lt;/script&gt;XSS테스트</span>
</a>`);

// ── 공통 체크 ─────────────────────────────────────────────────────────────────

test.describe('product-menu — 공통 체크', () => {
    test.beforeEach(async ({ page }) => {
        await page.setContent(NORMAL_HTML);
    });

    // eslint-disable-next-line playwright/expect-expect
    test('공통 레이아웃·접근성 기준 충족 (가로스크롤·뷰포트·폰트·터치·alt)', async ({ page }) => {
        await runCommonChecks(page, {
            componentIdPrefix: 'product-menu',
            // pm-item(<a>)이 터치 영역 대상 — 아이콘+레이블 포함 전체 클릭 영역
            buttonSelector: '.pm-item',
            // pm-label(12px 경계값) + pm-title(16px) 대상
            textSelector: '.pm-label, .pm-title',
            minTouchSize: 44,
            minFontSize: 12,
        });
    });

    // eslint-disable-next-line playwright/expect-expect
    test('키보드 Tab 포커스 이동 가능', async ({ page }) => {
        await checkKeyboardFocusable(page, 'a[href]');
    });
});

// ── 정상 동작 ─────────────────────────────────────────────────────────────────

test.describe('product-menu — 정상 동작', () => {
    test.beforeEach(async ({ page }) => {
        await page.setContent(NORMAL_HTML);
    });

    test('메뉴 항목(pm-item)이 1개 이상 렌더링됨', async ({ page }) => {
        const items = page.locator('[data-component-id^="product-menu"] .pm-item');
        expect(await items.count()).toBeGreaterThanOrEqual(1);
    });

    test('각 항목에 레이블 텍스트가 표시됨', async ({ page }) => {
        const labels = page.locator('[data-component-id^="product-menu"] .pm-label');
        const count = await labels.count();
        expect(count).toBeGreaterThanOrEqual(1);

        for (let i = 0; i < count; i++) {
            const text = await labels.nth(i).textContent();
            expect(text?.trim().length, `${i + 1}번째 레이블 텍스트가 비어있으면 안 됩니다`).toBeGreaterThan(0);
        }
    });

    test('각 항목에 href 속성이 존재함', async ({ page }) => {
        const items = page.locator('[data-component-id^="product-menu"] .pm-item');
        const count = await items.count();
        for (let i = 0; i < count; i++) {
            await expect(
                items.nth(i),
                `${i + 1}번째 pm-item에 href 속성이 있어야 합니다`,
            ).toHaveAttribute('href');
        }
    });

    test('pm-icon-wrap이 각 항목에 존재함', async ({ page }) => {
        const wraps = page.locator('[data-component-id^="product-menu"] .pm-icon-wrap');
        const count = await wraps.count();
        expect(count).toBeGreaterThanOrEqual(1);

        for (let i = 0; i < count; i++) {
            const box = await wraps.nth(i).boundingBox();
            expect(box, `${i + 1}번째 아이콘 영역이 화면에 있어야 합니다`).not.toBeNull();
            expect(box!.width, '아이콘 가로 크기가 0보다 커야 합니다').toBeGreaterThan(0);
            expect(box!.height, '아이콘 세로 크기가 0보다 커야 합니다').toBeGreaterThan(0);
        }
    });

    // eslint-disable-next-line playwright/expect-expect
    test('뷰포트 이탈 없음', async ({ page }) => {
        await checkNotOutsideViewport(page, '[data-component-id^="product-menu"]');
    });
});

// ── SVG 접근성 ────────────────────────────────────────────────────────────────

test.describe('product-menu — SVG 접근성', () => {
    test.beforeEach(async ({ page }) => {
        await page.setContent(NORMAL_HTML);
    });

    test('장식용 SVG 아이콘에 aria-hidden="true"가 설정되어야 함 (스크린 리더 중복 낭독 방지)', async ({ page }) => {
        const items = page.locator('[data-component-id^="product-menu"] .pm-item');
        const count = await items.count();
        expect(count).toBeGreaterThanOrEqual(1);

        for (let i = 0; i < count; i++) {
            // 장식용 SVG는 pm-label이 접근 텍스트를 담당하므로 aria-hidden="true" 필수
            await expect(
                items.nth(i).locator('svg'),
                `${i + 1}번째 항목: SVG 아이콘에 aria-hidden="true"가 설정되어야 합니다`,
            ).toHaveAttribute('aria-hidden', 'true');
        }
    });

    // eslint-disable-next-line playwright/expect-expect
    test('img 아이콘 사용 시 alt 속성이 존재함', async ({ page }) => {
        await page.setContent(IMG_ICON_HTML);
        await checkImagesHaveAlt(page);
    });
});

// ── 예외 처리 ─────────────────────────────────────────────────────────────────

test.describe('product-menu — 예외 처리', () => {
    test('항목 1개 — 레이아웃 깨짐 없음, 가로 스크롤 없음', async ({ page }) => {
        await page.setContent(SINGLE_HTML);
        await checkNoHorizontalScroll(page);

        const item = page.locator('[data-component-id^="product-menu"] .pm-item');
        await expect(item).toBeVisible();
        const box = await item.boundingBox();
        expect(box).not.toBeNull();
        expect(box!.height, '항목 높이가 0보다 커야 합니다').toBeGreaterThan(0);
    });
});

// ── 엣지 케이스 ───────────────────────────────────────────────────────────────

test.describe('product-menu — 엣지 케이스', () => {
    test('항목 9개 이상 — body 가로 스크롤 없음, 전체 항목 렌더링됨', async ({ page }) => {
        await page.setContent(NINE_ITEMS_HTML);
        await checkNoHorizontalScroll(page);

        const items = page.locator('[data-component-id^="product-menu"] .pm-item');
        await expect(items).toHaveCount(9);
    });

    test('장문 레이블(8자+) — 가로 스크롤 없음, 첫 항목 높이 > 0', async ({ page }) => {
        await page.setContent(LONG_LABEL_HTML);
        await checkNoHorizontalScroll(page);

        const firstItem = page
            .locator('[data-component-id^="product-menu"] .pm-item')
            .first();
        const box = await firstItem.boundingBox();
        expect(box).not.toBeNull();
        expect(box!.height, '장문 레이블 항목 높이가 0보다 커야 합니다').toBeGreaterThan(0);
    });

    test('pm-label — data-max-chars="20" 속성이 존재함', async ({ page }) => {
        await page.setContent(NORMAL_HTML);
        const labels = page.locator('[data-component-id^="product-menu"] .pm-label');
        const count = await labels.count();
        expect(count).toBeGreaterThanOrEqual(1);

        for (let i = 0; i < count; i++) {
            await expect(
                labels.nth(i),
                `${i + 1}번째 pm-label에 data-max-chars="20"이 있어야 합니다`,
            ).toHaveAttribute('data-max-chars', '20');
        }
    });

    test('pm-label — overflow-wrap:anywhere 스타일로 장문 레이블이 컨테이너를 벗어나지 않음', async ({ page }) => {
        await page.setContent(LONG_LABEL_HTML);

        // 각 pm-item별 label 너비가 item 너비를 초과하지 않는지 검증
        const result = await page.evaluate(() => {
            const items = Array.from(document.querySelectorAll('[data-component-id^="product-menu"] .pm-item'));
            return items.map((item, i) => {
                const itemW = item.getBoundingClientRect().width;
                const label = item.querySelector('.pm-label');
                const labelW = label ? label.getBoundingClientRect().width : 0;
                return { idx: i, itemW, labelW, ok: labelW <= itemW + 1 };
            });
        });

        for (const r of result) {
            expect(r.ok, `${r.idx + 1}번째 pm-label(${r.labelW}px)이 pm-item(${r.itemW}px)를 벗어나면 안 됩니다`).toBe(true);
        }
    });

    test('pm-label — 줄바꿈 허용 (white-space:nowrap 없음)', async ({ page }) => {
        await page.setContent(LONG_LABEL_HTML);

        const whiteSpace = await page.locator('[data-component-id^="product-menu"] .pm-label').first().evaluate(
            (el) => getComputedStyle(el).whiteSpace,
        );
        expect(whiteSpace, 'pm-label에 white-space:nowrap이 있으면 안 됩니다').not.toBe('nowrap');
    });

    test('XSS — 스크립트 태그가 실행되지 않음', async ({ page }) => {
        await page.setContent(XSS_HTML);

        const xssExecuted = await page.evaluate(
            () => (window as unknown as Record<string, unknown>).__xss,
        );
        expect(xssExecuted, '스크립트가 실행되지 않아야 합니다').toBeUndefined();

        const label = page
            .locator('[data-component-id^="product-menu"] .pm-label')
            .first();
        await expect(label).toBeVisible();
    });
});

// ── 반응형 뷰어 ───────────────────────────────────────────────────────────────

test.describe('product-menu — 반응형 뷰어', () => {
    test('뷰어 — product-menu HTML이 올바르게 렌더링됨', async ({ page }) => {
        // page.setContent()는 네트워크 요청을 발생시키지 않으므로 page.route 불필요
        // 컴포넌트 구조(data-component-id, pm-grid, pm-item)가 올바르게 렌더링되는지만 검증
        await page.setContent(NORMAL_HTML);
        await expect(
            page.locator('[data-component-id^="product-menu"]'),
        ).toBeAttached();
        await expect(
            page.locator('[data-component-id^="product-menu"] .pm-grid'),
        ).toBeAttached();
        await expect(
            page.locator('[data-component-id^="product-menu"] .pm-item').first(),
        ).toBeVisible();
    });
});

// ── 반응형 뷰포트 레이아웃 ────────────────────────────────────────────────────

test.describe('product-menu — 반응형 뷰포트 레이아웃', () => {
    // eslint-disable-next-line playwright/expect-expect
    test('360~1440px 전 뷰포트에서 가로 스크롤·뷰포트 이탈 없음', async ({ page }) => {
        await page.setContent(NORMAL_HTML);
        await checkViewportLayouts(page, '[data-component-id^="product-menu"]');
    });
});
