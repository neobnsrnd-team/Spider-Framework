# @neobnsrnd-team/reactive-springware

## 0.3.6

### Patch Changes

- 652e793: ## figma-plugin 컴포넌트 폴더 분기 및 Typography 리네임
  - `figma-plugin/src/components/` 평탄 구조 → `core` / `module/banking` / `module/common` / `layout` / `biz` 분기 (git mv 히스토리 보존)
  - `createBizComponents.ts` → 컴포넌트별 파일 6개로 분리
  - `createCard.ts`, `createTabNav.ts` async 버그 수정 후 `main.ts` 등록 (38개 → 40개)
  - `packages/component-library/core/Text` → `core/Typography` 리네임, `Text` alias 제거 및 전체 참조 통일
  - figma-plugin async 반환 타입 오기재 및 `await` 누락 일괄 수정

## 0.3.5

### Patch Changes

- d94cb11: \[docs] 전면 개편
  - README.md
  - setup-guide.md
  - rules/

  \[FEATURE] 컴포넌트 및 디자인 토큰 추가
  - 카드 도메인

## 0.3.4

### Patch Changes

- 8b61516: ## @neobnsrnd-team/reactive-springware 패키지 배포 설정 및 changesets 적용

  **`.github/workflows/publish.yml` — changesets/action 기반으로 변경 (버전 관리 + 배포 + Release 자동화)**
  - 패키지명 @reactive-springware/component-lib → @neobnsrnd-team/reactive-springware 전면 변경
  - `publish.yml` 워크플로우로 main 브랜치 push 시 GitHub Packages 자동 배포 추가
  - `package.json` `"private": true` 제거 + `publishConfig` GitHub Packages 레지스트리 추가
  - `README.md` `.npmrc`설정 추가 (토큰 발급 단계별 설명, 보안 주의사항)
  - `docs/setup-guide.md` 설치 방법 업데이트
  - `package.json` — `release` 스크립트 추가
  - `@changesets/cli` devDependency 추가
  - `.changeset/config.json` 생성 (changeset 설정)
