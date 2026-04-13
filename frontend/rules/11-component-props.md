# 11-component-props.md — 컴포넌트 Props 타입 레퍼런스

## 목적

코드 생성 전에 이 파일을 참조하여 **존재하지 않는 prop 값**을 사용하지 않도록 한다.

**실제 발생했던 오류 사례:**

| 잘못 쓴 코드 | 오류 원인 | 올바른 코드 |
| --- | --- | --- |
| `variant="title-xl"` | TypographyVariant에 없음 | `variant="heading"` |
| `variant="secondary"` | ButtonVariant에 없음 | `variant="outline"` |
| `<Grid columns={4}>` | GridProps 속성명 오류 | `<Grid cols={4}>` |
| `<Card size="sm">` | CardProps에 size 없음 | `<QuickMenuGrid cols={4}>` |
| `<AlertBanner intent="primary">` | AlertBannerIntent에 없음 | `intent="info"` |
| `<Card variant="brand">` | CardProps에 variant 없음 | `<BrandBanner>` 컴포넌트 사용 |
| `<BottomNav icons={}>` | 속성명 오류 + onClick 누락 | `items={[{ id, icon, label, onClick }]}` |

---

## ⚠️ 코드 생성 전 체크리스트

1. **아래 레퍼런스에서 prop 값이 있는지 확인 후 사용한다.**
2. 아래 없는 컴포넌트는 해당 `types.ts`를 직접 읽고 확인한다.
3. **확신이 없으면 절대 추측하지 않는다.** `types.ts`를 읽는다.
4. 컴포넌트에 없는 prop(size, variant, color 등)은 임의로 추가하지 않는다.

---

## Core 컴포넌트

### Button

```ts
variant?: 'primary' | 'outline' | 'ghost' | 'danger'  // 기본: 'primary'
size?:    'sm' | 'md' | 'lg'                           // 기본: 'md'
justify?: 'center' | 'between'
loading?: boolean
iconOnly?: boolean
leftIcon?: React.ReactNode
rightIcon?: React.ReactNode
fullWidth?: boolean
```

> ❌ `variant="secondary"` `variant="text"` `variant="link"` `variant="default"`
> ❌ `size="large"` `size="small"` `size="xs"`

---

### Badge

```ts
variant?: 'primary' | 'brand' | 'success' | 'danger' | 'warning' | 'neutral'  // 기본: 'neutral'
dot?:     boolean
```

> ❌ `variant="secondary"` `variant="info"` `variant="default"` `variant="gray"`

---

### Typography (Text)

```ts
variant?: 'heading' | 'subheading' | 'body-lg' | 'body' | 'body-sm' | 'caption'  // 기본: 'body'
weight?:  'normal' | 'medium' | 'bold'
color?:   'heading' | 'base' | 'label' | 'secondary' | 'muted' | 'brand' | 'danger' | 'success'
numeric?: boolean   // 금액·숫자 표시 시 Manrope 폰트 적용
as?:      React.ElementType
```

> ❌ `variant="title-xl"` `variant="h1"` `variant="title"` `variant="small"` `variant="label"`
> ❌ `color="gray"` `color="black"` `color="primary"` `color="white"` `color="red"`

---

### Input

```ts
size?:             'md' | 'lg'                        // 기본: 'md'
validationState?:  'default' | 'error' | 'success'   // 기본: 'default'
label?:            string
helperText?:       string
leftIcon?:         React.ReactNode
rightElement?:     React.ReactNode
fullWidth?:        boolean
formatPattern?:    string   // '#' = 숫자 1자리, 예: '###-######-#####'
phoneFormat?:      boolean
```

> ❌ `size="sm"` `size="small"` `variant=*` `status=*` — 존재하지 않음

---

### Select

```ts
options:   { value: string; label: string }[]
value:     string
onChange:  (value: string) => void
```

> ❌ `size=*` `variant=*` `disabled=*` — Select는 위 3개 prop만 허용

---

## Layout 컴포넌트

### Stack

```ts
gap?:   'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'  // 기본: 'md'
align?: 'start' | 'center' | 'end' | 'stretch'     // 기본: 'stretch'
as?:    React.ElementType
```

> ❌ `gap="none"` `gap="0"` `gap="base"` `direction="horizontal"`
> 수평 레이아웃은 `Inline`을 사용한다.

---

### Inline

```ts
gap?:     'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'                     // 기본: 'sm'
align?:   'start' | 'center' | 'end' | 'baseline' | 'stretch'           // 기본: 'center'
justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly'  // 기본: 'start'
wrap?:    boolean
as?:      React.ElementType
```

> ❌ `direction="vertical"` — 수직 레이아웃은 `Stack` 사용

---

### Grid

```ts
cols?:       1 | 2 | 3 | 4   // 기본: 2
tabletCols?: 2 | 3 | 4
gap?:        'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
```

> ❌ `columns={4}` — 속성명은 **`cols`** 이다. `columns`가 아니다.

---

### Section

```ts
title?:       string           // 전달 시 SectionHeader 노출
badge?:       number
actionLabel?: string
onAction?:    () => void
children:     React.ReactNode
gap?:         'xs' | 'sm' | 'md' | 'lg' | 'xl'  // 기본: 'md'
className?:   string
```

> title 없이 사용하면 `Stack` 역할(수직 배치)만 한다.
> title 있으면 `SectionHeader` + 콘텐츠를 묶는다.

---

## Modules 컴포넌트

### TabNav

```ts
variant?:    'underline' | 'pill'  // 기본: 'underline'
fullWidth?:  boolean
items:       { id: string; label: string }[]
activeId:    string
onTabChange: (id: string) => void
```

> ❌ `variant="tab"` `variant="segment"` `variant="default"`
> 세그먼트 컨트롤 스타일은 `variant="pill"`을 사용한다.

---

### Card

```ts
interactive?: boolean
onClick?:     () => void
noPadding?:   boolean
```

> ❌ `size=*` `variant=*` `color=*` — Card는 위 3개 prop 외 **없음**
> 브랜드 색상 배너가 필요하면 `Card`가 아닌 `BrandBanner` 컴포넌트를 사용한다.
> 퀵메뉴 그리드가 필요하면 `Card` 대신 `QuickMenuGrid`를 사용한다.

---

### CollapsibleSection

```ts
header:           React.ReactNode
children:         React.ReactNode
defaultExpanded?: boolean          // 기본: true
headerAlign?:     'left' | 'center'
```

---

### SectionHeader

```ts
title:        string
badge?:       number               // 숫자만 허용. 텍스트 배지 불가
actionLabel?: string
onAction?:    () => void
```

---

### AlertBanner

```ts
intent?:   'warning' | 'danger' | 'success' | 'info'  // 기본: 'warning'
children:  React.ReactNode
icon?:     React.ReactNode  // 미전달 시 intent별 기본 아이콘 자동 적용
```

> ❌ `intent="primary"` `intent="default"` `intent="brand"` `intent="error"`
> ❌ `variant=*` `type=*` — AlertBanner에는 intent만 존재한다.

---

### InfoRow

```ts
label:           string   // ⚠️ ReactNode 불가, string만 허용
value:           string   // ⚠️ ReactNode 불가, string만 허용
valueClassName?: string
showBorder?:     boolean  // 기본: true
```

> ⚠️ label/value에 JSX(아이콘, 버튼 등)를 넣으면 TypeScript 오류 발생.
> ReactNode가 필요한 경우 `Inline`으로 직접 구성한다.

---

### LabelValueRow

```ts
label: string
value: React.ReactNode  // string 또는 JSX 모두 허용 (InfoRow와 다름)
```

---

### ErrorState

```ts
title?:       string           // 기본: '오류가 발생했습니다'
description?: string
onRetry?:     () => void       // 전달 시 재시도 버튼 노출
retryLabel?:  string           // 기본: '다시 시도'
className?:   string
```

> `isError` 상태에서만 렌더링. 데이터 없음(정상 응답)은 `EmptyState` 사용.

---

## Biz 컴포넌트

### AccountSummaryCard

```ts
type:            'deposit' | 'savings' | 'loan' | 'foreignDeposit' | 'retirement' | 'securities'
accountName:     string
accountNumber:   string
balance:         number           // 원화 정수 (자동 포맷)
balanceDisplay?: string           // 외화 등 커스텀 표시 시 override
balanceLabel?:   string           // 기본 레이블 override
badgeText?:      string
moreButton?:     'chevron' | 'ellipsis'
onMoreClick?:    () => void
onClick?:        () => void
actions?:        React.ReactNode  // 하단 버튼 슬롯
```

> ❌ `type="current"` `type="foreign"` `type="check"`
> 외화예금 → `type="foreignDeposit"` / 적금 → `type="savings"` (savings가 적금)

---

### AccountSelectorCard

```ts
accountName:       string
accountNumber:     string
icon?:             React.ReactNode  // 기본: WalletMinimal 아이콘
onAccountChange?:  () => void       // 계좌 변경 드롭다운 열기
onIconClick?:      () => void       // 우측 버튼 클릭
iconAriaLabel?:    string           // 기본: '계좌 상세'
availableBalance?: string           // 예: '출금가능금액: 3,000,000원'
```

> ❌ `variant=*` `size=*` `type=*` — 위 prop 외 없음

---

### QuickMenuGrid

```ts
items: {
  id:      string
  icon:    React.ReactNode
  label:   string
  onClick: () => void
  badge?:  number         // 0 또는 미전달 시 배지 미노출
}[]
cols?:  2 | 3 | 4         // 기본: 4
```

> 퀵메뉴는 `Grid` + `Card` 조합이 아닌 **`QuickMenuGrid` 단독 사용**

---

### BrandBanner

```ts
title:     string
subtitle?: string
icon?:     React.ReactNode
onClick?:  () => void
```

> 브랜드 배경 배너는 `Card variant="brand"`가 아닌 **`BrandBanner`** 를 사용한다.

---

### BannerCarousel

```ts
items: {
  id:           string
  variant?:     'promo' | 'info' | 'warning'  // 기본: 'promo'
  title:        string
  description?: string
  action?:      React.ReactNode
  onClose?:     () => void
}[]
autoPlayInterval?: number   // ms, 기본: 3000
```

> ❌ `variant="primary"` `variant="brand"` `variant="default"` — 위 3가지만 허용

---

### BottomNav

```ts
items: {
  id:          string
  icon:        React.ReactNode
  activeIcon?: React.ReactNode   // 미전달 시 icon 재사용
  label:       string
  onClick:     () => void        // ⚠️ 필수 — 누락 시 TypeScript 오류
}[]
activeId: string
```

> ❌ `icons={}` — 속성명은 **`items`** 이다.
> ⚠️ 각 항목에 `onClick`이 **필수**다. 누락하면 오류 발생.

---

---

## Modules/Common 신규 컴포넌트

### StepIndicator

```ts
total:      number   // 전체 단계 수
current:    number   // 현재 단계 (1-based)
className?: string
```

> 활성 step: 브랜드 색상 pill(w-4 h-2) / 비활성: 원형 dot(w-2 h-2)
> ❌ `step=*` `activeStep=*` `count=*` — prop명은 `total` / `current`

---

### SelectableListItem

```ts
label:      string
isSelected: boolean
onClick:    () => void
```

> BottomSheet 내 목록 선택 패턴 전용. 선택 시 브랜드 색상·볼드.
> ❌ `selected=*` `active=*` `value=*` — prop명은 `isSelected`

---

### BankSelectGrid

```ts
banks:         { code: string; name: string; icon?: React.ReactNode }[]
selectedCode?: string
onSelect:      (code: string) => void
columns?:      3 | 4   // 기본: 4
```

> ❌ `cols=*` `value=*` `onChange=*` — prop명은 `columns` / `selectedCode` / `onSelect`

---

### RecentRecipientItem

```ts
name:          string
bankName:      string
maskedAccount: string
onClick:       () => void
```

> 최근 이체 수취인 목록 단일 행. BottomSheet 내 수취인 선택에 사용.

---

### TransferLimitInfo

```ts
perTransferLimit: number   // 1회 이체 한도 (원)
dailyLimit:       number   // 1일 이체 한도 (원)
usedAmount?:      number   // 오늘 누적 이체 금액 — 전달 시 잔여 한도 함께 표시
```

> ❌ `limit=*` `maxAmount=*` — prop명은 `perTransferLimit` / `dailyLimit`

---

## Biz/Card 신규 컴포넌트

### CardPillTab

```ts
label:      string
isSelected: boolean
onClick:    () => void
```

> 카드 목록 가로 스크롤 영역의 pill 탭. `CardPillTab` 여러 개를 `flex gap-xs`로 감싸 사용.
> ❌ `active=*` `selected=*` — prop명은 `isSelected`

---

### CardChipItem

```ts
name:         string   // 카드명
maskedNumber: string   // 마스킹된 카드번호
```

> 카드명 + 마스킹번호 칩 표시. CollapsibleSection 내 카드 목록에 사용.
> ❌ `cardName=*` `number=*` — prop명은 `name` / `maskedNumber`

---

### AccountSelectCard

```ts
bankName:       string
maskedAccount:  string
isSelected:     boolean
onClick:        () => void
```

> 출금계좌 선택 카드. 선택 시 브랜드 테두리 + 체크 아이콘 표시.
> ❌ `selected=*` `active=*` — prop명은 `isSelected`

---

### PaymentAccountCard

```ts
title: string          // 예: '하나은행 (당행)'
hours: string          // 예: '24시간 365일 이체 가능'
icon:  React.ReactNode // 당행: Landmark, 타행: Building
```

> 즉시결제 진입 화면의 당행/타행 계좌 표시 카드. 클릭 이벤트 없는 정적 컴포넌트.
> ❌ `onClick=*` — PaymentAccountCard는 클릭 불가 컴포넌트

---

### CardBenefitSummary

```ts
points:           number   // 보유 포인트 잔액
benefits:         { label: string; amount: number; unit?: string }[]   // 이번달 혜택 목록
onPointDetail?:   () => void
onBenefitDetail?: () => void
```

> 포인트(상단) + 혜택(하단) 2단 카드. 혜택 항목은 최대 2개까지 표시.
> ❌ `point=*` `benefit=*` — prop명은 `points` / `benefits`

---

### CardPerformanceBar

```ts
cardName:             string   // 카드명
currentAmount:        number   // 이번달 이용금액 (원)
targetAmount:         number   // 목표 실적 금액 (원)
benefitDescription?:  string   // 달성 시 혜택 설명
onDetail?:            () => void
```

> 이용실적 진행 바. 달성 시 완료 메시지, 미달 시 잔여 금액 안내 자동 표시.
> ❌ `progress=*` `percent=*` — 달성률은 내부에서 자동 계산

---

## 컴포넌트 선택 가이드

| 하고 싶은 것 | 사용할 컴포넌트 |
| --- | --- |
| 브랜드 색상 배너 | `BrandBanner` |
| 다중 슬라이드 배너 | `BannerCarousel` |
| 퀵메뉴 2×N 그리드 | `QuickMenuGrid` |
| 인라인 경고/안내 | `AlertBanner` (intent 확인 필수) |
| 계좌 선택/변경 | `AccountSelectorCard` |
| 계좌 잔액 표시 | `AccountSummaryCard` |
| 좌우 정렬 텍스트 | `LabelValueRow` (value에 JSX 가능) |
| 좌우 정렬 텍스트(string만) | `InfoRow` |
| API 오류 상태 표시 | `ErrorState` |
| 데이터 없음 표시 | `EmptyState` |
| 섹션 제목 + 콘텐츠 묶음 | `Section` (title prop으로 SectionHeader 자동 포함) |
| 단계 진행 표시 | `StepIndicator` (total + current) |
| BottomSheet 목록 선택 | `SelectableListItem` |
| 은행 선택 그리드 | `BankSelectGrid` |
| 최근 수취인 목록 행 | `RecentRecipientItem` |
| 이체 한도 안내 | `TransferLimitInfo` |
| 카드 목록 pill 탭 | `CardPillTab` |
| 카드명+번호 칩 표시 | `CardChipItem` |
| 출금계좌 선택 카드 | `AccountSelectCard` |
| 당행/타행 계좌 표시 | `PaymentAccountCard` |
| 포인트·혜택 요약 | `CardBenefitSummary` |
| 카드 이용실적 바 | `CardPerformanceBar` |
