# 08-generation.md — 코드 생성 절차

## 목적

Claude가 페이지 생성 시 누락 없이 필요한 파일을 생성하고,
올바른 순서로 생성하며, 라우터 등록까지 완료하도록 절차를 정의한다.

---

# 생성 전 사전 확인 — CSS import

페이지·컴포넌트 생성 전, 아래 import가 진입 파일(`src/main.tsx` 또는 `src/main.jsx` 등)에 **이미 존재하는지** 확인한다.

```ts
import '@neobnsrnd-team/reactive-springware/dist/index.css';
```

- 없으면 진입 파일 **최상단**에 추가한다.
- 이미 있으면 건너뛴다.

이 import가 없으면 Tailwind 유틸리티 클래스와 디자인 토큰이 적용되지 않아
생성된 모든 컴포넌트의 스타일이 깨진다.

`design-tokens/globals.css`는 `@import "tailwindcss"`를 포함하므로 직접 import하면
고객사 프로젝트에 Tailwind가 없을 때 에러가 발생한다. 절대 주입하지 않는다.
`dist/index.css` 한 줄로 충분하다.

---

# 생성 파일 구조

**Figma 화면 1개 = `src/features/` 하위 폴더 1개**

```
src/features/transactionDetail/
  TransactionDetailPage.tsx          ← 라우팅 단위 페이지 컴포넌트 (PascalCase)
  useTransactionDetail.ts            ← 데이터 패칭·상태 관리 (상태 필요 시)
  transactionDetailRepository.ts     ← HTTP 호출·데이터 가공·에러 처리 (API 필요 시)
  transactionDetailTypes.ts          ← TypeScript 타입 정의 (API 타입 필요 시)
```

필요한 파일만 생성한다.

| 파일            | 생성 조건                                |
| --------------- | ---------------------------------------- |
| Page 파일       | 항상 생성                                |
| Hook 파일       | 상태 관리 또는 데이터 패칭이 필요한 경우 |
| Repository 파일 | API 호출이 필요한 경우                   |
| Type 파일       | API 응답 타입 정의가 필요한 경우         |

페이지 컴포넌트가 200줄을 초과할 것 같으면 같은 폴더 안에 별도 파일로 분리한다.

```
src/features/userList/
  UserListPage.tsx
  UserTable.tsx       ← 200줄 초과 시 분리한 UI 컴포넌트
  useUserList.ts
  userListRepository.ts
  userListTypes.ts
```

---

# 생성 순서

의존성 순서로 생성한다. 의존 대상을 먼저 생성해야 오류 없이 import 가능하다.

1. **CSS import 사전 확인** — 진입 파일에 CSS import 존재 여부 확인·추가
2. **Type 파일 생성** — 모든 파일이 참조하는 타입 정의
3. **Repository 파일 생성** — types 참조
4. **Hook 파일 생성** — repository 참조
5. **Page 파일 생성** — hook 참조
6. **라우터 URL 등록** — page 생성 후 반드시 수행

---

# 라우터 등록 규칙

Page 파일 생성 후 반드시 `src/router/routes.tsx`에 URL을 등록한다.
라우터 등록을 누락하면 생성된 페이지에 접근할 방법이 없다.

GOOD

```tsx
// src/router/routes.tsx
import { TransactionDetailPage } from '@/features/transactionDetail/TransactionDetailPage';
import { AccountListPage } from '@/features/accountList/AccountListPage';

const routes = [
  { path: '/transactions/:id', element: <TransactionDetailPage /> },
  { path: '/accounts', element: <AccountListPage /> },
];

export default routes;
```

BAD

```tsx
// features/ 밖에 페이지 파일 생성
// pages/TransactionDetailPage.tsx  ← 금지

// App.tsx에 직접 Route 추가 (routes.tsx를 거치지 않음)
<Route path="/transactions/:id" element={<TransactionDetailPage />} />
```

---

# URL 패턴 규칙

- path는 반드시 **kebab-case**를 사용한다. (예: `/transfer-success`, `/account-detail`)
- entity명은 복수형을 사용한다. (예: `/users`, `/accounts`)

| 페이지 타입 | URL 패턴             | 예시                 |
| ----------- | -------------------- | -------------------- |
| 목록        | `/{entity}`          | `/accounts`          |
| 상세        | `/{entity}/:id`      | `/accounts/:id`      |
| 등록        | `/{entity}/create`   | `/accounts/create`   |
| 수정        | `/{entity}/:id/edit` | `/accounts/:id/edit` |
