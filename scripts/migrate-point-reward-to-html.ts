// scripts/migrate-point-reward-to-html.ts
// 포인트·리워드 현황 컴포넌트 HTML 생성 및 DB 등록 (Issue #280)

import 'dotenv/config';
import { getComponentById, updateComponent, createComponent } from '../src/db/repository/component.repository';
import { closePool } from '../src/db/connection';

const FONT_FAMILY = "-apple-system,BlinkMacSystemFont,'Malgun Gothic','Apple SD Gothic Neo',sans-serif";
const THUMBNAIL = '/assets/minimalist-blocks/preview/ibk-point-reward.svg';

// ── 공통 내부 HTML 빌더 ──────────────────────────────────────────────────

function buildInnerHtml(): string {
    return (
        // 헤더
        `<div data-pr-header style="padding:16px 16px 8px;font-size:15px;font-weight:700;color:#1A1A2E;">` +
            `IBK 포인트` +
        `</div>` +

        // 가변 행 목록
        `<div data-pr-rows style="padding:0 16px;">` +

            `<div data-pr-row style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #F3F4F6;">` +
                `<span data-pr-label style="font-size:14px;color:#6B7280;">보유 포인트</span>` +
                `<span data-pr-value style="font-size:14px;font-weight:600;color:#1A1A2E;">12,500 P</span>` +
            `</div>` +

            `<div data-pr-row style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #F3F4F6;">` +
                `<span data-pr-label style="font-size:14px;color:#6B7280;">이번달 적립</span>` +
                `<span data-pr-value style="font-size:14px;font-weight:600;color:#1A1A2E;">1,200 P</span>` +
            `</div>` +

            `<div data-pr-row data-pr-expire style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;">` +
                `<span data-pr-label style="font-size:14px;color:#6B7280;">04.30 소멸 예정</span>` +
                `<span data-pr-value style="font-size:14px;font-weight:600;color:#E53E3E;">500 P</span>` +
            `</div>` +

        `</div>` +

        // 버튼 영역
        `<div style="display:flex;gap:8px;padding:12px 16px 16px;">` +
            `<a data-pr-btn="primary" href="#" style="flex:1;display:block;text-align:center;padding:10px 0;border-radius:8px;background:#0046A4;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;">현금 전환</a>` +
            `<a data-pr-btn="secondary" href="#" style="flex:1;display:block;text-align:center;padding:10px 0;border-radius:8px;background:#E8F0FC;color:#0046A4;font-size:14px;font-weight:600;text-decoration:none;">쇼핑 사용</a>` +
        `</div>`
    );
}

// ── variant별 HTML ────────────────────────────────────────────────────────

const MOBILE_HTML =
    `<div data-component-id="point-reward-mobile" data-spw-block` +
    ` style="font-family:${FONT_FAMILY};background:#ffffff;border-radius:12px;margin:0 16px;box-shadow:0 1px 4px rgba(0,0,0,0.08);">` +
        buildInnerHtml() +
    `</div>`;

const WEB_HTML =
    `<div data-component-id="point-reward-web" data-spw-block` +
    ` style="font-family:${FONT_FAMILY};background:#ffffff;border-radius:12px;max-width:480px;margin:0 auto;box-shadow:0 1px 4px rgba(0,0,0,0.08);">` +
        buildInnerHtml() +
    `</div>`;

const RESPONSIVE_HTML =
    `<div data-component-id="point-reward-responsive" data-spw-block` +
    ` style="font-family:${FONT_FAMILY};background:#ffffff;border-radius:12px;width:100%;box-sizing:border-box;box-shadow:0 1px 4px rgba(0,0,0,0.08);">` +
        buildInnerHtml() +
    `</div>`;

// ── variants 정의 ─────────────────────────────────────────────────────────

const VARIANTS = [
    {
        id: 'point-reward-mobile',
        html: MOBILE_HTML,
        viewMode: 'mobile' as const,
        label: '포인트·리워드 현황',
        description: '포인트 보유·적립·소멸 현황 및 전환·사용 버튼',
    },
    {
        id: 'point-reward-web',
        html: WEB_HTML,
        viewMode: 'web' as const,
        label: '포인트·리워드 현황',
        description: '포인트 보유·적립·소멸 현황 및 전환·사용 버튼',
    },
    {
        id: 'point-reward-responsive',
        html: RESPONSIVE_HTML,
        viewMode: 'responsive' as const,
        label: '포인트·리워드 현황',
        description: '포인트 보유·적립·소멸 현황 및 전환·사용 버튼',
    },
];

// ── 실행 ──────────────────────────────────────────────────────────────────

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
                    ...((existing.DATA ?? {}) as Record<string, unknown>),
                    html: variant.html,
                },
                lastModifierId: 'system',
            });
            process.stdout.write(`[업데이트] ${variant.id}\n`);
        } else {
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
            process.stdout.write(`[생성] ${variant.id}\n`);
        }
    }
    await closePool();
    process.stdout.write('완료\n');
}

main().catch((err: unknown) => {
    process.stderr.write(`실패: ${err}\n`);
    process.exit(1);
});
