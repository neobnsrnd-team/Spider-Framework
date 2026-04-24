// src/app/api/batch/execute/route.ts
// spider-admin BatchExecService가 수동 실행·스케줄 실행 시 호출하는 엔드포인트
// basePath 우회: next.config.ts rewrites → /api/batch/execute → /cms/api/batch/execute

import { timingSafeEqual } from 'crypto';

import { NextRequest } from 'next/server';

import { insertBatchHis, updateBatchHis } from '@/db/repository/batch.repository';
import { successResponse, errorResponse, getErrorMessage } from '@/lib/api-response';
import { DEPLOY_SECRET } from '@/lib/env';
import { runExpireJob } from '@/lib/scheduler';

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

// spider-admin이 POST로 호출: { batchAppId, batchDate, userId }
export async function POST(req: NextRequest) {
    if (!isValidToken(req.headers.get('x-deploy-token'))) {
        return errorResponse('인증 토큰이 유효하지 않습니다.', 401);
    }

    const body = (await req.json()) as { batchAppId?: string; batchDate?: string; userId?: string };
    const { batchAppId, batchDate, userId } = body;

    if (!batchAppId || !batchDate || !userId) {
        return errorResponse('batchAppId, batchDate, userId가 필요합니다.', 400);
    }

    // 1. FWK_BATCH_HIS INSERT (시작)
    await insertBatchHis({ batchAppId, batchDate, userId, resRtCode: '0' });

    try {
        // 2. 만료 페이지 처리 실행
        const result = await runExpireJob();

        // 3. FWK_BATCH_HIS UPDATE (성공)
        await updateBatchHis({
            batchAppId,
            batchDate,
            userId,
            resRtCode: '1',
            recordCount: result.processed + result.failed.length,
            executeCount: result.processed + result.failed.length,
            successCount: result.processed,
            failCount: result.failed.length,
        });

        return successResponse({ message: '완료', ...result });
    } catch (err: unknown) {
        const errorMsg = getErrorMessage(err);

        // 4. FWK_BATCH_HIS UPDATE (비정상 종료)
        await updateBatchHis({
            batchAppId,
            batchDate,
            userId,
            resRtCode: '9',
            errorReason: errorMsg,
        });
        return errorResponse(errorMsg);
    }
}
