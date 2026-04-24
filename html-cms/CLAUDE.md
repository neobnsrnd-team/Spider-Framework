# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 필독 문서

코드를 작성하거나 수정하기 전에 반드시 아래 컨벤션 문서를 읽고 준수합니다.

- **[코딩 컨벤션](docs/convention/코딩-컨벤션.md)** — 네이밍, 포매팅, API 응답 형식, 에러 처리, DB 레이어 패턴 등 모든 코딩 규칙

---

## 개발 언어 및 커뮤니케이션 원칙

- **모든 코드 주석, 변수명(의미 단위), UI 텍스트, 에디터 라벨은 한국어 기반으로 작성**
- 사용자와의 대화, 코드 설명, 문서 작성 모두 한국어로 응답
- 영문 라이브러리 API·타입명은 그대로 유지 (Next.js, TypeScript 등)

## Project Overview

Springware CMS — ContentBuilder.js 기반 비주얼 웹 콘텐츠 빌더 CMS.
Next.js 15.5.4 (App Router), React 19, TypeScript, Tailwind CSS 4. Path alias: `@/*` → `./src/*`

## 프로젝트 설명
1. 금융권 특화 웹 에디터
2. 목적:개발자가 아닌 사람도 쉽게 웹 에디터를 이용하여 화면을 만들 수 있다.
3. 웹 에디터로 만드는 화면은 모바일 앱 화면
4. 금융권 특화로, 금융권 모바일 앱 화면을 만들기 용이한 컴포넌트들을 제공한다.
5. 각 컴포넌트들을 에디터로 드래그앤드랍한 뒤 컴포넌트의 색, 글씨 등 간단한 수정만으로 금융권 모바일 앱을 위한 화면을 만들 수 있는 에디터를 만드는 것을 목표로 한다.


## File Structure

```
src/
├── app/
│   ├── layout.tsx              # 루트 레이아웃 (Geist 폰트, 다크모드 CSS 변수)
│   ├── globals.css             # Tailwind + .btns 에디터 버튼 스타일
│   ├── page.tsx                # / — 랜딩 페이지 (Link → /edit)
│   ├── [userId]/
│   │   └── page.tsx            # 사용자별 페이지
│   ├── edit/
│   │   └── page.tsx            # 서버 컴포넌트 (EditClientLoader 래퍼)
│   ├── view/
│   │   └── page.tsx            # 서버 컴포넌트 — DB에서 html 읽어서 prop 전달
│   ├── dashboard/
│   │   └── page.tsx            # 페이지 목록 대시보드
│   ├── approve/
│   │   └── page.tsx            # 승인 관리 페이지
│   ├── ab/
│   │   └── page.tsx            # A/B 테스트 페이지
│   ├── not-authorized/
│   │   └── page.tsx            # 권한 없음 페이지
│   └── api/
│       ├── assets/
│       │   ├── route.ts              # GET/POST — 에셋 목록 조회·등록
│       │   └── [assetId]/
│       │       ├── route.ts          # GET/PUT/DELETE — 에셋 단건 조회·수정·삭제
│       │       └── image/route.ts    # GET — 에셋 이미지 직접 조회
│       ├── auth/
│       │   └── approvers/route.ts    # GET — 승인자 목록 조회
│       ├── builder/
│       │   ├── load/route.ts         # POST — DB에서 HTML 로드
│       │   ├── save/route.ts         # POST — HTML을 DB에 저장
│       │   ├── upload/route.ts       # POST — FormData 파일 → ASSET_UPLOAD_DIR 저장, URL 반환
│       │   ├── pages/route.ts        # GET/DELETE — 페이지 목록 조회·삭제
│       │   ├── pages/[pageId]/approve/route.ts         # POST — 페이지 승인
│       │   ├── pages/[pageId]/approve-request/route.ts  # POST — 승인 요청
│       │   ├── pages/[pageId]/reject/route.ts          # POST — 승인 반려
│       │   ├── pages/[pageId]/history/route.ts         # GET — 페이지 이력 조회
│       │   ├── pages/[pageId]/rollback/route.ts        # POST — 이력 롤백
│       │   ├── pages/[pageId]/set-public/route.ts      # POST — 공개 상태 설정
│       │   ├── pages/[pageId]/update-dates/route.ts    # POST — 게시·만료일 수정
│       │   ├── ab/route.ts           # GET/POST — A/B 테스트 그룹 관리
│       │   └── ab/promote/route.ts   # POST — A/B 테스트 승격
│       ├── codes/route.ts            # GET — 공통 코드 목록
│       ├── components/route.ts       # GET — 등록된 컴포넌트 목록
│       ├── deploy/
│       │   ├── history/route.ts      # GET — 배포 이력 조회
│       │   ├── push/route.ts         # POST — 배포 푸시
│       │   └── receive/route.ts      # POST — 배포 수신 (운영 서버)
│       ├── openrouter/
│       │   ├── route.ts              # POST — OpenRouter API 프록시 (일반 + Function Calling)
│       │   └── stream/route.ts       # POST — OpenRouter 스트리밍 응답
│       ├── openai/
│       │   ├── route.ts              # POST — OpenAI API 프록시
│       │   └── stream/route.ts       # POST — OpenAI 스트리밍 응답
│       ├── fal/
│       │   ├── request/route.ts      # POST — FAL AI 이미지 생성 큐 등록
│       │   ├── status/route.ts       # POST — 요청 상태 확인
│       │   ├── result/route.ts       # POST — 생성된 이미지 결과 조회
│       │   └── cleanup/route.ts      # POST — 임시 데이터 정리
│       ├── exchange/route.ts         # GET — 환율 데이터 (exchange-board 컴포넌트용)
│       ├── branches/route.ts         # GET — 영업점/ATM 위치 데이터
│       ├── scheduler/
│       │   └── expire/route.ts       # POST — 만료 페이지 일괄 처리
│       ├── track/
│       │   ├── click/route.ts        # POST — 클릭 추적
│       │   ├── stats/route.ts        # GET — 통계 조회
│       │   └── view/route.ts         # POST — 페이지뷰 추적
│       └── health/route.ts           # GET — 헬스 체크
├── components/
│   ├── ab/
│   │   └── AbTestClient.tsx          # A/B 테스트 관리 UI
│   ├── admin/
│   │   └── AdminNavTabs.tsx          # 관리자 네비게이션 탭
│   ├── approve/
│   │   ├── ApproveClient.tsx         # 승인 관리 UI
│   │   ├── RollbackModal.tsx         # 이력 롤백 모달
│   │   └── StatsModal.tsx            # 통계 모달
│   ├── dashboard/
│   │   ├── DashboardClient.tsx       # 대시보드 메인 UI
│   │   ├── ApprovalRequestModal.tsx  # 승인 요청 모달
│   │   └── RejectedReasonModal.tsx   # 반려 사유 모달
│   ├── edit/                         # 에디터 UI 컴포넌트 (모두 'use client')
│   │   ├── EditClient.tsx            # ★ 핵심 — ContentBuilder 인스턴스 생성, 플러그인 등록, AI 모델 설정
│   │   ├── EditClientLoader.tsx      # EditClient 동적 로더 (SSR 방지용 dynamic import 래퍼)
│   │   ├── ComponentPanel.tsx        # 우측 패널 — 금융 컴포넌트 탭 UI
│   │   ├── AppHeaderBorderEditor.tsx # app-header 구분선 색상·굵기 편집
│   │   ├── AuthCenterIconEditor.tsx  # auth-center 아이콘 편집
│   │   ├── BenefitCardEditor.tsx     # benefit-card 혜택 카드 편집
│   │   ├── BranchLocatorEditor.tsx   # branch-locator 영업점 편집
│   │   ├── EventBannerEditor.tsx     # event-banner 슬라이드 배너 편집
│   │   ├── FinanceCalendarEditor.tsx # finance-calendar 금융 달력 편집
│   │   ├── FlexListEditor.tsx        # flex-list 유연 리스트 편집
│   │   ├── InfoAccordionEditor.tsx   # info-accordion 아코디언 편집
│   │   ├── InfoCardSlideEditor.tsx   # info-card-slide 카드 슬라이드 편집
│   │   ├── MediaVideoEditor.tsx      # media-video YouTube URL 변경
│   │   ├── MenuTabGridEditor.tsx     # menu-tab-grid 메뉴 탭 편집
│   │   ├── MyDataAssetEditor.tsx     # mydata-asset 마이데이터 자산 편집
│   │   ├── PopupBannerEditor.tsx     # popup-banner 팝업 배너 편집
│   │   ├── ProductMenuIconEditor.tsx # product-menu 아이콘 편집
│   │   ├── SiteFooterSelectEditor.tsx# site-footer 드롭다운 편집
│   │   ├── SlideEditorModal.tsx      # 공통 슬라이드 편집 모달
│   │   ├── StatusCardEditor.tsx      # status-card 상태 카드 편집
│   │   └── shared/
│   │       ├── TableEditorModal.tsx   # 공통 테이블 편집 모달
│   │       └── table-html.ts         # 테이블 HTML 생성 유틸
│   ├── view/
│   │   └── ViewClient.tsx            # ContentBuilderRuntime으로 저장된 HTML 렌더링
│   └── ui/                           # 공통 UI 컴포넌트
│       ├── Modal.tsx                 # 공통 모달 셸 (오버레이 + ESC/바깥클릭 닫기)
│       ├── PageCard.tsx              # 페이지 카드 (대시보드·승인 화면 공용)
│       └── Toast.tsx                 # 토스트 알림
├── data/
│   ├── approve-config.ts             # 승인 워크플로우 설정
│   ├── brand-themes.ts               # 금융사 브랜드 테마 (IBK, HANA, KB, IM)
│   ├── finance-component-data.ts     # 금융 컴포넌트 타입 정의 (데이터는 DB 관리)
│   └── ko.ts                         # ContentBuilder 한국어 로컬라이제이션
├── lib/                              # 유틸리티·헬퍼
│   ├── api-response.ts               # successResponse, errorResponse, contentBuilderErrorResponse, getErrorMessage
│   ├── api-url.ts                    # nextApi, javaApi (basePath 반영 URL 빌더)
│   ├── codes.ts                      # 공통 코드 유틸
│   ├── constants.ts                  # 공통 상수
│   ├── current-user.ts               # getCurrentUser, canWriteCms, canReadCms, requireCmsWrite
│   ├── deploy-utils.ts               # 배포 유틸
│   ├── env.ts                        # 환경변수 래퍼 (ASSET_UPLOAD_DIR, ASSET_BASE_URL, BANK_BRAND 등)
│   ├── html-utils.ts                 # HTML 가공 유틸
│   ├── java-admin-api.ts             # Java Admin API 연동
│   ├── mydata-asset-styles.ts        # 마이데이터 자산 스타일
│   ├── page-file.ts                  # readPageHtml (FILE_PATH 기반 레거시 파일 읽기 폴백)
│   └── validators.ts                 # isValidBankId, isPageExpired
├── db/                               # Oracle DB 레이어
│   ├── connection.ts                 # Oracle DB 커넥션 풀 관리
│   ├── types.ts                      # DB 타입 정의 (CmsPage, CmsAsset, CmsAssetPageMap 등)
│   ├── ddl/
│   │   ├── V1__init_schema.sql       # 초기 스키마 DDL
│   │   ├── V1__triggers.sql          # DB 트리거
│   │   ├── V2__page_view_log.sql     # 페이지뷰 로그 테이블
│   │   ├── V3__ab_test.sql           # A/B 테스트 테이블
│   │   ├── V4__asset_and_page_html.sql # 에셋 테이블 + PAGE_HTML CLOB
│   │   └── V5__asset_blob_to_file.sql  # 에셋 BLOB → 파일 시스템 전환
│   ├── queries/
│   │   ├── asset.sql.ts              # 에셋 쿼리
│   │   ├── page.sql.ts              # 페이지 쿼리
│   │   ├── component.sql.ts         # 컴포넌트 쿼리
│   │   ├── component-map.sql.ts     # 컴포넌트 매핑 쿼리
│   │   ├── page-history.sql.ts      # 페이지 이력 쿼리
│   │   ├── page-view-log.sql.ts     # 페이지뷰 로그 쿼리
│   │   ├── file-send.sql.ts         # 파일 전송 쿼리
│   │   └── server.sql.ts            # 서버 쿼리
│   ├── repository/
│   │   ├── asset.repository.ts       # 에셋 데이터 접근 레이어
│   │   ├── page.repository.ts        # 페이지 데이터 접근 레이어
│   │   ├── component.repository.ts   # 컴포넌트 데이터 접근 레이어
│   │   ├── file-send.repository.ts   # 파일 전송 데이터 접근 레이어
│   │   └── page-view-log.repository.ts # 페이지뷰 로그 데이터 접근 레이어
│   └── seed/
│       ├── run-seed.ts               # 시드 실행 진입점
│       ├── seed-basic-blocks.ts      # 기본 블록 시드 데이터
│       ├── seed-components.ts        # 컴포넌트 시드 데이터
│       └── seed-server-instances.ts  # 서버 인스턴스 시드 데이터
└── types/
    ├── contentbuilder-runtime.d.ts   # ContentBuilderRuntime 타입 선언
    ├── global.d.ts                   # 전역 타입 선언
    └── oracledb.d.ts                 # oracledb 모듈 타입 보강
public/
├── uploads/                          # 업로드된 에셋 파일 (nginx 정적 서빙)
├── runtime/                          # ContentBuilder 런타임 라이브러리
│   ├── contentbuilder-runtime.esm.js / .min.js / .css
│   ├── contentbuilder-blocks-runtime.esm.js / .min.js / .css
│   └── contentbuilder-interactive-runtime.esm.js / .min.js / .css
└── assets/
    ├── minimalist-blocks/            # ContentBuilder 스니펫 (content-plugins.js 등)
    ├── plugins/<name>/               # 플러그인별 index.js + style.css (50개+, 런타임 lazy-load)
    ├── scripts/                      # 서드파티 스크립트 (glide, glightbox, slick, tabs 등)
    ├── fonts/                        # Google Fonts 프리뷰 이미지 (300개+)
    └── modules/                      # 빌더 모달 HTML (form-builder, slider-builder 등)
scripts/
└── seed-pages.ts                     # 페이지 시드 스크립트 (직접 실행용)
nginx/
└── nginx.conf                        # 운영 nginx 설정 (/cms → CMS, /static/ → 에셋 정적 서빙)
docker-compose-prod.yml               # 운영 Docker 구성 (cms:3000 + operation:3001 + nginx)
Dockerfile                            # Multi-stage 빌드 (Node.js 20 + Oracle Instant Client)
docs/                                 # 프로젝트 문서
├── guide/                            # 실무 가이드
├── reference/                        # 참조 자료
└── convention/                       # 팀 규칙
    └── 코딩-컨벤션.md
```

## Component Details

### EditClient.tsx (핵심 파일)
- `useRef`로 ContentBuilder + ContentBuilderRuntime 인스턴스 관리, unmount시 destroy
- ContentBuilder 옵션: upload 핸들러, AI 엔드포인트, 모델 목록, 이미지 생성 설정
- Runtime은 `window.builderRuntime`에 전역 등록 (에디터 내부에서 플러그인 미리보기용)
- 하단 고정 버튼: HTML 보기 / 미리보기 (새 탭 /view) / Save
- AI 설정: OpenRouter 단일 사용 (`/api/openrouter`) — OpenAI 직접 연결 설정 블록 제거됨
- `ko.ts`로 ContentBuilder UI 한국어 번역 주입

### EditClientLoader.tsx
- `dynamic(() => import('./EditClient'), { ssr: false })` 래퍼
- ContentBuilder가 브라우저 전용이므로 SSR 비활성화 처리

### ComponentPanel.tsx
- 우측 패널의 금융 컴포넌트 탭 UI (드래그·클릭으로 캔버스에 블록 추가)
- `finance-component-data.ts`에서 컴포넌트 메타데이터 import

### ViewClient.tsx
- 서버에서 받은 html을 `dangerouslySetInnerHTML`로 렌더링
- ContentBuilderRuntime 초기화 → `runtime.init()` → 플러그인 활성화
- 반응형 모드: 툴바 + iframe 구조 (모바일/태블릿/데스크탑 프리셋)

### DB 레이어 (src/db/)
- `connection.ts`: oracledb 커넥션 풀 싱글턴, `initPool()` / `getConnection()` / `closePool()` / `withTransaction()` / `clobBind()` 제공
- `repository/*.ts`: SQL 쿼리를 추상화한 데이터 접근 레이어 (page, component, asset, file-send, page-view-log)
- `queries/*.sql.ts`: 각 도메인별 SQL 문자열 상수 모음
- `ddl/`: Flyway 스타일 버전 네이밍 SQL (V1~V5)

## 기능별 구현 위치

| 기능 | 파일 |
|---|---|
| 에디터 초기화·플러그인 등록 | `src/components/edit/EditClient.tsx` |
| 에디터 SSR 방지 로딩 | `src/components/edit/EditClientLoader.tsx` |
| 금융 컴포넌트 패널 UI | `src/components/edit/ComponentPanel.tsx` |
| 금융 컴포넌트 HTML 데이터 | `src/data/finance-component-data.ts` |
| ContentBuilder 한국어 번역 | `src/data/ko.ts` |
| 저장된 HTML 렌더링(뷰어) | `src/components/view/ViewClient.tsx` |
| 페이지 저장 API | `src/app/api/builder/save/route.ts` → `page.repository.ts#updatePage/createPage` |
| 페이지 불러오기 API | `src/app/api/builder/load/route.ts` → `page.repository.ts#getPageById` |
| 에디터 내 파일 업로드 | `src/app/api/builder/upload/route.ts` |
| 에셋 관리 API | `src/app/api/assets/route.ts` → `asset.repository.ts` |
| 대시보드 | `src/components/dashboard/DashboardClient.tsx` |
| 승인 관리 | `src/components/approve/ApproveClient.tsx` |
| A/B 테스트 | `src/components/ab/AbTestClient.tsx` |
| 배포 관리 | `src/app/api/deploy/push/route.ts`, `receive/route.ts` |
| 만료 스케줄러 | `src/app/api/scheduler/expire/route.ts` |
| 페이지뷰 추적 | `src/app/api/track/view/route.ts`, `click/route.ts`, `stats/route.ts` |
| AI 코드 생성 (일반) | `src/app/api/openrouter/route.ts` |
| AI 코드 생성 (스트리밍) | `src/app/api/openrouter/stream/route.ts` |
| AI 이미지 생성 | `src/app/api/fal/request` → `status` → `result` (FAL AI 큐 방식) |
| 환율 데이터 | `src/app/api/exchange/route.ts` |
| 영업점/ATM 위치 데이터 | `src/app/api/branches/route.ts` |
| Oracle DB 커넥션 풀·트랜잭션 | `src/db/connection.ts` (`getConnection`, `withTransaction`, `clobBind`) |
| 페이지 DB CRUD | `src/db/repository/page.repository.ts` |
| 에셋 DB CRUD | `src/db/repository/asset.repository.ts` |
| 컴포넌트 DB CRUD | `src/db/repository/component.repository.ts` |

## Key Patterns

- **데이터 저장**: Oracle DB 기반. 페이지 HTML은 `SPW_CMS_PAGE.PAGE_HTML` CLOB에 저장 (`src/db/repository/page.repository.ts`)
- **파일 업로드**: `ASSET_UPLOAD_DIR`(기본 `public/uploads/`)에 파일 저장. 운영 환경에서는 Docker 바인드 마운트(`/data/uploads/`) + nginx `/static/` 정적 서빙. DB에는 에셋 메타데이터만 저장 (`SPW_CMS_ASSET` 테이블)
- **AI 프록시**: API 키를 서버에 보관, 클라이언트는 `/api/openrouter` 등으로 요청
- **Function Calling**: `anthropic/claude-3.5-sonnet` 고정 (모델 선택과 무관)
- **API 응답 헬퍼**: `src/lib/api-response.ts` — `successResponse`, `errorResponse`, `contentBuilderErrorResponse`, `getErrorMessage` 사용. 모든 route.ts에서 `Response.json()` / `NextResponse.json()` 직접 사용 금지
- **API 에러 응답**: 일반 API → `errorResponse(msg, status)` → `{ ok: false, error }` + HTTP 4xx/5xx. ContentBuilder 연동 API → `contentBuilderErrorResponse(msg)` → `{ ok: false, error }` + HTTP 200
- **에러 처리 패턴**: catch 변수는 `err: unknown` 고정, 메시지 추출은 `getErrorMessage(err)` 사용. `error instanceof Error` 직접 사용 금지
- **보안**: 파일 업로드 API에 디렉토리 트래버설 방지 (`..` 포함 체크), 파일명 새니타이징
- **플러그인**: `public/assets/plugins/<name>/`에 각각 index.js + style.css, 사용시에만 lazy-load
- **SSR 방지**: ContentBuilder는 브라우저 전용 — `EditClientLoader.tsx`에서 `dynamic(..., { ssr: false })` 처리
- **한국어 로컬라이제이션**: `ko.ts`에서 ContentBuilder UI 문자열 전부 한국어로 오버라이드
- **basePath**: Next.js `basePath: '/cms'` 설정. 내부 URL 생성 시 반드시 `nextApi()` (`src/lib/api-url.ts`) 사용

## 에디터 사용 방법 (한글 가이드)

### 블록 추가하기
1. `http://localhost:3000/cms/edit` 접속
2. 우측 패널 **"금융 컴포넌트"** 탭: 금융 도메인 전용 컴포넌트를 드래그 또는 `+` 클릭으로 캔버스에 추가
3. 에디터 캔버스에서 `+` 버튼 클릭 → ContentBuilder 기본 피커(텍스트·이미지·레이아웃 등 일반 블록)

### 금융 컴포넌트 목록 (우측 패널 — 금융 컴포넌트 탭)
> **IBK 기업은행은 데모 예시입니다.** 실제 사용 시 `finance-component-data.ts`의 HTML 내용을 해당 금융사 브랜드에 맞게 교체합니다.

| 컴포넌트 | 설명 |
|---|---|
| 상단 네비게이션 | 로고·메뉴·햄버거 헤더 (데모: IBK/하나/KB 링크) |
| 퀵뱅킹 메뉴 | 아이콘 그리드 (조회·이체·카드·예금·대출 등) |
| 금융 상품 갤러리 | 스와이프 카드 (예금·적금·대출 금리 표시) |
| 환율 및 금융 지수 | USD·EUR·JPY·CNY 실시간 환율 + 환전 신청 버튼 |
| 영업점/ATM 위치 | 지도 영역 + 바텀시트 영업점 목록 |
| 홍보 배너 & 미디어 | 스와이프 배너 + 유튜브 영상 임베드 |
| 금융 계산기 | 대출·예금·적금 탭 전환 계산기 |
| 보안·인증센터 | 공동인증서·금융인증서·OTP·보안카드 |

### 블록 내용 편집하기
- 블록 클릭 → 우측 패널에서 **연필 아이콘** 클릭 → 항목 편집 (이름·링크·설명 수정, 항목 추가/삭제)
- 블록 클릭 → 우측 패널에서 **톱니바퀴 아이콘** 클릭 → 색상·레이아웃 등 설정 변경

### 저장 및 미리보기
- 하단 **`Save`** 버튼: 현재 콘텐츠를 DB에 저장
- 하단 **`미리보기`** 버튼: 저장 후 `/view` 페이지를 새 탭으로 열어 실제 렌더링 확인
- 하단 **`HTML`** 버튼: 생성된 HTML 코드 직접 확인·편집

### 컴포넌트 파일 구조
- `src/data/finance-component-data.ts` — 금융 컴포넌트 데이터 (우측 패널용, IBK 데모 포함)
- `public/assets/minimalist-blocks/content-plugins.js` — ContentBuilder 기본 블록 (텍스트·이미지·레이아웃 등)

## Environment Variables (.env)

```
# AI 프로바이더 (선택)
OPENROUTER_API_KEY    # AI 코드 생성 (기본 프로바이더)
OPENAI_API_KEY        # AI 대안 프로바이더
FAL_API_KEY           # AI 이미지 생성 (fal.ai)
GEMINI_API_KEY        # Google GenAI (웹 버전)

# 에셋 저장소
ASSET_UPLOAD_DIR      # 업로드 파일 저장 경로 (기본: public/uploads)
ASSET_BASE_URL        # 업로드 파일 URL prefix (기본: /uploads)

# Oracle DB (필수)
ORACLE_USER / ORACLE_PASSWORD / ORACLE_HOST / ORACLE_PORT / ORACLE_SERVICE / ORACLE_SCHEMA

# 보안
JWT_SECRET            # JWT 서명 키
DEPLOY_SECRET         # 배포 수신 토큰
SCHEDULER_SECRET      # 만료 스케줄러 토큰

# 브랜드 테마
BANK_BRAND            # IBK, HANA, KB, IM (src/data/brand-themes.ts 참조)

# 운영
CMS_BASE_URL          # CMS 서버 공개 URL (배포 시 에셋 참조 기준)
GIT_AUTO_COMMIT       # 페이지 저장 시 git 자동 커밋 (기본: false)
AUTH_BYPASS            # true 설정 시 인증 우회 (개발·테스트 전용)
```
