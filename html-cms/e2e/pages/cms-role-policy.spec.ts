import { test, expect } from '@playwright/test';

test.describe('CMS role policy', () => {
    test('CMS:R bypass user can access /dashboard', async ({ page, context }) => {
        await context.clearCookies();

        await page.goto('/dashboard');

        await expect(page).toHaveURL(/\/dashboard$/);
        await expect(page.getByRole('heading', { name: '대시보드' })).toBeVisible();
        await expect(page.getByRole('button', { name: '+ 새 페이지' })).toBeVisible();
    });

    test('CMS:W bypass user with CMS:R can access /dashboard', async ({ page, context, baseURL }) => {
        await context.addCookies([
            {
                name: 'cms_bypass_role',
                value: 'cms_admin',
                url: baseURL!,
            },
        ]);

        await page.goto('/dashboard');

        await expect(page).toHaveURL(/\/dashboard$/);
        await expect(page.getByRole('heading', { name: '대시보드' })).toBeVisible();
    });

    test('CMS:W bypass user is redirected from /approve to /cms-admin/approvals', async ({ page, context, baseURL }) => {
        await context.addCookies([
            {
                name: 'cms_bypass_role',
                value: 'cms_admin',
                url: baseURL!,
            },
        ]);

        await page.goto('/approve');

        await expect(page).toHaveURL(/\/cms-admin\/approvals$/);
    });
});
