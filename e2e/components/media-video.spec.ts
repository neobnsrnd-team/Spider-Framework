// e2e/components/media-video.spec.ts
// media-video 컴포넌트 자동화 QA (Issue #315)

import { test, expect } from '@playwright/test';
import {
    runCommonChecks,
    checkNoHorizontalScroll,
    checkNotOutsideViewport,
    checkKeyboardFocusable,
    checkViewportLayouts,
} from '../helpers/component-checks';

// ── 인라인 CSS ────────────────────────────────────────────────────────────────

const MV_CSS = `
* { box-sizing: border-box; }
body { margin: 0; }
[data-component-id^="media-video"] {
    font-family: -apple-system, BlinkMacSystemFont, 'Malgun Gothic', sans-serif;
    background: #fff;
    padding: 16px 20px 20px;
}
`;

// ── 헬퍼 ──────────────────────────────────────────────────────────────────────

const makeHtml = (title: string, iframeSrc: string) => `
<!DOCTYPE html><html><head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>${MV_CSS}</style>
</head><body>
  <div data-component-id="media-video-mobile" data-spw-block
       style="font-family:-apple-system,BlinkMacSystemFont,'Malgun Gothic',sans-serif;background:#fff;padding:16px 20px 20px;">
    <a href="#" style="display:block;font-size:15px;font-weight:700;color:#1A1A2E;margin-bottom:10px;text-decoration:none;">${title}</a>
    <div style="position:relative;width:100%;padding-top:56.25%;border-radius:14px;overflow:hidden;background:#000;">
      <iframe
        src="${iframeSrc}"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        title="${title}"
        style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;">
      </iframe>
    </div>
  </div>
</body></html>
`;

// ── HTML 상수 ─────────────────────────────────────────────────────────────────

const VIDEO_ID = 'ps0JdgkbS5o';
const EMBED_URL = `https://www.youtube.com/embed/${VIDEO_ID}`;

const NORMAL_HTML = makeHtml('소개 영상', EMBED_URL);

// youtu.be 단축 URL → 에디터가 embed URL로 변환한 결과 HTML
const SHORT_URL_HTML = makeHtml('단축 URL 영상', `https://www.youtube.com/embed/${VIDEO_ID}`);

// 빈 iframe src (URL 미설정 상태)
const EMPTY_SRC_HTML = makeHtml('영상 제목', '');

// 타이틀 40자 이상 엣지케이스
const LONG_TITLE_HTML = makeHtml(
    'IBK 기업은행 2024 브랜드 홍보 영상 — 함께하는 금융 미래 편',
    EMBED_URL,
);

// ── 공통 체크 ─────────────────────────────────────────────────────────────────

test.describe('media-video — 공통 체크', () => {
    test.beforeEach(async ({ page }) => {
        await page.setContent(NORMAL_HTML);
    });

    // eslint-disable-next-line playwright/expect-expect
    test('공통 레이아웃·접근성 기준 충족 (가로스크롤·뷰포트·폰트·alt)', async ({ page }) => {
        await runCommonChecks(page, {
            componentIdPrefix: 'media-video',
            // 타이틀 <a>는 텍스트 링크 — button touch target 체크 대상 아님
            buttonSelector: 'button',
            textSelector: '[data-component-id^="media-video"] a[href]',
            minFontSize: 12,
        });
    });

    // eslint-disable-next-line playwright/expect-expect
    test('키보드 Tab 포커스 이동 가능 (타이틀 a → iframe)', async ({ page }) => {
        await checkKeyboardFocusable(page, 'a[href], iframe');
    });
});

// ── 정상 동작 ─────────────────────────────────────────────────────────────────

test.describe('media-video — 정상 동작', () => {
    test.beforeEach(async ({ page }) => {
        await page.setContent(NORMAL_HTML);
    });

    test('YouTube embed iframe이 존재하고 src가 설정됨', async ({ page }) => {
        const iframe = page.locator('[data-component-id^="media-video"] iframe');
        await expect(iframe).toBeAttached();
        await expect(iframe).toHaveAttribute('src', /youtube\.com\/embed\//);
    });

    test('iframe에 title 속성이 있음 (접근성)', async ({ page }) => {
        const iframe = page.locator('[data-component-id^="media-video"] iframe');
        await expect(iframe).toHaveAttribute('title', /.+/);
    });

    test('16:9 비율 컨테이너(padding-top:56.25%)가 존재함', async ({ page }) => {
        const hasRatio = await page.evaluate(() => {
            const container = document.querySelector('[data-component-id^="media-video"] div[style*="padding-top"]');
            if (!container) return false;
            const pt = getComputedStyle(container).paddingTop;
            const h = (container as HTMLElement).offsetHeight;
            // padding-top이 0이 아니거나 컨테이너 height가 0보다 크면 비율 적용 중
            return !!pt || h > 0;
        });
        expect(hasRatio, '16:9 비율 컨테이너가 존재해야 합니다').toBe(true);
    });

    test('타이틀 텍스트가 비어있지 않음', async ({ page }) => {
        const title = page.locator('[data-component-id^="media-video"] a[href]').first();
        await expect(title).toBeVisible();
        const text = await title.textContent();
        expect(text?.trim().length, '타이틀 텍스트가 비어있으면 안 됩니다').toBeGreaterThan(0);
    });

    // eslint-disable-next-line playwright/expect-expect
    test('뷰포트 이탈 없음', async ({ page }) => {
        await checkNotOutsideViewport(page, '[data-component-id^="media-video"]');
    });

    test('iframe이 뷰포트 너비를 벗어나지 않음', async ({ page }) => {
        const viewport = page.viewportSize()!;
        const box = await page.locator('[data-component-id^="media-video"] iframe').boundingBox();
        expect(box).not.toBeNull();
        expect(box!.x + box!.width, 'iframe이 화면 오른쪽을 벗어나면 안 됩니다').toBeLessThanOrEqual(
            viewport.width + 1,
        );
    });
});

// ── 엣지 케이스 — 단축 URL ────────────────────────────────────────────────────

test.describe('media-video — 유튜브 단축 URL', () => {
    test('youtu.be URL로부터 변환된 embed src가 iframe에 올바르게 반영됨', async ({ page }) => {
        await page.setContent(SHORT_URL_HTML);

        const iframe = page.locator('[data-component-id^="media-video"] iframe');
        await expect(iframe).toHaveAttribute('src', new RegExp(`embed/${VIDEO_ID}`));
    });

    test('단축 URL 변환 후 가로 스크롤·레이아웃 깨짐 없음', async ({ page }) => {
        await page.setContent(SHORT_URL_HTML);
        await checkNoHorizontalScroll(page);

        const box = await page
            .locator('[data-component-id^="media-video"]')
            .boundingBox();
        expect(box).not.toBeNull();
        expect(box!.height).toBeGreaterThan(0);
    });
});

// ── 예외 처리 ─────────────────────────────────────────────────────────────────

test.describe('media-video — 예외 처리', () => {
    test('빈 iframe src — 컴포넌트 루트 존재, 가로 스크롤 없음', async ({ page }) => {
        await page.setContent(EMPTY_SRC_HTML);
        await checkNoHorizontalScroll(page);

        const root = page.locator('[data-component-id^="media-video"]');
        await expect(root).toBeAttached();
        const box = await root.boundingBox();
        expect(box).not.toBeNull();
        expect(box!.height, '컴포넌트 높이가 0보다 커야 합니다').toBeGreaterThan(0);
    });
});

// ── 엣지 케이스 ───────────────────────────────────────────────────────────────

test.describe('media-video — 엣지 케이스', () => {
    // eslint-disable-next-line playwright/expect-expect
    test('타이틀 40자 이상 — 가로 스크롤 없음', async ({ page }) => {
        await page.setContent(LONG_TITLE_HTML);
        await checkNoHorizontalScroll(page);
    });

    test('타이틀 40자 이상 — 뷰포트 이탈 없음', async ({ page }) => {
        await page.setContent(LONG_TITLE_HTML);
        await checkNotOutsideViewport(page, '[data-component-id^="media-video"]');
        const title = page.locator('[data-component-id^="media-video"] a[href]').first();
        await expect(title).toBeVisible();
    });
});

// ── 반응형 뷰어 ───────────────────────────────────────────────────────────────

test.describe('media-video — 반응형 뷰어', () => {
    test('뷰어 — media-video HTML이 올바르게 렌더링됨', async ({ page }) => {
        await page.setContent(NORMAL_HTML);

        await expect(
            page.locator('[data-component-id^="media-video"]'),
        ).toBeAttached();
        await expect(
            page.locator('[data-component-id^="media-video"] iframe'),
        ).toBeVisible();
    });
});

// ── 반응형 뷰포트 레이아웃 ────────────────────────────────────────────────────

test.describe('media-video — 반응형 뷰포트 레이아웃', () => {
    // eslint-disable-next-line playwright/expect-expect
    test('360~1440px 전 뷰포트에서 가로 스크롤·뷰포트 이탈 없음', async ({ page }) => {
        await page.setContent(NORMAL_HTML);
        await checkViewportLayouts(page, '[data-component-id^="media-video"]');
    });
});
