#!/usr/bin/env node
/**
 * @file init.mjs
 * @description rs-init CLI 스크립트.
 *
 * npm install 후 `npx rs-init` 으로 실행하면 아래 파일·폴더를 현재 프로젝트 루트(cwd)로 복사한다.
 *
 * 복사 결과:
 *   <project-root>/
 *     CLAUDE.md          ← docs/CLAUDE.md
 *     .claude.rules      ← .claude.rules  (Claude Code 자동 로드 위해 루트 필수)
 *     rs-rules/          ← rules/         (CLAUDE.md가 rs-rules/*.md 경로로 참조)
 *     rs-docs/
 *       component-map.md ← docs/component-map.md
 *       setup-guide.md   ← docs/setup-guide.md
 *     src/
 *       index.css        ← demo/react-demo-app/src/index.css  (Tailwind + 디자인 토큰 진입점)
 *
 * @example
 * npx rs-init
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, renameSync, statSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
/** 패키지 루트 (scripts/ 기준 한 단계 위) */
const pkgRoot = resolve(__dirname, '..');
const cwd     = process.cwd();

/**
 * 단일 파일을 복사한다.
 * @param {string} src        - 복사 원본 절대경로
 * @param {string} dest       - 복사 대상 절대경로
 * @param {string} label      - 로그 출력용 파일명
 */
function copyFile(src, dest, label) {
  if (!existsSync(src)) {
    console.error(`[rs-init] ${label} 파일을 찾을 수 없습니다.`);
    process.exit(1);
  }
  if (existsSync(dest)) {
    console.warn(`[rs-init] ${label}가 이미 존재합니다. 덮어씁니다...`);
  }
  mkdirSync(resolve(dest, '..'), { recursive: true }); // 상위 디렉터리 보장
  copyFileSync(src, dest);
  console.log(`[rs-init] ✔ ${label} 복사 완료`);
}

/**
 * 디렉터리를 재귀적으로 복사한다. (cpSync 대신 사용)
 * cpSync가 일부 Node.js 버전·환경에서 무음 종료되는 문제가 있어 수동 구현으로 대체.
 * @param {string} src  - 복사 원본 디렉터리 절대경로
 * @param {string} dest - 복사 대상 디렉터리 절대경로
 */
function copyDirRecursive(src, dest) {
  mkdirSync(dest, { recursive: true });
  for (const entry of readdirSync(src)) {
    const srcPath  = resolve(src, entry);
    const destPath = resolve(dest, entry);
    if (statSync(srcPath).isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
}

/**
 * 디렉터리를 복사한다.
 * @param {string} srcDir  - 패키지 내 원본 디렉터리명
 * @param {string} destDir - 프로젝트 루트 기준 대상 디렉터리명
 * @param {string} label   - 로그 출력용 이름
 */
function copyDir(srcDir, destDir, label) {
  const src  = resolve(pkgRoot, srcDir);
  const dest = resolve(cwd, destDir);

  if (!existsSync(src)) {
    console.error(`[rs-init] ${label} 폴더를 찾을 수 없습니다.`);
    process.exit(1);
  }
  if (existsSync(dest)) {
    console.warn(`[rs-init] ${label} 폴더가 이미 존재합니다. 덮어씁니다...`);
  }
  copyDirRecursive(src, dest);
  console.log(`[rs-init] ✔ ${label} 복사 완료`);
}

/** docs/CLAUDE.md → <project-root>/CLAUDE.md
 *  기존 CLAUDE.md가 있으면 덮어쓰지 않고 CLAUDE.md.bak으로 이름을 바꿔 보존한다. */
const claudeDest = resolve(cwd, 'CLAUDE.md');
if (existsSync(claudeDest)) {
  const bakPath = resolve(cwd, 'CLAUDE.md.bak');
  renameSync(claudeDest, bakPath);
  console.log('[rs-init] 기존 CLAUDE.md → CLAUDE.md.bak 으로 백업합니다.');
}
copyFile(resolve(pkgRoot, 'docs/CLAUDE.md'), claudeDest, 'CLAUDE.md');

/** docs/.claude.rules → <project-root>/.claude.rules (Claude Code가 루트에서만 자동 로드)
 *  기존 .claude.rules가 있으면 덮어쓰지 않고 .claude.rules.bak으로 이름을 바꿔 보존한다. */
const claudeRulesDest = resolve(cwd, '.claude.rules');
if (existsSync(claudeRulesDest)) {
  const bakPath = resolve(cwd, '.claude.rules.bak');
  renameSync(claudeRulesDest, bakPath);
  console.log('[rs-init] 기존 .claude.rules → .claude.rules.bak 으로 백업합니다.');
}
copyFile(resolve(pkgRoot, 'docs/.claude.rules'), claudeRulesDest, '.claude.rules');

/** rules/ → <project-root>/rs-rules/ */
copyDir('rules', 'rs-rules', 'rs-rules/');

/** docs/component-map.md → <project-root>/rs-docs/component-map.md */
copyFile(
  resolve(pkgRoot, 'docs/component-map.md'),
  resolve(cwd, 'rs-docs/component-map.md'),
  'rs-docs/component-map.md',
);

/** docs/setup-guide.md → <project-root>/rs-docs/setup-guide.md */
copyFile(
  resolve(pkgRoot, 'docs/setup-guide.md'),
  resolve(cwd, 'rs-docs/setup-guide.md'),
  'rs-docs/setup-guide.md',
);

/** demo/react-demo-app/src/index.css → <project-root>/src/index.css
 *  복사 시 모노레포 내부 경로인 @import '../../../design-tokens/globals.css' 를 주석 처리한다.
 *  해당 경로는 외부 프로젝트에 존재하지 않으며, 디자인 토큰은 dist/index.css에 이미 번들링되어 있다.
 *  기존 index.css가 있으면 덮어쓰지 않고 index.css.bak으로 이름을 바꿔 보존한다.
 *  패키지에 해당 파일이 없으면 경고만 출력하고 계속 진행한다. */
const indexCssSrc  = resolve(pkgRoot, 'demo/react-demo-app/src/index.css');
const indexCssDest = resolve(cwd, 'src/index.css');
if (!existsSync(indexCssSrc)) {
  console.warn('[rs-init] ⚠ src/index.css 파일을 패키지에서 찾지 못했습니다. 건너뜁니다.');
} else {
  if (existsSync(indexCssDest)) {
    const bakPath = resolve(cwd, 'src/index.css.bak');
    renameSync(indexCssDest, bakPath);
    console.log('[rs-init] 기존 src/index.css → src/index.css.bak 으로 백업합니다.');
  }
  mkdirSync(resolve(indexCssDest, '..'), { recursive: true });
  // 모노레포 내부 design-tokens 상대 경로를 주석 처리한다.
  // 외부 프로젝트에는 해당 경로가 존재하지 않으며, 디자인 토큰은 dist/index.css에 번들링되어 있다.
  const indexCssContent = readFileSync(indexCssSrc, 'utf8').replace(
    /^(@import\s+['"]\.\.\/\.\.\/\.\.\/design-tokens\/globals\.css['"]\s*;)/m,
    '/* [rs-init] 모노레포 내부 경로 — 외부 프로젝트에서는 dist/index.css에 번들링되어 있으므로 비활성화합니다.\n   $1 */',
  );
  writeFileSync(indexCssDest, indexCssContent, 'utf8');
  console.log('[rs-init] ✔ src/index.css 복사 완료 (design-tokens import 주석 처리됨)');
}

/** vite.config.{ts,js} 에 @tailwindcss/vite 플러그인 자동 등록.
 *  이미 등록되어 있으면 건너뛴다. */
injectTailwindPlugin();

// src/ 하위 CSS 파일에서 중복 Tailwind import를 자동 주석 처리.
// dist/index.css에 Tailwind가 이미 번들링되어 있으므로 중복 시 스타일이 깨진다.
commentOutDuplicateTailwindImports();

/** src/main.{tsx,jsx,ts,js} 또는 src/index.{tsx,jsx,ts,js} 에 CSS import 자동 주입.
 *  이미 import가 존재하면 건너뛴다. */
injectCssImports();

/** package.json에 storybook 스크립트 추가 + .storybook/ 설정 파일 생성.
 *  이미 존재하면 건너뛴다. */
setupStorybook();

/** .mcp.json에 Figma MCP 서버 설정을 추가한다.
 *  이미 설정되어 있으면 건너뛴다. */
setupFigmaMcp();

console.log('\n[rs-init] ✨ 초기화 완료. 이제 Reactive-Springware를 사용할 수 있습니다.');
console.log('\n[rs-init] 👉 Figma 연동을 위한 다음 단계를 완료하세요:');
console.log('[rs-init]   1. Claude Code를 재시작합니다. (MCP 설정은 시작 시점에 로드됩니다.)');
console.log('[rs-init]   2. Claude Code에서 /mcp 를 입력합니다.');
console.log('[rs-init]   3. figma 항목에서 Enter 를 눌러 인증을 시작합니다.');
console.log('[rs-init]   4. 브라우저에서 Figma 로그인 후 돌아옵니다.');
console.log('[rs-init]   5. figma 상태가 connected 로 바뀌면 Figma URL 입력이 가능합니다.');
console.log('\n[rs-init] 📖 상세 내용은 rs-docs/setup-guide.md 를 확인하세요.');

/**
 * 고객사 프로젝트의 진입 파일을 찾아 컴포넌트 라이브러리 CSS import를 주입한다.
 *
 * 주입 대상 import:
 *   import '@neobnsrnd-team/reactive-springware/dist/index.css';
 *
 * dist/index.css 안에 Tailwind 유틸리티 · 디자인 토큰 · 브랜드 변수가 모두 번들링되어 있으므로
 * 고객사 프로젝트에 Tailwind를 별도 설치·설정할 필요 없이 이 한 줄만으로 스타일이 적용된다.
 * (design-tokens/globals.css는 `@import "tailwindcss"`를 포함하므로 직접 import하면
 *  고객사 프로젝트에 Tailwind가 없을 경우 에러가 발생한다 — 절대 주입하지 않는다.)
 */
function injectCssImports() {
  /** 탐색할 진입 파일 후보 목록 (우선순위 순) */
  const candidates = [
    'src/main.tsx', 'src/main.jsx', 'src/main.ts', 'src/main.js',
    'src/index.tsx', 'src/index.jsx', 'src/index.ts', 'src/index.js',
  ];

  const entryFile = candidates.map(p => resolve(cwd, p)).find(existsSync);

  if (!entryFile) {
    console.warn('[rs-init] ⚠ 진입 파일(src/main.* 또는 src/index.*)을 찾지 못했습니다.');
    console.warn('[rs-init]   아래 한 줄을 진입 파일 상단에 직접 추가하세요:');
    console.warn("            import '@neobnsrnd-team/reactive-springware/dist/index.css';");
    return;
  }

  const PKG = '@neobnsrnd-team/reactive-springware';
  const CSS_IMPORT = `import '${PKG}/dist/index.css';`;

  let content = readFileSync(entryFile, 'utf8');

  if (content.includes(`${PKG}/dist/index.css`)) {
    console.log('[rs-init] CSS import가 이미 존재합니다. 건너뜁니다.');
    return;
  }

  writeFileSync(entryFile, CSS_IMPORT + '\n' + content, 'utf8');
  console.log(`[rs-init] ✔ CSS import 주입 완료 → ${entryFile.replace(cwd, '.')}`);
}

/**
 * 고객사 프로젝트의 vite.config.{ts,js}를 찾아 @tailwindcss/vite 플러그인을 자동 등록한다.
 *
 * design-tokens/globals.css는 `@import "tailwindcss"`를 사용하므로
 * Vite 빌드 파이프라인에 tailwindcss() 플러그인이 등록되어 있어야 스타일이 정상 처리된다.
 * @tailwindcss/vite는 패키지 설치 시 dependencies로 함께 설치되므로 별도 설치 불필요.
 *
 * 처리 방식:
 *   1) `import tailwindcss from '@tailwindcss/vite'` import 구문을 파일 상단에 추가
 *   2) plugins 배열 첫 번째 자리에 `tailwindcss()` 삽입
 *      - `plugins: [` 패턴을 찾아 바로 뒤에 삽입 (기존 플러그인 앞에 위치시켜 CSS 처리 우선순위 확보)
 */
function injectTailwindPlugin() {
  const candidates = ['vite.config.ts', 'vite.config.js', 'vite.config.mts', 'vite.config.mjs'];
  const configFile = candidates.map(p => resolve(cwd, p)).find(existsSync);

  if (!configFile) {
    console.warn('[rs-init] ⚠ vite.config 파일을 찾지 못했습니다.');
    console.warn('[rs-init]   vite.config.ts의 plugins 배열에 tailwindcss()를 직접 추가하세요:');
    console.warn("            import tailwindcss from '@tailwindcss/vite';");
    console.warn("            plugins: [tailwindcss(), ...]");
    return;
  }

  let content = readFileSync(configFile, 'utf8');

  if (content.includes('@tailwindcss/vite')) {
    console.log('[rs-init] tailwindcss 플러그인이 이미 등록되어 있습니다. 건너뜁니다.');
    return;
  }

  // import 구문 추가 — 기존 import 블록 마지막 줄 뒤에 삽입
  const importLine = "import tailwindcss from '@tailwindcss/vite';";
  const lastImportMatch = content.match(/^import .+$/gm);
  if (lastImportMatch) {
    const lastImport = lastImportMatch[lastImportMatch.length - 1];
    content = content.replace(lastImport, lastImport + '\n' + importLine);
  } else {
    // import 구문이 하나도 없으면 파일 맨 앞에 추가
    content = importLine + '\n' + content;
  }

  // plugins 배열 첫 번째 자리에 tailwindcss() 삽입
  // `plugins: [` 또는 `plugins: [\n` 패턴 모두 처리
  if (content.includes('plugins:')) {
    content = content.replace(/plugins\s*:\s*\[/, 'plugins: [tailwindcss(), ');
  } else {
    console.warn('[rs-init] ⚠ vite.config에서 plugins 배열을 찾지 못했습니다.');
    console.warn('[rs-init]   plugins 배열에 tailwindcss()를 직접 추가하세요.');
  }

  writeFileSync(configFile, content, 'utf8');
  console.log(`[rs-init] ✔ tailwindcss 플러그인 등록 완료 → ${configFile.replace(cwd, '.')}`);
}

/**
 * 고객사 프로젝트의 src/ 하위 CSS 파일을 재귀 탐색하여
 * `@import "tailwindcss"` 또는 `@import 'tailwindcss'` 구문을 주석 처리한다.
 *
 * dist/index.css에 Tailwind 유틸리티·테마가 이미 번들링되어 있으므로
 * 고객사 CSS에 Tailwind가 중복 import되면 preflight(CSS reset)가 중복 적용되어
 * 버튼 곡선·폰트 크기 등 컴포넌트 스타일이 덮어써지는 문제가 발생한다.
 *
 * 처리 대상 패턴 (변형 모두 포함):
 *   @import "tailwindcss";
 *   @import 'tailwindcss';
 *   @import "tailwindcss/preflight";  (preflight만 단독 import한 경우)
 */
function commentOutDuplicateTailwindImports() {
  const srcDir = resolve(cwd, 'src');
  if (!existsSync(srcDir)) return;

  /** CSS 파일을 재귀 탐색하여 경로 목록 반환 */
  function collectCssFiles(dir) {
    const files = [];
    for (const entry of readdirSync(dir)) {
      const fullPath = resolve(dir, entry);
      if (statSync(fullPath).isDirectory()) {
        files.push(...collectCssFiles(fullPath));
      } else if (entry.endsWith('.css')) {
        files.push(fullPath);
      }
    }
    return files;
  }

  // @import "tailwindcss" / @import 'tailwindcss' 및 preflight 단독 import 패턴
  const TAILWIND_IMPORT_RE = /^(\s*@import\s+['"]tailwindcss(?:\/preflight)?['"]\s*;)/gm;

  let totalCommented = 0;

  for (const cssFile of collectCssFiles(srcDir)) {
    let content = readFileSync(cssFile, 'utf8');

    // 이미 주석 처리된 줄은 건너뜀 (/* ... */ 안에 있는 패턴 무시)
    const updated = content.replace(TAILWIND_IMPORT_RE, (match) => {
      totalCommented++;
      return `/* [rs-init] Tailwind가 dist/index.css에 번들링되어 있으므로 중복 import를 비활성화합니다.\n   ${match.trim()} */`;
    });

    if (updated !== content) {
      writeFileSync(cssFile, updated, 'utf8');
      console.log(`[rs-init] ✔ Tailwind 중복 import 주석 처리 → ${cssFile.replace(cwd, '.')}`);
    }
  }

  if (totalCommented === 0) {
    console.log('[rs-init] Tailwind 중복 import 없음. 건너뜁니다.');
  }
}

/**
 * 고객사 프로젝트에 Storybook을 설정한다.
 *
 * 1) package.json에 storybook / build-storybook 스크립트 추가
 * 2) .storybook/main.ts 생성 — src/features/ 하위 stories 탐색, tailwindcss 플러그인 주입
 * 3) .storybook/preview.ts 생성 — dist/index.css import, 모바일 뷰포트, 브랜드 데코레이터
 *
 * @storybook/react-vite와 storybook 패키지는 이미 dependencies로 자동 설치되므로
 * 별도 `npx storybook init` 없이 `npm run storybook`으로 바로 실행 가능하다.
 */
function setupStorybook() {
  // ── 1) package.json 스크립트 추가 ─────────────────────────────
  const pkgPath = resolve(cwd, 'package.json');
  if (!existsSync(pkgPath)) {
    console.warn('[rs-init] ⚠ package.json을 찾지 못했습니다. Storybook 스크립트를 건너뜁니다.');
  } else {
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
    pkg.scripts = pkg.scripts ?? {};
    let scriptAdded = false;
    if (!pkg.scripts['rs-storybook']) {
      pkg.scripts['rs-storybook'] = 'storybook dev -p 6006';
      scriptAdded = true;
    }
    if (!pkg.scripts['build-rs-storybook']) {
      pkg.scripts['build-rs-storybook'] = 'storybook build';
      scriptAdded = true;
    }
    if (scriptAdded) {
      writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
      console.log('[rs-init] ✔ package.json에 storybook 스크립트 추가 완료');
    } else {
      console.log('[rs-init] storybook 스크립트가 이미 존재합니다. 건너뜁니다.');
    }
  }

  // ── 2) .storybook/main.ts ──────────────────────────────────────
  const storybookDir = resolve(cwd, '.storybook');
  mkdirSync(storybookDir, { recursive: true });

  const mainPath = resolve(storybookDir, 'main.ts');
  if (existsSync(mainPath)) {
    console.log('[rs-init] .storybook/main.ts가 이미 존재합니다. 건너뜁니다.');
  } else {
    writeFileSync(mainPath, `\
/**
 * @file .storybook/main.ts
 * @description Storybook 빌드 및 개발 서버 설정.
 *
 * Storybook 10: controls, actions, viewport, backgrounds 등 essentials 기능이 코어 내장.
 * viteFinal: @tailwindcss/vite 플러그인을 최우선 주입하여 CSS 변수 토큰이 정상 처리되도록 한다.
 *
 * stories 배열에 컴포넌트 라이브러리 패키지의 stories 경로를 포함한다.
 * createRequire로 패키지 루트를 동적으로 해석하므로 node_modules 위치에 무관하게 동작한다.
 */
import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
// 패키지 루트 — stories 경로 및 @lib alias 해석에 사용
const pkgDir = path.dirname(require.resolve('@neobnsrnd-team/reactive-springware/package.json'));

const config: StorybookConfig = {
  stories: [
    // 고객사 프로젝트의 feature 스토리
    '../src/**/*.stories.@(ts|tsx)',
    // 컴포넌트 라이브러리 스토리 — node_modules에서 직접 참조하여 항상 최신 상태 유지
    \`\${pkgDir}/packages/component-library/**/*.stories.@(ts|tsx)\`,
  ],

  /* Storybook 10: essentials이 코어 내장이므로 addons 불필요 */
  addons: [],

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  viteFinal: async (viteConfig) => {
    /* @tailwindcss/vite 플러그인을 최우선으로 주입 — CSS 변수 토큰 처리에 필수 */
    const { default: tailwindcss } = await import('@tailwindcss/vite');
    viteConfig.plugins = [tailwindcss(), ...(viteConfig.plugins ?? [])];

    viteConfig.resolve = viteConfig.resolve ?? {};
    viteConfig.resolve.alias = {
      ...(viteConfig.resolve.alias as Record<string, string> | undefined),
      /* 컴포넌트 내부의 @lib/cn 등 유틸리티 경로를 패키지의 lib/ 폴더로 연결 */
      '@lib': path.resolve(pkgDir, 'lib'),
    };

    /* React 중복 로드 방지 */
    viteConfig.resolve.dedupe = ['react', 'react-dom'];

    return viteConfig;
  },
};

export default config;
`, 'utf8');
    console.log('[rs-init] ✔ .storybook/main.ts 생성 완료');
  }

  // ── 3) .storybook/preview.ts ──────────────────────────────────
  const previewPath = resolve(storybookDir, 'preview.ts');
  if (existsSync(previewPath)) {
    console.log('[rs-init] .storybook/preview.ts가 이미 존재합니다. 건너뜁니다.');
  } else {
    writeFileSync(previewPath, `\
/**
 * @file .storybook/preview.ts
 * @description Storybook 전역 미리보기 설정.
 *
 * - 전역 CSS(Tailwind 유틸리티 + 디자인 토큰 + 브랜드 변수) 적용
 * - 기본 뷰포트: 모바일(390px)
 * - data-brand / data-domain 전역 데코레이터로 CSS 변수 활성화
 *
 * @example
 * // 스토리에서 특정 브랜드로 미리보기
 * export default {
 *   parameters: { brand: 'kb', domain: 'banking' },
 * } satisfies Meta;
 */
import '@neobnsrnd-team/reactive-springware/dist/index.css';
import type { Preview } from '@storybook/react';

const preview: Preview = {
  parameters: {
    /* 기본 뷰포트: 모바일(390px) 우선 */
    viewport: {
      viewports: {
        mobile:  { name: 'Mobile (390px)',  styles: { width: '390px',  height: '844px'  }, type: 'mobile'  },
        tablet:  { name: 'Tablet (768px)',  styles: { width: '768px',  height: '1024px' }, type: 'tablet'  },
        desktop: { name: 'Desktop (1280px)', styles: { width: '1280px', height: '800px'  }, type: 'desktop' },
      },
      defaultViewport: 'mobile',
    },

    backgrounds: {
      default: 'page',
      values: [
        { name: 'page',  value: '#f5f8f8' },
        { name: 'white', value: '#ffffff' },
        { name: 'dark',  value: '#1e293b' },
      ],
    },

    controls: { matchers: {}, sort: 'alpha' },
  },

  /**
   * 전역 데코레이터 — HTML 루트에 data-brand/data-domain 속성을 주입해
   * CSS 변수(--brand-primary 등)가 올바르게 cascade 되도록 한다.
   * 스토리 parameters.brand / parameters.domain 으로 재정의 가능.
   */
  decorators: [
    (Story, context) => {
      const brand  = (context.parameters['brand']  as string | undefined) ?? 'hana';
      const domain = (context.parameters['domain'] as string | undefined) ?? 'banking';

      document.documentElement.setAttribute('data-brand',  brand);
      document.documentElement.setAttribute('data-domain', domain);

      return Story();
    },
  ],
};

export default preview;
`, 'utf8');
    console.log('[rs-init] ✔ .storybook/preview.ts 생성 완료');
  }

  // ── 4) src/stories/Introduction.stories.tsx 생성 ──────────────
  // 스토리 파일이 하나도 없으면 Storybook이 실행되지 않는다.
  // 초기 프로젝트에서 바로 실행 가능하도록 소개 스토리를 하나 생성한다.
  const storiesDir = resolve(cwd, 'src/stories');
  const introPath  = resolve(storiesDir, 'ReactiveSpringware.stories.tsx');

  if (existsSync(introPath)) {
    console.log('[rs-init] src/stories/ReactiveSpringware.stories.tsx가 이미 존재합니다. 건너뜁니다.');
  } else {
    mkdirSync(storiesDir, { recursive: true });
    writeFileSync(introPath, `\
/**
 * @file Introduction.stories.tsx
 * @description Reactive Springware 컴포넌트 라이브러리 소개 스토리.
 *
 * rs-init이 자동 생성한 파일입니다.
 * Figma 화면 코드 생성 후에는 src/features/ 하위에 스토리 파일이 추가됩니다.
 */
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
  title: 'Introduction',
  parameters: { layout: 'fullscreen' },
} satisfies Meta;

export default meta;

export const GettingStarted: StoryObj = {
  render: () => (
    <div style={{ padding: '2rem', fontFamily: 'Noto Sans KR, sans-serif' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
        Reactive Springware
      </h1>
      <p style={{ color: '#475569', marginBottom: '1.5rem' }}>
        컴포넌트 라이브러리가 정상적으로 설치되었습니다.
      </p>
      <ul style={{ color: '#334155', lineHeight: 2 }}>
        <li>좌측 사이드바에서 사용 가능한 컴포넌트를 확인하세요.</li>
        <li>Figma 화면을 Claude에 입력하면 src/features/ 에 코드가 생성됩니다.</li>
        <li>생성된 화면의 스토리 파일도 자동으로 Storybook에 표시됩니다.</li>
      </ul>
    </div>
  ),
};
`, 'utf8');
    console.log('[rs-init] ✔ src/stories/ReactiveSpringware.stories.tsx 생성 완료');
  }
}

/**
 * 고객사 프로젝트의 .mcp.json에 Figma MCP 서버 설정을 추가한다.
 *
 * Claude Code가 Figma API를 통해 디자인 레이어 트리를 직접 읽으려면
 * Figma MCP 서버가 필요하다. MCP 없이 Figma URL만 주면 Claude는 디자인을
 * 추측해서 코드를 생성하므로 섹션 누락·불완전 구현이 발생할 수 있다.
 *
 * Figma 공식 원격 MCP 서버(HTTP transport)를 사용한다.
 * OAuth 기반이므로 PAT 발급·입력 없이 Claude Code에서 Figma URL을 처음 사용할 때
 * 브라우저 로그인 한 번으로 인증이 완료된다.
 *
 * 이미 .mcp.json에 'figma' 서버가 등록되어 있으면 건너뛴다.
 */
function setupFigmaMcp() {
  const mcpPath = resolve(cwd, '.mcp.json');

  // 기존 .mcp.json 읽기 — 없으면 빈 구조로 초기화
  let mcp = { mcpServers: {} };
  if (existsSync(mcpPath)) {
    try {
      mcp = JSON.parse(readFileSync(mcpPath, 'utf8'));
      mcp.mcpServers = mcp.mcpServers ?? {};
    } catch {
      // JSON 파싱 실패 시 기존 내용을 유지하지 않고 새로 작성
      console.warn('[rs-init] ⚠ .mcp.json 파싱 실패. 새로 작성합니다.');
      mcp = { mcpServers: {} };
    }
  }

  // 이미 figma MCP가 등록되어 있으면 건너뜀
  if (mcp.mcpServers['figma']) {
    console.log('[rs-init] Figma MCP가 이미 설정되어 있습니다. 건너뜁니다.');
    return;
  }

  // Figma 공식 원격 MCP 서버 — HTTP transport + OAuth 방식
  // PAT 발급·입력 불필요. Claude Code에서 Figma URL 첫 사용 시 브라우저 로그인으로 자동 인증.
  mcp.mcpServers['figma'] = {
    type: 'http',
    url: 'https://mcp.figma.com/mcp',
  };

  writeFileSync(mcpPath, JSON.stringify(mcp, null, 2) + '\n', 'utf8');
  console.log('[rs-init] ✔ Figma MCP 설정 완료 → .mcp.json');
  console.log('[rs-init] ⚠ Claude Code를 재시작해야 .mcp.json이 적용됩니다.');
  console.log('[rs-init]   재시작 후 Figma URL을 처음 입력하면 브라우저에서 Figma 로그인 창이 열립니다.');
}
