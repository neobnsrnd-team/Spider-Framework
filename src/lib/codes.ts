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
    const normalized = category?.trim() || CMS_ASSET_DEFAULT_CATEGORY;
    const codes = await getCmsAssetCategoryCodes();

    if (!codes.some((item) => item.code === normalized)) {
        throw new Error('유효하지 않은 이미지 카테고리입니다.');
    }

    return normalized;
}
