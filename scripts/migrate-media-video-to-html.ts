// scripts/migrate-media-video-to-html.ts
// media-video 컴포넌트 순수 HTML 변환 + data-component-id 적용 (Issue #5 + #10)
// DB SPW_CMS_COMPONENT의 media-video-mobile / web / responsive DATA.html 필드 업데이트
// 실행: npx tsx scripts/migrate-media-video-to-html.ts

import 'dotenv/config';
import { getComponentById, updateComponent } from '../src/db/repository/component.repository';
import { closePool } from '../src/db/connection';

const FONT_FAMILY = "-apple-system,BlinkMacSystemFont,'Malgun Gothic',sans-serif";

function buildVideoContent(label: string): string {
    return (
        // 영상 제목 — <a> 태그로 래핑하여 ContentBuilder #divLinkTool 트리거 활성화
        // 한 번 클릭: #divLinkTool 열림 → "영상 URL 변경" 버튼 노출
        // 더블클릭: ContentBuilder 인라인 텍스트 편집
        `<a href="#" style="display:block;font-size:15px;font-weight:700;color:#1A1A2E;margin-bottom:10px;text-decoration:none;">${label}</a>` +
        // 16:9 비율 래퍼 — src="" 로 빈 상태 유지, 에디터에서 URL 입력 후 활성화
        `<div style="position:relative;width:100%;padding-top:56.25%;border-radius:14px;overflow:hidden;background:#000;">` +
            `<iframe src="" ` +
                `frameborder="0" ` +
                `allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ` +
                `allowfullscreen ` +
                `title="${label}" ` +
                `style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;">` +
            `</iframe>` +
        `</div>`
    );
}

// ── mobile variant ──────────────────────────────────────────────────────────
const MEDIA_VIDEO_MOBILE_HTML =
    `<div data-component-id="media-video-mobile" data-spw-block style="font-family:${FONT_FAMILY};background:#fff;padding:16px 20px 20px;">` +
        buildVideoContent('소개 영상') +
    `</div>`;

// ── web variant ─────────────────────────────────────────────────────────────
const MEDIA_VIDEO_WEB_HTML =
    `<div data-component-id="media-video-web" data-spw-block style="font-family:${FONT_FAMILY};background:#fff;padding:24px 32px 28px;max-width:1200px;margin:0 auto;">` +
        buildVideoContent('소개 영상') +
    `</div>`;

// ── responsive variant ──────────────────────────────────────────────────────
const MEDIA_VIDEO_RESPONSIVE_HTML =
    `<div data-component-id="media-video-responsive" data-spw-block style="font-family:${FONT_FAMILY};background:#fff;padding:16px 20px 20px;width:100%;box-sizing:border-box;">` +
        buildVideoContent('소개 영상') +
    `</div>`;

const VARIANTS = [
    { id: 'media-video-mobile',     html: MEDIA_VIDEO_MOBILE_HTML },
    { id: 'media-video-web',        html: MEDIA_VIDEO_WEB_HTML },
    { id: 'media-video-responsive', html: MEDIA_VIDEO_RESPONSIVE_HTML },
];

async function main() {
    for (const variant of VARIANTS) {
        const existing = await getComponentById(variant.id);
        if (!existing) {
            console.error(`❌ ${variant.id} — 찾을 수 없음`);
            continue;
        }
        await updateComponent({
            componentId:        variant.id,
            componentType:      existing.COMPONENT_TYPE,
            viewMode:           existing.VIEW_MODE,
            componentThumbnail: existing.COMPONENT_THUMBNAIL ?? undefined,
            data: { ...(existing.DATA ?? {}) as Record<string, unknown>, html: variant.html },
            lastModifierId: 'system',
        });
        console.log(`✅ ${variant.id} 완료`);
    }
    await closePool();
}

main().catch((err) => { console.error('실패:', err); process.exit(1); });
