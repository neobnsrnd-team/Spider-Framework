// src/db/repository/page-view-log.repository.ts
// 페이지 조회/클릭 로그 데이터 접근 레이어

import oracledb from 'oracledb';

import { getConnection, withTransaction } from '@/db/connection';
import type { ViewLogEventType } from '@/db/types';
import {
    VIEW_LOG_INSERT,
    VIEW_LOG_COUNT_BY_PAGE,
    VIEW_LOG_COUNT_BY_COMPONENT,
    VIEW_LOG_CLICK_COUNT_BY_PAGE,
    VIEW_LOG_VIEW_COUNTS_BY_PAGES,
    VIEW_LOG_CLICK_COUNTS_BY_PAGES,
} from '@/db/queries/page-view-log.sql';

const OBJ = { outFormat: oracledb.OUT_FORMAT_OBJECT };

/** 로그 INSERT — VIEW 또는 CLICK */
export async function insertViewLog(
    pageId: string,
    eventType: ViewLogEventType,
    componentId?: string | null,
): Promise<void> {
    await withTransaction(async (conn) => {
        await conn.execute(VIEW_LOG_INSERT, {
            pageId,
            componentId: componentId ?? null,
            eventType,
        });
    });
}

/** 페이지별 VIEW 건수 조회 */
export async function getViewCountByPage(pageId: string): Promise<number> {
    const conn = await getConnection();
    try {
        const result = await conn.execute<{ VIEW_COUNT: number }>(VIEW_LOG_COUNT_BY_PAGE, { pageId }, OBJ);
        return result.rows?.[0]?.VIEW_COUNT ?? 0;
    } finally {
        await conn.close();
    }
}

/** 페이지별 CLICK 총 건수 조회 */
export async function getClickCountByPage(pageId: string): Promise<number> {
    const conn = await getConnection();
    try {
        const result = await conn.execute<{ CLICK_COUNT: number }>(VIEW_LOG_CLICK_COUNT_BY_PAGE, { pageId }, OBJ);
        return result.rows?.[0]?.CLICK_COUNT ?? 0;
    } finally {
        await conn.close();
    }
}

/** 페이지 목록 VIEW 건수 일괄 조회 — N+1 방지 */
export async function getViewCountsByPages(pageIds: string[]): Promise<Map<string, number>> {
    if (pageIds.length === 0) return new Map();
    const conn = await getConnection();
    try {
        const binds = Object.fromEntries(pageIds.map((id, i) => [`pageId${i}`, id]));
        const result = await conn.execute<{ PAGE_ID: string; VIEW_COUNT: number }>(
            VIEW_LOG_VIEW_COUNTS_BY_PAGES(pageIds.length),
            binds,
            OBJ,
        );
        return new Map((result.rows ?? []).map((r) => [r.PAGE_ID, r.VIEW_COUNT]));
    } finally {
        await conn.close();
    }
}

/** 페이지 목록 CLICK 건수 일괄 조회 — N+1 방지 */
export async function getClickCountsByPages(pageIds: string[]): Promise<Map<string, number>> {
    if (pageIds.length === 0) return new Map();
    const conn = await getConnection();
    try {
        const binds = Object.fromEntries(pageIds.map((id, i) => [`pageId${i}`, id]));
        const result = await conn.execute<{ PAGE_ID: string; CLICK_COUNT: number }>(
            VIEW_LOG_CLICK_COUNTS_BY_PAGES(pageIds.length),
            binds,
            OBJ,
        );
        return new Map((result.rows ?? []).map((r) => [r.PAGE_ID, r.CLICK_COUNT]));
    } finally {
        await conn.close();
    }
}

/** 페이지별 컴포넌트 CLICK 집계 (클릭수 내림차순) */
export async function getClickCountByComponent(
    pageId: string,
): Promise<Array<{ COMPONENT_ID: string; CLICK_COUNT: number }>> {
    const conn = await getConnection();
    try {
        const result = await conn.execute<{ COMPONENT_ID: string; CLICK_COUNT: number }>(
            VIEW_LOG_COUNT_BY_COMPONENT,
            { pageId },
            OBJ,
        );
        return result.rows ?? [];
    } finally {
        await conn.close();
    }
}
