// src/components/edit/MenuTabGridEditor.tsx
// menu-tab-grid 블록의 탭 항목 편집 + 블록 연결 + Sticky 설정 모달 에디터 (Issue #226, #232)

'use client';

import { useState } from 'react';

interface TabItem {
    label: string;
    target?: number; // 연결할 블록 인덱스 (순서 패널 기준, 없으면 스크롤 미동작)
}

interface CanvasBlock {
    id: string;
    cbType: string;
    label: string;
    preview: string;
    outerHtml: string;
}

interface Props {
    blockEl: HTMLElement;
    canvasBlocks: CanvasBlock[];
    onClose: () => void;
}

const FONT_FAMILY = "-apple-system,BlinkMacSystemFont,'Malgun Gothic','Apple SD Gothic Neo',sans-serif";

const CHEVRON_DOWN_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="16" height="16" style="flex-shrink:0;transition:transform 0.25s ease;"><path d="m6 9 6 6 6-6"/></svg>`;

// ── 탭바 항목 HTML (마이그레이션 스크립트와 동일) ─────────────────────────

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

// ── 인라인 토글 스크립트 (마이그레이션 스크립트와 동기화) ────────────────

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
    `stickyRow.style.position='sticky';` +
    `stickyRow.style.top='0';` +
    `stickyRow.style.zIndex='100';` +
    `stickyRow.style.background='#ffffff';` +
    `}else if(stickyRow){` +
    `stickyRow.style.position='';` +
    `stickyRow.style.top='';` +
    `stickyRow.style.zIndex='';` +
    `stickyRow.style.background='';` +
    `}` +
    `var styleId='mtg-scroll-hide-'+Math.random().toString(36).slice(2,8);` +
    `scrollWrap.setAttribute('data-mtg-id',styleId);` +
    `var styleEl=document.createElement('style');` +
    `styleEl.textContent='[data-mtg-id=\"'+styleId+'\"]::-webkit-scrollbar{display:none}';` +
    `root.appendChild(styleEl);` +
    `if(design==='chip'){` +
    `scrollWrap.style.padding='8px 48px 8px 16px';` +
    `tabBar.style.borderBottom='none';` +
    `}` +
    `function toggle(){` +
    `expanded=!expanded;` +
    `if(design==='chip'){` +
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
    `if(expanded){` +
    `gridWrap.style.display='grid';` +
    `requestAnimationFrame(function(){gridWrap.style.maxHeight=gridWrap.scrollHeight+'px';});` +
    `chevron.style.transform='rotate(180deg)';` +
    `}else{` +
    `gridWrap.style.maxHeight='0';` +
    `setTimeout(function(){if(!expanded)gridWrap.style.display='none';},300);` +
    `chevron.style.transform='rotate(0deg)';` +
    `}` +
    `}` +
    `}` +
    `if(toggleBtn)toggleBtn.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();toggle();});` +
    `function scrollToTarget(idx){` +
    `var td=tabsData[Number(idx)];` +
    `if(!td||typeof td.target!=='number')return;` +
    `var container=root.closest('.is-container');` +
    `if(!container)return;` +
    `var rows=container.querySelectorAll(':scope > .row');` +
    `var targetRow=rows[td.target];` +
    `if(!targetRow)return;` +
    `if(isSticky&&tabBar){` +
    `targetRow.style.scrollMarginTop=tabBar.offsetHeight+'px';` +
    `}` +
    `targetRow.scrollIntoView({behavior:'smooth',block:'start'});` +
    `}` +
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
    `if(isActive){t.setAttribute('data-tab-active','true');t.scrollIntoView({behavior:'smooth',block:'nearest',inline:'start'});}` +
    `else{t.removeAttribute('data-tab-active');}` +
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

// ── DOM 조작 함수 ────────────────────────────────────────────────────────

/** blockEl DOM을 새 탭 데이터로 갱신 */
function applyToBlock(
    blockEl: HTMLElement,
    tabs: TabItem[],
    sticky: boolean,
    design: 'tab' | 'chip' = 'tab',
    chipColor = '#7C5CFC',
) {
    blockEl.setAttribute('data-menu-tabs', JSON.stringify(tabs));
    blockEl.setAttribute('data-menu-sticky', String(sticky));
    blockEl.setAttribute('data-menu-design', design);
    blockEl.setAttribute('data-chip-active-color', chipColor);

    // 탭바 갱신
    const scrollWrap = blockEl.querySelector<HTMLElement>('[data-menu-tab-scroll]');
    if (scrollWrap) {
        scrollWrap.innerHTML = tabs.map((tab, i) => buildTabBarItem(tab, i, design, chipColor)).join('');
    }

    // 그리드 갱신
    const gridWrap = blockEl.querySelector<HTMLElement>('[data-menu-tab-grid]');
    if (gridWrap) {
        gridWrap.innerHTML = tabs.map((tab, i) => buildGridItem(tab, i, design, chipColor)).join('');
        gridWrap.style.display = 'none';
        gridWrap.style.maxHeight = '0';
    }

    // 스크립트 재주입
    blockEl.querySelectorAll('script').forEach((el) => el.remove());
    blockEl.querySelectorAll('style').forEach((el) => el.remove());
    blockEl.removeAttribute('data-menu-tab-inited');
    blockEl.insertAdjacentHTML('beforeend', TOGGLE_SCRIPT);
}

/** blockEl에서 현재 탭 데이터 파싱 */
function parseTabs(blockEl: HTMLElement): TabItem[] {
    const raw = blockEl.getAttribute('data-menu-tabs');
    if (raw) {
        try {
            return JSON.parse(raw) as TabItem[];
        } catch {
            // 파싱 실패 시 DOM에서 직접 읽기
        }
    }
    // data-menu-tabs 없을 경우 그리드 DOM에서 추출 (하위 호환)
    return Array.from(blockEl.querySelectorAll('[data-menu-grid-item]')).map((el) => ({
        label: el.textContent?.trim() ?? '',
        target: undefined,
    }));
}

// ── 스타일 상수 ───────────────────────────────────────────────────────────

const S = {
    overlay: {
        position: 'fixed' as const,
        inset: 0,
        zIndex: 99998,
        background: 'rgba(0,0,0,0.35)',
        backdropFilter: 'blur(2px)',
    },
    panel: {
        position: 'fixed' as const,
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: 440,
        maxHeight: '80vh',
        display: 'flex',
        flexDirection: 'column' as const,
        zIndex: 99999,
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
        fontFamily: FONT_FAMILY,
        fontSize: 13,
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 14px',
        borderBottom: '1px solid #f3f4f6',
        borderRadius: '12px 12px 0 0',
        background: '#fafafa',
        flexShrink: 0,
    },
    body: {
        overflowY: 'auto' as const,
        flex: 1,
        padding: '12px 14px',
        display: 'flex',
        flexDirection: 'column' as const,
        gap: 6,
    },
    footer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 6,
        padding: '10px 14px 14px',
        borderTop: '1px solid #f3f4f6',
        flexShrink: 0,
    },
    itemRow: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 10px',
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        background: '#fafafa',
    },
    iconBtn: {
        width: 26,
        height: 26,
        border: '1px solid #e5e7eb',
        borderRadius: 5,
        background: '#fff',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        padding: 0,
    } as React.CSSProperties,
    deleteBtn: {
        width: 26,
        height: 26,
        border: '1px solid #fca5a5',
        borderRadius: 5,
        background: '#fff',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        padding: 0,
        color: '#ef4444',
        marginLeft: 'auto',
    } as React.CSSProperties,
    input: {
        flex: 1,
        padding: '6px 10px',
        border: '1px solid #e5e7eb',
        borderRadius: 6,
        fontSize: 13,
        color: '#111827',
        background: '#fff',
        boxSizing: 'border-box' as const,
        fontFamily: FONT_FAMILY,
        outline: 'none',
        minWidth: 0,
    },
    addBtn: {
        width: '100%',
        padding: '8px',
        border: '1.5px dashed #c7d8f4',
        borderRadius: 8,
        background: '#f0f4ff',
        color: '#0046A4',
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    } as React.CSSProperties,
    cancelBtn: {
        padding: '6px 14px',
        border: '1px solid #e5e7eb',
        borderRadius: 6,
        background: '#fff',
        fontSize: 12,
        color: '#374151',
        cursor: 'pointer',
        fontWeight: 600,
    },
    applyBtn: {
        padding: '6px 16px',
        border: 'none',
        borderRadius: 6,
        background: '#0046A4',
        fontSize: 12,
        color: '#fff',
        cursor: 'pointer',
        fontWeight: 600,
    },
};

// ── 컴포넌트 ──────────────────────────────────────────────────────────────

export default function MenuTabGridEditor({ blockEl, canvasBlocks, onClose }: Props) {
    const [tabs, setTabs] = useState<TabItem[]>(() => parseTabs(blockEl));
    const [sticky, setSticky] = useState(() => blockEl.getAttribute('data-menu-sticky') === 'true');
    const [design, setDesign] = useState<'tab' | 'chip'>(
        () => (blockEl.getAttribute('data-menu-design') as 'tab' | 'chip') || 'tab',
    );
    const [chipColor, setChipColor] = useState(() => blockEl.getAttribute('data-chip-active-color') || '#7C5CFC');

    // 메뉴 탭 그리드 자기 자신의 블록 인덱스 (드롭다운에서 제외용)
    // DOM에서 실제 .row 위치를 찾아야 동일 타입 복수 블록에서도 정확함
    const selfBlockIdx = Array.from(blockEl.closest('.container')?.children ?? [])
        .filter((el) => (el as HTMLElement).classList.contains('row'))
        .indexOf(blockEl.closest('.row') as HTMLElement);

    const handleLabelChange = (idx: number, value: string) => {
        setTabs((prev) => prev.map((tab, i) => (i === idx ? { ...tab, label: value } : tab)));
    };

    const handleTargetChange = (idx: number, value: string) => {
        const target = value === '' ? undefined : Number(value);
        setTabs((prev) => prev.map((tab, i) => (i === idx ? { ...tab, target } : tab)));
    };

    const handleAdd = () => {
        setTabs((prev) => [...prev, { label: '새 메뉴' }]);
    };

    const handleDelete = (idx: number) => {
        if (tabs.length <= 1) return;
        setTabs((prev) => prev.filter((_, i) => i !== idx));
    };

    const handleMoveUp = (idx: number) => {
        if (idx === 0) return;
        const newTabs = [...tabs];
        [newTabs[idx - 1], newTabs[idx]] = [newTabs[idx], newTabs[idx - 1]];
        setTabs(newTabs);
    };

    const handleMoveDown = (idx: number) => {
        if (idx === tabs.length - 1) return;
        const newTabs = [...tabs];
        [newTabs[idx], newTabs[idx + 1]] = [newTabs[idx + 1], newTabs[idx]];
        setTabs(newTabs);
    };

    const handleApply = () => {
        applyToBlock(blockEl, tabs, sticky, design, chipColor);
        onClose();
    };

    return (
        <>
            {/* 오버레이 */}
            <div onClick={onClose} style={S.overlay} />

            {/* 패널 */}
            <div onClick={(e) => e.stopPropagation()} style={S.panel}>
                {/* 헤더 */}
                <div style={S.header}>
                    <span style={{ fontWeight: 700, color: '#111827' }}>메뉴 탭 항목 편집</span>
                    <button
                        onClick={onClose}
                        style={{
                            width: 24,
                            height: 24,
                            border: 'none',
                            background: 'none',
                            cursor: 'pointer',
                            color: '#6b7280',
                            fontSize: 18,
                            padding: 0,
                            lineHeight: 1,
                        }}
                    >
                        ×
                    </button>
                </div>

                {/* 안내 문구 */}
                <div
                    style={{
                        padding: '8px 14px',
                        background: '#f0f4ff',
                        borderBottom: '1px solid #e5e7eb',
                        fontSize: 11,
                        color: '#4b6baf',
                        flexShrink: 0,
                    }}
                >
                    탭 메뉴 항목을 추가·삭제·이름변경·순서변경하고, 연결할 블록을 선택합니다.
                </div>

                {/* 디자인 모드 선택 */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 14px',
                        borderBottom: '1px solid #f3f4f6',
                        flexShrink: 0,
                    }}
                >
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>디자인</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <select
                            value={design}
                            onChange={(e) => setDesign(e.target.value as 'tab' | 'chip')}
                            style={{
                                padding: '4px 8px',
                                border: '1px solid #e5e7eb',
                                borderRadius: 6,
                                fontSize: 12,
                                fontFamily: FONT_FAMILY,
                                background: '#fff',
                            }}
                        >
                            <option value="tab">탭 메뉴</option>
                            <option value="chip">칩 버튼</option>
                        </select>
                        {design === 'chip' && (
                            <input
                                type="color"
                                value={chipColor}
                                onChange={(e) => setChipColor(e.target.value)}
                                title="활성 색상"
                                style={{
                                    width: 28,
                                    height: 28,
                                    border: '1px solid #e5e7eb',
                                    borderRadius: 6,
                                    padding: 2,
                                    cursor: 'pointer',
                                }}
                            />
                        )}
                    </div>
                </div>

                {/* Sticky 토글 */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 14px',
                        borderBottom: '1px solid #f3f4f6',
                        flexShrink: 0,
                    }}
                >
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#374151' }}>상단 고정 (Sticky)</span>
                    <button
                        type="button"
                        onClick={() => setSticky((prev) => !prev)}
                        style={{
                            width: 44,
                            height: 24,
                            borderRadius: 12,
                            border: 'none',
                            background: sticky ? '#0046A4' : '#d1d5db',
                            cursor: 'pointer',
                            position: 'relative',
                            transition: 'background 0.2s ease',
                            padding: 0,
                            flexShrink: 0,
                        }}
                    >
                        <span
                            style={{
                                position: 'absolute',
                                top: 2,
                                left: sticky ? 22 : 2,
                                width: 20,
                                height: 20,
                                borderRadius: '50%',
                                background: '#fff',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                                transition: 'left 0.2s ease',
                            }}
                        />
                    </button>
                </div>

                {/* 항목 목록 */}
                <div style={S.body}>
                    {tabs.map((tab, idx) => (
                        <div key={idx} style={S.itemRow}>
                            {/* 순서 번호 */}
                            <span
                                style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', minWidth: 16, flexShrink: 0 }}
                            >
                                {idx + 1}
                            </span>

                            {/* 순서 변경 버튼 */}
                            <button
                                type="button"
                                title="위로"
                                disabled={idx === 0}
                                onClick={() => handleMoveUp(idx)}
                                style={{ ...S.iconBtn, opacity: idx === 0 ? 0.35 : 1 }}
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    width="13"
                                    height="13"
                                    fill="none"
                                    stroke="#374151"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="m18 15-6-6-6 6" />
                                </svg>
                            </button>
                            <button
                                type="button"
                                title="아래로"
                                disabled={idx === tabs.length - 1}
                                onClick={() => handleMoveDown(idx)}
                                style={{ ...S.iconBtn, opacity: idx === tabs.length - 1 ? 0.35 : 1 }}
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    width="13"
                                    height="13"
                                    fill="none"
                                    stroke="#374151"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="m6 9 6 6 6-6" />
                                </svg>
                            </button>

                            {/* 이름 입력 */}
                            <input
                                type="text"
                                value={tab.label}
                                onChange={(e) => handleLabelChange(idx, e.target.value)}
                                style={{ ...S.input, flex: 1 }}
                                placeholder="메뉴 이름"
                            />

                            {/* 연결 블록 선택 */}
                            <select
                                value={tab.target ?? ''}
                                onChange={(e) => handleTargetChange(idx, e.target.value)}
                                style={{
                                    flex: '0 0 120px',
                                    padding: '6px 6px',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: 6,
                                    fontSize: 11,
                                    color: tab.target != null ? '#111827' : '#9ca3af',
                                    background: '#fff',
                                    fontFamily: FONT_FAMILY,
                                    outline: 'none',
                                    minWidth: 0,
                                }}
                                title="스크롤 이동할 블록 선택"
                            >
                                <option value="">연결 없음</option>
                                {canvasBlocks.map((block, blockIdx) =>
                                    blockIdx !== selfBlockIdx ? (
                                        <option key={block.id} value={blockIdx}>
                                            {blockIdx + 1}. {block.label}
                                        </option>
                                    ) : null,
                                )}
                            </select>

                            {/* 삭제 버튼 */}
                            <button
                                type="button"
                                title="항목 삭제"
                                disabled={tabs.length <= 1}
                                onClick={() => handleDelete(idx)}
                                style={{ ...S.deleteBtn, opacity: tabs.length <= 1 ? 0.35 : 1 }}
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    width="13"
                                    height="13"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M18 6 6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}

                    {/* 항목 추가 버튼 */}
                    <button type="button" onClick={handleAdd} style={S.addBtn}>
                        <svg
                            viewBox="0 0 24 24"
                            width="14"
                            height="14"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                        >
                            <path d="M12 5v14M5 12h14" />
                        </svg>
                        탭 메뉴 추가
                    </button>
                </div>

                {/* 푸터 */}
                <div style={S.footer}>
                    <span style={{ fontSize: 11, color: '#9ca3af' }}>총 {tabs.length}개 항목</span>
                    <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={onClose} style={S.cancelBtn}>
                            취소
                        </button>
                        <button onClick={handleApply} style={S.applyBtn}>
                            적용
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
