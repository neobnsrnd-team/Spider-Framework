# 플러그인 컴포넌트 → 순수 HTML 변환 가이드

완성 예시: `scripts/migrate-app-header-to-html.ts`

---

## 절차

### 1. 플러그인 파일 분석

- `public/assets/plugins/<name>/style.css` — 모든 스타일 확인
- `public/assets/plugins/<name>/index.js` — `mount()` 동적 주입 스타일, DOM 구조, 기본값 상수 확인

### 2. 순수 HTML 작성 (3개 variant)

- `data-cb-type="<name>"` 속성 **제거**
- outer div에 아래 두 속성 **추가**:
  - `data-component-id="<name>-<viewmode>"` — DB `COMPONENT_ID`와 1:1 매핑, 승인 시 `PAGE_COMP_MAP` 추적에 사용 (예: `data-component-id="product-menu-mobile"`)
  - `data-spw-block` — `handleInsertComponent`가 감지해 컬럼에 `spw-finance-col` 클래스를 주입, 캔버스 전체 너비를 채운다
- CSS 클래스 스타일 전부 → inline `style=""` 로 이식
- `mount()`에서 동적 주입하던 스타일도 inline에 포함
- 기본 이미지·색상 상수는 HTML에 하드코딩

| variant | 차이점 |
|---------|--------|
| `mobile` | 작은 패딩·폰트·이미지 |
| `web` | 넓은 패딩, `max-width` + `margin:0 auto` |
| `responsive` | `width:100%;box-sizing:border-box` |

슬라이더 포함 컴포넌트(`product-gallery`, `promo-banner`)는 스와이프 JS 제거 → flex/grid 정적 레이아웃으로 재구성.

### 3. 마이그레이션 스크립트 작성

`scripts/migrate-<name>-to-html.ts`

```ts
import 'dotenv/config';
import { getComponentById, updateComponent } from '../src/db/repository/component.repository';
import { closePool } from '../src/db/connection';

const MOBILE_HTML    = `...`;
const WEB_HTML       = `...`;
const RESPONSIVE_HTML = `...`;

const VARIANTS = [
    { id: '<name>-mobile',     html: MOBILE_HTML },
    { id: '<name>-web',        html: WEB_HTML },
    { id: '<name>-responsive', html: RESPONSIVE_HTML },
];

async function main() {
    for (const variant of VARIANTS) {
        const existing = await getComponentById(variant.id);
        if (!existing) {
            console.error(`❌ ${variant.id} — 찾을 수 없음`);
            continue;
        }
        await updateComponent({
            componentId:        variant.id,
            componentType:      existing.COMPONENT_TYPE,
            viewMode:           existing.VIEW_MODE,
            componentThumbnail: existing.COMPONENT_THUMBNAIL ?? undefined,
            data: { ...(existing.DATA ?? {}) as Record<string, unknown>, html: variant.html },
            lastModifierId: 'system',
        });
        console.log(`✅ ${variant.id} 완료`);
    }
    await closePool();
}

main().catch((err) => { console.error('실패:', err); process.exit(1); });
```

**주의**: `componentType`, `viewMode`는 반드시 기존값을 전달해야 한다. 생략하면 `null`로 덮어써진다.

### 4. 실행

```bash
npx tsx scripts/migrate-<name>-to-html.ts
```

### 5. 확인

- 에디터에서 해당 컴포넌트를 패널에서 **새로 드래그** → 더블클릭 인라인 편집 가능 여부
- `/view` 렌더링 정상 여부

> 기존 저장 페이지의 블록은 마이그레이션 대상이 아니다. 해당 블록은 삭제 후 새로 추가해야 한다.

---

## SVG 아이콘 등 구조화 콘텐츠가 있는 컴포넌트

ContentBuilder 인라인 편집(더블클릭)만으로는 수정이 불가능한 구조화 콘텐츠(예: 인라인 SVG 아이콘)가 있는 경우, 커스텀 편집 모달을 추가로 구현한다.

**완성 예시**: `product-menu` — `src/components/edit/ProductMenuIconEditor.tsx`

### 구현 패턴

1. **커스텀 편집 모달** (`src/components/edit/<Name>Editor.tsx`)
   - DOM을 직접 수정하는 방식 (ContentBuilder가 저장 시 DOM을 읽음)
   - `blockEl: HTMLElement` prop으로 대상 블록을 받아 직접 조작

2. **ContentBuilder 툴바 버튼 주입** (`EditClient.tsx`)
   - `<a>` 태그 클릭 시 ContentBuilder가 띄우는 `#divLinkTool`에 버튼을 주입
   - `MutationObserver`로 `#divLinkTool` 추가 감지 → 버튼 1회 주입
   - `.icon-active` / `.elm-active` 클래스 변화로 표시/숨김 제어
   - 버튼 스타일: `width:37px; height:37px; background:transparent; fill:#111` (`#divLinkTool` 기존 버튼과 통일)

3. **SVG stroke 색상 교체**
   - 피커의 SVG는 `stroke="currentColor"`로 작성하고, 저장 HTML에는 실제 색상값을 명시
   - `buildIconHtml(key, color)` 패턴: `stroke="currentColor"` → `stroke="${color}"` 치환
