// ============================================================================
// SPW_CMS_ASSET + SPW_CMS_ASSET_PAGE_MAP — Repository
// ============================================================================

import oracledb from 'oracledb';

import { getConnection, withTransaction } from '@/db/connection';
import type { CmsAsset, AssetState } from '@/db/types';
import {
    ASSET_SELECT_BY_ID,
    ASSET_SELECT_LIST,
    ASSET_COUNT,
    ASSET_INSERT,
    ASSET_UPDATE_STATE,
    ASSET_UPDATE_PATH_URL,
    ASSET_DELETE,
    ASSET_HARD_DELETE,
    ASSET_MAP_SELECT_BY_PAGE,
    ASSET_MAP_INSERT,
    ASSET_MAP_DELETE_BY_ASSET,
    ASSET_MAP_DELETE_BY_PAGE_VERSION,
} from '@/db/queries/asset.sql';

const OBJ = { outFormat: oracledb.OUT_FORMAT_OBJECT };

// ═══════════════════════════════════════════════
// 에셋 CRUD
// ═══════════════════════════════════════════════

/** 에셋 단건 조회 */
export async function getAssetById(assetId: string): Promise<CmsAsset | null> {
    const conn = await getConnection();
    try {
        const result = await conn.execute<CmsAsset>(ASSET_SELECT_BY_ID, { assetId }, OBJ);
        return result.rows?.[0] ?? null;
    } finally {
        await conn.close();
    }
}

/** 에셋 목록 조회 (페이지네이션) */
export async function getAssetList(options?: {
    businessCategory?: string;
    assetState?: AssetState;
    search?: string;
    page?: number;
    pageSize?: number;
}): Promise<{ list: CmsAsset[]; totalCount: number }> {
    const page = options?.page ?? 1;
    const pageSize = options?.pageSize ?? 20;
    const startRow = (page - 1) * pageSize;
    const endRow = page * pageSize;

    const conn = await getConnection();
    try {
        const [listResult, countResult] = await Promise.all([
            conn.execute<CmsAsset>(
                ASSET_SELECT_LIST,
                {
                    businessCategory: options?.businessCategory ?? null,
                    assetState: options?.assetState ?? null,
                    search: options?.search?.trim() || null,
                    startRow,
                    endRow,
                },
                OBJ,
            ),
            conn.execute<{ TOTAL_COUNT: number }>(
                ASSET_COUNT,
                {
                    businessCategory: options?.businessCategory ?? null,
                    assetState: options?.assetState ?? null,
                    search: options?.search?.trim() || null,
                },
                OBJ,
            ),
        ]);

        return {
            list: listResult.rows ?? [],
            totalCount: countResult.rows?.[0]?.TOTAL_COUNT ?? 0,
        };
    } finally {
        await conn.close();
    }
}

/** 에셋 등록 (파일 메타데이터 INSERT) */
export async function createAsset(input: {
    assetId: string;
    assetName: string;
    businessCategory?: string;
    mimeType: string;
    fileSize: number;
    assetPath: string;
    assetUrl: string;
    assetDesc?: string;
    assetState?: AssetState;
    createUserId: string;
    createUserName: string;
}): Promise<void> {
    await withTransaction(async (conn) => {
        await conn.execute(ASSET_INSERT, {
            assetId: input.assetId,
            assetName: input.assetName,
            businessCategory: input.businessCategory ?? null,
            mimeType: input.mimeType,
            fileSize: input.fileSize,
            assetPath: input.assetPath,
            assetUrl: input.assetUrl,
            assetDesc: input.assetDesc ?? null,
            assetState: input.assetState ?? null,
            createUserId: input.createUserId,
            createUserName: input.createUserName,
            lastModifierId: input.createUserId,
            lastModifierName: input.createUserName,
        });
    });
}

/** 에셋 승인 상태 변경 */
export async function updateAssetState(
    assetId: string,
    assetState: AssetState,
    lastModifierId: string,
    lastModifierName: string,
): Promise<void> {
    await withTransaction(async (conn) => {
        await conn.execute(ASSET_UPDATE_STATE, { assetId, assetState, lastModifierId, lastModifierName });
    });
}

/** 에셋 파일 경로·URL 업데이트 (승인 후 파일 이동 시 사용) */
export async function updateAssetPathUrl(
    assetId: string,
    assetPath: string,
    assetUrl: string,
    lastModifierId: string,
    lastModifierName: string,
): Promise<void> {
    await withTransaction(async (conn) => {
        await conn.execute(ASSET_UPDATE_PATH_URL, {
            assetId,
            assetPath,
            assetUrl,
            lastModifierId,
            lastModifierName,
        });
    });
}

/** 에셋 논리 삭제 (APPROVED 상태용 — 페이지 참조 보존) */
export async function deleteAsset(assetId: string, lastModifierId: string, lastModifierName: string): Promise<void> {
    await withTransaction(async (conn) => {
        await conn.execute(ASSET_DELETE, {
            assetId,
            lastModifierId,
            lastModifierName,
        });
    });
}

/**
 * 에셋 물리 삭제 (WORK/PENDING/REJECTED 상태용 — DB row 완전 제거)
 * FK/orphan 방지를 위해 ASSET_PAGE_MAP 참조를 먼저 정리한 뒤 에셋 삭제 (같은 트랜잭션)
 */
export async function hardDeleteAsset(assetId: string): Promise<void> {
    await withTransaction(async (conn) => {
        await conn.execute(ASSET_MAP_DELETE_BY_ASSET, { assetId });
        await conn.execute(ASSET_HARD_DELETE, { assetId });
    });
}

// ═══════════════════════════════════════════════
// 에셋-페이지 매핑
// ═══════════════════════════════════════════════

/** 페이지 버전별 에셋 매핑 조회 */
export async function getAssetMapByPage(
    pageId: string,
    version: number,
): Promise<
    Array<{
        PAGE_ID: string;
        VERSION: number;
        ASSET_ID: string;
        ASSET_NAME: string;
        MIME_TYPE: string;
        FILE_SIZE: number | null;
    }>
> {
    const conn = await getConnection();
    try {
        const result = await conn.execute(ASSET_MAP_SELECT_BY_PAGE, { pageId, version }, OBJ);
        return (result.rows ?? []) as Array<{
            PAGE_ID: string;
            VERSION: number;
            ASSET_ID: string;
            ASSET_NAME: string;
            MIME_TYPE: string;
            FILE_SIZE: number | null;
        }>;
    } finally {
        await conn.close();
    }
}

/** 에셋-페이지 매핑 일괄 교체 (승인 시 사용 — HTML 파싱하여 asset URL 추출 후 호출) */
export async function replaceAssetMaps(input: { pageId: string; version: number; assetIds: string[] }): Promise<void> {
    await withTransaction(async (conn) => {
        // 1. 기존 매핑 삭제
        await conn.execute(ASSET_MAP_DELETE_BY_PAGE_VERSION, {
            pageId: input.pageId,
            version: input.version,
        });

        // 2. 새 매핑 INSERT
        for (const assetId of input.assetIds) {
            await conn.execute(ASSET_MAP_INSERT, {
                pageId: input.pageId,
                version: input.version,
                assetId,
            });
        }
    });
}
