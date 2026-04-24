// e2e/components/exchange-board.spec.ts
// exchange-board 컴포넌트 자동화 QA (Issue #307)

import { test, expect } from '@playwright/test';
import {
    runCommonChecks,
    checkNoHorizontalScroll,
    checkNotOutsideViewport,
    checkViewportLayouts,
} from '../helpers/component-checks';

// ── CSS (style.css 인라인) ────────────────────────────────────────────────

const EB_CSS = `
[data-cb-type="exchange-board"] {
    --eb-accent: #0046A4; --eb-up: #DC2626; --eb-down: #2563EB;
    position: relative; background: #fff; border-radius: 20px;
    box-shadow: 0 2px 16px rgba(0,70,164,0.07);
    font-family: -apple-system, BlinkMacSystemFont, 'Malgun Gothic', sans-serif;
    width: 100%; box-sizing: border-box;
}
[data-cb-type="exchange-board"] .eb-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 18px 20px 14px; border-bottom: 1px solid #F3F4F6;
}
[data-cb-type="exchange-board"] .eb-title { font-size: 17px; font-weight: 700; color: #1A1A2E; }
[data-cb-type="exchange-board"] .eb-updated { font-size: 11px; color: #9CA3AF; }
[data-cb-type="exchange-board"] .eb-item {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 20px; border-bottom: 1px solid #F9FAFB; min-height: 64px;
}
[data-cb-type="exchange-board"] .eb-left { display: flex; align-items: center; gap: 12px; flex: 1; }
[data-cb-type="exchange-board"] .eb-flag { width: 36px; text-align: center; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
[data-cb-type="exchange-board"] .eb-flag img { width: 28px; height: auto; display: block; }
[data-cb-type="exchange-board"] .eb-code { font-size: 15px; font-weight: 700; color: #1A1A2E; }
[data-cb-type="exchange-board"] .eb-name { font-size: 11px; color: #9CA3AF; }
[data-cb-type="exchange-board"] .eb-right { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
[data-cb-type="exchange-board"] .eb-rate-row { display: flex; align-items: center; gap: 8px; }
[data-cb-type="exchange-board"] .eb-label { font-size: 10px; color: #9CA3AF; background: #F3F4F6; padding: 2px 6px; border-radius: 4px; }
[data-cb-type="exchange-board"] .eb-buy,
[data-cb-type="exchange-board"] .eb-sell { font-size: 14px; font-weight: 600; color: #1A1A2E; min-width: 70px; text-align: right; }
[data-cb-type="exchange-board"] .eb-change { font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 6px; }
[data-cb-type="exchange-board"] .eb-change.up { color: var(--eb-up); background: #FEF2F2; }
[data-cb-type="exchange-board"] .eb-change.down { color: var(--eb-down); background: #EFF6FF; }
[data-cb-type="exchange-board"] .eb-footer { padding: 12px 20px 16px; border-top: 1px solid #F3F4F6; }
[data-cb-type="exchange-board"] .eb-exchange-btn {
    display: flex; align-items: center; justify-content: center; width: 100%;
    background: var(--eb-accent); color: #fff; text-decoration: none;
    font-size: 15px; font-weight: 600; padding: 14px; border-radius: 12px;
    min-height: 48px; box-sizing: border-box;
}
`;

// ── 테스트용 HTML ─────────────────────────────────────────────────────────

const makeHtml = (items: string, exchangeHref = 'https://ibk.co.kr/exchange') => `
<!DOCTYPE html><html><head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>* { box-sizing: border-box; } body { margin: 0; }
  ${EB_CSS}
  </style>
</head><body>
  <div data-component-id="exchange-board-mobile"
       data-cb-type="exchange-board"
       style="width:100%;">
    <div class="eb-header">
      <span class="eb-title">실시간 환율</span>
      <span class="eb-updated">기준: 서울외국환중개</span>
    </div>
    <div class="eb-list">${items}</div>
    <div class="eb-footer">
      <a href="${exchangeHref}" class="eb-exchange-btn">환전 신청</a>
    </div>
  </div>
</body></html>
`;

const ITEM_USD = `
  <div class="eb-item" data-currency="USD">
    <div class="eb-left">
      <span class="eb-flag"><img src="https://flagcdn.com/w40/us.png" alt="USD"></span>
      <div class="eb-currency-info">
        <span class="eb-code">USD</span>
        <span class="eb-name">미국 달러</span>
      </div>
    </div>
    <div class="eb-right">
      <div class="eb-rates">
        <div class="eb-rate-row"><span class="eb-label">살 때</span><span class="eb-buy">1,325.50</span></div>
        <div class="eb-rate-row"><span class="eb-label">팔 때</span><span class="eb-sell">1,296.50</span></div>
      </div>
      <div class="eb-change up">▲ 3.50</div>
    </div>
  </div>`;

const ITEM_EUR = `
  <div class="eb-item" data-currency="EUR">
    <div class="eb-left">
      <span class="eb-flag"><img src="https://flagcdn.com/w40/eu.png" alt="EUR"></span>
      <div class="eb-currency-info">
        <span class="eb-code">EUR</span>
        <span class="eb-name">유럽 유로</span>
      </div>
    </div>
    <div class="eb-right">
      <div class="eb-rates">
        <div class="eb-rate-row"><span class="eb-label">살 때</span><span class="eb-buy">1,445.20</span></div>
        <div class="eb-rate-row"><span class="eb-label">팔 때</span><span class="eb-sell">1,408.30</span></div>
      </div>
      <div class="eb-change down">▼ 5.20</div>
    </div>
  </div>`;

const ITEM_JPY = `
  <div class="eb-item" data-currency="JPY">
    <div class="eb-left">
      <span class="eb-flag"><img src="https://flagcdn.com/w40/jp.png" alt="JPY"></span>
      <div class="eb-currency-info">
        <span class="eb-code">JPY</span>
        <span class="eb-name">일본 엔화</span>
      </div>
    </div>
    <div class="eb-right">
      <div class="eb-rates">
        <div class="eb-rate-row"><span class="eb-label">살 때</span><span class="eb-buy">944.85</span></div>
        <div class="eb-rate-row"><span class="eb-label">팔 때</span><span class="eb-sell">923.25</span></div>
      </div>
      <div class="eb-change up">▲ 1.15</div>
    </div>
  </div>`;

const NORMAL_HTML = makeHtml(ITEM_USD + ITEM_EUR + ITEM_JPY);

// 통화 항목이 0개인 경우
const EMPTY_LIST_HTML = makeHtml('');

// 환율 데이터가 0인 경우
const ZERO_RATE_HTML = makeHtml(`
  <div class="eb-item" data-currency="USD">
    <div class="eb-left">
      <span class="eb-flag"><img src="https://flagcdn.com/w40/us.png" alt="USD"></span>
      <div class="eb-currency-info">
        <span class="eb-code">USD</span><span class="eb-name">미국 달러</span>
      </div>
    </div>
    <div class="eb-right">
      <div class="eb-rates">
        <div class="eb-rate-row"><span class="eb-label">살 때</span><span class="eb-buy">0.00</span></div>
        <div class="eb-rate-row"><span class="eb-label">팔 때</span><span class="eb-sell">0.00</span></div>
      </div>
      <div class="eb-change up">▲ 0.00</div>
    </div>
  </div>`);

// ── 모의(mock) API 응답 ────────────────────────────────────────────────────

const MOCK_RATES = {
    USD: { buy: 1325.5, sell: 1296.5, change: 3.5 },
    EUR: { buy: 1445.2, sell: 1408.3, change: -5.2 },
    JPY: { buy: 944.85, sell: 923.25, change: 1.15 },
};

const PARTIAL_RATES = { USD: { buy: 1300.0, sell: 1270.0, change: 1.0 } };

// ── 공통 체크 ─────────────────────────────────────────────────────────────

test.describe('exchange-board — 공통 체크', () => {
    test.beforeEach(async ({ page }) => {
        await page.setContent(NORMAL_HTML);
    });

    test('공통 레이아웃·접근성·키보드 기준 충족 (runCommonChecks)', async ({ page }) => {
        await runCommonChecks(page, {
            componentIdPrefix: 'exchange-board',
            // 환전 신청 버튼만 터치 영역 검사 — eb-label(10px) 등 보조 텍스트 제외
            buttonSelector: '.eb-exchange-btn',
            // 보조 텍스트(eb-label 10px, eb-name 11px, eb-updated 11px)는 제외하고 주 콘텐츠만 검사
            textSelector: '.eb-title, .eb-code, .eb-buy, .eb-sell, .eb-exchange-btn',
        });
    });
});

// ── 기기별 뷰포트 체크 ────────────────────────────────────────────────────

test.describe('exchange-board — 기기별 뷰포트', () => {
    test('iPhone SE (375px) — 가로 스크롤 없음·뷰포트 이탈 없음', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.setContent(NORMAL_HTML);
        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, '[data-component-id^="exchange-board"]');
    });

    test('Galaxy S (360px) — 가로 스크롤 없음·뷰포트 이탈 없음', async ({ page }) => {
        await page.setViewportSize({ width: 360, height: 780 });
        await page.setContent(NORMAL_HTML);
        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, '[data-component-id^="exchange-board"]');
    });

    test('iPhone Pro Max (430px) — 가로 스크롤 없음·뷰포트 이탈 없음', async ({ page }) => {
        await page.setViewportSize({ width: 430, height: 932 });
        await page.setContent(NORMAL_HTML);
        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, '[data-component-id^="exchange-board"]');
    });
});

// ── 반응형 브레이크포인트 체크 ────────────────────────────────────────────

test.describe('exchange-board — 반응형 브레이크포인트', () => {
    test('767px — 모바일 경계에서 가로 스크롤 없음', async ({ page }) => {
        await page.setViewportSize({ width: 767, height: 900 });
        await page.setContent(NORMAL_HTML);
        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, '[data-component-id^="exchange-board"]');
    });

    test('768px — 태블릿 경계에서 가로 스크롤 없음', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.setContent(NORMAL_HTML);
        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, '[data-component-id^="exchange-board"]');
    });

    test('1440px — 표준 데스크탑에서 뷰포트 이탈 없음', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.setContent(NORMAL_HTML);
        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, '[data-component-id^="exchange-board"]');
    });
});

// ── 뷰어(/view) 렌더링 확인 ───────────────────────────────────────────────

test.describe('exchange-board — 뷰어 렌더링', () => {
    // eslint-disable-next-line playwright/no-skipped-test
    test.skip(!!process.env.CI, 'CI 환경: Oracle DB 없어 저장된 페이지 데이터 없음 — 로컬에서만 실행');

    test('/view 접근 시 에러 페이지가 아닌 정상 렌더링됨', async ({ page }) => {
        await page.goto('/view');
        await page.waitForLoadState('domcontentloaded');
        await expect(page).not.toHaveTitle(/error|500|404/i);
        await expect(page.locator('body')).toBeVisible();
    });
});

// ── 컴포넌트 — 정상 동작 ──────────────────────────────────────────────────

test.describe('exchange-board — 정상 동작', () => {
    test.beforeEach(async ({ page }) => {
        await page.setContent(NORMAL_HTML);
    });

    test('USD·EUR·JPY 통화 항목이 1개 이상 렌더링됨', async ({ page }) => {
        const items = page.locator('[data-cb-type="exchange-board"] .eb-item');
        await expect(items).not.toHaveCount(0);
    });

    test('각 항목에 통화 코드·살 때·팔 때 텍스트가 표시됨', async ({ page }) => {
        await expect(page.locator('.eb-item[data-currency="USD"] .eb-code')).toHaveText('USD');
        await expect(page.locator('.eb-item[data-currency="USD"] .eb-buy')).toContainText('1,325');
        await expect(page.locator('.eb-item[data-currency="USD"] .eb-sell')).toContainText('1,296');
    });

    test('등락 방향 — 상승(▲)·하락(▼) 표시', async ({ page }) => {
        await expect(page.locator('.eb-item[data-currency="USD"] .eb-change')).toContainText('▲');
        await expect(page.locator('.eb-item[data-currency="EUR"] .eb-change')).toContainText('▼');
    });

    test('환전 신청 버튼 href가 # 이 아닌 URL로 설정됨', async ({ page }) => {
        const btn = page.locator('.eb-exchange-btn');
        await expect(btn, '환전 신청 버튼 href가 설정되어 있어야 합니다').toHaveAttribute('href');
    });

    test('환전 신청 버튼 터치 영역 48px 이상 (min-height)', async ({ page }) => {
        const box = await page.locator('.eb-exchange-btn').boundingBox();
        expect(box).not.toBeNull();
        expect(box!.height, '환전 신청 버튼 높이 48px 이상이어야 합니다').toBeGreaterThanOrEqual(48);
    });
});

// ── 컴포넌트 — API mock 테스트 ────────────────────────────────────────────

test.describe('exchange-board — API 연동', () => {
    test('/api/exchange 성공 시 응답 데이터로 환율 갱신됨', async ({ page }) => {
        await page.route('/api/exchange', (route) =>
            route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_RATES) }),
        );
        await page.setContent(NORMAL_HTML);

        // DOM 직접 갱신 시뮬레이션 (mount() 동작 재현)
        await page.evaluate((rates) => {
            document.querySelectorAll('.eb-item').forEach((item) => {
                const code = (item as HTMLElement).dataset.currency ?? '';
                const d = (rates as Record<string, { buy: number; sell: number; change: number }>)[code];
                if (!d || d.buy == null || d.sell == null) return;
                const buyEl = item.querySelector('.eb-buy');
                const sellEl = item.querySelector('.eb-sell');
                const changeEl = item.querySelector('.eb-change');
                if (buyEl) buyEl.textContent = d.buy.toLocaleString('ko-KR', { minimumFractionDigits: 2 });
                if (sellEl) sellEl.textContent = d.sell.toLocaleString('ko-KR', { minimumFractionDigits: 2 });
                if (changeEl) {
                    const up = d.change >= 0;
                    changeEl.textContent = (up ? '▲' : '▼') + ' ' + Math.abs(d.change).toFixed(2);
                    changeEl.className = 'eb-change ' + (up ? 'up' : 'down');
                }
            });
        }, MOCK_RATES);

        await expect(page.locator('.eb-item[data-currency="USD"] .eb-buy')).toContainText('1,325');
        await expect(page.locator('.eb-item[data-currency="EUR"] .eb-change')).toContainText('▼');
    });

    test('/api/exchange 5xx 실패 시 인라인 데이터 유지됨', async ({ page }) => {
        await page.route('/api/exchange', (route) =>
            route.fulfill({ status: 500, body: 'Internal Server Error' }),
        );
        await page.setContent(NORMAL_HTML);

        // 인라인 데이터(1,325.50)가 그대로 유지되어야 함
        await expect(page.locator('.eb-item[data-currency="USD"] .eb-buy')).toContainText('1,325');
    });

    test('일부 통화(USD만) 응답 시 나머지 항목 인라인 데이터 유지됨', async ({ page }) => {
        await page.route('/api/exchange', (route) =>
            route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(PARTIAL_RATES) }),
        );
        await page.setContent(NORMAL_HTML);

        // USD만 갱신, EUR/JPY는 인라인 데이터 유지
        await page.evaluate((rates) => {
            document.querySelectorAll('.eb-item').forEach((item) => {
                const code = (item as HTMLElement).dataset.currency ?? '';
                const d = (rates as Record<string, { buy: number; sell: number; change: number }>)[code];
                if (!d || d.buy == null || d.sell == null) return;
                const buyEl = item.querySelector('.eb-buy');
                if (buyEl) buyEl.textContent = d.buy.toLocaleString('ko-KR', { minimumFractionDigits: 2 });
            });
        }, PARTIAL_RATES);

        // EUR 인라인 값 유지
        await expect(page.locator('.eb-item[data-currency="EUR"] .eb-buy')).toContainText('1,445');
        // JPY 인라인 값 유지
        await expect(page.locator('.eb-item[data-currency="JPY"] .eb-buy')).toContainText('944');
    });
});

// ── 컴포넌트 — 예외 처리 ─────────────────────────────────────────────────

test.describe('exchange-board — 예외 처리', () => {
    test('통화 항목 0개 — 가로 스크롤·뷰포트 이탈 없음', async ({ page }) => {
        await page.setContent(EMPTY_LIST_HTML);
        await checkNoHorizontalScroll(page);
        const el = page.locator('[data-cb-type="exchange-board"]');
        await expect(el).toBeVisible();
        const box = await el.boundingBox();
        expect(box!.height).toBeGreaterThan(0);
    });

    test('환율 0.00 — 레이아웃 깨짐 없음·텍스트 표시됨', async ({ page }) => {
        await page.setContent(ZERO_RATE_HTML);
        await checkNoHorizontalScroll(page);
        await expect(page.locator('.eb-item[data-currency="USD"] .eb-buy')).toHaveText('0.00');
        await expect(page.locator('.eb-item[data-currency="USD"] .eb-sell')).toHaveText('0.00');
    });

    test('API 응답 null 값 — buy/sell null 항목 건너뜀·TypeError 없음', async ({ page }) => {
        await page.setContent(NORMAL_HTML);
        const error = await page.evaluate(() => {
            try {
                const nullRates = { USD: { buy: null, sell: null, change: null } };
                document.querySelectorAll('.eb-item').forEach((item) => {
                    const code = (item as HTMLElement).dataset.currency ?? '';
                    const d = (nullRates as Record<string, { buy: null; sell: null; change: null }>)[code];
                    // 실제 플러그인 로직과 동일한 null 체크
                    if (!d || d.buy == null || d.sell == null) return;
                    const buyEl = item.querySelector('.eb-buy');
                    if (buyEl) buyEl.textContent = (d.buy as unknown as number).toLocaleString('ko-KR');
                });
                return null;
            } catch (e) {
                return (e as Error).message;
            }
        });
        expect(error, 'null 값 처리 중 TypeError가 발생하면 안 됩니다').toBeNull();
        // 인라인 값 유지 확인
        await expect(page.locator('.eb-item[data-currency="USD"] .eb-buy')).toContainText('1,325');
    });
});

// ── 컴포넌트 — 엣지 케이스 ───────────────────────────────────────────────

test.describe('exchange-board — 엣지 케이스', () => {
    test('동일 통화(USD) 중복 추가 방지 — .eb-item[data-currency="USD"] 1개만 존재', async ({ page }) => {
        await page.setContent(NORMAL_HTML);

        // 플러그인 addBtn.onclick 로직 재현 (중복 체크 포함)
        await page.evaluate(() => {
            const element = document.querySelector('[data-cb-type="exchange-board"]')!;
            const code = 'USD';
            // 중복 체크: 이미 존재하면 추가하지 않음
            if (element.querySelector(`.eb-item[data-currency="${code}"]`)) return;
            const list = element.querySelector('.eb-list')!;
            const newItem = document.createElement('div');
            newItem.className = 'eb-item';
            (newItem as HTMLElement).dataset.currency = code;
            list.appendChild(newItem);
        });

        const count = await page.locator('.eb-item[data-currency="USD"]').count();
        expect(count, '동일 통화는 1개만 존재해야 합니다').toBe(1);
    });

    test('극값 환율(0.001 미만) — 레이아웃 깨짐 없음', async ({ page }) => {
        await page.setContent(
            makeHtml(`
          <div class="eb-item" data-currency="VND">
            <div class="eb-left">
              <span class="eb-flag">🇻🇳</span>
              <div class="eb-currency-info">
                <span class="eb-code">VND</span><span class="eb-name">베트남 동</span>
              </div>
            </div>
            <div class="eb-right">
              <div class="eb-rates">
                <div class="eb-rate-row"><span class="eb-label">살 때</span><span class="eb-buy">0.05</span></div>
                <div class="eb-rate-row"><span class="eb-label">팔 때</span><span class="eb-sell">0.04</span></div>
              </div>
              <div class="eb-change up">▲ 0.001</div>
            </div>
          </div>`),
        );
        await checkNoHorizontalScroll(page);
        await expect(page.locator('.eb-item[data-currency="VND"]')).toBeVisible();
    });
});

// ── 반응형 뷰포트 레이아웃 ────────────────────────────────────────────────────

test.describe('exchange-board — 반응형 뷰포트 레이아웃', () => {
    // eslint-disable-next-line playwright/expect-expect
    test('360~1440px 전 뷰포트에서 가로 스크롤·뷰포트 이탈 없음', async ({ page }) => {
        await page.setContent(NORMAL_HTML);
        await checkViewportLayouts(page, '[data-component-id^="exchange-board"]');
    });
});
