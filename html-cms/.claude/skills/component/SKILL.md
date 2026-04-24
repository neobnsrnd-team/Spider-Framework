---
name: component
description: Springware CMS 금융 컴포넌트 생성·수정·변환 가이드. Path A(순수 HTML)·Path B(플러그인) 판단, ContentBuilder 제약, 마이그레이션 스크립트, 커스텀 편집 기능 구현, 자주 하는 실수 포함.
---

# 금융 컴포넌트 가이드

## 1단계: Path 결정

```
JS 런타임 의존? (실시간 fetch, 지도, 복잡한 계산)
  아니오 → Path A: 순수 HTML (기본)
  예     → Path B: 플러그인
```

현재 플러그인 유지 대상: `exchange-board`, `loan-calculator`

---

## Path A — 순수 HTML

### 체크리스트 (신규 생성)

```
□ 1. HTML 작성 (mobile / web / responsive 3 variant)
□ 2. scripts/migrate-<name>-to-html.ts 작성
□ 3. npx tsx scripts/migrate-<name>-to-html.ts 실행
□ 4. SVG 썸네일 생성 (public/assets/minimalist-blocks/preview/ibk-<name>.svg)
□ 5. (필요 시) 커스텀 편집 기능 추가
```

### HTML 규칙

**루트 요소 필수 속성 2개**:
- `data-component-id="<name>-<viewmode>"` — DB `COMPONENT_ID`와 1:1 매핑
- `data-spw-block` — 캔버스 전체 너비 처리

**스타일 규칙**:
- 모든 CSS → **인라인 `style=""`만 사용** (ContentBuilder가 외부 CSS 격리)
- `@container`, `@media`, CSS 클래스 사용 불가
- `overflow: hidden` 금지 (ContentBuilder 툴바 잘림)
- 폰트: `-apple-system,BlinkMacSystemFont,'Malgun Gothic','Apple SD Gothic Neo',sans-serif`
- `<a>` 태그 반드시 포함 (ContentBuilder 링크 편집 + 커스텀 버튼 진입점)

**3 variant 차이**:

| variant | 특징 |
|---------|------|
| `mobile` | 기준 너비 390px, 작은 패딩·폰트 |
| `web` | 넓은 패딩, `max-width` + `margin: 0 auto` |
| `responsive` | `width: 100%; box-sizing: border-box` |

**예시**:
```html
<div data-component-id="my-block-mobile" data-spw-block
     style="font-family:-apple-system,BlinkMacSystemFont,'Malgun Gothic',sans-serif;background:#ffffff;">
    <div style="display:flex;align-items:center;height:54px;padding:0 14px;">
        <a href="#" style="text-decoration:none;">
            <span style="font-size:17px;font-weight:800;color:#1A1A2E;">컴포넌트 제목</span>
        </a>
    </div>
</div>
```

### 마이그레이션 스크립트 패턴

**위치**: `scripts/migrate-<name>-to-html.ts`

```ts
import 'dotenv/config';
import { getComponentById, updateComponent, createComponent } from '../src/db/repository/component.repository';
import { closePool } from '../src/db/connection';

const MOBILE_HTML = `<div data-component-id="my-block-mobile" data-spw-block style="...">...</div>`;
const WEB_HTML = `<div data-component-id="my-block-web" data-spw-block style="...">...</div>`;
const RESPONSIVE_HTML = `<div data-component-id="my-block-responsive" data-spw-block style="...">...</div>`;

const VARIANTS = [
    { id: 'my-block-mobile',     html: MOBILE_HTML,     viewMode: 'mobile',     label: '내 컴포넌트', description: '설명' },
    { id: 'my-block-web',        html: WEB_HTML,        viewMode: 'web',        label: '내 컴포넌트', description: '설명' },
    { id: 'my-block-responsive', html: RESPONSIVE_HTML, viewMode: 'responsive', label: '내 컴포넌트', description: '설명' },
];

async function main() {
    for (const variant of VARIANTS) {
        const existing = await getComponentById(variant.id);
        if (existing) {
            // ⚠️ componentType·viewMode는 반드시 기존값 전달 (생략 시 null로 덮어써짐)
            await updateComponent({
                componentId:        variant.id,
                componentType:      existing.COMPONENT_TYPE,
                viewMode:           existing.VIEW_MODE,
                componentThumbnail: existing.COMPONENT_THUMBNAIL ?? undefined,
                data: { ...(existing.DATA ?? {}) as Record<string, unknown>, html: variant.html },
                lastModifierId: 'system',
            });
        } else {
            await createComponent({
                componentId:      variant.id,
                componentType:    'finance',
                viewMode:         variant.viewMode as 'mobile' | 'web' | 'responsive',
                componentThumbnail: `/assets/minimalist-blocks/preview/ibk-my-block.svg`,
                data: {
                    id:          variant.id.replace(`-${variant.viewMode}`, ''),
                    label:       variant.label,
                    description: variant.description,
                    preview:     `/assets/minimalist-blocks/preview/ibk-my-block.svg`,
                    html:        variant.html,
                    viewMode:    variant.viewMode,
                },
                createUserId: 'system', createUserName: '시스템',
            });
        }
    }
    await closePool();
}

main().catch((err: unknown) => { process.stderr.write(`실패: ${err}\n`); process.exit(1); });
```

### SVG 썸네일

**위치**: `public/assets/minimalist-blocks/preview/ibk-<name>.svg`

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 390 <높이>" width="390" height="<높이>">
  <rect width="390" height="<높이>" fill="#fff"/>
  <rect x="16" y="16" width="80" height="20" rx="4" fill="#0046A4"/>
  <text x="16" y="60" font-size="14" fill="#374151">컴포넌트 이름</text>
</svg>
```

권장 높이: 헤더/푸터 56–160px / 아이콘 그리드 200–320px / 카드/배너 200–240px

---

## Path B — 플러그인 (JS 의존)

### 체크리스트 (신규 생성)

```
□ 1. public/assets/plugins/<name>/style.css
□ 2. public/assets/plugins/<name>/index.js
□ 3. SVG 썸네일
□ 4. 마이그레이션 스크립트로 DB INSERT
□ 5. src/components/edit/EditClient.tsx — plugins 객체에 추가
□ 6. src/components/view/ViewClient.tsx — plugins 객체에 추가 (동일하게)
```

### EditClient.tsx / ViewClient.tsx 플러그인 등록

```ts
'<name>': {
    url: basePath + '/assets/plugins/<name>/index.js',
    css: basePath + '/assets/plugins/<name>/style.css',
},
```

### style.css 핵심 규칙

```css
[data-cb-type="<name>"] {
    container-type: inline-size; /* 필수 — Container Query 기반 반응형 */
    font-family: -apple-system, BlinkMacSystemFont, 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif;
    /* overflow: hidden 금지 */
}
[data-cb-type="<name>"] .my-class { ... }       /* 반드시 부모 선택자 앞에 붙임 */
@container (max-width: 360px) { ... }            /* viewport 아닌 컨테이너 기준 */
[data-cb-skin="dark"] [data-cb-type="<name>"] { background: #1F2937; }
```

### index.js 구조

```js
export default {
    name: '<name>',           // data-cb-type 값과 동일
    displayName: '표시 이름',
    version: '1.0.0',
    settings: {
        accentColor: { type: 'color', label: '포인트 색상', default: '#0046A4' },
    },
    editor: {
        openContentEditor: function(element, builder, onChange) {
            const container = document.createElement('div');
            // element: 캔버스의 [data-cb-type] 루트 DOM
            // onChange: 변경 시 반드시 호출
            return container; // 반드시 DOM 요소 반환
        }
    },
    mount: function(element, options) {
        return {}; // instance 객체
    },
    unmount: function(element, instance) {
        // mount에서 등록한 리스너 정리
    }
};
```

---

## 플러그인 → 순수 HTML 변환

### 절차

```
□ 1. public/assets/plugins/<name>/style.css + index.js 분석
□ 2. 순수 HTML 작성 (3 variant)
□ 3. 마이그레이션 스크립트 작성 후 실행 (updateComponent만 사용)
□ 4. EditClient.tsx + ViewClient.tsx plugins 객체에서 제거 ← 반드시
□ 5. 에디터에서 새로 드래그 → 더블클릭 인라인 편집 확인
□ 6. /view 렌더링 정상 확인
```

### HTML 변환 규칙

- `data-cb-type="<name>"` 속성 **제거**
- outer div에 `data-component-id` + `data-spw-block` **추가**
- `style.css` 클래스 스타일 + `mount()` 동적 주입 스타일 → 전부 inline `style=""` 로 이식
- 기본 이미지·색상 상수 → HTML에 하드코딩
- **슬라이더 포함 컴포넌트**: 스와이프 JS 제거 → flex/grid 정적 레이아웃으로 재구성

---

## 컴포넌트 수정 시 파일 매핑

### 순수 HTML 컴포넌트

| 수정 목적 | 파일 |
|-----------|------|
| 초기 드롭 HTML 변경 | `scripts/migrate-<name>-to-html.ts` 수정 → 재실행 |
| 커스텀 편집 UI 변경 | `src/components/edit/<Name>Editor.tsx` |
| 편집 진입 버튼 변경 | `src/components/edit/EditClient.tsx` |

> `public/assets/plugins/<name>/index.js`는 Runtime 등록에서 제거된 상태이므로 수정해도 반영 안 됨.

### 플러그인 컴포넌트

| 수정 목적 | 파일 |
|-----------|------|
| HTML / 편집 패널 UI | `public/assets/plugins/<name>/index.js` |
| 스타일 | `public/assets/plugins/<name>/style.css` |
| 초기 HTML도 바꾸려면 | 마이그레이션 스크립트 작성 후 실행 |

---

## 커스텀 편집 기능 구현

ContentBuilder 더블클릭으로 처리 불가한 경우만 (SVG 아이콘, iframe, select 등).

### 구현 체크리스트

```
□ 1. 블록 HTML에 <a> 태그 배치 (편집 진입점)
□ 2. src/components/edit/<Name>Editor.tsx 작성
□ 3. EditClient.tsx — injectCustomButtonsToLinkTool()에 버튼 추가
□ 4. EditClient.tsx — updateLinkToolBtnVisibility()에 가시성 로직 추가
□ 5. EditClient.tsx — React state 연결
```

### 진입 방식 3종

| 방식 | 대상 컴포넌트 | 조건 |
|------|--------------|------|
| `#divLinkTool` 버튼 주입 | 대부분의 컴포넌트 | `<a>` 클릭 시 ContentBuilder가 띄우는 툴바에 주입 |
| `.is-row-tool` 버튼 주입 | 슬라이드 편집 (`product-gallery`, `promo-banner`) | 행(row) 툴바에 주입 |
| `<select>` 캡처 클릭 | `select` 태그 포함 컴포넌트 (`site-footer`) | ContentBuilder가 `#divLinkTool`을 열지 않으므로 별도 감지 필요 |

### 편집 패널 컴포넌트 구조

```tsx
// src/components/edit/MyBlockEditor.tsx
'use client';

export default function MyBlockEditor({ blockEl, onClose }: { blockEl: HTMLElement; onClose: () => void }) {
    const handleApply = () => {
        // blockEl.querySelector(...)로 DOM 직접 수정
        // ContentBuilder는 Save 시 현재 DOM을 읽어 저장 → 별도 동기화 불필요
        onClose();
    };

    return (
        <>
            {/* 오버레이 */}
            <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 99998, background: 'rgba(0,0,0,0.35)' }} />
            {/* 패널 */}
            <div style={{ position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 360, zIndex: 99999, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}>
                {/* 헤더: padding:'12px 14px', borderBottom:'1px solid #f3f4f6', background:'#fafafa', borderRadius:'12px 12px 0 0' */}
                {/* 본문: padding:'14px 14px 10px' */}
                {/* 버튼 영역: padding:'10px 14px 14px', borderTop:'1px solid #f3f4f6' */}
            </div>
        </>
    );
}
```

### EditClient.tsx — 버튼 주입 패턴

`injectCustomButtonsToLinkTool` 함수에 추가:

```ts
const SPW_MY_BTN_CLASS = 'spw-my-btn';

if (!linkTool.querySelector(`.${SPW_MY_BTN_CLASS}`)) {
    const btn = document.createElement('button');
    btn.className = SPW_MY_BTN_CLASS;
    btn.title = '편집';
    btn.style.cssText = 'display:none;width:37px;height:37px;flex-shrink:0;justify-content:center;align-items:center;background:transparent;cursor:pointer;border:none;padding:0;';
    btn.innerHTML = `<svg width="17" height="17" viewBox="0 0 24 24" fill="#111">...</svg>`;
    btn.addEventListener('click', (e) => {
        e.stopPropagation(); e.preventDefault();
        const block =
            document.querySelector<HTMLElement>('.icon-active')?.closest<HTMLElement>('[data-component-id^="my-block"]') ??
            document.querySelector<HTMLElement>('.elm-active')?.closest<HTMLElement>('[data-component-id^="my-block"]');
        if (block) setMyBlock(block);
    });
    linkTool.appendChild(btn);
}
```

### EditClient.tsx — 가시성 제어 패턴

`updateLinkToolBtnVisibility` 함수에 추가:

```ts
const myBtn = document.querySelector<HTMLElement>(`#divLinkTool .${SPW_MY_BTN_CLASS}`);
if (myBtn) {
    const isIn = !!iconActive?.closest('[data-component-id^="my-block"]') || !!elmActive?.closest('[data-component-id^="my-block"]');
    myBtn.style.display = isIn ? 'flex' : 'none';
}
```

### EditClient.tsx — React state 연결

```tsx
const [myBlock, setMyBlock] = useState<HTMLElement | null>(null);
// JSX:
{myBlock && <MyBlockEditor blockEl={myBlock} onClose={() => setMyBlock(null)} />}
```

### `#divLinkTool` 버튼 스타일 규칙

| 속성 | 값 |
|---|---|
| width / height | `37px` |
| background | `transparent` |
| border | `none` |
| SVG fill | `#111`, size `17×17` |
| display 초기값 | `none` (가시성 로직에서 `flex`로 전환) |

### `<select>` 캡처 클릭 패턴

`<select>`는 ContentBuilder가 `#divLinkTool`을 열지 않으므로, `document` capture 단계에서 직접 감지합니다.

`useEffect` 안에서 등록:

```ts
const handleSelectClick = (e: MouseEvent) => {
    const select = (e.target as HTMLElement).closest<HTMLSelectElement>(
        '[data-component-id^="<name>"] select'
    );
    if (!select) return;
    e.preventDefault();
    e.stopPropagation();
    const block = select.closest<HTMLElement>('[data-component-id^="<name>"]');
    if (block) setMyBlock(block);
};
document.addEventListener('click', handleSelectClick, true); // capture: true 필수

// cleanup (return 함수 안):
document.removeEventListener('click', handleSelectClick, true);
```

이 진입 방식을 쓰는 패널은 **고정 오버레이 대신 드래그 가능한 플로팅 패널** 구조를 사용합니다:

```tsx
const [pos, setPos] = useState({ x: Math.max(8, window.innerWidth / 2 - 150), y: 80 });
const dragging = useRef(false);
const dragStart = useRef({ mx: 0, my: 0, px: 0, py: 0 });

const onHeaderMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button,input')) return;
    dragging.current = true;
    dragStart.current = { mx: e.clientX, my: e.clientY, px: pos.x, py: pos.y };
    e.preventDefault();
}, [pos]);

useEffect(() => {
    const onMove = (e: MouseEvent) => {
        if (!dragging.current) return;
        setPos({ x: dragStart.current.px + e.clientX - dragStart.current.mx,
                  y: dragStart.current.py + e.clientY - dragStart.current.my });
    };
    const onUp = () => { dragging.current = false; };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    return () => {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
    };
}, []);

// 패널 루트: position:'fixed', left:pos.x, top:pos.y (오버레이 없음)
// 헤더: onMouseDown={onHeaderMouseDown}, cursor:'grab', userSelect:'none'
```

### SVG 아이콘 색상 교체 패턴

피커 SVG는 `stroke="currentColor"`, 저장 HTML에는 실제 색상값 명시:

```ts
// buildIconHtml(key, color) 패턴
svgString.replace(/stroke="currentColor"/g, `stroke="${color}"`);
```

---

## 자주 하는 실수

**① 저장된 페이지 HTML 미업데이트**
마이그레이션 스크립트는 `SPW_CMS_COMPONENT`(컴포넌트 템플릿)만 업데이트한다.
이미 저장된 페이지(`SPW_CMS_PAGE`, `public/uploads/pages/*.html`)는 별도로 수정해야 한다.
→ 기존 블록 삭제 후 재추가하거나, 파일을 직접 수정한다.

**② `#divLinkTool`이 열리지 않음**
블록 안에 `<a>` 태그가 없거나, 저장된 페이지 HTML이 옛날 버전(`<div>` 사용)인 경우.

**③ Runtime 플러그인 중복 등록**
순수 HTML로 변환 완료된 컴포넌트를 `EditClient.tsx`의 `plugins` 객체에 계속 두면,
`reinitialize()` 시 재마운트되어 인라인 편집이 차단된다.
→ **변환 완료 즉시 `plugins` 객체에서 제거 필수.**

---

## 브랜드 토큰

| 용도 | 값 |
|---|---|
| 메인 파란색 | `#0046A4` |
| 파란 배경 | `#E8F0FC` |
| 텍스트 기본 | `#1A1A2E` |
| 텍스트 보조 | `#6B7280` |
| 구분선 | `#E5E7EB` |
| 연한 구분선 | `#F3F4F6` |
| 카드 배경 | `#F5F7FA` |
| 다크 배경 | `#1F2937` |
