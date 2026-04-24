// e2e/components/promo-banner.spec.ts
// promo-banner 컴포넌트 자동화 QA

import { test, expect } from '@playwright/test';
import {
    checkNoHorizontalScroll,
    checkNotOutsideViewport,
    checkMinFontSize,
    checkComponentIdExists,
} from '../helpers/component-checks';

interface PromoBannerSlide {
    itemId: string;
    bgColor: string;
    badge: string;
    title: string;
    desc: string;
    ctaText: string;
    ctaHref: string;
}

interface PromoBannerHtmlOptions {
    autoplayIntervalMs?: number;
    mode: 'mobile' | 'web' | 'responsive';
    slides: PromoBannerSlide[];
}

const TEST_AUTOPLAY_INTERVAL_MS = 500;

function buildSlide(slide: PromoBannerSlide): string {
    return (
        `<div class="pb-slide" data-item-id="${slide.itemId}" style="position:relative;height:200px;border-radius:16px;background:${slide.bgColor};">` +
        `<div class="pb-slide-content" style="position:relative;z-index:1;padding:24px 20px;display:flex;flex-direction:column;gap:6px;height:100%;box-sizing:border-box;justify-content:center;">` +
        `<span class="pb-badge" style="display:inline-block;background:rgba(255,255,255,0.25);color:#fff;font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;letter-spacing:0.5px;width:fit-content;border:1px solid rgba(255,255,255,0.4);">${slide.badge}</span>` +
        `<h3 class="pb-slide-title" style="font-size:22px;font-weight:800;color:#fff;margin:0;line-height:1.2;letter-spacing:-0.5px;">${slide.title}</h3>` +
        `<p class="pb-slide-desc" style="font-size:13px;color:rgba(255,255,255,0.85);margin:0;line-height:1.4;">${slide.desc}</p>` +
        `<a class="pb-slide-cta" href="${slide.ctaHref}" style="display:inline-flex;align-items:center;background:rgba(255,255,255,0.2);color:#fff;text-decoration:none;font-size:13px;font-weight:600;padding:8px 16px;border-radius:20px;border:1px solid rgba(255,255,255,0.5);width:fit-content;margin-top:4px;min-height:36px;-webkit-tap-highlight-color:transparent;">${slide.ctaText} →</a>` +
        `</div>` +
        `</div>`
    );
}

function makeSliderScript(autoplayIntervalMs = TEST_AUTOPLAY_INTERVAL_MS): string {
    return (
        `<script>` +
        `(function(){` +
        `if(window.builderRuntime)return;` +
        `var r=document.currentScript&&document.currentScript.parentElement;` +
        `if(!r)return;` +
        `var track=r.querySelector('[data-pb-track]');` +
        `var dotsEl=r.querySelector('[data-pb-dots]');` +
        `var counterCur=r.querySelector('[data-pb-cur]');` +
        `if(!track)return;` +
        `track.style.cssText='display:flex;flex-direction:row;overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none;-ms-overflow-style:none;gap:0;padding:12px 12px 4px;';` +
        `var slides=Array.from(track.querySelectorAll('[data-pb-slide]'));` +
        `if(!slides.length)return;` +
        `slides.forEach(function(s){s.style.cssText='flex-shrink:0;width:100%;scroll-snap-align:start;padding:0 8px;box-sizing:border-box;';});` +
        `var cur=0;` +
        `if(counterCur)counterCur.textContent='1';` +
        `function updateDots(i){` +
        `if(!dotsEl)return;` +
        `Array.from(dotsEl.children).forEach(function(d,j){` +
        `d.style.background=j===i?'rgba(255,255,255,0.9)':'rgba(255,255,255,0.4)';` +
        `});` +
        `}` +
        `function goTo(i){` +
        `cur=i;` +
        `track.scrollTo({left:i*track.clientWidth,behavior:'smooth'});` +
        `updateDots(i);` +
        `if(counterCur)counterCur.textContent=String(i+1);` +
        `}` +
        `if(dotsEl){` +
        `slides.forEach(function(_,i){` +
        `var d=document.createElement('button');` +
        `d.setAttribute('aria-label','슬라이드 '+(i+1));` +
        `d.style.cssText='width:6px;height:6px;border-radius:50%;border:none;padding:0;cursor:pointer;flex-shrink:0;display:block;line-height:0;font-size:0;overflow:hidden;background:'+(i===0?'rgba(255,255,255,0.9)':'rgba(255,255,255,0.4)')+';';` +
        `d.addEventListener('click',function(){goTo(i);});` +
        `dotsEl.appendChild(d);` +
        `});` +
        `}` +
        `var t;` +
        `track.addEventListener('scroll',function(){` +
        `clearTimeout(t);` +
        `t=setTimeout(function(){` +
        `var i=Math.round(track.scrollLeft/track.clientWidth);` +
        `if(i!==cur){cur=i;updateDots(i);if(counterCur)counterCur.textContent=String(i+1);}` +
        `},80);` +
        `},{passive:true});` +
        `var timer=setInterval(function(){goTo((cur+1)%slides.length);},${autoplayIntervalMs});` +
        `track.addEventListener('touchstart',function(){clearInterval(timer);},{passive:true,once:true});` +
        `})();` +
        `<\/script>`
    );
}

function makeBottomBar(slideCount: number): string {
    return (
        `<div style="display:flex;align-items:center;justify-content:center;gap:6px;padding:10px 0 12px;">` +
        `<div data-pb-dots style="display:flex;align-items:center;height:11px;gap:6px;"></div>` +
        `<span style="font-size:11px;color:#9CA3AF;line-height:1;"><span data-pb-cur>1</span> / ${slideCount}</span>` +
        `</div>`
    );
}

function makePromoBannerHtml({ mode, slides }: PromoBannerHtmlOptions): string {
    return `
<!DOCTYPE html><html><head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>* { box-sizing: border-box; } body { margin: 0; background: #eef2f7; font-family: sans-serif; }</style>
</head><body>
  <div data-component-id="promo-banner-${mode}" data-spw-block style="font-family:-apple-system,BlinkMacSystemFont,'Malgun Gothic','Apple SD Gothic Neo',sans-serif;background:#fff;border-radius:20px;width:100%;box-sizing:border-box;position:relative;">
    <div data-pb-track style="display:flex;flex-direction:column;gap:12px;padding:12px;">
      ${slides.map((slide) => `<div data-pb-slide style="width:100%;">${buildSlide(slide)}</div>`).join('')}
    </div>
    ${makeBottomBar(slides.length)}
    ${makeSliderScript()}
  </div>
</body></html>
`;
}

const NORMAL_SLIDES: PromoBannerSlide[] = [
    {
        itemId: 'pb-1',
        bgColor: 'linear-gradient(135deg,#0046A4 0%,#0066CC 100%)',
        badge: '이벤트',
        title: '특별 금리 혜택',
        desc: '예금 가입 고객에게 최대 우대 금리를 제공합니다.',
        ctaText: '자세히 보기',
        ctaHref: '/event',
    },
    {
        itemId: 'pb-2',
        bgColor: 'linear-gradient(135deg,#FF6600 0%,#FF8800 100%)',
        badge: '추천',
        title: '빠른 대출 안내',
        desc: '간편 심사로 필요한 자금을 빠르게 확인할 수 있습니다.',
        ctaText: '상품 보기',
        ctaHref: '/loan',
    },
];

const LONG_TEXT_SLIDES: PromoBannerSlide[] = [
    {
        itemId: 'pb-1',
        bgColor: 'linear-gradient(135deg,#0046A4 0%,#0066CC 100%)',
        badge: '이벤트',
        title: '장문 제목이 들어와도 모바일 배너 레이아웃이 깨지지 않아야 하는 홍보 배너 테스트 케이스',
        desc: '설명 문구가 길어지더라도 콘텐츠가 배너 영역을 벗어나지 않고 시각적으로 안정적인 레이아웃을 유지해야 합니다.',
        ctaText: '자세히 보기',
        ctaHref: '/event',
    },
    {
        itemId: 'pb-2',
        bgColor: 'linear-gradient(135deg,#FF6600 0%,#FF8800 100%)',
        badge: '추천',
        title: '두 번째 배너',
        desc: '두 번째 배너 설명입니다.',
        ctaText: '상품 보기',
        ctaHref: '/loan',
    },
];

const MANY_SLIDES: PromoBannerSlide[] = Array.from({ length: 10 }, (_, index) => ({
    itemId: `pb-${index + 1}`,
    bgColor: index % 2 === 0
        ? 'linear-gradient(135deg,#0046A4 0%,#0066CC 100%)'
        : 'linear-gradient(135deg,#FF6600 0%,#FF8800 100%)',
    badge: `배너 ${index + 1}`,
    title: `홍보 배너 ${index + 1}`,
    desc: `홍보 배너 ${index + 1} 설명입니다.`,
    ctaText: '자세히 보기',
    ctaHref: `/banner/${index + 1}`,
}));

const SINGLE_SLIDE: PromoBannerSlide[] = [
    {
        itemId: 'pb-1',
        bgColor: 'linear-gradient(135deg,#0046A4 0%,#0066CC 100%)',
        badge: '단일',
        title: '배너 1개 케이스',
        desc: '배너가 1개만 있어도 레이아웃과 카운터가 정상이어야 합니다.',
        ctaText: '자세히 보기',
        ctaHref: '/single',
    },
];

const XSS_HTML = `
<!DOCTYPE html><html><head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>* { box-sizing: border-box; } body { margin: 0; background: #eef2f7; font-family: sans-serif; }</style>
</head><body>
  <div data-component-id="promo-banner-mobile" data-spw-block style="font-family:sans-serif;background:#fff;border-radius:20px;position:relative;">
    <div data-pb-track style="display:flex;flex-direction:column;gap:12px;padding:12px;">
      <div data-pb-slide style="width:100%;">
        <div class="pb-slide" data-item-id="pb-1" style="position:relative;height:200px;border-radius:16px;background:linear-gradient(135deg,#0046A4 0%,#0066CC 100%);">
          <div class="pb-slide-content" style="position:relative;z-index:1;padding:24px 20px;display:flex;flex-direction:column;gap:6px;height:100%;box-sizing:border-box;justify-content:center;">
            <span class="pb-badge" style="display:inline-block;background:rgba(255,255,255,0.25);color:#fff;font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;">이벤트</span>
            <h3 class="pb-slide-title" style="font-size:22px;font-weight:800;color:#fff;margin:0;line-height:1.2;">&lt;script&gt;window.__promo_banner_xss=true;&lt;/script&gt;배너 제목</h3>
            <p class="pb-slide-desc" style="font-size:13px;color:rgba(255,255,255,0.85);margin:0;line-height:1.4;">&lt;img src=x onerror=window.__promo_banner_xss_desc=true&gt;</p>
            <a class="pb-slide-cta" href="#" style="display:inline-flex;align-items:center;background:rgba(255,255,255,0.2);color:#fff;text-decoration:none;font-size:13px;font-weight:600;padding:8px 16px;border-radius:20px;border:1px solid rgba(255,255,255,0.5);width:fit-content;margin-top:4px;min-height:36px;">자세히 보기 →</a>
          </div>
        </div>
      </div>
    </div>
    ${makeBottomBar(1)}
    ${makeSliderScript()}
  </div>
</body></html>
`;

const MOBILE_HTML = makePromoBannerHtml({ mode: 'mobile', slides: NORMAL_SLIDES });
const WEB_HTML = makePromoBannerHtml({ mode: 'web', slides: NORMAL_SLIDES });
const RESPONSIVE_HTML = makePromoBannerHtml({ mode: 'responsive', slides: NORMAL_SLIDES });
const LONG_TEXT_HTML = makePromoBannerHtml({ mode: 'mobile', slides: LONG_TEXT_SLIDES });
const SINGLE_SLIDE_HTML = makePromoBannerHtml({ mode: 'mobile', slides: SINGLE_SLIDE });
const MANY_SLIDES_HTML = makePromoBannerHtml({ mode: 'mobile', slides: MANY_SLIDES });

test.describe('promo-banner 공통 체크', () => {
    test.beforeEach(async ({ page }) => {
        await page.setContent(MOBILE_HTML);
    });

    test('공통 UI 품질 기준을 충족한다', async ({ page }) => {
        await checkComponentIdExists(page, 'promo-banner');
        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, '[data-component-id^="promo-banner"]');
        await checkMinFontSize(
            page,
            '[data-component-id^="promo-banner"] .pb-badge, [data-component-id^="promo-banner"] .pb-slide-title, [data-component-id^="promo-banner"] .pb-slide-desc, [data-component-id^="promo-banner"] .pb-slide-cta, [data-component-id^="promo-banner"] [data-pb-cur]',
            11,
        );
    });
});

test.describe('promo-banner 기기 폭별 체크', () => {
    test('iPhone SE (375px)에서 가로 스크롤과 레이아웃 깨짐이 없다', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.setContent(MOBILE_HTML);

        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, '[data-component-id^="promo-banner"]');
    });

    test('Galaxy S (360px)에서 가로 스크롤과 레이아웃 깨짐이 없다', async ({ page }) => {
        await page.setViewportSize({ width: 360, height: 780 });
        await page.setContent(MOBILE_HTML);

        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, '[data-component-id^="promo-banner"]');
    });

    test('iPhone Pro Max (430px)에서 좌우 여백이 유지되고 레이아웃이 깨지지 않는다', async ({ page }) => {
        await page.setViewportSize({ width: 430, height: 932 });
        await page.setContent(MOBILE_HTML);

        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, '[data-component-id^="promo-banner"]');

        const firstSlide = page.locator('[data-component-id^="promo-banner"] [data-pb-slide]').first();
        const box = await firstSlide.boundingBox();
        expect(box).not.toBeNull();
        expect(box!.x).toBeGreaterThanOrEqual(0);
        expect(box!.x + box!.width).toBeLessThanOrEqual(431);
    });
});

test.describe('promo-banner 모드별 렌더링', () => {
    test('mobile 모드에서 슬라이드 구조가 렌더링된다', async ({ page }) => {
        await page.setContent(MOBILE_HTML);

        const slides = page.locator('[data-component-id="promo-banner-mobile"] [data-pb-slide]');
        await expect(slides).toHaveCount(2);
    });

    test('web 모드에서 슬라이드 구조가 렌더링된다', async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 800 });
        await page.setContent(WEB_HTML);

        await checkNoHorizontalScroll(page);
        const slides = page.locator('[data-component-id="promo-banner-web"] [data-pb-slide]');
        await expect(slides).toHaveCount(2);
    });

    test('responsive 모드에서 슬라이드 구조가 렌더링된다', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.setContent(RESPONSIVE_HTML);

        await checkNoHorizontalScroll(page);
        const slides = page.locator('[data-component-id="promo-banner-responsive"] [data-pb-slide]');
        await expect(slides).toHaveCount(2);
    });
});

test.describe('promo-banner 정상 동작', () => {
    test.beforeEach(async ({ page }) => {
        await page.setContent(MOBILE_HTML);
    });

    test('도트 개수가 슬라이드 개수와 일치한다', async ({ page }) => {
        const slides = page.locator('[data-component-id^="promo-banner"] [data-pb-slide]');
        const dots = page.locator('[data-component-id^="promo-banner"] [data-pb-dots] button');

        await expect(slides).toHaveCount(2);
        await expect(dots).toHaveCount(2);
    });

    test('초기 카운터가 1 / 전체 슬라이드 수로 표시된다', async ({ page }) => {
        const counter = page.locator('[data-component-id^="promo-banner"] [data-pb-cur]').first();
        await expect(counter).toHaveText('1');
        await expect(page.locator('[data-component-id^="promo-banner"]')).toContainText('1 / 2');
    });

    test('도트 클릭 시 현재 슬라이드 카운터가 갱신된다', async ({ page }) => {
        const dots = page.locator('[data-component-id^="promo-banner"] [data-pb-dots] button');
        await dots.nth(1).click();

        await expect(page.locator('[data-component-id^="promo-banner"] [data-pb-cur]').first()).toHaveText('2');
    });

    test('자동 슬라이드가 일정 시간 후 다음 배너로 이동한다', async ({ page }) => {
        await expect(page.locator('[data-component-id^="promo-banner"] [data-pb-cur]').first()).toHaveText('1');
        await expect
            .poll(
                async () =>
                    page.locator('[data-component-id^="promo-banner"] [data-pb-cur]').first().textContent(),
                { timeout: 1500 },
            )
            .toBe('2');
    });

    test('가로 스크롤 후 현재 슬라이드 카운터가 동기화된다', async ({ page }) => {
        const track = page.locator('[data-component-id^="promo-banner"] [data-pb-track]').first();
        const slideWidth = await track.evaluate((el) => (el as HTMLElement).clientWidth);

        await track.evaluate(
            (el, width) => {
                (el as HTMLElement).scrollLeft = width;
                el.dispatchEvent(new Event('scroll'));
            },
            slideWidth,
        );

        await expect
            .poll(
                async () =>
                    page.locator('[data-component-id^="promo-banner"] [data-pb-cur]').first().textContent(),
                { timeout: 1000 },
            )
            .toBe('2');
    });

    test('CTA 링크가 슬라이드 수만큼 존재한다', async ({ page }) => {
        const links = page.locator('[data-component-id^="promo-banner"] .pb-slide-cta');
        await expect(links).toHaveCount(2);
        await expect(links.nth(0)).toHaveAttribute('href', '/event');
        await expect(links.nth(1)).toHaveAttribute('href', '/loan');
    });

    test('CTA 클릭 시 지정된 링크 href가 유지된다', async ({ page }) => {
        await page.setContent(MOBILE_HTML);

        const href = await page
            .locator('[data-component-id^="promo-banner"] .pb-slide-cta')
            .first()
            .evaluate((el) => (el as HTMLAnchorElement).getAttribute('href'));
        expect(href).toBe('/event');
    });
});

test.describe('promo-banner 예외 처리', () => {
    test('슬라이드가 1개여도 가로 스크롤 없이 정상 렌더링된다', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.setContent(SINGLE_SLIDE_HTML);

        await checkNoHorizontalScroll(page);
        await expect(page.locator('[data-component-id^="promo-banner"] [data-pb-slide]')).toHaveCount(1);
        await expect(page.locator('[data-component-id^="promo-banner"] [data-pb-dots] button')).toHaveCount(1);
        await expect(page.locator('[data-component-id^="promo-banner"] [data-pb-cur]')).toHaveText('1');
    });

    test('장문 제목과 설명이 들어와도 레이아웃이 깨지지 않는다', async ({ page }) => {
        await page.setViewportSize({ width: 360, height: 780 });
        await page.setContent(LONG_TEXT_HTML);

        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, '[data-component-id^="promo-banner"]');
        await expect(page.locator('[data-component-id^="promo-banner"] .pb-slide-title').first()).toBeVisible();
    });
});

test.describe('promo-banner 엣지 케이스', () => {
    test('슬라이드가 10개여도 body 가로 스크롤이 발생하지 않는다', async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 });
        await page.setContent(MANY_SLIDES_HTML);

        await checkNoHorizontalScroll(page);
        await expect(page.locator('[data-component-id^="promo-banner"] [data-pb-slide]')).toHaveCount(10);
        await expect(page.locator('[data-component-id^="promo-banner"] [data-pb-dots] button')).toHaveCount(10);
        await expect(page.locator('[data-component-id^="promo-banner"]')).toContainText('/ 10');
    });

    test('XSS 문자열이 script 실행으로 이어지지 않는다', async ({ page }) => {
        await page.setContent(XSS_HTML);

        const scripts = page.locator('[data-component-id^="promo-banner"] script');
        await expect(scripts).toHaveCount(1);

        const title = page.locator('[data-component-id^="promo-banner"] .pb-slide-title').first();
        await expect(title).toContainText('<script>');

        const xssExecuted = await page.evaluate(
            () => (window as unknown as Record<string, unknown>).__promo_banner_xss,
        );
        const xssDescExecuted = await page.evaluate(
            () => (window as unknown as Record<string, unknown>).__promo_banner_xss_desc,
        );

        expect(xssExecuted).toBeUndefined();
        expect(xssDescExecuted).toBeUndefined();
    });
});
