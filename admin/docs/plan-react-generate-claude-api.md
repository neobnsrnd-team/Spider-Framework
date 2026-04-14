# React Generate — Claude API 연동 구현 계획

> 관련 이슈: #4  
> 작성일: 2026-04-13

---

## 1. 목표

관리자 화면(`react-generate` 메뉴)에서 Figma URL과 요구사항을 입력하면,  
Claude API가 `reactive-springware` 컴포넌트 라이브러리 기반의 React 코드를 생성하고 DB에 저장한다.

---

## 2. 전체 아키텍처

```
reactive-springware (빌드 시)
  └── scripts/
        ├── extract-components.ts   → component-library의 types.ts 파싱
        ├── extract-design-tokens.ts → figma-tokens/*.json 파싱
        └── extract-component-map.ts → docs/component-map.md 복사·가공
              ↓ 생성
        generated/
          ├── component-types.md
          ├── design-tokens.md
          └── component-map.md
                ↓ 복사 (빌드 후 훅 또는 수동)
admin (런타임)
  └── resources/prompts/
        ├── CLAUDE.md              (reactive-springware CLAUDE.md)
        ├── component-types.md
        ├── design-tokens.md
        └── component-map.md
              ↓ 읽기
        domain/reactgenerate/ai/
          ├── prompt/PromptLoader   → 파일 로드
          ├── prompt/PromptBuilder  → system prompt 조립
          └── ClaudeApiClient       → Claude API 호출
              ↓
        ReactGenerateService        → 코드 추출 + DB 저장 (status: pending)
```

---

## 3. 작업 단위

### Phase 1. reactive-springware — 빌드 스크립트

#### 목적

Claude API system prompt에 포함할 컴포넌트 컨텍스트를 **빌드 시점에** 마크다운 파일로 추출한다.  
런타임에 TypeScript 파일을 직접 읽을 수 없는 Java 백엔드를 위해 텍스트 형태로 변환한다.

#### 스크립트별 역할

| 스크립트 | 입력 | 출력 | 설명 |
|---|---|---|---|
| `extract-components.ts` | `component-library/**/types.ts` | `component-types.md` | 각 컴포넌트의 interface·type을 파싱하여 props 목록 문서화 |
| `extract-design-tokens.ts` | `design-tokens/figma-tokens/*.json` | `design-tokens.md` | semantic 토큰 및 primitive 토큰을 계층 구조로 문서화 |
| `extract-component-map.ts` | `docs/component-map.md` | `component-map.md` | 기존 문서를 그대로 복사하거나 최신화 후 generated에 배치 |

#### `component-types.md` 출력 예시

```markdown
## Button

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | 'primary' \| 'outline' \| 'ghost' \| 'danger' | 'primary' | 버튼 외형 |
| size | 'sm' \| 'md' \| 'lg' | 'md' | 버튼 크기 |
| loading | boolean | false | 로딩 스피너 표시 |
| fullWidth | boolean | false | w-full 적용 |
...

## Input
...
```

#### `design-tokens.md` 출력 예시

```markdown
## Semantic Tokens
- --color-primary: var(--primitive-blue-500)
- --color-surface: var(--primitive-gray-50)
...

## Brand Tokens (hana)
- --brand-primary: #008080
...
```

#### 스크립트 실행 방법

`package.json`에 스크립트 추가:
```json
{
  "scripts": {
    "generate:prompts": "ts-node scripts/extract-components.ts && ts-node scripts/extract-design-tokens.ts && ts-node scripts/extract-component-map.ts"
  }
}
```

> **Note**: CI/CD 파이프라인 또는 로컬 빌드 후 `generated/` 파일을  
> `admin/src/main/resources/prompts/`로 복사하는 훅을 추가한다.

---

### Phase 2. admin — PromptLoader / PromptBuilder

#### PromptLoader

`resources/prompts/` 디렉토리에서 파일을 읽어 문자열로 반환한다.

- 파일은 Spring classpath 리소스로 관리 (`ClassPathResource`)
- 각 파일은 애플리케이션 시작 시 한 번만 로드하고 캐싱 (`@PostConstruct`)
- 파일이 없을 경우 빈 문자열 반환 (graceful degradation)

```
PromptLoader
  - loadClaudeMd()         → CLAUDE.md 전체 내용
  - loadComponentTypes()   → component-types.md 전체 내용
  - loadDesignTokens()     → design-tokens.md 전체 내용
  - loadComponentMap()     → component-map.md 전체 내용
```

#### PromptBuilder

`PromptLoader`에서 받은 내용을 조합하여 system prompt 문자열을 생성한다.

- 각 섹션에 구분자(`---`)와 헤더를 붙여 Claude가 맥락을 구분할 수 있도록 구성
- 섹션 순서: CLAUDE.md → component-types → design-tokens → component-map

```
PromptBuilder
  - buildSystemPrompt()    → 섹션 조합 후 완성된 system prompt 반환
  - buildUserPrompt(figmaUrl, requirements) → user prompt 생성
```

**system prompt 구조 예시:**

```
[역할 정의]
당신은 Figma 디자인을 React 컴포넌트로 변환하는 전문가입니다.
반드시 아래에 제공된 컴포넌트 라이브러리만 사용하여 코드를 생성하세요.

--- CLAUDE.md ---
{CLAUDE.md 내용}

--- Component Library ---
{component-types.md 내용}

--- Design Tokens ---
{design-tokens.md 내용}

--- Component Map (Figma → React 매핑 전략) ---
{component-map.md 내용}
```

**user prompt 구조 예시:**

```
Generate a React component from the following Figma design.

Figma URL: {figmaUrl}

Requirements:
{requirements}

Rules:
- 반드시 위 컴포넌트 라이브러리의 컴포넌트만 사용할 것
- 디자인 토큰(CSS 변수)을 활용하고 하드코딩 금지
- TypeScript로 작성하고 props interface를 포함할 것
- 접근성(aria 속성)을 고려할 것
```

---

### Phase 3. admin — Claude API Client

Claude API(`/v1/messages`)를 호출하는 HTTP 클라이언트를 구현한다.

#### 설정

`application.yml`에 추가:

```yaml
claude:
  api:
    url: https://api.anthropic.com/v1/messages
    key: ${CLAUDE_API_KEY}
    model: claude-opus-4-6          # 또는 claude-sonnet-4-6
    max-tokens: 8192
```

`.env`에 추가:
```
CLAUDE_API_KEY=sk-ant-...
```

#### 요청 / 응답 구조

Claude API 요청 (`POST /v1/messages`):
```json
{
  "model": "claude-opus-4-6",
  "max_tokens": 8192,
  "system": "{system prompt}",
  "messages": [
    { "role": "user", "content": "{user prompt}" }
  ]
}
```

Claude API 응답에서 코드 추출:
- `content[0].text` 에서 마크다운 코드 블록(` ```tsx ... ``` `) 파싱
- 코드 블록이 없을 경우 전체 텍스트를 그대로 사용

#### ClaudeApiClient 구조

```
ClaudeApiClient
  - generate(systemPrompt, userPrompt) → 생성된 React 코드 문자열 반환
```

- `RestTemplate` 또는 `WebClient` 사용 (기존 `RestTemplateConfig` 재사용 우선)
- API 오류 시 `InternalException` throw
- 타임아웃 설정 필수 (Claude 응답이 수 초 소요)

---

### Phase 4. admin — Service 연결 및 DB 저장

#### 코드 생성 흐름

```
ReactGenerateService.generate(request)
  1. PromptBuilder.buildSystemPrompt()
  2. PromptBuilder.buildUserPrompt(figmaUrl, requirements)
  3. ClaudeApiClient.generate(systemPrompt, userPrompt)
  4. 응답 코드 추출
  5. DB 저장 (status: pending)
  6. ReactGenerateResponse 반환
```

#### DB 테이블 설계 (안)

```sql
CREATE TABLE REACT_GENERATE_HIS (
    ID            VARCHAR2(36)   PRIMARY KEY,   -- UUID
    FIGMA_URL     VARCHAR2(1000) NOT NULL,
    SYSTEM_PROMPT CLOB,                         -- 디버깅용 저장
    USER_PROMPT   CLOB,
    REACT_CODE    CLOB,
    PREVIEW_HTML  CLOB,
    STATUS        VARCHAR2(20)   DEFAULT 'PENDING',  -- PENDING / APPROVED / REJECTED
    APPROVED_BY   VARCHAR2(100),
    APPROVED_AT   VARCHAR2(14),
    CREATED_BY    VARCHAR2(100),
    CREATED_AT    VARCHAR2(14)   NOT NULL
);
```

- 현재 인메모리(`ConcurrentHashMap`) → Mapper로 교체
- `ReactGenerateMapper` 추가 (insert, selectById, updateStatus)
- Oracle DDL: `docs/sql/oracle/`, MySQL DDL: `docs/sql/mysql/`에 추가

---

## 4. 구현 순서

```
1. [reactive-springware] 추출 스크립트 작성 및 generated/ 파일 생성
2. [admin] resources/prompts/ 파일 배치
3. [admin] PromptLoader 구현 (파일 로드 + 캐싱)
4. [admin] PromptBuilder 구현 (system/user prompt 조립)
5. [admin] ClaudeApiClient 구현 (API 호출 + 코드 추출)
6. [admin] DB 테이블 DDL 작성 + Mapper 구현
7. [admin] ReactGenerateService 연결 (인메모리 → Mapper + Claude API)
8. 통합 테스트 (실제 Figma URL + Claude API 호출)
```

---

## 5. 고려 사항

### 프롬프트 파일 관리
- `generated/` 파일은 컴포넌트 라이브러리 변경 시마다 재생성 필요
- CI/CD에서 `generate:prompts` 스크립트를 자동 실행하고, 결과물을 admin 리소스로 복사하는 파이프라인 구성 검토

### Claude API 응답 시간
- 코드 생성 요청은 수 초~수십 초 소요될 수 있음
- 관리자 화면에서 `생성 중...` 스피너는 이미 구현되어 있으나, 타임아웃 처리 및 재시도 UX 추가 검토

### 토큰 비용
- system prompt가 길어질수록 비용 증가
- `component-types.md`에 포함할 컴포넌트 범위를 필요한 것만 선별하거나, 입력 카테고리별로 로드 범위 조정 가능

### 보안
- `CLAUDE_API_KEY`는 반드시 환경변수로 관리, 코드·커밋에 포함 금지
- system prompt에 내부 코드가 포함되므로 외부 노출 금지
