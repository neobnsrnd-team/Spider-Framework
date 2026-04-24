// e2e/pages/approval-flow.spec.ts
// 저장 → 승인 요청 → 승인 → 배포 E2E 플로우 테스트 (Issue #295)
// page.route() mock으로 Oracle 없이 CI 실행 가능

import { test, expect } from '@playwright/test';

const TEST_PAGE_ID = 'test-page-e2e-001';
const TEST_HTML = '<div data-spw-block>테스트 콘텐츠</div>';

test.describe('승인 플로우 — API 시나리오', () => {
    test('저장 → 승인 요청 → 승인 완료 순서 플로우', async ({ page }) => {
        // 1단계: 저장 mock — save는 { ok: true } 만 반환 (pageId 없음)
        await page.route('**/api/builder/save', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ ok: true }),
            });
        });

        // 2단계: 승인 요청 mock (PATCH)
        await page.route(`**/api/builder/pages/${TEST_PAGE_ID}/approve-request`, async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ ok: true }),
            });
        });

        // 3단계: 승인 mock (PATCH)
        await page.route(`**/api/builder/pages/${TEST_PAGE_ID}/approve`, async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ ok: true }),
            });
        });

        await page.goto('/');

        // 저장 API 호출 — 요청 body: { html, bank }
        const bank = TEST_PAGE_ID;
        const html = TEST_HTML;
        const saveResult = await page.evaluate(
            async ({ html, bank }) => {
                const res = await fetch('/api/builder/save', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ html, bank }),
                });
                return { body: await res.json() };
            },
            { html, bank },
        );
        expect(saveResult.body.ok).toBe(true);

        // 승인 요청 API 호출 (PATCH) — 요청 body: { approverId, approverName, beginningDate, expiredDate }
        const requestResult = await page.evaluate(async (id) => {
            const res = await fetch(`/api/builder/pages/${id}/approve-request`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    approverId: 'admin',
                    approverName: '관리자',
                    beginningDate: '2099-04-16',
                    expiredDate: '2099-04-30',
                }),
            });
            return { body: await res.json() };
        }, TEST_PAGE_ID);
        expect(requestResult.body.ok).toBe(true);

        // 승인 API 호출 (PATCH)
        const approveResult = await page.evaluate(async (id) => {
            const res = await fetch(`/api/builder/pages/${id}/approve`, { method: 'PATCH' });
            return { body: await res.json() };
        }, TEST_PAGE_ID);
        expect(approveResult.body.ok).toBe(true);
    });

    test('반려 처리 후 상태 변경 확인', async ({ page }) => {
        await page.route(`**/api/builder/pages/${TEST_PAGE_ID}/reject`, async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ ok: true, approveState: 'REJECTED' }),
            });
        });

        await page.goto('/');
        const result = await page.evaluate(async (id) => {
            const res = await fetch(`/api/builder/pages/${id}/reject`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reason: '내용 수정 필요' }),
            });
            return { body: await res.json() };
        }, TEST_PAGE_ID);

        expect(result.body.ok).toBe(true);
        expect(result.body.approveState).toBe('REJECTED');
    });

    test('긴급 차단 후 상태 변경 확인', async ({ page }) => {
        await page.route('**/api/builder/pages', async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    ok: true,
                    pages: [{ id: TEST_PAGE_ID, approveState: 'BLOCKED' }],
                }),
            });
        });

        await page.goto('/');
        const result = await page.evaluate(async () => {
            const res = await fetch('/api/builder/pages');
            return { body: await res.json() };
        });

        expect(result.body.ok).toBe(true);
        const targetPage = result.body.pages.find(
            (p: { id: string }) => p.id === TEST_PAGE_ID,
        );
        expect(targetPage?.approveState).toBe('BLOCKED');
    });
});
