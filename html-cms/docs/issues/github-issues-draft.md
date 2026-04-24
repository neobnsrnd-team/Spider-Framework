# GitHub 이슈 초안 — 금융 컴포넌트 ContentBuilder 인라인 편집 전환

> **배경**: 현재 금융 컴포넌트는 `data-cb-type` 플러그인 구조로 되어 있어 ContentBuilder가 내부를 블랙박스로 취급한다. 이 때문에 기본 블록에서 가능한 더블클릭 텍스트 수정, 이미지 교체 등 ContentBuilder 인라인 편집 기능을 금융 컴포넌트에서는 사용할 수 없고, 별도로 만든 톱니바퀴 모달로만 수정 가능하다.
>
> **목표**: 금융 컴포넌트를 순수 HTML로 변환하여 기본 블록과 동일하게 ContentBuilder 인라인 편집(더블클릭 텍스트 수정, 이미지 교체, 블록 이동·삭제 등)이 가능하도록 한다.
>
> **플러그인 유지 대상** (JS 의존이라 변환 불가): `loan-calculator`, `exchange-board`, `branch-locator`

---

## 선행 관계 요약

```
Issue #10 (data-component-id 도입)
  ↓ 각 변환 작업에 함께 적용 (병행)
Issue #1~#7  ──────────────────────────────────┐
  (컴포넌트별 변환, 독립·병렬 진행 가능)         │
                                               ▼
                               Issue #8: EditCompModal 및 편집 버튼 정리
                               Issue #9: ContentBuilderRuntime 플러그인 등록 정리
```

> **Issue #10 병행 원칙**: Issue #2~#7 각 변환 작업 시 `data-component-id="<name>-<viewmode>"` 를 루트 요소에 포함하는 것을 필수 요건으로 적용한다. 분리하면 마이그레이션 스크립트를 두 번 실행해야 하므로 항상 함께 처리한다.

---

## Issue #3 — `auth-center` 컴포넌트 순수 HTML 변환 ✅

**목표**: 보안·인증센터(공동인증서·금융인증서·OTP·보안카드 카드 그리드)의 `data-cb-type` 플러그인 구조를 제거하여, 기본 블록과 동일하게 ContentBuilder에서 더블클릭으로 카드 텍스트를 직접 편집할 수 있도록 순수 HTML로 변환한다.

**작업 내용**
- [x] 플러그인 CSS에서 필요한 스타일을 인라인 스타일로 이식
- [x] `data-cb-type="auth-center"` 속성 제거
- [x] 루트 요소에 `data-component-id="auth-center-{mobile|web|responsive}"` 추가
- [x] mobile / web / responsive 3개 variant 변환
- [x] DB `DATA` 필드 `html` 값 업데이트 (`scripts/migrate-auth-center-to-html.ts`)
- [x] 에디터에서 더블클릭으로 카드 제목·설명 텍스트 직접 편집 가능한지 확인
- [x] 뷰어 렌더링 정상 확인
- [x] **[추가 기능]** 아이콘 커스텀 편집 구현 (`AuthCenterIconEditor.tsx`)
  - `buildCard()`에 `.ac-item` / `.ac-icon-wrap` 클래스 추가 (편집 대상 식별자)
  - 항목 `<a>` 클릭 시 `#divLinkTool`에 아이콘 편집 버튼 주입
  - 패널: 보안/인증 테마 SVG 12종 + 아이콘 색상 + 배경 색상 개별 변경 + 이미지 업로드
  - 아이콘 색상 적용 방식: `.ac-icon-wrap`의 CSS `color` 수정 → SVG `stroke="currentColor"` 상속
  - 참고: [커스텀-편집-기능-개발-가이드.md](../guide/커스텀-편집-기능-개발-가이드.md)

**영향 범위**
- `public/assets/plugins/auth-center/index.js` (Issue #9에서 플러그인 등록 제거 처리 — 선반영 완료)
- DB `SPW_CMS_COMPONENT` — `auth-center-mobile`, `auth-center-web`, `auth-center-responsive`

**의존성**: 없음 (독립 진행 가능)

---

## Issue #4 — `site-footer` 컴포넌트 순수 HTML 변환 ✅

**목표**: 사이트 푸터(약관·연락처·드롭다운·TOP 버튼)의 `data-cb-type` 플러그인 구조를 제거하여, 기본 블록과 동일하게 ContentBuilder에서 더블클릭으로 링크 텍스트·주소를 직접 편집할 수 있도록 순수 HTML로 변환한다.

**작업 내용**
- [x] 플러그인 CSS에서 필요한 스타일을 인라인 스타일로 이식
- [x] `data-cb-type="site-footer"` 속성 제거
- [x] 루트 요소에 `data-component-id="site-footer-{mobile|web|responsive}"` 추가
- [x] mobile / web / responsive 3개 variant 변환
- [x] DB `DATA` 필드 `html` 값 업데이트 (`scripts/migrate-site-footer-to-html.ts`)
- [ ] 에디터에서 더블클릭으로 링크 텍스트·주소 직접 편집 가능한지 확인
- [ ] 뷰어 렌더링 정상 확인
- [x] **[추가 기능]** SNS 아이콘(유튜브·페북·인스타·네이버블로그) 제거
- [x] **[추가 기능]** IBK 특화 내용 → 범용 플레이스홀더로 변경 (고객센터 번호·주소·저작권 등)
- [x] **[추가 기능]** 드롭다운 커스텀 편집 구현 (`SiteFooterSelectEditor.tsx`)
  - `<select>`는 ContentBuilder `#divLinkTool`을 트리거하지 않으므로 캡처 페이즈 클릭 감지 방식 사용
  - 패널: 계열사 바로가기·패밀리사이트 드롭다운 제목 및 항목 추가/수정/삭제
  - 참고: [커스텀-편집-기능-개발-가이드.md](../guide/커스텀-편집-기능-개발-가이드.md)

**영향 범위**
- `public/assets/plugins/site-footer/index.js` (Issue #9에서 플러그인 등록 제거 처리 — 선반영 완료)
- DB `SPW_CMS_COMPONENT` — `site-footer-mobile`, `site-footer-web`, `site-footer-responsive`

**의존성**: 없음 (독립 진행 가능)

---

## Issue #5 — `media-video` 컴포넌트 순수 HTML 변환 ✅

**목표**: 미디어 홍보(YouTube iframe 임베드)의 `data-cb-type` 플러그인 구조를 제거하여, 기본 블록과 동일하게 ContentBuilder에서 더블클릭으로 제목 텍스트를 직접 편집할 수 있도록 순수 HTML로 변환한다. YouTube iframe은 HTML 표준 `<iframe>` 태그로 ContentBuilder가 별도 플러그인 없이 처리 가능하다.

**작업 내용**
- [x] 플러그인 CSS에서 필요한 스타일을 인라인 스타일로 이식
- [x] `data-cb-type="media-video"` 속성 제거
- [x] 루트 요소에 `data-component-id="media-video-{mobile|web|responsive}"` 추가
- [x] YouTube iframe을 표준 HTML `<iframe>` 태그로 유지
- [x] mobile / web / responsive 3개 variant 변환
- [x] DB `DATA` 필드 `html` 값 업데이트 (`scripts/migrate-media-video-to-html.ts`)
- [x] 에디터에서 더블클릭으로 제목 텍스트 직접 편집 가능한지 확인
- [x] 뷰어 렌더링 정상 확인
- [x] **[추가 기능]** 유튜브 URL 변경 커스텀 편집 구현 (`MediaVideoEditor.tsx`)
  - iframe `src`는 ContentBuilder 인라인 편집 대상이 아니므로 별도 편집 방식 적용
  - 제목을 `<a>` 태그로 유지 → `#divLinkTool`에 영상 URL 변경 버튼 주입 (`product-menu` 아이콘 편집과 동일 패턴)
  - `MediaVideoEditor.tsx` UI: `ProductMenuIconEditor.tsx`와 동일한 패널 스타일 적용
  - 참고: [커스텀-편집-기능-개발-가이드.md](../guide/커스텀-편집-기능-개발-가이드.md)

**영향 범위**
- `public/assets/plugins/media-video/index.js` (Issue #9에서 플러그인 등록 제거 처리 — 선반영 완료)
- DB `SPW_CMS_COMPONENT` — `media-video-mobile`, `media-video-web`, `media-video-responsive`

**의존성**: 없음 (독립 진행 가능)

---

## Issue #6 — `product-gallery` 컴포넌트 순수 HTML 변환 (슬라이더 정적화)

**목표**: 금융 상품 갤러리(예금·적금·대출 카드)의 `data-cb-type` 플러그인 구조를 제거하여, 기본 블록과 동일하게 ContentBuilder에서 더블클릭으로 상품명·금리·설명을 직접 편집할 수 있도록 순수 HTML로 변환한다. 플러그인이 제공하던 스와이프 동작은 제거하고 카드 그리드 레이아웃으로 정적화한다.

> 슬라이드 효과가 필요한 경우 ContentBuilder 기본 블록의 `swiper-slider` 플러그인 조합으로 별도 구성 가능하다.

**작업 내용**
- [ ] 플러그인 CSS에서 레이아웃 스타일을 인라인 스타일로 이식
- [ ] `data-cb-type="product-gallery"` 속성 제거
- [ ] 루트 요소에 `data-component-id="product-gallery-{mobile|web|responsive}"` 추가
- [ ] 스와이프 JS 제거 → 카드 목록 그리드(flex/grid) 정적 HTML로 재구성
- [ ] mobile / web / responsive 3개 variant 변환
- [ ] DB `DATA` 필드 `html` 값 업데이트 (`scripts/` 마이그레이션 스크립트)
- [ ] 에디터에서 더블클릭으로 상품명·금리·설명 텍스트 직접 편집 가능한지 확인
- [ ] 뷰어 렌더링 정상 확인

**영향 범위**
- `public/assets/plugins/product-gallery/index.js` (Issue #9에서 플러그인 등록 제거 처리)
- DB `SPW_CMS_COMPONENT` — `product-gallery-mobile`, `product-gallery-web`, `product-gallery-responsive`

**의존성**: 없음 (독립 진행 가능)

---

## Issue #7 — `promo-banner` 컴포넌트 순수 HTML 변환 (슬라이더 정적화)

**목표**: 홍보 배너(스와이프 슬라이드 배너)의 `data-cb-type` 플러그인 구조를 제거하여, 기본 블록과 동일하게 ContentBuilder에서 더블클릭으로 배너 텍스트·이미지를 직접 편집할 수 있도록 순수 HTML로 변환한다. 슬라이드 동작은 제거하고 배너 목록으로 정적화한다.

> 슬라이드 효과가 필요한 경우 ContentBuilder 기본 블록의 `swiper-slider` 플러그인 조합으로 별도 구성 가능하다.

**작업 내용**
- [ ] 플러그인 CSS에서 레이아웃 스타일을 인라인 스타일로 이식
- [ ] `data-cb-type="promo-banner"` 속성 제거
- [ ] 루트 요소에 `data-component-id="promo-banner-{mobile|web|responsive}"` 추가
- [ ] 슬라이드 JS 제거 → 배너 목록 정적 HTML로 재구성
- [ ] mobile / web / responsive 3개 variant 변환
- [ ] DB `DATA` 필드 `html` 값 업데이트 (`scripts/` 마이그레이션 스크립트)
- [ ] 에디터에서 더블클릭으로 배너 텍스트·이미지 직접 편집 가능한지 확인
- [ ] 뷰어 렌더링 정상 확인

**영향 범위**
- `public/assets/plugins/promo-banner/index.js` (Issue #9에서 플러그인 등록 제거 처리)
- DB `SPW_CMS_COMPONENT` — `promo-banner-mobile`, `promo-banner-web`, `promo-banner-responsive`

**의존성**: 없음 (독립 진행 가능)

---

## Issue #8 — ComponentPanel 편집 버튼(톱니바퀴) 및 EditCompModal 정리

**목표**: Issue #1~#7 완료로 변환된 컴포넌트는 ContentBuilder 인라인 편집으로 대체되었으므로, 더 이상 필요 없는 톱니바퀴 편집 버튼과 EditCompModal을 제거한다. 플러그인 유지 컴포넌트(`loan-calculator`, `exchange-board`, `branch-locator`)는 ContentBuilder 인라인 편집이 불가하므로 편집 버튼을 존치한다.

**작업 내용**
- [ ] `ComponentPanel.tsx` — 변환된 컴포넌트 카드에서 편집 버튼(톱니바퀴 아이콘) 제거
- [ ] 플러그인 유지 컴포넌트(`loan-calculator`, `exchange-board`, `branch-locator`)의 편집 버튼은 그대로 유지
- [ ] 변환 컴포넌트가 대다수이므로 `EditCompModal` 컴포넌트를 플러그인 유지 컴포넌트 전용으로 범위 축소 또는 제거
- [ ] 편집 버튼 제거 후 패널 UI 레이아웃 정상 확인

**영향 범위**
- `src/components/edit/ComponentPanel.tsx`

**의존성**: Issue #1 ~ #7 완료 후 진행

---

## Issue #9 — ContentBuilderRuntime 플러그인 등록 정리 (진행 중)

**목표**: Issue #1~#7 완료로 변환된 컴포넌트는 더 이상 플러그인 마운트가 필요 없으므로, `EditClient.tsx`의 `ContentBuilderRuntime` 플러그인 등록에서 제거한다. 플러그인이 등록된 채로 남아 있으면 순수 HTML로 변환한 컴포넌트에 런타임이 재개입하여 ContentBuilder 인라인 편집을 다시 차단할 수 있다.

**작업 내용**
- [x] `EditClient.tsx` — Issue #1~#5 완료분 선반영 제거
  - 제거 완료: `app-header`, `product-menu`, `auth-center`, `site-footer`, `media-video`
  - 제거 예정 (Issue #6~#7 완료 후): `product-gallery`, `promo-banner`
  - 유지 대상: `loan-calculator`, `exchange-board`, `branch-locator`
- [x] `EditClient.tsx` — `parseBuilderBlocks`에 `data-component-id` 브랜치 추가 (변환 컴포넌트 패널 레이블/썸네일 정상 표시)
- [ ] `product-gallery`, `promo-banner` 제거 (Issue #6~#7 완료 후)
- [ ] 제거된 플러그인의 `public/assets/plugins/<name>/` 폴더 삭제 여부 결정 (재사용 가능성 고려 후 판단)
- [ ] 정리 후 에디터에서 변환된 컴포넌트의 ContentBuilder 인라인 편집이 정상 동작하는지 최종 확인

**영향 범위**
- `src/components/edit/EditClient.tsx`
- `public/assets/plugins/` (선택적 파일 삭제)

**의존성**: Issue #1 ~ #7 완료 후 최종 정리 (Issue #1~#5분은 선반영)

---

## Issue #10 — `data-component-id` 도입: 페이지-컴포넌트 매핑 식별자 확보

**배경**

Issue #1~#7에서 `data-cb-type`을 제거하면 ContentBuilder 인라인 편집은 활성화되지만,
페이지 HTML과 DB `SPW_CMS_COMPONENT.COMPONENT_ID`를 연결하는 식별자가 사라진다.
승인 시점에 `SPW_CMS_COMP_PAGE_MAP`에 삽입할 컴포넌트 목록을 파악하는 방법이 없어진다.

```
[기존 — data-cb-type이 식별자 역할]
페이지 HTML: data-cb-type="app-header"  →  DB COMPONENT_ID: 'app-header-mobile'

[Issue #1~#7 이후 — 식별자 소실]
페이지 HTML: (속성 없음)  →  DB 연결 불가 → COMP_PAGE_MAP 추적 불가

[해결]
페이지 HTML: data-component-id="app-header-mobile"  →  DB COMPONENT_ID: 'app-header-mobile'
```

**목표**

`data-cb-type` 제거와 함께 `data-component-id="<component-id>"` 를 루트 요소에 추가하여
DB `COMPONENT_ID`와 1:1 매핑되는 식별자를 유지한다.
ContentBuilder는 해당 속성을 특별 취급하지 않으므로 인라인 편집과 충돌 없다.

**작업 내용**

- [x] Issue #1 retrofit — `app-header` 3개 variant HTML에 `data-component-id` 추가 및 마이그레이션 스크립트(`scripts/migrate-app-header-to-html.ts`) 재실행
- [x] Issue #2~#5 — 각 컴포넌트 변환 시 `data-component-id` 포함 적용 완료
- [ ] Issue #6~#7 — 각 컴포넌트 변환 시 `data-component-id` 포함을 필수 요건으로 적용 (각 이슈와 병행)
- [x] `docs/guide/플러그인-컴포넌트-HTML-변환-가이드.md` — `data-component-id` 요건 포함 (가이드 작성 시 반영)
- [ ] 승인 시 `SPW_CMS_COMP_PAGE_MAP` insert 로직에서 `data-component-id`를 파싱해 컴포넌트 목록 추출 (별도 이슈 또는 본 이슈에서 함께 처리)

**영향 범위**
- `scripts/migrate-app-header-to-html.ts` (retrofit)
- `scripts/migrate-<name>-to-html.ts` (Issue #2~#7 스크립트)
- `docs/guide/플러그인-컴포넌트-HTML-변환-가이드.md`
- 승인 API (COMP_PAGE_MAP insert 로직)

**의존성**: Issue #1~#7과 병행 — 각 변환 작업에 `data-component-id` 포함을 공통 요건으로 적용
