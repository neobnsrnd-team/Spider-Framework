# 10-brand.md — 브랜드 테마 적용 규칙

## 목적

페이지 루트에 `data-brand` 속성을 올바르게 적용하여
component-library의 브랜드 색상 토큰이 정확하게 적용되도록 한다.

`data-brand`가 없거나 잘못 지정되면 기본값(hana)의 색상이 적용되어
의도한 브랜드 디자인과 다른 화면이 생성된다.

---

# 기본 원칙

모든 `page.tsx`의 최상위 래퍼 엘리먼트에는 반드시 `data-brand`와 `data-domain`을 지정한다.
Figma 디자인에서 사용된 브랜드 색상을 보고 아래 브랜드 매핑표에서 올바른 값을 선택한다.

---

# 브랜드 매핑표

`design-tokens/globals.css`에 정의된 브랜드 목록이다. 이 표 외의 값은 사용하지 않는다.

## 은행 브랜드

| 브랜드            | data-brand 값 | brand-primary | 식별 색상 특징                      |
| ----------------- | ------------- | ------------- | ----------------------------------- |
| 하나은행 (기본값) | `hana`        | `#008485`     | 청록/초록 계열                      |
| IBK기업은행       | `ibk`         | `#0068b7`     | 파랑 계열                           |
| KB국민은행        | `kb`          | `#ffbc00`     | 노랑/골드 계열                      |
| NH농협은행        | `nh`          | `#00a859`     | 초록 계열 (+ 형광 보조색 `#eef300`) |
| 신한은행          | `shinhan`     | `#0046ff`     | 파랑 계열 (짙은 블루)               |
| 우리은행          | `woori`       | `#0067ac`     | 파랑 계열 (중간 블루)               |

## 도메인 기본 브랜드

은행 계열이 아닌 서비스의 경우 아래 값을 사용한다.

| 서비스 | data-brand 값 | brand-primary | 식별 색상 특징   |
| ------ | ------------- | ------------- | ---------------- |
| 카드   | `card`        | `#1a56db`     | 파랑 계열        |
| 지로   | `giro`        | `#5b21b6`     | 보라 계열        |
| 보험   | `insurance`   | `#e03a1e`     | 빨강/오렌지 계열 |

표에 없는 브랜드가 Figma에서 감지되면 임의로 값을 추측하지 말고 개발자에게 확인한다. (→ `rules/09-confirmation.md` 참조)

---

# 적용 위치

`page.tsx` 최상위 엘리먼트에 `data-brand`와 `data-domain`을 직접 지정한다.
component-library의 `PageLayout` 또는 `HomePageLayout`이 최상위인 경우,
해당 컴포넌트가 `data-brand` prop을 지원하면 prop으로 전달하고,
지원하지 않으면 래퍼 `div`로 감싼다.

```tsx
// ✅ GOOD — 래퍼 div에 data-brand 적용
<div data-brand="kb" data-domain="banking">
  <HomePageLayout title="메인">
    ...
  </HomePageLayout>
</div>

// ✅ GOOD — PageLayout이 prop을 지원하는 경우
<PageLayout data-brand="kb" data-domain="banking">
  ...
</PageLayout>
```

```tsx
// ❌ BAD — data-brand 누락 (hana 색상이 기본 적용됨)
<HomePageLayout title="메인">
  ...
</HomePageLayout>

// ❌ BAD — 중간 컴포넌트에만 지정 (루트가 아님)
<div>
  <section data-brand="kb">  {/* 루트가 아니어서 토큰 범위가 불완전 */}
    ...
  </section>
</div>
```

---

# Figma에서 브랜드 감지 방법

Figma 디자인을 분석할 때 아래 단서를 통해 브랜드를 판단한다.

| 단서                | 판단 방법                                 |
| ------------------- | ----------------------------------------- |
| 프레임/페이지 이름  | "KB", "국민", "Hana", "하나" 등의 키워드  |
| 주요 버튼·헤더 색상 | 브랜드 매핑표의 대표 색상과 비교          |
| 로고·아이콘         | 은행 로고가 포함된 경우 브랜드 식별       |
| 컬러 토큰 이름      | `kb-primary`, `hana-green` 등 토큰명 확인 |

색상만으로 브랜드를 확신할 수 없는 경우, 임의로 결정하지 않고 개발자에게 확인한다.

---

# 기본값 처리 규칙

- 고객사 브랜드가 명시되지 않은 경우 → **개발자에게 확인** 후 적용
- Figma에서 브랜드를 명확히 식별할 수 있는 경우 → 해당 `data-brand` 값 적용
- Figma에서 브랜드를 판단할 수 없는 경우 → **개발자에게 확인** 후 적용
- 명시적으로 하나은행 브랜드인 경우 → `data-brand="hana"` 적용

하나은행이 기본이라도 생략하지 말고 **항상 명시적으로 작성**한다.
값이 없으면 기본값 적용 여부가 코드만 보고는 판단되지 않아 가독성이 떨어진다.

---

# data-domain 규칙

`design-tokens/globals.css`에 정의된 domain 목록이다.

| 도메인 | data-domain 값 | 사용 상황                         |
| ------ | -------------- | --------------------------------- |
| 은행   | `banking`      | 하나·IBK·KB·NH·신한·우리은행 화면 |
| 카드   | `card`         | 카드 서비스 화면                  |
| 지로   | `giro`         | 지로 서비스 화면                  |
| 보험   | `insurance`    | 보험 서비스 화면                  |

`data-brand`와 `data-domain`은 함께 지정한다. 브랜드에 따라 자연스러운 조합은 다음과 같다.

| data-brand                                    | data-domain |
| --------------------------------------------- | ----------- |
| `hana`, `ibk`, `kb`, `nh`, `shinhan`, `woori` | `banking`   |
| `card`                                        | `card`      |
| `giro`                                        | `giro`      |
| `insurance`                                   | `insurance` |

---

# 개발자 확인 형식

## 고객사 브랜드가 명시되지 않은 경우

작업 시작 전 브랜드를 명시하지 않은 경우, 코드 생성 전에 반드시 아래 형식으로 확인 요청한다.

```
확인이 필요합니다.

[확인 항목]
- 고객사 브랜드가 명시되지 않았습니다.
- 적용할 브랜드를 선택해주세요.

  지원 브랜드 목록:
  1. hana — 하나은행
  2. shinhan — 신한은행
  3. kb — KB국민은행
  4. ibk — IBK기업은행
  5. nh — NH농협은행
  6. woori — 우리은행
  7. card — 카드
  8. giro — 지로
  9. insurance — 보험

확인 후 페이지 루트에 적용하겠습니다.
```

## Figma에서 브랜드를 판단할 수 없는 경우

```
확인이 필요합니다.

[확인 항목]
- Figma 디자인의 브랜드를 판단하기 어렵습니다.
- 감지된 주요 색상: {색상값}
- 적용할 data-brand 값을 알려주세요.

  지원 브랜드 목록:
  1. hana — 하나은행
  2. shinhan — 신한은행
  3. kb — KB국민은행
  4. ibk — IBK기업은행
  5. nh — NH농협은행
  6. woori — 우리은행
  7. card — 카드
  8. giro — 지로
  9. insurance — 보험

확인 후 페이지 루트에 적용하겠습니다.
```

---

# 핵심 체크리스트

✔ 모든 페이지 컴포넌트 루트에 `data-brand` 명시
✔ 모든 `page.tsx` 루트에 `data-domain` 명시
✔ Figma 색상·이름으로 브랜드 식별 후 매핑표에서 값 선택
✔ 표에 없는 브랜드는 개발자 확인 후 적용
✔ 기본값(hana)도 생략 없이 명시적으로 작성
