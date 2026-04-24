// e2e/components/site-footer.spec.ts
// site-footer 컴포넌트 자동화 QA (Issue #323)

import { test, expect } from '@playwright/test';
import {
    runCommonChecks,
    checkNoHorizontalScroll,
    checkNotOutsideViewport,
} from '../helpers/component-checks';

// ── 헬퍼 ──────────────────────────────────────────────────────────────────

function escapeHtml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// ── 테스트용 HTML 빌더 ───────────────────────────────────────────────────
// scripts/migrate-site-footer-to-html.ts 의 DOM 구조와 동일

const FONT_FAMILY = "-apple-system,BlinkMacSystemFont,'Malgun Gothic','Apple SD Gothic Neo',sans-serif";

const SELECT_ARROW_URI = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%236B7280' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\") no-repeat right 8px center";

const SCROLL_TOP_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M18 15l-6-6-6 6"/></svg>`;

function buildLinks(): string {
    return (
        `<div style="display:flex;flex-wrap:wrap;gap:0;margin-bottom:10px;line-height:1.8;">` +
            `<a href="#" style="font-size:11px;color:#111827;text-decoration:none;white-space:nowrap;font-weight:700;">이용약관</a>` +
            `<span style="font-size:11px;color:#D1D5DB;padding:0 5px;">|</span>` +
            `<a href="#" style="font-size:11px;color:#111827;text-decoration:none;white-space:nowrap;font-weight:700;">개인정보처리방침</a>` +
            `<span style="font-size:11px;color:#D1D5DB;padding:0 5px;">|</span>` +
            `<a href="#" style="font-size:11px;color:#374151;text-decoration:none;white-space:nowrap;">신용정보처리방침</a>` +
            `<span style="font-size:11px;color:#D1D5DB;padding:0 5px;">|</span>` +
            `<a href="#" style="font-size:11px;color:#374151;text-decoration:none;white-space:nowrap;">금융소비자보호</a>` +
            `<span style="font-size:11px;color:#D1D5DB;padding:0 5px;">|</span>` +
            `<a href="#" style="font-size:11px;color:#374151;text-decoration:none;white-space:nowrap;">윤리경영</a>` +
            `<span style="font-size:11px;color:#D1D5DB;padding:0 5px;">|</span>` +
            `<a href="#" style="font-size:11px;color:#374151;text-decoration:none;white-space:nowrap;">사이트맵</a>` +
        `</div>`
    );
}

interface SelectData {
    labelIdx: string;
    label: string;
    options: string[];
}

const DEFAULT_SELECTS: SelectData[] = [
    { labelIdx: '0', label: '선택 1', options: ['계열사1', '계열사2', '계열사3'] },
    { labelIdx: '1', label: '선택 2', options: ['패밀리사이트1', '패밀리사이트2'] },
];

function buildSelect(sel: SelectData): string {
    const selectStyle = `flex:1;padding:7px 10px;border:1px solid #E5E7EB;border-radius:4px;font-size:11px;color:#374151;background:#fff ${SELECT_ARROW_URI};-webkit-appearance:none;appearance:none;cursor:pointer;font-family:inherit;`;
    const opts = [`<option>${escapeHtml(sel.label)}</option>`]
        .concat(sel.options.map((o) => `<option>${escapeHtml(o)}</option>`))
        .join('');
    return `<select style="${selectStyle}" data-label-idx="${sel.labelIdx}">${opts}</select>`;
}

function buildSelectBar(selects: SelectData[], flexDir: 'row' | 'column' = 'row'): string {
    return (
        `<div style="display:flex;align-items:center;gap:8px;">` +
            `<div style="display:flex;flex-direction:${flexDir};gap:6px;flex:1;">` +
                selects.map((s) => buildSelect(s)).join('') +
            `</div>` +
            `<a href="#" style="width:36px;height:36px;border-radius:50%;background:#fff;border:1px solid #E5E7EB;display:flex;align-items:center;justify-content:center;text-decoration:none;color:#6B7280;flex-shrink:0;">` +
                SCROLL_TOP_SVG +
            `</a>` +
        `</div>`
    );
}

function buildContact(fontSize: string): string {
    return (
        `<div style="font-size:${fontSize};color:#374151;margin-bottom:6px;line-height:1.6;">` +
            `고객센터 : 0000-0000 (평일 09:00~18:00) | 인터넷뱅킹 : 0000-0000` +
        `</div>`
    );
}

function buildCopyright(fontSize: string, extraStyle = ''): string {
    return (
        `<div style="font-size:${fontSize};color:#6B7280;${extraStyle}line-height:1.5;">` +
            `[금융사명] [주소] | 대표이사 : [대표이사명]<br>` +
            `사업자등록번호 : 000-00-00000 | Copyright [금융사명]. All rights reserved.` +
        `</div>`
    );
}

function makeMobileHtml(selects: SelectData[] = DEFAULT_SELECTS): string {
    return `
<!DOCTYPE html><html><head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>* { box-sizing: border-box; } body { margin: 0; }</style>
</head><body>
  <div data-component-id="site-footer-mobile" data-spw-block style="font-family:${FONT_FAMILY};background:#F9FAFB;">
    <div style="padding:16px 16px 20px;">
      ${buildLinks()}
      ${buildContact('11px')}
      ${buildCopyright('11px', 'margin-bottom:14px;')}
      ${buildSelectBar(selects, 'row')}
    </div>
  </div>
</body></html>
`;
}

function makeWebHtml(selects: SelectData[] = DEFAULT_SELECTS): string {
    return `
<!DOCTYPE html><html><head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>* { box-sizing: border-box; } body { margin: 0; }</style>
</head><body>
  <div data-component-id="site-footer-web" data-spw-block style="font-family:${FONT_FAMILY};background:#F9FAFB;width:100%;box-sizing:border-box;">
    <div style="max-width:1200px;margin:0 auto;">
      <div style="padding:28px 32px;">
        <div style="display:flex;gap:32px;align-items:flex-start;">
          <div style="flex:1;min-width:0;">
            ${buildLinks()}
            ${buildContact('12px')}
            ${buildCopyright('12px')}
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:10px;flex-shrink:0;min-width:200px;">
            ${buildSelectBar(selects, 'column')}
          </div>
        </div>
      </div>
    </div>
  </div>
</body></html>
`;
}

// ── 테스트 데이터 상수 ────────────────────────────────────────────────────

const MOBILE_HTML = makeMobileHtml();
const WEB_HTML = makeWebHtml();

const EMPTY_OPTIONS_SELECTS: SelectData[] = [
    { labelIdx: '0', label: '계열사 바로가기', options: [] },
    { labelIdx: '1', label: '패밀리사이트', options: [] },
];
const EMPTY_OPTIONS_HTML = makeMobileHtml(EMPTY_OPTIONS_SELECTS);

const LONG_TEXT_SELECTS: SelectData[] = [
    { labelIdx: '0', label: '선택 1', options: ['이것은 매우 긴 계열사 이름으로 드롭다운 너비를 테스트합니다 서른자 이상'] },
    { labelIdx: '1', label: '선택 2', options: ['패밀리사이트 이름이 아주아주 길어서 레이아웃이 깨지는지 확인합니다'] },
];
const LONG_TEXT_HTML = makeMobileHtml(LONG_TEXT_SELECTS);

const MANY_OPTIONS_SELECTS: SelectData[] = [
    {
        labelIdx: '0', label: '선택 1',
        options: Array.from({ length: 15 }, (_, i) => `계열사${i + 1}`),
    },
    {
        labelIdx: '1', label: '선택 2',
        options: Array.from({ length: 15 }, (_, i) => `패밀리${i + 1}`),
    },
];
const MANY_OPTIONS_HTML = makeMobileHtml(MANY_OPTIONS_SELECTS);

const XSS_SELECTS: SelectData[] = [
    { labelIdx: '0', label: '<script>alert(1)</script>XSS셀렉트', options: ['<img onerror="window.__alert=1" src=x>'] },
    { labelIdx: '1', label: '정상 라벨', options: ['정상 옵션'] },
];
const XSS_HTML = makeMobileHtml(XSS_SELECTS);

// ── 공통 체크 ─────────────────────────────────────────────────────────────

test.describe('site-footer — 공통 체크', () => {
    test.beforeEach(async ({ page }) => {
        await page.setContent(MOBILE_HTML);
    });

    test('공통 레이아웃·접근성 기준 충족 (가로스크롤·뷰포트·폰트·터치·alt)', async ({ page }) => {
        await runCommonChecks(page, {
            componentIdPrefix: 'site-footer',
            minFontSize: 11,
            minTouchSize: 36,
            // 텍스트 링크·네이티브 select는 의도적으로 소형 — SVG 스크롤 버튼만 체크
            buttonSelector: 'a:has(svg)',
        });
    });
});

// ── 기기별 뷰포트 체크 ────────────────────────────────────────────────────

test.describe('site-footer — 기기별 뷰포트', () => {
    test('iPhone SE (375px) — 가로 스크롤 없음·뷰포트 이탈 없음', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.setContent(MOBILE_HTML);
        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, '[data-component-id^="site-footer"]');
    });

    test('Galaxy S (360px) — 가로 스크롤 없음·뷰포트 이탈 없음', async ({ page }) => {
        await page.setViewportSize({ width: 360, height: 780 });
        await page.setContent(MOBILE_HTML);
        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, '[data-component-id^="site-footer"]');
    });

    test('iPhone Pro Max (430px) — 가로 스크롤 없음·뷰포트 이탈 없음', async ({ page }) => {
        await page.setViewportSize({ width: 430, height: 932 });
        await page.setContent(MOBILE_HTML);
        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, '[data-component-id^="site-footer"]');
    });
});

// ── 반응형 브레이크포인트 체크 ────────────────────────────────────────────

test.describe('site-footer — 반응형 브레이크포인트', () => {
    test('767px — 모바일 경계에서 가로 스크롤 없음', async ({ page }) => {
        await page.setViewportSize({ width: 767, height: 900 });
        await page.setContent(MOBILE_HTML);
        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, '[data-component-id^="site-footer"]');
    });

    test('768px — 태블릿 경계에서 가로 스크롤 없음', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.setContent(MOBILE_HTML);
        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, '[data-component-id^="site-footer"]');
    });

    test('1440px — 표준 데스크탑에서 뷰포트 이탈 없음', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.setContent(WEB_HTML);
        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, '[data-component-id^="site-footer"]');
    });
});

// ── 뷰어(/view) 렌더링 확인 ──────────────────────────────────────────────

test.describe('site-footer — 뷰어 렌더링', () => {
    // eslint-disable-next-line playwright/no-skipped-test
    test.skip(!!process.env.CI, 'CI 환경: Oracle DB 없어 저장된 페이지 데이터 없음 — 로컬에서만 실행');

    test('/view 접근 시 에러 페이지가 아닌 정상 렌더링됨', async ({ page }) => {
        await page.goto('/view');
        await page.waitForLoadState('domcontentloaded');
        await expect(page).not.toHaveTitle(/error|500|404/i);
        await expect(page.locator('body')).toBeVisible();
    });
});

// ── 정상 동작 ─────────────────────────────────────────────────────────────

test.describe('site-footer — 정상 동작', () => {
    test.beforeEach(async ({ page }) => {
        await page.setContent(MOBILE_HTML);
    });

    test('링크 섹션(이용약관 등)이 렌더링됨', async ({ page }) => {
        const links = page.locator('[data-component-id^="site-footer"] a[href="#"]');
        // 6개 텍스트 링크 + 1개 스크롤 상단 버튼 = 7개
        const count = await links.count();
        expect(count).toBeGreaterThanOrEqual(6);

        // 이용약관 텍스트 확인
        await expect(page.locator('text=이용약관').first()).toBeVisible();
        await expect(page.locator('text=개인정보처리방침').first()).toBeVisible();
    });

    test('저작권 텍스트가 표시됨', async ({ page }) => {
        await expect(page.locator('text=Copyright').first()).toBeVisible();
        await expect(page.locator('text=사업자등록번호').first()).toBeVisible();
    });

    test('연락처 정보가 표시됨', async ({ page }) => {
        await expect(page.locator('text=고객센터').first()).toBeVisible();
        await expect(page.locator('text=인터넷뱅킹').first()).toBeVisible();
    });

    test('select 요소 2개 존재 (data-label-idx="0", "1")', async ({ page }) => {
        const sel0 = page.locator('select[data-label-idx="0"]');
        const sel1 = page.locator('select[data-label-idx="1"]');
        await expect(sel0).toBeAttached();
        await expect(sel1).toBeAttached();
    });

    test('각 select에 option이 1개 이상 존재', async ({ page }) => {
        const sel0Options = page.locator('select[data-label-idx="0"] option');
        const sel1Options = page.locator('select[data-label-idx="1"] option');
        // 라벨 + 실제 옵션
        expect(await sel0Options.count()).toBeGreaterThanOrEqual(2);
        expect(await sel1Options.count()).toBeGreaterThanOrEqual(2);
    });

    test('스크롤 상단 버튼이 존재', async ({ page }) => {
        // 36×36 원형 버튼 (SVG 포함)
        const scrollBtn = page.locator('[data-component-id^="site-footer"] a[href="#"]').filter({
            has: page.locator('svg'),
        });
        await expect(scrollBtn.first()).toBeAttached();
    });
});

// ── 레이아웃 모드 ─────────────────────────────────────────────────────────

test.describe('site-footer — 레이아웃 모드', () => {
    test('모바일 — 단일 컬럼 수직 배치', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.setContent(MOBILE_HTML);

        // select 2개가 가로(row)로 배치됨
        const selectContainer = page.locator('select[data-label-idx="0"]').locator('..');
        const flexDir = await selectContainer.evaluate((el) => getComputedStyle(el).flexDirection);
        expect(flexDir).toBe('row');
    });

    test('웹 — 2컬럼 수평 배치 (max-width 1200px)', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.setContent(WEB_HTML);

        // max-width 래퍼 존재
        const wrapper = page.locator('[data-component-id="site-footer-web"] > div');
        const maxW = await wrapper.evaluate((el) => getComputedStyle(el).maxWidth);
        expect(maxW).toBe('1200px');

        // select가 세로(column)로 배치됨
        const selectContainer = page.locator('select[data-label-idx="0"]').locator('..');
        const flexDir = await selectContainer.evaluate((el) => getComputedStyle(el).flexDirection);
        expect(flexDir).toBe('column');
    });
});

// ── 예외 처리 ─────────────────────────────────────────────────────────────

test.describe('site-footer — 예외 처리', () => {
    test('option 0개(라벨만) → select 정상 렌더링', async ({ page }) => {
        await page.setContent(EMPTY_OPTIONS_HTML);

        // 컴포넌트 렌더링됨
        await expect(page.locator('[data-component-id^="site-footer"]')).toBeAttached();

        // select 존재하고 라벨 option만 있음
        const sel0 = page.locator('select[data-label-idx="0"]');
        await expect(sel0).toBeAttached();
        const sel0Options = page.locator('select[data-label-idx="0"] option');
        await expect(sel0Options).toHaveCount(1); // 라벨만

        const sel1Options = page.locator('select[data-label-idx="1"] option');
        await expect(sel1Options).toHaveCount(1);
    });

    test('빈 옵션에서도 가로 스크롤 없음', async ({ page }) => {
        await page.setContent(EMPTY_OPTIONS_HTML);
        await checkNoHorizontalScroll(page);
    });
});

// ── 엣지 케이스 ───────────────────────────────────────────────────────────

test.describe('site-footer — 엣지 케이스', () => {
    test('option 텍스트 30자+ → 레이아웃 유지 (가로 스크롤 없음)', async ({ page }) => {
        await page.setContent(LONG_TEXT_HTML);
        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, '[data-component-id^="site-footer"]');
    });

    test('option 15개 이상 → select 정상 동작', async ({ page }) => {
        await page.setContent(MANY_OPTIONS_HTML);

        const sel0Options = page.locator('select[data-label-idx="0"] option');
        // 라벨 1 + 옵션 15 = 16
        expect(await sel0Options.count()).toBe(16);

        const sel1Options = page.locator('select[data-label-idx="1"] option');
        expect(await sel1Options.count()).toBe(16);

        // 가로 스크롤 없음
        await checkNoHorizontalScroll(page);
    });

    test('XSS — select label에 <script> 삽입 시 실행되지 않음', async ({ page }) => {
        await page.setContent(XSS_HTML);

        // script 태그가 DOM에 실제 <script> 엘리먼트로 삽입되지 않음
        const injected = await page.evaluate(
            () => document.querySelector('[data-component-id^="site-footer"] script'),
        );
        expect(injected).toBeNull();

        // option 내부에서는 HTML 이스케이프된 문자열이 텍스트로 표시됨
        const sel0 = page.locator('select[data-label-idx="0"]');
        const firstOptionText = await sel0.evaluate(
            (el: HTMLSelectElement) => el.options[0].textContent,
        );
        // escapeHtml로 이스케이프되어 &lt;script&gt;로 저장됨
        // 브라우저는 option 내에서 이를 텍스트로 표시
        expect(firstOptionText).toContain('XSS셀렉트');
    });

    test('XSS — option에 img onerror 삽입 시 실행되지 않음', async ({ page }) => {
        await page.setContent(XSS_HTML);

        // window.__alert가 설정되지 않음
        const alertFired = await page.evaluate(() => (window as Record<string, unknown>).__alert);
        expect(alertFired).toBeUndefined();

        // img 태그가 실제 DOM에 삽입되지 않음
        const imgInSelect = await page.evaluate(
            () => document.querySelector('select[data-label-idx="0"] img'),
        );
        expect(imgInSelect).toBeNull();
    });
});
