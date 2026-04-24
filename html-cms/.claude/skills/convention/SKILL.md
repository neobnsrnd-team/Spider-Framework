---
name: convention
description: Springware CMS 프로젝트의 코딩 컨벤션. TypeScript/Next.js 코드 작성·수정·리뷰 시 반드시 참조. API route, React 컴포넌트, DB 레이어 등 모든 코드 작업에 적용.
---

# Springware CMS 코딩 컨벤션

## 이 프로젝트만의 규칙 (반드시 숙지)

### 파일 & 주석

- 파일 첫 줄에 경로 주석 필수: `// src/app/api/builder/save/route.ts`
- 주석은 **한국어** (라이브러리·기술 용어는 영문 유지)

### 응답 형식 — `ok: true` 통일

ContentBuilder 라이브러리가 `ok` 필드로 판별하므로 `success` 혼용 금지.

```ts
return NextResponse.json({ ok: true }); // ✅
return NextResponse.json({ success: true }); // ❌ 금지
```

에러 응답은 상황에 따라 구분:

- ContentBuilder 연결 API → `{ ok: false, error: "..." }` HTTP **200**
- 일반 API → `{ ok: false, error: "..." }` HTTP 400/500

에러 메시지는 한국어, 스택 트레이스·파일 경로 등 내부 정보 노출 금지.

### catch 블록

```ts
} catch (err: unknown) {                   // ✅ err: unknown으로 통일
    console.error('한국어 설명:', err);
    return errorResponse(getErrorMessage(err)); // getErrorMessage 헬퍼 필수
}
// ❌ 금지: catch (error), catch (error: any), instanceof Error 직접 사용
```

### DB 레이어

API route에서 DB 직접 접근 금지. 반드시 repository를 거칩니다.

```
API route → repository → queries (SQL 상수) → DB
```

- SQL은 `src/db/queries/*.sql.ts` 상수로만 정의
- 쓰기 작업은 `withTransaction()`, 조회는 `getConnection()` + `finally conn.close()`
- CLOB 컬럼은 `clobBind()` 필수

### 공통 유틸 — 중복 구현 금지

| 기능        | import 경로                                                                                                  |
| ----------- | ------------------------------------------------------------------------------------------------------------ |
| API 응답    | `@/lib/api-response` → `successResponse`, `errorResponse`, `contentBuilderErrorResponse`, `getErrorMessage` |
| DB 커넥션   | `@/db/connection` → `getConnection`, `withTransaction`, `clobBind`                                          |
| 현재 사용자 | `@/lib/current-user` → `getCurrentUser`                                                                      |
| ID 검증     | `@/lib/validators` → `isValidBankId`                                                                         |
| 업로드 URL  | `@/lib/upload-utils` → `normalizeUploadUrl`                                                                  |
| 공통 모달 셸 | `@/components/ui/Modal` → `Modal` (default), `ModalProps`                                                   |
| 공통 페이지 카드 | `@/components/ui/PageCard` → `PageCard` (default), `VIEW_MODE_STYLE`, `APPROVE_STYLE`, `formatDate`, `ViewMode` |

### 보안

```ts
// 경로 파라미터 반드시 검증
if (relativePath.includes('..')) {
    return NextResponse.json({ error: '유효하지 않은 경로입니다.' }, { status: 400 });
}
// ID 검증 정규식
/^[a-z0-9-]{1,64}$/.test(id);
// 업로드 파일명
file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
```

---

## E2E 테스트 코드 (Playwright)

### mock 데이터 작성 기준

`page.route()` mock 응답은 **실제 API 응답 구조와 동일**하게 작성합니다. 불일치 시 테스트가 자기 자신만 검증하게 됩니다.

```ts
// ✅ 실제 /api/builder/pages 응답 구조 반영
body: JSON.stringify({ ok: true, pages: MOCK_LIST })

// ❌ 실제 API는 data가 아닌 pages 반환
body: JSON.stringify({ ok: true, data: MOCK_LIST })
```

### page.route() 사용 패턴

```ts
// ✅ mock + page.evaluate(fetch) 조합 — about:blank 금지, 실제 페이지(/) 사용
await page.route('**/api/...', async (route) => { ... });
await page.goto('/');
const result = await page.evaluate(async () => {
    const res = await fetch('/api/...');
    return res.json();
});

// ❌ page.request는 page.route() mock을 우회함
const res = await page.request.get('/api/...');
```

### test.skip 기준

CI 구조적 한계(Oracle 없음 등)일 때만 허용, 이유를 구체적으로 명시합니다.

```ts
// eslint-disable-next-line playwright/no-skipped-test
test.skip(!!process.env.CI, 'CI 환경: Oracle 없어 ContentBuilder 초기화 불가');
```

### UI 텍스트

셀렉터 문자열은 `e2e/fixtures/locale.ts`의 `LABEL` 상수로 중앙 관리합니다.

---

## 일반 규칙 (빠른 참조)

- **포매팅**: 4 spaces, single quote, 세미콜론 필수, 트레일링 콤마 필수
- **import 순서**: 외부 라이브러리 → `@/` 절대경로 → 상대경로 (그룹 사이 빈 줄)
- **타입**: `interface` 우선, 유니온만 `type`. `strict: true`로 catch는 자동 `unknown`
- **함수 prefix**: `get` 조회 / `create` 생성 / `update` 수정 / `delete` 삭제 / `is·has` 불리언
- **API 구조**: 핸들러는 파싱·응답만, 비즈니스 로직은 별도 함수로 분리
- **컴포넌트**: 서버 컴포넌트 기본, `'use client'`는 필요할 때만. hooks 순서: state → ref → callback → memo → effect
- **로그**: `console.log`는 커밋 전 제거
