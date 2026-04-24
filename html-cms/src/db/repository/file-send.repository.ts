// ============================================================================
// FWK_CMS_FILE_SEND_HIS + FWK_CMS_SERVER_INSTANCE — Repository
// ============================================================================
// AS-IS 참조 테이블 — 최소 CRUD만 제공

import oracledb from 'oracledb';
import { getConnection, withTransaction } from '@/db/connection';
import type { FileSendHistory, ServerInstance, UseYn } from '@/db/types';
import {
    FILE_SEND_SELECT_BY_ID,
    FILE_SEND_INSERT,
    FILE_SEND_SELECT_BY_INSTANCE,
    FILE_SEND_UPSERT,
    FILE_SEND_SELECT_BY_PAGE,
} from '@/db/queries/file-send.sql';
import { SERVER_SELECT_BY_ID, SERVER_SELECT_LIST, SERVER_INSERT, SERVER_UPDATE_STATUS } from '@/db/queries/server.sql';

const OBJ = { outFormat: oracledb.OUT_FORMAT_OBJECT };

// ═══════════════════════════════════════════════
// 파일 전송 이력
// ═══════════════════════════════════════════════

/** 파일 전송 이력 단건 조회 */
export async function getFileSendById(instanceId: string, fileId: string): Promise<FileSendHistory | null> {
    const conn = await getConnection();
    try {
        const result = await conn.execute<FileSendHistory>(FILE_SEND_SELECT_BY_ID, { instanceId, fileId }, OBJ);
        return result.rows?.[0] ?? null;
    } finally {
        await conn.close();
    }
}

/** 파일 전송 이력 등록 */
export async function createFileSend(input: {
    instanceId: string;
    fileId: string;
    fileSize?: number;
    fileCrcValue?: string;
    lastModifierId: string;
}): Promise<void> {
    await withTransaction(async (conn) => {
        await conn.execute(FILE_SEND_INSERT, {
            instanceId: input.instanceId,
            fileId: input.fileId,
            fileSize: input.fileSize ?? null,
            fileCrcValue: input.fileCrcValue ?? null,
            lastModifierId: input.lastModifierId,
        });
    });
}

/** 파일 전송 이력 UPSERT — 재배포 시 UPDATE, 신규 시 INSERT */
export async function upsertFileSend(input: {
    instanceId: string;
    fileId: string;
    fileSize?: number;
    fileCrcValue?: string;
    lastModifierId: string;
}): Promise<void> {
    await withTransaction(async (conn) => {
        await conn.execute(FILE_SEND_UPSERT, {
            instanceId: input.instanceId,
            fileId: input.fileId,
            fileSize: input.fileSize ?? null,
            fileCrcValue: input.fileCrcValue ?? null,
            lastModifierId: input.lastModifierId,
        });
    });
}

/** 페이지별 전송 이력 목록 — FILE_ID 접두사로 조회 */
export async function getFileSendByPage(pageId: string): Promise<(FileSendHistory & { INSTANCE_NAME?: string })[]> {
    const conn = await getConnection();
    try {
        const result = await conn.execute<FileSendHistory & { INSTANCE_NAME?: string }>(
            FILE_SEND_SELECT_BY_PAGE,
            { fileIdPrefix: `${pageId.replace(/([%_\\])/g, '\\$1')}_v` },
            OBJ,
        );
        return result.rows ?? [];
    } finally {
        await conn.close();
    }
}

/** 인스턴스별 전송 이력 목록 */
export async function getFileSendByInstance(instanceId: string): Promise<FileSendHistory[]> {
    const conn = await getConnection();
    try {
        const result = await conn.execute<FileSendHistory>(FILE_SEND_SELECT_BY_INSTANCE, { instanceId }, OBJ);
        return result.rows ?? [];
    } finally {
        await conn.close();
    }
}

// ═══════════════════════════════════════════════
// 서버 인스턴스
// ═══════════════════════════════════════════════

/** 서버 인스턴스 단건 조회 */
export async function getServerById(instanceId: string): Promise<ServerInstance | null> {
    const conn = await getConnection();
    try {
        const result = await conn.execute<ServerInstance>(SERVER_SELECT_BY_ID, { instanceId }, OBJ);
        return result.rows?.[0] ?? null;
    } finally {
        await conn.close();
    }
}

/** 서버 인스턴스 목록 조회 */
export async function getServerList(aliveYn?: UseYn): Promise<ServerInstance[]> {
    const conn = await getConnection();
    try {
        const result = await conn.execute<ServerInstance>(SERVER_SELECT_LIST, { aliveYn: aliveYn ?? null }, OBJ);
        return result.rows ?? [];
    } finally {
        await conn.close();
    }
}

/** 서버 인스턴스 등록 */
export async function createServer(input: {
    instanceId: string;
    instanceName: string;
    instanceDesc?: string;
    instanceIp?: string;
    instancePort?: number;
    serverType?: string;
    lastModifierId: string;
}): Promise<void> {
    await withTransaction(async (conn) => {
        await conn.execute(SERVER_INSERT, {
            instanceId: input.instanceId,
            instanceName: input.instanceName,
            instanceDesc: input.instanceDesc ?? null,
            instanceIp: input.instanceIp ?? null,
            instancePort: input.instancePort ?? null,
            serverType: input.serverType ?? null,
            lastModifierId: input.lastModifierId,
        });
    });
}

/** 서버 상태 갱신 (생존 확인) */
export async function updateServerStatus(instanceId: string, aliveYn: UseYn, lastModifierId: string): Promise<void> {
    await withTransaction(async (conn) => {
        await conn.execute(SERVER_UPDATE_STATUS, { instanceId, aliveYn, lastModifierId });
    });
}
