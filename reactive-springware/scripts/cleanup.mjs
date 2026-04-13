#!/usr/bin/env node
/**
 * @file cleanup.mjs
 * @description rs-cleanup CLI 스크립트.
 *
 * `npx rs-cleanup` 으로 실행하면 rs-init이 복사·생성한 파일·폴더를
 * 현재 프로젝트 루트(cwd)에서 삭제한다.
 *
 * 삭제 대상:
 *   CLAUDE.md
 *   .claude.rules
 *   rs-rules/
 *   rs-docs/
 *   .storybook/
 *   src/stories/
 *   package.json의 storybook, build-storybook 스크립트
 *
 * npm uninstall 전에 수동으로 실행한다.
 *
 * @example
 * npx rs-cleanup
 * npm uninstall @neobnsrnd-team/reactive-springware
 */
import { existsSync, rmSync, unlinkSync, readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const cwd = process.cwd();

/**
 * 단일 파일을 삭제한다.
 * @param {string} relPath - 프로젝트 루트 기준 상대경로
 */
function removeFile(relPath) {
  const target = resolve(cwd, relPath);
  if (!existsSync(target)) {
    console.log(`[rs-cleanup] ${relPath}가 존재하지 않습니다. 건너뜁니다.`);
    return;
  }
  unlinkSync(target);
  console.log(`[rs-cleanup] ✔ ${relPath} 삭제 완료`);
}

/**
 * 디렉터리를 삭제한다.
 * @param {string} relPath - 프로젝트 루트 기준 상대경로
 */
function removeDir(relPath) {
  const target = resolve(cwd, relPath);
  if (!existsSync(target)) {
    console.log(`[rs-cleanup] ${relPath}/ 폴더가 존재하지 않습니다. 건너뜁니다.`);
    return;
  }
  rmSync(target, { recursive: true, force: true });
  console.log(`[rs-cleanup] ✔ ${relPath}/ 삭제 완료`);
}

/**
 * package.json에서 rs-init이 추가한 Storybook 스크립트를 제거한다.
 * storybook, build-storybook 키만 삭제하며 나머지 스크립트는 보존한다.
 */
function removeStorybookScripts() {
  const pkgPath = resolve(cwd, 'package.json');
  if (!existsSync(pkgPath)) {
    console.log('[rs-cleanup] package.json이 존재하지 않습니다. 건너뜁니다.');
    return;
  }

  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  const scripts = pkg.scripts ?? {};

  // rs-init이 추가한 스크립트 값과 일치하는 경우에만 삭제
  // 사용자가 직접 수정한 값은 건드리지 않는다
  const RS_STORYBOOK      = 'storybook dev -p 6006';
  const RS_BUILD_STORYBOOK = 'storybook build';

  let changed = false;

  if (scripts['storybook'] === RS_STORYBOOK) {
    delete scripts['storybook'];
    changed = true;
  }
  if (scripts['build-storybook'] === RS_BUILD_STORYBOOK) {
    delete scripts['build-storybook'];
    changed = true;
  }

  if (changed) {
    pkg.scripts = scripts;
    writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
    console.log('[rs-cleanup] ✔ package.json에서 storybook 스크립트 제거 완료');
  } else {
    console.log('[rs-cleanup] package.json에 rs-init이 추가한 storybook 스크립트가 없습니다. 건너뜁니다.');
  }
}

removeFile('CLAUDE.md');
removeFile('.claude.rules');
removeDir('rs-rules');
removeDir('rs-docs');
removeDir('.storybook');
removeDir('src/stories');
removeStorybookScripts();

console.log('\n[rs-cleanup] 🧹 정리 완료. 이제 npm uninstall을 실행하세요.');
