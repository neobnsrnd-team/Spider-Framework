// src/lib/codes.ts
// FWK_CODE common lookup helpers for server components and route handlers.

import 'server-only';

import { getConnection } from '@/db/connection';

import {
    CMS_ASSET_CATEGORY_GROUP_ID,
    CMS_ASSET_DEFAULT_CATEGORY,
    CMS_ASSET_CATEGORY_LABELS,
} from '@/lib/cms-asset-category';

export interface CodeItem {
    code: string;
    codeName: string;
    sortOrder: number;
}

export { CMS_ASSET_CATEGORY_GROUP_ID, CMS_ASSET_DEFAULT_CATEGORY, CMS_ASSET_CATEGORY_LABELS };

export async function getCodesByGroup(codeGroupId: string): Promise<CodeItem[]> {
    let connection;
    try {
        connection = await getConnection();
        const result = await connection.execute<[string, string, number]>(
            `SELECT CODE, CODE_NAME, SORT_ORDER
               FROM FWK_CODE
              WHERE CODE_GROUP_ID = :codeGroupId
                AND USE_YN = 'Y'
              ORDER BY SORT_ORDER ASC`,
            { codeGroupId },
            { outFormat: 4002 },
        );
        return (result.rows ?? []).map(([code, codeName, sortOrder]) => ({
            code,
            codeName,
            sortOrder,
        }));
    } catch {
        return [];
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch {
                // Ignore connection close failures.
            }
        }
    }
}

export async function getCmsAssetCategoryCodes(): Promise<CodeItem[]> {
    return getCodesByGroup(CMS_ASSET_CATEGORY_GROUP_ID);
}

export async function normalizeCmsAssetCategory(category?: string | null): Promise<string> {
    // Admin이 코드 목록 기반으로 선택한 값을 전송하므로 CMS에서 DB 재검증은 불필요하다.
    // DB 불안정 시 getCodesByGroup이 빈 배열을 반환해 COMMON을 포함한 모든 카테고리가 거부되는 문제 방지.
    return category?.trim() || CMS_ASSET_DEFAULT_CATEGORY;
}
