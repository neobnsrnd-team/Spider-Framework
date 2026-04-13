# 04-state-data.md — 상태 관리 및 데이터 처리

## 목적

Claude가 상태를 어디서 어떻게 관리할지, 데이터 처리 시 필수 상태를 빠짐없이 구현하도록
명확한 기준을 정의한다.

---

# 1. 상태 위치 결정 기준

상태의 출처(서버 vs 클라이언트)에 따라 관리 도구를 다르게 사용한다.

| 상태 유형                            | 위치                | 도구                                    |
| ------------------------------------ | ------------------- | --------------------------------------- |
| 서버 데이터 (API 응답)               | Hook                | React Query (`useQuery`, `useMutation`) |
| 로컬 UI 상태 (모달 open, 탭 선택 등) | Hook 또는 Component | `useState`                              |
| 폼 상태                              | Hook                | `useState` 또는 `useReducer`            |
| 전역 상태 (인증, 테마)               | Context             | `Context API`                           |

---

# 2. Page에서 useState 직접 사용 금지

Page에서는 상태를 직접 생성하지 않는다.
상태는 반드시 Hook을 통해 가져온다.
Page에서 `useState`를 직접 쓰면 로직이 Page에 쌓이고 테스트와 재사용이 불가능해진다.

GOOD

```tsx
// Page는 Hook 호출만
const { data, isLoading } = useUserList();
const { isOpen, handleOpen, handleClose } = useModal();
```

BAD

```tsx
// Page에서 직접 상태 생성 금지
const [users, setUsers] = useState([]);
const [isOpen, setIsOpen] = useState(false);
```

---

# 3. 서버 데이터 상태 규칙

서버에서 가져오는 데이터는 반드시 React Query를 사용한다.
`useState` + `useEffect` 조합으로 서버 데이터를 관리하지 않는다.
서버 데이터에 `useState`를 사용하면 캐싱·동기화·에러 처리를 직접 구현해야 해서 코드가 복잡해진다.

GOOD

```ts
// Hook에서 React Query 사용
export const useUserList = () =>
  useQuery({ queryKey: ['users'], queryFn: userRepository.getUserList });
```

BAD

```ts
// useState + useEffect로 서버 데이터 관리 금지
export const useUserList = () => {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    userRepository.getUserList().then(setUsers);
  }, []);
  return { users };
};
```

---

# 4. 로컬 UI 상태 규칙

모달 open/close, 탭 선택 등 UI 상태는 `useState`를 사용한다.
로컬 UI 상태는 Hook 또는 Component 내부에서 직접 관리한다.

GOOD

```ts
// 로컬 UI 상태는 useState 허용
const [isModalOpen, setIsModalOpen] = useState(false);
const [activeTab, setActiveTab] = useState('list');
```

---

# 5. 폼 상태 규칙

폼 상태는 Hook으로 분리한다. Page에서 직접 폼 상태를 관리하지 않는다.

GOOD

```ts
// hooks/useUserForm.ts
export const useUserForm = () => {
  const [form, setForm] = useState({ name: '', email: '' });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return { form, handleChange };
};
```

BAD

```tsx
// Page에서 폼 상태 직접 관리 금지
const UserFormPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  // ...
};
```

---

# 6. 전역 상태 규칙

전역 상태는 최소화한다. 아래 경우에만 허용한다.

```
✔ 인증 정보 (로그인 사용자)
✔ 테마 설정
✔ 언어 설정
```

페이지별 데이터를 전역 상태로 관리하지 않는다.
React Query cache가 전역 서버 상태를 담당한다.
과도한 전역 상태는 데이터 흐름을 추적하기 어렵게 만든다.

---

# 7. loading / error / empty 처리 필수

모든 데이터 화면은 반드시 처리해야 한다.
반드시 이 순서로 처리한다: `isLoading` → `isError` → empty check → 정상 렌더링

```tsx
if (isLoading) return null; // 로딩 중 — 필요 시 스켈레톤 UI로 대체
if (isError) return <ErrorState description="데이터를 불러오지 못했습니다." onRetry={() => refetch()} />;
if (!data || data.length === 0) return <EmptyState title="데이터가 없습니다." />;

return <Component data={data} />;
```

처리하지 않으면 로딩 중 깨진 화면, 에러 시 빈 화면, 데이터 없을 때 의미 없는 빈 테이블이 사용자에게 노출된다.

## Loading 처리

GOOD

```tsx
const { data, isLoading } = useUserList();
if (isLoading) return null; // 로딩 중 — 필요 시 스켈레톤 UI로 대체
```

BAD

```tsx
// loading 처리 없이 바로 렌더링
const { data } = useUserList();
return <TransactionList items={data} />;
```

## Error 처리

GOOD

```tsx
if (isError) return <ErrorState description="데이터를 불러오지 못했습니다." onRetry={() => refetch()} />;
```

BAD

```tsx
// error 처리 없음 — 화면이 깨지거나 빈 화면 노출
const { data } = useUserList();
return <TransactionList items={data} />;
```

## Empty 처리

GOOD

```tsx
if (data.length === 0)
  return <EmptyState title="내용이 없어요" description="아직 데이터가 없습니다." />;
```

BAD

```tsx
// empty 처리 없음 — 빈 목록이 그대로 노출
return <TransactionList items={data} />;
```

---

# 8. null 체크 규칙

null 체크 필수. optional chaining과 nullish coalescing을 사용한다.

GOOD

```tsx
// nullish coalescing — undefined/null일 때 기본값 제공
const list = data ?? []
const total = data?.total ?? 0

// optional chaining — 중첩 접근 시 안전하게
<Text>{user?.name}</Text>
```

BAD

```tsx
// null 체크 없이 접근 — 런타임 오류 위험
const list = data
<Text>{user.name}</Text>
```

---

# 9. Mutation onSuccess / onError 처리

데이터 변경(생성/수정/삭제)은 반드시 `onSuccess` / `onError`를 처리한다.

GOOD

```ts
const mutation = useMutation({
  mutationFn: userRepository.deleteUser,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] }); // 목록 갱신
  },
  onError: (error) => {
    console.error('삭제 실패:', error);
  },
});
```

BAD

```ts
// onSuccess, onError 없음 — 성공/실패 처리 불가
const mutation = useMutation({ mutationFn: userRepository.deleteUser });
```

---

# 10. 목록 렌더링 key 포함

목록 렌더링 시 반드시 `key`를 포함한다.

GOOD

```tsx
{
  data.map((item) => (
    <Card key={item.id}>
      <Text>{item.name}</Text>
    </Card>
  ));
}
```

BAD

```tsx
// key 없음 — React 경고 및 렌더링 오류
{
  data.map((item) => (
    <Card>
      <Text>{item.name}</Text>
    </Card>
  ));
}
```

---

# 12. 필터 처리 규칙

필터는 Hook에서 처리한다. Page에서는 UI만 구성한다.

GOOD

```ts
// Hook에서 필터 상태와 핸들러 정의
export const useUserList = () => {
  const [filter, setFilter] = useState({ keyword: '', status: '' });

  const { data } = useQuery({
    queryKey: ['users', filter],
    queryFn: () => userRepository.getUserList(filter),
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
  };

  return { data, filter, handleFilterChange };
};
```

```tsx
// Page에서는 UI만
const { data, handleFilterChange } = useUserList();

return (
  <Section gap="md">
    <Input leftIcon={<Search size={16} />} onChange={(e) => handleFilterChange('keyword', e.target.value)} />
    <TransactionList items={data} />
  </Section>
);
```

BAD

```tsx
// Page에서 직접 필터 로직 처리 금지
const [keyword, setKeyword] = useState('');
const filtered = data.filter((u) => u.name.includes(keyword));
```

---

# 13. 데이터 가공 위치 규칙

| 위치       | 허용 여부 | 설명                       |
| ---------- | --------- | -------------------------- |
| Hook       | 허용      | 정렬, 필터링, 상태 계산    |
| Repository | 허용      | 서버 응답 모델 변환        |
| Page       | 금지      | 데이터 가공 로직 포함 금지 |
| Component  | 금지      | 데이터 가공 로직 포함 금지 |

---

# 핵심 체크리스트

✔ 서버 데이터 — React Query (`useQuery`, `useMutation`)
✔ 로컬 UI 상태 — `useState`
✔ Page에서 `useState` 직접 사용 금지
✔ loading 처리 필수
✔ error 처리 필수
✔ empty 처리 필수 (이 순서로)
✔ null 체크 (optional chaining / nullish coalescing)
✔ 목록 렌더링 시 key 포함
✔ mutation onSuccess / onError 처리
✔ 필터 로직은 Hook에서
✔ 데이터 가공은 Hook 또는 Repository에서
