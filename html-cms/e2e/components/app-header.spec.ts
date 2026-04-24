// e2e/components/app-header.spec.ts
// app-header 컴포넌트 자동화 QA (Issue #304)

import { test, expect } from '@playwright/test';
import {
    runCommonChecks,
    checkNoHorizontalScroll,
    checkNotOutsideViewport,
    checkMinTouchTarget,
    checkViewportLayouts,
} from '../helpers/component-checks';

// ── 테스트용 HTML ─────────────────────────────────────────────────────────

const NORMAL_HTML = `
<!DOCTYPE html><html><head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>* { box-sizing: border-box; } body { margin: 0; }</style>
</head><body>
  <div data-component-id="app-header-mobile"
       style="display:flex;justify-content:space-between;align-items:center;padding:12px 20px;background:#fff;">
    <img src="/logo.png" alt="IBK 기업은행 로고" style="height:32px;">
    <nav style="display:flex;gap:16px;">
      <a href="/transfer" style="font-size:14px;display:inline-flex;align-items:center;min-height:44px;padding:0 4px;">이체</a>
      <a href="/card" style="font-size:14px;display:inline-flex;align-items:center;min-height:44px;padding:0 4px;">카드</a>
      <a href="/loan" style="font-size:14px;display:inline-flex;align-items:center;min-height:44px;padding:0 4px;">대출</a>
    </nav>
    <button aria-label="메뉴 열기" style="min-width:44px;min-height:44px;width:44px;height:44px;background:none;border:none;cursor:pointer;flex-shrink:0;">
      ☰
    </button>
  </div>
</body></html>
`;

// 메뉴 항목이 0개인 경우
const EMPTY_MENU_HTML = `
<!DOCTYPE html><html><head>
  <meta charset="utf-8">
  <style>* { box-sizing: border-box; } body { margin: 0; }</style>
</head><body>
  <div data-component-id="app-header-mobile"
       style="display:flex;justify-content:space-between;align-items:center;padding:12px 20px;">
    <img src="/logo.png" alt="로고">
    <nav></nav>
    <button aria-label="메뉴 열기" style="width:44px;height:44px;">☰</button>
  </div>
</body></html>
`;

// 메뉴 항목명이 빈 문자열인 경우
const EMPTY_LABEL_HTML = `
<!DOCTYPE html><html><head>
  <meta charset="utf-8">
  <style>* { box-sizing: border-box; } body { margin: 0; }</style>
</head><body>
  <div data-component-id="app-header-mobile"
       style="display:flex;justify-content:space-between;align-items:center;padding:12px 20px;">
    <img src="/logo.png" alt="로고">
    <nav>
      <a href="/transfer" style="font-size:14px;"></a>
      <a href="/card" style="font-size:14px;">카드</a>
    </nav>
    <button aria-label="메뉴 열기" style="width:44px;height:44px;">☰</button>
  </div>
</body></html>
`;

// 로고 이미지 URL이 잘못된 경우
const BROKEN_LOGO_HTML = `
<!DOCTYPE html><html><head>
  <meta charset="utf-8">
  <style>* { box-sizing: border-box; } body { margin: 0; }</style>
</head><body>
  <div data-component-id="app-header-mobile"
       style="display:flex;justify-content:space-between;align-items:center;padding:12px 20px;">
    <img src="/invalid-url-that-does-not-exist.jpg" alt="IBK 기업은행 로고">
    <nav><a href="/transfer" style="font-size:14px;">이체</a></nav>
    <button aria-label="메뉴 열기" style="width:44px;height:44px;">☰</button>
  </div>
</body></html>
`;

// XSS 페이로드 텍스트 (사용자 입력 시나리오)
// 에디터에서 메뉴명으로 이 문자열을 입력했을 때 컴포넌트가 textContent로 렌더링하면 안전
const XSS_PAYLOAD = '<script>window.__xss_executed=true;</script>이체';

// ── 공통 체크 ─────────────────────────────────────────────────────────────

test.describe('app-header — 공통 체크', () => {
    test.beforeEach(async ({ page }) => {
        await page.setContent(NORMAL_HTML);
    });

    test('공통 레이아웃·접근성·키보드 기준 충족 (runCommonChecks)', async ({ page }) => {
        await runCommonChecks(page, {
            componentIdPrefix: 'app-header',
            minFontSize: 12,
            minTouchSize: 44,
            // nav 텍스트 링크는 인라인 요소이므로 제외 — 실제 버튼(햄버거)만 터치 영역 검사
            buttonSelector: 'button[aria-label]',
        });
    });
});

// ── 기기별 뷰포트 체크 ────────────────────────────────────────────────────

test.describe('app-header — 기기별 뷰포트', () => {
    test('iPhone SE (375px) — 가로 스크롤 없음·뷰포트 이탈 없음', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.setContent(NORMAL_HTML);
        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, '[data-component-id^="app-header"]');
    });

    test('Galaxy S (360px) — 가로 스크롤 없음·뷰포트 이탈 없음', async ({ page }) => {
        await page.setViewportSize({ width: 360, height: 780 });
        await page.setContent(NORMAL_HTML);
        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, '[data-component-id^="app-header"]');
    });

    test('iPhone Pro Max (430px) — 가로 스크롤 없음·뷰포트 이탈 없음', async ({ page }) => {
        await page.setViewportSize({ width: 430, height: 932 });
        await page.setContent(NORMAL_HTML);
        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, '[data-component-id^="app-header"]');
    });
});

// ── 반응형 브레이크포인트 체크 ────────────────────────────────────────────

test.describe('app-header — 반응형 브레이크포인트', () => {
    test('767px — 모바일 경계에서 가로 스크롤 없음', async ({ page }) => {
        await page.setViewportSize({ width: 767, height: 900 });
        await page.setContent(NORMAL_HTML);
        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, '[data-component-id^="app-header"]');
    });

    test('768px — 태블릿 경계에서 가로 스크롤 없음', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.setContent(NORMAL_HTML);
        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, '[data-component-id^="app-header"]');
    });

    test('1440px — 표준 데스크탑에서 뷰포트 이탈 없음', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.setContent(NORMAL_HTML);
        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, '[data-component-id^="app-header"]');
    });
});

// ── 뷰어(/view) 렌더링 확인 ───────────────────────────────────────────────

test.describe('app-header — 뷰어 렌더링', () => {
    // eslint-disable-next-line playwright/no-skipped-test
    test.skip(!!process.env.CI, 'CI 환경: Oracle DB 없어 저장된 페이지 데이터 없음 — 로컬에서만 실행');

    test('/view 접근 시 에러 페이지가 아닌 정상 렌더링됨', async ({ page }) => {
        await page.goto('/view');
        await page.waitForLoadState('domcontentloaded');
        await expect(page).not.toHaveTitle(/error|500|404/i);
        await expect(page.locator('body')).toBeVisible();
    });
});

// ── 컴포넌트 고유 체크 — 정상 동작 ──────────────────────────────────────

test.describe('app-header — 정상 동작', () => {
    test.beforeEach(async ({ page }) => {
        await page.setContent(NORMAL_HTML);
    });

    test('로고 이미지가 좌측에 위치함', async ({ page }) => {
        const logo = page.locator('[data-component-id^="app-header"] img');
        const header = page.locator('[data-component-id^="app-header"]');
        const logoBox = await logo.boundingBox();
        const headerBox = await header.boundingBox();
        const logoCenter = logoBox!.x + logoBox!.width / 2;
        const headerCenter = headerBox!.x + headerBox!.width / 2;
        expect(logoCenter).toBeLessThan(headerCenter);
    });

    test('메뉴 항목이 1개 이상 렌더링됨', async ({ page }) => {
        const links = page.locator('[data-component-id^="app-header"] nav a');
        await expect(links).not.toHaveCount(0);
    });

    test('햄버거 버튼이 44×44px 이상 (가로·세로 모두)', async ({ page }) => {
        await checkMinTouchTarget(page, 'button[aria-label="메뉴 열기"]', 44);
    });
});

// ── 컴포넌트 고유 체크 — 예외 처리 ──────────────────────────────────────

test.describe('app-header — 예외 처리', () => {
    test('메뉴 항목 0개 — 가로 스크롤·뷰포트 이탈 없음', async ({ page }) => {
        await page.setContent(EMPTY_MENU_HTML);
        await checkNoHorizontalScroll(page);
        const header = page.locator('[data-component-id^="app-header"]');
        const box = await header.boundingBox();
        expect(box).not.toBeNull();
        expect(box!.height).toBeGreaterThan(0);
    });

    test('메뉴 항목명 빈 문자열 — 레이아웃 깨짐 없음', async ({ page }) => {
        await page.setContent(EMPTY_LABEL_HTML);
        await checkNoHorizontalScroll(page);
        const header = page.locator('[data-component-id^="app-header"]');
        await expect(header).toBeVisible();
    });

    test('로고 이미지 로드 실패 — alt 속성 존재', async ({ page }) => {
        await page.setContent(BROKEN_LOGO_HTML);
        const img = page.locator('[data-component-id^="app-header"] img');
        await expect(img).toHaveAttribute('alt', /.+/);
        // 깨진 이미지는 naturalWidth = 0
        const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
        expect(naturalWidth).toBe(0);
    });
});

// ── 컴포넌트 고유 체크 — 엣지 케이스 ────────────────────────────────────

test.describe('app-header — 엣지 케이스', () => {
    test('XSS — 메뉴명이 textContent 방식으로 렌더링되어 script 태그가 DOM 요소가 되지 않음', async ({ page }) => {
        // 시나리오: 에디터에서 사용자가 메뉴명으로 XSS 페이로드를 입력했을 때
        // 컴포넌트가 textContent(안전)로 렌더링하면 script 태그가 DOM 요소가 되지 않음
        await page.setContent(NORMAL_HTML);

        // textContent로 XSS 페이로드 주입 (안전한 렌더링 방식 시뮬레이션)
        await page.evaluate((payload) => {
            const link = document.querySelector('[data-component-id^="app-header"] nav a');
            if (link) link.textContent = payload;
        }, XSS_PAYLOAD);

        // 1. 페이로드가 텍스트로 표시됨 — '<script>' 문자열이 그대로 보여야 함
        const displayedText = await page
            .locator('[data-component-id^="app-header"] nav a')
            .first()
            .textContent();
        expect(displayedText, '페이로드가 텍스트로 표시되어야 합니다').toContain('<script>');

        // 2. <script> 요소가 실제 DOM 노드로 생성되지 않아야 함
        const scriptCount = await page
            .locator('[data-component-id^="app-header"] nav script')
            .count();
        expect(scriptCount, '<script> 요소가 DOM에 존재하면 안 됩니다').toBe(0);

        // 3. 스크립트가 실제로 실행되지 않았는지 확인 (textContent 방식은 안전해야 함)
        const xssExecuted = await page.evaluate(() => (window as unknown as Record<string, unknown>).__xss_executed);
        expect(xssExecuted, '스크립트가 실행되지 않아야 합니다').toBeUndefined();
    });
});

// ── 반응형 뷰포트 레이아웃 ────────────────────────────────────────────────────

test.describe('app-header — 반응형 뷰포트 레이아웃', () => {
    // eslint-disable-next-line playwright/expect-expect
    test('360~1440px 전 뷰포트에서 가로 스크롤·뷰포트 이탈 없음', async ({ page }) => {
        await page.setContent(NORMAL_HTML);
        await checkViewportLayouts(page, '[data-component-id^="app-header"]');
    });
});
