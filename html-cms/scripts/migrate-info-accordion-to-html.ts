// scripts/migrate-info-accordion-to-html.ts
// info-accordion 컴포넌트 등록/업데이트 (Issue #222, #224)
// 금융 앱 상품 상세/이벤트 페이지 하단 이용안내·유의사항 전용 아코디언 토글 컴포넌트
// 실행: npx tsx scripts/migrate-info-accordion-to-html.ts

import 'dotenv/config';
import { getComponentById, updateComponent, createComponent } from '../src/db/repository/component.repository';
import { closePool } from '../src/db/connection';

const FONT_FAMILY = "-apple-system,BlinkMacSystemFont,'Malgun Gothic','Apple SD Gothic Neo',sans-serif";

// ── 아코디언 항목 타입 ─────────────────────────────────────────────────────────

interface AccordionItem {
    title: string;
    content: string; // 본문 HTML (불렛 텍스트, 테이블, 강조 등)
}

// ── 기본 예시 항목 데이터 ─────────────────────────────────────────────────────

const DEFAULT_ITEMS: AccordionItem[] = [
    {
        title: '서비스 이용 안내',
        content:
            `<p style="margin:0 0 10px;">· 지난달 이용실적에 따른 월간 통합 할인한도</p>` +
            `<table style="width:100%;border-collapse:collapse;margin-bottom:14px;font-size:12px;">` +
                `<thead><tr>` +
                    `<th style="padding:9px 12px;text-align:center;font-weight:600;color:#374151;border:1px solid #E5E7EB;background:#F9FAFB;">지난달 이용실적</th>` +
                    `<th style="padding:9px 12px;text-align:center;font-weight:600;color:#374151;border:1px solid #E5E7EB;background:#F9FAFB;">월 통합 할인 한도</th>` +
                `</tr></thead>` +
                `<tbody>` +
                    `<tr><td style="padding:9px 12px;text-align:center;color:#374151;border:1px solid #E5E7EB;">10만원 이상</td><td style="padding:9px 12px;text-align:center;color:#374151;border:1px solid #E5E7EB;">5천원</td></tr>` +
                    `<tr><td style="padding:9px 12px;text-align:center;color:#374151;border:1px solid #E5E7EB;">20만원 이상</td><td style="padding:9px 12px;text-align:center;color:#374151;border:1px solid #E5E7EB;">1만원</td></tr>` +
                    `<tr><td style="padding:9px 12px;text-align:center;color:#374151;border:1px solid #E5E7EB;">30만원 이상</td><td style="padding:9px 12px;text-align:center;color:#374151;border:1px solid #E5E7EB;">2만원</td></tr>` +
                    `<tr><td style="padding:9px 12px;text-align:center;color:#374151;border:1px solid #E5E7EB;">50만원 이상</td><td style="padding:9px 12px;text-align:center;color:#374151;border:1px solid #E5E7EB;">3만원</td></tr>` +
                    `<tr><td style="padding:9px 12px;text-align:center;color:#374151;border:1px solid #E5E7EB;">100만원 이상</td><td style="padding:9px 12px;text-align:center;color:#374151;border:1px solid #E5E7EB;">5만원</td></tr>` +
                `</tbody>` +
            `</table>` +
            `<p style="margin:0 0 6px;">· 통합 할인한도 적용 대상 서비스: 대중교통, 국군 콘도, 레스토랑, 스타벅스, 패스트푸드, 온라인쇼핑, 어학시험, 교보문고/알라딘, 광역교통</p>` +
            `<p style="margin:0 0 6px;">· 군 급여이체 조건 상세안내</p>` +
            `<p style="margin:0 0 6px;">&nbsp;&nbsp;· <strong>국군재정관리단을 통한 하나은행 나라사랑통장 계좌로 급여이체 시에만 다음달에 서비스가 제공됨</strong></p>` +
            `<p style="margin:0 0 6px;">&nbsp;&nbsp;· 단, 군 급여를 수령한 당일에 나라사랑통장을 해지한 경우에는 서비스가 제공되지 않음</p>` +
            `<p style="margin:0;">&nbsp;&nbsp;· 월 말일자에 군 급여를 수령한 경우에는 다음 달 1일 00시부터 04시까지는 서비스가 제공되지 않음</p>`,
    },
    {
        title: '서비스 제공 조건',
        content:
            `<p style="margin:0 0 6px;">· 본 서비스는 만 14세 이상 개인 고객을 대상으로 합니다.</p>` +
            `<p style="margin:0 0 6px;">· 카드 발급 후 익월 1일부터 서비스가 적용됩니다.</p>` +
            `<p style="margin:0 0 6px;">· 서비스 이용 중 카드 해지 시 해당 월 할인 혜택은 제공되지 않습니다.</p>` +
            `<p style="margin:0;">· 연회비 미납 등으로 카드 이용이 정지된 경우 서비스 혜택이 중단될 수 있습니다.</p>`,
    },
    {
        title: '유의사항',
        content:
            `<p style="margin:0 0 6px;">· <strong>해외에서 발생한 이용 실적은 할인 한도 산정에서 제외됩니다.</strong></p>` +
            `<p style="margin:0 0 6px;">· 통합 할인 혜택은 매월 청구 시 자동 적용됩니다.</p>` +
            `<p style="margin:0;">· 자세한 사항은 카드 상품 설명서를 참고하시거나 고객센터(1588-0000)로 문의하시기 바랍니다.</p>`,
    },
    {
        title: '분쟁 처리 안내',
        content:
            `<p style="margin:0 0 6px;">· 분쟁 발생 시 관련 법령 및 카드사 약관에 따라 처리됩니다.</p>` +
            `<p style="margin:0;">· 금융감독원 금융분쟁조정위원회를 통한 조정 신청이 가능합니다.</p>`,
    },
];

// ── HTML 빌더 함수 ────────────────────────────────────────────────────────────

// 화살표(chevron) SVG — 아래 방향 기본, JS에서 rotate(180deg)로 열림 표시
const CHEVRON_SVG = `<svg class="ia-chevron" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round" width="16" height="16"
     style="flex-shrink:0;transition:transform 0.25s ease;">
    <path d="m6 9 6 6 6-6"/>
</svg>`;

function buildItem(item: AccordionItem): string {
    return (
        `<div class="ia-item" data-open="0" style="border-bottom:1px solid #E5E7EB;">` +
            `<button type="button" class="ia-header" style="width:100%;display:flex;justify-content:space-between;align-items:center;padding:16px 20px;background:none;border:none;cursor:pointer;text-align:left;-webkit-tap-highlight-color:transparent;">` +
                `<span style="font-size:15px;font-weight:600;color:#1A1A2E;line-height:1.3;">${item.title}</span>` +
                CHEVRON_SVG +
            `</button>` +
            `<div class="ia-body" style="max-height:0;overflow:hidden;transition:max-height 0.3s ease;">` +
                `<div style="padding:4px 20px 20px;font-size:13px;color:#374151;line-height:1.7;">` +
                    item.content +
                `</div>` +
            `</div>` +
        `</div>`
    );
}

// ── 토글 인라인 스크립트 ─────────────────────────────────────────────────────
// data-accordion-inited guard: React StrictMode 이중 실행, ViewClient 스크립트 재실행 환경에서
// 이벤트 리스너가 중복 등록되지 않도록 보호.
// max-height 열림 값: '9999px' 고정값 사용 — 접힌 상태에서 scrollHeight가 0을 반환하는
// 브라우저 최적화 이슈 방지 (#224)
const ACCORDION_SCRIPT =
    `<script>` +
    `(function(){` +
        `var root=document.currentScript&&document.currentScript.closest('[data-spw-block]');` +
        `if(!root||root.getAttribute('data-accordion-inited')==='1')return;` +
        `root.setAttribute('data-accordion-inited','1');` +
        `root.querySelectorAll('.ia-header').forEach(function(btn){` +
            `btn.addEventListener('click',function(){` +
                `var item=btn.closest('.ia-item');` +
                `var body=item.querySelector('.ia-body');` +
                `var chev=btn.querySelector('.ia-chevron');` +
                `var open=item.getAttribute('data-open')==='1';` +
                `if(open){` +
                    `item.setAttribute('data-open','0');` +
                    `body.style.maxHeight='0';` +
                    `chev.style.transform='rotate(0deg)';` +
                `}else{` +
                    `item.setAttribute('data-open','1');` +
                    `body.style.maxHeight='9999px';` +
                    `chev.style.transform='rotate(180deg)';` +
                `}` +
            `});` +
        `});` +
        // 초기 상태: 첫 번째 헤더 click() — 클릭 핸들러 재사용으로 중복 제거
        `var firstHeader=root.querySelector('.ia-header');` +
        `if(firstHeader){firstHeader.click();}` +
    `})();` +
    `</script>`;

// ── 아코디언 전체 HTML 조립 ───────────────────────────────────────────────────

function buildAccordionHtml(items: AccordionItem[], componentId: string, extraStyle: string): string {
    // 항목 데이터를 JSON으로 직렬화 — InfoAccordionEditor가 이 속성을 읽어 편집 UI 렌더링
    const itemsJson = JSON.stringify(items).replace(/"/g, '&quot;');

    return (
        `<div data-component-id="${componentId}" data-spw-block data-accordion-items="${itemsJson}" ` +
        `style="font-family:${FONT_FAMILY};background:#fff;border-radius:20px;box-shadow:0 2px 16px rgba(0,70,164,0.07);${extraStyle}">` +
            // 상단 타이틀 헤더 — <a> 태그 필수: ContentBuilder #divLinkTool 진입점
            `<div style="padding:20px 20px 16px;text-align:center;border-bottom:2px solid #E5E7EB;">` +
                `<a href="#" style="text-decoration:none;">` +
                    `<h2 style="font-size:17px;font-weight:800;color:#1A1A2E;margin:0;display:inline-block;border-bottom:2px solid #1A1A2E;padding-bottom:3px;">이용안내</h2>` +
                `</a>` +
            `</div>` +
            items.map(buildItem).join('') +
            ACCORDION_SCRIPT +
        `</div>`
    );
}

// ── 3개 variant HTML ──────────────────────────────────────────────────────────

const INFO_ACCORDION_MOBILE_HTML     = buildAccordionHtml(DEFAULT_ITEMS, 'info-accordion-mobile',     '');
const INFO_ACCORDION_WEB_HTML        = buildAccordionHtml(DEFAULT_ITEMS, 'info-accordion-web',        'width:100%;box-sizing:border-box;');
const INFO_ACCORDION_RESPONSIVE_HTML = buildAccordionHtml(DEFAULT_ITEMS, 'info-accordion-responsive', 'width:100%;box-sizing:border-box;');

// ── DB 등록 ───────────────────────────────────────────────────────────────────

const VARIANTS = [
    {
        id: 'info-accordion-mobile',
        html: INFO_ACCORDION_MOBILE_HTML,
        viewMode: 'mobile' as const,
        label: '이용안내 아코디언',
        description: '이용안내·유의사항 토글 아코디언',
    },
    {
        id: 'info-accordion-web',
        html: INFO_ACCORDION_WEB_HTML,
        viewMode: 'web' as const,
        label: '이용안내 아코디언',
        description: '이용안내·유의사항 토글 아코디언',
    },
    {
        id: 'info-accordion-responsive',
        html: INFO_ACCORDION_RESPONSIVE_HTML,
        viewMode: 'responsive' as const,
        label: '이용안내 아코디언',
        description: '이용안내·유의사항 토글 아코디언',
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
                    preview:     '/assets/minimalist-blocks/preview/ibk-info-accordion.svg',
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
                componentThumbnail: '/assets/minimalist-blocks/preview/ibk-info-accordion.svg',
                data: {
                    id:          variant.id.replace(`-${variant.viewMode}`, ''),
                    label:       variant.label,
                    description: variant.description,
                    preview:     '/assets/minimalist-blocks/preview/ibk-info-accordion.svg',
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
