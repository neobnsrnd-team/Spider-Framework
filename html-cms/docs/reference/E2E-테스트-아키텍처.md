# E2E 테스트 아키텍처 (Playwright)

> 코딩 규칙은 [`docs/convention/코딩-컨벤션.md` 섹션 13](../convention/코딩-컨벤션.md#13-e2e-테스트-코드-playwright) 참조.

---

## 초기 세팅

E2E 테스트를 처음 실행하는 경우 아래 두 단계가 필요합니다.

```bash
# 1. 패키지 설치
npm install

# 2. Playwright 브라우저 바이너리 설치 (최초 1회)
npx playwright install
```

> `npx playwright install`은 Chromium·Firefox·WebKit 바이너리를 `~/.cache/ms-playwright/`에 다운로드합니다.
> `npm install`과 별도로 실행해야 하며, git에 추적되지 않아 새로운 환경마다 필요합니다.
> E2E 테스트를 실행하지 않을 경우 생략 가능합니다.

---

## 테스트 구조 개요

CI 환경에 Oracle이 없으므로, DB에 의존하는 API는 `page.route()`로 mock합니다.

```
e2e/
├── api/
│   ├── builder-pages.spec.ts   # 빌더 페이지 API 계약 (load/save/pages/approve)
│   └── components.spec.ts      # 컴포넌트 목록 API 계약
├── pages/
│   ├── approval-flow.spec.ts   # 저장 → 승인 요청 → 승인 E2E 플로우
│   └── editor.spec.ts          # 에디터 UI + 뷰어 렌더링
├── smoke/
│   └── smoke.spec.ts           # 페이지 로드 + API 헬스체크
└── fixtures/
    └── locale.ts               # UI 텍스트 상수 (LABEL)
```

---

## mock 기반 테스트의 구조적 한계

`page.route()` mock은 **실제 API 동작을 검증하지 않습니다.**

```
[테스트가 실제로 하는 일]
mock 설정 → fetch 호출 → mock 응답 반환 → mock 응답 구조 검증

[테스트가 하지 못하는 것]
실제 API가 올바른 응답을 반환하는지
DB 쿼리가 정상 동작하는지
에러 처리가 제대로 되는지
```

### 실제 발생한 불일치 사례

| API | mock에서 쓴 필드 | 실제 응답 필드 | 결과 |
|---|---|---|---|
| GET /api/builder/pages | `data` | `pages` | 테스트 통과했지만 실제 불일치 |
| POST /api/builder/load | `content` | `html` | 동일 |
| approve-request | POST | PATCH | 동일 |

→ Gemini 코드 리뷰에서 발견. **API 변경 시 mock 동기화가 누락되기 쉬운 구조.**

### 대응 방법

1. **API 응답 구조 변경 시** — 해당 API의 mock 데이터를 반드시 함께 수정
2. **새 API 추가 시** — `docs/reference/기술-개요.md` API 목록과 mock 데이터를 동시에 작성
3. **향후 Oracle Docker 도입 시** — mock 테스트를 실제 API 테스트로 단계적 전환 가능

---

## CI skip 목록

| 테스트 | 파일 | skip 이유 |
|---|---|---|
| 하단 액션 버튼 표시 확인 | `e2e/pages/editor.spec.ts` | Oracle 없어 ContentBuilder 초기화 불가 → Save 버튼 미표시 |
| 모바일 뷰어 스크린샷 비교 | `e2e/pages/editor.spec.ts` | DB 없어 빈 화면 → 스크린샷 비교 무의미 |

---

## 향후 개선 방향

### Oracle Docker 도입 시

GitHub Actions에 Oracle XE 컨테이너를 추가하면 실제 API 테스트가 가능해집니다.

```yaml
# .github/workflows/ci.yml 예시
services:
  oracle:
    image: gvenzl/oracle-xe:21-slim
    ports: ["1521:1521"]
    env:
      ORACLE_PASSWORD: testpassword
```

**도입 비용**: 이미지 ~1.5GB, 컨테이너 기동 1~3분, CI 전체 시간 5분+ 증가.  
**도입 시점**: mock 불일치 버그가 반복되거나, API 수가 크게 늘어날 때 재검토.

### webServer 모드 변경 (`dev` → `start`)

Oracle이 추가되면 `npm run build && npm start`로 프로덕션 모드 전환 가능.  
cold compile이 없어 에디터 버튼 테스트 skip도 제거할 수 있습니다.
