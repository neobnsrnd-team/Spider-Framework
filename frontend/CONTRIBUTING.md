# Contributing to Reactive Springware

이 문서는 **패키지 기여자·내부 개발자**를 위한 가이드입니다.
패키지 사용 방법은 [README.md](./README.md)를 확인하세요.

---

## 목차

1. [로컬 개발 환경 세팅](#1-로컬-개발-환경-세팅)
2. [빌드 명령어 레퍼런스](#2-빌드-명령어-레퍼런스)
3. [CI/CD 파이프라인](#3-cicd-파이프라인)
4. [릴리즈 절차 (Changesets)](#4-릴리즈-절차-changesets)
5. [코드 스타일 규칙](#5-코드-스타일-규칙)
6. [디자인 토큰 동기화 가이드](#6-디자인-토큰-동기화-가이드)

---

## 1. 로컬 개발 환경 세팅

### 사전 조건

| 항목 | 버전 |
|------|------|
| Node.js | 20.x 이상 |
| npm | 최신 버전 |

### 개발 서버 실행

```bash
npm ci               # 의존성 설치
npm run dev          # Vite 개발 서버 (demo/react-demo-app)
npm run storybook    # Storybook (포트 6006)
```

---

## 2. 빌드 명령어 레퍼런스

| 명령어 | 설명 |
|--------|------|
| `npm run build` | 라이브러리 빌드 (`vite.lib.config.js` 기준, ESM + `.d.ts` 타입 선언 출력) |
| `npm run build:all` | `build` → `build:manifest` → `extract:manifest` 순차 실행 |
| `npm run typecheck` | emit 없이 타입 검사만 수행 (`tsc --noEmit`) |
| `npm run lint` | ESLint 실행 (Flat Config, Storybook + React hooks 플러그인 포함) |

빌드 결과물은 `dist/` 폴더에 출력됩니다.

```
dist/
  index.js      ← ESM 번들
  index.css     ← Tailwind 유틸리티 + 디자인 토큰 번들
  index.d.ts    ← 타입 선언 (rollupTypes로 단일 파일 번들링)
```

---

## 3. CI/CD 파이프라인

`main` 브랜치에 push하면 아래 두 워크플로우가 병렬로 실행됩니다.

### publish.yml — 패키지 배포

| 항목 | 내용 |
|------|------|
| **트리거** | `main` push |
| **실행 순서** | checkout → Node.js 20 설정 → `npm ci` → `npm run build` → changesets/action |
| **출력** | GitHub Packages 배포 + GitHub Release 생성 (changeset 파일이 있는 경우) |
| **필요 권한** | `contents: write`, `packages: write`, `pull-requests: write` |

changesets/action이 하는 일:
- **changeset 파일이 있을 때**: "Version Packages" PR 자동 생성 (버전 업데이트 + CHANGELOG 갱신)
- **"Version Packages" PR 머지 후**: `npx changeset publish` 실행 → GitHub Packages 배포 + GitHub Release 생성

> **주의**: changeset 파일 없이 main에 push만 해도 배포되지 않습니다.  
> 반드시 `npx changeset`을 실행하여 `.changeset/*.md` 파일을 먼저 커밋해야 합니다.

### storybook.yml — Storybook 배포

| 항목 | 내용 |
|------|------|
| **트리거** | `main` push |
| **실행 순서** | checkout → Node.js 20 설정 → `npm ci` → `npm run build-storybook` → GitHub Pages 배포 |
| **출력** | GitHub Pages (Storybook 정적 사이트) |
| **필요 권한** | `pages: write`, `id-token: write` |
| **동시성 제어** | `cancel-in-progress: true` — 이전 배포 진행 중이면 자동 취소 |

---

## 4. 릴리즈 절차 (Changesets)

이 프로젝트는 [Changesets](https://github.com/changesets/changesets)으로 버전 관리와 배포를 자동화합니다.

```
기능 개발 완료
    ↓
npx changeset              # 변경 타입 선택 (major / minor / patch) + 변경 내용 입력
    ↓
.changeset/랜덤이름.md 생성 → 커밋 → main push
    ↓
GitHub Actions: "Version Packages" PR 자동 생성
(package.json 버전 업데이트 + CHANGELOG.md 갱신)
    ↓
PR 머지
    ↓
GitHub Actions: npx changeset publish 실행
    ↓
GitHub Packages 배포 + GitHub Release 생성
```

**버전 타입 선택 기준**

| 타입 | 상황 |
|------|------|
| `patch` | 버그 수정, 문서 수정 등 하위 호환 변경 |
| `minor` | 하위 호환 신규 기능 추가 |
| `major` | 기존 API 변경 등 하위 비호환 변경 |

> `.changeset/` 하위의 랜덤 파일명은 자동 생성되므로 변경하지 않습니다.

---

## 5. 코드 스타일 규칙

### Prettier

Prettier는 프로젝트 의존성이 아닙니다. `.prettierrc` 설정 파일만 제공하며, **IDE 확장(VS Code Prettier 확장 등)을 직접 설치**해야 적용됩니다.

> **VS Code**: [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) 확장 설치 후 자동으로 `.prettierrc`를 읽습니다.
>
> **IntelliJ**: Prettier가 전역 설치되어 있어야 합니다. `npm install -g prettier` 후 `Settings → Languages & Frameworks → JavaScript → Prettier`에서 Prettier package 경로를 지정하세요.

| 옵션 | 값 |
|------|-----|
| `printWidth` | `100` |
| `tabWidth` | `2` |
| `useTabs` | `false` |
| `semi` | `true` |
| `singleQuote` | `true` |
| `trailingComma` | `"all"` |
| `bracketSpacing` | `true` |
| `arrowParens` | `"always"` |
| `endOfLine` | `"lf"` |

### ESLint

Flat Config(`eslint.config.js`) 기반으로 아래 플러그인을 포함합니다.

| 플러그인 | 역할 |
|----------|------|
| `eslint-plugin-storybook` | Storybook stories 파일 규칙 |
| `eslint-plugin-react-hooks` | hooks 사용 규칙 (`rules-of-hooks`, `exhaustive-deps`) |
| `eslint-plugin-react-refresh` | HMR 호환성 검사 |

---

## 6. 디자인 토큰 동기화 가이드

### 계층 구조와 역할

**Figma Variables가 단일 진실 공급원입니다. `globals.css`는 직접 수정하지 않습니다.**

```
Figma Variables (단일 진실 공급원)
        ↓  Token Studio export → temp.json → Claude 변환
design-tokens/figma-tokens/*.json   ← 카테고리별 구조화 토큰
        ↓  Claude 변환
design-tokens/globals.css           ← 자동 생성 (직접 수정 금지)
        ↓  Tailwind import
React 컴포넌트

figma-plugin/src/tokens.ts          ← 플러그인 전용 (공통 시맨틱 토큰만)
        ↓  플러그인 "컴포넌트 생성"
Figma 캔버스 컴포넌트
```

| 계층 | 역할 | 직접 수정 |
|------|------|------|
| Figma Variables | 색상·간격·폰트의 단일 진실 공급원 | 디자이너가 수정 |
| `figma-tokens/*.json` | Token Studio export 구조화 파일. Claude가 globals.css 생성 시 참조 | Claude가 자동 생성 |
| `globals.css` | CSS 변수 정의. Tailwind @theme 포함 | 직접 수정 금지 |
| `tokens.ts` | 플러그인용 JS 상수. Figma 컴포넌트 생성·변수 바인딩에 사용 | 공통 시맨틱 토큰 추가 시만 수정 |

### 토큰 업데이트 방법

```
1. Figma에서 Tokens Studio 플러그인 실행
2. Export → Export to file (single JSON) → temp.json으로 저장
3. temp.json을 Claude에게 전달:
   "figma-tokens/*.json 업데이트하고 globals.css 재생성해줘"
4. Claude가 처리:
   ├─ temp.json → primitives / semantic / brand.* / domain.* 분배
   └─ figma-tokens/*.json → globals.css 변환
5. temp.json 삭제
```

자세한 내용은 `design-tokens/README.md`를 참고하세요.
