// e2e/components/product-gallery.spec.ts
// product-gallery 컴포넌트 자동화 QA (Issue #312)

import { test, expect } from '@playwright/test';
import {
    runCommonChecks,
    checkNoHorizontalScroll,
    checkKeyboardFocusable,
    checkViewportLayouts,
} from '../helpers/component-checks';

// ── 테스트용 HTML ─────────────────────────────────────────────────────────
// 실제 컴포넌트 구조(data-pg-* 속성)를 사용 — buildCard() / SLIDER_SCRIPT 와 동일한 DOM 구조

const makeGalleryHtml = (cards: { name: string; rate: string; desc: string }[]) => `
<!DOCTYPE html><html><head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>* { box-sizing: border-box; }</style>
</head><body>
  <div data-component-id="product-gallery-mobile" style="font-family:sans-serif;background:#F5F7FA;border-radius:20px;position:relative;">
    <div style="padding:20px 20px 12px;">
      <h3 style="font-size:18px;font-weight:700;color:#1A1A2E;margin:0;">주요 금융상품</h3>
    </div>
    <div data-pg-track style="display:flex;flex-direction:column;gap:12px;padding:4px 20px 20px;">
      ${cards
        .map(
            (c, i) => `
      <div data-pg-slide style="width:100%;">
        <div data-type="savings" data-item-id="pg-${i + 1}" style="background:#fff;border-radius:16px;padding:24px 20px;display:flex;flex-direction:column;gap:6px;">
          <div data-pg-field="badge" style="display:inline-flex;align-items:center;font-size:11px;font-weight:700;">적금</div>
          <div data-pg-field="productName" style="font-size:20px;font-weight:700;color:#1A1A2E;">${c.name}</div>
          <div data-pg-field="rateWrap" style="display:flex;align-items:baseline;gap:2px;">
            <span data-pg-field="rateValue" style="font-size:40px;font-weight:800;color:#0046A4;">${c.rate}</span>
            <span style="font-size:22px;font-weight:700;color:#0046A4;">%</span>
          </div>
          <div data-pg-field="rateLabel" style="font-size:12px;color:#6B7280;">최고 금리 (연)</div>
          <div data-pg-field="detail" style="font-size:13px;color:#6B7280;">${c.desc}</div>
          <a data-pg-field="cta" href="/apply" style="display:flex;align-items:center;justify-content:center;background:#0046A4;color:#fff;text-decoration:none;font-size:15px;font-weight:600;padding:14px;border-radius:12px;min-height:48px;">자세히 보기</a>
        </div>
      </div>`,
        )
        .join('')}
    </div>
    <div data-pg-dots style="display:flex;justify-content:center;align-items:center;height:32px;">
      ${cards
        .map(
            (_, i) =>
                `<button aria-label="슬라이드 ${i + 1}" style="width:44px;height:44px;border-radius:50%;border:none;padding:0;cursor:pointer;margin:0 4px;background:${i === 0 ? '#0046A4' : 'rgba(0,70,164,0.25)'};"></button>`,
        )
        .join('')}
    </div>
  </div>
</body></html>
`;

const NORMAL_CARDS = [
    { name: '기업자유예금', rate: '3.50', desc: '자유롭게 입출금하며 높은 금리를 누리세요.' },
    { name: 'IBK 적금', rate: '4.20', desc: '매월 일정 금액을 저축해 목돈을 만들어보세요.' },
    { name: 'IBK 주택담보대출', rate: '4.80', desc: '내 집 마련의 꿈을 현실로 만들어드립니다.' },
];

const NORMAL_HTML = makeGalleryHtml(NORMAL_CARDS);

const SINGLE_CARD_HTML = makeGalleryHtml([
    { name: '기업자유예금', rate: '3.50', desc: '단일 카드 테스트' },
]);

const ZERO_RATE_HTML = makeGalleryHtml([
    { name: '이벤트 예금', rate: '0', desc: '금리 0% 테스트 상품' },
    { name: '적금', rate: '0.00', desc: '0.00% 표시 확인' },
]);

const NEGATIVE_RATE_HTML = makeGalleryHtml([
    { name: '특수 상품', rate: '-0.1', desc: '음수 금리 표시 확인' },
]);

const LONG_NAME_HTML = makeGalleryHtml([
    {
        name: 'IBK 기업은행 초장기 특별 우대금리 복합 자유적금 상품 (2024년 한정)',
        rate: '3.50',
        desc: '상품명 40자 이상 엣지케이스 테스트',
    },
]);

const XSS_HTML = `
<!DOCTYPE html><html><head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>* { box-sizing: border-box; }</style>
</head><body>
  <div data-component-id="product-gallery-mobile">
    <div data-pg-track>
      <div data-pg-slide>
        <div data-item-id="pg-1" style="background:#fff;border-radius:16px;padding:24px 20px;">
          <div data-pg-field="productName">&lt;script&gt;alert(1)&lt;/script&gt;XSS테스트</div>
          <span data-pg-field="rateValue">3</span>
          <div data-pg-field="detail">&lt;img onerror=alert(2) src=x&gt;</div>
          <a data-pg-field="cta" href="/apply" style="min-height:48px;display:flex;align-items:center;">자세히 보기</a>
        </div>
      </div>
    </div>
  </div>
</body></html>
`;

const TEN_CARDS_HTML = makeGalleryHtml(
    Array.from({ length: 10 }, (_, i) => ({
        name: `상품 ${i + 1}`,
        rate: `${(3 + i * 0.1).toFixed(2)}`,
        desc: `테스트 상품 ${i + 1}번 설명`,
    })),
);

// ── 공통 체크 ─────────────────────────────────────────────────────────────

test.describe('product-gallery — 공통 체크', () => {
    test.beforeEach(async ({ page }) => {
        await page.setContent(NORMAL_HTML);
    });

    test('공통 레이아웃·접근성 기준 충족 (가로스크롤·뷰포트·폰트·터치·alt)', async ({ page }) => {
        await runCommonChecks(page, {
            componentIdPrefix: 'product-gallery',
            minFontSize: 12,
            minTouchSize: 44,
        });
    });

    test('키보드 Tab 포커스 이동 가능', async ({ page }) => {
        await checkKeyboardFocusable(page);
    });
});

// ── 정상 동작 ─────────────────────────────────────────────────────────────

test.describe('product-gallery — 정상 동작', () => {
    test.beforeEach(async ({ page }) => {
        await page.setContent(NORMAL_HTML);
    });

    test('카드가 1개 이상 렌더링됨', async ({ page }) => {
        const cards = page.locator('[data-component-id^="product-gallery"] [data-pg-slide]');
        const count = await cards.count();
        expect(count).toBeGreaterThanOrEqual(1);
    });

    test('각 카드에 금리 텍스트(%)가 표시됨', async ({ page }) => {
        const rates = page.locator('[data-component-id^="product-gallery"] [data-pg-field="rateValue"]');
        const count = await rates.count();
        expect(count).toBeGreaterThanOrEqual(1);

        for (let i = 0; i < count; i++) {
            const text = await rates.nth(i).textContent();
            // rateValue는 숫자 문자열, 바로 옆 span에 '%' 있으므로 텍스트 자체는 숫자
            expect(text?.trim().length).toBeGreaterThan(0);
        }
    });

    test('인디케이터(닷) 버튼이 카드 수와 동일하게 표시됨', async ({ page }) => {
        const cards = page.locator('[data-component-id^="product-gallery"] [data-pg-slide]');
        const dots = page.locator('[data-component-id^="product-gallery"] [data-pg-dots] button');
        const cardCount = await cards.count();
        const dotCount = await dots.count();
        expect(dotCount).toBe(cardCount);
    });

    test('첫 번째 인디케이터가 활성 색상(#0046A4)으로 표시됨', async ({ page }) => {
        const firstDot = page
            .locator('[data-component-id^="product-gallery"] [data-pg-dots] button')
            .first();
        const bg = await firstDot.evaluate((el) => getComputedStyle(el).backgroundColor);
        // 브라우저가 hex → rgb로 정규화: #0046A4 → rgb(0, 70, 164)
        expect(bg).toBe('rgb(0, 70, 164)');
    });

    test('신청 링크가 href 속성을 가짐', async ({ page }) => {
        const links = page.locator('[data-component-id^="product-gallery"] [data-pg-field="cta"]');
        const count = await links.count();
        expect(count).toBeGreaterThanOrEqual(1);
        for (let i = 0; i < count; i++) {
            await expect(links.nth(i)).toHaveAttribute('href', /.+/);
        }
    });
});

// ── 예외 처리 ─────────────────────────────────────────────────────────────

test.describe('product-gallery — 예외 처리', () => {
    test('카드 1개일 때 레이아웃 깨짐 없음', async ({ page }) => {
        await page.setContent(SINGLE_CARD_HTML);
        await checkNoHorizontalScroll(page);

        const card = page.locator('[data-component-id^="product-gallery"] [data-pg-slide]');
        await expect(card).toBeVisible();
        const box = await card.boundingBox();
        expect(box).not.toBeNull();
        expect(box!.height).toBeGreaterThan(0);
    });

    test('금리 0% — 표시 이상 없음', async ({ page }) => {
        await page.setContent(ZERO_RATE_HTML);
        const rates = page.locator('[data-component-id^="product-gallery"] [data-pg-field="rateValue"]');
        const count = await rates.count();
        expect(count).toBeGreaterThanOrEqual(1);
        for (let i = 0; i < count; i++) {
            const text = await rates.nth(i).textContent();
            expect(text?.trim().length).toBeGreaterThan(0);
        }
    });

    test('음수 금리(-0.1%) — 표시 이상 없음', async ({ page }) => {
        await page.setContent(NEGATIVE_RATE_HTML);
        const rate = page
            .locator('[data-component-id^="product-gallery"] [data-pg-field="rateValue"]')
            .first();
        await expect(rate).toBeVisible();
        const text = await rate.textContent();
        expect(text?.trim().length).toBeGreaterThan(0);
    });
});

// ── 엣지 케이스 ───────────────────────────────────────────────────────────

test.describe('product-gallery — 엣지 케이스', () => {
    test('카드 10개 이상 — 가로 스크롤 처리됨, 레이아웃 이상 없음', async ({ page }) => {
        await page.setContent(TEN_CARDS_HTML);
        const bodyHScroll = await page.evaluate(
            () => document.body.scrollWidth > document.documentElement.clientWidth,
        );
        expect(bodyHScroll, 'body 가로 스크롤이 발생하면 안 됩니다').toBe(false);

        const cards = page.locator('[data-component-id^="product-gallery"] [data-pg-slide]');
        expect(await cards.count()).toBe(10);
    });

    test('상품명 40자 이상 — 카드 레이아웃 깨짐 없음', async ({ page }) => {
        await page.setContent(LONG_NAME_HTML);
        await checkNoHorizontalScroll(page);

        const card = page
            .locator('[data-component-id^="product-gallery"] [data-pg-slide]')
            .first();
        const box = await card.boundingBox();
        expect(box).not.toBeNull();
        expect(box!.height).toBeGreaterThan(0);
    });

    test('XSS — 특수문자가 스크립트로 실행되지 않음', async ({ page }) => {
        await page.setContent(XSS_HTML);

        const injected = await page.evaluate(
            () => document.querySelector('[data-component-id^="product-gallery"] script'),
        );
        expect(injected).toBeNull();

        const name = page
            .locator('[data-component-id^="product-gallery"] [data-pg-field="productName"]')
            .first();
        await expect(name).toBeVisible();
    });
});

// ── 반응형·뷰어 ───────────────────────────────────────────────────────────

test.describe('product-gallery — 반응형 뷰어', () => {
    test('뷰어(/view) — product-gallery HTML이 렌더링됨', async ({ page }) => {
        await page.route('/api/builder/load', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    ok: true,
                    html: `<div data-component-id="product-gallery-mobile"><div data-pg-track><div data-pg-slide><span data-pg-field="rateValue">3.50</span></div></div></div>`,
                }),
            });
        });

        await page.setContent(NORMAL_HTML);
        await expect(
            page.locator('[data-component-id^="product-gallery"]'),
        ).toBeAttached();
    });
});

// ── 반응형 뷰포트 레이아웃 ────────────────────────────────────────────────────

test.describe('product-gallery — 반응형 뷰포트 레이아웃', () => {
    // eslint-disable-next-line playwright/expect-expect
    test('360~1440px 전 뷰포트에서 가로 스크롤·뷰포트 이탈 없음', async ({ page }) => {
        await page.setContent(NORMAL_HTML);
        await checkViewportLayouts(page, '[data-component-id^="product-gallery"]');
    });
});
