---
name: dir
description: Springware CMS 폴더 구조 가이드. 새 파일을 생성하거나 코드를 추가할 때 반드시 참조. 어느 디렉토리에 파일을 둘지 판단하는 기준 제공.
---

# Springware CMS 폴더 구조 규칙

새 파일을 만들기 전에 아래 규칙에 따라 위치를 결정합니다.

---

## 디렉토리별 역할

| 디렉토리 | 역할 | 넣는 파일 |
|----------|------|-----------|
| `src/app/` | **라우팅만** | `page.tsx`, `layout.tsx`, `route.ts`, `loading.tsx`, `error.tsx`, `not-found.tsx` |
| `src/components/` | **모든 React UI 컴포넌트** | `.tsx` 컴포넌트 (도메인별 하위 폴더) |
| `src/components/ui/` | **공통 UI 원자** | 버튼·모달·인풋 등 여러 곳에서 재사용하는 기본 UI |
| `src/lib/` | **유틸리티·헬퍼** | API 클라이언트, 포맷 함수, 상수, 외부 서비스 래퍼 |
| `src/hooks/` | **커스텀 React 훅** | `use`로 시작하는 훅 파일 |
| `src/data/` | **정적 데이터·설정** | 컴포넌트 데이터 정의, 번역 파일, 상수 설정 |
| `src/db/` | **DB 계층** | 커넥션, SQL 쿼리, Repository, 타입, 시드 |
| `src/types/` | **글로벌 타입 선언** | `.d.ts` 파일, 외부 라이브러리 타입 확장 |

---

## 핵심 원칙: `app/`은 라우팅 전용

`app/` 폴더 안에는 Next.js 특수 파일만 둡니다. React 컴포넌트·데이터·유틸은 절대 `app/` 안에 두지 않습니다.

```
# ❌ 금지
src/app/edit/EditClient.tsx
src/app/edit/finance-component-data.ts

# ✅ 올바른 위치
src/components/edit/EditClient.tsx
src/data/finance-component-data.ts
```

---

## 파일 종류별 위치 결정 가이드

### React 컴포넌트 (`.tsx`)
→ `src/components/<도메인>/파일명.tsx`

현재 도메인 폴더:
- `components/edit/` — 에디터 관련 (EditClient, EditClientLoader, ComponentPanel)
- `components/view/` — 미리보기 관련 (ViewClient)
- `components/files/` — 파일 브라우저 관련
- `components/ui/` — 공통 UI (버튼, 모달 등)

새 도메인이 생기면 `components/<도메인명>/` 폴더를 새로 만듭니다.

### API 라우트 (`route.ts`)
→ `src/app/api/<그룹>/<기능>/route.ts`

현재 API 그룹:
- `api/builder/` — 에디터 저장/로드
- `api/manage/` — 파일 관리
- `api/openrouter/`, `api/openai/` — AI 프록시
- `api/fal/` — AI 이미지 생성

### 정적 데이터·번역·설정 파일 (`.ts`, 컴포넌트 아님)
→ `src/data/파일명.ts`

예시: `finance-component-data.ts`, `ko.ts` (에디터 한국어 번역)

### 유틸리티 함수·헬퍼
→ `src/lib/파일명.ts`

예시: `api-response.ts`, `current-user.ts`, `validators.ts`, `upload-utils.ts`

### 커스텀 훅
→ `src/hooks/use파일명.ts`

예시: `useInfiniteScroll.ts`, `useDebounce.ts`

### 타입 선언 (`.d.ts`)
→ `src/types/파일명.d.ts`

### DB 관련
→ SQL 상수: `src/db/queries/*.sql.ts`
→ 데이터 접근: `src/db/repository/*.repository.ts`
→ 타입: `src/db/types.ts`

---

## 현재 프로젝트 구조 (준수 상태)

```
src/
├── app/                              # 라우팅 전용
│   ├── api/
│   │   ├── builder/load, save, upload
│   │   ├── manage/files, folders, upload, delete, addfolder
│   │   ├── openrouter/, openai/, fal/
│   │   ├── branches/, exchange/, components/, health/
│   ├── edit/page.tsx
│   ├── view/page.tsx
│   ├── files/page.tsx
│   ├── layout.tsx, globals.css, page.tsx
│
├── components/
│   ├── edit/                         # 에디터 UI 컴포넌트
│   │   ├── EditClient.tsx
│   │   ├── EditClientLoader.tsx
│   │   ├── ComponentPanel.tsx
│   │   ├── AppHeaderBorderEditor.tsx  # app-header 구분선 색상·굵기 편집
│   │   ├── ProductMenuIconEditor.tsx  # product-menu 아이콘 편집
│   │   ├── AuthCenterIconEditor.tsx   # auth-center 아이콘 편집
│   │   ├── MediaVideoEditor.tsx       # media-video YouTube URL 변경
│   │   └── SiteFooterSelectEditor.tsx # site-footer 드롭다운 편집
│   ├── view/                         # 뷰어 UI 컴포넌트
│   │   └── ViewClient.tsx
│   ├── files/                        # 파일 브라우저 컴포넌트
│   │   ├── FileBrowser.tsx
│   │   ├── FileCard.tsx
│   │   ├── FolderTree.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Breadcrumbs.tsx
│   │   ├── CreateFolderModal.tsx
│   │   ├── DeleteConfirmModal.tsx
│   │   └── UploadProgressList.tsx
│   └── ui/                           # 공통 UI
│       └── Modal.tsx                  # 공통 모달 셸 (오버레이 + 카드 + ESC/바깥클릭 닫기)
│
├── data/                             # 정적 데이터·설정
│   ├── finance-component-data.ts
│   └── ko.ts
│
├── hooks/                            # 커스텀 훅 (확장 예정)
│
├── lib/                              # 유틸리티
│   ├── api-response.ts
│   ├── current-user.ts
│   ├── validators.ts
│   └── upload-utils.ts
│
├── db/                               # DB 계층
│   ├── connection.ts
│   ├── types.ts
│   ├── ddl/, queries/, repository/, seed/
│
└── types/                            # 글로벌 타입 선언
    ├── contentbuilder-runtime.d.ts
    └── oracledb.d.ts
```

---

## 새 파일 생성 체크리스트

1. **React 컴포넌트?** → `src/components/<도메인>/`
2. **API 엔드포인트?** → `src/app/api/<그룹>/<기능>/route.ts`
3. **데이터·설정 파일?** → `src/data/`
4. **유틸·헬퍼 함수?** → `src/lib/`
5. **커스텀 훅?** → `src/hooks/`
6. **타입 선언?** → `src/types/`
7. **DB 관련?** → `src/db/queries/`, `src/db/repository/`
8. **`app/` 안에 컴포넌트를 두려 하고 있는가?** → ❌ 반드시 `components/`로 이동
