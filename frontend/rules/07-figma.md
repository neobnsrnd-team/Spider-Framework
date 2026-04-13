# 07-figma.md — Figma 해석 기준

## 목적

Figma UI를 Claude가 정확하게 해석하여 React 코드로 생성할 수 있도록
Auto Layout 변환 기준, 컴포넌트 매핑, 화면 패턴별 구조를 정의한다.

---

# 1. Figma Auto Layout → React 컴포넌트 변환표

| Figma                          | React                                    |
| ------------------------------ | ---------------------------------------- |
| Auto Layout (Vertical)         | `<Stack gap="..." />`                    |
| Auto Layout (Horizontal)       | `<Inline gap="..." />`                   |
| Grid Layout (N열)              | `<Grid cols={N} />`                      |
| 테두리 있는 컨테이너           | `<Card />`                               |
| 섹션 제목 + 하위 콘텐츠        | `<Section title="..." />`                |
| 섹션 제목 행만 (제목+액션)     | `<SectionHeader title="..." />`          |
| 전체 페이지 (헤더+뒤로가기)    | `<PageLayout title="..." />`             |
| 홈 화면 (로고+인사말)          | `<HomePageLayout title="..." />`         |
| 헤더 없는 전체 화면 (로그인/온보딩) | `<BlankPageLayout align="top\|center" />` |

> ❌ `<Stack direction="vertical" />` — Stack에 direction prop 없음. 기본값이 수직
> ❌ `<Stack direction="horizontal" />` — 수평은 `Inline` 사용
> ❌ `<Grid columns={N} />` — prop명은 `cols`
> ❌ `<Row />` `<Column />` — 존재하지 않음. 각각 Inline, Stack 사용

---

# 2. Spacing 토큰 변환표

전체 spacing 토큰과 px 값 목록. (`spacing` prop은 존재하지 않음)

| px   | 토큰         | gap prop       | 주요 용도                              |
| ---- | ------------ | -------------- | -------------------------------------- |
| 0px  | `0`          | —              | 간격 초기화                            |
| 1px  | `px`         | —              | 1px 구분선 여백                        |
| 4px  | `xs`         | ✅ `gap="xs"` | 밀집 요소 간격                         |
| 8px  | `sm`         | ✅ `gap="sm"` | 기본 소형 간격                         |
| 12px | `md`         | ✅ `gap="md"` | 기본 중형 간격                         |
| 16px | `standard`   | —              | 페이지 좌우 패딩 전용 (`px-standard`)  |
| 20px | `lg`         | ✅ `gap="lg"` | 섹션 내 여백                           |
| 24px | `xl`         | ✅ `gap="xl"` | 섹션 간 여백                           |
| 32px | `2xl`        | ✅ `gap="2xl"`| 대형 블록 간격                         |
| 40px | `3xl`        | —              | 특수 대형 여백                         |
| 48px | `4xl`        | —              | 특수 대형 여백                         |
| 80px | `nav`        | —              | 네비게이션 바 높이 전용                |

> `gap` prop 허용 타입(`StackGap`): `xs | sm | md | lg | xl | 2xl`
> `standard`, `0`, `px`, `3xl`, `4xl`, `nav`는 gap prop으로 사용 불가 — `className="gap-standard"` 등 Tailwind 클래스로만 사용

GOOD

```tsx
{/* Figma: Vertical Auto Layout, gap 12px */}
<Stack gap="md">
  <Input leftIcon={<Search size={16} />} />
  <TransactionList items={data} />
</Stack>
```

BAD

```tsx
{/* direction / spacing prop은 존재하지 않음 */}
<Stack direction="vertical" spacing="md">...</Stack>

{/* div + 인라인 스타일 금지 */}
<div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>...</div>
```

---

# 3. Layout 컴포넌트 목록

Figma 레이아웃을 React로 변환할 때 사용하는 컴포넌트 전체 목록.

```
AppBrandHeader   ← 로그인/온보딩 화면 상단 브랜드 헤더 (brandInitial, brandName prop)
PageLayout       ← 일반 페이지 (헤더 + 뒤로가기, title과 onBack prop)
BlankPageLayout  ← 헤더 없는 빈 레이아웃 (로그인 화면, align="top|center" prop)
HomePageLayout   ← 홈 화면 전용 (헤더 + 인사말 + 스크롤 본문, withBottomNav prop)
BottomNav        ← 홈 화면 하단 탭바 (items, activeId prop)
Section          ← SectionHeader + 콘텐츠 묶음 (title 있을 때 SectionHeader 자동 포함)
Stack            ← Vertical Auto Layout (gap="xs|sm|md|lg|xl|2xl", align prop)
Inline           ← Horizontal Auto Layout (gap="xs|sm|md|lg|xl|2xl", justify, align prop)
Grid             ← Grid Layout (cols={1|2|3|4}, tabletCols prop)
Card             ← 테두리 있는 컨테이너 (interactive 속성 선택)
```

**사용하지 않는 컴포넌트:**

```
❌ BlankLayout   — 존재하지 않음 (BlankPageLayout 사용)
❌ HomeLayout    — 존재하지 않음 (HomePageLayout 사용)
❌ Row           — 존재하지 않음 (Inline 사용)
❌ Column        — 존재하지 않음 (Stack 사용)
❌ ButtonGroup   — 존재하지 않음 (Inline justify="end" 사용)
❌ FilterBar     — 존재하지 않음 (Section 또는 Stack 사용)
```

---

# 4. Frame 구조 규칙

페이지는 반드시 Frame 구조로 설계한다.

## 일반 페이지 구조

```
Page (Figma Frame)
 ├─ Header
 ├─ Content
 └─ Footer (선택)
```

→ Claude 해석:

```tsx
<PageLayout title="페이지 제목" onBack={() => {}}>
  <Stack gap="md">
    {/* 콘텐츠 */}
  </Stack>
</PageLayout>
```

## 섹션 분리 구조

```
Page
 ├─ FilterSection
 ├─ ContentSection
 └─ ActionSection
```

→ Claude 해석:

```tsx
<PageLayout title="...">
  <Stack gap="lg">
    <Section gap="sm">
      {/* 필터 UI */}
    </Section>
    <Section title="목록">
      {/* 콘텐츠 목록 */}
    </Section>
    <Inline justify="end" gap="sm">
      <Button variant="outline">취소</Button>
      <Button variant="primary">확인</Button>
    </Inline>
  </Stack>
</PageLayout>
```

---

# 5. Naming 규칙 (매우 중요)

Claude는 레이어·프레임 이름을 기반으로 UI를 해석한다.
이름이 없으면 의도를 파악할 수 없다.

## Page

```
UserListPage
TransactionHistoryPage
TransferPage
```

## Section

```
HeaderSection
FilterSection
ContentSection
ActionSection
```

## Layout

```
PageLayout
Stack
Inline      ← Row/Column 대신 사용
Grid
```

## UI Component

```
AccountSummaryCard
TransactionList
Input (leftIcon으로 검색 입력 구현)
SectionHeader
```

---

# 6. 페이지 타입 판단 기준

Figma UI 구조를 보고 어떤 React 화면인지 판단하는 기준을 정의한다.

## Figma 분석 순서

Figma를 분석할 때 아래 순서로 판단한다.

1. **전체 레이아웃 구조 파악**
   1) **Page 구조 결정** (page / modal / bottomsheet)
   2) **Page 타입 결정** (dashboard / detail / login / list / form)
2. **반복 패턴 감지** — List / Grid 여부
3. **입력 요소 감지** — Form 여부
4. **개별 컴포넌트 매핑** — 8번 섹션 Component Library 연동 규칙 참조

### 1-1) Page 구조 결정

Figma 프레임의 최상위 구조를 보고 page / modal / bottomsheet 중 어떤 구조인지 먼저 판단한다.

| 구조 | Figma 특징 | React 컴포넌트 |
|------|-----------|---------------|
| **page** | 전체 화면을 차지하는 프레임. 상단에 헤더(뒤로가기 + 타이틀)가 있고 하단까지 콘텐츠가 이어진다. | `<PageLayout title="..." onBack={...}>` |
| **bottomsheet** | 화면 하단에서 올라오는 부분 오버레이. 상단에 시트 타이틀이 있고 배경이 딤(dim) 처리된다. 콘텐츠 높이가 화면 전체보다 작다. | `<BottomSheet open={...} onClose={...} title="...">` |
| **modal** | // TODO: 추후 Figma 예시 추가 후 보완 예정 | `<Modal isOpen={...} onClose={...}>` |

**page 판단 기준:**
- `PageLayout` 사용 — 헤더(뒤로가기 아이콘 + 타이틀 텍스트) + 전체 화면 콘텐츠 영역
- 필요 시 `rightAction`(우측 메뉴 버튼), `bottomBar`(하단 고정 버튼) 포함
- 예: `AccountDetailPage`, `TransferInputPage`

**bottomsheet 판단 기준:**
- `BottomSheet` 사용 — `open`/`onClose`/`title` props 필수
- 화면 하단에서 슬라이드업되는 부분 오버레이 형태
- 선택 목록, 비밀번호 입력 등 특정 작업 완료 후 닫히는 플로우에 사용
- 필요 시 `footer`(하단 CTA 버튼) 포함
- 예: `AccountPasswordPage`(PIN 입력), `AccountSelectPage`(계좌 선택)

**modal 판단 기준:**
- // TODO: Modal 사용 Figma 예시가 추가되면 보완 예정
- `Modal` 사용 — `isOpen`/`onClose` props 필수
- 화면 중앙 팝업 형태의 오버레이

### 1-2) Page 타입 결정

Page 구조가 결정되면 아래 기준으로 Page 타입을 판단한다.

## List Page

다음 패턴이 감지되면 List Page로 판단한다.

| Figma 패턴 | React 변환 |
|------------|-----------|
| 같은 Row가 반복됨 | `<TransactionList />` 또는 `<Stack gap="sm">` + `map()` |
| 카드가 격자로 반복됨 | `<Stack gap="sm">` + `<Card />` 반복 |
| 검색 + 필터 + 목록 구조 | List Page |
| 상단 검색바 + 하단 결과 | 검색 결과 List Page |

생성 파일:

```
{Entity}ListPage.tsx
use{Entity}List.ts
{entity}Repository.ts
{entity}Types.ts
```

## Detail Page

다음 패턴이 감지되면 Detail Page로 판단한다.

| Figma 패턴 | React 변환 |
|------------|-----------|
| 라벨 + 값이 세로로 나열됨 | `<LabelValueRow />` |
| 라벨 + 값이 가로 한 줄 | `<InfoRow />` |
| 제목 + 본문 구조 | Detail Page |
| 탭으로 구분된 상세 정보 | `<TabNav />` + Tabbed Detail Page |

생성 파일:

```
{Entity}DetailPage.tsx
use{Entity}Detail.ts
{entity}Repository.ts
{entity}Types.ts
```

## Form Page

다음 패턴이 감지되면 Form Page로 판단한다.

| Figma 패턴 | React 변환 |
|------------|-----------|
| 입력 필드가 여러 개 나열됨 | Form Page |
| 라벨 + Input 조합 반복 | `<Input label="..." />` 반복 |
| 저장/취소 버튼이 하단에 위치 | Form Page |
| 드롭다운 + 날짜 + 텍스트 혼합 | `<Select />` + `<DatePicker />` + `<Input />` |

생성 파일:

```
{Entity}CreatePage.tsx 또는 {Entity}EditPage.tsx
use{Entity}Form.ts
{entity}Repository.ts
{entity}Types.ts
```

## Dashboard Page

다음 패턴이 감지되면 Dashboard Page로 판단한다.

| Figma 패턴 | React 변환 |
|------------|-----------|
| 숫자/통계 카드가 상단에 나열됨 | `<Card />` + 커스텀 통계 컴포넌트 |
| 여러 위젯이 격자로 배치됨 | `<Grid cols={...}>` + Dashboard Page |

> ⚠️ `StatCard`, `Chart` 컴포넌트는 라이브러리에 없다. Dashboard 구현 시 개발자에게 확인 후 진행한다.

---

# 7. 화면 패턴별 구조

## 목록 화면

```
Page
 ├─ FilterSection   ← Input(검색) + Select
 └─ ContentSection  ← 항목 목록
```

→ Claude 해석:

```tsx
<PageLayout title="...">
  <Stack gap="md">
    <Section gap="sm">
      <Input leftIcon={<Search size={16} />} onChange={(e) => handleFilterChange('keyword', e.target.value)} />
    </Section>
    <Section title="목록">
      {data.map((item) => (
        <Card key={item.id}>...</Card>
      ))}
    </Section>
  </Stack>
</PageLayout>
```

## 폼 화면

```
Page
 ├─ FormSection
 └─ ActionSection
```

→ Claude 해석:

```tsx
<PageLayout title="...">
  <Stack gap="lg">
    <Stack gap="sm">
      <Input label="이름" />
      <Input label="금액" />
      <Select options={...} value={...} onChange={...} />
    </Stack>
    <Inline justify="end" gap="sm">
      <Button variant="outline">취소</Button>
      <Button variant="primary">저장</Button>
    </Inline>
  </Stack>
</PageLayout>
```

## 카드형 화면

```
Page
 └─ CardList
```

→ Claude 해석:

```tsx
<PageLayout title="...">
  <Stack gap="sm">
    {items.map((item) => (
      <Card key={item.id} interactive onClick={() => {}}>
        ...
      </Card>
    ))}
  </Stack>
</PageLayout>
```

## 홈 화면

```
Page
 ├─ AccountSection
 ├─ QuickMenuSection
 ├─ BannerSection
 └─ BottomNav
```

→ Claude 해석:

```tsx
<>
  <HomePageLayout title="..." logo={<Logo />} greeting="..." withBottomNav>
    <Stack gap="md">
      <AccountSummaryCard ... />
      <QuickMenuGrid items={...} />
      <BannerCarousel items={...} />
    </Stack>
  </HomePageLayout>
  {/* BottomNav는 반드시 HomePageLayout 바깥에 배치 */}
  <BottomNav items={...} activeId={...} />
</>
```

---

# 8. Component Library 연동 규칙

Figma 컴포넌트와 실제 컴포넌트 라이브러리 매핑.

각 컴포넌트에 명시된 variant / props는 **Figma 디자인에서 구현된 실제 옵션**입니다.
표의 예시를 정확히 따라야 하며, 정의되지 않은 variant는 사용할 수 없습니다.

## Core 컴포넌트

| Figma | React 컴포넌트 |
|------|---|
| Primary Button / Outline Button / Ghost Button / Danger Button | `<Button variant="primary\|outline\|ghost\|danger" size="sm\|md\|lg" />` |
| Button with Loading | `<Button variant="..." loading />` |
| Icon-only Button | `<Button variant="..." iconOnly />` |
| Small Input | `<Input />` |
| Search Input | `<Input leftIcon={<Search size={16} />} />` |
| Dropdown Select | `<Select options={...} value={...} onChange={...} />` |
| Small Badge / Brand Badge / Success / Danger / Warning / Neutral | `<Badge variant="primary\|brand\|success\|danger\|warning\|neutral" />` |
| Dot Badge | `<Badge dot />` |
| Text (xs / sm / base / lg / xl / 2xl / 3xl / 4xl) | `<Text variant="..." />` |
| Plain Card | `<Card />` |
| Interactive Card | `<Card interactive onClick={...} />` |

## Layout 컴포넌트

| Figma | React 컴포넌트 |
|------|---|
| 로그인/온보딩 헤더 | `<AppBrandHeader brandInitial="H" brandName="하나은행" />` |
| 페이지 헤더 (뒤로가기 + 제목) | `<PageLayout title="..." onBack={...}>` |
| 헤더 없는 전체 화면 | `<BlankPageLayout align="top\|center">` |
| 홈 화면 (헤더 + 본문) | `<HomePageLayout title="..." logo={...} withBottomNav>` |
| 홈 화면 하단 탭바 | `<BottomNav items={[...]} activeId={...} />` |
| 섹션 (제목 포함) | `<Section title="..." gap="xs\|sm\|md\|lg\|xl">` |
| 섹션 헤더 행 | `<SectionHeader title="..." actionLabel="..." onAction={...} />` |
| 수직 자동 레이아웃 | `<Stack gap="xs\|sm\|md\|lg\|xl\|2xl" align="start\|center\|end\|stretch">` |
| 수평 자동 레이아웃 | `<Inline gap="xs\|sm\|md\|lg\|xl\|2xl" justify="start\|center\|end\|between\|around\|evenly" align="start\|center\|end\|baseline\|stretch">` |
| 격자 2열 / 3열 / 4열 | `<Grid cols={2\|3\|4} gap="..." tabletCols={...}>` |
| 테두리 있는 박스 | `<Card />` |

## 모듈 컴포넌트

| Figma | React 컴포넌트 |
|------|---|
| 라벨 + 값 세로 나열 | `<LabelValueRow label="..." value="..." />` |
| 라벨 + 값 가로 한 줄 | `<InfoRow label="..." value="..." />` |
| 구분선 | `<Divider />` |
| 텍스트 라벨 구분선 | `<DividerWithLabel label="..." />` |
| 날짜 선택기 | `<DatePicker />` |
| 체크박스 | `<Checkbox />` |
| 접기/펼치기 섹션 | `<CollapsibleSection title="..." defaultOpen>` |
| 선택 가능한 항목 행 | `<SelectableItem selected={...} onClick={...}>` |
| 링크형 항목 행 | `<ActionLinkItem href="..." icon={...}>` |
| 알림 항목 | `<NoticeItem />` |
| 경고 / 위험 / 성공 / 안내 배너 | `<AlertBanner intent="warning\|danger\|success\|info">` |
| 모달 팝업 | `<Modal isOpen={...} onClose={...}>` |
| 하단 시트 | `<BottomSheet isOpen={...} onClose={...}>` |
| 빈 상태 화면 | `<EmptyState />` |
| 에러 상태 화면 | `<ErrorState />` |

## 비즈니스 컴포넌트

| Figma | React 컴포넌트 |
|------|---|
| 계좌 요약 카드 | `<AccountSummaryCard accountNumber="..." balance={...} />` |
| 카드사 요약 카드 | `<CardSummaryCard cardName="..." balance={...} />` |
| 보험 요약 카드 | `<InsuranceSummaryCard policyName="..." premium={...} />` |
| 금액 입력 필드 | `<AmountInput label="금액" value={...} onChange={...} />` |
| 거래 검색 필터 | `<TransactionSearchFilter onFilter={...} />` |
| 거래 목록 | `<TransactionList transactions={...} />` |
| 퀵메뉴 격자 | `<QuickMenuGrid items={...} onSelect={...} />` |
| 슬라이드 배너 | `<BannerCarousel items={...} />` |
| 브랜드 배너 | `<BrandBanner title="..." description="..." />` |
| 하단 탭 네비게이션 | `<BottomNav items={...} activeId={...} />` |
| 상단 탭 | `<TabNav items={...} activeTabId={...} onChange={...} />` |
| 성공 결과 화면 | `<SuccessHero title="..." subtitle="..." actionLabel="..." />` |
| 사용자 프로필 | `<UserProfile userName="..." profileImage={...} />` |

> ❌ `Table → <DataTable />` — 존재하지 않음. 거래 목록은 `<TransactionList />` 사용
> ❌ `List → <ListView />` — 존재하지 않음. 반복 목록은 `<Stack gap="...">` + `map()` 사용
> ❌ `Pagination` — 존재하지 않음. TransactionList 내 무한 스크롤 사용
> ❌ `DescriptionList` — 존재하지 않음. 세로 나열은 `<LabelValueRow />`, 가로 한 줄은 `<InfoRow />` 사용

---

# 9. 반복 구조 규칙

반복 UI는 반드시 Auto Layout을 사용하고, React에서 `map()`으로 변환한다.

```
CardList
 ├─ Card
 ├─ Card
 └─ Card
```

→ Claude 해석:

```tsx
<Stack gap="sm">
  {items.map((item) => (
    <Card key={item.id}>
      <Text>{item.name}</Text>
    </Card>
  ))}
</Stack>
```

---

# 10. 금지 규칙

다음 디자인 방식은 Claude가 해석하기 어렵거나 잘못된 코드로 변환된다.

❌ Rectangle 기반 UI
❌ Group 남용
❌ 이름 없는 Frame
❌ Auto Layout 미사용

BAD

```
Frame 1
 ├─ Rectangle
 ├─ Rectangle
 └─ Text
```

→ Claude 해석 불가

GOOD

```
Page
 ├─ FilterSection
 ├─ ContentSection
 └─ ActionSection
```

→ Claude 해석 가능

---

# ⚠️ 레이아웃 패딩 규칙 (CRITICAL)

`HomePageLayout`과 `PageLayout`의 `main` 영역에 `px-standard py-md` 패딩이 내장되어 있다.
내부 `Stack`에 별도 패딩을 추가하지 않는다.

```tsx
// ✅ GOOD — 패딩은 HomePageLayout이 처리
<HomePageLayout title="...">
  <Stack gap="lg">
    <AccountSummaryCard ... />
    <QuickMenuGrid ... />
  </Stack>
</HomePageLayout>

// ❌ BAD — 패딩 중복
<HomePageLayout title="...">
  <Stack gap="lg" className="px-standard py-md">
    <AccountSummaryCard ... />
  </Stack>
</HomePageLayout>
```

## BottomNav 위치

`BottomNav`는 반드시 `HomePageLayout` **바깥**에 배치한다.

```tsx
// ✅ GOOD
<>
  <HomePageLayout title="..." withBottomNav>
    <Stack gap="lg">...</Stack>
  </HomePageLayout>
  <BottomNav items={...} activeId={...} />
</>

// ❌ BAD — HomePageLayout children 안에 BottomNav
<HomePageLayout title="..." withBottomNav>
  <Stack>...</Stack>
  <BottomNav ... />  {/* 잘못된 위치 */}
</HomePageLayout>
```

---

# ⚠️ 구현 완성도 규칙 (CRITICAL)

Claude는 Figma 프레임을 **전체 구현**해야 한다.
일부만 생성하고 나머지를 빈 공간으로 두는 것은 절대 금지한다.

## 코드 생성 전 필수 절차

1. Figma 프레임의 **전체 레이어 트리**를 먼저 파악한다
2. 최상위 섹션 목록을 나열한다 (예: Header, AccountSection, QuickMenu, BannerSection, ...)
3. 각 섹션을 체크리스트로 관리하며 **모두 구현**한다
4. 스크롤 가능한 영역은 반드시 스크롤 컨테이너로 감싼다

## 금지 사항

❌ 일부 섹션만 구현하고 나머지 빈 공간으로 방치
❌ "TODO: 추가 구현 필요" 주석만 남기고 미완성 제출
❌ 스크롤 영역 안의 콘텐츠를 생략

GOOD

```
Figma 프레임에 6개 섹션이 있으면 → 6개 모두 구현 후 제출
```

BAD

```
Figma 프레임에 6개 섹션이 있는데 → 3개만 구현하고 나머지 공백
```

구현하기 어려운 섹션이 있는 경우 임의로 생략하지 말고 **개발자에게 확인 후 진행**한다. (rules/09-confirmation.md 참조)

---

# 11. 중첩 Auto Layout 변환 규칙

단일 방향 변환만으로 처리할 수 없는 중첩 레이아웃 케이스를 명시한다.

## 중첩 방향 조합

| Figma 구조 | React 변환 | 비고 |
|-----------|-----------|------|
| Vertical > Horizontal | `<Stack gap="md"><Inline gap="sm">` | 수직 안에 수평 |
| Horizontal > Vertical | `<Inline align="start"><Stack gap="xs">` | 수평 안에 수직 |
| Vertical > Horizontal (Space between) | `<Stack gap="md"><Inline justify="between">` | 양끝 정렬 |
| Frame (no layout) + absolute child | `<div className="relative"><div className="absolute ...">`  | 절대 위치 예외 |
| Fill width child in Horizontal | `<Inline><div className="flex-1">...</div>` | Hug/Fill 혼재 |
| Fixed width frame | `className="w-[{px}px]"` | 고정 너비는 임의값 허용 예외 |

```tsx
// ✅ GOOD — 수직 레이아웃 안에 수평 정렬
<Stack gap="md">
  <Inline justify="between" align="center">
    <Text variant="body-md">계좌명</Text>
    <Badge>주거래</Badge>
  </Inline>
  <Text variant="heading-sm">2,500,000원</Text>
</Stack>

// ✅ GOOD — Fill child (계좌명은 남은 공간, 배지는 Hug)
<Inline gap="sm" align="center">
  <div className="flex-1">
    <Text variant="body-md">하나 주거래 통장</Text>
  </div>
  <Badge>주거래</Badge>
</Inline>

// ❌ BAD — div 직접 사용
<div style={{ display: 'flex', justifyContent: 'space-between' }}>
  <span>계좌명</span>
  <span>배지</span>
</div>
```

## 절대 위치 예외 처리

Figma에서 Frame 내부에 Absolute 위치 레이어가 있는 경우에만 `relative`/`absolute` className을 허용한다.
이 케이스는 반드시 인라인 주석으로 이유를 명시한다.

```tsx
// ✅ GOOD — Figma 절대 위치 레이어 (배지 오버레이)
<div className="relative">
  <AccountSummaryCard ... />
  {/* Figma: 우상단 절대 위치 뱃지 오버레이 */}
  <div className="absolute top-2 right-2">
    <Badge intent="danger">연체</Badge>
  </div>
</div>
```

---

# 핵심 체크리스트

✔ Auto Layout(Vertical) → `Stack`, Auto Layout(Horizontal) → `Inline`
✔ gap 수치 → gap 토큰 (4px=xs / 8px=sm / 12px=md / 20px=lg / 24px+=xl)
✔ `direction` `spacing` `columns` prop 사용 금지
✔ `Row` `Column` `ButtonGroup` `FilterBar` `DataTable` 사용 금지
✔ 레이어·프레임에 의미 있는 이름 사용
✔ HomePageLayout 내부 패딩 중복 추가 금지
✔ BottomNav는 HomePageLayout 바깥에 배치
✔ Figma 섹션 수만큼 전체 구현
