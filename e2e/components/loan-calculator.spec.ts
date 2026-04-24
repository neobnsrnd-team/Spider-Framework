// e2e/components/loan-calculator.spec.ts
// loan-calculator 컴포넌트 자동화 QA (Issue #317)

import { test, expect } from '@playwright/test';
import {
    checkNoHorizontalScroll,
    checkNotOutsideViewport,
    checkMinFontSize,
    checkMinTouchTarget,
    checkViewportLayouts,
    MOBILE_VIEWPORTS,
    WEB_VIEWPORTS,
} from '../helpers/component-checks';

// ── 상수 ──────────────────────────────────────────────────────────────────────

const ROOT = '[data-cb-type="loan-calculator"]';

// ── 컴포넌트 HTML (index.js Usage 주석과 동일한 구조) ────────────────────────

const COMPONENT_HTML = `
<div data-cb-type="loan-calculator">
    <div class="lc-tabs">
        <button class="lc-tab active" data-type="loan">대출</button>
        <button class="lc-tab" data-type="deposit">예금</button>
        <button class="lc-tab" data-type="savings">적금</button>
    </div>
    <div class="lc-body">
        <div class="lc-panel" data-type="loan">
            <div class="lc-field">
                <label class="lc-label">대출금액</label>
                <div class="lc-input-wrap">
                    <input type="number" inputmode="numeric" class="lc-input" data-key="principal" value="10000" min="100" max="500000" step="100"/>
                    <span class="lc-unit">만원</span>
                </div>
                <input type="range" class="lc-range" data-key="principal" min="100" max="500000" step="100" value="10000"/>
                <div class="lc-range-labels"><span>100만원</span><span>50억원</span></div>
            </div>
            <div class="lc-field">
                <label class="lc-label">금리 (연)</label>
                <div class="lc-input-wrap">
                    <input type="number" inputmode="decimal" class="lc-input" data-key="rate" value="5.0" min="0.1" max="30" step="0.1"/>
                    <span class="lc-unit">%</span>
                </div>
                <input type="range" class="lc-range" data-key="rate" min="0.1" max="30" step="0.1" value="5.0"/>
                <div class="lc-range-labels"><span>0.1%</span><span>30%</span></div>
            </div>
            <div class="lc-field">
                <label class="lc-label">대출기간</label>
                <div class="lc-input-wrap">
                    <input type="number" inputmode="numeric" class="lc-input" data-key="period" value="12" min="1" max="360" step="1"/>
                    <span class="lc-unit">개월</span>
                </div>
                <input type="range" class="lc-range" data-key="period" min="1" max="360" step="1" value="12"/>
                <div class="lc-range-labels"><span>1개월</span><span>30년</span></div>
            </div>
        </div>
        <div class="lc-panel" data-type="deposit" style="display:none">
            <div class="lc-field">
                <label class="lc-label">예치금액</label>
                <div class="lc-input-wrap">
                    <input type="number" inputmode="numeric" class="lc-input" data-key="principal" value="1000" min="10" max="1000000" step="10"/>
                    <span class="lc-unit">만원</span>
                </div>
                <input type="range" class="lc-range" data-key="principal" min="10" max="1000000" step="10" value="1000"/>
                <div class="lc-range-labels"><span>10만원</span><span>100억원</span></div>
            </div>
            <div class="lc-field">
                <label class="lc-label">금리 (연)</label>
                <div class="lc-input-wrap">
                    <input type="number" inputmode="decimal" class="lc-input" data-key="rate" value="3.5" min="0.1" max="20" step="0.1"/>
                    <span class="lc-unit">%</span>
                </div>
                <input type="range" class="lc-range" data-key="rate" min="0.1" max="20" step="0.1" value="3.5"/>
                <div class="lc-range-labels"><span>0.1%</span><span>20%</span></div>
            </div>
            <div class="lc-field">
                <label class="lc-label">예치기간</label>
                <div class="lc-input-wrap">
                    <input type="number" inputmode="numeric" class="lc-input" data-key="period" value="12" min="1" max="60" step="1"/>
                    <span class="lc-unit">개월</span>
                </div>
                <input type="range" class="lc-range" data-key="period" min="1" max="60" step="1" value="12"/>
                <div class="lc-range-labels"><span>1개월</span><span>60개월</span></div>
            </div>
        </div>
        <div class="lc-panel" data-type="savings" style="display:none">
            <div class="lc-field">
                <label class="lc-label">월 납입금액</label>
                <div class="lc-input-wrap">
                    <input type="number" inputmode="numeric" class="lc-input" data-key="monthly" value="100" min="1" max="10000" step="1"/>
                    <span class="lc-unit">만원</span>
                </div>
                <input type="range" class="lc-range" data-key="monthly" min="1" max="10000" step="1" value="100"/>
                <div class="lc-range-labels"><span>1만원</span><span>1억원</span></div>
            </div>
            <div class="lc-field">
                <label class="lc-label">금리 (연)</label>
                <div class="lc-input-wrap">
                    <input type="number" inputmode="decimal" class="lc-input" data-key="rate" value="4.0" min="0.1" max="20" step="0.1"/>
                    <span class="lc-unit">%</span>
                </div>
                <input type="range" class="lc-range" data-key="rate" min="0.1" max="20" step="0.1" value="4.0"/>
                <div class="lc-range-labels"><span>0.1%</span><span>20%</span></div>
            </div>
            <div class="lc-field">
                <label class="lc-label">적금기간</label>
                <div class="lc-input-wrap">
                    <input type="number" inputmode="numeric" class="lc-input" data-key="period" value="24" min="1" max="60" step="1"/>
                    <span class="lc-unit">개월</span>
                </div>
                <input type="range" class="lc-range" data-key="period" min="1" max="60" step="1" value="24"/>
                <div class="lc-range-labels"><span>1개월</span><span>60개월</span></div>
            </div>
        </div>
        <div class="lc-result">
            <div class="lc-result-item">
                <span class="lc-result-label lc-label-monthly">월 납입금</span>
                <span class="lc-result-value lc-val-monthly">0원</span>
            </div>
            <div class="lc-result-item">
                <span class="lc-result-label lc-label-interest">총 이자</span>
                <span class="lc-result-value lc-val-interest">0원</span>
            </div>
            <div class="lc-result-item lc-result-total">
                <span class="lc-result-label lc-label-total">총 상환금액</span>
                <span class="lc-result-value lc-val-total">0원</span>
            </div>
        </div>
        <a href="#" class="lc-apply-btn">신청</a>
    </div>
</div>`;

// ── HTML 생성 ─────────────────────────────────────────────────────────────────
const makeHtml = (): string => `
<!DOCTYPE html><html><head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="stylesheet" href="/assets/plugins/loan-calculator/style.css">
  <style>* { box-sizing: border-box; } body { margin: 0; padding: 16px; }</style>
</head><body>
  ${COMPONENT_HTML}
  <script type="module">
    import plugin from '/assets/plugins/loan-calculator/index.js';
    plugin.mount(document.querySelector('[data-cb-type="loan-calculator"]'), {});
  </script>
</body></html>`;

// ── 테스트 전용 경로 ───────────────────────────────────────────────────────────
// page.setContent() 는 null origin → ES module import 차단 → plugin 미실행
// page.route() + page.goto() 로 http://localhost:3000 origin 확보하여 모듈 로드 정상화
const TEST_PATH = '/loan-calculator-test';

// ── 마운트 헬퍼 ───────────────────────────────────────────────────────────────
// mount() → switchTab('loan') → calculate() 호출 → lc-val-monthly 가 "0원"에서 변경됨
async function mountAndWait(page: import('@playwright/test').Page): Promise<void> {
    await page.route(TEST_PATH, route => route.fulfill({
        contentType: 'text/html; charset=utf-8',
        body: makeHtml(),
    }));
    await page.goto(TEST_PATH);
    await expect(page.locator('.lc-val-monthly')).not.toHaveText('0원');
}

// ── 결과값 NaN/Infinity/계산불가 없음 확인 헬퍼 ──────────────────────────────
async function checkResultsValid(page: import('@playwright/test').Page): Promise<void> {
    for (const sel of ['.lc-val-monthly', '.lc-val-interest', '.lc-val-total']) {
        const text = await page.locator(sel).textContent();
        expect(text, `${sel} 결과에 NaN 없음`).not.toContain('NaN');
        expect(text, `${sel} 결과에 Infinity 없음`).not.toContain('Infinity');
    }
}

// ── 공통 체크 ─────────────────────────────────────────────────────────────────

test.describe('loan-calculator — 공통 체크', () => {
    test.beforeEach(async ({ page }) => {
        await mountAndWait(page);
    });

    // eslint-disable-next-line playwright/expect-expect
    test('가로 스크롤 없음', async ({ page }) => {
        await checkNoHorizontalScroll(page);
    });

    // eslint-disable-next-line playwright/expect-expect
    test('뷰포트 이탈 없음', async ({ page }) => {
        await checkNotOutsideViewport(page, ROOT);
    });

    // eslint-disable-next-line playwright/expect-expect
    test('폰트 크기 12px 이상 (장식용 range-label 10px 제외)', async ({ page }) => {
        // .lc-range-labels span 은 10px 장식 텍스트이므로 제외
        await checkMinFontSize(
            page,
            '.lc-tab, .lc-label, .lc-unit, .lc-result-label, .lc-result-value, .lc-apply-btn',
        );
    });

    // eslint-disable-next-line playwright/expect-expect
    test('터치 영역 44px 이상 (탭 버튼·신청 버튼)', async ({ page }) => {
        // .lc-tab: CSS height:44px / .lc-apply-btn: CSS height:52px
        await checkMinTouchTarget(page, '.lc-tab, .lc-apply-btn');
    });

    test('키보드 Tab 포커스 이동 가능', async ({ page }) => {
        await page.locator('.lc-tab').first().focus();
        await expect(page.locator('.lc-tab').first()).toBeFocused();
        // 탭 버튼 → 다음 탭 버튼으로 Tab 이동
        await page.keyboard.press('Tab');
        await expect(page.locator('.lc-tab').nth(1)).toBeFocused();
    });

    test('컴포넌트 루트 요소가 렌더링됨', async ({ page }) => {
        await expect(page.locator(ROOT)).toBeAttached();
    });
});

// ── 정상 동작 — 대출 탭 계산 ─────────────────────────────────────────────────

test.describe('loan-calculator — 대출 탭 계산', () => {
    test.beforeEach(async ({ page }) => {
        await mountAndWait(page);
    });

    test('대출 탭이 기본 활성화됨', async ({ page }) => {
        await expect(page.locator('.lc-tab[data-type="loan"]')).toHaveClass(/active/);
    });

    test('금액·금리·기간 입력 시 월납입금·총이자·총상환금액 실시간 계산됨', async ({ page }) => {
        const panel = page.locator('.lc-panel[data-type="loan"]');

        await panel.locator('.lc-input[data-key="principal"]').fill('20000');
        await panel.locator('.lc-input[data-key="rate"]').fill('3.5');
        await panel.locator('.lc-input[data-key="period"]').fill('24');
        // debounce 300ms 대기
        // eslint-disable-next-line playwright/no-wait-for-timeout
        await page.waitForTimeout(400);

        const monthly = await page.locator('.lc-val-monthly').textContent();
        const interest = await page.locator('.lc-val-interest').textContent();
        const total = await page.locator('.lc-val-total').textContent();

        expect(monthly?.trim()).not.toBe('0원');
        expect(interest?.trim()).not.toBe('0원');
        expect(total?.trim()).not.toBe('0원');
        await checkResultsValid(page);
    });

    test('결과 레이블이 대출 모드에 맞게 표시됨 (월 납입금 / 총 상환금액)', async ({ page }) => {
        await expect(page.locator('.lc-label-monthly')).toHaveText('월 납입금');
        await expect(page.locator('.lc-label-total')).toHaveText('총 상환금액');
    });
});

// ── 정상 동작 — 예금 탭 계산 ─────────────────────────────────────────────────

test.describe('loan-calculator — 예금 탭 계산', () => {
    test.beforeEach(async ({ page }) => {
        await mountAndWait(page);
        await page.locator('.lc-tab[data-type="deposit"]').click();
        await expect(page.locator('.lc-tab[data-type="deposit"]')).toHaveClass(/active/);
    });

    test('예금 탭 전환 후 패널이 표시됨', async ({ page }) => {
        await expect(page.locator('.lc-panel[data-type="deposit"]')).toBeVisible();
    });

    test('예치금액·금리·기간 입력 시 세전이자·세후이자·만기수령액 실시간 계산됨', async ({ page }) => {
        const panel = page.locator('.lc-panel[data-type="deposit"]');

        await panel.locator('.lc-input[data-key="principal"]').fill('5000');
        await panel.locator('.lc-input[data-key="rate"]').fill('4.0');
        await panel.locator('.lc-input[data-key="period"]').fill('24');
        // eslint-disable-next-line playwright/no-wait-for-timeout
        await page.waitForTimeout(400);

        const monthly = await page.locator('.lc-val-monthly').textContent();
        const interest = await page.locator('.lc-val-interest').textContent();
        const total = await page.locator('.lc-val-total').textContent();

        expect(monthly?.trim()).not.toBe('0원');
        expect(interest?.trim()).not.toBe('0원');
        expect(total?.trim()).not.toBe('0원');
        await checkResultsValid(page);
    });

    test('결과 레이블이 예금 모드에 맞게 변경됨 (세전 이자 / 만기 수령액)', async ({ page }) => {
        await expect(page.locator('.lc-label-monthly')).toHaveText('세전 이자');
        await expect(page.locator('.lc-label-total')).toHaveText('만기 수령액');
    });
});

// ── 정상 동작 — 적금 탭 계산 ─────────────────────────────────────────────────

test.describe('loan-calculator — 적금 탭 계산', () => {
    test.beforeEach(async ({ page }) => {
        await mountAndWait(page);
        await page.locator('.lc-tab[data-type="savings"]').click();
        await expect(page.locator('.lc-tab[data-type="savings"]')).toHaveClass(/active/);
    });

    test('적금 탭 전환 후 패널이 표시됨', async ({ page }) => {
        await expect(page.locator('.lc-panel[data-type="savings"]')).toBeVisible();
    });

    test('월납입금·금리·기간 입력 시 총납입원금·총이자·만기수령액 실시간 계산됨', async ({ page }) => {
        const panel = page.locator('.lc-panel[data-type="savings"]');

        await panel.locator('.lc-input[data-key="monthly"]').fill('200');
        await panel.locator('.lc-input[data-key="rate"]').fill('4.5');
        await panel.locator('.lc-input[data-key="period"]').fill('36');
        // eslint-disable-next-line playwright/no-wait-for-timeout
        await page.waitForTimeout(400);

        const monthly = await page.locator('.lc-val-monthly').textContent();
        const interest = await page.locator('.lc-val-interest').textContent();
        const total = await page.locator('.lc-val-total').textContent();

        expect(monthly?.trim()).not.toBe('0원');
        expect(total?.trim()).not.toBe('0원');
        await checkResultsValid(page);
        // 이자가 0원 이상 — 정상 적금 계산
        expect(interest?.trim()).not.toContain('NaN');
    });

    test('결과 레이블이 적금 모드에 맞게 변경됨 (총 납입원금 / 만기 수령액)', async ({ page }) => {
        await expect(page.locator('.lc-label-monthly')).toHaveText('총 납입원금');
        await expect(page.locator('.lc-label-total')).toHaveText('만기 수령액');
    });
});

// ── 예외 처리 ─────────────────────────────────────────────────────────────────

test.describe('loan-calculator — 예외 처리', () => {
    test.beforeEach(async ({ page }) => {
        await mountAndWait(page);
    });

    test('문자 입력 시 결과값 변동 없음 (NaN 무시)', async ({ page }) => {
        const prevMonthly = await page.locator('.lc-val-monthly').textContent();

        // type="number" 이더라도 JS로 직접 비정상 값 주입 후 플러그인 처리 확인
        await page.locator('.lc-panel[data-type="loan"] .lc-input[data-key="principal"]').evaluate(
            (el: HTMLInputElement) => {
                el.value = 'abc';
                el.dispatchEvent(new Event('input', { bubbles: true }));
            },
        );
        // eslint-disable-next-line playwright/no-wait-for-timeout
        await page.waitForTimeout(400);

        // 플러그인이 NaN 입력을 무시하여 결과값이 변동되지 않아야 함
        await expect(page.locator('.lc-val-monthly')).toHaveText(prevMonthly ?? '');
    });

    test('금리 0% 입력 시 이자 0원, 원금만 반환됨', async ({ page }) => {
        // min 속성(0.1)을 우회하여 0 입력 후 calculate() r===0 분기 검증
        await page.locator('.lc-panel[data-type="loan"] .lc-input[data-key="rate"]').evaluate(
            (el: HTMLInputElement) => {
                el.min = '0';
                el.value = '0';
                el.dispatchEvent(new Event('input', { bubbles: true }));
            },
        );
        // eslint-disable-next-line playwright/no-wait-for-timeout
        await page.waitForTimeout(400);

        // r=0 분기: monthlyAmt = P/n → interestAmt = totalAmt - P = 0
        const interest = await page.locator('.lc-val-interest').textContent();
        expect(interest?.trim()).toBe('0원');
    });

    test('기간 0개월 입력 시 처리 오류 없음 (컴포넌트 유지)', async ({ page }) => {
        // calculate() 에서 n<=0 이면 return 처리 → 오류 없이 유지
        await page.locator('.lc-panel[data-type="loan"] .lc-input[data-key="period"]').evaluate(
            (el: HTMLInputElement) => {
                el.min = '0';
                el.value = '0';
                el.dispatchEvent(new Event('input', { bubbles: true }));
            },
        );
        // eslint-disable-next-line playwright/no-wait-for-timeout
        await page.waitForTimeout(400);

        await expect(page.locator(ROOT), '기간 0 입력 후에도 컴포넌트가 유지되어야 합니다').toBeAttached();
        await checkResultsValid(page);
    });

    test('blur 시 범위 초과 입력값이 max로 자동 보정됨 (.lc-out-of-range 제거)', async ({ page }) => {
        const inputWrap = page.locator('.lc-panel[data-type="loan"] .lc-field').first().locator('.lc-input-wrap');
        const input = page.locator('.lc-panel[data-type="loan"] .lc-input[data-key="principal"]');

        // max(500000) 초과 값 주입 → out-of-range 클래스 부여
        await input.evaluate((el: HTMLInputElement) => {
            el.value = '999999';
            el.dispatchEvent(new Event('input', { bubbles: true }));
        });
        await expect(inputWrap).toHaveClass(/lc-out-of-range/);

        // focus 후 blur → max(500000)으로 클램핑, out-of-range 제거
        // el.blur()는 포커스가 없는 상태에서 no-op이므로 focus() 먼저 호출
        await input.focus();
        await input.evaluate((el: HTMLInputElement) => el.blur());
        await expect(inputWrap).not.toHaveClass(/lc-out-of-range/);

        const value = await input.inputValue();
        expect(Number(value)).toBeLessThanOrEqual(500000);
    });
});

// ── 엣지 케이스 ───────────────────────────────────────────────────────────────

test.describe('loan-calculator — 엣지 케이스', () => {
    test.beforeEach(async ({ page }) => {
        await mountAndWait(page);
    });

    test('대출 최대값(50억/30%/360개월) 입력 시 NaN·오버플로 없음', async ({ page }) => {
        const panel = page.locator('.lc-panel[data-type="loan"]');

        await panel.locator('.lc-input[data-key="principal"]').fill('500000'); // 50억 = max
        await panel.locator('.lc-input[data-key="rate"]').fill('30');           // max
        await panel.locator('.lc-input[data-key="period"]').fill('360');        // max (30년)
        // eslint-disable-next-line playwright/no-wait-for-timeout
        await page.waitForTimeout(400);

        await checkResultsValid(page);
        // 결과값이 "계산 불가"가 아닌 정상 금액 형태
        const total = await page.locator('.lc-val-total').textContent();
        expect(total?.trim()).not.toBe('계산 불가');
        expect(total?.trim()).not.toBe('0원');
    });

    // eslint-disable-next-line playwright/expect-expect
    test('금리 99.99% 입력 시 계산 결과 에러 없음', async ({ page }) => {
        // max(30) 초과이지만 calculate 내부에서 max 클램핑 후 계산
        await page.locator('.lc-panel[data-type="loan"] .lc-input[data-key="rate"]').evaluate(
            (el: HTMLInputElement) => {
                el.max = '99.99';
                el.value = '99.99';
                el.dispatchEvent(new Event('input', { bubbles: true }));
            },
        );
        // eslint-disable-next-line playwright/no-wait-for-timeout
        await page.waitForTimeout(400);
        await checkResultsValid(page);
    });

    test('소수점 금리 3.575% 입력 시 NaN 없음 (부동소수점 처리)', async ({ page }) => {
        await page.locator('.lc-panel[data-type="loan"] .lc-input[data-key="rate"]').fill('3.575');
        // eslint-disable-next-line playwright/no-wait-for-timeout
        await page.waitForTimeout(400);

        await checkResultsValid(page);
        const monthly = await page.locator('.lc-val-monthly').textContent();
        expect(monthly?.trim()).not.toBe('0원');
    });

    test('예금 최대값(100억/20%/60개월) 입력 시 NaN·오버플로 없음', async ({ page }) => {
        await page.locator('.lc-tab[data-type="deposit"]').click();
        await expect(page.locator('.lc-tab[data-type="deposit"]')).toHaveClass(/active/);

        const panel = page.locator('.lc-panel[data-type="deposit"]');
        await panel.locator('.lc-input[data-key="principal"]').fill('1000000'); // 100억 = max
        await panel.locator('.lc-input[data-key="rate"]').fill('20');
        await panel.locator('.lc-input[data-key="period"]').fill('60');
        // eslint-disable-next-line playwright/no-wait-for-timeout
        await page.waitForTimeout(400);

        await checkResultsValid(page);
    });
});

// ── 모바일 뷰 레이아웃 (360~430px) ──────────────────────────────────────────

test.describe('loan-calculator — 모바일 뷰 레이아웃 (360~430px)', () => {
    // eslint-disable-next-line playwright/expect-expect
    test('Galaxy S / iPhone SE / iPhone Pro Max — 가로 스크롤·뷰포트 이탈 없음', async ({ page }) => {
        await page.setContent(makeHtml());
        await checkViewportLayouts(page, ROOT, MOBILE_VIEWPORTS);
    });
});

// ── 웹 뷰 레이아웃 (767~1440px) ─────────────────────────────────────────────

test.describe('loan-calculator — 웹 뷰 레이아웃 (767~1440px)', () => {
    // eslint-disable-next-line playwright/expect-expect
    test('태블릿 경계~1440px 데스크탑 — 가로 스크롤·뷰포트 이탈 없음', async ({ page }) => {
        await page.setContent(makeHtml());
        await checkViewportLayouts(page, ROOT, WEB_VIEWPORTS);
    });
});

// ── 반응형 뷰 레이아웃 (전체 구간) ──────────────────────────────────────────

test.describe('loan-calculator — 반응형 뷰 레이아웃 (360~1440px)', () => {
    // eslint-disable-next-line playwright/expect-expect
    test('전체 뷰포트 구간 — 가로 스크롤·뷰포트 이탈 없음', async ({ page }) => {
        await page.setContent(makeHtml());
        await checkViewportLayouts(page, ROOT);
    });
});
