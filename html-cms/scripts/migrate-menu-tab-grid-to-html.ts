// scripts/migrate-menu-tab-grid-to-html.ts
// menu-tab-grid 컴포넌트 등록/업데이트 (Issue #226, #232, #227 칩 버튼 디자인)
// 금융 앱 전체 메뉴 탭 그리드 (접기/펼치기) 컴포넌트
// 실행: npx tsx scripts/migrate-menu-tab-grid-to-html.ts

import 'dotenv/config';
import { getComponentById, updateComponent, createComponent } from '../src/db/repository/component.repository';
import { closePool } from '../src/db/connection';

const FONT_FAMILY = "-apple-system,BlinkMacSystemFont,'Malgun Gothic','Apple SD Gothic Neo',sans-serif";

// ── 탭 항목 타입 ─────────────────────────────────────────────────────────

interface TabItem {
    label: string;
    target?: number; // 연결할 블록 인덱스 (순서 패널 기준, 없으면 스크롤 미동작)
}

// ── 기본 예시 탭 데이터 (하나카드 메뉴) ───────────────────────────────────

const DEFAULT_TABS: TabItem[] = [
    { label: '전체' },
    { label: '새로 나왔어요!' },
    { label: '이용내역' },
    { label: '이용금액결제' },
    { label: '내카드' },
    { label: '카드신청' },
    { label: '금융' },
    { label: '해외하면 하나카드' },
    { label: '혜택' },
    { label: '증명/납부' },
    { label: '내 자산' },
    { label: '내 계좌' },
    { label: '라이프 UP' },
    { label: '고객지원' },
    { label: '기업카드' },
    { label: '가맹점' },
    { label: '나라사랑카드' },
    { label: '별별뉴스' },
    { label: '하나서비스' },
];

// ── chevron SVG ──────────────────────────────────────────────────────────

const CHEVRON_DOWN_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="16" height="16" style="flex-shrink:0;transition:transform 0.25s ease;"><path d="m6 9 6 6 6-6"/></svg>`;

// ── 탭바 항목 HTML ───────────────────────────────────────────────────────

function buildTabBarItem(tab: TabItem, idx: number, design: 'tab' | 'chip' = 'tab', chipColor = '#7C5CFC'): string {
    const isActive = idx === 0;

    if (design === 'chip') {
        const activeStyle = isActive
            ? `background:${chipColor};color:#fff;border:none;`
            : 'background:#fff;color:#666;border:1px solid #ddd;';
        return (
            `<span data-menu-tab data-tab-idx="${idx}"` +
            ` ${isActive ? 'data-tab-active="true"' : ''}` +
            ` style="display:inline-block;border-radius:20px;padding:8px 16px;font-size:14px;white-space:nowrap;cursor:pointer;${activeStyle}"` +
            `>${tab.label}</span>`
        );
    }

    const activeStyle = isActive
        ? 'border-bottom:2px solid #1A1A2E;color:#1A1A2E;font-weight:700;'
        : 'border-bottom:2px solid transparent;color:#9CA3AF;font-weight:400;';
    return (
        `<span data-menu-tab data-tab-idx="${idx}"` +
        ` ${isActive ? 'data-tab-active="true"' : ''}` +
        ` style="display:inline-block;padding:12px 0;font-size:14px;white-space:nowrap;cursor:pointer;${activeStyle}"` +
        `>${tab.label}</span>`
    );
}

// ── 그리드 항목 HTML ─────────────────────────────────────────────────────

function buildGridItem(tab: TabItem, idx: number, design: 'tab' | 'chip' = 'tab', chipColor = '#7C5CFC'): string {
    const isActive = idx === 0;

    if (design === 'chip') {
        const activeStyle = isActive
            ? `background:${chipColor};color:#fff;border:none;`
            : 'background:#fff;color:#666;border:1px solid #ddd;';
        return (
            `<span data-menu-grid-item data-grid-idx="${idx}"` +
            ` style="display:inline-block;border-radius:20px;padding:8px 14px;font-size:13px;white-space:nowrap;cursor:pointer;${activeStyle}"` +
            `>${tab.label}</span>`
        );
    }

    return (
        `<span data-menu-grid-item data-grid-idx="${idx}"` +
        ` style="display:block;padding:14px 4px;font-size:14px;color:${isActive ? '#1A1A2E' : '#4B5563'};` +
        `font-weight:${isActive ? '700' : '400'};cursor:pointer;text-align:center;white-space:nowrap;` +
        `text-overflow:ellipsis;overflow:hidden;"` +
        `>${tab.label}</span>`
    );
}

// ── 인라인 토글 스크립트 ─────────────────────────────────────────────────
// 에디터(.is-builder) 환경에서는 실행하지 않음 — 실제 페이지(/view)에서만 동작

const TOGGLE_SCRIPT =
    `<script>` +
    `(function(){` +
        `var root=document.currentScript&&document.currentScript.closest('[data-spw-block]');` +
        `if(!root||root.getAttribute('data-menu-tab-inited')==='1')return;` +
        // 에디터 환경 감지 — ContentBuilder가 .is-builder 클래스를 부여
        `if(root.closest('.is-builder'))return;` +
        `root.setAttribute('data-menu-tab-inited','1');` +

        // 요소 참조
        `var scrollWrap=root.querySelector('[data-menu-tab-scroll]');` +
        `var gridWrap=root.querySelector('[data-menu-tab-grid]');` +
        `var toggleBtn=root.querySelector('[data-menu-tab-toggle]');` +
        `var chevron=toggleBtn&&toggleBtn.querySelector('svg');` +
        `var tabBar=root.querySelector('[data-menu-tab-bar]');` +
        `var expanded=false;` +

        // 탭 데이터 (앵커 스크롤용) + 디자인 모드
        `var tabsData=[];` +
        `try{tabsData=JSON.parse(root.getAttribute('data-menu-tabs')||'[]');}catch(e){}` +
        `var design=root.getAttribute('data-menu-design')||'tab';` +
        `var chipColor=root.getAttribute('data-chip-active-color')||'#7C5CFC';` +

        // Sticky 모드 — .row 래퍼에 적용해야 .is-container 전체 높이 안에서 고정됨
        `var stickyRow=root.closest('.row');` +
        `var isSticky=root.getAttribute('data-menu-sticky')==='true';` +
        // applySticky: 매번 root.closest('.row')로 재조회 — 런타임이 .row를 교체해도 stale 참조 방지
        `function applySticky(){` +
            `var row=root.closest('.row');` +
            `if(!row)return;` +
            `row.style.position='sticky';` +
            `row.style.top='0';` +
            `row.style.zIndex='100';` +
            `row.style.background='#ffffff';` +
        `}` +
        `if(isSticky){` +
            // 즉시 적용 (SSR 파싱 시점)
            `applySticky();` +
            // ContentBuilderRuntime init() 이후 재확인
            // — 런타임이 .row style을 재처리하여 sticky가 소실될 경우 복원
            `if(document.readyState==='complete'){` +
                `requestAnimationFrame(applySticky);` +
            `}else{` +
                `window.addEventListener('load',function(){requestAnimationFrame(applySticky);},{once:true});` +
            `}` +
        `}else if(stickyRow){` +
            `stickyRow.style.position='';` +
            `stickyRow.style.top='';` +
            `stickyRow.style.zIndex='';` +
            `stickyRow.style.background='';` +
        `}` +

        // 스크롤바 숨김 (인라인 불가한 ::-webkit-scrollbar 대응)
        `var styleId='mtg-scroll-hide-'+Math.random().toString(36).slice(2,8);` +
        `scrollWrap.setAttribute('data-mtg-id',styleId);` +
        `var styleEl=document.createElement('style');` +
        `styleEl.textContent='[data-mtg-id=\"'+styleId+'\"]::-webkit-scrollbar{display:none}';` +
        `root.appendChild(styleEl);` +

        // 칩 버튼 모드: 접힌 상태에서 위아래 여백 추가
        `if(design==='chip'){` +
            `scrollWrap.style.padding='8px 48px 8px 16px';` +
            `tabBar.style.borderBottom='none';` +
        `}` +

        // 펼치기/접기 토글
        `function toggle(){` +
            `expanded=!expanded;` +
            `if(design==='chip'){` +
                // 칩 버튼 모드: gridWrap 안 쓰고 scrollWrap 자체를 flex-wrap 전환
                `if(expanded){` +
                    `scrollWrap.style.overflowX='visible';` +
                    `scrollWrap.style.whiteSpace='normal';` +
                    `scrollWrap.style.flexWrap='wrap';` +
                    `tabBar.style.overflow='visible';` +
                    `chevron.style.transform='rotate(180deg)';` +
                `}else{` +
                    `scrollWrap.style.overflowX='auto';` +
                    `scrollWrap.style.whiteSpace='nowrap';` +
                    `scrollWrap.style.flexWrap='nowrap';` +
                    `tabBar.style.overflow='hidden';` +
                    `chevron.style.transform='rotate(0deg)';` +
                `}` +
            `}else{` +
                // 탭 모드: 기존 gridWrap 펼침/접힘
                `if(expanded){` +
                    `gridWrap.style.display='grid';` +
                    `requestAnimationFrame(function(){` +
                        `gridWrap.style.maxHeight=gridWrap.scrollHeight+'px';` +
                    `});` +
                    `chevron.style.transform='rotate(180deg)';` +
                `}else{` +
                    `gridWrap.style.maxHeight='0';` +
                    `setTimeout(function(){if(!expanded)gridWrap.style.display='none';},300);` +
                    `chevron.style.transform='rotate(0deg)';` +
                `}` +
            `}` +
        `}` +
        `if(toggleBtn)toggleBtn.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();toggle();});` +

        // 앵커 스크롤 — 타겟 블록(.row)으로 부드럽게 이동
        `function scrollToTarget(idx){` +
            `var td=tabsData[Number(idx)];` +
            `if(!td||typeof td.target!=='number')return;` +
            `var container=root.closest('.is-container');` +
            `if(!container)return;` +
            `var rows=container.querySelectorAll(':scope > .row');` +
            `var targetRow=rows[td.target];` +
            `if(!targetRow)return;` +
            // Sticky 모드에서 탭바 높이만큼 오프셋 적용 (row 높이는 그리드 포함 시 과대)
            `if(isSticky&&tabBar){` +
                `targetRow.style.scrollMarginTop=tabBar.offsetHeight+'px';` +
            `}` +
            `targetRow.scrollIntoView({behavior:'smooth',block:'start'});` +
        `}` +

        // 탭 선택
        `var allTabs=root.querySelectorAll('[data-menu-tab]');` +
        `var allGridItems=root.querySelectorAll('[data-menu-grid-item]');` +
        `function selectTab(idx,fromGrid){` +
            `allTabs.forEach(function(t){` +
                `var isActive=t.getAttribute('data-tab-idx')===String(idx);` +
                `if(design==='chip'){` +
                    `t.style.background=isActive?chipColor:'#fff';` +
                    `t.style.color=isActive?'#fff':'#666';` +
                    `t.style.border=isActive?'none':'1px solid #ddd';` +
                `}else{` +
                    `t.style.borderBottomColor=isActive?'#1A1A2E':'transparent';` +
                    `t.style.color=isActive?'#1A1A2E':'#9CA3AF';` +
                    `t.style.fontWeight=isActive?'700':'400';` +
                `}` +
                `if(isActive){` +
                    `t.setAttribute('data-tab-active','true');` +
                    `t.scrollIntoView({behavior:'smooth',block:'nearest',inline:'start'});` +
                `}else{t.removeAttribute('data-tab-active');}` +
            `});` +
            `allGridItems.forEach(function(g){` +
                `var isActive=g.getAttribute('data-grid-idx')===String(idx);` +
                `if(design==='chip'){` +
                    `g.style.background=isActive?chipColor:'#fff';` +
                    `g.style.color=isActive?'#fff':'#666';` +
                    `g.style.border=isActive?'none':'1px solid #ddd';` +
                `}else{` +
                    `g.style.color=isActive?'#1A1A2E':'#4B5563';` +
                    `g.style.fontWeight=isActive?'700':'400';` +
                `}` +
            `});` +
            // 그리드 펼쳐져 있으면 접기 → 접힘 애니메이션(300ms) 완료 후 스크롤
            `if(expanded){toggle();setTimeout(function(){scrollToTarget(idx);},320);}` +
            `else{scrollToTarget(idx);}` +
        `}` +
        `allTabs.forEach(function(t){` +
            `t.addEventListener('click',function(e){e.preventDefault();selectTab(t.getAttribute('data-tab-idx'),false);});` +
        `});` +
        `allGridItems.forEach(function(g){` +
            `g.addEventListener('click',function(e){e.preventDefault();selectTab(g.getAttribute('data-grid-idx'),true);});` +
        `});` +
    `})();` +
    `</script>`;

// ── 전체 HTML 조립 ───────────────────────────────────────────────────────

function buildMenuTabGridHtml(tabs: TabItem[], componentId: string, extraStyle: string): string {
    const tabsJson = JSON.stringify(tabs).replace(/&/g, '&amp;').replace(/"/g, '&quot;');

    return (
        `<div data-component-id="${componentId}" data-spw-block` +
        ` data-menu-tabs="${tabsJson}"` +
        ` data-menu-sticky="true"` +
        ` data-menu-design="tab"` +
        ` data-chip-active-color="#7C5CFC"` +
        ` style="font-family:${FONT_FAMILY};background:#ffffff;${extraStyle}">` +

            // 탭바 래퍼 — overflow:hidden으로 스크롤 영역이 보이는 폭을 초과하지 않게 제한
            // (루트 [data-spw-block]이 아닌 내부 요소이므로 ContentBuilder 툴바 잘림 없음)
            `<div data-menu-tab-bar style="position:relative;overflow:hidden;border-bottom:1px solid #E5E7EB;">` +

                // 가로 스크롤 영역 — padding-right로 토글 버튼 + 그라데이션 자리 확보
                `<div data-menu-tab-scroll style="display:flex;align-items:center;gap:16px;` +
                `padding:0 48px 0 16px;overflow-x:auto;scrollbar-width:none;` +
                `-webkit-overflow-scrolling:touch;">` +
                    tabs.map((tab, i) => buildTabBarItem(tab, i)).join('') +
                `</div>` +

                // 우측 그라데이션 페이드 + 토글 버튼 — 항상 우측 고정
                `<span data-menu-tab-toggle style="position:absolute;right:0;top:0;bottom:0;z-index:2;` +
                `padding:0 10px 0 20px;display:flex;align-items:center;cursor:pointer;` +
                `background:linear-gradient(to right,rgba(255,255,255,0) 0%,rgba(255,255,255,0.85) 35%,#ffffff 60%);` +
                `border-bottom:1px solid #E5E7EB;">` +
                    CHEVRON_DOWN_SVG +
                `</span>` +

            `</div>` +

            // 그리드 (펼친 상태, 기본 숨김)
            `<div data-menu-tab-grid style="display:none;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));` +
            `gap:0;padding:8px 12px;max-height:0;overflow:hidden;transition:max-height 0.3s ease;` +
            `border-bottom:1px solid #E5E7EB;">` +
                tabs.map((tab, i) => buildGridItem(tab, i)).join('') +
            `</div>` +

            TOGGLE_SCRIPT +
        `</div>`
    );
}

// ── 3개 variant HTML ──────────────────────────────────────────────────────

const MENU_TAB_GRID_MOBILE_HTML     = buildMenuTabGridHtml(DEFAULT_TABS, 'menu-tab-grid-mobile',     '');
const MENU_TAB_GRID_WEB_HTML        = buildMenuTabGridHtml(DEFAULT_TABS, 'menu-tab-grid-web',        'width:100%;box-sizing:border-box;');
const MENU_TAB_GRID_RESPONSIVE_HTML = buildMenuTabGridHtml(DEFAULT_TABS, 'menu-tab-grid-responsive', 'width:100%;box-sizing:border-box;');

// ── DB 등록 ───────────────────────────────────────────────────────────────

const VARIANTS = [
    {
        id: 'menu-tab-grid-mobile',
        html: MENU_TAB_GRID_MOBILE_HTML,
        viewMode: 'mobile' as const,
        label: '메뉴 탭 그리드',
        description: '전체 메뉴 탭 그리드 (접기/펼치기)',
    },
    {
        id: 'menu-tab-grid-web',
        html: MENU_TAB_GRID_WEB_HTML,
        viewMode: 'web' as const,
        label: '메뉴 탭 그리드',
        description: '전체 메뉴 탭 그리드 (접기/펼치기)',
    },
    {
        id: 'menu-tab-grid-responsive',
        html: MENU_TAB_GRID_RESPONSIVE_HTML,
        viewMode: 'responsive' as const,
        label: '메뉴 탭 그리드',
        description: '전체 메뉴 탭 그리드 (접기/펼치기)',
    },
];

async function main() {
    for (const variant of VARIANTS) {
        const existing = await getComponentById(variant.id);

        if (existing) {
            await updateComponent({
                componentId:        variant.id,
                componentType:      existing.COMPONENT_TYPE,
                viewMode:           existing.VIEW_MODE,
                componentThumbnail: existing.COMPONENT_THUMBNAIL ?? undefined,
                data: {
                    ...(existing.DATA ?? {}) as Record<string, unknown>,
                    id:          variant.id.replace(`-${variant.viewMode}`, ''),
                    label:       variant.label,
                    description: variant.description,
                    preview:     '/assets/minimalist-blocks/preview/ibk-menu-tab-grid.svg',
                    html:        variant.html,
                    viewMode:    variant.viewMode,
                },
                lastModifierId: 'system',
            });
            console.log(`✅ ${variant.id} — UPDATE 완료`);
        } else {
            await createComponent({
                componentId:        variant.id,
                componentType:      'finance',
                viewMode:           variant.viewMode,
                componentThumbnail: '/assets/minimalist-blocks/preview/ibk-menu-tab-grid.svg',
                data: {
                    id:          variant.id.replace(`-${variant.viewMode}`, ''),
                    label:       variant.label,
                    description: variant.description,
                    preview:     '/assets/minimalist-blocks/preview/ibk-menu-tab-grid.svg',
                    html:        variant.html,
                    viewMode:    variant.viewMode,
                },
                createUserId:   'system',
                createUserName: '시스템',
            });
            console.log(`✅ ${variant.id} — INSERT 완료`);
        }
    }
    await closePool();
}

main().catch((err) => { console.error('실패:', err); process.exit(1); });
