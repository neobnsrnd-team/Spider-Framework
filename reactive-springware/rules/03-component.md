# 03-component.md — 컴포넌트 사용 및 레이아웃 변환

## 목적

Claude가 UI 생성 시 반드시 @neobnsrnd-team/reactive-springware만 사용하도록 강제하고,
Figma 레이아웃 구조를 React 레이아웃 컴포넌트로 올바르게 변환하는 규칙을 정의한다.

이 규칙이 없으면 HTML 태그가 남발되거나 레이아웃이 깨진다.

---

# 1. HTML 태그 직접 사용 금지

다음 태그는 절대 사용하지 않는다.

❌ `div`, `span`, `p`
❌ `h1`, `h2`, `h3`, `h4`, `h5`, `h6`
❌ `input`, `button`, `select`, `textarea`
❌ `table`, `thead`, `tbody`, `tr`, `th`, `td`
❌ `a`, `img`, `svg`, `ul`, `li`

---

# 2. 허용 UI 컴포넌트 목록

`@neobnsrnd-team/reactive-springware`에서 제공하는 컴포넌트만 사용한다.
아래 목록에 없는 컴포넌트는 `11-component-props.md`를 확인한 후 사용한다.

**레이아웃**

```
HomePageLayout      ← 홈 화면 전용 레이아웃 (헤더 + 인사말 + 스크롤 본문)
PageLayout          ← 일반 페이지 레이아웃 (헤더 + 뒤로가기)
Section             ← SectionHeader + 콘텐츠를 수직으로 묶는 레이아웃 (title / gap)
Stack               ← 수직 레이아웃 (gap prop 사용)
Inline              ← 수평 레이아웃 (Row 대체. gap / justify / align prop 사용)
Grid                ← 그리드 레이아웃 (cols prop 사용)
Card                ← 테두리 있는 컨테이너
```

**입력**

```
Button
Input                ← label / leftIcon / formatPattern 등 (SearchInput, TextField 없음)
Select
```

**표시**

```
Text (Typography)   ← variant로 heading/body/caption 등 구분
Badge
AlertBanner         ← 인라인 경고·안내 배너
EmptyState          ← 데이터 없음 상태 (title / description / action)
ErrorState          ← API 오류 상태 (description / onRetry)
```

**Biz 컴포넌트**

```
AccountSummaryCard  ← 계좌 잔액 + 버튼
AccountSelectorCard ← 계좌 선택·변경
QuickMenuGrid       ← 퀵메뉴 그리드
BrandBanner         ← 브랜드 배경 배너
BannerCarousel      ← 슬라이드 배너
BottomNav           ← 하단 탭바
TabNav              ← 상단 탭 네비게이션
SectionHeader       ← 섹션 제목 + 뱃지 + 액션
CollapsibleSection  ← 접기/펼치기 섹션
InfoRow             ← 라벨+값 (string만)
LabelValueRow       ← 라벨+값 (JSX 허용)
```

---

# 3. 컴포넌트 선택 우선순위

```
1순위: @neobnsrnd-team/reactive-springware 컴포넌트
2순위: @neobnsrnd-team/reactive-springware 컴포넌트 + props 조합
3순위: docs/component-map.md에서 가장 유사한 컴포넌트 선택
```

`docs/component-map.md`에 없다고 임의 컴포넌트를 새로 만들지 않는다.

---

# 4. Layout Component 사용 규칙

layout은 반드시 @neobnsrnd-team/reactive-springware의 layout 컴포넌트를 사용한다.
`div`로 layout을 구성하지 않는다.
Page → Layout → Section → Component 계층을 유지한다.

**허용:**

```
HomePageLayout / PageLayout
Stack       ← 수직 (gap prop)
Inline      ← 수평 (gap / justify / align prop). Row 대신 사용
Grid        ← 그리드 (cols prop)
Card        ← 테두리 있는 컨테이너
```

**금지:**

```
div
Row         ← 존재하지 않음. Inline 사용
Column      ← 존재하지 않음. Stack 사용
flex 직접 작성
grid 직접 작성
```

GOOD

```tsx
<Stack gap="md">
  <Inline gap="sm">
    <Button variant="primary" />
    <Button variant="outline" />
  </Inline>
</Stack>
```

BAD

```tsx
<div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
  <div style={{ display: 'flex', gap: 8 }}>
    <button>저장</button>
    <button>취소</button>
  </div>
</div>
```

---

# 5. PageLayout 구조

Page 타입에 따라 레이아웃 컴포넌트를 구분하여 사용한다.

**일반 페이지** (헤더 + 뒤로가기)

```tsx
<PageLayout title="페이지 제목" onBack={() => {}}>
  <Stack gap="md">{/* 컴포넌트 */}</Stack>
</PageLayout>
```

**홈 화면** (로고 헤더 + 인사말 + BottomNav)

```tsx
<>
  <HomePageLayout title="..." logo={<Logo />} greeting="..." withBottomNav>
    <Stack gap="md">
      {/* 컴포넌트 */}
    </Stack>
  </HomePageLayout>
  <BottomNav items={...} activeId={...} />  {/* 반드시 바깥에 배치 */}
</>
```

---

# 6. Figma Auto Layout 변환 규칙

Figma Auto Layout → React 컴포넌트 변환 기준 및 Spacing 토큰 변환표는 `rules/07-figma.md`를 참고한다.

---

# 7. 자주 쓰는 레이아웃 패턴

## 검색 + 목록 패턴

```tsx
<PageLayout title="...">
  <Stack gap="md">
    <Input leftIcon={<Search size={16} />} />
    <TransactionList items={data} />
  </Stack>
</PageLayout>
```

## 카드 그리드 패턴

```tsx
<PageLayout title="...">
  <Inline gap="md">
    <Card />
    <Card />
    <Card />
  </Inline>
</PageLayout>
```

## 폼 패턴

```tsx
<PageLayout title="{pageTitle}">
  <Stack gap="lg">
    <Stack gap="sm">
      <Input label="..." />
      <Input label="..." />
      <Select />
    </Stack>
    <Inline justify="end">
      <Button variant="outline">취소</Button>
      <Button variant="primary">저장</Button>
    </Inline>
  </Stack>
</PageLayout>
```

## 홈 화면 패턴 (BottomNav 포함)

```tsx
<>
  <HomePageLayout title="..." logo={<Logo />} greeting="..." withBottomNav>
    <Stack gap="md">
      <AccountSummaryCard ... />
      <QuickMenuGrid ... />
    </Stack>
  </HomePageLayout>
  {/* BottomNav는 반드시 HomePageLayout 바깥에 배치 */}
  <BottomNav items={...} activeId={...} />
</>
```

---

# 9. 아이콘 구성 규칙

아이콘은 반드시 `lucide-react` 라이브러리에서 import해서 사용한다.
SVG를 직접 작성하거나 이미지 파일로 아이콘을 표시하지 않는다.

GOOD

```tsx
import { Search, X, ChevronDown } from "lucide-react";

<Search size={20} />
<X size={16} />
<ChevronDown className="icon-chevron" />
```

BAD

```tsx
<svg>...</svg>
<img src="search-icon.svg" />
<Icon name="search" />
```

---

# 10. 반복 UI 규칙

반복 UI는 Component 기반으로 작성하고 반드시 `key`를 포함한다.

GOOD

```tsx
{
  items.map((item) => (
    <Card key={item.id}>
      <Typograpy>{item.name}</Typograpy>
    </Card>
  ));
}
```

BAD

```tsx
{
  items.map((item) => (
    <div key={item.id} className="card">
      <p>{item.name}</p>
    </div>
  ));
}
```

---

# 11. 스타일 규칙

스타일 직접 작성 금지

**금지:**

```
style={{ }}                      ← inline style 전면 금지
임의 색상값 (#fff, rgba 등)       ← 하드코딩 금지
임의 수치 (px, rem 직접 입력)     ← 하드코딩 금지
className="text-[#333] mt-[20px]" ← 임의 값 Tailwind 금지
```

**허용:**

```
Component props (variant, size, gap 등)
디자인 토큰 기반 Tailwind 유틸리티 클래스
  예: className="px-standard pb-standard"  ← 토큰 기반이므로 허용
```

---

# 12. Import 규칙

모든 UI 컴포넌트는 Component Library에서 import

```ts
import { Button, Input, Select } from '@neobnsrnd-team/reactive-springware';
import { Stack, Inline, Grid, Card } from '@neobnsrnd-team/reactive-springware';
import { Text } from '@neobnsrnd-team/reactive-springware';
import { Search, X, ChevronDown } from 'lucide-react'; // 아이콘은 lucide-react에서 직접 import
```

파일 내 import 순서:

```
1. component-library
2. lucide-react (아이콘)
3. hooks
4. repositories
5. types
```

---

# 13. Props 설계 규칙

Props는 최소화한다. 불필요하게 많은 props는 컴포넌트의 역할이 불분명하다는 신호다.
`variant`, `size` 같은 열거형 props를 사용하고, boolean을 나열하는 방식은 피한다.

GOOD

```tsx
<Button variant="primary" size="lg" disabled={isLoading} />
```

BAD

```tsx
{
  /* boolean 나열 */
}
<Button primary large rounded outlined />;

{
  /* 의미 불명확한 props 과다 */
}
<Button type1 type2 big small active />;
```

---

# 14. 애니메이션 처리 원칙

Claude는 애니메이션을 임의로 추가하지 않는다.
외부 애니메이션 라이브러리 추가는 설계 의도·번들 크기·디자인 시스템 일관성을 훼손한다.

## 허용

```tsx
// design-tokens에 정의된 transition 토큰 기반 Tailwind 유틸리티
className="transition-colors duration-150"
className="transition-opacity duration-200"
className="transition-transform duration-150"
```

## 금지

```
framer-motion, react-spring, react-transition-group 등 외부 라이브러리 추가
@keyframes 직접 작성
JavaScript 기반 애니메이션 로직을 Page/Component에 작성
style={{ transition: '...' }} — inline style 전면 금지
```

## Figma Smart Animate 처리

Figma 디자인에 Smart Animate (전환 효과) 가 있는 경우:

→ 임의로 구현하지 말고 **개발자에게 확인 후 진행** (rules/09-confirmation.md)

---

# 핵심 체크리스트

✔ HTML 직접 사용 금지
✔ Component Library 사용
✔ 레이아웃 컴포넌트 사용 (Stack 수직 / Inline 수평 / Grid)
✔ 스타일 직접 작성 금지
✔ 텍스트 Text 컴포넌트 사용 (Typography 아님)
✔ 아이콘 lucide-react에서 import
✔ 반복 UI에 key 포함
✔ Page → Layout → Section → Component 계층 유지
✔ Figma Auto Layout 변환 기준 → `rules/07-figma.md` 참고
