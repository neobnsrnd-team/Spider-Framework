// scripts/migrate-loan-status-to-html.ts
// 대출 현황 카드 컴포넌트 HTML 생성 및 DB 등록 (Issue #283)

import 'dotenv/config';
import { getComponentById, updateComponent, createComponent } from '../src/db/repository/component.repository';
import { closePool } from '../src/db/connection';

const FONT_FAMILY = "-apple-system,BlinkMacSystemFont,'Malgun Gothic','Apple SD Gothic Neo',sans-serif";
const THUMBNAIL = '/assets/minimalist-blocks/preview/ibk-loan-status.svg';

// ── 공통 내부 HTML 빌더 ──────────────────────────────────────────────────

function buildInnerHtml(): string {
    return (
        // 헤더 + 대출명 뱃지
        `<div data-ls-header style="padding:16px 16px 8px;">` +
            `<div style="font-size:15px;font-weight:700;color:#1A1A2E;margin-bottom:6px;">내 대출 현황</div>` +
            `<span data-ls-badge style="display:inline-block;padding:2px 10px;border-radius:4px;background:#E8F0FC;color:#0046A4;font-size:12px;font-weight:600;">IBK 신용대출</span>` +
        `</div>` +

        // 가변 행 목록
        `<div data-ls-rows style="padding:0 16px;">` +

            `<div data-ls-row style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #F3F4F6;">` +
                `<span data-ls-label style="font-size:14px;color:#6B7280;">대출 잔액</span>` +
                `<span data-ls-value style="font-size:14px;font-weight:600;color:#1A1A2E;">15,000,000 원</span>` +
            `</div>` +

            `<div data-ls-row style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #F3F4F6;">` +
                `<span data-ls-label style="font-size:14px;color:#6B7280;">월 상환액</span>` +
                `<span data-ls-value style="font-size:14px;font-weight:600;color:#1A1A2E;">350,000 원</span>` +
            `</div>` +

            `<div data-ls-row data-ls-due style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;">` +
                `<span data-ls-label style="font-size:14px;color:#6B7280;">다음 납부일</span>` +
                `<span data-ls-value style="font-size:14px;font-weight:600;color:#E53E3E;">05.15</span>` +
            `</div>` +

        `</div>` +

        // 버튼 영역
        `<div style="padding:12px 16px 16px;">` +
            `<a data-ls-btn href="#" style="display:block;text-align:center;padding:10px 0;border-radius:8px;background:#0046A4;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;">상환하기</a>` +
        `</div>`
    );
}

// ── variant별 HTML ────────────────────────────────────────────────────────

const MOBILE_HTML =
    `<div data-component-id="loan-status-mobile" data-spw-block` +
    ` style="font-family:${FONT_FAMILY};background:#ffffff;border-radius:12px;margin:0 16px;box-shadow:0 1px 4px rgba(0,0,0,0.08);">` +
        buildInnerHtml() +
    `</div>`;

const WEB_HTML =
    `<div data-component-id="loan-status-web" data-spw-block` +
    ` style="font-family:${FONT_FAMILY};background:#ffffff;border-radius:12px;max-width:480px;margin:0 auto;box-shadow:0 1px 4px rgba(0,0,0,0.08);">` +
        buildInnerHtml() +
    `</div>`;

const RESPONSIVE_HTML =
    `<div data-component-id="loan-status-responsive" data-spw-block` +
    ` style="font-family:${FONT_FAMILY};background:#ffffff;border-radius:12px;width:100%;box-sizing:border-box;box-shadow:0 1px 4px rgba(0,0,0,0.08);">` +
        buildInnerHtml() +
    `</div>`;

// ── variants 정의 ─────────────────────────────────────────────────────────

const VARIANTS = [
    {
        id: 'loan-status-mobile',
        html: MOBILE_HTML,
        viewMode: 'mobile' as const,
        label: '대출 현황 카드',
        description: '대출 잔액·월 상환액·납부일 현황 및 상환하기 버튼',
    },
    {
        id: 'loan-status-web',
        html: WEB_HTML,
        viewMode: 'web' as const,
        label: '대출 현황 카드',
        description: '대출 잔액·월 상환액·납부일 현황 및 상환하기 버튼',
    },
    {
        id: 'loan-status-responsive',
        html: RESPONSIVE_HTML,
        viewMode: 'responsive' as const,
        label: '대출 현황 카드',
        description: '대출 잔액·월 상환액·납부일 현황 및 상환하기 버튼',
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
