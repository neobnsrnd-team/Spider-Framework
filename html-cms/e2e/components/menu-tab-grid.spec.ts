// e2e/components/menu-tab-grid.spec.ts
// menu-tab-grid(메뉴 탭 그리드) 컴포넌트 자동화 QA (Issue #320)

import { test, expect } from '@playwright/test';
import {
    runCommonChecks,
    checkNoHorizontalScroll,
    checkNotOutsideViewport,
} from '../helpers/component-checks';

// ── 헬퍼 ──────────────────────────────────────────────────────────────────

function escapeHtml(str: string): string {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// ── 테스트용 HTML 빌더 ───────────────────────────────────────────────────
// scripts/migrate-menu-tab-grid-to-html.ts 의 DOM 구조와 동일

const FONT_FAMILY = "-apple-system,BlinkMacSystemFont,'Malgun Gothic','Apple SD Gothic Neo',sans-serif";

const CHEVRON_DOWN_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="16" height="16" style="flex-shrink:0;transition:transform 0.25s ease;"><path d="m6 9 6 6 6-6"/></svg>`;

interface TabItem {
    label: string;
    target?: number;
}

interface MakeHtmlOptions {
    design?: 'tab' | 'chip';
    chipColor?: string;
    sticky?: boolean;
    componentId?: string;
}

function buildTabBarItem(tab: TabItem, idx: number, design: 'tab' | 'chip', chipColor: string): string {
    const isActive = idx === 0;

    if (design === 'chip') {
        const activeStyle = isActive
            ? `background:${chipColor};color:#fff;border:none;`
            : 'background:#fff;color:#666;border:1px solid #ddd;';
        return (
            `<span data-menu-tab data-tab-idx="${idx}"` +
            ` ${isActive ? 'data-tab-active="true"' : ''}` +
            ` style="display:inline-block;border-radius:20px;padding:8px 16px;font-size:14px;white-space:nowrap;cursor:pointer;${activeStyle}"` +
            `>${escapeHtml(tab.label)}</span>`
        );
    }

    const activeStyle = isActive
        ? 'border-bottom:2px solid #1A1A2E;color:#1A1A2E;font-weight:700;'
        : 'border-bottom:2px solid transparent;color:#9CA3AF;font-weight:400;';
    return (
        `<span data-menu-tab data-tab-idx="${idx}"` +
        ` ${isActive ? 'data-tab-active="true"' : ''}` +
        ` style="display:inline-block;padding:12px 0;font-size:14px;white-space:nowrap;cursor:pointer;${activeStyle}"` +
        `>${escapeHtml(tab.label)}</span>`
    );
}

function buildGridItem(tab: TabItem, idx: number, design: 'tab' | 'chip', chipColor: string): string {
    const isActive = idx === 0;

    if (design === 'chip') {
        const activeStyle = isActive
            ? `background:${chipColor};color:#fff;border:none;`
            : 'background:#fff;color:#666;border:1px solid #ddd;';
        return (
            `<span data-menu-grid-item data-grid-idx="${idx}"` +
            ` style="display:inline-block;border-radius:20px;padding:8px 14px;font-size:13px;white-space:nowrap;cursor:pointer;${activeStyle}"` +
            `>${escapeHtml(tab.label)}</span>`
        );
    }

    return (
        `<span data-menu-grid-item data-grid-idx="${idx}"` +
        ` style="display:block;padding:14px 4px;font-size:14px;color:${isActive ? '#1A1A2E' : '#4B5563'};` +
        `font-weight:${isActive ? '700' : '400'};cursor:pointer;text-align:center;white-space:nowrap;` +
        `text-overflow:ellipsis;overflow:hidden;"` +
        `>${escapeHtml(tab.label)}</span>`
    );
}

// 인라인 토글 스크립트 — 마이그레이션 스크립트의 TOGGLE_SCRIPT와 동일
const TOGGLE_SCRIPT =
    `<script>` +
    `(function(){` +
        `var root=document.currentScript&&document.currentScript.closest('[data-spw-block]');` +
        `if(!root||root.getAttribute('data-menu-tab-inited')==='1')return;` +
        `if(root.closest('.is-builder'))return;` +
        `root.setAttribute('data-menu-tab-inited','1');` +
        `var scrollWrap=root.querySelector('[data-menu-tab-scroll]');` +
        `var gridWrap=root.querySelector('[data-menu-tab-grid]');` +
        `var toggleBtn=root.querySelector('[data-menu-tab-toggle]');` +
        `var chevron=toggleBtn&&toggleBtn.querySelector('svg');` +
        `var tabBar=root.querySelector('[data-menu-tab-bar]');` +
        `var expanded=false;` +
        `var tabsData=[];` +
        `try{tabsData=JSON.parse(root.getAttribute('data-menu-tabs')||'[]');}catch(e){}` +
        `var design=root.getAttribute('data-menu-design')||'tab';` +
        `var chipColor=root.getAttribute('data-chip-active-color')||'#7C5CFC';` +
        `var stickyRow=root.closest('.row');` +
        `var isSticky=root.getAttribute('data-menu-sticky')==='true';` +
        `if(isSticky&&stickyRow){` +
            `stickyRow.style.position='sticky';stickyRow.style.top='0';stickyRow.style.zIndex='100';stickyRow.style.background='#ffffff';` +
        `}` +
        `var styleId='mtg-scroll-hide-'+Math.random().toString(36).slice(2,8);` +
        `scrollWrap.setAttribute('data-mtg-id',styleId);` +
        `var styleEl=document.createElement('style');` +
        `styleEl.textContent='[data-mtg-id=\"'+styleId+'\"]::-webkit-scrollbar{display:none}';` +
        `root.appendChild(styleEl);` +
        `if(design==='chip'){scrollWrap.style.padding='8px 48px 8px 16px';tabBar.style.borderBottom='none';}` +
        `function toggle(){` +
            `expanded=!expanded;` +
            `if(design==='chip'){` +
                `if(expanded){scrollWrap.style.overflowX='visible';scrollWrap.style.whiteSpace='normal';scrollWrap.style.flexWrap='wrap';tabBar.style.overflow='visible';chevron.style.transform='rotate(180deg)';` +
                `}else{scrollWrap.style.overflowX='auto';scrollWrap.style.whiteSpace='nowrap';scrollWrap.style.flexWrap='nowrap';tabBar.style.overflow='hidden';chevron.style.transform='rotate(0deg)';}` +
            `}else{` +
                `if(expanded){gridWrap.style.display='grid';requestAnimationFrame(function(){gridWrap.style.maxHeight=gridWrap.scrollHeight+'px';});chevron.style.transform='rotate(180deg)';` +
                `}else{gridWrap.style.maxHeight='0';setTimeout(function(){if(!expanded)gridWrap.style.display='none';},300);chevron.style.transform='rotate(0deg)';}` +
            `}` +
        `}` +
        `if(toggleBtn)toggleBtn.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();toggle();});` +
        `var allTabs=root.querySelectorAll('[data-menu-tab]');` +
        `var allGridItems=root.querySelectorAll('[data-menu-grid-item]');` +
        `function selectTab(idx){` +
            `allTabs.forEach(function(t){` +
                `var isActive=t.getAttribute('data-tab-idx')===String(idx);` +
                `if(design==='chip'){t.style.background=isActive?chipColor:'#fff';t.style.color=isActive?'#fff':'#666';t.style.border=isActive?'none':'1px solid #ddd';` +
                `}else{t.style.borderBottomColor=isActive?'#1A1A2E':'transparent';t.style.color=isActive?'#1A1A2E':'#9CA3AF';t.style.fontWeight=isActive?'700':'400';}` +
                `if(isActive){t.setAttribute('data-tab-active','true');}else{t.removeAttribute('data-tab-active');}` +
            `});` +
            `allGridItems.forEach(function(g){` +
                `var isActive=g.getAttribute('data-grid-idx')===String(idx);` +
                `if(design==='chip'){g.style.background=isActive?chipColor:'#fff';g.style.color=isActive?'#fff':'#666';g.style.border=isActive?'none':'1px solid #ddd';` +
                `}else{g.style.color=isActive?'#1A1A2E':'#4B5563';g.style.fontWeight=isActive?'700':'400';}` +
            `});` +
            `if(expanded){toggle();}` +
        `}` +
        `allTabs.forEach(function(t){t.addEventListener('click',function(e){e.preventDefault();selectTab(t.getAttribute('data-tab-idx'));});});` +
        `allGridItems.forEach(function(g){g.addEventListener('click',function(e){e.preventDefault();selectTab(g.getAttribute('data-grid-idx'));});});` +
    `})();` +
    `</script>`;

function makeHtml(tabs: TabItem[], opts: MakeHtmlOptions = {}): string {
    const {
        design = 'tab',
        chipColor = '#7C5CFC',
        sticky = false,
        componentId = 'menu-tab-grid-mobile',
    } = opts;

    const tabsJson = JSON.stringify(tabs).replace(/&/g, '&amp;').replace(/"/g, '&quot;');

    const tabBarItems = tabs.map((tab, i) => buildTabBarItem(tab, i, design, chipColor)).join('');
    const gridItems = tabs.map((tab, i) => buildGridItem(tab, i, design, chipColor)).join('');

    return `
<!DOCTYPE html><html><head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>* { box-sizing: border-box; } body { margin: 0; }</style>
</head><body>
  <div data-component-id="${componentId}" data-spw-block
       data-menu-tabs="${tabsJson}"
       data-menu-sticky="${sticky}"
       data-menu-design="${design}"
       data-chip-active-color="${chipColor}"
       style="font-family:${FONT_FAMILY};background:#ffffff;">

    <div data-menu-tab-bar style="position:relative;overflow:hidden;border-bottom:1px solid #E5E7EB;">
      <div data-menu-tab-scroll style="display:flex;align-items:center;gap:16px;padding:0 48px 0 16px;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch;">
        ${tabBarItems}
      </div>
      <span data-menu-tab-toggle style="position:absolute;right:0;top:0;bottom:0;z-index:2;padding:0 10px 0 20px;display:flex;align-items:center;cursor:pointer;background:linear-gradient(to right,rgba(255,255,255,0) 0%,rgba(255,255,255,0.85) 35%,#ffffff 60%);border-bottom:1px solid #E5E7EB;">
        ${CHEVRON_DOWN_SVG}
      </span>
    </div>

    <div data-menu-tab-grid style="display:none;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:0;padding:8px 12px;max-height:0;overflow:hidden;transition:max-height 0.3s ease;border-bottom:1px solid #E5E7EB;">
      ${gridItems}
    </div>

    ${TOGGLE_SCRIPT}
  </div>
</body></html>
`;
}

// ── 테스트 데이터 상수 ────────────────────────────────────────────────────

const DEFAULT_TABS: TabItem[] = [
    { label: '전체' },
    { label: '이용내역' },
    { label: '결제' },
    { label: '내카드' },
    { label: '카드신청' },
];

const NORMAL_HTML = makeHtml(DEFAULT_TABS);

const CHIP_HTML = makeHtml(DEFAULT_TABS, { design: 'chip' });

const SINGLE_TAB: TabItem[] = [{ label: '전체' }];
const SINGLE_TAB_HTML = makeHtml(SINGLE_TAB);

const MANY_TABS: TabItem[] = [
    { label: '전체' }, { label: '새로 나왔어요!' }, { label: '이용내역' },
    { label: '이용금액결제' }, { label: '내카드' }, { label: '카드신청' },
    { label: '금융' }, { label: '해외하면 하나카드' }, { label: '혜택' },
    { label: '증명/납부' }, { label: '내 자산' }, { label: '내 계좌' },
    { label: '라이프 UP' }, { label: '고객지원' }, { label: '기업카드' },
    { label: '가맹점' }, { label: '나라사랑카드' }, { label: '별별뉴스' },
    { label: '하나서비스' },
];
const MANY_TABS_HTML = makeHtml(MANY_TABS);

const LONG_LABEL_TABS: TabItem[] = [
    { label: '매우긴탭이름입니다확인하세요' },
    { label: '두번째탭도역시길어요' },
    { label: '세번째' },
];
const LONG_LABEL_HTML = makeHtml(LONG_LABEL_TABS);

const XSS_TABS: TabItem[] = [
    { label: '<script>window.__xss=1</script>XSS탭' },
    { label: '<img onerror="window.__alert=1" src=x>이미지탭' },
    { label: '정상탭' },
];
const XSS_HTML = makeHtml(XSS_TABS);

// ── 공통 체크 ─────────────────────────────────────────────────────────────

test.describe('menu-tab-grid — 공통 체크', () => {
    test.beforeEach(async ({ page }) => {
        await page.setContent(NORMAL_HTML);
    });

    test('공통 레이아웃·접근성 기준 충족', async ({ page }) => {
        await runCommonChecks(page, {
            componentIdPrefix: 'menu-tab-grid',
            minFontSize: 13,
            // 토글 버튼은 그라데이션 오버레이 내 SVG — 별도 확인
            buttonSelector: '[data-menu-tab-toggle]',
        });
    });
});

// ── 기기별 뷰포트 ─────────────────────────────────────────────────────────

test.describe('menu-tab-grid — 기기별 뷰포트', () => {
    const ROOT = '[data-component-id^="menu-tab-grid"]';

    test('iPhone SE (375px)', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.setContent(NORMAL_HTML);
        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, ROOT);
    });

    test('Galaxy S (360px)', async ({ page }) => {
        await page.setViewportSize({ width: 360, height: 780 });
        await page.setContent(NORMAL_HTML);
        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, ROOT);
    });

    test('iPhone Pro Max (430px)', async ({ page }) => {
        await page.setViewportSize({ width: 430, height: 932 });
        await page.setContent(NORMAL_HTML);
        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, ROOT);
    });
});

// ── 반응형 브레이크포인트 ─────────────────────────────────────────────────

test.describe('menu-tab-grid — 반응형 브레이크포인트', () => {
    const ROOT = '[data-component-id^="menu-tab-grid"]';

    test('767px — 모바일 경계', async ({ page }) => {
        await page.setViewportSize({ width: 767, height: 900 });
        await page.setContent(NORMAL_HTML);
        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, ROOT);
    });

    test('768px — 태블릿 경계', async ({ page }) => {
        await page.setViewportSize({ width: 768, height: 1024 });
        await page.setContent(NORMAL_HTML);
        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, ROOT);
    });

    test('1440px — 데스크탑', async ({ page }) => {
        await page.setViewportSize({ width: 1440, height: 900 });
        await page.setContent(NORMAL_HTML);
        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, ROOT);
    });
});

// ── 뷰어(/view) 렌더링 ───────────────────────────────────────────────────

test.describe('menu-tab-grid — 뷰어 렌더링', () => {
    // eslint-disable-next-line playwright/no-skipped-test
    test.skip(!!process.env.CI, 'CI 환경: Oracle DB 없어 저장된 페이지 데이터 없음 — 로컬에서만 실행');

    test('/view 접근 시 정상 렌더링됨', async ({ page }) => {
        await page.goto('/view');
        await page.waitForLoadState('domcontentloaded');
        await expect(page).not.toHaveTitle(/error|500|404/i);
        await expect(page.locator('body')).toBeVisible();
    });
});

// ── 정상 동작 ─────────────────────────────────────────────────────────────

test.describe('menu-tab-grid — 정상 동작', () => {
    test.beforeEach(async ({ page }) => {
        await page.setContent(NORMAL_HTML);
    });

    test('탭바에 탭 항목이 렌더링됨', async ({ page }) => {
        const tabs = page.locator('[data-menu-tab]');
        expect(await tabs.count()).toBe(DEFAULT_TABS.length);
        await expect(tabs.first()).toContainText('전체');
    });

    test('첫 번째 탭이 활성 상태', async ({ page }) => {
        const firstTab = page.locator('[data-menu-tab][data-tab-idx="0"]');
        await expect(firstTab).toHaveAttribute('data-tab-active', 'true');
    });

    test('토글 버튼 존재', async ({ page }) => {
        const toggleBtn = page.locator('[data-menu-tab-toggle]');
        await expect(toggleBtn).toBeAttached();
        // SVG chevron 포함
        await expect(toggleBtn.locator('svg')).toBeAttached();
    });

    test('토글 클릭 시 그리드가 펼쳐짐', async ({ page }) => {
        const grid = page.locator('[data-menu-tab-grid]');
        // 초기: 숨김
        await expect(grid).toBeHidden();

        // 토글 클릭
        await page.locator('[data-menu-tab-toggle]').click();

        // 펼침: Web-first assertion — 조건 충족까지 자동 대기
        await expect(grid).toBeVisible();
    });

    test('그리드 내 항목이 탭 수만큼 존재', async ({ page }) => {
        const gridItems = page.locator('[data-menu-grid-item]');
        expect(await gridItems.count()).toBe(DEFAULT_TABS.length);
    });

    test('다시 토글 클릭 시 그리드가 접힘', async ({ page }) => {
        const toggle = page.locator('[data-menu-tab-toggle]');
        const grid = page.locator('[data-menu-tab-grid]');

        // 펼치기
        await toggle.click();
        await expect(grid).toBeVisible();

        // 접기
        await toggle.click();
        await expect(grid).toBeHidden();
    });
});

// ── 탭 선택 ───────────────────────────────────────────────────────────────

test.describe('menu-tab-grid — 탭 선택', () => {
    test('두 번째 탭 클릭 시 활성 탭 전환', async ({ page }) => {
        await page.setContent(NORMAL_HTML);

        const tab0 = page.locator('[data-menu-tab][data-tab-idx="0"]');
        const tab1 = page.locator('[data-menu-tab][data-tab-idx="1"]');

        // 초기: 0번 활성
        await expect(tab0).toHaveAttribute('data-tab-active', 'true');

        // 1번 클릭
        await tab1.click();

        // 1번 활성, 0번 비활성 — Web-first assertion 자동 대기
        await expect(tab1).toHaveAttribute('data-tab-active', 'true');
        expect(await tab0.getAttribute('data-tab-active')).toBeNull();
    });

    test('그리드 항목 클릭 시 해당 탭 활성화', async ({ page }) => {
        await page.setContent(NORMAL_HTML);

        // 그리드 펼치기
        const grid = page.locator('[data-menu-tab-grid]');
        await page.locator('[data-menu-tab-toggle]').click();
        await expect(grid).toBeVisible();

        // 그리드 항목 2번 클릭
        const gridItem2 = page.locator('[data-menu-grid-item][data-grid-idx="2"]');
        await gridItem2.click();

        // 탭바에서 2번 탭이 활성
        const tab2 = page.locator('[data-menu-tab][data-tab-idx="2"]');
        await expect(tab2).toHaveAttribute('data-tab-active', 'true');

        // 그리드가 접힘
        await expect(grid).toBeHidden();
    });
});

// ── 디자인 모드 ───────────────────────────────────────────────────────────

test.describe('menu-tab-grid — 디자인 모드', () => {
    test('tab 모드 — 밑줄 활성 표시', async ({ page }) => {
        await page.setContent(NORMAL_HTML);

        const activeTab = page.locator('[data-menu-tab][data-tab-active="true"]');
        const borderColor = await activeTab.evaluate(
            (el) => getComputedStyle(el).borderBottomColor,
        );
        // #1A1A2E → rgb(26, 26, 46)
        expect(borderColor).toBe('rgb(26, 26, 46)');
    });

    test('chip 모드 — 배경색 활성 표시', async ({ page }) => {
        await page.setContent(CHIP_HTML);

        const activeTab = page.locator('[data-menu-tab][data-tab-active="true"]');
        const bgColor = await activeTab.evaluate(
            (el) => getComputedStyle(el).backgroundColor,
        );
        // #7C5CFC → rgb(124, 92, 252)
        expect(bgColor).toBe('rgb(124, 92, 252)');
    });
});

// ── 예외 처리 ─────────────────────────────────────────────────────────────

test.describe('menu-tab-grid — 예외 처리', () => {
    test('탭 1개 → 탭바 정상 렌더링', async ({ page }) => {
        await page.setContent(SINGLE_TAB_HTML);

        const tabs = page.locator('[data-menu-tab]');
        expect(await tabs.count()).toBe(1);
        await expect(tabs.first()).toContainText('전체');

        // 컴포넌트 렌더링 정상
        await expect(page.locator('[data-component-id^="menu-tab-grid"]')).toBeAttached();
    });

    test('탭 1개에서도 가로 스크롤 없음', async ({ page }) => {
        await page.setContent(SINGLE_TAB_HTML);
        await checkNoHorizontalScroll(page);
    });
});

// ── 엣지 케이스 ───────────────────────────────────────────────────────────

test.describe('menu-tab-grid — 엣지 케이스', () => {
    test('탭 이름 8자+ → 레이아웃 유지 (가로 스크롤 없음)', async ({ page }) => {
        await page.setContent(LONG_LABEL_HTML);
        await checkNoHorizontalScroll(page);
        await checkNotOutsideViewport(page, '[data-component-id^="menu-tab-grid"]');
    });

    test('탭 19개 → 탭바에 모두 렌더링됨', async ({ page }) => {
        await page.setContent(MANY_TABS_HTML);

        const tabs = page.locator('[data-menu-tab]');
        expect(await tabs.count()).toBe(19);

        // 가로 스크롤 없음 (탭바 내부 스크롤은 overflow-x:auto로 처리)
        await checkNoHorizontalScroll(page);
    });

    test('XSS — 탭 이름에 script 삽입 시 실행되지 않음', async ({ page }) => {
        await page.setContent(XSS_HTML);

        // script 태그가 DOM에 실제 엘리먼트로 삽입되지 않음 (escapeHtml 처리)
        const scriptInTab = await page.evaluate(
            () => document.querySelectorAll('[data-menu-tab] script').length,
        );
        expect(scriptInTab).toBe(0);

        // window.__xss 설정되지 않음
        const xssFired = await page.evaluate(() => (window as Record<string, unknown>).__xss);
        expect(xssFired).toBeUndefined();
    });

    test('XSS — img onerror 삽입 시 실행되지 않음', async ({ page }) => {
        await page.setContent(XSS_HTML);

        const alertFired = await page.evaluate(() => (window as Record<string, unknown>).__alert);
        expect(alertFired).toBeUndefined();

        // img 태그가 탭 내부에 삽입되지 않음
        const imgInTab = await page.evaluate(
            () => document.querySelectorAll('[data-menu-tab] img').length,
        );
        expect(imgInTab).toBe(0);
    });
});
