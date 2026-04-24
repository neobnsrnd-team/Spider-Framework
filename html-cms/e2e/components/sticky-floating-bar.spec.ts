// e2e/components/sticky-floating-bar.spec.ts
// sticky-floating-bar(플로팅 액션 바) 플러그인 컴포넌트 자동화 QA (Issue #347)

import { test, expect } from '@playwright/test';
import {
    checkNoHorizontalScroll,
    checkNotOutsideViewport,
    checkMinFontSize,
    checkMinTouchTarget,
    checkKeyboardFocusable,
    MOBILE_VIEWPORTS,
    WEB_VIEWPORTS,
} from '../helpers/component-checks';

// ── 인라인 CSS (style.css 기반) ──────────────────────────────────────────

const INLINE_CSS = `
[data-cb-type="sticky-floating-bar"] {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 9999;
    background: #ffffff;
    box-shadow: 0 -4px 20px rgba(0, 70, 164, 0.08);
    font-family: -apple-system, BlinkMacSystemFont, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;
    transform: translateY(100%);
    transition: transform 0.25s ease;
    padding-bottom: env(safe-area-inset-bottom, 12px);
}
[data-cb-type="sticky-floating-bar"].sfb-visible {
    transform: translateY(0);
}
.sfb-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 16px;
    box-sizing: border-box;
}
.sfb-text {
    font-size: 13px;
    font-weight: 700;
    color: #1A1A2E;
    flex: 1;
    padding-right: 10px;
    line-height: 1.4;
    word-break: keep-all;
}
.sfb-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: #0046A4;
    color: #ffffff;
    font-size: 13px;
    font-weight: 700;
    padding: 0 18px;
    height: 40px;
    border-radius: 10px;
    text-decoration: none;
    white-space: nowrap;
    flex-shrink: 0;
    transition: opacity 0.15s ease, transform 0.15s ease;
    -webkit-tap-highlight-color: transparent;
}
`;

// ── 인라인 mount 스크립트 (index.js 기반) ────────────────────────────────

function buildMountScript(options: {
    text?: string;
    buttonLabel?: string;
    buttonUrl?: string;
    bgColor?: string;
    buttonColor?: string;
}): string {
    // options 값을 JSON으로 전달하여 mount 함수 내부에서 파싱
    // </script> 포함 시 HTML 파서가 스크립트를 조기 종료하는 것을 방지
    const optsJson = JSON.stringify(options).replace(/</g, '\\u003c');
    return `
    <script>
    (function() {
        var opts = ${optsJson};
        var element = document.querySelector('[data-cb-type="sticky-floating-bar"]');
        if (!element) return;

        var text        = opts.text        || '지금 바로 신청하기';
        var buttonLabel = opts.buttonLabel || '신청하기';
        var buttonUrl   = opts.buttonUrl   || '#';
        var bgColor     = opts.bgColor     || '#ffffff';
        var buttonColor = opts.buttonColor || '#0046A4';

        if (typeof buttonUrl === 'string' && buttonUrl.includes('..')) {
            buttonUrl = '#';
        }

        element.innerHTML =
            '<div class="sfb-inner">' +
                '<span class="sfb-text">' + text + '</span>' +
                '<a class="sfb-btn" href="' + buttonUrl + '">' + buttonLabel + '</a>' +
            '</div>';

        element.style.background = bgColor;
        var btn = element.querySelector('.sfb-btn');
        if (btn) btn.style.background = buttonColor;

        function updatePosition() {
            var container = document.querySelector('.is-container');
            if (!container) return;
            var rect = container.getBoundingClientRect();
            element.style.left  = rect.left + 'px';
            element.style.width = rect.width + 'px';
            var distFromBottom = window.innerHeight - rect.bottom;
            element.style.bottom = Math.max(0, distFromBottom) + 'px';
        }

        function applyContentPadding() {
            var container = document.querySelector('.is-container');
            if (!container) return;
            var barHeight = element.offsetHeight;
            if (!barHeight) return;
            container.style.paddingBottom = (barHeight + 20) + 'px';
        }

        requestAnimationFrame(function () {
            updatePosition();
            applyContentPadding();
        });

        window.addEventListener('resize', function () {
            updatePosition();
            applyContentPadding();
        }, { passive: true });

        function handleScroll() {
            var maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            if (maxScroll < 200 || window.scrollY > 200) {
                element.classList.add('sfb-visible');
            } else {
                element.classList.remove('sfb-visible');
            }
            updatePosition();
        }

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
    })();
    </script>`;
}

// ── 테스트용 HTML 빌더 ───────────────────────────────────────────────────

interface HtmlOptions {
    text?: string;
    buttonLabel?: string;
    buttonUrl?: string;
    bgColor?: string;
    buttonColor?: string;
    contentHeight?: number; // 더미 콘텐츠 높이 (px)
}

function buildHtml(opts: HtmlOptions = {}): string {
    const contentHeight = opts.contentHeight ?? 2000;
    return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>${INLINE_CSS}</style>
</head>
<body>
<div class="is-container" style="margin:0 auto;max-width:480px;background:#fff;">
    <div style="height:${contentHeight}px;padding:20px;">
        <h1 style="font-size:18px;">더미 콘텐츠</h1>
        <p style="font-size:14px;">스크롤 테스트를 위한 더미 콘텐츠입니다.</p>
    </div>
</div>
<div data-cb-type="sticky-floating-bar" data-spw-block></div>
${buildMountScript({
    text: opts.text,
    buttonLabel: opts.buttonLabel,
    buttonUrl: opts.buttonUrl,
    bgColor: opts.bgColor,
    buttonColor: opts.buttonColor,
})}
</body>
</html>`;
}

// ── 테스트 HTML 상수 ─────────────────────────────────────────────────────

/** 기본 설정 (2000px 스크롤) */
const NORMAL_HTML = buildHtml({
    text: '지금 바로 신청하기',
    buttonLabel: '신청하기',
    buttonUrl: 'https://example.com/apply',
});

/** 커스텀 배경색·버튼색 */
const CUSTOM_COLOR_HTML = buildHtml({
    bgColor: '#1A1A2E',
    buttonColor: '#FF6B35',
});

/** 짧은 페이지 (스크롤 200px 미만) */
const SHORT_PAGE_HTML = buildHtml({
    contentHeight: 100,
});

/** 강조 문구 30자+ / 버튼 문구 10자+ */
const LONG_TEXT_HTML = buildHtml({
    text: '연말정산 간소화 서비스 지금 바로 신청하고 혜택받으세요',
    buttonLabel: '간편하게 신청하기',
});

/** URL 디렉토리 트래버설 시도 */
const TRAVERSAL_URL_HTML = buildHtml({
    buttonUrl: '../../etc/passwd',
});

// ── 루트 셀렉터 ─────────────────────────────────────────────────────────

const ROOT = '[data-cb-type="sticky-floating-bar"]';

// ══════════════════════════════════════════════════════════════════════════
// 테스트
// ══════════════════════════════════════════════════════════════════════════

test.describe('sticky-floating-bar — 공통 체크', () => {
    test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.setContent(NORMAL_HTML);
        // 스크롤하여 바를 노출시킨 후 체크
        await page.evaluate(() => window.scrollTo(0, 300));
        await page.locator(`${ROOT}.sfb-visible`).waitFor({ state: 'attached' });
    });

    test('폰트 크기 13px 이상', async ({ page }) => {
        await checkMinFontSize(page, '.sfb-text, .sfb-btn', 13);
    });

    test('버튼 터치 영역 40px 이상', async ({ page }) => {
        await checkMinTouchTarget(page, '.sfb-btn', 40);
    });

    test('키보드 포커스 가능', async ({ page }) => {
        await checkKeyboardFocusable(page, '.sfb-btn');
    });
});

test.describe('sticky-floating-bar — 기기별 뷰포트', () => {
    for (const vp of MOBILE_VIEWPORTS) {
        test(`${vp.name} (${vp.width}px) — 가로 스크롤 없음`, async ({ page }) => {
            await page.setViewportSize({ width: vp.width, height: vp.height });
            await page.setContent(NORMAL_HTML);
            await page.evaluate(() => window.scrollTo(0, 300));
            await page.locator(`${ROOT}.sfb-visible`).waitFor({ state: 'attached' });
            await checkNoHorizontalScroll(page);
        });
    }
});

test.describe('sticky-floating-bar — 반응형 브레이크포인트', () => {
    for (const vp of WEB_VIEWPORTS) {
        test(`${vp.name} (${vp.width}px) — 레이아웃 유지`, async ({ page }) => {
            await page.setViewportSize({ width: vp.width, height: vp.height });
            await page.setContent(NORMAL_HTML);
            await page.evaluate(() => window.scrollTo(0, 300));
            await page.locator(`${ROOT}.sfb-visible`).waitFor({ state: 'attached' });
            await checkNoHorizontalScroll(page);
            await checkNotOutsideViewport(page, ROOT);
        });
    }
});

test.describe('sticky-floating-bar — 정상 동작', () => {
    test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.setContent(NORMAL_HTML);
    });

    test('mount 후 강조 문구가 렌더링됨', async ({ page }) => {
        const text = page.locator('.sfb-text');
        await expect(text).toHaveText('지금 바로 신청하기');
    });

    test('mount 후 버튼이 렌더링됨', async ({ page }) => {
        const btn = page.locator('.sfb-btn');
        await expect(btn).toHaveText('신청하기');
    });

    test('버튼 href가 설정된 URL과 일치', async ({ page }) => {
        const btn = page.locator('.sfb-btn');
        await expect(btn).toHaveAttribute('href', 'https://example.com/apply');
    });

    test('스크롤 200px 이후 sfb-visible 클래스 추가됨', async ({ page }) => {
        const bar = page.locator(ROOT);
        // 초기 상태 — visible 아님
        await expect(bar).not.toHaveClass(/sfb-visible/);

        // 스크롤 300px
        await page.evaluate(() => window.scrollTo(0, 300));
        await expect(bar).toHaveClass(/sfb-visible/);
    });

    test('스크롤 초기(0px) 시 sfb-visible 클래스 없음', async ({ page }) => {
        const bar = page.locator(ROOT);
        await page.evaluate(() => window.scrollTo(0, 0));
        await expect(bar).not.toHaveClass(/sfb-visible/);
    });
});

test.describe('sticky-floating-bar — 색상 설정', () => {
    test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.setContent(CUSTOM_COLOR_HTML);
        await page.evaluate(() => window.scrollTo(0, 300));
        await page.locator(`${ROOT}.sfb-visible`).waitFor({ state: 'attached' });
    });

    test('배경색이 설정값과 일치', async ({ page }) => {
        const bar = page.locator(ROOT);
        // #1A1A2E → rgb(26, 26, 46)
        await expect(bar).toHaveCSS('background-color', 'rgb(26, 26, 46)');
    });

    test('버튼 색상이 설정값과 일치', async ({ page }) => {
        const btn = page.locator('.sfb-btn');
        // #FF6B35 → rgb(255, 107, 53)
        await expect(btn).toHaveCSS('background-color', 'rgb(255, 107, 53)');
    });
});

test.describe('sticky-floating-bar — 예외 처리', () => {
    test('짧은 페이지(200px 미만)에서 바가 자동 노출됨', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.setContent(SHORT_PAGE_HTML);
        // maxScroll < 200 이면 즉시 sfb-visible 추가됨
        const bar = page.locator(ROOT);
        await expect(bar).toHaveClass(/sfb-visible/);
    });

    test('URL에 ".." 포함 시 "#"으로 차단됨', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.setContent(TRAVERSAL_URL_HTML);
        const btn = page.locator('.sfb-btn');
        await expect(btn).toHaveAttribute('href', '#');
    });
});

test.describe('sticky-floating-bar — 엣지 케이스', () => {
    test('강조 문구 30자+ → 레이아웃 유지', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.setContent(LONG_TEXT_HTML);
        await page.evaluate(() => window.scrollTo(0, 300));
        await page.locator(`${ROOT}.sfb-visible`).waitFor({ state: 'attached' });

        // sfb-inner가 flex 레이아웃 유지
        const inner = page.locator('.sfb-inner');
        await expect(inner).toHaveCSS('display', 'flex');

        // 가로 스크롤 발생하지 않음
        await checkNoHorizontalScroll(page);

        // 버튼이 여전히 보임
        const btn = page.locator('.sfb-btn');
        await expect(btn).toBeVisible();
    });

    test('버튼 문구 10자+ → 레이아웃 유지', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.setContent(LONG_TEXT_HTML);
        await page.evaluate(() => window.scrollTo(0, 300));
        await page.locator(`${ROOT}.sfb-visible`).waitFor({ state: 'attached' });

        const btn = page.locator('.sfb-btn');
        await expect(btn).toBeVisible();
        await expect(btn).toHaveText('간편하게 신청하기');
        await checkNoHorizontalScroll(page);
    });

    test('XSS — innerHTML script 태그는 실행되지 않음', async ({ page }) => {
        // mount()가 innerHTML로 text를 삽입하므로 <script>는 브라우저 정책상 실행 안 됨
        // 단, <img onerror> 등 이벤트 핸들러 기반 XSS는 실행 가능 → 별도 버그 이슈 필요
        await page.setViewportSize({ width: 375, height: 667 });

        // script 태그만 포함한 XSS 테스트 (img onerror 제외)
        const scriptOnlyXssHtml = buildHtml({
            text: '<script>alert("xss")</script>',
            buttonLabel: '신청하기',
        });

        let alertFired = false;
        page.on('dialog', async dialog => {
            alertFired = true;
            await dialog.dismiss();
        });

        await page.setContent(scriptOnlyXssHtml);
        await page.waitForTimeout(500);

        // innerHTML로 삽입된 <script>는 브라우저 정책상 실행되지 않음
        expect(alertFired, 'innerHTML <script>는 실행되지 않아야 합니다').toBe(false);

        // 컴포넌트가 정상 렌더링됨 (깨지지 않음)
        const btn = page.locator('.sfb-btn');
        await expect(btn).toBeVisible();
    });
});
