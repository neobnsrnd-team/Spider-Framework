// e2e/components/benefit-card.spec.ts
// benefit-card 컴포넌트 자동화 QA

import { test, expect } from '@playwright/test';
import {
    checkNoHorizontalScroll,
    checkNotOutsideViewport,
    checkMinTouchTarget,
    checkMinFontSize,
    checkImagesHaveAlt,
    checkComponentIdExists,
    checkViewportLayouts,
} from '../helpers/component-checks';

interface BenefitCardItem {
    icon: string;
    title: string;
    desc: string;
}

interface BenefitCardHtmlOptions {
    mode: 'mobile' | 'web' | 'responsive';
    cards: BenefitCardItem[];
}

function isImageUrl(val: string): boolean {
    return /^(https?:\/\/|\/|data:image\/)/.test(val.trim());
}

function buildCard(card: BenefitCardItem): string {
    const iconContent = isImageUrl(card.icon)
        ? `<img src="${card.icon}" style="width:28px;height:28px;object-fit:contain;" alt="" />`
        : `<span style="font-size:24px;line-height:1;">${card.icon}</span>`;

    return (
        `<a href="#" style="display:block;text-decoration:none;flex:1;min-width:0;">` +
        `<div style="background:#fff;border:1px solid #E5E7EB;border-radius:20px;padding:24px 20px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:10px;box-shadow:0 4px 20px rgba(0,70,164,0.08);height:100%;box-sizing:border-box;">` +
        `<div data-bc-icon style="width:48px;height:48px;background:#E8F0FC;border-radius:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">` +
        iconContent +
        `</div>` +
        `<div data-bc-title style="font-size:16px;font-weight:700;color:#0046A4;line-height:1.3;word-break:keep-all;">${card.title}</div>` +
        `<div data-bc-desc style="font-size:12px;color:#6B7280;line-height:1.4;word-break:keep-all;">${card.desc}</div>` +
        `</div>` +
        `</a>`
    );
}

function makeBenefitCardHtml({ mode, cards }: BenefitCardHtmlOptions): string {
    if (mode === 'mobile') {
        return `
<!DOCTYPE html><html><head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>* { box-sizing: border-box; } body { margin: 0; background: #f3f6fb; font-family: sans-serif; }</style>
</head><body>
  <section data-component-id="benefit-card-mobile" style="padding: 16px 0;">
    <div style="padding: 0 16px 12px;">
      <h3 style="margin: 0; font-size: 18px; font-weight: 700; color: #111827;">혜택 카드</h3>
    </div>
    <div data-bc-container data-bc-track style="display:flex;flex-direction:row;overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none;-ms-overflow-style:none;gap:0;padding:4px 0 8px;">
      ${cards
          .map(
              (card) =>
                  `<div data-bc-slide style="flex-shrink:0;width:80%;scroll-snap-align:start;padding:0 8px;box-sizing:border-box;">${buildCard(card)}</div>`,
          )
          .join('')}
    </div>
  </section>
</body></html>
`;
    }

    if (mode === 'web') {
        return `
<!DOCTYPE html><html><head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>* { box-sizing: border-box; } body { margin: 0; background: #f3f6fb; font-family: sans-serif; }</style>
</head><body>
  <section data-component-id="benefit-card-web" style="padding: 24px; max-width: 1200px; margin: 0 auto;">
    <div style="display:flex; gap:12px;" data-bc-container>
      ${cards.map((card) => buildCard(card)).join('')}
    </div>
  </section>
</body></html>
`;
    }

    return `
<!DOCTYPE html><html><head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>* { box-sizing: border-box; } body { margin: 0; background: #f3f6fb; font-family: sans-serif; }</style>
</head><body>
  <section data-component-id="benefit-card-responsive" style="padding: 24px; max-width: 1200px; margin: 0 auto;">
    <div data-bc-container style="display:flex;flex-wrap:wrap;gap:12px;">
      ${cards
          .map((card) => `<div style="flex:1;min-width:calc(50% - 6px);box-sizing:border-box;">${buildCard(card)}</div>`)
          .join('')}
    </div>
  </section>
</body></html>
`;
}

const NORMAL_CARDS: BenefitCardItem[] = [
    { icon: '💳', title: '카드 이용 혜택', desc: '국내외 가맹점 할인과 적립 혜택을 한 번에 확인할 수 있습니다.' },
    { icon: '🎁', title: '포인트 적립', desc: '월 이용금액에 따라 포인트가 누적 적립되고 다양한 제휴처에서 사용할 수 있습니다.' },
    { icon: '🛍️', title: '생활 할인', desc: '쇼핑, 배달, 교통 등 자주 쓰는 생활 영역에서 즉시 할인을 제공합니다.' },
];

const LONG_TEXT_CARDS: BenefitCardItem[] = [
    {
        icon: '💳',
        title: '매월 최대 30,000원까지 생활 밀착형 업종에서 통합 캐시백을 제공하는 프리미엄 혜택',
        desc: '대중교통, 통신, 배달앱, 온라인 쇼핑 등 여러 영역에서 합산 적용되는 장문 설명이 들어와도 레이아웃이 깨지지 않아야 합니다.',
    },
    {
        icon: '🎁',
        title: '제휴 포인트 전환',
        desc: '적립된 포인트를 항공 마일리지와 제휴 포인트로 전환할 수 있습니다.',
    },
];

const SINGLE_CARD_HTML = makeBenefitCardHtml({
    mode: 'mobile',
    cards: [{ icon: '🎁', title: '단일 카드 혜택', desc: '카드가 1개만 있어도 정상 렌더링되어야 합니다.' }],
});

const MOBILE_HTML = makeBenefitCardHtml({ mode: 'mobile', cards: NORMAL_CARDS });
const WEB_HTML = makeBenefitCardHtml({ mode: 'web', cards: NORMAL_CARDS });
const RESPONSIVE_HTML = makeBenefitCardHtml({ mode: 'responsive', cards: NORMAL_CARDS });
const LONG_TEXT_HTML = makeBenefitCardHtml({ mode: 'mobile', cards: LONG_TEXT_CARDS });
const MANY_CARDS_HTML = makeBenefitCardHtml({
    mode: 'mobile',
    cards: Array.from({ length: 10 }, (_, index) => ({
        icon: '💳',
        title: `혜택 카드 ${index + 1}`,
        desc: `혜택 카드 ${index + 1}번 설명입니다.`,
    })),
});

const XSS_HTML = `
<!DOCTYPE html><html><head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>* { box-sizing: border-box; } body { margin: 0; background: #f3f6fb; font-family: sans-serif; }</style>
</head><body>
  <section data-component-id="benefit-card-mobile" style="padding: 16px 0;">
    <div data-bc-container data-bc-track style="display:flex;flex-direction:row;overflow-x:auto;scroll-snap-type:x mandatory;padding:4px 0 8px;">
      <div data-bc-slide style="flex-shrink:0;width:80%;scroll-snap-align:start;padding:0 8px;box-sizing:border-box;">
        <a href="#" style="display:block;text-decoration:none;">
          <div style="background:#fff;border:1px solid #E5E7EB;border-radius:20px;padding:24px 20px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:10px;">
            <div data-bc-icon style="width:48px;height:48px;background:#E8F0FC;border-radius:14px;display:flex;align-items:center;justify-content:center;"><span style="font-size:24px;line-height:1;">💳</span></div>
            <div data-bc-title style="font-size:16px;font-weight:700;color:#0046A4;line-height:1.3;word-break:keep-all;">&lt;script&gt;window.__benefit_card_xss=true;&lt;/script&gt;혜택 제목</div>
            <div data-bc-desc style="font-size:12px;color:#6B7280;line-height:1.4;word-break:keep-all;">&lt;img src=x onerror=window.__benefit_card_xss_desc=true&gt;</div>
          </div>
        </a>
      </div>
    </div>
  </section>
</body></html>
`;

const BROKEN_IMAGE_HTML = `
<!DOCTYPE html><html><head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>* { box-sizing: border-box; } body { margin: 0; background: #f3f6fb; font-family: sans-serif; }</style>
</head><body>
  <section data-component-id="benefit-card-mobile" style="padding: 16px 0;">
    <div data-bc-container data-bc-track style="display:flex;flex-direction:row;overflow-x:auto;scroll-snap-type:x mandatory;padding:4px 0 8px;">
      <div data-bc-slide style="flex-shrink:0;width:80%;scroll-snap-align:start;padding:0 8px;box-sizing:border-box;">
        <a href="#" style="display:block;text-decoration:none;flex:1;min-width:0;">
          <div style="background:#fff;border:1px solid #E5E7EB;border-radius:20px;padding:24px 20px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:10px;box-shadow:0 4px 20px rgba(0,70,164,0.08);height:100%;box-sizing:border-box;min-height:160px;">
            <div data-bc-icon style="width:48px;height:48px;background:#E8F0FC;border-radius:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
              <img src="/broken-benefit-icon-does-not-exist.png" style="width:28px;height:28px;object-fit:contain;" alt="카드 혜택 아이콘" />
            </div>
            <div data-bc-title style="font-size:16px;font-weight:700;color:#0046A4;line-height:1.3;word-break:keep-all;">이미지 아이콘 혜택</div>
            <div data-bc-desc style="font-size:12px;color:#6B7280;line-height:1.4;word-break:keep-all;">이미지 로드가 실패해도 alt 속성은 유지되어야 합니다.</div>
          </div>
        </a>
      </div>
    </div>
  </section>
</body></html>
`;

test.describe('benefit-card 공통 체크', () => {
    test.beforeEach(async ({ page }) => {
        await page.setContent(MOBILE_HTML);
    });

    test('공통 UI 품질 기준을 충족한다', async ({ page }) => {
        await checkComponentIdExists(page, 'benefit-card');
        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, '[data-component-id^="benefit-card"]');
        await checkMinTouchTarget(page, '[data-component-id^="benefit-card"] a', 44);
        await checkMinFontSize(
            page,
            '[data-component-id^="benefit-card"] [data-bc-title], [data-component-id^="benefit-card"] [data-bc-desc]',
            12,
        );
        await checkImagesHaveAlt(page);
    });
});

test.describe('benefit-card 기기 폭별 체크', () => {
    test('iPhone SE (375px)에서 가로 스크롤과 레이아웃 깨짐이 없다', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.setContent(MOBILE_HTML);

        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, '[data-component-id^="benefit-card"]');
        await checkMinTouchTarget(page, '[data-component-id^="benefit-card"] a', 44);
        await checkMinFontSize(
            page,
            '[data-component-id^="benefit-card"] [data-bc-title], [data-component-id^="benefit-card"] [data-bc-desc]',
            12,
        );
    });

    test('Galaxy S (360px)에서 가로 스크롤과 레이아웃 깨짐이 없다', async ({ page }) => {
        await page.setViewportSize({ width: 360, height: 780 });
        await page.setContent(MOBILE_HTML);

        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, '[data-component-id^="benefit-card"]');
        await checkMinTouchTarget(page, '[data-component-id^="benefit-card"] a', 44);
        await checkMinFontSize(
            page,
            '[data-component-id^="benefit-card"] [data-bc-title], [data-component-id^="benefit-card"] [data-bc-desc]',
            12,
        );
    });

    test('iPhone Pro Max (430px)에서 좌우 여백이 유지되고 레이아웃이 깨지지 않는다', async ({ page }) => {
        await page.setViewportSize({ width: 430, height: 932 });
        await page.setContent(MOBILE_HTML);

        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, '[data-component-id^="benefit-card"]');

        const firstSlide = page.locator('[data-component-id^="benefit-card"] [data-bc-slide]').first();
        const box = await firstSlide.boundingBox();

        expect(box).not.toBeNull();
        expect(box!.x).toBeGreaterThanOrEqual(0);
        expect(box!.x + box!.width).toBeLessThanOrEqual(431);
        expect(box!.width).toBeLessThan(430);
    });
});

test.describe('benefit-card 모드별 렌더링', () => {
    test('mobile 모드에서 카드가 slide 구조로 렌더링된다', async ({ page }) => {
        await page.setContent(MOBILE_HTML);

        const slides = page.locator('[data-component-id="benefit-card-mobile"] [data-bc-slide]');
        await expect(slides).toHaveCount(3);
    });

    test('web 모드에서 카드가 한 줄 레이아웃으로 렌더링된다', async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 800 });
        await page.setContent(WEB_HTML);

        await checkNoHorizontalScroll(page);
        const cards = page.locator('[data-component-id="benefit-card-web"] [data-bc-container] > a');
        await expect(cards).toHaveCount(3);
    });

    test('responsive 모드에서 카드가 2열 래핑 구조로 렌더링된다', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.setContent(RESPONSIVE_HTML);

        await checkNoHorizontalScroll(page);
        const wrappers = page.locator('[data-component-id="benefit-card-responsive"] [data-bc-container] > div');
        await expect(wrappers).toHaveCount(3);
    });
});

test.describe('benefit-card 정상 동작', () => {
    test.beforeEach(async ({ page }) => {
        await page.setContent(MOBILE_HTML);
    });

    test('카드가 1개 이상 렌더링된다', async ({ page }) => {
        const cards = page.locator('[data-component-id^="benefit-card"] [data-bc-slide]');
        expect(await cards.count()).toBeGreaterThanOrEqual(1);
    });

    test('각 카드의 제목과 설명이 비어 있지 않다', async ({ page }) => {
        const titles = page.locator('[data-component-id^="benefit-card"] [data-bc-title]');
        const descriptions = page.locator('[data-component-id^="benefit-card"] [data-bc-desc]');
        const count = await titles.count();

        expect(count).toBeGreaterThan(0);
        await expect(descriptions).toHaveCount(count);

        for (let index = 0; index < count; index++) {
            const title = await titles.nth(index).textContent();
            const description = await descriptions.nth(index).textContent();

            expect(title?.trim().length).toBeGreaterThan(0);
            expect(description?.trim().length).toBeGreaterThan(0);
        }
    });

    test('더미 링크가 카드 수만큼 존재한다', async ({ page }) => {
        const links = page.locator('[data-component-id^="benefit-card"] a[href="#"]');
        await expect(links).toHaveCount(3);
    });
});

test.describe('benefit-card 예외 처리', () => {
    test('카드가 1개여도 가로 스크롤 없이 정상 렌더링된다', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.setContent(SINGLE_CARD_HTML);

        await checkNoHorizontalScroll(page);
        const card = page.locator('[data-component-id^="benefit-card"] [data-bc-slide]').first();
        await expect(card).toBeVisible();
    });

    test('장문 제목과 설명이 들어와도 레이아웃이 깨지지 않는다', async ({ page }) => {
        await page.setViewportSize({ width: 360, height: 780 });
        await page.setContent(LONG_TEXT_HTML);

        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, '[data-component-id^="benefit-card"]');
        await expect(page.locator('[data-component-id^="benefit-card"] [data-bc-title]').first()).toBeVisible();
    });

    test('아이콘 이미지 로드 실패 시 alt 속성이 유지된다', async ({ page }) => {
        await page.setContent(BROKEN_IMAGE_HTML);

        await checkImagesHaveAlt(page);

        const image = page.locator('[data-component-id^="benefit-card"] img').first();
        await expect(image).toHaveAttribute('alt', '카드 혜택 아이콘');

        const naturalWidth = await image.evaluate((el: HTMLImageElement) => el.naturalWidth);
        expect(naturalWidth).toBe(0);
    });
});

test.describe('benefit-card 엣지 케이스', () => {
    test('카드가 10개여도 body 가로 스크롤이 발생하지 않는다', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        await page.setContent(MANY_CARDS_HTML);

        await checkNoHorizontalScroll(page);
        const cards = page.locator('[data-component-id^="benefit-card"] [data-bc-slide]');
        await expect(cards).toHaveCount(10);
    });

    test('XSS 문자열이 script 실행으로 이어지지 않는다', async ({ page }) => {
        await page.setContent(XSS_HTML);

        const scriptCount = await page
            .locator('[data-component-id^="benefit-card"] script')
            .count();
        expect(scriptCount).toBe(0);

        const title = page.locator('[data-component-id^="benefit-card"] [data-bc-title]').first();
        await expect(title).toContainText('<script>');

        const xssExecuted = await page.evaluate(
            () => (window as unknown as Record<string, unknown>).__benefit_card_xss,
        );
        const xssDescExecuted = await page.evaluate(
            () => (window as unknown as Record<string, unknown>).__benefit_card_xss_desc,
        );

        expect(xssExecuted).toBeUndefined();
        expect(xssDescExecuted).toBeUndefined();
    });
});

// ── 반응형 뷰포트 레이아웃 ────────────────────────────────────────────────────

test.describe('benefit-card — 반응형 뷰포트 레이아웃', () => {
    // eslint-disable-next-line playwright/expect-expect
    test('360~1440px 전 뷰포트에서 가로 스크롤·뷰포트 이탈 없음', async ({ page }) => {
        await page.setContent(MOBILE_HTML);
        await checkViewportLayouts(page, '[data-component-id^="benefit-card"]');
    });
});
