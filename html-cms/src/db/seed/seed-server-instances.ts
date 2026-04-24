// ============================================================================
// 서버 인스턴스 시드 — FWK_CMS_SERVER_INSTANCE 데모용 초기 데이터
// ============================================================================

import { getServerById, createServer } from '@/db/repository/file-send.repository';

interface ServerSeedItem {
    instanceId: string;
    instanceName: string;
    instanceDesc: string;
    instanceIp: string;
    instancePort: number;
    serverType: string;
}

// 데모 환경 서버 목록 — 실제 운영 전환 시 DB에서 IP/PORT만 변경
const DEMO_SERVERS: ServerSeedItem[] = [
    {
        instanceId: 'demo-local',
        instanceName: '데모 로컬 서버',
        instanceDesc: '데모 환경 — CMS 자기 자신에게 배포 (localhost:3000)',
        instanceIp: 'localhost',
        instancePort: 3000,
        serverType: 'WEB',
    },
];

export async function seedServerInstances(): Promise<{ inserted: number; skipped: number }> {
    let inserted = 0;
    let skipped = 0;

    for (const server of DEMO_SERVERS) {
        const existing = await getServerById(server.instanceId);
        if (existing) {
            console.log(`  건너뜀: ${server.instanceId} (이미 존재)`);
            skipped++;
            continue;
        }

        await createServer({
            instanceId: server.instanceId,
            instanceName: server.instanceName,
            instanceDesc: server.instanceDesc,
            instanceIp: server.instanceIp,
            instancePort: server.instancePort,
            serverType: server.serverType,
            lastModifierId: 'system',
        });
        console.log(`  INSERT: ${server.instanceId} (${server.instanceIp}:${server.instancePort})`);
        inserted++;
    }

    return { inserted, skipped };
}
