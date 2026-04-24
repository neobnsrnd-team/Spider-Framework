// scripts/migrate-product-gallery-to-html.ts
// product-gallery 컴포넌트를 data-cb-type 플러그인 구조에서 순수 HTML로 변환
// 기본 레이아웃: flex-direction:column (에디터에서 전체 카드 표시)
// 뷰어(/view): 인라인 스크립트가 가로 scroll-snap 슬라이더로 변환
// DB SPW_CMS_COMPONENT의 product-gallery-mobile / web / responsive DATA.html 필드 업데이트
// 실행: npx tsx scripts/migrate-product-gallery-to-html.ts

import 'dotenv/config';
import { getComponentById, updateComponent } from '../src/db/repository/component.repository';
import { closePool } from '../src/db/connection';

const FONT_FAMILY = "-apple-system,BlinkMacSystemFont,'Malgun Gothic','Apple SD Gothic Neo',sans-serif";

// 상품 유형별 강조 색상
const CARD_COLORS: Record<string, { accent: string; accentLight: string }> = {
    savings: { accent: '#0046A4', accentLight: '#E8F0FC' },
    deposit: { accent: '#0046A4', accentLight: '#E8F0FC' },
    loan:    { accent: '#FF6600', accentLight: '#FFF3EC' },
};

// 기본 상품 카드 데이터 (index.js Usage 주석 기준)
const CARDS = [
    {
        type: 'savings',
        badge: '적금',
        productName: '[상품명] 적금',
        rateValue: '4.5',
        rateLabel: '최고 금리 (연)',
        detail: '기간 1~36개월 · 월 최대 100만원',
        ctaHref: '#',
    },
    {
        type: 'deposit',
        badge: '예금',
        productName: '[상품명] 예금',
        rateValue: '3.8',
        rateLabel: '최고 금리 (연)',
        detail: '기간 6~36개월 · 1인 1계좌',
        ctaHref: '#',
    },
    {
        type: 'loan',
        badge: '대출',
        productName: '[상품명] 대출',
        rateValue: '4.2',
        rateLabel: '최저 금리 (연)',
        detail: '한도 최대 10억 · 거치 최대 3년',
        ctaHref: '#',
    },
] as const;

// 카드 HTML 생성 — style.css 스타일을 inline으로 이식, ::before 장식은 <div>로 대체
function buildCard(card: (typeof CARDS)[number], itemId: string): string {
    const { accent, accentLight } = CARD_COLORS[card.type];
    return (
        `<div data-type="${card.type}" data-item-id="${itemId}" style="background:#fff;border-radius:16px;padding:24px 20px;display:flex;flex-direction:column;gap:6px;box-shadow:0 4px 20px rgba(0,70,164,0.08);position:relative;overflow:hidden;">` +
            `<div style="position:absolute;top:0;right:0;width:120px;height:120px;background:linear-gradient(135deg,${accentLight} 0%,transparent 70%);border-radius:0 16px 0 100%;pointer-events:none;"></div>` +
            `<div data-pg-field="badge" style="display:inline-flex;align-items:center;background:${accentLight};color:${accent};font-size:11px;font-weight:700;padding:4px 10px;border-radius:20px;width:fit-content;letter-spacing:0.5px;">${card.badge}</div>` +
            `<div data-pg-field="productName" style="font-size:20px;font-weight:700;color:#1A1A2E;line-height:1.3;margin-top:4px;">${card.productName}</div>` +
            `<div data-pg-field="rateWrap" style="display:flex;align-items:baseline;gap:2px;margin-top:8px;">` +
                `<span data-pg-field="rateValue" style="font-size:40px;font-weight:800;color:${accent};line-height:1;letter-spacing:-1px;">${card.rateValue}</span>` +
                `<span style="font-size:22px;font-weight:700;color:${accent};">%</span>` +
            `</div>` +
            `<div data-pg-field="rateLabel" style="font-size:12px;color:#6B7280;font-weight:500;">${card.rateLabel}</div>` +
            `<div data-pg-field="detail" style="font-size:13px;color:#6B7280;padding:10px 0;border-top:1px solid #F3F4F6;margin-top:4px;">${card.detail}</div>` +
            `<a data-pg-field="cta" href="${card.ctaHref}" style="display:flex;align-items:center;justify-content:center;background:${accent};color:#fff;text-decoration:none;font-size:15px;font-weight:600;padding:14px;border-radius:12px;margin-top:8px;min-height:48px;-webkit-tap-highlight-color:transparent;">자세히 보기</a>` +
        `</div>`
    );
}

// 슬라이더 초기화 인라인 스크립트 — 모바일용
// window.builderRuntime: EditClient.tsx에서 에디터 활성 시 전역 등록 → 에디터 감지에 사용
// 에디터: 기본 column 레이아웃 유지 (전체 카드 표시)
// 뷰어: 트랙/슬라이드 CSS를 가로 scroll-snap 슬라이더로 변환 후 dots·autoplay 초기화
// [FIX #312] r._pgTimer로 이전 setInterval 정리 → React StrictMode 이중 실행 시 interval 중복 방지
const SLIDER_SCRIPT =
    `<script>` +
    `(function(){` +
        `if(window.builderRuntime)return;` +
        `var r=document.currentScript&&document.currentScript.parentElement;` +
        `if(!r)return;` +
        // 이전 실행 interval 정리 (React StrictMode 이중 실행 방지)
        `if(r._pgTimer){clearInterval(r._pgTimer);r._pgTimer=null;}` +
        `var track=r.querySelector('[data-pg-track]');` +
        `var dotsEl=r.querySelector('[data-pg-dots]');` +
        `if(!track)return;` +
        // 트랙을 가로 슬라이더로 변환
        `track.style.cssText='display:flex;flex-direction:row;overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none;-ms-overflow-style:none;padding:4px 0 8px;gap:0;';` +
        `var slides=Array.from(track.querySelectorAll('[data-pg-slide]'));` +
        `if(!slides.length)return;` +
        // 슬라이드 아이템을 스냅 레이아웃으로 변환
        `slides.forEach(function(s){s.style.cssText='flex-shrink:0;width:100%;scroll-snap-align:start;padding:0 20px;box-sizing:border-box;';});` +
        `var cur=0;` +
        `function updateDots(i){` +
            `if(!dotsEl)return;` +
            `Array.from(dotsEl.children).forEach(function(d,j){` +
                `d.style.background=j===i?'#0046A4':'rgba(0,70,164,0.25)';` +
            `});` +
        `}` +
        `function goTo(i){` +
            `cur=i;` +
            `track.scrollTo({left:i*track.clientWidth,behavior:'smooth'});` +
            `updateDots(i);` +
        `}` +
        `if(dotsEl){` +
            `slides.forEach(function(_,i){` +
                `var d=document.createElement('button');` +
                `d.setAttribute('aria-label','슬라이드 '+(i+1));` +
                `d.style.cssText='width:8px;height:8px;border-radius:50%;border:none;padding:0;cursor:pointer;margin:0 4px;display:block;line-height:0;font-size:0;overflow:hidden;flex-shrink:0;background:'+(i===0?'#0046A4':'rgba(0,70,164,0.25)')+';';` +
                `d.addEventListener('click',function(){goTo(i);});` +
                `dotsEl.appendChild(d);` +
            `});` +
        `}` +
        `var t;` +
        `track.addEventListener('scroll',function(){` +
            `clearTimeout(t);` +
            `t=setTimeout(function(){` +
                `var i=Math.round(track.scrollLeft/track.clientWidth);` +
                `if(i!==cur){cur=i;updateDots(i);}` +
            `},80);` +
        `},{passive:true});` +
        `r._pgTimer=setInterval(function(){goTo((cur+1)%slides.length);},4000);` +
        `track.addEventListener('touchstart',function(){if(r._pgTimer){clearInterval(r._pgTimer);r._pgTimer=null;}},{passive:true,once:true});` +
    `})();` +
    `<\/script>`;

// 반응형 슬라이더 초기화 인라인 스크립트
// [FIX #312-1] 768px 미만: 슬라이더, 768px 이상: 그리드로 전환 (resize 대응)
// [FIX #312-2] r._pgTimer / r._pgResize 로 이전 실행 cleanup → interval 중복 방지
const RESPONSIVE_SLIDER_SCRIPT =
    `<script>` +
    `(function(){` +
        `if(window.builderRuntime)return;` +
        `var r=document.currentScript&&document.currentScript.parentElement;` +
        `if(!r)return;` +
        // 이전 실행 cleanup
        `if(r._pgTimer){clearInterval(r._pgTimer);r._pgTimer=null;}` +
        `if(r._pgResize){window.removeEventListener('resize',r._pgResize);r._pgResize=null;}` +
        `var track=r.querySelector('[data-pg-track]');` +
        `var dotsEl=r.querySelector('[data-pg-dots]');` +
        `if(!track)return;` +
        `var slides=Array.from(track.querySelectorAll('[data-pg-slide]'));` +
        `if(!slides.length)return;` +
        `var cur=0;` +
        `function updateDots(i){` +
            `if(!dotsEl)return;` +
            `Array.from(dotsEl.children).forEach(function(d,j){` +
                `d.style.background=j===i?'#0046A4':'rgba(0,70,164,0.25)';` +
            `});` +
        `}` +
        `function goTo(i){` +
            `cur=i;` +
            `track.scrollTo({left:i*track.clientWidth,behavior:'smooth'});` +
            `updateDots(i);` +
        `}` +
        // dots 버튼 초기화 (슬라이더 모드용, 그리드 모드에서는 숨김)
        `if(dotsEl){` +
            `dotsEl.innerHTML='';` +
            `slides.forEach(function(_,i){` +
                `var d=document.createElement('button');` +
                `d.setAttribute('aria-label','슬라이드 '+(i+1));` +
                `d.style.cssText='width:8px;height:8px;border-radius:50%;border:none;padding:0;cursor:pointer;margin:0 4px;display:block;line-height:0;font-size:0;overflow:hidden;flex-shrink:0;background:'+(i===0?'#0046A4':'rgba(0,70,164,0.25)')+';';` +
                `d.addEventListener('click',function(){goTo(i);});` +
                `dotsEl.appendChild(d);` +
            `});` +
        `}` +
        `var t;` +
        `track.addEventListener('scroll',function(){` +
            `clearTimeout(t);` +
            `t=setTimeout(function(){` +
                `var i=Math.round(track.scrollLeft/track.clientWidth);` +
                `if(i!==cur){cur=i;updateDots(i);}` +
            `},80);` +
        `},{passive:true});` +
        // 768px 이상: 그리드 레이아웃 (interval 정지, dots 숨김)
        `function applyGrid(){` +
            `if(r._pgTimer){clearInterval(r._pgTimer);r._pgTimer=null;}` +
            `track.style.cssText='display:flex;flex-direction:row;flex-wrap:wrap;gap:12px;padding:4px 20px 20px;box-sizing:border-box;';` +
            `slides.forEach(function(s){s.style.cssText='flex:0 0 calc(33.333% - 8px);min-width:0;box-sizing:border-box;';});` +
            `if(dotsEl)dotsEl.style.display='none';` +
        `}` +
        // 768px 미만: 슬라이더 레이아웃 (interval 시작, dots 표시)
        `function applySlider(){` +
            `track.style.cssText='display:flex;flex-direction:row;overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none;-ms-overflow-style:none;padding:4px 0 8px;gap:0;';` +
            `slides.forEach(function(s){s.style.cssText='flex-shrink:0;width:100%;scroll-snap-align:start;padding:0 20px;box-sizing:border-box;';});` +
            `if(dotsEl)dotsEl.style.display='flex';` +
            `if(!r._pgTimer){` +
                `r._pgTimer=setInterval(function(){goTo((cur+1)%slides.length);},4000);` +
                `track.addEventListener('touchstart',function(){if(r._pgTimer){clearInterval(r._pgTimer);r._pgTimer=null;}},{passive:true,once:true});` +
            `}` +
        `}` +
        `function applyLayout(){` +
            `if(!document.contains(r)){window.removeEventListener('resize',r._pgResize);r._pgResize=null;return;}` +
            `if(window.innerWidth>=768){applyGrid();}else{applySlider();}` +
        `}` +
        `applyLayout();` +
        `r._pgResize=applyLayout;` +
        `window.addEventListener('resize',r._pgResize);` +
    `})();` +
    `<\/script>`;

// ── mobile variant ──────────────────────────────────────────────────────────
// 기본: column 나열 (에디터에서 전체 카드 표시)
// 뷰어: 스크립트가 가로 scroll-snap 슬라이더로 변환
const PRODUCT_GALLERY_MOBILE_HTML =
    `<div data-component-id="product-gallery-mobile" data-spw-block style="font-family:${FONT_FAMILY};background:#F5F7FA;border-radius:20px;position:relative;">` +
        `<div style="padding:20px 20px 12px;">` +
            `<h3 style="font-size:18px;font-weight:700;color:#1A1A2E;margin:0;">주요 금융상품</h3>` +
        `</div>` +
        `<div data-pg-track style="display:flex;flex-direction:column;gap:12px;padding:4px 20px 20px;">` +
            CARDS.map((card, i) =>
                `<div data-pg-slide style="width:100%;">${buildCard(card, `pg-${i + 1}`)}</div>`,
            ).join('') +
        `</div>` +
        `<div data-pg-dots style="display:flex;justify-content:center;align-items:center;height:32px;"></div>` +
        SLIDER_SCRIPT +
    `</div>`;

// ── web variant ─────────────────────────────────────────────────────────────
// 데스크탑: 카드 가로 3열 고정 그리드, max-width 중앙 정렬 (슬라이더 불필요)
const PRODUCT_GALLERY_WEB_HTML =
    `<div data-component-id="product-gallery-web" data-spw-block style="font-family:${FONT_FAMILY};background:#F5F7FA;border-radius:20px;position:relative;width:100%;box-sizing:border-box;">` +
        `<div style="padding:20px 20px 12px;">` +
            `<h3 style="font-size:18px;font-weight:700;color:#1A1A2E;margin:0;">주요 금융상품</h3>` +
        `</div>` +
        `<div data-pg-grid style="display:flex;flex-direction:row;gap:12px;padding:4px 20px 20px;">` +
            CARDS.map((card, i) =>
                `<div style="flex:1;min-width:0;">${buildCard(card, `pg-${i + 1}`)}</div>`,
            ).join('') +
        `</div>` +
    `</div>`;

// ── responsive variant ──────────────────────────────────────────────────────
// 기본: column 나열 (에디터에서 전체 카드 표시)
// 뷰어: 768px 미만 → 슬라이더, 768px 이상 → 그리드 (resize 대응)
// [FIX #312] RESPONSIVE_SLIDER_SCRIPT 사용 — 브레이크포인트 전환 + interval 중복 방지
const PRODUCT_GALLERY_RESPONSIVE_HTML =
    `<div data-component-id="product-gallery-responsive" data-spw-block style="font-family:${FONT_FAMILY};background:#F5F7FA;border-radius:20px;position:relative;width:100%;box-sizing:border-box;">` +
        `<div style="padding:20px 20px 12px;">` +
            `<h3 style="font-size:18px;font-weight:700;color:#1A1A2E;margin:0;">주요 금융상품</h3>` +
        `</div>` +
        `<div data-pg-track style="display:flex;flex-direction:column;gap:12px;padding:4px 20px 20px;">` +
            CARDS.map((card, i) =>
                `<div data-pg-slide style="width:100%;">${buildCard(card, `pg-${i + 1}`)}</div>`,
            ).join('') +
        `</div>` +
        `<div data-pg-dots style="display:flex;justify-content:center;align-items:center;height:32px;"></div>` +
        RESPONSIVE_SLIDER_SCRIPT +
    `</div>`;

const VARIANTS: Array<{ id: string; html: string }> = [
    { id: 'product-gallery-mobile',     html: PRODUCT_GALLERY_MOBILE_HTML },
    { id: 'product-gallery-web',        html: PRODUCT_GALLERY_WEB_HTML },
    { id: 'product-gallery-responsive', html: PRODUCT_GALLERY_RESPONSIVE_HTML },
];

async function main() {
    console.log('product-gallery 컴포넌트 순수 HTML 변환 마이그레이션 시작...\n');

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
