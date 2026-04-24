// e2e/components/popup-banner.spec.ts
// popup-banner 컴포넌트 자동화 QA (Issue #325)

import { test, expect } from '@playwright/test';
import {
    runCommonChecks,
    checkNoHorizontalScroll,
    checkNotOutsideViewport,
    checkViewportLayouts,
} from '../helpers/component-checks';

// ── 인라인 CSS ────────────────────────────────────────────────────────────────

const PB_CSS = `
* { box-sizing: border-box; }
body { margin: 0; }
[data-component-id^="popup-banner"] .pb-sheet--editor {
    position: relative; transform: none;
    border-radius: 20px 20px 0 0;
    box-shadow: 0 -4px 24px rgba(0,0,0,0.08);
    background: #fff; overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;
}
.pb-header {
    display: flex; align-items: center; justify-content: flex-end;
    padding: 10px 12px 4px;
}
.pb-close-btn {
    display: flex; align-items: center; justify-content: center;
    width: 44px; height: 44px;
    background: transparent; border: none; cursor: pointer; padding: 0;
    color: #374151; flex-shrink: 0;
}
.pb-slide-wrapper {
    position: relative; overflow: hidden; width: 100%; height: 200px;
}
.pb-slide-track { display: flex; height: 100%; }
.pb-slide-item {
    flex: 0 0 100%; width: 100%; height: 100%;
    display: block; text-decoration: none; cursor: pointer;
}
.pb-slide-item img { width: 100%; height: 100%; object-fit: cover; display: block; }
.pb-indicators {
    position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%);
    display: flex; align-items: center; gap: 6px;
}
.pb-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: rgba(255,255,255,0.6); flex-shrink: 0;
}
.pb-dot.pb-dot--active { width: 24px; border-radius: 4px; background: #fff; }
.pb-footer {
    display: flex; align-items: center; padding: 12px 20px 16px;
    border-top: 1px solid #F3F4F6; gap: 8px; min-height: 44px;
}
.pb-hide-checkbox { width: 18px; height: 18px; cursor: pointer; flex-shrink: 0; }
.pb-hide-label { font-size: 13px; color: #6B7280; cursor: pointer; line-height: 1.4; }
`;

// ── 헬퍼 ──────────────────────────────────────────────────────────────────────

interface SlideImage {
    src: string;
    alt: string;
    link?: string;
}

const makeSlide = ({ src, alt, link = '#' }: SlideImage): string =>
    src
        ? `<a class="pb-slide-item" href="${link}" rel="noopener noreferrer"><img src="${src}" alt="${alt}"></a>`
        : `<a class="pb-slide-item" href="#" style="display:flex;align-items:center;justify-content:center;background:#F5F7FA;flex-direction:column;gap:6px;">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="1.5" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <span style="font-size:12px;color:#9CA3AF;">이미지 미설정</span>
           </a>`;

const makeDots = (count: number): string =>
    Array.from({ length: count }, (_, i) =>
        `<span class="pb-dot${i === 0 ? ' pb-dot--active' : ''}"></span>`,
    ).join('');

const makeHtml = (images: SlideImage[]) => `
<!DOCTYPE html><html><head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>${PB_CSS}</style>
</head><body>
  <div data-component-id="popup-banner-mobile" data-cb-type="popup-banner" data-spw-block style="min-height:40px;">
    <div class="pb-sheet--editor">
      <div style="display:flex;align-items:center;gap:6px;padding:8px 14px;background:#E8F0FC;border-bottom:1px solid #C7D8F4;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0046A4" stroke-width="2" stroke-linecap="round" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/>
        </svg>
        <span style="font-size:11px;font-weight:700;color:#0046A4;">이미지 팝업 배너</span>
      </div>
      <div class="pb-header">
        <button class="pb-close-btn" aria-label="닫기">
          <span style="font-size:11px;font-weight:600;color:#6B7280;white-space:nowrap;">${images.length}장</span>
        </button>
      </div>
      <div class="pb-slide-wrapper">
        <div class="pb-slide-track">${images.map(makeSlide).join('')}</div>
        <div class="pb-indicators">${makeDots(images.length)}</div>
      </div>
      <div class="pb-footer">
        <input type="checkbox" class="pb-hide-checkbox" id="pb-hide-default">
        <label class="pb-hide-label" for="pb-hide-default">3일간 보지 않기</label>
      </div>
    </div>
  </div>
</body></html>
`;

// ── HTML 상수 ─────────────────────────────────────────────────────────────────

// 정상 상태: 이미지 2개
const NORMAL_HTML = makeHtml([
    { src: '/test/banner1.jpg', alt: '이벤트 배너 1' },
    { src: '/test/banner2.jpg', alt: '이벤트 배너 2' },
]);

// 이미지 1개 (인디케이터 dot 1개 케이스)
const SINGLE_IMAGE_HTML = makeHtml([
    { src: '/test/banner1.jpg', alt: '이벤트 배너 1' },
]);

// 이미지 URL 미설정 (플레이스홀더 표시 케이스)
const EMPTY_URL_HTML = makeHtml([
    { src: '', alt: '' },
]);

// ── 공통 체크 ─────────────────────────────────────────────────────────────────

test.describe('popup-banner — 공통 체크', () => {
    test.beforeEach(async ({ page }) => {
        await page.setContent(NORMAL_HTML);
    });

    // eslint-disable-next-line playwright/expect-expect
    test('공통 레이아웃·접근성 기준 충족 (가로스크롤·뷰포트·폰트·alt)', async ({ page }) => {
        await runCommonChecks(page, {
            componentIdPrefix: 'popup-banner',
            // 닫기 버튼만 터치 영역 체크 대상 — 슬라이드 링크는 콘텐츠 영역
            buttonSelector: '.pb-close-btn',
            // 에디터 배지 11px span 제외, 사용자 노출 텍스트만 체크
            textSelector: '.pb-hide-label',
            minFontSize: 12,
        });
    });

    test('키보드 Tab 포커스 이동 가능 (닫기 버튼 → 슬라이드 링크 → 체크박스)', async ({ page }) => {
        // 닫기 버튼이 Tab 포커스 가능한지 직접 확인
        await page.locator('.pb-close-btn').focus();
        await expect(page.locator('.pb-close-btn'), '닫기 버튼에 포커스되어야 합니다').toBeFocused();

        // 닫기 버튼 → 첫 번째 슬라이드 링크로 Tab 이동
        await page.keyboard.press('Tab');
        await expect(page.locator('.pb-slide-item').first(), '슬라이드 링크에 Tab 포커스되어야 합니다').toBeFocused();

        // 마지막 슬라이드 → 체크박스로 Tab 이동
        await page.locator('.pb-slide-item').last().focus();
        await page.keyboard.press('Tab');
        await expect(page.locator('.pb-hide-checkbox'), '체크박스에 Tab 포커스되어야 합니다').toBeFocused();
    });
});

// ── 정상 동작 ─────────────────────────────────────────────────────────────────

test.describe('popup-banner — 정상 동작', () => {
    test.beforeEach(async ({ page }) => {
        await page.setContent(NORMAL_HTML);
    });

    test('루트 컴포넌트가 렌더링됨', async ({ page }) => {
        await expect(
            page.locator('[data-component-id^="popup-banner"]'),
        ).toBeAttached();
    });

    test('슬라이드 래퍼가 존재함', async ({ page }) => {
        await expect(
            page.locator('[data-component-id^="popup-banner"] .pb-slide-wrapper'),
        ).toBeAttached();
    });

    test('슬라이드 아이템 개수가 이미지 개수와 일치함 (2개)', async ({ page }) => {
        await expect(
            page.locator('[data-component-id^="popup-banner"] .pb-slide-item'),
        ).toHaveCount(2);
    });

    test('인디케이터 dot 개수가 이미지 개수와 일치함 (2개)', async ({ page }) => {
        await expect(
            page.locator('[data-component-id^="popup-banner"] .pb-dot'),
        ).toHaveCount(2);
    });

    test('닫기 버튼에 aria-label이 있음 (접근성)', async ({ page }) => {
        await expect(
            page.locator('.pb-close-btn'),
        ).toHaveAttribute('aria-label', /.+/);
    });

    test('"N일간 보지 않기" 푸터가 존재함', async ({ page }) => {
        await expect(
            page.locator('[data-component-id^="popup-banner"] .pb-footer'),
        ).toBeAttached();
    });

    test('"N일간 보지 않기" 체크박스와 레이블이 연결됨', async ({ page }) => {
        const checkbox = page.locator('.pb-hide-checkbox');
        const labelFor = await page.locator('.pb-hide-label').getAttribute('for');
        await expect(checkbox).toHaveAttribute('id', labelFor ?? '');
    });

    // eslint-disable-next-line playwright/expect-expect
    test('뷰포트 이탈 없음', async ({ page }) => {
        await checkNotOutsideViewport(page, '[data-component-id^="popup-banner"]');
    });

    test('슬라이드 이미지에 alt 속성이 있음 (접근성)', async ({ page }) => {
        const images = page.locator('[data-component-id^="popup-banner"] .pb-slide-item img');
        await expect(images).toHaveCount(2);
        for (const image of await images.all()) {
            await expect(image).toHaveAttribute('alt', /.*/);
        }
    });

    // eslint-disable-next-line playwright/expect-expect
    test('iframe이 아닌 이미지 기반 콘텐츠 — 가로 스크롤 없음', async ({ page }) => {
        await checkNoHorizontalScroll(page);
    });
});

// ── 예외 처리 — 이미지 URL 미설정 ──────────────────────────────────────────────

test.describe('popup-banner — 예외 처리 (이미지 URL 미설정)', () => {
    test('플레이스홀더("이미지 미설정") 텍스트가 표시됨', async ({ page }) => {
        await page.setContent(EMPTY_URL_HTML);
        const placeholder = page.locator('[data-component-id^="popup-banner"] .pb-slide-item span');
        await expect(placeholder).toBeVisible();
        const text = await placeholder.textContent();
        expect(text?.trim()).toBe('이미지 미설정');
    });

    test('컴포넌트 루트 존재, 가로 스크롤 없음', async ({ page }) => {
        await page.setContent(EMPTY_URL_HTML);
        await checkNoHorizontalScroll(page);
        await expect(
            page.locator('[data-component-id^="popup-banner"]'),
        ).toBeAttached();
    });
});

// ── 예외 처리 — 이미지 1개 ────────────────────────────────────────────────────

test.describe('popup-banner — 예외 처리 (이미지 1개)', () => {
    test('슬라이드 아이템 1개, 인디케이터 dot 1개', async ({ page }) => {
        await page.setContent(SINGLE_IMAGE_HTML);
        await expect(
            page.locator('[data-component-id^="popup-banner"] .pb-slide-item'),
        ).toHaveCount(1);
        await expect(
            page.locator('[data-component-id^="popup-banner"] .pb-dot'),
        ).toHaveCount(1);
    });

    // eslint-disable-next-line playwright/expect-expect
    test('이미지 1개 — 가로 스크롤 없음', async ({ page }) => {
        await page.setContent(SINGLE_IMAGE_HTML);
        await checkNoHorizontalScroll(page);
    });
});

// ── 반응형 뷰어 ───────────────────────────────────────────────────────────────

test.describe('popup-banner — 반응형 뷰어', () => {
    test('뷰어 — popup-banner HTML이 올바르게 렌더링됨', async ({ page }) => {
        await page.setContent(NORMAL_HTML);
        await expect(
            page.locator('[data-component-id^="popup-banner"]'),
        ).toBeAttached();
        await expect(
            page.locator('[data-component-id^="popup-banner"] .pb-slide-wrapper'),
        ).toBeVisible();
    });
});

// ── 반응형 뷰포트 레이아웃 ────────────────────────────────────────────────────

test.describe('popup-banner — 반응형 뷰포트 레이아웃', () => {
    // eslint-disable-next-line playwright/expect-expect
    test('360~1440px 전 뷰포트에서 가로 스크롤·뷰포트 이탈 없음', async ({ page }) => {
        await page.setContent(NORMAL_HTML);
        await checkViewportLayouts(page, '[data-component-id^="popup-banner"]');
    });
});
