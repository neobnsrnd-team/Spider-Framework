# 컴포넌트 신규 추가 체크리스트

`component-library/`에 새 컴포넌트를 추가할 때 반드시 아래 항목을 순서대로 완료한다.

---

## 1. component-library 파일 생성

컴포넌트 카테고리에 맞는 위치에 폴더를 만들고 파일 3개를 생성한다.

```
component-library/
  {카테고리}/{ComponentName}/
    index.tsx                    ← 컴포넌트 구현
    types.ts                     ← Props 타입 정의
    {ComponentName}.stories.tsx  ← Storybook 스토리
```

**카테고리 분류 기준**

| 카테고리 | 위치 | 기준 |
|---|---|---|
| core | `core/` | 단일 HTML 요소 수준, 자체 상태 없음 (Button, Badge, Input 등) |
| layout | `layout/` | 페이지 전체 구조 담당 (PageLayout, Stack, Grid 등) |
| modules/common | `modules/common/` | 2개 이상 core 조합, 도메인 무관 (Modal, Card, TabNav 등) |
| modules/banking | `modules/banking/` | 뱅킹 전용 모듈 (TransferForm, NumberKeypad 등) |
| biz/common | `biz/common/` | 도메인 무관 비즈니스 컴포넌트 (BannerCarousel, UserProfile 등) |
| biz/banking | `biz/banking/` | 뱅킹 도메인 특화 (AccountSummaryCard 등) |
| biz/card | `biz/card/` | 카드 도메인 특화 (CardVisual, CardPaymentItem 등) |
| biz/insurance | `biz/insurance/` | 보험 도메인 특화 (InsuranceSummaryCard 등) |

---

## 2. component-library/index.ts export 추가

카테고리 순서에 맞는 위치에 export 구문을 추가한다.

```ts
export * from './{카테고리}/{ComponentName}';
```

---

## 3. react-cms/src/cms-meta 등록

컴포넌트 성격에 따라 아래 세 파일 중 하나에 등록한다.

### 분류 기준

| 성격 | 등록 파일 | 기준 |
|---|---|---|
| 일반 UI 컴포넌트 | `blocks.tsx` | 페이지 콘텐츠 영역에 배치되는 컴포넌트 (대부분의 컴포넌트) |
| 페이지 레이아웃 | `layouts.tsx` | 페이지 전체를 감싸는 구조 (헤더·푸터 포함, LayoutTemplate) |
| 오버레이 | `overlays.tsx` | 화면 위에 뜨는 컴포넌트 (BottomSheet, Modal 계열, OverlayTemplate) |

---

### blocks.tsx — BlockDefinition 추가

```tsx
const {ComponentName}Definition: BlockDefinition = {
  meta: {
    name: "{ComponentName}",
    category: "core" | "biz" | "modules",  // 컴포넌트 카테고리
    domain: "common" | "banking" | "card" | "insurance",  // 해당되는 경우
    defaultProps: {
      // Props 기본값
    },
    propSchema: {
      // CMS Inspector에서 편집 가능한 속성 정의
      // type: "string" | "number" | "boolean" | "select" | "array" | "group" | "event" | "icon-picker"
    },
  },
  component: (p) => <ComponentName {...p} />,
};
```

### layouts.tsx — LayoutTemplate 추가

페이지 전체를 감싸는 레이아웃 컴포넌트일 때만 추가한다.

```ts
{
  id: "{layoutId}",
  label: "{표시 이름}",
  description: "{설명}",
  componentName: "{ComponentName}",
  defaultProps: { /* 기본값 */ },
  propSchema: { /* CMS Inspector 속성 */ },
  renderer: (p) => ({
    header: <HeaderComponent {...p} />,
    footer: <FooterComponent {...p} />,  // 없으면 생략
  }),
}
```

### overlays.tsx — OverlayTemplate 추가

화면 위에 오버레이로 뜨는 컴포넌트일 때만 추가한다.
portal 타깃을 `container` prop으로 교체해야 CMS 미리보기 영역 안에서 올바르게 렌더링된다.

```tsx
function {ComponentName}Renderer({ open, onClose, children, container, props }: OverlayRendererProps) {
  if (!open) return null;
  return (
    <ComponentName
      open={open}
      onClose={onClose}
      container={container ?? undefined}
      {...props}
    >
      {children}
    </ComponentName>
  );
}

// overlays 배열에 추가
{
  id:            "tpl_{componentId}",
  label:         "{표시 이름}",
  description:   "{설명}",
  type:          "{ComponentName}",
  componentName: "{ComponentName}",
  blocks:        [],
  props:         { /* 기본값 */ },
  propSchema:    { /* CMS Inspector 속성 */ },
  renderer:      {ComponentName}Renderer,
}
```

---

## 체크리스트 요약

| 항목 | 파일 |
|---|---|
| ☐ 컴포넌트 구현 | `component-library/{카테고리}/{ComponentName}/index.tsx` |
| ☐ Props 타입 정의 | `component-library/{카테고리}/{ComponentName}/types.ts` |
| ☐ Storybook 스토리 | `component-library/{카테고리}/{ComponentName}/{ComponentName}.stories.tsx` |
| ☐ 라이브러리 export | `component-library/index.ts` |
| ☐ CMS 등록 | `react-cms/src/cms-meta/blocks.tsx` 또는 `layouts.tsx` 또는 `overlays.tsx` |
