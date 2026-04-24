// ============================================================================
// SPW_CMS_COMPONENT + SPW_CMS_COMP_PAGE_MAP — Repository
// ============================================================================

import oracledb from 'oracledb';
import { getConnection, withTransaction, clobBind } from '@/db/connection';
import type { CmsComponent, CmsComponentParsed, CmsCompPageMap, ComponentType, ViewMode } from '@/db/types';
import {
    COMPONENT_SELECT_BY_ID,
    COMPONENT_SELECT_LIST,
    COMPONENT_INSERT,
    COMPONENT_UPDATE,
    COMPONENT_DELETE,
} from '@/db/queries/component.sql';
import {
    COMP_MAP_SELECT_BY_PAGE,
    COMP_MAP_INSERT,
    COMP_MAP_DELETE,
    COMP_MAP_DELETE_BY_PAGE_VERSION,
} from '@/db/queries/component-map.sql';

const OBJ = { outFormat: oracledb.OUT_FORMAT_OBJECT };

/** DATA(CLOB string) → JSON 파싱 변환 (파싱 실패 시 null 반환) */
function parseComponentData(row: CmsComponent): CmsComponentParsed {
    let parsedData: Record<string, unknown> | null = null;
    if (row.DATA) {
        try {
            parsedData = JSON.parse(row.DATA);
        } catch (err: unknown) {
            console.error(`COMPONENT_ID ${row.COMPONENT_ID}의 DATA JSON 파싱 오류:`, err);
        }
    }
    return { ...row, DATA: parsedData };
}

// ═══════════════════════════════════════════════
// 컴포넌트 CRUD
// ═══════════════════════════════════════════════

/** 컴포넌트 단건 조회 (DATA JSON 파싱 포함) */
export async function getComponentById(componentId: string): Promise<CmsComponentParsed | null> {
    const conn = await getConnection();
    try {
        const result = await conn.execute<CmsComponent>(COMPONENT_SELECT_BY_ID, { componentId }, OBJ);
        const row = result.rows?.[0];
        return row ? parseComponentData(row) : null;
    } finally {
        await conn.close();
    }
}

/** 컴포넌트 목록 조회 (유형/뷰모드 필터, DATA JSON 파싱 포함) */
export async function getComponentList(options?: {
    componentType?: ComponentType;
    viewMode?: ViewMode;
}): Promise<CmsComponentParsed[]> {
    const conn = await getConnection();
    try {
        const result = await conn.execute<CmsComponent>(
            COMPONENT_SELECT_LIST,
            {
                componentType: options?.componentType ?? null,
                viewMode: options?.viewMode ?? null,
            },
            OBJ,
        );
        return (result.rows ?? []).map(parseComponentData);
    } finally {
        await conn.close();
    }
}

/** 컴포넌트 등록 (DATA는 JSON.stringify 후 CLOB 저장) */
export async function createComponent(input: {
    componentId: string;
    componentType: ComponentType;
    viewMode: ViewMode;
    componentThumbnail?: string;
    data?: Record<string, unknown>;
    createUserId: string;
    createUserName: string;
}): Promise<void> {
    await withTransaction(async (conn) => {
        await conn.execute(COMPONENT_INSERT, {
            componentId: input.componentId,
            componentType: input.componentType,
            viewMode: input.viewMode,
            componentThumbnail: input.componentThumbnail ?? null,
            data: input.data ? clobBind(JSON.stringify(input.data)) : null,
            createUserId: input.createUserId,
            createUserName: input.createUserName,
            lastModifierId: input.createUserId,
        });
    });
}

/** 컴포넌트 수정 */
export async function updateComponent(input: {
    componentId: string;
    componentType?: ComponentType;
    viewMode?: ViewMode;
    componentThumbnail?: string;
    data?: Record<string, unknown>;
    lastModifierId: string;
}): Promise<void> {
    await withTransaction(async (conn) => {
        await conn.execute(COMPONENT_UPDATE, {
            componentId: input.componentId,
            componentType: input.componentType ?? null,
            viewMode: input.viewMode ?? null,
            componentThumbnail: input.componentThumbnail ?? null,
            data: input.data ? clobBind(JSON.stringify(input.data)) : null,
            lastModifierId: input.lastModifierId,
        });
    });
}

/** 컴포넌트 논리 삭제 */
export async function deleteComponent(componentId: string, lastModifierId: string): Promise<void> {
    await withTransaction(async (conn) => {
        await conn.execute(COMPONENT_DELETE, { componentId, lastModifierId });
    });
}

// ═══════════════════════════════════════════════
// 컴포넌트-페이지 매핑 (W-5: VERSION 기반으로 변경)
// PK: (PAGE_ID, VERSION, SORT_ORDER)
// ═══════════════════════════════════════════════

/** 매핑 조회 — 페이지+버전별 (컴포넌트 정보 JOIN) */
export async function getMapByPage(
    pageId: string,
    version: number,
): Promise<
    (CmsCompPageMap & {
        COMPONENT_TYPE: ComponentType;
        VIEW_MODE: ViewMode;
        COMPONENT_THUMBNAIL: string | null;
    })[]
> {
    const conn = await getConnection();
    try {
        const result = await conn.execute(COMP_MAP_SELECT_BY_PAGE, { pageId, version }, OBJ);
        return (result.rows ?? []) as (CmsCompPageMap & {
            COMPONENT_TYPE: ComponentType;
            VIEW_MODE: ViewMode;
            COMPONENT_THUMBNAIL: string | null;
        })[];
    } finally {
        await conn.close();
    }
}

/** 매핑 추가 (단건, PK: PAGE_ID + VERSION + SORT_ORDER) */
export async function createMap(input: {
    pageId: string;
    version: number;
    sortOrder: number;
    componentId: string;
    lastModifierId: string;
}): Promise<void> {
    await withTransaction(async (conn) => {
        await conn.execute(COMP_MAP_INSERT, {
            pageId: input.pageId,
            version: input.version,
            sortOrder: input.sortOrder,
            componentId: input.componentId,
            lastModifierId: input.lastModifierId,
        });
    });
}

/** 매핑 전체 교체 — 승인 시 DELETE ALL + INSERT ALL (트랜잭션) */
export async function replaceAllMaps(input: {
    pageId: string;
    version: number;
    mappings: Array<{ componentId: string; sortOrder: number }>;
    lastModifierId: string;
}): Promise<void> {
    await withTransaction(async (conn) => {
        // 1. 해당 버전의 기존 매핑 전체 삭제
        await conn.execute(COMP_MAP_DELETE_BY_PAGE_VERSION, {
            pageId: input.pageId,
            version: input.version,
        });

        // 2. 새 매핑 순서대로 INSERT
        for (const mapping of input.mappings) {
            await conn.execute(COMP_MAP_INSERT, {
                pageId: input.pageId,
                version: input.version,
                sortOrder: mapping.sortOrder,
                componentId: mapping.componentId,
                lastModifierId: input.lastModifierId,
            });
        }
    });
}

/** 매핑 삭제 (단건, 복합 PK 기반) */
export async function deleteMap(pageId: string, version: number, sortOrder: number): Promise<void> {
    await withTransaction(async (conn) => {
        await conn.execute(COMP_MAP_DELETE, { pageId, version, sortOrder });
    });
}
