// scripts/seed-pages.ts
// data/*.json 파일을 읽어 SPW_CMS_PAGE + SPW_CMS_PAGE_HISTORY에 시드 데이터 INSERT
// 실행: npx tsx scripts/seed-pages.ts

import fs from 'fs/promises';
import path from 'path';
import { createPage, getPageById } from '../src/db/repository/page.repository';
import { closePool } from '../src/db/connection';

// 은행 ID → 표시 이름 매핑
const BANK_NAME_MAP: Record<string, string> = {
    ibk: 'IBK 기업은행',
    kb: 'KB 국민은행',
    hana: '하나은행',
    shinhan: '신한은행',
    woori: '우리은행',
    nh: 'NH 농협은행',
};

async function main() {
    const dataDir = path.resolve(__dirname, '../backup/data');

    let files: string[];
    try {
        files = await fs.readdir(dataDir);
    } catch {
        console.error(`백업 디렉토리를 찾을 수 없습니다: ${dataDir}`);
        console.error('먼저 data/*.json을 backup/data/에 복사하세요.');
        process.exit(1);
    }

    const jsonFiles = files.filter((f) => f.endsWith('.json'));
    console.log(`시드 대상 파일: ${jsonFiles.length}개`);

    for (const file of jsonFiles) {
        const bankId = path.basename(file, '.json');
        const bankName = BANK_NAME_MAP[bankId] ?? bankId;

        // 이미 존재하는 페이지는 건너뜀
        const existing = await getPageById(bankId);
        if (existing) {
            console.log(`⏭ ${bankId} (${bankName}) — 이미 존재, 건너뜀`);
            continue;
        }

        const raw = await fs.readFile(path.join(dataDir, file), 'utf-8');
        const pageData = JSON.parse(raw);
        const html = pageData.content || '';

        await createPage({
            pageId: bankId,
            pageName: bankName,
            createUserId: 'system',
            createUserName: '시스템',
            pageDesc: html,
        });

        console.log(`✅ ${bankId} (${bankName}) — INSERT 완료`);
    }

    await closePool();
    console.log('\n시드 완료.');
}

main().catch((err) => {
    console.error('시드 실패:', err);
    process.exit(1);
});
