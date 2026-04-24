// e2e/components/info-accordion-editor.spec.ts
// InfoAccordionEditor table editing E2E via dedicated harness page

import { test, expect } from '@playwright/test';

test.describe('InfoAccordionEditor table editing', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/dev/info-accordion-table-e2e');
        await page.waitForLoadState('domcontentloaded');
    });

    test('edits table structure and styles, then writes updated HTML back to accordion content', async ({ page }) => {
        await page.getByTestId('open-info-accordion-editor').click();
        await page.getByTestId('edit-table-0').evaluate((el: HTMLElement) => el.click());

        await expect(page.getByTestId('table-editor-modal')).toBeVisible();

        await page.getByRole('button', { name: '행 추가' }).click();
        await page.getByRole('button', { name: '열 추가' }).click();
        await page.getByTestId('delete-table-row-2').evaluate((el: HTMLElement) => el.click());
        await page.getByTestId('delete-table-column-2').evaluate((el: HTMLElement) => el.click());

        await page.locator('input[placeholder="예: 120px 또는 25%"]').first().fill('140px');
        await page.locator('input[placeholder="예: 48px"]').first().fill('56px');

        const firstCell = page.locator('textarea[placeholder="셀 내용을 입력하세요"]').first();
        await firstCell.click();
        await firstCell.fill('한도');

        await page.locator('input[type="color"]').fill('#ffcc00');
        await page.locator('select').first().selectOption('center');
        await page.locator('select').nth(1).selectOption('middle');

        await page.getByTestId('apply-table-editor').evaluate((el: HTMLElement) => el.click());
        await expect(page.getByTestId('table-editor-modal')).toBeHidden();

        await page.getByTestId('apply-info-accordion-editor').evaluate((el: HTMLElement) => el.click());

        const payload = await page.getByTestId('accordion-block').evaluate((el) => {
            const raw = el.getAttribute('data-accordion-items');
            return raw ? JSON.parse(raw) : null;
        });

        expect(payload).not.toBeNull();
        expect(payload[0].content).toContain('<table');
        expect(payload[0].content).toContain('width:140px');
        expect(payload[0].content).toContain('height:56px');
        expect(payload[0].content).toContain('background-color:#ffcc00');
        expect(payload[0].content).toContain('text-align:center');
        expect(payload[0].content).toContain('vertical-align:middle');
        expect(payload[0].content).toContain('한도');

        const summary = await page.getByTestId('accordion-block').evaluate((el) => {
            const table = el.querySelector('table');
            const firstCellEl = table?.querySelector('tr:first-child td, tr:first-child th') as HTMLElement | null;
            return {
                rowCount: table?.querySelectorAll('tr').length ?? 0,
                firstRowCellCount: table?.querySelector('tr')?.querySelectorAll('td, th').length ?? 0,
                firstCellText: firstCellEl?.innerText?.trim() ?? '',
                firstCellBg: firstCellEl?.style.backgroundColor ?? '',
                firstCellTextAlign: firstCellEl?.style.textAlign ?? '',
                firstCellVerticalAlign: firstCellEl?.style.verticalAlign ?? '',
                firstCellWidth: firstCellEl?.style.width ?? '',
                firstCellHeight: firstCellEl?.style.height ?? '',
            };
        });

        expect(summary.rowCount).toBe(2);
        expect(summary.firstRowCellCount).toBe(2);
        expect(summary.firstCellText).toBe('한도');
        expect(summary.firstCellBg).toBe('rgb(255, 204, 0)');
        expect(summary.firstCellTextAlign).toBe('center');
        expect(summary.firstCellVerticalAlign).toBe('middle');
        expect(summary.firstCellWidth).toBe('140px');
        expect(summary.firstCellHeight).toBe('56px');
    });

    test('reflects latest canvas table text when reopening the table editor', async ({ page }) => {
        await page.getByTestId('accordion-block').evaluate((el) => {
            const firstCell = el.querySelector('table tr:first-child td, table tr:first-child th');
            if (firstCell) firstCell.innerHTML = '캔버스수정';
        });

        await page.getByTestId('open-info-accordion-editor').click();
        await page.getByTestId('edit-table-0').evaluate((el: HTMLElement) => el.click());
        await expect(page.getByTestId('table-editor-modal')).toBeVisible();

        const firstCellEditor = page.locator('textarea[placeholder="셀 내용을 입력하세요"]').first();
        await expect(firstCellEditor).toHaveValue('캔버스수정');
    });

    test('shows current column width and row height as default values in the table editor', async ({ page }) => {
        await page.getByTestId('open-info-accordion-editor').click();
        await page.getByTestId('edit-table-0').evaluate((el: HTMLElement) => el.click());
        await expect(page.getByTestId('table-editor-modal')).toBeVisible();

        const firstWidthInput = page.locator('input[placeholder="예: 120px 또는 25%"]').first();
        const firstHeightInput = page.locator('input[placeholder="예: 48px"]').first();

        const widthValue = await firstWidthInput.inputValue();
        const heightValue = await firstHeightInput.inputValue();

        expect(widthValue.length).toBeGreaterThan(0);
        expect(heightValue.length).toBeGreaterThan(0);
    });
});
