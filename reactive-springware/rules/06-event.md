# 06-event.md — 이벤트 핸들러

## 목적

Claude가 이벤트 핸들러를 어디서 정의하고 어떻게 전달할지 명확한 기준을 정의한다.

---

# 기본 원칙

```
Hook → 이벤트 핸들러 정의
Page → Hook에서 핸들러를 받아 Component에 전달
Component → callback props로만 수신, 내부에서 직접 처리 금지
```

Component 내부에서 직접 이벤트를 처리하면 같은 컴포넌트를 다른 동작으로 재사용할 수 없다.

---

# 이벤트 핸들러 위치 규칙

| 이벤트 유형 | 정의 위치 |
|-------------|-----------|
| API 호출을 포함한 이벤트 | Hook |
| 라우팅 이동 | Hook |
| 모달 open/close | Hook |
| 단순 UI 토글 | Component 내부 허용 |

---

# Hook에서 핸들러 정의

GOOD
```ts
// hooks/useUserList.ts
export const useUserList = () => {
  const { data } = useQuery(...)
  const deleteMutation = useMutation({ mutationFn: userRepository.deleteUser })

  // 이벤트 핸들러는 Hook에서 정의
  const handleDelete = (id: string) => {
    deleteMutation.mutate(id)
  }

  const handleSearch = (keyword: string) => {
    // 검색 로직
  }

  return { data, handleDelete, handleSearch }
}
```

BAD
```tsx
// onClick 내부에서 직접 API 호출 금지
<Button onClick={() => axios.delete(`/users/${id}`)} />

// onClick 내부에서 직접 Repository 호출 금지
<Button onClick={() => userRepository.deleteUser(id)} />
```

---

# Page에서 핸들러 전달

Page는 Hook에서 받은 핸들러를 Component에 전달만 한다.

GOOD
```tsx
// Page
const { data, handleDelete, handleSearch } = useUserList()

return (
  <UserTable
    data={data}
    onDelete={handleDelete}
    onSearch={handleSearch}
  />
)
```

BAD
```tsx
// Page에서 핸들러 직접 정의 금지
const handleDelete = async (id: string) => {
  await axios.delete(`/users/${id}`)
  refetch()
}
```

---

# Component에서 핸들러 수신

Component는 callback props만 받아서 이벤트 발생 시 호출한다.
내부에서 API 호출, 라우팅, 비즈니스 로직 처리 금지.

GOOD
```tsx
// Component — callback props로만 수신
interface UserTableProps {
  data: User[]
  onDelete: (id: string) => void
  onSearch: (keyword: string) => void
}

const UserTable = ({ data, onDelete, onSearch }: UserTableProps) => {
  return (
    <Stack gap="sm">
      {data.map(user => (
        <Card key={user.id}>
          <Inline justify="between" align="center">
            <Text>{user.name}</Text>
            <Button variant="danger" onClick={() => onDelete(user.id)}>삭제</Button>
          </Inline>
        </Card>
      ))}
    </Stack>
  )
}
```

BAD
```tsx
// Component 내부에서 직접 API 호출 금지
const UserTable = ({ data }: { data: User[] }) => {
  const handleDelete = async (id: string) => {
    await axios.delete(`/users/${id}`) // 금지
    router.push('/users')              // 라우팅 금지
  }

  return <Stack gap="sm">...</Stack>
}
```

---

# 이벤트 핸들러 네이밍

| 위치 | 규칙 | 예시 |
|------|------|------|
| Hook 정의 | `handle{Action}` | `handleDelete`, `handleSearch` |
| props 전달 | `on{Action}` | `onDelete`, `onSearch` |

```tsx
// Hook에서 handle~ 로 정의
const handleDelete = (id: string) => { ... }

// Component에 on~ 으로 전달
<UserTable onDelete={handleDelete} />

// Component props에 on~ 으로 수신
interface UserTableProps {
  onDelete: (id: string) => void
}
```

---

# 체크리스트

이벤트 처리 코드를 생성할 때 반드시 확인한다.

```
✔ API 호출 포함 핸들러는 Hook에서 정의
✔ Component는 callback props만 수신
✔ onClick 내부에 axios/fetch 직접 호출 없음
✔ 핸들러명 - Hook: handle~, props: on~
```
