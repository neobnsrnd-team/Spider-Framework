// scripts/migrate-status-card-to-html.ts
// status-card 통합 현황 카드 DB 등록 + point-reward · loan-status 구버전 삭제 (Issue #285)

import 'dotenv/config';
import { getComponentById, updateComponent, createComponent, deleteComponent } from '../src/db/repository/component.repository';
import { closePool } from '../src/db/connection';

const FONT = "-apple-system,BlinkMacSystemFont,'Malgun Gothic','Apple SD Gothic Neo',sans-serif";
const THUMBNAIL = '/assets/minimalist-blocks/preview/ibk-status-card.svg';

// ── 공통 내부 HTML ────────────────────────────────────────────────────────

function buildInner(): string {
    return (
        // 헤더
        `<div data-sc-header style="padding:16px 16px 8px;">` +
            `<div data-sc-title style="font-size:15px;font-weight:700;color:#1A1A2E;margin-bottom:6px;">포인트·리워드 현황</div>` +
            `<span data-sc-badge data-sc-badge-visible="false" style="display:none;padding:2px 10px;border-radius:4px;background:#E8F0FC;color:#0046A4;font-size:12px;font-weight:600;">뱃지</span>` +
        `</div>` +

        // 행 목록
        `<div data-sc-rows style="padding:0 16px;">` +
            `<div data-sc-row data-sc-row-type="text" style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #F3F4F6;">` +
                `<span data-sc-label style="font-size:14px;color:#6B7280;">항목 1</span>` +
                `<span data-sc-value data-sc-value-color="#1A1A2E" style="font-size:14px;font-weight:600;color:#1A1A2E;">값 1</span>` +
            `</div>` +
            `<div data-sc-row data-sc-row-type="text" style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid #F3F4F6;">` +
                `<span data-sc-label style="font-size:14px;color:#6B7280;">항목 2</span>` +
                `<span data-sc-value data-sc-value-color="#1A1A2E" style="font-size:14px;font-weight:600;color:#1A1A2E;">값 2</span>` +
            `</div>` +
            `<div data-sc-row data-sc-row-type="progress" style="padding:10px 0;">` +
                `<div style="display:flex;justify-content:space-between;margin-bottom:6px;">` +
                    `<span data-sc-label style="font-size:14px;color:#6B7280;">진행률</span>` +
                    `<span data-sc-progress-pct data-sc-progress-color="#0046A4" style="font-size:14px;font-weight:600;color:#0046A4;">40%</span>` +
                `</div>` +
                `<div style="height:6px;border-radius:3px;background:#F3F4F6;">` +
                    `<div data-sc-progress-bar data-sc-progress-color="#0046A4" style="height:100%;border-radius:3px;background:#0046A4;width:40%;"></div>` +
                `</div>` +
            `</div>` +
        `</div>` +

        // 버튼
        `<div data-sc-buttons style="padding:12px 16px 16px;display:flex;gap:8px;">` +
            `<a data-sc-btn="primary" data-sc-btn-visible="true" href="#" style="flex:1;display:block;text-align:center;padding:10px 0;border-radius:8px;background:#0046A4;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;">확인하기</a>` +
            `<a data-sc-btn="secondary" data-sc-btn-visible="false" href="#" style="display:none;flex:1;text-align:center;padding:10px 0;border-radius:8px;border:1px solid #0046A4;color:#0046A4;font-size:14px;font-weight:600;text-decoration:none;">내역 보기</a>` +
        `</div>`
    );
}

// ── variant HTML ──────────────────────────────────────────────────────────

const MOBILE_HTML =
    `<div data-component-id="status-card-mobile" data-spw-block style="font-family:${FONT};background:#ffffff;border-radius:12px;margin:0 16px;box-shadow:0 1px 4px rgba(0,0,0,0.08);">${buildInner()}</div>`;

const WEB_HTML =
    `<div data-component-id="status-card-web" data-spw-block style="font-family:${FONT};background:#ffffff;border-radius:12px;max-width:480px;margin:0 auto;box-shadow:0 1px 4px rgba(0,0,0,0.08);">${buildInner()}</div>`;

const RESPONSIVE_HTML =
    `<div data-component-id="status-card-responsive" data-spw-block style="font-family:${FONT};background:#ffffff;border-radius:12px;width:100%;box-sizing:border-box;box-shadow:0 1px 4px rgba(0,0,0,0.08);">${buildInner()}</div>`;

const VARIANTS = [
    { id: 'status-card-mobile',     html: MOBILE_HTML,     viewMode: 'mobile'     as const },
    { id: 'status-card-web',        html: WEB_HTML,        viewMode: 'web'        as const },
    { id: 'status-card-responsive', html: RESPONSIVE_HTML, viewMode: 'responsive' as const },
];

// 삭제 대상 구버전 컴포넌트 ID
const DEPRECATED_IDS = [
    'point-reward-mobile', 'point-reward-web', 'point-reward-responsive',
    'loan-status-mobile',  'loan-status-web',  'loan-status-responsive',
];

// ── 실행 ──────────────────────────────────────────────────────────────────

async function main() {
    // 1. status-card INSERT / UPDATE
    for (const v of VARIANTS) {
        const existing = await getComponentById(v.id);
        if (existing) {
            await updateComponent({
                componentId:        v.id,
                componentType:      existing.COMPONENT_TYPE,
                viewMode:           existing.VIEW_MODE,
                componentThumbnail: existing.COMPONENT_THUMBNAIL ?? undefined,
                data: { ...((existing.DATA ?? {}) as Record<string, unknown>), html: v.html },
                lastModifierId: 'system',
            });
            process.stdout.write(`[업데이트] ${v.id}\n`);
        } else {
            await createComponent({
                componentId:        v.id,
                componentType:      'finance',
                viewMode:           v.viewMode,
                componentThumbnail: THUMBNAIL,
                data: {
                    id:          v.id.replace(`-${v.viewMode}`, ''),
                    label:       '현황 카드',
                    description: '제목·뱃지·텍스트/진행률 행·버튼 편집 가능한 범용 현황 카드',
                    preview:     THUMBNAIL,
                    html:        v.html,
                    viewMode:    v.viewMode,
                },
                createUserId:   'system',
                createUserName: '시스템',
            });
            process.stdout.write(`[생성] ${v.id}\n`);
        }
    }

    // 2. 구버전 컴포넌트 삭제 (point-reward · loan-status → status-card로 통합)
    for (const id of DEPRECATED_IDS) {
        const existing = await getComponentById(id);
        if (existing) {
            await deleteComponent(id, 'system');
            process.stdout.write(`[삭제] ${id}\n`);
        } else {
            process.stdout.write(`[없음] ${id}\n`);
        }
    }

    await closePool();
    process.stdout.write('완료\n');
}

main().catch((err: unknown) => {
    process.stderr.write(`실패: ${err}\n`);
    process.exit(1);
});
