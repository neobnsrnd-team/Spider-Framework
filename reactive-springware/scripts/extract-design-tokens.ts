/**
 * @file extract-design-tokens.ts
 * @description design-tokens/figma-tokens/ 아래 JSON 파일을 파싱하여
 *   design-tokens.md 마크다운 파일로 변환한다.
 *
 *   semantic.json(공통 시맨틱 토큰)과 brand.hana.json(하나은행 브랜드 토큰)을 포함.
 *   Claude가 하드코딩 대신 CSS 변수를 사용하도록 유도하는 용도.
 *
 * @example
 *   npx tsx scripts/extract-design-tokens.ts
 */

import { readFileSync, mkdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const TOKENS_DIR = join(ROOT, 'design-tokens', 'figma-tokens');
const OUTPUT_DIR = join(ROOT, 'generated');
const OUTPUT_FILE = join(OUTPUT_DIR, 'design-tokens.md');

type TokenNode = {
  $type?: string;
  $value?: string | number;
  [key: string]: TokenNode | string | number | undefined;
};

/**
 * 중첩된 토큰 객체를 평탄화하여 { path: value } 형태로 변환.
 * $type / $value 키를 가진 노드가 실제 토큰 값.
 */
function flattenTokens(
  node: TokenNode,
  prefix: string = '',
  result: Record<string, string> = {}
): Record<string, string> {
  if (node.$type !== undefined && node.$value !== undefined) {
    result[prefix] = String(node.$value);
    return result;
  }

  for (const [key, value] of Object.entries(node)) {
    if (key.startsWith('$') || value === undefined) continue;
    const nextPrefix = prefix ? `${prefix}.${key}` : key;
    flattenTokens(value as TokenNode, nextPrefix, result);
  }

  return result;
}

/** 토큰 경로(dot 표기)를 CSS 변수명으로 변환. 예: color.brand.5 → --color-brand-5 */
function toCssVar(path: string): string {
  return '--' + path.replace(/\./g, '-');
}

/** JSON 파일을 읽어 파싱 */
function readJson(filePath: string): TokenNode {
  return JSON.parse(readFileSync(filePath, 'utf-8')) as TokenNode;
}

function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  const lines: string[] = [
    '# Design Tokens',
    '',
    '> 이 파일은 `scripts/extract-design-tokens.ts`로 자동 생성됩니다. 직접 수정하지 마세요.',
    '> Claude API system prompt에 포함되어 하드코딩 방지용 레퍼런스로 사용됩니다.',
    '',
    '## 사용 규칙',
    '',
    '- 색상·간격·타이포는 반드시 CSS 변수(`var(--*)`) 또는 Tailwind 토큰 클래스를 사용할 것',
    '- `#FFFFFF`, `16px` 같은 하드코딩 금지',
    '- 브랜드 컬러(`--color-brand-*`)는 prop으로 노출하지 말고 토큰으로 고정할 것',
    '',
  ];

  // ── Semantic 토큰 ──────────────────────────────────────────────
  const semantic = readJson(join(TOKENS_DIR, 'semantic.json'));
  const semanticFlat = flattenTokens(semantic);

  lines.push('## Semantic Tokens (공통 고정값)');
  lines.push('');
  lines.push('모든 은행 브랜드에서 공통으로 사용되는 시맨틱 컬러. 컴포넌트 내부에 직접 적용.');
  lines.push('');

  // 카테고리별(color, spacing, radius 등) 그룹핑
  const semanticGroups = new Map<string, string[]>();
  for (const [path, value] of Object.entries(semanticFlat)) {
    const group = path.split('.')[0];
    const list = semanticGroups.get(group) ?? [];
    list.push(`| \`${toCssVar(path)}\` | \`${value}\` |`);
    semanticGroups.set(group, list);
  }

  for (const [group, rows] of semanticGroups) {
    lines.push(`### ${group}`);
    lines.push('');
    lines.push('| CSS 변수 | 참조값 |');
    lines.push('|---------|--------|');
    lines.push(...rows);
    lines.push('');
  }

  // ── 하나은행 브랜드 토큰 ────────────────────────────────────────
  const hana = readJson(join(TOKENS_DIR, 'brand.hana.json'));
  const hanaFlat = flattenTokens(hana);

  lines.push('## Brand Tokens — hana (하나은행)');
  lines.push('');
  lines.push('브랜드별 가변 토큰. `data-brand="hana"` 속성으로 주입됨.');
  lines.push('컴포넌트 prop에 색상 값을 직접 전달하지 말 것.');
  lines.push('');
  lines.push('| CSS 변수 | 값 |');
  lines.push('|---------|-----|');

  for (const [path, value] of Object.entries(hanaFlat)) {
    lines.push(`| \`${toCssVar(path)}\` | \`${value}\` |`);
  }
  lines.push('');

  // ── Primitive 토큰 (참고용 요약) ────────────────────────────────
  const primitives = readJson(join(TOKENS_DIR, 'primitives.json'));
  const primFlat = flattenTokens(primitives);

  lines.push('## Primitive Tokens (참고용 — 직접 사용 금지)');
  lines.push('');
  lines.push('Semantic/Brand 토큰이 참조하는 원시값. 컴포넌트에서 직접 사용하지 말 것.');
  lines.push('');
  lines.push('| CSS 변수 | 값 |');
  lines.push('|---------|-----|');

  // primitive는 양이 많으므로 color만 포함
  for (const [path, value] of Object.entries(primFlat)) {
    if (path.startsWith('color') || path.startsWith('primitive')) {
      lines.push(`| \`${toCssVar(path)}\` | \`${value}\` |`);
    }
  }
  lines.push('');

  writeFileSync(OUTPUT_FILE, lines.join('\n'), 'utf-8');

  const tokenCount = Object.keys(semanticFlat).length + Object.keys(hanaFlat).length;
  console.log(`✅ design-tokens.md 생성 완료 (${tokenCount}개 토큰)`);
  console.log(`   출력: ${OUTPUT_FILE}`);
}

main();
