// e2e/components/auth-center.spec.ts
// auth-center(보안·인증센터) 컴포넌트 자동화 QA (Issue #319)

import { test, expect } from '@playwright/test';
import {
    runCommonChecks,
    checkNoHorizontalScroll,
    checkNotOutsideViewport,
    checkKeyboardFocusable,
    checkViewportLayouts,
} from '../helpers/component-checks';

// ── 공통 상수 ─────────────────────────────────────────────────────────────────

const FONT_FAMILY = "-apple-system,BlinkMacSystemFont,'Malgun Gothic',sans-serif";

const ARROW_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>`;

const NOTICE_ICON_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="#CA8A04" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16" style="flex-shrink:0;margin-top:1px;" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>`;

const CARD_ICONS: Record<string, string> = {
    cert: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>',
    'finance-cert': '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    otp: '<rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/><path d="M9 7h6"/><path d="M9 11h6"/>',
    'security-card': '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>',
};

const ICON_STYLES: Record<string, { bg: string; color: string }> = {
    cert: { bg: '#E8F0FC', color: '#0046A4' },
    'finance-cert': { bg: '#E8F0FC', color: '#0046A4' },
    otp: { bg: '#FFF3EC', color: '#FF6600' },
    'security-card': { bg: '#F0FFF4', color: '#059669' },
};

// ── HTML 빌더 ─────────────────────────────────────────────────────────────────

function escapeHtml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

interface CardData {
    type: keyof typeof CARD_ICONS;
    title: string;
    desc: string;
    href?: string;
    isLast?: boolean;
}

const DEFAULT_CARDS: CardData[] = [
    { type: 'cert', title: '공동인증서', desc: '발급 · 갱신 · 복사' },
    { type: 'finance-cert', title: '금융인증서', desc: '클라우드 기반 인증' },
    { type: 'otp', title: 'OTP', desc: '일회용 비밀번호 생성기' },
    { type: 'security-card', title: '보안카드', desc: '보안카드 분실 · 재발급', isLast: true },
];

function buildCardIcon(type: string, size = 22): string {
    const s = ICON_STYLES[type] ?? ICON_STYLES['cert'];
    const wrapSize = size + 26;
    return (
        `<div class="ac-icon-wrap" style="width:${wrapSize}px;height:${wrapSize}px;border-radius:14px;background:${s.bg};display:flex;align-items:center;justify-content:center;flex-shrink:0;color:${s.color};">` +
        `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="${size}" height="${size}" aria-hidden="true">${CARD_ICONS[type]}</svg>` +
        `</div>`
    );
}

function buildMobileCard(card: CardData): string {
    const borderBottom = card.isLast ? 'none' : '1px solid #F9FAFB';
    return (
        `<a href="${card.href ?? '#'}" class="ac-item" style="display:flex;align-items:center;gap:14px;padding:14px 20px;text-decoration:none;border-bottom:${borderBottom};min-height:64px;">` +
        buildCardIcon(card.type) +
        `<div style="flex:1;display:flex;flex-direction:column;gap:3px;min-width:0;">` +
        `<span style="font-size:15px;font-weight:700;color:#1A1A2E;">${escapeHtml(card.title)}</span>` +
        `<span style="font-size:12px;color:#6B7280;">${escapeHtml(card.desc)}</span>` +
        `</div>` +
        ARROW_SVG +
        `</a>`
    );
}

function buildWebCard(card: CardData): string {
    return (
        `<a href="${card.href ?? '#'}" class="ac-item" style="display:flex;align-items:center;gap:14px;padding:20px 24px;text-decoration:none;background:#fff;border-radius:12px;border:1px solid #F3F4F6;min-height:80px;">` +
        buildCardIcon(card.type, 24) +
        `<div style="flex:1;display:flex;flex-direction:column;gap:4px;min-width:0;">` +
        `<span style="font-size:16px;font-weight:700;color:#1A1A2E;">${escapeHtml(card.title)}</span>` +
        `<span style="font-size:13px;color:#6B7280;">${escapeHtml(card.desc)}</span>` +
        `</div>` +
        ARROW_SVG +
        `</a>`
    );
}

function buildHeader(): string {
    return (
        `<div style="padding:20px 20px 12px;border-bottom:1px solid #F3F4F6;">` +
        `<h3 style="font-size:18px;font-weight:700;color:#1A1A2E;margin:0 0 4px;">인증센터</h3>` +
        `<p style="font-size:13px;color:#6B7280;margin:0;">안전한 금융거래를 위한 인증 서비스</p>` +
        `</div>`
    );
}

function buildNotice(): string {
    return (
        `<div style="display:flex;align-items:flex-start;gap:8px;background:#FEF9C3;padding:14px 20px;border-top:1px solid #FEF08A;">` +
        NOTICE_ICON_SVG +
        `<p style="font-size:12px;color:#78350F;line-height:1.5;margin:0;font-weight:500;">[금융사명]은 절대 개인정보, 보안카드 번호 전체를 요구하지 않습니다.</p>` +
        `</div>`
    );
}

/** 모바일 HTML — 세로 목록 */
function makeMobileHtml(cards: CardData[] = DEFAULT_CARDS): string {
    return `<!DOCTYPE html><html><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<style>* { box-sizing: border-box; } body { margin: 0; }</style>
</head><body>
<div data-component-id="auth-center-mobile" data-spw-block style="font-family:${FONT_FAMILY};background:#fff;border-radius:20px;box-shadow:0 2px 16px rgba(0,70,164,0.07);">
    ${buildHeader()}
    <div style="padding:8px 0;">${cards.map(buildMobileCard).join('')}</div>
    ${buildNotice()}
</div>
</body></html>`;
}

/** 웹 HTML — 2×2 CSS grid */
function makeWebHtml(cards: CardData[] = DEFAULT_CARDS): string {
    return `<!DOCTYPE html><html><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<style>* { box-sizing: border-box; } body { margin: 0; }</style>
</head><body>
<div data-component-id="auth-center-web" data-spw-block style="font-family:${FONT_FAMILY};background:#fff;border-radius:20px;box-shadow:0 2px 16px rgba(0,70,164,0.07);width:100%;box-sizing:border-box;">
    <div style="padding:28px 32px 16px;border-bottom:1px solid #F3F4F6;">
        <h3 style="font-size:20px;font-weight:700;color:#1A1A2E;margin:0 0 6px;">인증센터</h3>
        <p style="font-size:14px;color:#6B7280;margin:0;">안전한 금융거래를 위한 인증 서비스</p>
    </div>
    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;padding:20px 24px;">
        ${cards.map(buildWebCard).join('')}
    </div>
    ${buildNotice()}
</div>
</body></html>`;
}

// ── HTML 상수 ─────────────────────────────────────────────────────────────────

const NORMAL_HTML = makeMobileHtml();
const WEB_HTML = makeWebHtml();

const SINGLE_CARD_HTML = makeMobileHtml([
    { type: 'cert', title: '공동인증서', desc: '발급 · 갱신 · 복사', isLast: true },
]);

const EMPTY_CARDS_HTML = makeMobileHtml([]);

const LONG_TEXT_HTML = makeMobileHtml([
    { type: 'cert', title: '공동인증서', desc: '발급 · 갱신 · 복사 · 삭제 · 재등록 · 내보내기 · 가져오기 등 모든 인증서 관리 기능을 제공합니다.' },
    { type: 'otp', title: 'OTP', desc: '일회용 비밀번호 생성기', isLast: true },
]);

const XSS_HTML = makeMobileHtml([
    { type: 'cert', title: '<script>window.__xss=1</script>', desc: '<img src=x onerror="window.__alert=1">', isLast: true },
]);

// ── 공통 체크 ─────────────────────────────────────────────────────────────────

test.describe('auth-center — 공통 체크', () => {
    test.beforeEach(async ({ page }) => {
        await page.setContent(NORMAL_HTML);
    });

    // eslint-disable-next-line playwright/expect-expect
    test('공통 레이아웃·접근성 기준 충족 (가로스크롤·뷰포트·폰트·터치·alt)', async ({ page }) => {
        await runCommonChecks(page, {
            componentIdPrefix: 'auth-center',
            buttonSelector: '.ac-item',
            minTouchSize: 44,
            minFontSize: 12,
        });
    });

    // eslint-disable-next-line playwright/expect-expect
    test('키보드 Tab 포커스 이동 가능 (ac-item이 a 태그)', async ({ page }) => {
        await checkKeyboardFocusable(page, 'a[href]');
    });
});

// ── 기기별 뷰포트 ────────────────────────────────────────────────────────────

test.describe('auth-center — 기기별 뷰포트', () => {
    test('iPhone SE (375px) — 가로 스크롤 없음·뷰포트 이탈 없음', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.setContent(NORMAL_HTML);
        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, '[data-component-id^="auth-center"]');
    });

    test('Galaxy S (360px) — 가로 스크롤 없음·뷰포트 이탈 없음', async ({ page }) => {
        await page.setViewportSize({ width: 360, height: 740 });
        await page.setContent(NORMAL_HTML);
        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, '[data-component-id^="auth-center"]');
    });

    test('iPhone Pro Max (430px) — 가로 스크롤 없음·뷰포트 이탈 없음', async ({ page }) => {
        await page.setViewportSize({ width: 430, height: 932 });
        await page.setContent(NORMAL_HTML);
        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, '[data-component-id^="auth-center"]');
    });
});

// ── 반응형 브레이크포인트 ────────────────────────────────────────────────────

test.describe('auth-center — 반응형 브레이크포인트', () => {
    test('767px — 모바일 경계에서 가로 스크롤 없음', async ({ page }) => {
        await page.setViewportSize({ width: 767, height: 1024 });
        await page.setContent(NORMAL_HTML);
        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, '[data-component-id^="auth-center"]');
    });

    test('768px — 태블릿 경계에서 가로 스크롤 없음', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.setContent(NORMAL_HTML);
        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, '[data-component-id^="auth-center"]');
    });

    test('1440px — 표준 데스크탑에서 뷰포트 이탈 없음', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.setContent(WEB_HTML);
        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, '[data-component-id^="auth-center"]');
    });
});

// ── 뷰어 렌더링 ─────────────────────────────────────────────────────────────

test.describe('auth-center — 뷰어 렌더링', () => {
    // DB 필요 → CI에서는 skip
    test.skip(!!process.env.CI, 'CI 환경에서는 DB 없이 뷰어 테스트 불가');

    test('/view 접근 시 에러 페이지가 아닌 정상 렌더링됨', async ({ page }) => {
        await page.goto('/view');
        const errorHeading = page.locator('h1:has-text("Application error")');
        await expect(errorHeading).not.toBeVisible({ timeout: 5000 });
    });
});

// ── 정상 동작 ─────────────────────────────────────────────────────────────────

test.describe('auth-center — 정상 동작', () => {
    test.beforeEach(async ({ page }) => {
        await page.setContent(NORMAL_HTML);
    });

    test('인증 항목(ac-item)이 4개 렌더링됨', async ({ page }) => {
        const items = page.locator('[data-component-id^="auth-center"] .ac-item');
        expect(await items.count()).toBe(4);
    });

    test('각 항목에 제목·설명 텍스트가 표시됨', async ({ page }) => {
        const items = page.locator('[data-component-id^="auth-center"] .ac-item');
        const count = await items.count();
        for (let i = 0; i < count; i++) {
            const texts = await items.nth(i).locator('span').allTextContents();
            // 제목 + 설명 최소 2개 span
            expect(texts.length, `${i + 1}번째 항목에 제목·설명 텍스트가 있어야 합니다`).toBeGreaterThanOrEqual(2);
            expect(texts[0].trim().length).toBeGreaterThan(0);
            expect(texts[1].trim().length).toBeGreaterThan(0);
        }
    });

    test('각 항목에 아이콘(SVG)이 존재함', async ({ page }) => {
        const icons = page.locator('[data-component-id^="auth-center"] .ac-icon-wrap svg');
        expect(await icons.count()).toBe(4);
    });

    test('각 항목에 href 속성이 존재함', async ({ page }) => {
        const items = page.locator('[data-component-id^="auth-center"] .ac-item');
        const count = await items.count();
        for (let i = 0; i < count; i++) {
            await expect(items.nth(i)).toHaveAttribute('href');
        }
    });

    test('헤더 제목 "인증센터"가 표시됨', async ({ page }) => {
        const heading = page.locator('[data-component-id^="auth-center"] h3');
        await expect(heading).toHaveText('인증센터');
    });

    test('보안 안내 문구(notice)가 표시됨', async ({ page }) => {
        const notice = page.locator('[data-component-id^="auth-center"] p:has-text("개인정보")');
        await expect(notice).toBeVisible();
    });
});

// ── 모드별 레이아웃 ──────────────────────────────────────────────────────────

test.describe('auth-center — 모드별 레이아웃', () => {
    test('모바일: 세로 목록 레이아웃 (ac-item이 세로 배치)', async ({ page }) => {
        await page.setContent(NORMAL_HTML);
        const items = page.locator('[data-component-id^="auth-center"] .ac-item');
        const count = await items.count();
        expect(count).toBeGreaterThanOrEqual(2);

        // 첫 번째와 두 번째 항목의 top 비교 — 세로 배치면 두 번째가 더 아래
        const box0 = await items.nth(0).boundingBox();
        const box1 = await items.nth(1).boundingBox();
        expect(box0).not.toBeNull();
        expect(box1).not.toBeNull();
        expect(box1!.y).toBeGreaterThan(box0!.y);
    });

    test('웹: 2×2 CSS grid 레이아웃 (첫 행에 2개 나란히)', async ({ page }) => {
        await page.setViewportSize({ width: 1280, height: 800 });
        await page.setContent(WEB_HTML);
        const items = page.locator('[data-component-id^="auth-center"] .ac-item');
        const count = await items.count();
        expect(count).toBeGreaterThanOrEqual(2);

        // 첫 번째와 두 번째 항목의 top이 동일 — 같은 행에 나란히
        const box0 = await items.nth(0).boundingBox();
        const box1 = await items.nth(1).boundingBox();
        expect(box0).not.toBeNull();
        expect(box1).not.toBeNull();
        expect(Math.abs(box1!.y - box0!.y)).toBeLessThan(5);
    });
});

// ── 예외 처리 ─────────────────────────────────────────────────────────────────

test.describe('auth-center — 예외 처리', () => {
    test('항목 0개 → 헤더·notice만 정상 표시', async ({ page }) => {
        await page.setContent(EMPTY_CARDS_HTML);
        const root = page.locator('[data-component-id^="auth-center"]');
        await expect(root).toBeAttached();
        // 항목 없어도 가로 스크롤 없음
        await checkNoHorizontalScroll(page);
    });

});

// ── 엣지 케이스 ──────────────────────────────────────────────────────────────

test.describe('auth-center — 엣지 케이스', () => {
    test('항목 1개일 때 레이아웃 유지', async ({ page }) => {
        await page.setContent(SINGLE_CARD_HTML);
        const items = page.locator('[data-component-id^="auth-center"] .ac-item');
        expect(await items.count()).toBe(1);
        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, '[data-component-id^="auth-center"]');
    });

    test('장문 설명 텍스트 — 레이아웃 깨짐 없음', async ({ page }) => {
        await page.setContent(LONG_TEXT_HTML);
        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, '[data-component-id^="auth-center"]');
    });

    test('XSS — raw <script> 문자열이 이스케이프되어 실행되지 않음', async ({ page }) => {
        await page.setContent(XSS_HTML);
        const xssTriggered = await page.evaluate(() => (window as Record<string, unknown>).__xss);
        expect(xssTriggered, '<script> 태그가 실행되면 안 됩니다').toBeUndefined();

        // 이스케이프된 문자열이 텍스트로 보여야 함
        const text = await page.locator('.ac-item').first().textContent();
        expect(text).toContain('<script>');
    });

    test('XSS — img onerror 이벤트가 실행되지 않음', async ({ page }) => {
        await page.setContent(XSS_HTML);
        const alertTriggered = await page.evaluate(() => (window as Record<string, unknown>).__alert);
        expect(alertTriggered, 'onerror 이벤트가 실행되면 안 됩니다').toBeUndefined();
    });
});

// ── 반응형 뷰포트 레이아웃 ──────────────────────────────────────────────────

test.describe('auth-center — 반응형 뷰포트 레이아웃', () => {
    // eslint-disable-next-line playwright/expect-expect
    test('360~1440px 전 뷰포트에서 가로 스크롤·뷰포트 이탈 없음', async ({ page }) => {
        await page.setContent(NORMAL_HTML);
        await checkViewportLayouts(page, '[data-component-id^="auth-center"]');
    });
});
