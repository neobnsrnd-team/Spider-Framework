// src/lib/scheduler.ts
// 만료 페이지 배치 처리 — 내장 스케줄러와 HTTP 엔드포인트가 공유하는 비즈니스 로직
//
// ※ 주의: 이 파일의 최상위 import는 webpack 정적 추적 대상이 됩니다.
//    instrumentation.ts에서 dynamic import되므로, Node.js 전용 모듈(fs, path, oracledb 등)은
//    반드시 함수 내부에서 dynamic import하여 webpack 번들 포함을 방지합니다.

import { getErrorMessage } from '@/lib/api-response';
import { sendToServer, buildServerUrl } from '@/lib/deploy-utils';

// 중복 초기화 방지 플래그
let schedulerInitialized = false;

export interface ExpireJobResult {
    processed: number;
    failed: Array<{ pageId: string; error: string }>;
}

/** 만료 안내 페이지를 활성 운영 서버 전체에 배포 */
async function deployExpiredPage(pageId: string): Promise<void> {
    // Node.js 전용 모듈 — 함수 내부 dynamic import로 webpack 정적 추적 차단
    const { default: fs } = await import('fs/promises');
    const { default: path } = await import('path');
    const { getServerList, upsertFileSend } = await import('@/db/repository/file-send.repository');
    const { getLatestHistory } = await import('@/db/repository/page.repository');

    const EXPIRED_HTML_PATH = path.join(process.cwd(), 'public', 'system', 'page-expired.html');

    const servers = await getServerList('Y');
    if (servers.length === 0) return;

    const expiredHtml = await fs.readFile(EXPIRED_HTML_PATH, 'utf8');
    const latestHistory = await getLatestHistory(pageId);
    const version = latestHistory?.VERSION ?? 1;
    // 만료 전용 fileId — 정상 배포 이력 덮어쓰기 방지
    const fileId = `${pageId}_v${version}_expired.html`;
    const fileSize = Buffer.byteLength(expiredHtml, 'utf8');

    await Promise.all(
        servers.map(async (server) => {
            const serverUrl = buildServerUrl(server.INSTANCE_IP, server.INSTANCE_PORT, '/cms/api/deploy/receive');
            try {
                await sendToServer(serverUrl, pageId, expiredHtml);
                await upsertFileSend({
                    instanceId: server.INSTANCE_ID,
                    fileId,
                    fileSize,
                    lastModifierId: 'scheduler',
                });
            } catch (err: unknown) {
                console.warn(`[만료 스케줄러] 운영 서버 전송 실패 [${server.INSTANCE_ID}]:`, err);
            }
        }),
    );
}

/** 만료 페이지 일괄 처리 — route.ts와 내장 스케줄러가 공유 */
export async function runExpireJob(): Promise<ExpireJobResult> {
    // Node.js 전용 모듈 — 함수 내부 dynamic import로 webpack 정적 추적 차단
    const { getExpiredPages, expirePage } = await import('@/db/repository/page.repository');

    console.log('[만료 스케줄러] 실행 시작');

    const pages = await getExpiredPages();
    if (pages.length === 0) {
        console.log('[만료 스케줄러] 처리할 만료 페이지 없음');
        return { processed: 0, failed: [] };
    }

    const failed: Array<{ pageId: string; error: string }> = [];
    let processed = 0;

    // 순차 처리 — DB 커넥션 풀 고갈 방지
    for (const page of pages) {
        try {
            // a. 운영 서버 배포 먼저 — 배포 실패 시 DB 업데이트 건너뜀
            await deployExpiredPage(page.PAGE_ID);
            // b. 배포 성공 후 DB IS_PUBLIC = 'N' 업데이트
            await expirePage(page.PAGE_ID, page.FILE_PATH ?? '', 'scheduler');
            processed++;
        } catch (err: unknown) {
            failed.push({ pageId: page.PAGE_ID, error: getErrorMessage(err) });
        }
    }

    console.log(`[만료 스케줄러] 완료 — 처리: ${processed}, 실패: ${failed.length}`);
    return { processed, failed };
}

/** 내장 스케줄러 초기화 — 서버 시작 시 1회 실행 */
export async function initScheduler(): Promise<void> {
    if (schedulerInitialized) return;

    const cronText = process.env.SCHEDULER_CRON ?? '0 0 * * *'; // 기본: 매일 자정
    const enabled = process.env.ENABLE_INTERNAL_SCHEDULER !== 'false';

    if (!enabled) {
        console.log('[만료 스케줄러] ENABLE_INTERNAL_SCHEDULER=false — 내장 스케줄러 비활성화');
        return;
    }

    // node-cron은 서버 런타임에서만 동작하므로 dynamic import 사용
    const cron = await import('node-cron');

    if (!cron.validate(cronText)) {
        console.error(`[만료 스케줄러] 유효하지 않은 CRON 표현식: "${cronText}"`);
        return;
    }

    cron.schedule(cronText, async () => {
        try {
            await runExpireJob();
        } catch (err: unknown) {
            console.error('[만료 스케줄러] 실행 중 오류:', getErrorMessage(err));
        }
    });

    schedulerInitialized = true;
    console.log(`[만료 스케줄러] 초기화 완료 — cron: "${cronText}"`);
    console.warn(
        '[만료 스케줄러] 다중 인스턴스 환경에서는 하나의 인스턴스만 활성화하세요. (ENABLE_INTERNAL_SCHEDULER=false로 나머지 비활성화)',
    );
}
