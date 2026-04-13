# 05-repository.md — Repository 패턴

## 목적

Repository 패턴의 역할·구조·작성 규칙을 정의한다.
API 응답 구조가 변경되어도 Repository만 수정하면 되고,
Hook과 Page는 변경하지 않아도 된다. 유지보수 비용이 크게 줄어든다.

---

# 데이터 흐름

```
Page
  ↓ (이벤트 전달)
Hook (React Query)
  ↓ (함수 호출)
Repository
  ↓ (HTTP 요청)
서버 API
```

---

# Repository 역할

Repository는 아래 4가지를 모두 담당한다.

| 역할        | 설명                               |
| ----------- | ---------------------------------- |
| HTTP 호출   | axios를 사용한 서버 요청           |
| 데이터 가공 | 불필요한 필드 제거, 정렬 등        |
| 모델 변환   | 서버 필드명 → 클라이언트 모델 변환 |
| 에러 처리   | HTTP 에러를 클라이언트 에러로 변환 |

Hook과 Component는 이 역할을 절대 담당하지 않는다.

---

# 작성 규칙

## 기본 구조

```ts
/**
 * @file userRepository.ts
 * @description 사용자 관련 API 호출·데이터 가공·모델 변환 담당
 */
export const userRepository = {
  // 함수명은 동사 + 명사형으로 작성
  getUsers: async (): Promise<User[]> => { ... },
  getUserById: async (id: string): Promise<User> => { ... },
  createUser: async (data: CreateUserDto): Promise<User> => { ... },
  updateUser: async (id: string, data: UpdateUserDto): Promise<User> => { ... },
  deleteUser: async (id: string): Promise<void> => { ... },
}
```

## 모델 변환 포함

서버 응답 필드명이 클라이언트 모델과 다를 경우 반드시 변환한다.

```ts
getUsers: async (): Promise<User[]> => {
  const response = await axios.get('/api/users');
  // 서버 snake_case → 클라이언트 camelCase 변환
  return response.data.map((item) => ({
    id: item.user_id,
    name: item.user_name,
    email: item.user_email,
    createdAt: item.created_at,
  }));
};
```

## 에러 처리 포함

```ts
getUserById: async (id: string): Promise<User> => {
  try {
    const response = await axios.get(`/api/users/${id}`);
    return response.data;
  } catch (error) {
    // HTTP 에러를 클라이언트가 이해할 수 있는 형태로 변환
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }
    throw error;
  }
};
```

---

# Hook에서 Repository 사용

```ts
/**
 * @file useUsers.ts
 * @description 사용자 목록 데이터 패칭 훅
 */
export const useUsers = () =>
  useQuery({
    queryKey: ['users'],
    queryFn: userRepository.getUsers, // Repository 함수만 호출
  });

export const useCreateUser = () =>
  useMutation({
    mutationFn: userRepository.createUser,
  });
```

---

# 금지 규칙

❌ Hook 내부에서 axios 직접 호출

```ts
// 금지
export const useUsers = () => useQuery({ queryFn: () => axios.get('/api/users') });
```

❌ Component 내부에서 axios 직접 호출

```ts
// 금지
useEffect(() => {
  axios.get('/api/users').then((res) => setUsers(res.data));
}, []);
```

❌ Repository에서 React 상태 관리 (`useState`, `useEffect` 사용 금지)

```ts
// 금지 — Repository는 순수 함수여야 함
export const userRepository = {
  getUsers: async () => {
    const [data, setData] = useState([]); // 금지
  },
};
```

❌ Repository에서 UI 로직 포함

```ts
// 금지 — UI 관련 코드는 Component에서 처리
export const userRepository = {
  getUsers: async () => {
    const result = await axios.get('/users');
    alert('로드 완료'); // 금지
    return result.data;
  },
};
```

---

# 네이밍 규칙

| 대상          | 규칙                              | 예시                     |
| ------------- | --------------------------------- | ------------------------ |
| 파일명        | `{entity}Repository.ts`           | `userRepository.ts`      |
| 함수명 (조회) | `get{Entity}` / `get{Entity}List` | `getUser`, `getUserList` |
| 함수명 (생성) | `create{Entity}`                  | `createUser`             |
| 함수명 (수정) | `update{Entity}`                  | `updateUser`             |
| 함수명 (삭제) | `delete{Entity}`                  | `deleteUser`             |
