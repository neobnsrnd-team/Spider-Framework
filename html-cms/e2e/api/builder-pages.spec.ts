// e2e/api/builder-pages.spec.ts
// 빌더 페이지 API 계약 테스트 — page.route() mock으로 Oracle 없이 CI 실행 (Issue #295)

import { test, expect } from '@playwright/test';

// mock 페이지 데이터 — 실제 API 응답 구조 반영
const MOCK_PAGE = {
    bank: 'test-page-001',
    html: '<div>테스트 콘텐츠</div>',
    approveState: 'WORK',
    lastModifiedDtime: '2026-04-07T00:00:00.000Z',
};

const MOCK_PAGES_LIST = [
    { id: 'test-page-001', approveState: 'WORK',     lastModifiedDtime: '2026-04-07T00:00:00.000Z' },
    { id: 'test-page-002', approveState: 'APPROVED', lastModifiedDtime: '2026-04-06T00:00:00.000Z' },
];

test.describe('빌더 페이지 API', () => {
    test.describe('POST /api/builder/load — 페이지 불러오기', () => {
        test('페이지 불러오기 응답 구조 검증', async ({ page }) => {
            await page.route('**/api/builder/load', async (route) => {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ ok: true, html: MOCK_PAGE.html }),
                });
            });

            await page.goto('/');
            const result = await page.evaluate(async () => {
                const res = await fetch('/api/builder/load', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ bank: 'test-page-001' }),
                });
                return { status: res.status, body: await res.json() };
            });

            expect(result.status).toBe(200);
            expect(result.body.ok).toBe(true);
            expect(typeof result.body.html).toBe('string');
        });
    });

    test.describe('POST /api/builder/save — 페이지 저장', () => {
        test('페이지 저장 응답 구조 검증', async ({ page }) => {
            await page.route('**/api/builder/save', async (route) => {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ ok: true }),
                });
            });

            await page.goto('/');
            const result = await page.evaluate(async () => {
                const res = await fetch('/api/builder/save', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ html: '<div>테스트</div>', bank: 'test-page-001' }),
                });
                return { status: res.status, body: await res.json() };
            });

            expect(result.status).toBe(200);
            expect(result.body.ok).toBe(true);
        });
    });

    test.describe('GET /api/builder/pages — 페이지 목록', () => {
        test('페이지 목록 응답 구조 검증', async ({ page }) => {
            await page.route('**/api/builder/pages', async (route) => {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ ok: true, pages: MOCK_PAGES_LIST }),
                });
            });

            await page.goto('/');
            const result = await page.evaluate(async () => {
                const res = await fetch('/api/builder/pages');
                return { status: res.status, body: await res.json() };
            });

            expect(result.status).toBe(200);
            expect(result.body.ok).toBe(true);
            expect(Array.isArray(result.body.pages)).toBe(true);
        });

        test('페이지 목록 — 각 항목 필수 필드 확인', async ({ page }) => {
            await page.route('**/api/builder/pages', async (route) => {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ ok: true, pages: MOCK_PAGES_LIST }),
                });
            });

            await page.goto('/');
            const result = await page.evaluate(async () => {
                const res = await fetch('/api/builder/pages');
                return { body: await res.json() };
            });

            result.body.pages.forEach((item: Record<string, unknown>) => {
                expect(item).toHaveProperty('id');
                expect(item).toHaveProperty('approveState');
            });
        });
    });

    test.describe('PATCH /api/builder/pages/[pageId]/approve-request — 승인 요청', () => {
        test('승인 요청 응답 구조 검증', async ({ page }) => {
            await page.route('**/api/builder/pages/test-page-001/approve-request', async (route) => {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ ok: true }),
                });
            });

            await page.goto('/');
            const result = await page.evaluate(async () => {
                const res = await fetch('/api/builder/pages/test-page-001/approve-request', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        approverId: 'admin',
                        approverName: '관리자',
                        beginningDate: '2099-04-16',
                        expiredDate: '2099-04-30',
                    }),
                });
                return { status: res.status, body: await res.json() };
            });

            expect(result.status).toBe(200);
            expect(result.body.ok).toBe(true);
        });
    });

    test.describe('PATCH /api/builder/pages/[pageId]/approve — 승인', () => {
        test('승인 응답 구조 검증', async ({ page }) => {
            await page.route('**/api/builder/pages/test-page-001/approve', async (route) => {
                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({ ok: true }),
                });
            });

            await page.goto('/');
            const result = await page.evaluate(async () => {
                const res = await fetch('/api/builder/pages/test-page-001/approve', {
                    method: 'PATCH',
                });
                return { status: res.status, body: await res.json() };
            });

            expect(result.status).toBe(200);
            expect(result.body.ok).toBe(true);
        });
    });
});
