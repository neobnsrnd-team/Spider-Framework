# Claude Code 프로젝트 지침_real version

## 코드 작성 규칙

### 주석

이 라이브러리 실사용자는 라이브러리 내부 구조를 전혀 모르는 외부 개발자다.
코드만 봐도 의도를 파악할 수 있도록 주석을 충분히 작성한다.

**파일 상단 JSDoc**

- 새 파일을 생성할 때는 반드시 파일 상단에 JSDoc 주석을 작성한다.
- 주석에는 다음 내용을 포함한다:
  - 파일명 (`@file`)
  - 파일/함수의 역할 설명 (`@description`)
  - 주요 파라미터 (`@param`)
  - 반환값 (`@returns`)
  - 필요한 경우 사용 예시 (`@example`)

**인라인 주석**

- 다음 경우에는 반드시 인라인 주석을 추가한다:
  - 왜 이 값을 선택했는지 이유가 필요한 상수·기본값
  - 외부 개발자가 처음 봤을 때 의도를 오해할 수 있는 로직
  - 타입 단언(`as`)이나 예외 처리 등 방어 코드
  - 여러 분기 중 특정 분기가 존재하는 이유가 명확하지 않은 경우

---

# ⚠️ 코드 생성 전 필수 절차

페이지, 컴포넌트, Hook, Repository 등 **어떤 코드를 생성하기 전에도** 아래 rules 파일을 반드시 먼저 읽는다.
읽지 않고 생성하면 규칙 위반 코드가 생성된다.

| 파일                             | 역할                                                     |
| -------------------------------- | -------------------------------------------------------- |
| `rs-rules/01-architecture.md`    | 프로젝트 구조 + Page/Hook/Repository 레이어 역할 분리    |
| `rs-rules/02-naming.md`          | 파일·변수·함수·이벤트 네이밍 규칙                        |
| `rs-rules/03-component.md`       | 컴포넌트 사용 규칙 + Figma 레이아웃 변환                 |
| `rs-rules/04-state-data.md`      | 상태 관리 위치 기준 + 데이터 처리 규칙                   |
| `rs-rules/05-repository.md`      | Repository 패턴 작성 규칙                                |
| `rs-rules/06-event.md`           | 이벤트 핸들러 정의·전달 규칙                             |
| `rs-rules/07-figma.md`           | Figma 디자인 구조 해석 기준                              |
| `rs-rules/08-generation.md`      | 페이지 생성 시 처리 절차 및 라우터 등록                  |
| `rs-rules/09-confirmation.md`    | 개발자 확인이 필요한 상황 정의                           |
| `rs-rules/10-brand.md`           | 페이지 루트 data-brand / data-domain 적용 규칙           |
| `rs-rules/11-component-props.md` | 컴포넌트별 허용 prop 값 레퍼런스 (variant·size·color 등) |

---

# 🚨 Rule Priority (Highest Priority)

The following rules MUST take priority over any existing project structure.

Priority Order:

1. CLAUDE.md (Highest Priority)
2. .claude.rules
3. rs-rules/ (All rule files inside rs-rules folder)
4. project-structure.md
5. Existing project structure (Lowest Priority)

Claude MUST follow rule files over existing code structure.

If there is any conflict between rules and existing project structure:
→ **Rules MUST override existing structure**

Claude MUST NOT reuse existing structure blindly.

Before generating any code, Claude MUST:

1. Read CLAUDE.md
2. Read .claude.rules
3. Read all files inside `rs-rules/` folder
4. Follow defined structure
5. Then generate code

---

# 📚 rs-rules Folder Enforcement

Claude MUST read and follow **all rule files** inside:

```
rs-rules/
```

Examples:

```
rs-rules/
  01-architecture.md
  02-naming.md
  03-component.md
  04-state-data.md
  05-repository.md
  06-event.md
  07-figma.md
  08-generation.md
  09-confirmation.md
  10-brand.md
  11-component-props.md
  12-component-mapping.md

```

All rules inside `rs-rules/` folder are **mandatory**.

Claude MUST:

✔ Read all rule files inside rs-rules/
✔ Follow all rule files
✔ Apply rules during code generation
✔ Validate rule compliance before output

Claude MUST NOT:

❌ Ignore rule files
❌ Partially apply rules
❌ Override rule files with existing structure

---

# 🎯 목적

이 프로젝트는 Figma 디자인을 기반으로 React 코드를 자동 생성하는 플랫폼이다.
Claude가 생성하는 모든 코드는 **일관성**, **재사용성**, **유지보수성**을 최우선으로 한다.

---

# 🧠 기본 원칙

### 1. component-library가 유일한 UI 소스다

모든 UI는 반드시 `component-library`에서 가져온다.
직접 HTML 태그(`div`, `button` 등)를 사용하거나 외부 UI 라이브러리를 추가하지 않는다.
이 원칙을 지켜야 디자인 시스템과 코드가 항상 동기화된다.

### 2. 디자인 토큰이 유일한 스타일 소스다

색상·간격·폰트 크기는 반드시 `design-tokens`에서 가져온다.
임의 값(`#333`, `16px`)을 하드코딩하면 Figma 디자인 변경 시 코드를 일일이 수정해야 하는 기술 부채가 생긴다.

### 3. Figma 매핑 기준을 벗어나지 않는다

`rs-docs/component-map.md`에 정의된 컴포넌트만 생성한다.
정의되지 않은 컴포넌트를 임의로 만들면 디자이너의 의도와 다른 UI가 생성된다.

### 4. 관심사를 명확히 분리한다

- **HTTP 호출·데이터 가공·모델 변환·에러 처리**는 `{entity}Repository.ts`에서만 한다.
- **데이터 패칭 로직**은 `use{Entity}.ts`에서만 한다.
- **컴포넌트**는 데이터를 표시하는 역할만 한다.

Repository 패턴을 사용하는 이유: API 응답 구조가 바뀌어도 Repository만 수정하면 되고, Hook과 Page는 변경하지 않아도 된다. 유지보수 비용이 크게 줄어든다.

### 5. 데이터 상태를 반드시 처리한다

모든 데이터 화면은 `loading`, `error`, `empty` 세 가지 상태를 빠짐없이 처리해야 한다.
처리하지 않으면 로딩 중 깨진 화면, 에러 시 빈 화면, 데이터 없을 때 의미 없는 빈 테이블이 사용자에게 노출된다.
반드시 이 순서로 처리한다: `isLoading` → `isError` → empty check → 정상 렌더링.

### 6. 타입 안전성을 유지한다

`any` 타입은 TypeScript를 사용하는 의미를 없앤다.
모든 props와 API 응답에는 명시적 타입을 정의한다.

---

# 🚫 하지 말아야 하는 이유

| 금지 항목                           | 하지 말아야 하는 이유                            |
| ----------------------------------- | ------------------------------------------------ |
| HTML 태그 직접 사용                 | 디자인 시스템 일관성 붕괴                        |
| Inline style                        | Figma 변경 시 코드 일괄 추적 불가                |
| 임의 색상·크기 하드코딩             | 테마 변경 시 전체 수정 필요                      |
| Hook·Component에서 직접 HTTP 호출   | Repository 계층 우회, API 변경 시 전체 수정 필요 |
| `any` 타입                          | 런타임 오류를 컴파일 타임에 잡지 못함            |
| 정의되지 않은 컴포넌트 생성         | Figma 디자인 의도 이탈                           |
| loading/error/empty 처리 생략       | 로딩 중·에러·빈 데이터 상황에서 UI 깨짐          |
| Page에서 `useState` 직접 사용       | 비즈니스 로직이 Page에 쌓여 재사용·테스트 불가   |
| Component에서 이벤트 로직 직접 처리 | 컴포넌트 재사용성 소멸, 라우팅·API 호출 분산     |

---

# 📐 아키텍처 방향

### 파일 구조

**Figma 화면 1개 = `src/features/` 하위 폴더 1개**

각 feature 폴더 안에서 파일을 역할별로 분리한다.

```
src/features/
  transactionDetail/
    TransactionDetailPage.tsx   ← 라우팅 단위 (UI만)
    useTransactionDetail.ts     ← 데이터 패칭·상태 관리
    transactionDetailRepository.ts  ← HTTP 호출·데이터 가공
    transactionDetailTypes.ts   ← TypeScript 타입 정의
  accountList/
    AccountListPage.tsx
    useAccountList.ts
    ...
```

각 파일의 역할:

- `{Entity}Page.tsx` — 라우팅 단위. 비즈니스 로직 포함 금지.
- `use{Entity}.ts` — 데이터 패칭·상태 로직 전담.
- `{entity}Repository.ts` — HTTP 호출·데이터 가공·모델 변환·에러 처리 전담.
- `{entity}Types.ts` — 타입 정의 전담.

### 컴포넌트 조합 규칙

컴포넌트 계층은 Page → Layout → Section → Component 순서를 반드시 지킨다.
이 계층을 건너뛰거나 역방향으로 중첩하면 레이아웃 일관성이 무너진다.
특히 Component 내부에 Page를 다시 만드는 구조는 절대 허용하지 않는다.

### 네이밍 규칙

일관된 네이밍이 없으면 같은 역할의 파일이 다른 이름으로 생성되어 구조 파악이 어려워진다.

| 대상                | 규칙                     | 예시                           |
| ------------------- | ------------------------ | ------------------------------ |
| Page (목록)         | `{Entity}ListPage`       | `UserListPage`                 |
| Page (상세)         | `{Entity}DetailPage`     | `UserDetailPage`               |
| Page (등록)         | `{Entity}CreatePage`     | `UserCreatePage`               |
| Page (수정)         | `{Entity}EditPage`       | `UserEditPage`                 |
| Component (테이블)  | `{Entity}Table`          | `UserTable`                    |
| Component (폼)      | `{Entity}Form`           | `UserForm`                     |
| Component (모달)    | `{Entity}{Action}Modal`  | `UserDeleteModal`              |
| Hook (목록)         | `use{Entity}List`        | `useUserList`                  |
| Hook (폼)           | `use{Entity}Form`        | `useUserForm`                  |
| Repository          | camelCase + `Repository` | `userRepository.ts`            |
| Type                | camelCase + `Types`      | `userTypes.ts`                 |
| 이벤트 (Hook 정의)  | `handle{Action}`         | `handleDelete`, `handleSearch` |
| 이벤트 (props 전달) | `on{Action}`             | `onDelete`, `onSearch`         |

### Props 설계 규칙

Props는 최소한으로 설계한다. 불필요하게 많은 props는 컴포넌트의 역할이 불분명하다는 신호다.
`variant`, `size` 같은 열거형 props를 사용하고, boolean을 나열하는 방식은 피한다.
boolean props는 이름만으로 의미가 명확해야 한다. (`disabled`, `loading` 등)

### 상태관리 방향

상태의 출처(서버 vs 클라이언트)에 따라 관리 도구를 다르게 사용한다.
서버 데이터에 `useState`를 사용하면 캐싱·동기화·에러 처리를 직접 구현해야 해서 코드가 복잡해진다.
**Page에서 상태를 직접 생성하지 않는다.** 상태는 반드시 Hook을 통해 가져온다. Page에서 `useState`를 직접 쓰면 로직이 Page에 쌓이고 테스트와 재사용이 불가능해진다.
전역 상태는 정말 전역이 필요한 경우(인증, 테마)에만 사용한다. 과도한 전역 상태는 데이터 흐름을 추적하기 어렵게 만든다.

### 이벤트 처리 규칙

이벤트 핸들러는 **Hook에서 정의**하고, Page는 Hook에서 받은 핸들러를 Component에 전달만 한다. Component는 callback props로만 받는다.
Component 내부에서 직접 이벤트를 처리하면 같은 컴포넌트를 다른 동작으로 재사용할 수 없다.
핸들러 네이밍: Hook에서 정의할 때는 `handle~`, props로 전달할 때는 `on~` prefix를 사용한다.

### 컴포넌트 크기 규칙

컴포넌트는 200줄을 넘지 않도록 한다.
200줄을 초과한다면 역할이 두 개 이상이라는 신호다. 분리를 검토한다.

---

# 🙋 개발자 확인 원칙

판단할 수 없는 상황에서는 **절대 임의로 가정하고 진행하지 않는다.**
불확실한 내용을 추측하여 생성하면 잘못된 코드를 수정하는 비용이 처음부터 확인하는 비용보다 크다.

다음 상황에서는 반드시 개발자에게 확인 후 진행한다.

- 고객사 브랜드가 명시되지 않은 경우 (지원 브랜드: 하나은행·신한은행·KB국민은행·IBK기업은행·NH농협은행·우리은행 등)
- Figma 컴포넌트가 `rs-docs/component-map.md`에 없는 경우
- 엔티티명을 Figma 디자인에서 판단할 수 없는 경우
- API 엔드포인트, 응답 구조, pagination 방식이 불명확한 경우
- Table vs Card vs Form 등 화면 타입이 애매한 경우
- Form의 create/update 용도, validation 방식이 불명확한 경우
- 생성하려는 파일이 이미 존재하거나 라우터 URL이 충돌하는 경우
- 비즈니스 로직이나 권한 처리 방식을 추론할 수 없는 경우

확인 질문은 한 번에 모아서 한다. 항목마다 개별로 질문하지 않는다.

---

# 🎯 최종 목표

Claude가 생성한 코드는 **Figma 디자인과 동일한 UI**를 보여주면서,
외부 개발자가 처음 보더라도 구조와 의도를 바로 이해할 수 있어야 한다.
