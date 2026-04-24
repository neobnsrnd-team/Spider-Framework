// ============================================================================
// 시드 실행 진입점 — npx tsx src/db/seed/run-seed.ts
// ============================================================================

// .env 파일 로드 (Next.js 외부 실행이므로 수동 로드 필요)
import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import { seedBasicBlocks } from './seed-basic-blocks';
import { seedServerInstances } from './seed-server-instances';
import { closePool } from '@/db/connection';

async function main() {
    console.log('='.repeat(60));
    console.log('컴포넌트 데이터 시드 시작');
    console.log('='.repeat(60));

    // 1. 금융 컴포넌트 시드 (초기 시드 완료됨 — 재시드 필요 시 컴포넌트 배열을 직접 전달)
    console.log('\n── 금융 컴포넌트 시드 ──');
    console.log('금융 컴포넌트는 이미 DB에 시드 완료. 재시드가 필요하면 컴포넌트 배열을 전달하세요.');
    const finance = { inserted: 0, skipped: 0 };

    // 2. 기본 블록 시드
    console.log('\n── 기본 블록 시드 ──');
    const basic = await seedBasicBlocks();
    console.log(`\n기본 블록: ${basic.inserted}건 INSERT, ${basic.skipped}건 건너뜀`);

    // 3. 서버 인스턴스 시드
    console.log('\n── 서버 인스턴스 시드 ──');
    const servers = await seedServerInstances();
    console.log(`\n서버 인스턴스: ${servers.inserted}건 INSERT, ${servers.skipped}건 건너뜀`);

    // 결과 요약
    const totalInserted = finance.inserted + basic.inserted + servers.inserted;
    const totalSkipped = finance.skipped + basic.skipped + servers.skipped;
    console.log('\n' + '='.repeat(60));
    console.log(`시드 완료 — 총 ${totalInserted}건 INSERT, ${totalSkipped}건 건너뜀`);
    console.log('='.repeat(60));

    await closePool();
}

main().catch(async (err) => {
    console.error('시드 실패:', err);
    await closePool();
    process.exit(1);
});
