// src/app/api/deploy/push/route.ts
import { createHash, timingSafeEqual } from 'crypto';
import { readFile, access } from 'fs/promises';
import path from 'path';

import { NextRequest } from 'next/server';
import oracledb from 'oracledb';

import { getConnection } from '@/db/connection';
import { PAGE_SELECT_BY_ID } from '@/db/queries/page.sql';
import { upsertFileSend, getServerList } from '@/db/repository/file-send.repository';
import { updatePageDeploy, getLatestHistory, getHistoryVersionByFilePath } from '@/db/repository/page.repository';
import type { CmsPage } from '@/db/types';
import { canWriteCms, getCurrentUser } from '@/lib/current-user';
import { errorResponse, getErrorMessage, successResponse } from '@/lib/api-response';
import { DEPLOY_SECRET } from '@/lib/env';
import { sendToServer, buildServerUrl } from '@/lib/deploy-utils';

const OBJ = { outFormat: oracledb.OUT_FORMAT_OBJECT };

const CMS_BASE_URL = process.env.CMS_BASE_URL || 'http://localhost:3000';
// Next.js basePath('/cms') 포함 — public/ 정적 파일·API 라우트 URL 기준
const CMS_PATH_PREFIX = process.env.NEXT_PUBLIC_CMS_BASE_PATH ?? '/cms';
const BASE = `${CMS_BASE_URL}${CMS_PATH_PREFIX}`;

/** 타이밍 공격 방지 토큰 비교 */
function isValidToken(token: string | null): boolean {
    if (!DEPLOY_SECRET || !token) return false;
    try {
        const expected = Buffer.from(DEPLOY_SECRET, 'utf8');
        const received = Buffer.from(token, 'utf8');
        if (expected.length !== received.length) return false;
        return timingSafeEqual(expected, received);
    } catch {
        return false;
    }
}

/** SHA-256 앞 16자리로 무결성 값 생성 */
function calcCrc(content: string): string {
    return createHash('sha256').update(content, 'utf8').digest('hex').slice(0, 16);
}

// 배포 HTML 렌더링에 필요한 레이아웃 CSS (globals.css 56~106행)
const LAYOUT_CSS = `
.is-container [data-cb-type] {
    display: block;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
}
.is-container .is-col:has(> [data-cb-type]),
.is-container .column:has(> [data-cb-type]),
.is-container [class*="col"]:has(> [data-cb-type]),
.is-container .column.spw-finance-col {
    padding-left: 0 !important;
    padding-right: 0 !important;
    width: 100% !important;
    max-width: 100% !important;
    flex: 0 0 100% !important;
}
.is-container .row {
    margin-left: 0 !important;
    margin-right: 0 !important;
}
`;

/** HTML 프래그먼트 → 완전한 HTML 문서로 조립 (CSS 인라인 + 경로 치환 + 트래커 포함) */
async function buildDeployHtml(fragment: string, pageId: string, pageName: string): Promise<string> {
    // 1. ContentBuilder 런타임 CSS 읽기 — public/runtime 사용 (standalone 빌드 환경 호환)
    let runtimeCss = '';
    try {
        const cssPath = path.join(process.cwd(), 'public', 'runtime', 'contentbuilder-runtime.css');
        runtimeCss = await readFile(cssPath, 'utf8');
    } catch {
        throw new Error('ContentBuilder 런타임 CSS를 찾을 수 없습니다. public/runtime/ 디렉토리를 확인해주세요.');
    }

    // 2. 에셋 경로 치환 — CMS 서버 절대 URL로 변환 (basePath 포함)
    // 선행 슬래시 유무·역슬래시(Windows), 큰따옴표·작은따옴표 모두 처리
    const html = fragment
        .replace(/src=(['"])\/?(assets|uploads)[\/\\]/g, `src=$1${BASE}/$2/`)
        .replace(/url\((['"]?)\/?(assets|uploads)[\/\\]/g, `url($1${BASE}/$2/`)
        .replace(/src=(['"])\/api\/assets\//g, `src=$1${BASE}/api/assets/`);

    // 3. 완전한 HTML 문서 조립 — 스크립트 URL에 basePath 반영
    return `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
    <title>${pageName}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>${runtimeCss}</style>
    <style>${LAYOUT_CSS}</style>
</head>
<body class="is-container">
${html}
    <script src="${BASE}/runtime/contentbuilder-runtime.min.js"></script>
    <script>
    // ContentBuilder 런타임 초기화 — 플러그인 동적 로드 + mount
    document.addEventListener('DOMContentLoaded', function() {
        if (typeof ContentBuilderRuntime === 'undefined') return;
        var base = '${BASE}';
        var pluginNames = [
            'logo-loop','click-counter','card-list','accordion','hero-animation',
            'animated-stats','timeline','before-after-slider','more-info','social-share',
            'pendulum','browser-mockup','hero-background','cta-buttons',
            'media-slider','media-grid','particle-constellation','vector-force',
            'aurora-glow','simple-stats','faq','callout-box','code','video-embed',
            'swiper-slider','exchange-board','loan-calculator'
        ];
        var plugins = {};
        pluginNames.forEach(function(name) {
            plugins[name] = {
                url: base + '/assets/plugins/' + name + '/index.js',
                css: base + '/assets/plugins/' + name + '/style.css'
            };
        });
        var runtime = new ContentBuilderRuntime({ plugins: plugins });
        runtime.init();

        // 인라인 스크립트 재실행 (dangerouslySetInnerHTML과 동일 이슈)
        // data-card-slide-inited 등 inited 가드 초기화 — 에디터에서 설정된 채 저장된 경우 대비
        document.querySelectorAll('[data-spw-block][data-card-slide-inited]').forEach(function(el) {
            el.removeAttribute('data-card-slide-inited');
        });
        document.querySelectorAll('[data-spw-block] script').forEach(function(oldScript) {
            var newScript = document.createElement('script');
            newScript.textContent = oldScript.textContent;
            oldScript.parentNode.replaceChild(newScript, oldScript);
        });

        // ── 금융 web 변형 컴포넌트 그리드 보장 ──────────────────────────────
        // inline script가 없는 web 변형은 스크립트 재실행으로 처리되지 않으므로 직접 적용
        // ContentBuilder가 inline style을 덮어쓴 경우도 여기서 복원됨

        // product-gallery-web: data-pg-grid flex-row 3열 그리드
        document.querySelectorAll('[data-pg-grid]').forEach(function(grid) {
            grid.style.cssText =
                'display:flex;flex-direction:row;flex-wrap:wrap;gap:12px;padding:4px 20px 20px;box-sizing:border-box;';
            Array.from(grid.children).forEach(function(card) {
                card.style.flex = '1';
                card.style.minWidth = '260px';
                card.style.boxSizing = 'border-box';
            });
        });

        // benefit-card-web / responsive: data-bc-container flex-row 그리드
        document.querySelectorAll('[data-component-id^="benefit-card"]').forEach(function(root) {
            var compId = root.getAttribute('data-component-id') || '';
            if (!compId.endsWith('-web') && !compId.endsWith('-responsive')) return;
            var container = root.querySelector('[data-bc-container]');
            if (!container) return;
            if (compId.endsWith('-web')) {
                // 외부 래퍼 max-width 제거 — 컨테이너 너비에 맞게 100% 채움
                root.style.maxWidth = '';
                root.style.margin = '0';
                root.style.width = '100%';
                root.style.boxSizing = 'border-box';
                container.style.cssText = 'display:flex;flex-direction:row;gap:12px;';
                Array.from(container.querySelectorAll(':scope > a')).forEach(function(card) {
                    card.style.flex = '1';
                    card.style.minWidth = '0';
                });
            } else {
                container.style.cssText = 'display:flex;flex-wrap:wrap;gap:12px;';
            }
        });

        // benefit-card-mobile: data-bc-track scroll-snap 슬라이더
        document.querySelectorAll('[data-bc-track]').forEach(function(track) {
            track.className = (track.className || '').replace(/\bflex(?:-col)?\b/g, '').trim();
            track.style.cssText =
                'display:flex;flex-direction:row;overflow-x:auto;scroll-snap-type:x mandatory;' +
                '-webkit-overflow-scrolling:touch;scrollbar-width:none;-ms-overflow-style:none;' +
                'gap:0;padding:4px 0 8px;';
            track.querySelectorAll('[data-bc-slide]').forEach(function(slide) {
                slide.style.cssText =
                    'flex-shrink:0;width:80%;scroll-snap-align:start;padding:0 8px;box-sizing:border-box;';
            });
        });

        // info-card-slide-web: SLIDE_SCRIPT가 grid를 적용한 경우 scroll-snap 슬라이더로 교정
        // (구버전 DB 레코드 대비 — 인라인 스크립트 재실행 이후 override)
        document.querySelectorAll('[data-component-id="info-card-slide-web"]').forEach(function(root) {
            // 외부 래퍼 max-width 제거 — 컨테이너 너비에 맞게 100% 채움
            root.style.maxWidth = '';
            root.style.margin = '0';
            root.style.width = '100%';
            root.style.boxSizing = 'border-box';
            var track = root.querySelector('[data-card-track]');
            if (!track) return;
            track.style.cssText =
                'display:flex;flex-direction:row;overflow-x:auto;scroll-snap-type:x proximity;' +
                '-webkit-overflow-scrolling:touch;scrollbar-width:none;-ms-overflow-style:none;' +
                'gap:20px;padding:12px 0 20px;scroll-padding:0 2%;';
            track.querySelectorAll('[data-card-item]').forEach(function(card) {
                card.style.flex = '0 0 min(480px,46vw)';
                card.style.width = 'min(480px,46vw)';
                card.style.maxWidth = '';
                card.style.minWidth = '0';
                card.style.scrollSnapAlign = 'start';
            });
        });
    });
    </script>
    <script src="${BASE}/cms-tracker.js" data-page-id="${pageId}" data-cms-url="${BASE}"></script>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
    try {
        // 인증 — x-deploy-token(서버 간 호출) 또는 세션 권한(브라우저 UI) 중 하나 통과
        const tokenValid = isValidToken(req.headers.get('x-deploy-token'));
        let userId: string;

        if (tokenValid) {
            // 서버 간 호출: 요청 바디에서 userId 수신
            const body = (await req.json()) as { pageId?: string; userId?: string };
            if (!body.userId || typeof body.userId !== 'string') {
                return errorResponse('서버 간 호출 시 userId가 필요합니다.', 400);
            }
            userId = body.userId;

            const { pageId } = body;
            return await processDeploy(pageId, userId);
        }

        // 브라우저 UI 호출: 세션 권한 체크
        const currentUser = await getCurrentUser();
        if (!canWriteCms(currentUser)) {
            return errorResponse('권한이 없습니다.', 401);
        }
        userId = currentUser.userId;

        const { pageId } = (await req.json()) as { pageId?: string };
        return await processDeploy(pageId, userId);
    } catch (err: unknown) {
        console.error('배포 요청 처리 실패:', err);
        return errorResponse(getErrorMessage(err));
    }
}

async function processDeploy(pageId: string | undefined, userId: string) {
    if (!pageId || typeof pageId !== 'string') {
        return errorResponse('pageId가 필요합니다.', 400);
    }

    // 1. 페이지 조회 — APPROVED 상태 확인
    const conn = await getConnection();
    let page: CmsPage | null = null;
    try {
        const result = await conn.execute<CmsPage>(PAGE_SELECT_BY_ID, { pageId }, OBJ);
        page = result.rows?.[0] ?? null;
    } finally {
        await conn.close();
    }

    if (!page) {
        return errorResponse('페이지를 찾을 수 없습니다.', 404);
    }
    if (page.APPROVE_STATE !== 'APPROVED') {
        return errorResponse('승인된 페이지만 배포할 수 있습니다.', 400);
    }

    // 2. HTML 읽기 — DB PAGE_HTML 우선, FILE_PATH 폴백
    let rawHtml = page.PAGE_HTML ?? null;
    if (!rawHtml && page.FILE_PATH) {
        const normalizedFilePath = page.FILE_PATH.replace(/^\//, '');
        if (normalizedFilePath.includes('..') || path.isAbsolute(normalizedFilePath)) {
            return errorResponse('유효하지 않은 파일 경로입니다.', 400);
        }
        const absolutePath = path.join(process.cwd(), 'public', normalizedFilePath);
        try {
            await access(absolutePath);
        } catch {
            return errorResponse(
                '페이지 HTML이 DB에 없고, 파일도 서버에 존재하지 않습니다. 에디터에서 저장 후 다시 시도해 주세요.',
                400,
            );
        }
        rawHtml = await readFile(absolutePath, 'utf8');
    }

    if (!rawHtml) {
        return errorResponse('배포할 HTML 콘텐츠가 없습니다.', 400);
    }

    // 프래그먼트 → 완전한 HTML 문서 조립 (CSS 인라인 + 경로 치환 + 트래커 포함)
    const pageName = page.PAGE_NAME ?? pageId;
    const html = await buildDeployHtml(rawHtml, pageId, pageName);
    const crcValue = calcCrc(html);

    // 트래커 JS 파일 읽기 (운영 서버로 함께 Push)
    const trackerJsPath = path.join(process.cwd(), 'public', 'cms-tracker.js');
    let trackerJs: string | null = null;
    try {
        trackerJs = await readFile(trackerJsPath, 'utf8');
    } catch {
        console.warn('cms-tracker.js 파일을 찾을 수 없습니다. 트래커 없이 배포합니다.');
    }

    // 3. ALIVE_YN='Y' 서버 목록 조회
    const servers = await getServerList('Y');
    if (servers.length === 0) {
        return errorResponse('활성화된 배포 서버가 없습니다.', 400);
    }

    // 4. 현재 FILE_PATH에 해당하는 HISTORY VERSION 조회 (롤백 대응)
    const historyVersion = page.FILE_PATH ? await getHistoryVersionByFilePath(pageId, page.FILE_PATH) : null;
    const latestHistory = await getLatestHistory(pageId);
    const version = historyVersion ?? latestHistory?.VERSION ?? 1;
    const fileId = `${pageId}_v${version}.html`;

    // 5. 각 서버에 병렬 전송 + 이력 기록
    const results = await Promise.all(
        servers.map(async (server) => {
            const serverUrl = buildServerUrl(server.INSTANCE_IP, server.INSTANCE_PORT, '/cms/api/deploy/receive');
            try {
                await sendToServer(serverUrl, pageId, html, trackerJs);
                await upsertFileSend({
                    instanceId: server.INSTANCE_ID,
                    fileId,
                    fileSize: Buffer.byteLength(html, 'utf8'),
                    fileCrcValue: crcValue,
                    lastModifierId: userId,
                });
                return { instanceId: server.INSTANCE_ID, success: true as const };
            } catch (err: unknown) {
                console.error(`서버 전송 실패 [${server.INSTANCE_ID}]:`, err);
                return { instanceId: server.INSTANCE_ID, success: false as const, error: getErrorMessage(err) };
            }
        }),
    );

    // 6. 하나 이상 성공 시 페이지 배포 기록 갱신
    const successCount = results.filter((r) => r.success).length;
    if (successCount > 0) {
        await updatePageDeploy(pageId, crcValue, userId);
    }

    return successResponse({
        fileId,
        crcValue,
        successCount,
        failCount: results.length - successCount,
        results,
    });
}
