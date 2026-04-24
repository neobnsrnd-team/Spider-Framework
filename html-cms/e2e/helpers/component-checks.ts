// e2e/helpers/component-checks.ts
// 금융 컴포넌트 공통 QA 체크 함수 모음
// 모든 컴포넌트 스펙 파일에서 import하여 재사용

import { type Page, expect } from '@playwright/test';

// ── 타입 ──────────────────────────────────────────────────────────────────

export interface CommonCheckOptions {
    /** 컴포넌트 루트 셀렉터 (기본: data-component-id 속성 보유 첫 번째 요소) */
    rootSelector?: string;
    /** 터치 영역 체크 대상 버튼 셀렉터 (생략 시 button, [role="button"] 전체) */
    buttonSelector?: string;
    /** 폰트 크기 체크 대상 텍스트 셀렉터 (생략 시 p, span, a, li 등 텍스트 요소) */
    textSelector?: string;
    /** 최소 터치 영역 px (기본: 44) */
    minTouchSize?: number;
    /** 최소 폰트 크기 px (기본: 12) */
    minFontSize?: number;
}

// ── 공통 체크 함수 ────────────────────────────────────────────────────────

/**
 * 가로 스크롤이 발생하지 않는지 확인
 * 모든 컴포넌트에 적용
 */
export async function checkNoHorizontalScroll(page: Page) {
    const hasHScroll = await page.evaluate(
        () => document.body.scrollWidth > document.documentElement.clientWidth,
    );
    expect(hasHScroll, '가로 스크롤이 발생하면 안 됩니다').toBe(false);
}

/**
 * 컴포넌트 루트 요소가 뷰포트를 벗어나지 않는지 확인
 * 모든 컴포넌트에 적용
 */
export async function checkNotOutsideViewport(page: Page, rootSelector: string) {
    const box = await page.locator(rootSelector).boundingBox();
    const viewport = page.viewportSize()!;

    expect(box, '컴포넌트 루트 요소가 화면에 표시되어야 합니다').not.toBeNull();
    expect(box!.x, '컴포넌트가 화면 왼쪽을 벗어나면 안 됩니다').toBeGreaterThanOrEqual(0);
    // 우측 경계: 1px 오차 허용
    expect(box!.x + box!.width, '컴포넌트가 화면 오른쪽을 벗어나면 안 됩니다').toBeLessThanOrEqual(
        viewport.width + 1,
    );
}

/**
 * 텍스트 요소의 폰트 크기가 최소 기준 이상인지 확인
 * 모든 컴포넌트에 적용 (기본 최소값: 12px)
 */
export async function checkMinFontSize(
    page: Page,
    textSelector = 'p, span, a, li, button, label, h1, h2, h3, h4, h5',
    minSize = 12,
) {
    const elements = page.locator(textSelector);
    const count = await elements.count();
    if (count === 0) return;

    for (let i = 0; i < count; i++) {
        const fontSize = await elements.nth(i).evaluate(
            el => parseFloat(getComputedStyle(el).fontSize),
        );
        // 숨겨진 요소(font-size: 0)는 제외
        if (fontSize === 0) continue;
        expect(
            fontSize,
            `폰트 크기가 ${minSize}px 이상이어야 합니다 (현재: ${fontSize}px)`,
        ).toBeGreaterThanOrEqual(minSize);
    }
}

/**
 * 버튼·아이콘의 터치 영역이 최소 기준 이상인지 확인
 * 인터랙티브 요소가 있는 컴포넌트에 적용 (기본 최소값: 44px)
 */
export async function checkMinTouchTarget(
    page: Page,
    buttonSelector = 'button, [role="button"], a[href]',
    minSize = 44,
) {
    const buttons = page.locator(buttonSelector);
    const count = await buttons.count();
    if (count === 0) return;

    for (let i = 0; i < count; i++) {
        const box = await buttons.nth(i).boundingBox();
        if (!box) continue;
        // 가로·세로 모두 기준 이상이어야 통과 (OR 로직은 5×100px 같은 비정상 버튼도 통과시키는 버그)
        const meetsTarget = box.width >= minSize && box.height >= minSize;
        expect(
            meetsTarget,
            `터치 영역이 ${minSize}px 이상이어야 합니다 (현재: ${box.width}×${box.height}px)`,
        ).toBe(true);
    }
}

/**
 * 이미지 요소에 alt 속성이 모두 존재하는지 확인
 * 이미지가 포함된 컴포넌트에 적용
 */
export async function checkImagesHaveAlt(page: Page) {
    const images = page.locator('img');
    const count = await images.count();
    if (count === 0) return;

    for (let i = 0; i < count; i++) {
        await expect(
            images.nth(i),
            `이미지에 alt 속성이 있어야 합니다`,
        ).toHaveAttribute('alt', /.*/);
    }
}

/**
 * 인터랙티브 요소가 키보드 포커스 가능한지 확인 (접근성)
 * 버튼·링크가 있는 컴포넌트에 적용
 */
export async function checkKeyboardFocusable(
    page: Page,
    selector = 'button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
) {
    const elements = page.locator(selector);
    const count = await elements.count();
    if (count === 0) return;

    // 첫 번째 포커스 가능 요소 Tab 이동 확인
    await page.keyboard.press('Tab');
    // body가 아닌 요소에 포커스되었고, 전달된 셀렉터와 매칭되는지 확인
    // (tabindex="0"인 div/span 등 커스텀 포커스 요소도 포함)
    const isFocused = await page.evaluate((sel) => {
        const active = document.activeElement;
        if (!active || active === document.body) return false;
        return active.matches(sel);
    }, selector);
    expect(isFocused, '키보드 Tab으로 인터랙티브 요소에 포커스되어야 합니다').toBe(true);
}

/**
 * data-component-id 속성이 존재하는지 확인
 * 순수 HTML 컴포넌트 전체에 적용
 */
export async function checkComponentIdExists(page: Page, componentIdPrefix: string) {
    const el = page.locator(`[data-component-id^="${componentIdPrefix}"]`);
    await expect(el, `data-component-id="${componentIdPrefix}-*" 요소가 존재해야 합니다`).toBeAttached();
}

// ── 반응형 뷰포트 체크 ────────────────────────────────────────────────────

export interface ViewportEntry {
    name: string;
    width: number;
    height: number;
}

/** 모바일 뷰 전용 뷰포트 세트 (360~430px) */
export const MOBILE_VIEWPORTS: ViewportEntry[] = [
    { name: 'Galaxy S',         width: 360,  height: 800  },
    { name: 'iPhone SE',        width: 375,  height: 667  },
    { name: 'iPhone Pro Max',   width: 430,  height: 932  },
];

/** 웹·태블릿 뷰 전용 뷰포트 세트 (767px~1440px) */
export const WEB_VIEWPORTS: ViewportEntry[] = [
    { name: '767px 경계',       width: 767,  height: 1024 },
    { name: '768px 경계',       width: 768,  height: 1024 },
    { name: '1440px 데스크탑',  width: 1440, height: 900  },
];

/** 전체 구간 뷰포트 세트 (모바일 + 웹, 기본값) */
const DEFAULT_VIEWPORTS: ViewportEntry[] = [
    ...MOBILE_VIEWPORTS,
    ...WEB_VIEWPORTS,
];

/**
 * 여러 뷰포트 크기에서 가로 스크롤·뷰포트 이탈을 자동 검증
 * 모든 컴포넌트의 반응형 레이아웃 QA 자동화용
 *
 * @example
 * await checkViewportLayouts(page, '[data-component-id^="product-menu"]');
 */
export async function checkViewportLayouts(
    page: Page,
    rootSelector: string,
    viewports: ViewportEntry[] = DEFAULT_VIEWPORTS,
) {
    for (const vp of viewports) {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, rootSelector);
    }
}

// ── 일괄 실행 헬퍼 ────────────────────────────────────────────────────────

/**
 * 모든 컴포넌트에 공통으로 적용되는 체크를 한 번에 실행
 *
 * @example
 * await runCommonChecks(page, {
 *   rootSelector: '[data-component-id^="app-header"]',
 *   componentIdPrefix: 'app-header',
 * });
 */
export async function runCommonChecks(
    page: Page,
    opts: CommonCheckOptions & { componentIdPrefix: string },
) {
    const root = opts.rootSelector ?? `[data-component-id^="${opts.componentIdPrefix}"]`;

    await checkComponentIdExists(page, opts.componentIdPrefix);
    await checkNoHorizontalScroll(page);
    await checkNotOutsideViewport(page, root);
    await checkMinFontSize(page, opts.textSelector, opts.minFontSize);
    await checkMinTouchTarget(page, opts.buttonSelector, opts.minTouchSize);
    await checkImagesHaveAlt(page);
    await checkKeyboardFocusable(page);
}
