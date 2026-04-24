// scripts/migrate-promo-banner-to-html.ts
// promo-banner 컴포넌트를 data-cb-type 플러그인 구조에서 순수 HTML로 변환
// 기본 레이아웃: flex-direction:column (에디터에서 전체 배너 표시)
// 뷰어(/view): 인라인 스크립트가 가로 scroll-snap 슬라이더로 변환
// DB SPW_CMS_COMPONENT의 promo-banner-mobile / web / responsive DATA.html 필드 업데이트
// 실행: npx tsx scripts/migrate-promo-banner-to-html.ts

import 'dotenv/config';
import { getComponentById, updateComponent } from '../src/db/repository/component.repository';
import { closePool } from '../src/db/connection';

const FONT_FAMILY = "-apple-system,BlinkMacSystemFont,'Malgun Gothic','Apple SD Gothic Neo',sans-serif";

// 기본 슬라이드 데이터 (index.js Usage 주석 기준)
const SLIDES = [
    {
        itemId: 'pb-1',
        bgColor: 'linear-gradient(135deg,#0046A4 0%,#0066CC 100%)',
        badge: '이벤트',
        title: '특별 금리 혜택',
        desc: '적금 가입 시 최고 0.0% 금리',
        ctaText: '자세히 보기',
        ctaHref: '#',
    },
    {
        itemId: 'pb-2',
        bgColor: 'linear-gradient(135deg,#FF6600 0%,#FF8800 100%)',
        badge: '신상품',
        title: '[상품명] 대출',
        desc: '최저 금리로 빠르게 자금을 마련하세요',
        ctaText: '자세히 보기',
        ctaHref: '#',
    },
] as const;

// 슬라이드 HTML 생성 — style.css 스타일을 inline으로 이식
function buildSlide(slide: (typeof SLIDES)[number]): string {
    return (
        // overflow:hidden 금지 — ContentBuilder 툴바가 잘림. 배경은 직접 background 속성으로 적용
        `<div class="pb-slide" data-item-id="${slide.itemId}" style="position:relative;height:200px;border-radius:16px;background:${slide.bgColor};">` +
            `<div class="pb-slide-content" style="position:relative;z-index:1;padding:24px 20px;display:flex;flex-direction:column;gap:6px;height:100%;box-sizing:border-box;justify-content:center;">` +
                `<span class="pb-badge" style="display:inline-block;background:rgba(255,255,255,0.25);color:#fff;font-size:11px;font-weight:700;padding:3px 10px;border-radius:20px;letter-spacing:0.5px;width:fit-content;border:1px solid rgba(255,255,255,0.4);">${slide.badge}</span>` +
                `<h3 class="pb-slide-title" style="font-size:22px;font-weight:800;color:#fff;margin:0;line-height:1.2;letter-spacing:-0.5px;">${slide.title}</h3>` +
                `<p class="pb-slide-desc" style="font-size:13px;color:rgba(255,255,255,0.85);margin:0;line-height:1.4;">${slide.desc}</p>` +
                `<a class="pb-slide-cta" href="${slide.ctaHref}" style="display:inline-flex;align-items:center;background:rgba(255,255,255,0.2);color:#fff;text-decoration:none;font-size:13px;font-weight:600;padding:8px 16px;border-radius:20px;border:1px solid rgba(255,255,255,0.5);width:fit-content;margin-top:4px;min-height:36px;-webkit-tap-highlight-color:transparent;">${slide.ctaText} →</a>` +
            `</div>` +
        `</div>`
    );
}

// 슬라이더 초기화 인라인 스크립트
// window.builderRuntime: EditClient.tsx에서 에디터 활성 시 전역 등록 → 에디터 감지에 사용
// 에디터: 기본 column 레이아웃 유지 (전체 배너 표시)
// 뷰어: 트랙/슬라이드 CSS를 가로 scroll-snap 슬라이더로 변환 후 dots·autoplay 초기화
const SLIDER_SCRIPT =
    `<script>` +
    `(function(){` +
        `if(window.builderRuntime)return;` +
        `var r=document.currentScript&&document.currentScript.parentElement;` +
        `if(!r)return;` +
        `var track=r.querySelector('[data-pb-track]');` +
        `var dotsEl=r.querySelector('[data-pb-dots]');` +
        `var counterCur=r.querySelector('[data-pb-cur]');` +
        `if(!track)return;` +
        // 트랙을 가로 슬라이더로 변환
        `track.style.cssText='display:flex;flex-direction:row;overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none;-ms-overflow-style:none;gap:0;padding:12px 12px 4px;';` +
        `var slides=Array.from(track.querySelectorAll('[data-pb-slide]'));` +
        `if(!slides.length)return;` +
        // 슬라이드 아이템을 스냅 레이아웃으로 변환
        `slides.forEach(function(s){s.style.cssText='flex-shrink:0;width:100%;scroll-snap-align:start;padding:0 8px;box-sizing:border-box;';});` +
        `var cur=0;` +
        `if(counterCur)counterCur.textContent='1';` +
        `function updateDots(i){` +
            `if(!dotsEl)return;` +
            `Array.from(dotsEl.children).forEach(function(d,j){` +
                `d.style.background=j===i?'rgba(255,255,255,0.9)':'rgba(255,255,255,0.4)';` +
            `});` +
        `}` +
        `function goTo(i){` +
            `cur=i;` +
            `track.scrollTo({left:i*track.clientWidth,behavior:'smooth'});` +
            `updateDots(i);` +
            `if(counterCur)counterCur.textContent=String(i+1);` +
        `}` +
        `if(dotsEl){` +
            `slides.forEach(function(_,i){` +
                `var d=document.createElement('button');` +
                `d.setAttribute('aria-label','슬라이드 '+(i+1));` +
                `d.style.cssText='width:6px;height:6px;border-radius:50%;border:none;padding:0;cursor:pointer;flex-shrink:0;display:block;line-height:0;font-size:0;overflow:hidden;background:'+(i===0?'rgba(255,255,255,0.9)':'rgba(255,255,255,0.4)')+';';` +
                `d.addEventListener('click',function(){goTo(i);});` +
                `dotsEl.appendChild(d);` +
            `});` +
        `}` +
        `var t;` +
        `track.addEventListener('scroll',function(){` +
            `clearTimeout(t);` +
            `t=setTimeout(function(){` +
                `var i=Math.round(track.scrollLeft/track.clientWidth);` +
                `if(i!==cur){cur=i;updateDots(i);if(counterCur)counterCur.textContent=String(i+1);}` +
            `},80);` +
        `},{passive:true});` +
        `var timer=setInterval(function(){goTo((cur+1)%slides.length);},5000);` +
        `track.addEventListener('touchstart',function(){clearInterval(timer);},{passive:true,once:true});` +
    `})();` +
    `<\/script>`;

// 하단 dots + counter 바 (3개 variant 공통)
const BOTTOM_BAR =
    `<div style="display:flex;align-items:center;justify-content:center;gap:6px;padding:10px 0 12px;">` +
        `<div data-pb-dots style="display:flex;align-items:center;height:11px;gap:6px;"></div>` +
        `<span style="font-size:11px;color:#9CA3AF;line-height:1;"><span data-pb-cur>1</span> / ${SLIDES.length}</span>` +
    `</div>`;

// ── mobile variant ──────────────────────────────────────────────────────────
// 기본: column 나열 (에디터에서 전체 배너 표시)
// 뷰어: 스크립트가 가로 scroll-snap 슬라이더로 변환
const PROMO_BANNER_MOBILE_HTML =
    `<div data-component-id="promo-banner-mobile" data-spw-block style="font-family:${FONT_FAMILY};background:#fff;border-radius:20px;position:relative;">` +
        `<div data-pb-track style="display:flex;flex-direction:column;gap:12px;padding:12px;">` +
            SLIDES.map(slide =>
                `<div data-pb-slide style="width:100%;">${buildSlide(slide)}</div>`,
            ).join('') +
        `</div>` +
        BOTTOM_BAR +
        SLIDER_SCRIPT +
    `</div>`;

// ── web variant ─────────────────────────────────────────────────────────────
const PROMO_BANNER_WEB_HTML =
    `<div data-component-id="promo-banner-web" data-spw-block style="font-family:${FONT_FAMILY};background:#fff;border-radius:20px;width:100%;box-sizing:border-box;position:relative;">` +
        `<div data-pb-track style="display:flex;flex-direction:column;gap:12px;padding:12px;">` +
            SLIDES.map(slide =>
                `<div data-pb-slide style="width:100%;">${buildSlide(slide)}</div>`,
            ).join('') +
        `</div>` +
        BOTTOM_BAR +
        SLIDER_SCRIPT +
    `</div>`;

// ── responsive variant ──────────────────────────────────────────────────────
const PROMO_BANNER_RESPONSIVE_HTML =
    `<div data-component-id="promo-banner-responsive" data-spw-block style="font-family:${FONT_FAMILY};background:#fff;border-radius:20px;width:100%;box-sizing:border-box;position:relative;">` +
        `<div data-pb-track style="display:flex;flex-direction:column;gap:12px;padding:12px;">` +
            SLIDES.map(slide =>
                `<div data-pb-slide style="width:100%;">${buildSlide(slide)}</div>`,
            ).join('') +
        `</div>` +
        BOTTOM_BAR +
        SLIDER_SCRIPT +
    `</div>`;

const VARIANTS: Array<{ id: string; html: string }> = [
    { id: 'promo-banner-mobile',     html: PROMO_BANNER_MOBILE_HTML },
    { id: 'promo-banner-web',        html: PROMO_BANNER_WEB_HTML },
    { id: 'promo-banner-responsive', html: PROMO_BANNER_RESPONSIVE_HTML },
];

async function main() {
    console.log('promo-banner 컴포넌트 순수 HTML 변환 마이그레이션 시작...\n');

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
