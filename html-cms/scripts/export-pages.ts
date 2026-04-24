// scripts/export-pages.ts
// DB의 페이지 PAGE_DESC를 public/uploads/pages/{pageId}.html로 내보내기
// 실행: npx tsx scripts/export-pages.ts

// .env 파일 로드 (Next.js 외부 실행이므로 수동 로드 필요)
import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import fs from 'fs';
import path from 'path';
import { getPageList } from '../src/db/repository/page.repository';
import { closePool } from '../src/db/connection';

async function main() {
  const outDir = path.resolve(__dirname, '../public/uploads/pages');

  // 출력 폴더 확인/생성
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // USE_YN = 'Y' 페이지 전체 조회
  const { list } = await getPageList({ pageSize: 1000 });

  console.log(`DB 페이지 ${list.length}건 조회됨\n`);

  let exported = 0;
  let skipped = 0;

  for (const page of list) {
    const html = page.PAGE_DESC;
    if (!html) {
      console.log(`⏭ ${page.PAGE_ID} — PAGE_DESC 없음, 건너뜀`);
      skipped++;
      continue;
    }

    const filePath = path.join(outDir, `${page.PAGE_ID}.html`);
    fs.writeFileSync(filePath, html, 'utf-8');
    console.log(`✅ ${page.PAGE_ID} → ${page.PAGE_ID}.html (${html.length.toLocaleString()}자)`);
    exported++;
  }

  await closePool();
  console.log(`\n내보내기 완료: ${exported}건 저장, ${skipped}건 건너뜀`);
}

main().catch((err) => {
  console.error('내보내기 실패:', err);
  process.exit(1);
});
