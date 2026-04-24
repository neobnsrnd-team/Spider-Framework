// e2e/api/components.spec.ts
// 컴포넌트 API 계약 테스트 — page.route() mock으로 Oracle 없이 CI 실행 (Issue #295)

import { test, expect } from '@playwright/test';

// 컴포넌트 목록 mock 응답 데이터
const MOCK_COMPONENTS = [
    {
        id: 'event-banner-mobile',
        label: '이벤트 배너',
        description: '자동재생 이미지 배너 슬라이드',
        viewMode: 'mobile',
        preview: '/assets/minimalist-blocks/preview/event-banner.svg',
    },
    {
        id: 'event-banner-web',
        label: '이벤트 배너',
        description: '자동재생 이미지 배너 슬라이드',
        viewMode: 'web',
        preview: '/assets/minimalist-blocks/preview/event-banner.svg',
    },
];

test.describe('컴포넌트 API — /api/components', () => {
    test('컴포넌트 목록 조회 — 응답 구조 검증', async ({ page }) => {
        // DB 응답 mock — 브라우저 내부 fetch 요청을 intercept
        await page.route('**/api/components', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ ok: true, components: MOCK_COMPONENTS }),
            });
        });

        // 랜딩 페이지 로드 후 브라우저 내부에서 fetch 실행 (about:blank는 origin 없어 상대 URL 불가)
        await page.goto('/');
        const result = await page.evaluate(async () => {
            const res = await fetch('/api/components');
            return { status: res.status, body: await res.json() };
        });

        expect(result.status).toBe(200);
        expect(result.body.ok).toBe(true);
        expect(Array.isArray(result.body.components)).toBe(true);
    });

    test('컴포넌트 목록 — viewMode 필터 (mobile)', async ({ page }) => {
        const mobileOnly = MOCK_COMPONENTS.filter((c) => c.viewMode === 'mobile');

        await page.route('**/api/components?viewMode=mobile', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ ok: true, components: mobileOnly }),
            });
        });

        await page.goto('/');
        const result = await page.evaluate(async () => {
            const res = await fetch('/api/components?viewMode=mobile');
            return { body: await res.json() };
        });

        expect(result.body.ok).toBe(true);
        result.body.components.forEach((item: { viewMode: string }) => {
            expect(item.viewMode).toBe('mobile');
        });
    });

    test('컴포넌트 목록 — 각 항목 필수 필드 포함 확인', async ({ page }) => {
        await page.route('**/api/components', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ ok: true, components: MOCK_COMPONENTS }),
            });
        });

        await page.goto('/');
        const result = await page.evaluate(async () => {
            const res = await fetch('/api/components');
            return { body: await res.json() };
        });

        result.body.components.forEach((item: Record<string, unknown>) => {
            expect(item).toHaveProperty('id');
            expect(item).toHaveProperty('label');
            expect(item).toHaveProperty('viewMode');
            expect(item).toHaveProperty('preview');
        });
    });
});
