# React Generate 메뉴 개선 구현 계획

> GitHub 이슈: neobnsrnd-team/POC_HNC#14  
> 작성일: 2026-04-14

---

## 현재 상태

| 항목 | 상태 |
|---|---|
| DB insert/select | `ReactGenerateMapper.java`에 TODO 주석만 있음, 미구현 |
| 승인 요청/승인 버튼 | 프론트엔드 `alert("구현 예정")` 상태 |
| 실패 이력 저장 | 없음 |
| 초기화 버튼 | 없음 |

### 관련 파일 위치

| 역할 | 경로 |
|---|---|
| Controller | `src/main/java/com/example/admin_demo/domain/reactgenerate/controller/ReactGenerateController.java` |
| Service | `src/main/java/com/example/admin_demo/domain/reactgenerate/service/ReactGenerateService.java` |
| Mapper Interface | `src/main/java/com/example/admin_demo/domain/reactgenerate/mapper/ReactGenerateMapper.java` |
| Mapper XML | `src/main/resources/mapper/oracle/reactgenerate/ReactGenerateMapper.xml` |
| Status Enum | `src/main/java/com/example/admin_demo/domain/reactgenerate/enums/ReactGenerateStatus.java` |
| Thymeleaf 뷰 | `src/main/resources/templates/pages/react-generate/react-generate.html` |
| JS 스크립트 | `src/main/resources/templates/pages/react-generate/react-generate-script.html` |
| DDL (Oracle) | `docs/sql/oracle/01_create_tables.sql` |
| DDL (MySQL) | `docs/sql/mysql/01_create_tables.sql` |
| 프롬프트 파일 | `src/main/resources/prompts/` |

### 현재 DB 테이블 (`REACT_GENERATE_HIS`)

```sql
ID            VARCHAR2(36)   PK
FIGMA_URL     VARCHAR2(1000) NOT NULL
REQUIREMENTS  CLOB
SYSTEM_PROMPT CLOB           -- 감사용
USER_PROMPT   CLOB
REACT_CODE    CLOB
STATUS        VARCHAR2(20)   DEFAULT 'GENERATED'
              -- CHECK: GENERATED | PENDING_APPROVAL | APPROVED | REJECTED
APPROVED_BY   VARCHAR2(100)
APPROVED_AT   VARCHAR2(14)
CREATED_BY    VARCHAR2(100)  NOT NULL
CREATED_AT    VARCHAR2(14)   NOT NULL
```

### 현재 상태 흐름

```
GENERATED → PENDING_APPROVAL → APPROVED
                             ↘ REJECTED (정의만 있음, 미구현)
```

---

## 구현 순서

Feature 2 → Feature 1 → Feature 3 → Feature 4 → Feature 5 순으로 진행한다.  
Feature 2가 DB·Service 기반을 완성하므로 나머지 기능의 토대가 된다.

---

## Feature 1 — 초기화 버튼

**영향 범위:** 프론트엔드 전용, 백엔드 변경 없음

**변경 파일:**
- `react-generate.html`
- `react-generate-script.html`

**구현 내용:**
- 입력 폼(Figma URL, 요구사항)을 빈 값으로 리셋
- Result Section 전체(상태 배지, 탭, 액션 버튼, iframe) 숨김 처리
- 생성 중 인디케이터가 표시 중일 때는 버튼 비활성화

---

## Feature 2 — 실패 이력 저장

**영향 범위:** DDL, Mapper XML, Mapper Interface, Service, DTO

### Step 1 — DDL 변경

Oracle (`docs/sql/oracle/01_create_tables.sql`):
```sql
-- FAIL_REASON 컬럼 추가
ALTER TABLE REACT_GENERATE_HIS ADD (FAIL_REASON CLOB);

-- STATUS CHECK 제약에 FAILED 추가 (기존 제약 삭제 후 재생성)
ALTER TABLE REACT_GENERATE_HIS DROP CONSTRAINT chk_react_generate_status;
ALTER TABLE REACT_GENERATE_HIS ADD CONSTRAINT chk_react_generate_status
    CHECK (STATUS IN ('GENERATED', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'FAILED'));
```

MySQL도 동일하게 수정 (`docs/sql/mysql/01_create_tables.sql`).

### Step 2 — `ReactGenerateStatus` enum

```java
// FAILED 항목 추가
FAILED  // 코드 생성 실패 (Figma API 오류, Claude API 오류, 검증 실패 등)
```

### Step 3 — Mapper XML (`ReactGenerateMapper.xml`)

```xml
<!-- insert 구문에 FAIL_REASON 추가 -->
<insert id="insert">
    INSERT INTO REACT_GENERATE_HIS
        (ID, FIGMA_URL, REQUIREMENTS, SYSTEM_PROMPT, USER_PROMPT,
         REACT_CODE, STATUS, FAIL_REASON, CREATED_BY, CREATED_AT)
    VALUES
        (#{id}, #{figmaUrl}, #{requirements}, #{systemPrompt}, #{userPrompt},
         #{reactCode}, #{status}, #{failReason}, #{createdBy}, #{createdAt})
</insert>

<!-- selectById 결과에 failReason 매핑 추가 -->
<result column="FAIL_REASON" property="failReason"/>
```

### Step 4 — Service (`ReactGenerateService.java`)

`generate()` 메서드의 catch 블록에서 실패 이력을 저장한 뒤 예외를 다시 throw:

```java
} catch (Exception e) {
    // 실패 이력 저장: status=FAILED, failReason=오류 메시지
    ReactGenerateHistory failRecord = ReactGenerateHistory.builder()
        .id(UUID.randomUUID().toString())
        .figmaUrl(request.getFigmaUrl())
        .requirements(request.getRequirements())
        .status(ReactGenerateStatus.FAILED)
        .failReason(e.getMessage())
        .createdBy(currentUser)
        .createdAt(now)
        .build();
    reactGenerateMapper.insert(failRecord);
    throw e;
}
```

### Step 5 — `ReactGenerateResponse` DTO

```java
private String failReason;  // 실패 시 오류 원인 메시지
```

---

## Feature 3 — 코드 품질 검증 (Java 정규표현식 패턴 탐지)

**영향 범위:** 신규 `CodeValidator` 서비스, Service, DTO

**아키텍처:** Node.js/ESLint 없이 Java 정규표현식으로 보안 위협 패턴을 직접 탐지.
배포 환경에 Node.js 설치 불필요, 외부 의존성 없음.

> AST 분석이 아니므로 주석 내 패턴도 탐지될 수 있다. 오탐률보다 미탐률을 낮추는 방향으로 운용한다.

### Step 1 — `CodeValidationRule` 정의

탐지 대상 패턴과 심각도를 한 곳에서 관리한다.

```java
// domain/reactgenerate/validator/CodeValidationRule.java
public enum CodeValidationRule {

    EVAL_USAGE(
        Pattern.compile("\\beval\\s*\\("),
        Severity.ERROR,
        "eval() 사용 금지: 임의 코드 실행 위험"
    ),
    LOCAL_STORAGE(
        Pattern.compile("\\blocalStorage\\b"),
        Severity.ERROR,
        "localStorage 직접 접근 금지: 민감 정보 노출 위험"
    ),
    SESSION_STORAGE(
        Pattern.compile("\\bsessionStorage\\b"),
        Severity.ERROR,
        "sessionStorage 직접 접근 금지: 민감 정보 노출 위험"
    ),
    FETCH_EXTERNAL(
        // https://로 시작하는 fetch 중 허용된 도메인(api.figma.com, api.anthropic.com) 외
        Pattern.compile("fetch\\s*\\(\\s*['\"]https?://(?!api\\.figma\\.com|api\\.anthropic\\.com)"),
        Severity.ERROR,
        "알 수 없는 외부 도메인으로의 fetch 금지"
    ),
    INNER_HTML(
        Pattern.compile("\\.innerHTML\\s*="),
        Severity.WARN,
        "innerHTML 직접 할당: XSS 위험 — dangerouslySetInnerHTML 또는 textContent 사용 권장"
    ),
    DOCUMENT_WRITE(
        Pattern.compile("\\bdocument\\.write\\s*\\("),
        Severity.WARN,
        "document.write() 사용 지양"
    );

    public enum Severity { ERROR, WARN }

    final Pattern pattern;
    final Severity severity;
    final String message;
}
```

### Step 2 — `CodeValidator` 서비스 생성

```
src/main/java/com/example/admin_demo/domain/reactgenerate/validator/CodeValidator.java
src/main/java/com/example/admin_demo/domain/reactgenerate/validator/CodeValidationRule.java
src/main/java/com/example/admin_demo/domain/reactgenerate/validator/CodeValidationResult.java
```

`CodeValidator` 동작 흐름:
1. 전체 룰을 순회하며 `Pattern.matcher(code).find()` 로 패턴 탐지
2. ERROR 룰 위반이 1개라도 있으면 `passed = false`
3. `CodeValidationResult` 반환

`CodeValidationResult` 구조:
```java
boolean passed;
List<String> errors;    // ERROR 레벨 위반 → 코드 반려
List<String> warnings;  // WARN 레벨 위반 → 통과하되 응답에 포함
```

### Step 3 — Service에 검증 단계 추가

`generate()` 내 Claude API 호출 직후:

```java
String reactCode = claudeApiClient.generate(...);

// 정규표현식 보안 패턴 검증
CodeValidationResult validation = codeValidator.validate(reactCode);
if (!validation.isPassed()) {
    // ERROR 위반 → 실패 이력 저장 후 예외 throw (Feature 2의 catch 블록에서 처리)
    throw new InvalidInputException(
        ErrorType.INVALID_INPUT,
        "보안 검증 실패: " + String.join(", ", validation.getErrors())
    );
}
// WARN은 통과하되 response에 포함
```

### Step 4 — `ReactGenerateResponse` DTO 수정

```java
private List<String> validationWarnings;  // WARN 레벨 패턴 탐지 목록
```

---

## Feature 4 — 승인 절차 (4-eyes principle)

**영향 범위:** DDL, Status Enum, Mapper XML, Service, Controller, 프론트엔드

### Step 1 — DDL 변경

```sql
-- 1차 승인자 컬럼 추가
ALTER TABLE REACT_GENERATE_HIS ADD (
    FIRST_APPROVER     VARCHAR2(100),
    FIRST_APPROVED_AT  VARCHAR2(14)
);
-- 기존 APPROVED_BY/APPROVED_AT → 2차(최종) 승인자로 역할 유지

-- STATUS CHECK 제약에 FIRST_APPROVED 추가
ALTER TABLE REACT_GENERATE_HIS DROP CONSTRAINT chk_react_generate_status;
ALTER TABLE REACT_GENERATE_HNC ADD CONSTRAINT chk_react_generate_status
    CHECK (STATUS IN (
        'GENERATED', 'PENDING_APPROVAL',
        'FIRST_APPROVED', 'APPROVED', 'REJECTED', 'FAILED'
    ));
```

### Step 2 — 상태 흐름 변경

```
GENERATED
    ↓ (승인 요청)
PENDING_APPROVAL
    ↓ (1차 승인 — 요청자가 아닌 사람)
FIRST_APPROVED
    ↓ (2차 승인 — 요청자·1차 승인자가 아닌 사람)
APPROVED
    ↓ (어느 단계에서든 반려 가능)
REJECTED
```

### Step 3 — `ReactGenerateStatus` enum 추가

```java
FIRST_APPROVED  // 1차 승인 완료, 2차 승인 대기
```

### Step 4 — Service (`approve()` 메서드 수정)

```java
public ReactGenerateApprovalResponse approve(String id, String currentUser) {
    ReactGenerateHistory history = reactGenerateMapper.selectById(id);

    // 요청자 본인 승인 불가
    if (currentUser.equals(history.getCreatedBy())) {
        throw new InvalidInputException(ErrorType.INVALID_INPUT, "요청자는 승인할 수 없습니다.");
    }

    if (history.getStatus() == ReactGenerateStatus.PENDING_APPROVAL) {
        // 1차 승인 처리
        reactGenerateMapper.updateStatus(id, FIRST_APPROVED, currentUser, now, null, null);

    } else if (history.getStatus() == ReactGenerateStatus.FIRST_APPROVED) {
        // 1차 승인자 본인 재승인 불가
        if (currentUser.equals(history.getFirstApprover())) {
            throw new InvalidInputException(ErrorType.INVALID_INPUT, "1차 승인자는 2차 승인할 수 없습니다.");
        }
        // 2차 승인 처리 → APPROVED
        reactGenerateMapper.updateStatus(id, APPROVED, currentUser, now, history.getFirstApprover(), history.getFirstApprovedAt());
    }
    ...
}
```

### Step 5 — 프론트엔드 (`react-generate-script.html`)

- 상태 배지에 `FIRST_APPROVED` 표시 추가 ("1차 승인 완료")
- 승인 버튼 활성화 조건:
  - `status == PENDING_APPROVAL` AND `현재 사용자 != 요청자`
  - `status == FIRST_APPROVED` AND `현재 사용자 != 요청자` AND `현재 사용자 != 1차 승인자`
- alert 제거 후 실제 API 호출 구현

---

## Feature 5 — design-tokens 추출 스크립트 수정

**영향 범위:** `src/main/resources/prompts/design-tokens.md` 또는 토큰 추출 스크립트

> **주의:** 현재 출력물 vs 기대 출력물을 비교한 뒤 수정 방향을 확정해야 한다.  
> 구현 전에 현재 `design-tokens.md` 내용과 원하는 형식을 함께 검토할 것.

---

## 최종 DB 스키마 (전체 변경 반영)

```sql
REACT_GENERATE_HIS
├── ID                 VARCHAR2(36)   PK
├── FIGMA_URL          VARCHAR2(1000) NOT NULL
├── REQUIREMENTS       CLOB
├── SYSTEM_PROMPT      CLOB
├── USER_PROMPT        CLOB
├── REACT_CODE         CLOB
├── STATUS             VARCHAR2(20)   DEFAULT 'GENERATED'
│   -- GENERATED | PENDING_APPROVAL | FIRST_APPROVED | APPROVED | REJECTED | FAILED
├── FAIL_REASON        CLOB           -- Feature 2 추가
├── FIRST_APPROVER     VARCHAR2(100)  -- Feature 4 추가
├── FIRST_APPROVED_AT  VARCHAR2(14)   -- Feature 4 추가
├── APPROVED_BY        VARCHAR2(100)  -- 2차(최종) 승인자
├── APPROVED_AT        VARCHAR2(14)
├── CREATED_BY         VARCHAR2(100)  NOT NULL
└── CREATED_AT         VARCHAR2(14)   NOT NULL
```
