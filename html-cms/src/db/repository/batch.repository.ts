// ============================================================================
// FWK_BATCH_HIS — 배치 이력 Repository
// spider-admin 프레임워크 테이블에 배치 실행 결과를 기록
// ============================================================================

import { getConnection } from '@/db/connection';
import { BATCH_HIS_INSERT, BATCH_HIS_UPDATE } from '@/db/queries/batch.sql';

export type BatchResRtCode =
    | '0' // 시작
    | '1' // 성공
    | '9'; // 비정상 종료

const CMS_INSTANCE_ID = process.env.CMS_INSTANCE_ID ?? 'CMS-01';

/** 배치 실행 이력 등록 — 배치 시작 시 호출 */
export async function insertBatchHis(params: {
    batchAppId: string;
    batchDate: string;
    userId: string;
    resRtCode: BatchResRtCode;
}): Promise<void> {
    const conn = await getConnection();
    try {
        await conn.execute(
            BATCH_HIS_INSERT,
            {
                batchAppId: params.batchAppId,
                instanceId: CMS_INSTANCE_ID,
                batchDate: params.batchDate,
                resRtCode: params.resRtCode,
                userId: params.userId,
            },
            { autoCommit: true },
        );
    } finally {
        await conn.close();
    }
}

/** 배치 실행 이력 갱신 — 배치 완료/실패 시 호출 */
export async function updateBatchHis(params: {
    batchAppId: string;
    batchDate: string;
    userId: string;
    resRtCode: BatchResRtCode;
    errorCode?: string | null;
    errorReason?: string | null;
    recordCount?: number;
    executeCount?: number;
    successCount?: number;
    failCount?: number;
}): Promise<void> {
    const conn = await getConnection();
    try {
        await conn.execute(
            BATCH_HIS_UPDATE,
            {
                batchAppId: params.batchAppId,
                batchDate: params.batchDate,
                userId: params.userId,
                resRtCode: params.resRtCode,
                errorCode: params.errorCode ?? null,
                errorReason: params.errorReason ?? null,
                recordCount: params.recordCount ?? 0,
                executeCount: params.executeCount ?? 0,
                successCount: params.successCount ?? 0,
                failCount: params.failCount ?? 0,
            },
            { autoCommit: true },
        );
    } finally {
        await conn.close();
    }
}
