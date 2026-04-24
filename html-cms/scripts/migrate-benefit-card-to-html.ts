// scripts/migrate-benefit-card-to-html.ts
// 혜택 요약 카드(Benefit Card) 컴포넌트 신규 등록
// DB SPW_CMS_COMPONENT에 benefit-card-mobile / web / responsive INSERT
// 실행: npx tsx scripts/migrate-benefit-card-to-html.ts

import 'dotenv/config';
import { getComponentById, createComponent, updateComponent } from '../src/db/repository/component.repository';
import { closePool } from '../src/db/connection';

const FONT_FAMILY = "-apple-system,BlinkMacSystemFont,'Malgun Gothic','Apple SD Gothic Neo',sans-serif";
const THUMBNAIL   = '/assets/minimalist-blocks/preview/ibk-benefit-card.svg';

// 예시 혜택 카드 데이터
const CARDS = [
    { icon: '💰', title: '30,000원 캐시백',  desc: '이벤트 참여 완료 시' },
    { icon: '📈', title: '연 5.5% 우대금리', desc: '최고 금리 적용 시'   },
    { icon: '🎁', title: '스타벅스 쿠폰',    desc: '추첨 1,000명 증정'   },
] as const;

// 이미지 URL 판별 (http/https, 절대경로, data URI)
function isImageUrl(val: string): boolean {
    return /^(https?:\/\/|\/|data:image\/)/.test(val.trim());
}

// 카드 1개 HTML — <a> 래퍼 포함 (ContentBuilder 인라인 편집 진입점)
// data-bc-icon / data-bc-title / data-bc-desc: BenefitCardEditor DOM 파싱용
function buildCard(card: (typeof CARDS)[number]): string {
    const iconContent = isImageUrl(card.icon)
        ? `<img src="${card.icon}" style="width:28px;height:28px;object-fit:contain;" alt="" />`
        : `<span style="font-size:24px;line-height:1;">${card.icon}</span>`;

    return (
        `<a href="#" style="display:block;text-decoration:none;flex:1;min-width:0;">` +
            `<div style="background:#fff;border:1px solid #E5E7EB;border-radius:20px;padding:24px 20px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:10px;box-shadow:0 4px 20px rgba(0,70,164,0.08);height:100%;box-sizing:border-box;">` +
                `<div data-bc-icon style="width:48px;height:48px;background:#E8F0FC;border-radius:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0;">` +
                    iconContent +
                `</div>` +
                `<div data-bc-title style="font-size:16px;font-weight:700;color:#0046A4;line-height:1.3;word-break:keep-all;">${card.title}</div>` +
                `<div data-bc-desc style="font-size:12px;color:#6B7280;line-height:1.4;word-break:keep-all;">${card.desc}</div>` +
            `</div>` +
        `</a>`
    );
}

// mobile 뷰어용 scroll-snap 변환 인라인 스크립트
// window.builderRuntime: EditClient.tsx에서 에디터 활성 시 전역 등록 → 에디터 감지에 사용
// 에디터: 기본 column 레이아웃 유지 (카드 전체 표시)
// 뷰어: 트랙/슬라이드 CSS를 가로 scroll-snap으로 변환
const SCROLL_SCRIPT =
    `<script data-bc-script>` +
    `(function(){` +
        `if(window.builderRuntime)return;` +
        `var root=document.currentScript&&document.currentScript.parentElement;` +
        `if(!root)return;` +
        `var track=root.querySelector('[data-bc-track]');` +
        `if(!track)return;` +
        // ContentBuilder가 flex-direction:column → class="flex flex-col"로 변환하는 경우 대응
        `track.className=(track.className||'').replace(/\\bflex(?:-col)?\\b/g,'').trim();` +
        // 트랙을 가로 scroll-snap 컨테이너로 변환
        `track.style.cssText='display:flex;flex-direction:row;overflow-x:auto;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch;scrollbar-width:none;-ms-overflow-style:none;gap:0;padding:4px 0 8px;';` +
        `var slides=Array.from(track.querySelectorAll('[data-bc-slide]'));` +
        `slides.forEach(function(s){` +
            `s.style.cssText='flex-shrink:0;width:80%;scroll-snap-align:start;padding:0 8px;box-sizing:border-box;';` +
        `});` +
    `})();` +
    `<\/script>`;

// ── mobile variant ────────────────────────────────────────────────────────────
// 기본: column 나열 (에디터에서 전체 카드 표시)
// 뷰어: 스크립트가 가로 scroll-snap으로 변환
// data-bc-cards: BenefitCardEditor가 카드 데이터 파싱에 사용
const MOBILE_HTML =
    `<div data-component-id="benefit-card-mobile" data-spw-block data-bc-cards='${JSON.stringify(CARDS).replace(/'/g, "&#39;")}' style="font-family:${FONT_FAMILY};background:#F5F7FA;border-radius:20px;padding:20px 16px 24px;">` +
        `<h3 style="font-size:16px;font-weight:700;color:#1A1A2E;margin:0 0 14px;">주요 혜택</h3>` +
        `<div data-bc-container data-bc-track style="display:flex;flex-direction:column;gap:12px;">` +
            CARDS.map((card) =>
                `<div data-bc-slide style="width:100%;">${buildCard(card)}</div>`,
            ).join('') +
        `</div>` +
        SCROLL_SCRIPT +
    `</div>`;

// ── web variant ───────────────────────────────────────────────────────────────
// 3열 flex 고정 그리드
const WEB_HTML =
    `<div data-component-id="benefit-card-web" data-spw-block data-bc-cards='${JSON.stringify(CARDS).replace(/'/g, "&#39;")}' style="font-family:${FONT_FAMILY};background:#F5F7FA;border-radius:20px;padding:24px;width:100%;box-sizing:border-box;">` +
        `<h3 style="font-size:18px;font-weight:700;color:#1A1A2E;margin:0 0 16px;">주요 혜택</h3>` +
        `<div data-bc-container style="display:flex;flex-direction:row;gap:12px;">` +
            CARDS.map((card) => buildCard(card)).join('') +
        `</div>` +
    `</div>`;

// ── responsive variant ────────────────────────────────────────────────────────
// 2열 flex-wrap 그리드
const RESPONSIVE_HTML =
    `<div data-component-id="benefit-card-responsive" data-spw-block data-bc-cards='${JSON.stringify(CARDS).replace(/'/g, "&#39;")}' style="font-family:${FONT_FAMILY};background:#F5F7FA;border-radius:20px;padding:20px;width:100%;box-sizing:border-box;">` +
        `<h3 style="font-size:17px;font-weight:700;color:#1A1A2E;margin:0 0 14px;">주요 혜택</h3>` +
        `<div data-bc-container style="display:flex;flex-wrap:wrap;gap:12px;">` +
            CARDS.map((card) =>
                `<div style="flex:1;min-width:calc(50% - 6px);box-sizing:border-box;">${buildCard(card)}</div>`,
            ).join('') +
        `</div>` +
    `</div>`;

const VARIANTS: Array<{
    id: string;
    html: string;
    viewMode: 'mobile' | 'web' | 'responsive';
    label: string;
    description: string;
}> = [
    { id: 'benefit-card-mobile',     html: MOBILE_HTML,     viewMode: 'mobile',     label: '혜택 요약 카드', description: '이벤트·상품 페이지 상단 혜택 카드 그리드 (모바일)' },
    { id: 'benefit-card-web',        html: WEB_HTML,        viewMode: 'web',        label: '혜택 요약 카드', description: '이벤트·상품 페이지 상단 혜택 카드 그리드 (웹)' },
    { id: 'benefit-card-responsive', html: RESPONSIVE_HTML, viewMode: 'responsive', label: '혜택 요약 카드', description: '이벤트·상품 페이지 상단 혜택 카드 그리드 (반응형)' },
];

async function main() {
    console.log('benefit-card 컴포넌트 등록 마이그레이션 시작...\n');

    for (const variant of VARIANTS) {
        const existing = await getComponentById(variant.id);

        if (existing) {
            // 이미 존재 → HTML만 업데이트 (COMPONENT_TYPE, VIEW_MODE 보존 필수)
            const currentData = (existing.DATA ?? {}) as Record<string, unknown>;
            await updateComponent({
                componentId:        variant.id,
                componentType:      existing.COMPONENT_TYPE,
                viewMode:           existing.VIEW_MODE,
                componentThumbnail: existing.COMPONENT_THUMBNAIL ?? undefined,
                data: {
                    ...currentData,
                    html:    variant.html,
                    preview: THUMBNAIL,
                },
                lastModifierId: 'system',
            });
            console.log(`✅ ${variant.id} — UPDATE 완료`);
        } else {
            // 신규 → INSERT
            await createComponent({
                componentId:        variant.id,
                componentType:      'finance',
                viewMode:           variant.viewMode,
                componentThumbnail: THUMBNAIL,
                data: {
                    id:          variant.id.replace(`-${variant.viewMode}`, ''),
                    label:       variant.label,
                    description: variant.description,
                    preview:     THUMBNAIL,
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
    console.log('\n마이그레이션 완료.');
}

main().catch((err) => {
    console.error('마이그레이션 실패:', err);
    process.exit(1);
});
