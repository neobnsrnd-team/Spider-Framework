# 02-naming.md — 네이밍 규칙

## 목적

Claude 코드 생성 시 파일 및 변수 네이밍을 통일하여
코드 생성 일관성·가독성·유지보수성을 확보한다.

---

# Page 네이밍 규칙

Page는 반드시 `Page` suffix 사용. 페이지 타입에 따라 접미사를 구분한다.

| 페이지 타입 | 규칙 | 예시 |
|------------|------|------|
| 목록 | `{Entity}ListPage` | `UserListPage` |
| 상세 | `{Entity}DetailPage` | `UserDetailPage` |
| 등록 | `{Entity}CreatePage` | `UserCreatePage` |
| 수정 | `{Entity}EditPage` | `UserEditPage` |
| 대시보드 | `{Domain}DashboardPage` | `AdminDashboardPage` |

---

# Hook 네이밍 규칙

Hook은 `use` prefix 사용. 동작에 따라 접미사를 구분한다.

| Hook 동작 | 규칙 | 예시 |
|----------|------|------|
| 목록 조회 | `use{Entity}List` | `useUserList` |
| 단건 조회 | `use{Entity}Detail` | `useUserDetail` |
| 등록 | `use{Entity}Create` | `useUserCreate` |
| 수정 | `use{Entity}Edit` | `useUserEdit` |
| 삭제 | `use{Entity}Delete` | `useUserDelete` |
| 폼 | `use{Entity}Form` | `useUserForm` |

---

# Repository 네이밍 규칙

Repository는 camelCase 사용

```
userRepository
orderRepository
dashboardRepository
```

---

# API 함수 네이밍

동사 기반으로 CRUD를 명확히 구분한다.

| 동작 | 규칙 | 예시 |
|------|------|------|
| 목록 조회 | `get{Entity}List` | `getUserList` |
| 단건 조회 | `get{Entity}Detail` 또는 `get{Entity}ById` | `getUserDetail` |
| 등록 | `create{Entity}` | `createUser` |
| 수정 | `update{Entity}` | `updateUser` |
| 삭제 | `delete{Entity}` | `deleteUser` |

---

# Component 네이밍 규칙

Component는 PascalCase. 역할에 따라 접미사를 구분한다.

| 역할 | 규칙 | 예시 |
|------|------|------|
| 테이블 | `{Entity}Table` | `UserTable` |
| 카드 | `{Entity}Card` | `UserCard` |
| 폼 | `{Entity}Form` | `UserForm` |
| 필터/검색 | `{Entity}Filter` | `UserFilter` |
| 상세 정보 | `{Entity}Info` | `UserInfo` |
| 목록 아이템 | `{Entity}Item` | `UserItem` |
| 모달 | `{Entity}{Action}Modal` | `UserDeleteModal` |

---

# Type 네이밍 규칙

| 타입 역할 | 규칙 | 예시 |
|----------|------|------|
| 엔티티 모델 | `{Entity}` | `User` |
| 등록 DTO | `Create{Entity}Dto` | `CreateUserDto` |
| 수정 DTO | `Update{Entity}Dto` | `UpdateUserDto` |
| API 응답 | `{Entity}Response` | `UserResponse` |

---

# 파일 네이밍 규칙

| 대상 | 규칙 | 예시 |
|------|------|------|
| Page | PascalCase + `Page` | `UserListPage.tsx` |
| Hook | camelCase + `use` prefix | `useUserList.ts` |
| Repository | camelCase + `Repository` | `userRepository.ts` |
| Types | camelCase + `Types` | `userTypes.ts` |
| Component | PascalCase | `UserTable.tsx` |

---

# 변수 네이밍 규칙

camelCase 사용

```ts
const userList = []
const userDetail = {}
const formData = {}
const isLoading = false
const isModalOpen = false
```

---

# 이벤트 네이밍 규칙

Hook에서 정의할 때는 `handle` prefix, props로 전달할 때는 `on` prefix 사용

| 위치 | 규칙 | 예시 |
|------|------|------|
| Hook 정의 | `handle{Action}` | `handleSubmit`, `handleSearch`, `handleDelete` |
| Component props | `on{Action}` | `onSubmit`, `onSearch`, `onDelete` |

```ts
// Hook에서 정의
const handleDelete = (id: string) => { ... }

// Component에 전달
<UserTable onDelete={handleDelete} />

// Component props 타입
interface UserTableProps {
  onDelete: (id: string) => void
}
```

---

# 폴더 네이밍 규칙

`features/` 하위 feature 폴더는 **camelCase** 사용 (`01-architecture.md` 참고).
Figma 화면 이름을 camelCase로 변환한다.

```
src/
  features/
    transactionDetail/   ← camelCase (✅)
    accountList/         ← camelCase (✅)
    hanaHome/            ← camelCase (✅)
  router/
```

❌ `TransactionDetail/` — PascalCase 금지
❌ `transaction-detail/` — kebab-case 금지
❌ `transaction_detail/` — snake_case 금지

---

# 금지 규칙

| 금지 패턴 | 이유 | 올바른 패턴 |
|-----------|------|-------------|
| `index.ts` 남발 | 파일 역할 불명확 | `userRepository.ts` |
| `page.tsx` | Page suffix + Entity명 없음 | `UserListPage.tsx` |
| `list.tsx` | Entity명 없음 | `UserTable.tsx` |
| `UsersPage` | 복수형 Page 금지 | `UserListPage` |
| `UserListComponent` | Component suffix 금지 | `UserList` |
| `UserListView` | View suffix 금지 | `UserList` |
| `user-repository.ts` | kebab-case 금지 | `userRepository.ts` |
| `getUser_list` | snake_case 금지 | `getUserList` |

---

# 핵심 체크리스트

✔ Page — `{Entity}{Type}Page` suffix
✔ Hook — `use` prefix
✔ Repository — camelCase + `Repository` suffix
✔ Component — PascalCase + 역할 suffix
✔ API 함수 — 동사 기반 (get/create/update/delete)
✔ 이벤트 — Hook: `handle~`, props: `on~`
✔ `index.ts` / `page.tsx` / `list.tsx` 금지
