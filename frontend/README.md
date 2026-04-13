# Reactive Springware

**Figma 디자인 URL을 Claude Code에 입력하면 React 화면 코드를 자동 생성하는 AI 개발 워크플로우**

금융 앱 특화 컴포넌트 라이브러리 + Claude 규칙 파일 세트로 구성되어 있으며,
설치 한 번으로 일관된 품질의 화면을 빠르게 만들 수 있습니다.

---

## 목차

- [어떻게 동작하나요?](#어떻게-동작하나요)
- [주요 기능](#주요-기능)
- [빠른 시작](#빠른-시작)
  - [사전 준비 — GitHub 인증 설정](#사전-준비--github-인증-설정)
  - [설치 및 초기화](#설치-및-초기화)
- [설치 후 바로 할 수 있는 것](#설치-후-바로-할-수-있는-것)
- [패키지 제거](#패키지-제거)
- [더 자세한 정보](#더-자세한-정보)

---

## 어떻게 동작하나요?

```
Figma URL + API 정보
        ↓
   Claude Code
        ↓
  React 코드 자동 생성
  (page / hook / repository / types)
```

Claude는 설치 시 함께 세팅되는 규칙 파일을 읽고, 컴포넌트 라이브러리만 사용하여
구조화된 코드를 생성합니다. HTML 태그 직접 사용, 하드코딩, 계층 혼용은 규칙이 자동으로 차단합니다.

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| 컴포넌트 라이브러리 | 금융 앱 특화 UI 컴포넌트 (Button, Card, Input, Layout 등) |
| Claude 규칙 자동 세팅 | `rs-init` 한 번으로 CLAUDE.md + 규칙 11개 자동 설치 |
| Tailwind 자동 설정 | 플러그인 등록·중복 import 제거·CSS 주입 자동 처리 |
| Figma MCP 연동 | `.mcp.json` 자동 생성 → Claude Code 재시작 → Figma 로그인 한 번으로 연동 완료 |
| Storybook 자동 세팅 | `rs-init` 실행만으로 컴포넌트 브라우저 즉시 실행 가능 |

---

## 빠른 시작

### 사전 준비 — GitHub 인증 설정

이 패키지는 GitHub Packages에 배포되어 있습니다.
GitHub Packages는 GitHub 계정으로 인증한 사용자만 패키지를 설치할 수 있어, 아래 설정이 필요합니다. (최초 1회)

**1. GitHub Personal Access Token 발급**

토큰은 "내 GitHub 계정으로 패키지를 다운로드하겠다"는 인증 수단입니다.

1. [github.com/settings/tokens/new](https://github.com/settings/tokens/new) 접속
2. **Note**: 토큰 이름 입력 (예: `reactive-springware`)
3. **Expiration**: 만료 기간 설정
4. **Select scopes**: `read:packages` 체크
5. 하단 **Generate token** 클릭
6. 생성된 토큰 값 복사 (`ghp_` 로 시작하는 문자열) — **페이지를 벗어나면 다시 볼 수 없으니 반드시 복사**

**2. `.npmrc` 파일 생성**

`.npmrc`는 npm이 패키지를 어디서, 어떤 인증으로 받아올지 지정하는 설정 파일입니다.
프로젝트 루트에 `.npmrc` 파일을 생성하고 아래 내용을 붙여넣습니다.
`YOUR_GITHUB_TOKEN` 자리에 1번에서 복사한 토큰을 입력합니다.

```
@neobnsrnd-team:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

> **주의**: `.npmrc`에 토큰이 포함되어 있으므로 `.gitignore`에 `.npmrc`를 추가해 git에 커밋되지 않도록 하세요.

### 설치 및 초기화

```bash
# 1. 패키지 설치
npm install @neobnsrnd-team/reactive-springware

# 2. 프로젝트 초기화 (규칙 파일·Tailwind·Storybook·Figma MCP 자동 설정)
npx rs-init

# 3. Claude Code 재시작

# 4. /mcp 입력 → figma 항목 Enter → 브라우저 Figma 로그인

# 5. figma connected 확인 후 Figma URL 입력 가능
```

초기화 상세 내용은 `rs-docs/setup-guide.md`를 확인하세요.

---

## 설치 후 바로 할 수 있는 것

```bash
# 컴포넌트 UI 브라우저 실행
npm run rs-storybook

# Figma URL을 Claude Code에 입력하면 화면 코드 자동 생성
# → src/features/{화면명}/page.tsx|hook.ts|repository.ts|types.ts 생성
```

---

## 패키지 제거

```bash
npx rs-cleanup
npm uninstall @neobnsrnd-team/reactive-springware
```

---

## 더 자세한 정보

설치 후 프로젝트 루트의 `rs-docs/setup-guide.md`를 확인하세요.

- rs-init이 하는 모든 작업 상세 설명
- 코드 생성 흐름 및 규칙 파일 구조
- Figma MCP 연동 및 트러블슈팅

