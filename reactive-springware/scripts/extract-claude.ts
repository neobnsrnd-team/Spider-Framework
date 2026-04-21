/**
 * @file extract-claude.ts
 * @description docs/CLAUDE.md를 generated/ 디렉터리에 복사한다.
 *
 *   Claude API system prompt에 포함할 코드 생성 규칙 파일을 generated/로 내보낸다.
 *   docs/CLAUDE.md가 수정된 뒤 generate:prompts 스크립트 실행 시 함께 갱신된다.
 *
 * @example
 *   npx tsx scripts/extract-claude.ts
 */

import { readFileSync, mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT        = join(__dirname, '..');
const SOURCE_FILE = join(ROOT, 'docs', 'CLAUDE.md');
const OUTPUT_DIR  = join(ROOT, 'generated');
const OUTPUT_FILE = join(OUTPUT_DIR, 'CLAUDE.md');

function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  const content = readFileSync(SOURCE_FILE, 'utf-8');
  writeFileSync(OUTPUT_FILE, content, 'utf-8');

  console.log(`✅ CLAUDE.md 복사 완료`);
  console.log(`   출력: ${OUTPUT_FILE}`);
}

main();
