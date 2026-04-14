/**
 * @file extract-component-map.ts
 * @description docs/component-map.md를 읽어 generated/component-map.md로 복사한다.
 *
 *   component-map.md는 Figma → React 매핑 전략 문서로, 이미 최적화된 상태이므로
 *   별도 파싱 없이 그대로 generated/ 디렉토리에 배치한다.
 *
 * @example
 *   npx tsx scripts/extract-component-map.ts
 */

import { readFileSync, mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SOURCE = join(ROOT, 'docs', 'component-map.md');
const OUTPUT_DIR = join(ROOT, 'generated');
const OUTPUT_FILE = join(OUTPUT_DIR, 'component-map.md');

function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  const content = readFileSync(SOURCE, 'utf-8');

  // 자동 생성 헤더를 파일 상단에 삽입하여 출처를 명확히 함
  const header = [
    '<!-- 이 파일은 scripts/extract-component-map.ts로 자동 생성됩니다. 직접 수정하지 마세요. -->',
    '<!-- 원본: docs/component-map.md -->',
    '',
  ].join('\n');

  writeFileSync(OUTPUT_FILE, header + content, 'utf-8');

  const lines = content.split('\n').length;
  console.log(`✅ component-map.md 복사 완료 (${lines}줄)`);
  console.log(`   출력: ${OUTPUT_FILE}`);
}

main();
