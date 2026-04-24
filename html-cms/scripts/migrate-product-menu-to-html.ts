// scripts/migrate-product-menu-to-html.ts
// product-menu 컴포넌트를 data-cb-type 플러그인 구조에서 순수 HTML로 변환
// DB SPW_CMS_COMPONENT의 product-menu-mobile / web / responsive DATA.html 필드 업데이트
// 실행: npx tsx scripts/migrate-product-menu-to-html.ts

import 'dotenv/config';
import { getComponentById, updateComponent } from '../src/db/repository/component.repository';
import { closePool } from '../src/db/connection';

// 공통 폰트 패밀리
const FONT_FAMILY = "-apple-system,BlinkMacSystemFont,'Malgun Gothic','Apple SD Gothic Neo',sans-serif";

// 아이콘 SVG — style.css 제거 후 CSS 의존 없이 stroke 색상 인라인 지정
const ICONS: Record<string, string> = {
    deposit:   `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#374151" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="5" width="20" height="15" rx="2"/><path d="M2 10h20"/><path d="M6 15h4"/><path d="M14 15h.01"/><path d="M18 15h.01"/></svg>`,
    loan:      `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#374151" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 12V8H4v12h8"/><path d="M4 8V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2"/><circle cx="18" cy="18" r="4"/><path d="M18 16v2l1 1"/></svg>`,
    fund:      `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#374151" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`,
    trust:     `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#374151" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`,
    forex:     `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#374151" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M15 8s2 1 2 4-2 4-2 4"/><path d="M9 8s-2 1-2 4 2 4 2 4"/></svg>`,
    insurance: `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#374151" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M23 12a11.05 11.05 0 0 0-22 0zm-5 7a3 3 0 0 1-6 0v-7"/></svg>`,
    card:      `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#374151" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`,
    isa:       `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#374151" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/><polyline points="6 9 9 12 13 8 17 11"/></svg>`,
    pension:   `<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#374151" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
};

// 기본 9개 항목 — index.js DEFAULT_ICON_KEYS 동일 순서
const ITEMS = [
    { key: 'deposit',   label: '예금' },
    { key: 'loan',      label: '대출' },
    { key: 'fund',      label: '펀드' },
    { key: 'trust',     label: '신탁' },
    { key: 'forex',     label: '외환' },
    { key: 'insurance', label: '보험' },
    { key: 'card',      label: '카드' },
    { key: 'isa',       label: 'ISA' },
    { key: 'pension',   label: '연금' },
] as const;

// 공통 아이템 HTML (모든 variant 동일)
function buildItems(): string {
    return ITEMS.map(({ key, label }) =>
        `<a href="#" class="pm-item" style="display:flex;flex-direction:column;align-items:center;gap:8px;padding:14px 6px;border-radius:12px;text-decoration:none;cursor:pointer;">` +
            `<div class="pm-icon-wrap" contenteditable="false" style="width:60px;height:60px;border-radius:14px;background:#F3F4F6;display:flex;align-items:center;justify-content:center;flex-shrink:0;">${ICONS[key]}</div>` +
            `<span class="pm-label" data-max-chars="20" style="font-size:12px;font-weight:500;color:#0046A4;text-align:center;line-height:1.3;word-break:keep-all;overflow-wrap:anywhere;max-width:100%;">${label}</span>` +
        `</a>`
    ).join('');
}

// ── mobile variant ──────────────────────────────────────────────────────────
// 390px 기준 모바일: 3×3 그리드, 표준 패딩
const PRODUCT_MENU_MOBILE_HTML =
    `<div data-component-id="product-menu-mobile" data-spw-block style="font-family:${FONT_FAMILY};background:#ffffff;border-radius:16px;box-shadow:0 2px 12px rgba(0,0,0,0.08);">` +
        `<div class="pm-header" style="padding:18px 18px 4px;">` +
            `<div class="pm-title" style="font-size:16px;font-weight:700;color:#0046A4;letter-spacing:-0.3px;">상품</div>` +
        `</div>` +
        `<div class="pm-grid" style="display:grid;grid-template-columns:repeat(3,1fr);padding:8px 8px 20px;gap:4px;">${buildItems()}</div>` +
    `</div>`;

// ── web variant ─────────────────────────────────────────────────────────────
// 데스크탑: 패딩 확장, 에디터 캔버스 너비 기준 100% 채움
const PRODUCT_MENU_WEB_HTML =
    `<div data-component-id="product-menu-web" data-spw-block style="font-family:${FONT_FAMILY};background:#ffffff;border-radius:16px;box-shadow:0 2px 12px rgba(0,0,0,0.08);width:100%;box-sizing:border-box;">` +
        `<div class="pm-header" style="padding:20px 20px 4px;">` +
            `<div class="pm-title" style="font-size:17px;font-weight:700;color:#0046A4;letter-spacing:-0.3px;">상품</div>` +
        `</div>` +
        `<div class="pm-grid" style="display:grid;grid-template-columns:repeat(3,1fr);padding:8px 8px 24px;gap:4px;">${buildItems()}</div>` +
    `</div>`;

// ── responsive variant ──────────────────────────────────────────────────────
// 모바일·웹 공용: 100% 너비, box-sizing border-box
const PRODUCT_MENU_RESPONSIVE_HTML =
    `<div data-component-id="product-menu-responsive" data-spw-block style="font-family:${FONT_FAMILY};background:#ffffff;border-radius:16px;box-shadow:0 2px 12px rgba(0,0,0,0.08);width:100%;box-sizing:border-box;">` +
        `<div class="pm-header" style="padding:18px 18px 4px;">` +
            `<div class="pm-title" style="font-size:16px;font-weight:700;color:#0046A4;letter-spacing:-0.3px;">상품</div>` +
        `</div>` +
        `<div class="pm-grid" style="display:grid;grid-template-columns:repeat(3,1fr);padding:8px 8px 20px;gap:4px;">${buildItems()}</div>` +
    `</div>`;

const VARIANTS: Array<{ id: string; html: string }> = [
    { id: 'product-menu-mobile',     html: PRODUCT_MENU_MOBILE_HTML },
    { id: 'product-menu-web',        html: PRODUCT_MENU_WEB_HTML },
    { id: 'product-menu-responsive', html: PRODUCT_MENU_RESPONSIVE_HTML },
];

async function main() {
    console.log('product-menu 컴포넌트 순수 HTML 변환 마이그레이션 시작...\n');

    for (const variant of VARIANTS) {
        const existing = await getComponentById(variant.id);
        if (!existing) {
            console.error(`❌ ${variant.id} — DB에서 컴포넌트를 찾을 수 없습니다. 건너뜁니다.`);
            continue;
        }

        const currentData = (existing.DATA ?? {}) as Record<string, unknown>;

        await updateComponent({
            componentId:        variant.id,
            componentType:      existing.COMPONENT_TYPE,
            viewMode:           existing.VIEW_MODE,
            componentThumbnail: existing.COMPONENT_THUMBNAIL ?? undefined,
            data: {
                ...currentData,
                html: variant.html,
            },
            lastModifierId: 'system',
        });

        console.log(`✅ ${variant.id} — 완료`);
    }

    await closePool();
    console.log('\n마이그레이션 완료.');
}

main().catch((err) => {
    console.error('마이그레이션 실패:', err);
    process.exit(1);
});
