// e2e/smoke/smoke.spec.ts
// 인프라 기본 동작 스모크 테스트 — DB 없이 실행 가능 (Issue #295)

import { test, expect } from '@playwright/test';

test.describe('스모크 테스트 — 페이지 로드', () => {
    test('에디터 페이지(/edit) 로드 확인', async ({ page }) => {
        await page.goto('/edit');

        // 에디터 캔버스 영역 확인
        await expect(page).not.toHaveTitle(/error|500|404/i);
        await expect(page.locator('body')).toBeVisible();
    });

    test('뷰어 페이지(/view) 로드 확인', async ({ page }) => {
        await page.goto('/view');

        // 에러 페이지가 아닌지 확인
        await expect(page).not.toHaveTitle(/error|500|404/i);
        await expect(page.locator('body')).toBeVisible();
    });

});

test.describe('스모크 테스트 — API 헬스체크', () => {
    test('헬스체크 API(/api/health) 응답 확인', async ({ request }) => {
        const response = await request.get('/api/health');

        expect(response.status()).toBe(200);
    });

    test('컴포넌트 목록 API(/api/components) 응답 구조 확인', async ({ request }) => {
        const response = await request.get('/api/components');

        // DB 연결 여부와 무관하게 JSON 응답을 반환해야 함
        expect(response.headers()['content-type']).toContain('application/json');

        const body = await response.json() as Record<string, unknown>;
        // ok 필드가 있어야 함 (성공 또는 실패 모두)
        expect(body).toHaveProperty('ok');
    });
});
