# React 코드 승인 관리 — 작업 계획서

- **이슈**: [#22 React 코드 승인 관리 메뉴 구현](https://github.com/neobnsrnd-team/POC_HNC/issues/22)
- **작성일**: 2026-04-16
- **선행 조건**: 없음 (현재 코드베이스에서 바로 착수 가능)
- **후행 이슈**: [#31 React 코드 배포 관리 메뉴 구현](https://github.com/neobnsrnd-team/POC_HNC/issues/31)

---

## 1. 현재 상태 (As-Is)

### 구현된 것

| 항목 | 위치 | 내용 |
|------|------|------|
| STATUS enum | `ReactGenerateStatus.java` | `GENERATED`, `FAILED`, `PENDING_APPROVAL`, `APPROVED`, `REJECTED` |
| 승인 요청 API | `ReactGenerateController` `POST /{id}/request-approval` | 작성자 본인 검증 포함 |
| 승인 API | `ReactGenerateController` `POST /{id}/approve` | 구현됨, 단 **요청자 != 승인자 검증 없음** |
| 보안 스캔 | `ReactGenerateService.generate()` Step 6 | `CodeValidator`로 생성 시점에 실행, 실패 시 `FAILED` 저장 |
| DDL | `FWK_RPS_CODE_HIS` | `SCAN_PASSED`/`SCAN_FAILED` 없이 이미 올바른 상태 |

### 없는 것 (구현 필요)

- 반려(`reject`) API 및 로직
- 승인자 != 요청자 검증 (서버 사이드)
- `PENDING_APPROVAL` 전용 목록 조회 쿼리/API
- **React 코드 승인 관리** 신규 메뉴 (뷰, JS, 권한)
- `ReactApprovalService` / `ReactApprovalController` 분리

---

## 2. 목표 상태 (To-Be)

### 상태 흐름

```
[코드 생성 요청]
      ↓ 품질 검사(CodeValidator) → 보안 스캔 — 자동 실행
 GENERATED ←──── FAILED  (검사 실패, FAIL_REASON에 상세 기록)
      ↓  승인 요청 (작성자 본인)
 PENDING_APPROVAL
      ↓  승인 (작성자 외 1인)
   APPROVED  ──→  [이슈 #31 배포 관리로 이어짐]
      ↑↓ 반려 (어느 단계에서든)
  REJECTED
```

### 신규 API 구조

```
/api/react-approval
  GET    /              PENDING_APPROVAL 목록 조회 (페이지네이션)
  POST   /{id}/approve  승인 (요청자 본인 불가)
  POST   /{id}/reject   반려 (어느 단계에서든 가능)
```

---

## 3. 작업 단계

### Step 1. DDL 확인 및 수정 (`docs/sql/`)

> 현재 `CHK_REACT_GEN_STATUS` 제약에 `FIRST_APPROVED`가 없으므로 **추가 DDL 변경 불필요**.
> MySQL DDL도 동일하게 확인만 하면 됨.

- [ ] `docs/sql/oracle/01_create_tables.sql` — CHECK 제약 확인 (이미 올바름)
- [ ] `docs/sql/mysql/01_create_tables.sql` — 동일 상태 확인

---

### Step 2. 백엔드 — Mapper

**파일**: `ReactGenerateMapper.xml`, `ReactGenerateMapper.java`

#### 2-1. `selectPendingList` 쿼리 추가

`PENDING_APPROVAL` 상태만 조회하는 전용 쿼리. 기존 `selectList`와 별도로 분리하여 승인 관리 메뉴 전용으로 사용한다.

```xml
<!-- ReactGenerateMapper.xml에 추가 -->
<select id="selectPendingList"
        resultType="com.example.admin_demo.domain.reactgenerate.dto.ReactApprovalResponse">
    SELECT *
    FROM (
        SELECT INNER_QRY.*, ROWNUM AS RNUM
        FROM (
            SELECT
                CODE_ID        AS codeId,
                FIGMA_URL      AS figmaUrl,
                STATUS         AS status,
                CREATE_USER_ID AS createUserId,
                CREATE_DTIME   AS createDtime
            FROM FWK_RPS_CODE_HIS
            WHERE STATUS = 'PENDING_APPROVAL'
            ORDER BY CREATE_DTIME ASC  -- 오래된 요청 먼저
        ) INNER_QRY
        WHERE ROWNUM <= #{endRow}
    )
    WHERE RNUM > #{offset}
</select>

<select id="selectPendingCount" resultType="int">
    SELECT COUNT(*) FROM FWK_RPS_CODE_HIS WHERE STATUS = 'PENDING_APPROVAL'
</select>
```

#### 2-2. `ReactGenerateMapper.java`에 인터페이스 추가

```java
List<ReactApprovalResponse> selectPendingList(
    @Param("offset") int offset,
    @Param("endRow") int endRow);

int selectPendingCount();
```

---

### Step 3. 백엔드 — DTO

**파일 신규 생성**: `dto/ReactApprovalResponse.java`

승인 관리 목록에 필요한 필드만 담는 경량 DTO.

```java
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class ReactApprovalResponse {
    private String codeId;
    private String figmaUrl;
    private String status;
    private String createUserId;
    private String createDtime;
}
```

> `ReactGenerateApprovalResponse`(승인 요청 응답용)는 기존 그대로 유지.

---

### Step 4. 백엔드 — Service

**파일 신규 생성**: `service/ReactApprovalService.java`

기존 `ReactGenerateService`에 섞여 있는 `approve()` / `requestApproval()`과 분리하여 승인 워크플로우를 전담한다.

#### 4-1. `getPendingList(page, size)`

```java
public Map<String, Object> getPendingList(int page, int size) {
    int offset = (page - 1) * size;
    int endRow = offset + size;
    List<ReactApprovalResponse> list = reactGenerateMapper.selectPendingList(offset, endRow);
    int totalCount = reactGenerateMapper.selectPendingCount();
    return Map.of("list", list, "totalCount", totalCount, "page", page, "size", size);
}
```

#### 4-2. `approve(id, approverUserId)`

```java
public ReactGenerateApprovalResponse approve(String id, String approverUserId) {
    ReactGenerateResponse existing = requirePendingApproval(id);

    // 요청자 본인 승인 불가 — 클라이언트 우회 방지
    if (approverUserId.equals(existing.getCreateUserId())) {
        throw new InvalidInputException("코드 요청자는 승인할 수 없습니다.");
    }

    String now = LocalDateTime.now().format(FORMATTER);
    reactGenerateMapper.updateStatus(id, ReactGenerateStatus.APPROVED.name(), approverUserId, now);
    log.info("승인 완료 — codeId: {}, approver: {}", id, approverUserId);

    return ReactGenerateApprovalResponse.builder()
            .codeId(id).status(ReactGenerateStatus.APPROVED.name())
            .approvalUserId(approverUserId).approvalDtime(now).build();
}
```

#### 4-3. `reject(id, rejectorUserId)`

```java
// 어느 단계(PENDING_APPROVAL, GENERATED 등)에서든 반려 가능
public ReactGenerateApprovalResponse reject(String id, String rejectorUserId) {
    requireExists(id);
    String now = LocalDateTime.now().format(FORMATTER);
    reactGenerateMapper.updateStatus(id, ReactGenerateStatus.REJECTED.name(), rejectorUserId, now);
    log.info("반려 완료 — codeId: {}, rejector: {}", id, rejectorUserId);

    return ReactGenerateApprovalResponse.builder()
            .codeId(id).status(ReactGenerateStatus.REJECTED.name())
            .approvalUserId(rejectorUserId).approvalDtime(now).build();
}
```

#### 4-4. 기존 `ReactGenerateService` 정리

- `approve()` 메서드 → `ReactApprovalService`로 이동 후 **요청자 != 승인자 검증 추가**
- `requestApproval()` 메서드는 생성 도메인 범주이므로 `ReactGenerateService`에 유지

---

### Step 5. 백엔드 — Controller

**파일 신규 생성**: `controller/ReactApprovalController.java`

기존 `ReactGenerateController`의 `approve()` 엔드포인트는 제거하고, 승인 관련 엔드포인트를 이 컨트롤러로 일원화한다.

```java
@RestController
@RequestMapping("/api/react-approval")
@PreAuthorize("hasAuthority('REACT_APPROVAL:R')")
@RequiredArgsConstructor
public class ReactApprovalController {

    private final ReactApprovalService reactApprovalService;

    // PENDING_APPROVAL 목록 조회
    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPendingList(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) { ... }

    // 승인
    @PostMapping("/{id}/approve")
    @PreAuthorize("hasAuthority('REACT_APPROVAL:W')")
    public ResponseEntity<ApiResponse<ReactGenerateApprovalResponse>> approve(
            @PathVariable String id) { ... }

    // 반려
    @PostMapping("/{id}/reject")
    @PreAuthorize("hasAuthority('REACT_APPROVAL:W')")
    public ResponseEntity<ApiResponse<ReactGenerateApprovalResponse>> reject(
            @PathVariable String id) { ... }
}
```

> **레이어 의존성 규칙 준수**: `ReactApprovalController` → `ReactApprovalService` → `ReactGenerateMapper`

---

### Step 6. 권한 등록

**파일**: `src/main/resources/menu-resource-permissions.yml`

```yaml
v3_react_approval:
  R: REACT_APPROVAL:R
  W: REACT_APPROVAL:W
```

---

### Step 7. 프론트엔드 — 뷰

**파일 신규 생성**: `templates/pages/react-approval/react-approval.html`

긴급공지 배포 관리 뷰 구조를 참고하여 구성.

```
[React 코드 승인 관리]
┌─────────────────────────────────────────────────┐
│  PENDING_APPROVAL 목록 테이블                     │
│  CODE_ID | Figma URL | 요청자 | 요청일시 | 액션   │
│  [코드 보기] [승인] [반려]                        │
├─────────────────────────────────────────────────┤
│  페이징                                          │
└─────────────────────────────────────────────────┘

[코드 미리보기 모달]
  - 생성된 React 코드 표시 (read-only)
  - 코드 복사 버튼
```

**권한 분기**:
- `REACT_APPROVAL:R` — 목록 조회, 코드 보기
- `REACT_APPROVAL:W` — 승인/반려 버튼 노출

---

### Step 8. 프론트엔드 — JS 스크립트

**파일 신규 생성**: `templates/pages/react-approval/react-approval-script.html`

```javascript
const ReactApprovalPage = {
    currentPage: 1,
    pageSize: 10,

    init()       // load(1) + 버튼 이벤트 바인딩
    load(page)   // GET /api/react-approval?page=&size= → renderTable() + renderPagination()
    renderTable(list, total)
    renderPagination(total)
    openCodeModal(codeId)  // GET /api/react-generate/{id} → 모달에 코드 표시
    approve(id)  // confirm → POST /api/react-approval/{id}/approve → load(1) + EventBus.emit
    reject(id)   // confirm + 반려 사유 입력 → POST /api/react-approval/{id}/reject → load(1)
}
```

**EventBus 발행**: 승인/반려 후 생성 이력 탭 갱신
```javascript
EventBus.emit('admin:reactApproval:statusChanged');
```

---

### Step 9. 프론트엔드 — 승인 요청 버튼 연결

**파일**: `templates/pages/react-generate/react-generate-script.html`

현재 승인 요청은 이미 실제 API를 호출하고 있으므로 추가 수정 불필요.
승인 버튼(`btnApprove`)은 `ReactGenerateController`에 있는 기존 엔드포인트에서
**신규 `ReactApprovalController`로 URL 변경** 필요:

```javascript
// 변경 전
url: API_BASE_URL + '/react-generate/' + currentId + '/approve'

// 변경 후
url: API_BASE_URL + '/react-approval/' + currentId + '/approve'
```

---

## 4. 작업 순서 및 의존 관계

```
Step 1 (DDL 확인)
    ↓
Step 2–3 (Mapper + DTO)    ← 병렬 가능
    ↓
Step 4 (Service)
    ↓
Step 5 (Controller)
    ↓
Step 6 (권한 등록)         ← Step 7–8과 병렬 가능
Step 7–8 (뷰 + JS)
    ↓
Step 9 (기존 JS 수정)
```

---

## 5. 파일 변경 목록

### 신규 생성

| 파일 | 설명 |
|------|------|
| `domain/reactgenerate/dto/ReactApprovalResponse.java` | 승인 목록 조회용 DTO |
| `domain/reactgenerate/service/ReactApprovalService.java` | 승인 워크플로우 서비스 |
| `domain/reactgenerate/controller/ReactApprovalController.java` | 승인 관리 API 컨트롤러 |
| `templates/pages/react-approval/react-approval.html` | 승인 관리 뷰 |
| `templates/pages/react-approval/react-approval-script.html` | 승인 관리 JS |

### 수정

| 파일 | 변경 내용 |
|------|----------|
| `mapper/oracle/reactgenerate/ReactGenerateMapper.xml` | `selectPendingList`, `selectPendingCount` 쿼리 추가 |
| `domain/reactgenerate/mapper/ReactGenerateMapper.java` | `selectPendingList`, `selectPendingCount` 인터페이스 추가 |
| `domain/reactgenerate/service/ReactGenerateService.java` | `approve()` 메서드 제거 (ReactApprovalService로 이전) |
| `domain/reactgenerate/controller/ReactGenerateController.java` | `approve()` 엔드포인트 제거 |
| `resources/menu-resource-permissions.yml` | `v3_react_approval` 권한 추가 |
| `templates/pages/react-generate/react-generate-script.html` | 승인 API URL을 `/react-approval/{id}/approve`로 변경 |

---

## 6. 인수 기준 체크리스트

- [ ] `PENDING_APPROVAL` 상태 목록만 승인 관리 메뉴에 조회된다
- [ ] 요청자 본인이 승인 시도하면 400 오류가 반환된다
- [ ] 승인 시 `STATUS`가 `APPROVED`로 변경된다
- [ ] 반려 시 `STATUS`가 `REJECTED`로 변경된다
- [ ] 반려는 `PENDING_APPROVAL` 외 다른 상태에서도 가능하다
- [ ] 승인/반려 후 생성 이력 탭이 EventBus를 통해 자동 갱신된다
- [ ] `REACT_APPROVAL:R/W` 권한으로 메뉴 접근이 제어된다
- [ ] ArchUnit 레이어 의존성 규칙(`Controller → Service → Mapper`)을 위반하지 않는다
- [ ] Spotless 포맷 검사(`./mvnw spotless:check`)를 통과한다

---

## 7. 참고

- 긴급공지 배포 패턴: `EmergencyNoticeDeployController`, `EmergencyNoticeDeployService`
- EventBus: `static/js/utils/event-bus.js`
- 예외 계층: `InvalidInputException` (요청자 본인 승인), `NotFoundException` (존재하지 않는 codeId)
- 후행 이슈 #31에서 `APPROVED` 이후 배포 흐름(`DRAFT → DEPLOYED → ENDED`) 구현 예정
