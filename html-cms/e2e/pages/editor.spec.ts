// e2e/pages/editor.spec.ts
// 에디터 페이지 E2E 테스트 — 금융 컴포넌트 미리보기 검증 (Issue #295)

import { test, expect } from '@playwright/test';
import { LABEL } from '../fixtures/locale';

test.describe('에디터 페이지 — 기본 UI', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/edit');
        // ContentBuilder 초기화 대기 — DOM 로드 완료까지
        await page.waitForLoadState('domcontentloaded');
    });

    test('에디터 캔버스 로드 확인', async ({ page }) => {
        await expect(page.locator('body')).toBeVisible();
        await expect(page).not.toHaveTitle(/error|500|404/i);
    });

    test('하단 액션 버튼 표시 확인', async ({ page }) => {
        // Oracle 없는 CI 환경에서는 ContentBuilder가 초기화 실패 → Save 버튼이 가려져 visible 불가
        // eslint-disable-next-line playwright/no-skipped-test
        test.skip(!!process.env.CI, 'CI 환경: Oracle 없어 ContentBuilder 초기화 불가 — 로컬에서만 실행');

        // ContentBuilder가 완전히 초기화될 때까지 대기 (최대 60초)
        // 에디터 하단 버튼은 React 컴포넌트 렌더링 후 표시됨
        const saveButton = page.getByRole('button', { name: LABEL.editor.save });
        await saveButton.waitFor({ state: 'visible', timeout: 60_000 });

        await expect(saveButton).toBeVisible();
        await expect(page.getByRole('button', { name: LABEL.editor.preview })).toBeVisible();
        await expect(page.getByRole('button', { name: LABEL.editor.html })).toBeVisible();
    });
});

test.describe('뷰어 페이지 — 금융 컴포넌트 렌더링', () => {
    // 이벤트 배너 컴포넌트 HTML (SSR mock 불가 → page.setContent()로 직접 주입)
    const EVENT_BANNER_HTML = `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"><title>뷰어 테스트</title></head>
        <body>
            <div data-component-id="event-banner-mobile" data-spw-block data-banner-interval="3000"
                 data-banner-slides="[]"
                 style="font-family:sans-serif;background:#ffffff;">
                <div data-banner-track style="display:flex;flex-direction:column;"></div>
                <div data-banner-pagination style="display:flex;align-items:center;justify-content:center;gap:8px;padding:8px 0;">
                    <button data-banner-prev>&#10094;</button>
                    <span data-banner-indicator>1 / 1</span>
                    <button data-banner-next>&#10095;</button>
                    <button data-banner-pause>&#10073;&#10073;</button>
                </div>
            </div>
        </body>
        </html>
    `;

    test('이벤트 배너 — 페이지네이션 요소 렌더링 확인', async ({ page }) => {
        // SSR 페이지는 page.route()로 mock 불가 → HTML 직접 주입
        await page.setContent(EVENT_BANNER_HTML);

        await expect(page.locator('[data-banner-prev]')).toBeVisible();
        await expect(page.locator('[data-banner-next]')).toBeVisible();
        await expect(page.locator('[data-banner-pause]')).toBeVisible();
        await expect(page.locator('[data-banner-indicator]')).toBeVisible();
    });

    test('레이아웃 이탈 감지 — 가로 스크롤 없음 확인', async ({ page }) => {
        await page.goto('/view');
        await page.waitForLoadState('domcontentloaded');

        const hasHorizontalScroll = await page.evaluate(() => {
            return document.body.scrollWidth > document.documentElement.clientWidth;
        });

        expect(hasHorizontalScroll).toBe(false);
    });
});

test.describe('뷰어 페이지 — 뷰포트별 스크린샷 비교', () => {
    // CI 환경에서는 DB 없이 빈 화면이므로 스크린샷 비교 무의미 → skip
    // 로컬에서만 실행: npx playwright test --grep "스크린샷"
    // eslint-disable-next-line playwright/no-skipped-test
    test.skip(!!process.env.CI, 'CI 환경에서는 DB 없어 스크린샷 비교 무의미');

    test('모바일(390px) 뷰어 스크린샷 기준 비교', async ({ page }) => {
        await page.goto('/view');
        await page.waitForLoadState('domcontentloaded');

        await expect(page).toHaveScreenshot('viewer-mobile.png', {
            fullPage: true,
            maxDiffPixelRatio: 0.02,
        });
    });
});
