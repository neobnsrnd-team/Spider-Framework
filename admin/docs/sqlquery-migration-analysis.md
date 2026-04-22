# SQL Query 관리 화면 마이그레이션 누락 기능 분석 보고서

> **작성일**: 2026-04-22  
> **대상**: `sqlquery-manage` 화면 마이그레이션  
> **구버전 경로**: `vueSpiderAdmin/jsp/fwk_ibk/SQL_manage/query_manage/`  
> **신버전 경로**: `admin/src/main/resources/templates/pages/sqlquery-manage/`

---

## 목차

1. [기능별 누락 리스트](#1-기능별-누락-리스트)
2. [코드 레벨 분석](#2-코드-레벨-분석)
3. [복구 전략](#3-복구-전략)
4. [백엔드 확인 필요 API 목록](#4-백엔드-확인-필요-api-목록)
5. [단계별 구현 계획서](#5-단계별-구현-계획서)

---

## 1. 기능별 누락 리스트

| # | 기능명 | 구버전 상태 | 신버전 상태 | 우선순위 | 조치 필요사항 |
|---|--------|-----------|-----------|:-------:|-------------|
| 1 | **모달 내 쿼리 테스트** | ✅ `queryTest()` 팝업 (`/nebsoa.admin.sql.SqlTest.web`) | ❌ 없음 | 🔴 High | 테스트 버튼 + API 연동 구현 |
| 2 | **쿼리 복원 (히스토리)** | ✅ `query_restore.jsp` 전용 화면 + `/FWKSQH02, 04.wsvc` | ❌ 없음 | 🔴 High | 복원 모달 + History API 연동 구현 |
| 3 | **F/W용 페이징 쿼리 자동 삽입** | ✅ `addPagingQuery()` (Framework 페이징 문법 템플릿 삽입) | ❌ 없음 | 🔴 High | 버튼 + 삽입 로직 구현 |
| 4 | **SQL 문법 유효성 검증** | ✅ `queryValidation()` (ibatis 태그 금지, SQL 타입 자동 감지) | ❌ 없음 (필수 필드 검증만) | 🔴 High | 저장 전 SQL 문법 검증 로직 추가 |
| 5 | **모달 내 쿼리 텍스트 검색** | ✅ `searchQuery()` (textarea 내 찾기) | ❌ 없음 | 🟡 Medium | 검색 입력창 + 하이라이트 로직 구현 |
| 6 | **프로시저 호출 템플릿 삽입** | ✅ `callProcedure()` (CALL 문법 템플릿 자동 삽입) | ❌ 없음 | 🟡 Medium | 버튼 + 삽입 로직 구현 |
| 7 | **쿼리 에디터 확대/축소** | ✅ textarea 리사이즈 + 에디터 컨트롤 | ⚠️ `resize-vertical` 만 있음 | 🟡 Medium | 에디터 확대 버튼 또는 전체화면 모드 추가 |
| 8 | **WAS 그룹 Reload** | ✅ `wasReload()` + WAS 목록 선택 모달 | ❌ 없음 | 🟡 Medium | Reload 버튼 + API 연동 구현 |
| 9 | **SQL 그룹 검색 팝업** | ✅ `sqlGroupSearch.jsp` 팝업 (그룹 ID/명 선택) | ⚠️ 텍스트 직접 입력만 | 🟡 Medium | 그룹 검색 팝업 또는 autocomplete 추가 |
| 10 | **사용여부 인라인 토글** | ✅ `changeUseYn()` (목록에서 직접 Y/N 토글) | ❌ 없음 (모달 열어야 변경 가능) | 🟡 Medium | 목록 행에서 직접 토글 기능 추가 |
| 11 | **쿼리 백업** | ✅ 저장 전 자동 백업 (`/FWKSQH03.wsvc`) | ❌ 없음 | 🟡 Medium | 저장 시 백업 API 호출 추가 |
| 12 | **검색 조건 — SQL GROUP ID/명** | ✅ 총 6개 필드 (QueryID, Query명, GROUP ID/명, DB, SQL TYPE) | ⚠️ 3개 필드만 (QueryID, Query명, 사용여부) | 🟡 Medium | 검색 필드에 SQL GROUP, DB, SQL TYPE 추가 |
| 13 | **EXEC_TYPE 드롭다운** | ✅ ONLINE/BATCH 드롭다운 선택 | ⚠️ 텍스트 직접 입력 | 🟡 Medium | ComboManager로 드롭다운 전환 |
| 14 | **SQL_TYPE 드롭다운** | ✅ R/C/U/D/P/I 드롭다운 선택 | ⚠️ 텍스트 직접 입력 | 🟡 Medium | ComboManager로 드롭다운 전환 |
| 15 | **목록 컬럼 — TIME_OUT** | ✅ 목록에 TIME_OUT 컬럼 표시 | ❌ 없음 | 🟢 Low | 목록 컬럼 추가 |

---

## 2. 코드 레벨 분석

### 2-1. 쿼리 테스트 기능

> **구버전 파일**: `query_details.jsp`

**구버전 핵심 코드**

```javascript
function queryTest() {
    var queryId   = $("#QUERY_ID").val();
    var sqlGroupId = $("#SQL_GROUP_ID").val();
    var dbId      = $("#DB_ID").val();

    var testUrl = "/nebsoa.admin.sql.SqlTest.web"
        + "?QUERY_ID="       + queryId
        + "&SQL_GROUP_ID_S=" + sqlGroupId
        + "&DB_ID="          + dbId;

    window.open(testUrl, "queryTest",
        "width=1200, height=800, scrollbars=yes, resizable=yes");
}
```

**신버전 복구 방향** — `SqlQueryModal` 객체 내에 추가

```javascript
testQuery: function () {
    const queryId    = $('#sqModalQueryId').val();
    const sqlGroupId = $('#sqModalSqlGroupId').val();
    const dbId       = $('#sqModalDbId').val();

    // 신버전 API 엔드포인트로 변경 필요 (백엔드 확인 필요)
    const testUrl = `/sql-queries/test?queryId=${queryId}&sqlGroupId=${sqlGroupId}&dbId=${dbId}`;
    window.open(testUrl, 'sqlQueryTest', 'width=1200,height=800,scrollbars=yes,resizable=yes');
}
```

**모달 Footer에 추가할 버튼**

```html
<!-- 상세 모드 + 쓰기 권한 시에만 표시 -->
<button type="button" class="btn btn-info btn-sm d-hidden" id="btnSqlQueryTest"
        th:if="${userAuthorities != null and userAuthorities.contains('SQL_QUERY:W')}">
    <i class="bi bi-play-circle"></i> 쿼리 테스트
</button>
```

---

### 2-2. 쿼리 복원 기능

> **구버전 파일**: `query_restore.jsp`

**구버전 핵심 코드**

```javascript
// 히스토리 버전 목록 로드
function getVersion() {
    var params = { QUERY_ID: currentQueryId };
    ComboManager.db.get("QUERY_HISTORY_VERSION", params, function (data) {
        renderVersionList(data);
    });
}

// 선택된 버전 데이터 로드
function getRestoreData() {
    var historySeq = $("#historyVersion").val();
    fwk.ajaxForJSON("/FWKSQH02.wsvc",
        { QUERY_ID: currentQueryId, HISTORY_SEQ: historySeq },
        function (data) {
            displayHistoryData(data.RESULT_DETAIL);
        }
    );
}

// 복원 실행
function restoreBtn() {
    openConfirm("선택한 버전으로 복원하시겠습니까?", function () {
        fwk.ajaxForJSON("/FWKSQH04.wsvc",
            { QUERY_ID: currentQueryId, HISTORY_SEQ: selectedHistorySeq },
            function () {
                openAlert("복원이 완료되었습니다.");
                setHistory();
            }
        );
    });
}
```

**신버전 복구 방향** — 복원 전용 모달 (`sqlquery-restore-modal.html`) 신규 생성

```
┌─────────────────────────────────────────────┐
│  SQL Query 복원                        [X]  │
├──────────────────┬──────────────────────────┤
│  [현재 버전]     │  [이전 버전]              │
│                  │  버전 선택: [드롭다운  ▼] │
│  textarea (r/o)  │                           │
│                  │  textarea (r/o)           │
├──────────────────┴──────────────────────────┤
│                       [복원]  [닫기]         │
└─────────────────────────────────────────────┘
```

```javascript
// SqlQueryModal 객체 내에 추가
openRestore: function (queryId) {
    // 1. 복원 전용 모달 오픈
    // 2. GET /sql-queries/{queryId}/history   → 버전 목록 드롭다운 렌더링
    // 3. 버전 선택 시 GET /sql-queries/{queryId}/history/{seq} → 우측 패널 표시
    // 4. 복원 클릭 시 POST /sql-queries/{queryId}/restore/{seq}
}
```

**모달 Footer에 추가할 버튼**

```html
<!-- 상세 모드 + 쓰기 권한 시에만 표시 -->
<button type="button" class="btn btn-warning btn-sm d-hidden" id="btnSqlQueryRestore"
        th:if="${userAuthorities != null and userAuthorities.contains('SQL_QUERY:W')}">
    <i class="bi bi-clock-history"></i> 복원
</button>
```

---

### 2-3. SQL 문법 유효성 검증

> **구버전 파일**: `query_details.jsp`

**구버전 핵심 코드**

```javascript
function queryValidation() {
    var sqlQuery = $("#SQL_QUERY").val().trim().toUpperCase();
    var sqlType  = $("#SQL_TYPE").val();

    // iBatis 구문 태그 금지 검증
    var forbiddenTags = [
        '<ISNULL>', '<ISNOTNULL>', '<ISEMPTY>', '<ISNOTEMPTY>',
        '<ITERATE>', '<![CDATA['
    ];
    for (var tag of forbiddenTags) {
        if (sqlQuery.indexOf(tag) >= 0) {
            openAlert("iBatis 구문(" + tag + ")은 사용할 수 없습니다.");
            return false;
        }
    }

    // SQL 타입에 따른 시작 키워드 검증
    var typeKeywordMap = {
        'R': ['SELECT'],
        'C': ['INSERT'],
        'U': ['UPDATE'],
        'D': ['DELETE'],
        'P': ['CALL', 'EXEC'],
        'I': ['ALTER', 'CREATE', 'DROP', 'GRANT', 'REVOKE']
    };

    var keywords = typeKeywordMap[sqlType];
    if (keywords) {
        var startsWithKeyword = keywords.some(k => sqlQuery.startsWith(k));
        if (!startsWithKeyword) {
            openAlert("SQL 유형[" + sqlType + "]에 맞는 SQL을 작성해주세요.");
            return false;
        }
    }

    return true;
}
```

**신버전 복구 방향** — `SqlQueryModal._validateQuery()` 추가 후 `save()` 내 순차 호출

```javascript
_validateQuery: function () {
    const sqlQuery  = $('#sqModalSqlQuery').val().trim().toUpperCase();
    const sqlType   = $('#sqModalSqlType').val();

    const forbiddenTags = [
        '<ISNULL>', '<ISNOTNULL>', '<ISEMPTY>', '<ISNOTEMPTY>',
        '<ITERATE>', '<![CDATA['
    ];
    for (const tag of forbiddenTags) {
        if (sqlQuery.includes(tag)) {
            Toast.warning(`iBatis 구문(${tag})은 사용할 수 없습니다.`);
            return false;
        }
    }

    const typeKeywordMap = {
        R: ['SELECT'], C: ['INSERT'], U: ['UPDATE'],
        D: ['DELETE'], P: ['CALL', 'EXEC'],
        I: ['ALTER', 'CREATE', 'DROP', 'GRANT', 'REVOKE']
    };
    const keywords = typeKeywordMap[sqlType];
    if (keywords && !keywords.some(k => sqlQuery.startsWith(k))) {
        Toast.warning(`SQL 유형[${sqlType}]에 맞는 SQL을 작성해주세요.`);
        return false;
    }

    return true;
},

save: function () {
    if (!this._validateForm())  return; // 기존 필수 필드 검증
    if (!this._validateQuery()) return; // 추가: SQL 문법 검증
    // ... 이하 기존 save 로직
}
```

---

### 2-4. F/W용 페이징 쿼리 자동 삽입

> **구버전 파일**: `query_details.jsp`

**구버전 핵심 코드**

```javascript
function addPagingQuery() {
    var pagingTemplate =
        "\nSELECT *\n"                                +
        "FROM (\n"                                    +
        "    SELECT ROWNUM AS RNUM, A.*\n"            +
        "    FROM (\n"                                +
        "        /* 원본 쿼리를 여기에 작성 */\n"     +
        "        SELECT * FROM DUAL\n"               +
        "    ) A\n"                                   +
        "    WHERE ROWNUM <= #endRow#\n"              +
        ")\n"                                         +
        "WHERE RNUM >= #startRow#";

    var currentVal = $("#SQL_QUERY").val();
    $("#SQL_QUERY").val(currentVal + pagingTemplate);
}
```

**신버전 복구 방향**

```javascript
// SqlQueryModal 객체 내에 추가
addPagingQuery: function () {
    const pagingTemplate = `
SELECT *
FROM (
    SELECT ROWNUM AS RNUM, A.*
    FROM (
        /* 원본 쿼리를 여기에 작성 */
        SELECT * FROM DUAL
    ) A
    WHERE ROWNUM <= #endRow#
)
WHERE RNUM >= #startRow#`;

    const $textarea = $('#sqModalSqlQuery');
    $textarea.val($textarea.val() + pagingTemplate);
},
```

---

### 2-5. 프로시저 호출 템플릿 삽입

> **구버전 파일**: `query_details.jsp`

**구버전 핵심 코드**

```javascript
function callProcedure() {
    var procedureTemplate =
        "\nCALL 프로시저명(\n"                                                                       +
        "    #param1#,    /* IN 파라미터 */\n"                                                       +
        "    #param2#,    /* IN 파라미터 */\n"                                                       +
        "    {out, jdbcType=VARCHAR, mode=OUT, javaType=java.lang.String, property=outParam1}\n"    +
        ")";

    var currentVal = $("#SQL_QUERY").val();
    $("#SQL_QUERY").val(currentVal + procedureTemplate);
}
```

**신버전 복구 방향**

```javascript
// SqlQueryModal 객체 내에 추가
callProcedure: function () {
    const procedureTemplate = `
CALL 프로시저명(
    #param1#,   /* IN 파라미터 */
    #param2#,   /* IN 파라미터 */
    {out, jdbcType=VARCHAR, mode=OUT, javaType=java.lang.String, property=outParam1}  /* OUT 파라미터 */
)`;

    const $textarea = $('#sqModalSqlQuery');
    $textarea.val($textarea.val() + procedureTemplate);
},
```

---

### 2-6. 쿼리 에디터 도구 버튼 툴바

**신버전 모달에 추가할 HTML 구조**

```html
<!-- SQL Query textarea 레이블 바로 아래, textarea 위에 삽입 -->
<div class="d-flex flex-wrap gap-1 mb-1">
    <button type="button" class="btn btn-outline-secondary btn-sm" id="btnAddPaging">
        <i class="bi bi-layout-text-window"></i> 페이징 쿼리 추가
    </button>
    <button type="button" class="btn btn-outline-secondary btn-sm" id="btnCallProcedure">
        <i class="bi bi-braces"></i> 프로시저 호출
    </button>
    <button type="button" class="btn btn-outline-secondary btn-sm" id="btnSearchQuery">
        <i class="bi bi-search"></i> 쿼리 검색
    </button>
    <button type="button" class="btn btn-outline-secondary btn-sm" id="btnExpandEditor">
        <i class="bi bi-arrows-fullscreen"></i> 확대
    </button>
</div>
<textarea id="sqModalSqlQuery" name="sqlQuery" class="form-control form-control-sm font-monospace"
          rows="5" maxlength="4000" style="resize: vertical;"></textarea>
```

---

### 2-7. 저장 전 자동 백업

> **구버전 흐름**: 수정 저장 전 `/FWKSQH03.wsvc` 호출 → 백업 완료 후 저장 실행

**신버전 복구 방향** — `save()` 메서드 내 수정 모드에서 백업 선행

```javascript
save: function () {
    if (!this._validateForm())  return;
    if (!this._validateQuery()) return;

    const queryId = $('#sqModalQueryId').val();
    const payload = this._buildPayload();

    if (this.mode === 'create') {
        // 신규: 백업 불필요, 바로 저장
        this._doSave('POST', `${API_BASE_URL}/sql-queries`, payload);
    } else {
        // 수정: 저장 전 백업 먼저 실행
        $.ajax({
            url:    `${API_BASE_URL}/sql-queries/${queryId}/backup`,
            method: 'POST',
        }).always(() => {
            // 백업 성공/실패 무관하게 저장 진행
            this._doSave('PUT', `${API_BASE_URL}/sql-queries/${queryId}`, payload);
        });
    }
},
```

---

### 2-8. 검색 조건 필드 확장

> **구버전**: 총 6개 필드 / **신버전**: 3개 필드

**신버전 `sqlquery-manage.html` `PAGE_CONFIG.search` 추가 항목**

```javascript
// 기존 3개 필드 유지
{ key: 'queryId',   label: 'Query ID', type: 'text' },
{ key: 'queryName', label: 'Query 명',  type: 'text' },
{ key: 'useYn',     label: '사용여부', type: 'select',
  options: ComboManager.simple.getList('USE_YN') },

// 추가 3개 필드
{ key: 'sqlGroupId',   label: 'SQL GROUP ID', type: 'text' },
{ key: 'sqlGroupName', label: 'SQL GROUP 명',  type: 'text' },
{ key: 'sqlType',      label: 'SQL 유형',      type: 'select',
  options: [
      { value: '',  text: '전체'      },
      { value: 'R', text: 'R (SELECT)'    },
      { value: 'C', text: 'C (INSERT)'    },
      { value: 'U', text: 'U (UPDATE)'    },
      { value: 'D', text: 'D (DELETE)'    },
      { value: 'P', text: 'P (PROCEDURE)' },
      { value: 'I', text: 'I (SQL)'       },
  ]
},
```

---

### 2-9. EXEC_TYPE / SQL_TYPE 드롭다운 전환

**기존 (텍스트 입력)**

```html
<input type="text" id="sqModalSqlType"  class="form-control form-control-sm" maxlength="10">
<input type="text" id="sqModalExecType" class="form-control form-control-sm" maxlength="10">
```

**변경 (드롭다운)**

```html
<select id="sqModalSqlType" class="form-select form-select-sm">
    <option value="">선택</option>
    <option value="R">R (SELECT)</option>
    <option value="C">C (INSERT)</option>
    <option value="U">U (UPDATE)</option>
    <option value="D">D (DELETE)</option>
    <option value="P">P (PROCEDURE)</option>
    <option value="I">I (SQL)</option>
</select>

<select id="sqModalExecType" class="form-select form-select-sm">
    <option value="">선택</option>
    <option value="O">O (ONLINE)</option>
    <option value="B">B (BATCH)</option>
</select>
```

---

## 3. 복구 전략

신버전의 **Bootstrap + Thymeleaf 구조를 유지**하면서, 구버전의 핵심 기능을 단계별로 이식합니다.

---

### Phase 1 — 고우선순위 기능 복구 🔴

> 업무 운영에 직접 영향을 주는 기능으로 즉시 복구 필요

| 순서 | 작업 | 대상 파일 |
|:---:|------|---------|
| 1 | 도구 버튼 툴바 HTML 추가 (페이징, 프로시저, 검색, 확대) | `sqlquery-modal.html` |
| 2 | `addPagingQuery()`, `callProcedure()` JS 함수 추가 | `sqlquery-modal.html` |
| 3 | `_validateQuery()` SQL 문법 검증 함수 추가 | `sqlquery-modal.html` |
| 4 | `save()` 내 백업 선행 로직 추가 | `sqlquery-modal.html` |
| 5 | 쿼리 테스트 버튼 + `testQuery()` 함수 추가 | `sqlquery-modal.html` |

---

### Phase 2 — 중우선순위 기능 복구 🟡

> 운영 효율성 및 UX에 영향을 주는 기능

| 순서 | 작업 | 대상 파일 |
|:---:|------|---------|
| 6 | 복원 전용 모달 신규 생성 (`query_restore.jsp` → Bootstrap 모달 이식) | `sqlquery-restore-modal.html` (신규) |
| 7 | 복원 버튼 + `openRestore()` 함수 추가 | `sqlquery-modal.html` |
| 8 | 검색 조건 필드 3개 추가 (SQL GROUP ID/명, SQL TYPE) | `sqlquery-manage.html` |
| 9 | `sqlType`, `execType` 텍스트 입력 → 드롭다운 전환 | `sqlquery-modal.html` |
| 10 | `searchQuery()` 쿼리 텍스트 검색 기능 추가 | `sqlquery-modal.html` |

---

### Phase 3 — 저우선순위 기능 복구 🟢

> 편의성 향상 기능

| 순서 | 작업 | 대상 파일 |
|:---:|------|---------|
| 11 | 목록 `TIME_OUT` 컬럼 추가 | `sqlquery-manage.html` |
| 12 | 목록 행 `useYn` 인라인 토글 기능 추가 | `sqlquery-manage.html` |
| 13 | 쿼리 에디터 전체화면 확대 모드 구현 | `sqlquery-modal.html` |

---

### 변경 파일 요약

| 파일 | 변경 유형 | 주요 변경 내용 |
|------|:-------:|-------------|
| `sqlquery-modal.html` | **수정** | 도구 버튼 툴바, 테스트·복원 버튼, SQL 유효성 검증, 백업 로직, 드롭다운 전환, 검색 기능 |
| `sqlquery-manage.html` | **수정** | 검색 필드 3개 추가, TIME_OUT 컬럼 추가, useYn 인라인 토글 |
| `sqlquery-restore-modal.html` | **신규** | 쿼리 복원 전용 모달 (구버전 `query_restore.jsp` 이식) |

---

## 4. 백엔드 확인 필요 API 목록

신버전 구현 전 아래 엔드포인트의 **존재 여부 및 스펙 확인** 필요

| API | Method | 용도 | 구버전 대응 엔드포인트 |
|-----|:------:|------|----------------------|
| `/sql-queries/test` | GET | 쿼리 테스트 팝업 | `/nebsoa.admin.sql.SqlTest.web` |
| `/sql-queries/{id}/backup` | POST | 저장 전 버전 백업 | `/FWKSQH03.wsvc` |
| `/sql-queries/{id}/history` | GET | 히스토리 버전 목록 조회 | `ComboManager QUERY_HISTORY_VERSION` |
| `/sql-queries/{id}/history/{seq}` | GET | 특정 버전 쿼리 상세 조회 | `/FWKSQH02.wsvc` |
| `/sql-queries/{id}/restore/{seq}` | POST | 특정 버전으로 복원 | `/FWKSQH04.wsvc` |
| `/sql-queries/{id}/reload` | POST | WAS Reload | `wasReload()` 내부 호출 |

> **참고**: 위 API가 백엔드에 없는 경우 백엔드 구현을 함께 진행해야 합니다.

---

## 5. 단계별 구현 계획서

> **진행 원칙**: 한 단계씩 작업 → 테스트 통과 확인 → 다음 단계 진행  
> **상태 범례**: 🔲 대기 | 🔄 진행중 | ✅ 완료 | ⏸ 보류

---

### 전체 진행 현황

| 단계 | 기능 | 우선순위 | 대상 파일 | 상태 |
|:---:|------|:-------:|---------|:---:|
| 1-1 | SQL TYPE / EXEC TYPE 드롭다운 전환 | 🔴 | `sqlquery-modal.html` | ✅ |
| 1-2 | 에디터 툴바 + 페이징 쿼리 삽입 + 프로시저 호출 | 🔴 | `sqlquery-modal.html` | ✅ |
| 1-3 | SQL 문법 유효성 검증 | 🔴 | `sqlquery-modal.html` | ✅ |
| 1-4 | 쿼리 테스트 버튼 | 🔴 | `sqlquery-modal.html` | ✅ |
| 1-5 | 저장 전 자동 백업 | 🔴 | `sqlquery-modal.html` | ✅ |
| 2-1 | 검색 조건 필드 확장 (GROUP ID/명, SQL TYPE) | 🟡 | `sqlquery-manage.html` | 🔄 |
| 2-2 | 쿼리 텍스트 검색 (textarea 내 찾기) | 🟡 | `sqlquery-modal.html` | 🔲 |
| 2-3 | 에디터 확대 / 전체화면 모드 | 🟡 | `sqlquery-modal.html` | 🔲 |
| 2-4 | 쿼리 복원 모달 (히스토리 버전 관리) | 🟡 | `sqlquery-restore-modal.html` (신규) | 🔲 |
| 2-5 | 사용여부 인라인 토글 | 🟡 | `sqlquery-manage.html` | 🔲 |
| 3-1 | 목록 컬럼 TIME_OUT 추가 | 🟢 | `sqlquery-manage.html` | 🔲 |
| 3-2 | SQL 그룹 검색 autocomplete | 🟢 | `sqlquery-modal.html` | 🔲 |
| 3-3 | WAS Reload 버튼 (WasSelectReloadModal 활용) | 🟢 | `sqlquery-manage.html` | 🔲 |

---

## Phase 1 — 고우선순위 🔴

> 업무 운영에 직접 영향을 미치는 기능. 다른 단계의 선행 조건이 되는 항목부터 순서대로 진행.

---

### Step 1-1. SQL TYPE / EXEC TYPE 드롭다운 전환

**상태**: 🔲 대기

**목표**  
현재 자유 텍스트 입력으로 되어 있는 `SQL 유형(sqlType)`, `실행 유형(execType)` 필드를 드롭다운으로 전환하여 입력 오류를 방지하고, Step 1-3 SQL 문법 검증의 선행 조건을 충족한다.

**변경 파일**
- `admin/src/main/resources/templates/pages/sqlquery-manage/sqlquery-modal.html`

**작업 내용**
- [ ] `#sqModalSqlType` `<input type="text">` → `<select>` 로 교체  
  - 옵션: `R (SELECT)` / `C (INSERT)` / `U (UPDATE)` / `D (DELETE)` / `P (PROCEDURE)` / `I (SQL)`
- [ ] `#sqModalExecType` `<input type="text">` → `<select>` 로 교체  
  - 옵션: `O (ONLINE)` / `B (BATCH)`
- [ ] `_fillForm()` 에서 `.val()` 로 select 값이 올바르게 채워지는지 확인
- [ ] `_setFieldsReadonly()` 에서 select 에 `.prop('disabled')` 적용 확인

**테스트 항목**
- [ ] 목록에서 기존 쿼리 행 클릭 → 모달 오픈 시 `sqlType`, `execType` 드롭다운에 DB 저장값이 자동 선택되는가
- [ ] 신규 등록 모달 오픈 시 드롭다운이 빈 상태(선택 없음)로 초기화되는가
- [ ] 읽기 권한만 있는 계정으로 접속 시 드롭다운이 비활성화(disabled)되는가
- [ ] 수정 후 저장 → 목록 새로고침 → 다시 클릭했을 때 변경된 값이 유지되는가

**완료 기준**  
`sqlType`, `execType` 두 필드 모두 드롭다운으로 동작하며, 기존 데이터 조회/저장에 영향이 없다.

---

### Step 1-2. 에디터 툴바 + 페이징 쿼리 삽입 + 프로시저 호출

**상태**: 🔲 대기

**목표**  
SQL Query textarea 위에 도구 버튼 툴바를 추가하고, 페이징 쿼리 템플릿 삽입과 프로시저 호출 템플릿 삽입 기능을 구현한다.

**변경 파일**
- `admin/src/main/resources/templates/pages/sqlquery-manage/sqlquery-modal.html`

**작업 내용**
- [ ] `#sqModalSqlQuery` textarea 레이블 아래, textarea 위에 툴바 div 추가
  ```
  [페이징 쿼리 추가] [프로시저 호출] [쿼리 검색] [확대]
  ```
- [ ] `SqlQueryModal.addPagingQuery()` 함수 구현  
  - textarea 현재 내용 + Oracle ROWNUM 기반 페이징 템플릿 (`#startRow#`, `#endRow#`) 삽입
- [ ] `SqlQueryModal.callProcedure()` 함수 구현  
  - CALL 문법 + IN/OUT 파라미터 주석 포함 템플릿 삽입
- [ ] 버튼 클릭 이벤트 바인딩 (`#btnAddPaging`, `#btnCallProcedure`)
- [ ] 읽기 전용 모드(상세 조회, 권한 없음)일 때 툴바 버튼 비활성화 처리

**테스트 항목**
- [ ] 쿼리 등록 모달에서 `[페이징 쿼리 추가]` 클릭 → textarea에 Oracle 페이징 템플릿이 삽입되는가
- [ ] 이미 내용이 있는 textarea에 삽입 시 기존 내용이 유지되는가 (append)
- [ ] `[프로시저 호출]` 클릭 → CALL 문법 템플릿이 삽입되는가
- [ ] OUT 파라미터 형식(`{out, jdbcType=VARCHAR, ...}`)이 정확히 삽입되는가
- [ ] 읽기 전용 모드에서 툴바 버튼이 비활성화되어 있는가

**완료 기준**  
두 버튼 클릭 시 올바른 템플릿이 textarea에 삽입되고, 읽기 전용 상태에서는 동작하지 않는다.

---

### Step 1-3. SQL 문법 유효성 검증

**상태**: 🔲 대기  
**선행 조건**: Step 1-1 완료 (sqlType이 select이어야 값 비교 가능)

**목표**  
저장 버튼 클릭 시 iBatis 금지 태그 사용 여부와 SQL 유형-키워드 일치 여부를 검증하여 잘못된 쿼리가 저장되는 것을 방지한다.

**변경 파일**
- `admin/src/main/resources/templates/pages/sqlquery-manage/sqlquery-modal.html`

**작업 내용**
- [ ] `SqlQueryModal._validateQuery()` 함수 구현
  - 금지 태그 검증: `<ISNULL>`, `<ISNOTNULL>`, `<ISEMPTY>`, `<ISNOTEMPTY>`, `<ITERATE>`, `<![CDATA[`
  - SQL TYPE vs 시작 키워드 일치 검증: `R→SELECT`, `C→INSERT`, `U→UPDATE`, `D→DELETE`, `P→CALL/EXEC`, `I→ALTER/CREATE/DROP/GRANT/REVOKE`
- [ ] `save()` 내 `_validateForm()` 호출 다음에 `_validateQuery()` 순차 호출
- [ ] 검증 실패 시 `Toast.warning()` 으로 구체적인 오류 메시지 표시

**테스트 항목**
- [ ] `sqlType = R` 인데 쿼리가 `UPDATE ...` 로 시작 → 저장 차단 및 경고 메시지 표시되는가
- [ ] `<ISNULL>` 태그가 포함된 쿼리 → 저장 차단 및 경고 메시지 표시되는가
- [ ] `sqlType = P` 이고 `CALL 프로시저명(...)` 쿼리 → 정상 저장되는가
- [ ] `sqlType = I` (SQL) 이고 `ALTER TABLE ...` 쿼리 → 정상 저장되는가
- [ ] `sqlType` 미선택(빈 값) 상태에서 저장 → 키워드 검증 없이 필수 필드 검증(`_validateForm`)만 동작하는가

**완료 기준**  
금지 태그 6종과 SQL TYPE별 키워드 불일치 시 저장이 차단되고, 올바른 쿼리는 정상 저장된다.

---

### Step 1-4. 쿼리 테스트 버튼

**상태**: 🔲 대기

**목표**  
상세 모달에서 현재 쿼리를 실제 DB에 실행해볼 수 있는 테스트 팝업을 연다.

> ⚠️ **사전 확인 필요**: 백엔드에 쿼리 테스트 엔드포인트가 존재하는지 확인 후 진행

**변경 파일**
- `admin/src/main/resources/templates/pages/sqlquery-manage/sqlquery-modal.html`

**작업 내용**
- [ ] 백엔드 팀에 테스트 실행 API 엔드포인트 및 스펙 확인
  - 구버전 대응: `/nebsoa.admin.sql.SqlTest.web?QUERY_ID=&SQL_GROUP_ID_S=&DB_ID=`
  - 신버전 예상: `GET /sql-queries/test?queryId=&sqlGroupId=&dbId=` 또는 별도 팝업 URL
- [ ] 모달 Footer에 `[쿼리 테스트]` 버튼 추가 (상세 모드 + 쓰기 권한 시에만 표시)
- [ ] `SqlQueryModal.testQuery()` 함수 구현
  - 확인된 API 엔드포인트로 `window.open()` 팝업 실행
  - 팝업 사이즈: `width=1200, height=800, scrollbars=yes, resizable=yes`
- [ ] 버튼 클릭 이벤트 바인딩 (`#btnSqlQueryTest`)

**테스트 항목**
- [ ] 기존 쿼리 상세 모달에서 `[쿼리 테스트]` 버튼이 보이는가 (쓰기 권한 계정)
- [ ] 읽기 권한 계정에서는 버튼이 숨겨지는가
- [ ] 신규 등록 모달(create 모드)에서는 버튼이 숨겨지는가
- [ ] 버튼 클릭 시 적절한 파라미터(queryId, sqlGroupId, dbId)가 팝업 URL에 포함되는가
- [ ] 테스트 팝업이 정상적으로 열리는가

**완료 기준**  
상세 모드에서 쓰기 권한 사용자가 쿼리 테스트 팝업을 정상적으로 열 수 있다.

---

### Step 1-5. 저장 전 자동 백업

**상태**: ✅ 완료

**목표**  
기존 쿼리를 수정 저장하기 전에 현재 버전을 자동으로 백업하여 이후 복원이 가능한 이력을 남긴다.

> ⚠️ **사전 확인 필요**: 백엔드에 백업 API(`POST /sql-queries/{id}/backup`) 존재 여부 확인

**변경 파일**
- `admin/src/main/resources/templates/pages/sqlquery-manage/sqlquery-modal.html`

**작업 내용**
- [x] DDL: `FWK_SQL_QUERY_HIS` 테이블 + `SEQ_FWK_SQL_QUERY_HIS` 시퀀스 → `04_alter_tables.sql` 추가 (개발자 직접 실행)
- [x] Mapper: `SqlQueryMapper.insertHistory()` 메서드 + XML `<insert id="insertHistory">` 구현
- [x] Service: `SqlQueryService.backupQuery(queryId)` — 현재 상태 조회 후 이력 테이블 삽입
- [x] Controller: `POST /api/sql-queries/{queryId}/backup` 엔드포인트 추가 (`SQL_QUERY:W` 권한 필요)
- [x] Frontend: `save()` 내 수정 모드(`PUT`) 분기에서 백업 API 선행 호출 → `.always()` 로 백업 성공/실패 무관하게 저장 진행
- [x] 신규 생성(`POST`) 모드에서는 백업 호출 없음

**테스트 항목**
- [x] 기존 쿼리 내용 수정 후 저장 → `FWK_SQL_QUERY_HIS` 테이블에 이전 버전 레코드가 생성되는가
- [x] 신규 등록 저장 시에는 백업 API 호출이 발생하지 않는가 (네트워크 탭 확인)
- [x] 백업 API 호출 실패(네트워크 오류 시뮬레이션) 상황에서도 저장이 정상 진행되는가
- [x] 저장 완료 후 목록이 새로고침되는가

**완료 기준**  
수정 저장 시 자동 백업이 선행되고, 백업 실패 여부와 관계없이 저장 동작이 완료된다.

---

## Phase 2 — 중우선순위 🟡

> 운영 효율성 및 UX에 영향을 주는 기능. Phase 1 완료 후 진행.

---

### Step 2-1. 검색 조건 필드 확장

**상태**: 🔄 진행 중

**목표**  
현재 3개(Query ID, Query명, 사용여부)인 검색 필드를 구버전 수준인 6개로 확장하여 SQL GROUP, DB, SQL TYPE 기반 필터링을 지원한다.

**변경 파일**
- `admin/src/main/resources/templates/pages/sqlquery-manage/sqlquery-manage.html`
- (백엔드) SQL GROUP ID, SQL GROUP명, DB ID, SQL TYPE 검색 파라미터 처리 확인

**작업 내용**
- [ ] 백엔드 `GET /sql-queries/page` 에서 아래 파라미터 수신 여부 확인
  - `sqlGroupId`, `sqlGroupName`, `dbId`, `sqlType`
  - 미지원 시 백엔드 수정 필요
- [ ] `PAGE_CONFIG.search` 에 필드 3개 추가
  - `SQL GROUP ID` (text), `SQL GROUP 명` (text), `SQL 유형` (select — R/C/U/D/P/I)
- [ ] SearchForm이 새 파라미터를 API 요청에 포함하는지 확인

**테스트 항목**
- [ ] `SQL GROUP ID` 입력 후 검색 → 해당 그룹의 쿼리만 필터링되는가
- [ ] `SQL GROUP 명` 부분 검색(LIKE) → 결과가 올바른가
- [ ] `SQL 유형` 드롭다운에서 `R (SELECT)` 선택 → SELECT 쿼리만 표시되는가
- [ ] 여러 조건 동시 입력 후 검색 → AND 조건으로 복합 필터링되는가
- [ ] 검색 조건 초기화 버튼 클릭 → 추가된 3개 필드도 함께 초기화되는가

**완료 기준**  
6개 검색 조건 모두 개별 및 복합 검색이 정상 동작한다.

---

### Step 2-2. 쿼리 텍스트 검색 (textarea 내 찾기)

**상태**: 🔲 대기

**목표**  
SQL Query textarea 안에서 특정 문자열을 찾아 하이라이트하고 커서를 이동시키는 인라인 검색 기능을 구현한다.

**변경 파일**
- `admin/src/main/resources/templates/pages/sqlquery-manage/sqlquery-modal.html`

**작업 내용**
- [ ] Step 1-2에서 추가한 툴바의 `[쿼리 검색]` 버튼 클릭 시 검색 입력창 토글 표시
  ```
  [찾기: _________ ] [◀ 이전] [▶ 다음] [✕]
  ```
- [ ] `SqlQueryModal.searchQuery()` 함수 구현
  - textarea 내 검색어 첫 번째 위치 찾기 (`indexOf`)
  - `setSelectionRange(start, end)` 로 해당 구간 선택(하이라이트)
  - `focus()` 로 커서 이동
- [ ] 이전/다음 버튼으로 복수 매칭 결과 순환 이동
- [ ] 검색어 없음 또는 미발견 시 `Toast.warning()` 표시
- [ ] `Esc` 키로 검색창 닫기

**테스트 항목**
- [ ] `[쿼리 검색]` 버튼 클릭 → 검색 입력창이 표시되는가
- [ ] 검색어 입력 후 Enter 또는 `[▶ 다음]` → textarea 내 첫 번째 매칭 구간이 선택(파란 하이라이트)되는가
- [ ] `[▶ 다음]` 반복 클릭 → 다음 매칭 위치로 이동하는가
- [ ] `[◀ 이전]` 클릭 → 이전 매칭 위치로 이동하는가
- [ ] 마지막 매칭에서 `[▶ 다음]` → 첫 번째 매칭으로 순환하는가
- [ ] 존재하지 않는 검색어 입력 → 경고 메시지 표시되는가
- [ ] `[✕]` 또는 `Esc` → 검색창이 닫히는가

**완료 기준**  
textarea 내 검색어를 찾아 선택 이동하며, 이전/다음 순환 이동이 동작한다.

---

### Step 2-3. 에디터 확대 / 전체화면 모드

**상태**: 🔲 대기

**목표**  
긴 쿼리 작성 시 편의를 위해 SQL Query textarea를 전체화면으로 확대/축소할 수 있는 토글 기능을 구현한다.

**변경 파일**
- `admin/src/main/resources/templates/pages/sqlquery-manage/sqlquery-modal.html`

**작업 내용**
- [ ] 툴바의 `[확대]` 버튼 클릭 시 모달을 `modal-fullscreen` 으로 전환
  - Bootstrap `modal-fullscreen` 클래스 토글
  - 버튼 아이콘을 `bi-arrows-fullscreen` ↔ `bi-fullscreen-exit` 으로 교체
- [ ] 전체화면 모드에서 textarea의 `rows` 속성 또는 `height` 를 동적으로 확장
- [ ] 모달 닫기 시 전체화면 모드 자동 해제 (다음 오픈 시 기본 크기로 복귀)

**테스트 항목**
- [ ] `[확대]` 버튼 클릭 → 모달이 전체화면으로 전환되는가
- [ ] 전체화면 상태에서 textarea 영역이 충분히 커지는가
- [ ] `[축소]` 버튼 클릭(또는 동일 버튼) → 원래 크기로 복귀하는가
- [ ] 전체화면 모드에서 저장/삭제/닫기 버튼이 정상 동작하는가
- [ ] 모달 닫은 후 재오픈 시 기본 크기로 시작하는가

**완료 기준**  
확대/축소 토글이 동작하고, 전체화면 모드에서 모든 모달 기능이 정상 작동한다.

---

### Step 2-4. 쿼리 복원 모달 (히스토리 버전 관리)

**상태**: 🔲 대기  
**선행 조건**: Step 1-5 완료 (백업 데이터가 쌓여야 복원 대상이 존재)

**목표**  
수정 이력에서 이전 버전을 선택하고 현재 버전과 비교한 뒤 복원하는 모달을 구현한다.

> ⚠️ **사전 확인 필요**:  
> - `GET /sql-queries/{id}/history` — 히스토리 버전 목록 API  
> - `GET /sql-queries/{id}/history/{seq}` — 특정 버전 쿼리 조회 API  
> - `POST /sql-queries/{id}/restore/{seq}` — 특정 버전으로 복원 API

**신규 생성 파일**
- `admin/src/main/resources/templates/pages/sqlquery-manage/sqlquery-restore-modal.html`

**변경 파일**
- `admin/src/main/resources/templates/pages/sqlquery-manage/sqlquery-modal.html` (복원 버튼 추가)
- `admin/src/main/resources/templates/pages/sqlquery-manage/sqlquery-manage.html` (신규 모달 include)

**작업 내용**
- [ ] 백엔드 3개 API 스펙 확인 및 구현 요청 (없을 경우)
- [ ] 복원 모달 HTML 구조 작성 (좌우 분할 레이아웃)
  ```
  ┌─────────────────────────────────────────────┐
  │  SQL Query 복원                        [X]  │
  ├──────────────────┬──────────────────────────┤
  │  [현재 버전]     │  [이전 버전]              │
  │                  │  버전 선택: [드롭다운  ▼] │
  │  textarea (r/o)  │  textarea (r/o)           │
  ├──────────────────┴──────────────────────────┤
  │                       [복원]  [닫기]         │
  └─────────────────────────────────────────────┘
  ```
- [ ] `SqlQueryRestoreModal` JS 객체 구현
  - `open(queryId)` — 복원 모달 오픈, 현재 쿼리 로드, 버전 목록 드롭다운 렌더링
  - `loadHistory(seq)` — 선택 버전 쿼리 우측 패널에 표시
  - `restore()` — 확인 대화 후 복원 API 호출 → 성공 시 기존 상세 모달 데이터 갱신
- [ ] `sqlquery-modal.html` Footer에 `[복원]` 버튼 추가
- [ ] `sqlquery-manage.html` 에 복원 모달 `th:replace` include 추가

**테스트 항목**
- [ ] 상세 모달에서 `[복원]` 버튼 클릭 → 복원 모달이 열리는가
- [ ] 복원 모달 좌측에 현재 버전 쿼리가 표시되는가
- [ ] 버전 드롭다운에 수정 이력 목록(버전번호 + 수정일시)이 표시되는가
- [ ] 버전 선택 → 우측 패널에 해당 버전 쿼리가 표시되는가
- [ ] `[복원]` 클릭 → 확인 메시지 표시 후 복원 API 호출되는가
- [ ] 복원 성공 후 상세 모달의 쿼리 내용이 복원된 버전으로 갱신되는가
- [ ] 히스토리가 없는 쿼리(신규 등록 직후)에서 복원 모달 오픈 시 "이력 없음" 메시지가 표시되는가

**완료 기준**  
버전 선택 → 비교 → 복원 전체 흐름이 오류 없이 동작하며, 복원 후 데이터가 정확히 반영된다.

---

### Step 2-5. 사용여부 인라인 토글

**상태**: 🔲 대기

**목표**  
목록에서 모달을 열지 않고 `useYn` 배지를 직접 클릭하여 Y/N 을 즉시 전환한다.

**변경 파일**
- `admin/src/main/resources/templates/pages/sqlquery-manage/sqlquery-manage.html`

**작업 내용**
- [ ] `PAGE_CONFIG.table.columns` 의 `useYn` 렌더러에서 쓰기 권한 보유 시 배지에 클릭 이벤트 추가
  ```javascript
  if (sql_query_access) {
      return `<span class="badge text-bg-${color} cursor-pointer"
                    onclick="SqlQueryPage.toggleUseYn('${row.queryId}', '${val}')">
                  ${val}
              </span>`;
  }
  ```
- [ ] `SqlQueryPage.toggleUseYn(queryId, currentVal)` 함수 구현
  - `Toast.confirm()` 으로 변경 의사 확인
  - `PUT /sql-queries/{queryId}` 로 반전된 값 전송 (`Y` → `N`, `N` → `Y`)
  - 성공 시 목록 새로고침

**테스트 항목**
- [ ] 목록에서 `useYn = Y` 배지 클릭 → 확인 다이얼로그 표시되는가
- [ ] 확인 클릭 → `useYn = N` 으로 변경되고 목록이 새로고침되는가
- [ ] `useYn = N` 배지 클릭 → `useYn = Y` 로 변경되는가
- [ ] 읽기 전용 계정에서 배지가 클릭되지 않는가 (cursor 기본, onclick 없음)
- [ ] 취소 클릭 → 변경 없이 현재 값 유지되는가

**완료 기준**  
쓰기 권한 사용자가 목록에서 배지 클릭으로 사용여부를 즉시 변경할 수 있으며, 읽기 전용 사용자에게는 동작하지 않는다.

---

## Phase 3 — 저우선순위 🟢

> 편의성 향상 기능. Phase 1, 2 완료 후 여유 있을 때 진행.

---

### Step 3-1. 목록 컬럼 TIME_OUT 추가

**상태**: 🔲 대기

**목표**  
목록에서 각 쿼리의 타임아웃 설정값을 바로 확인할 수 있도록 컬럼을 추가한다.

**변경 파일**
- `admin/src/main/resources/templates/pages/sqlquery-manage/sqlquery-manage.html`

**작업 내용**
- [ ] `PAGE_CONFIG.table.columns` 에 `timeOut` 컬럼 추가 (`width: '80px'`, `sortable: false`)
- [ ] 백엔드 `GET /sql-queries/page` 응답에 `timeOut` 필드가 포함되는지 확인

**테스트 항목**
- [ ] 목록 테이블에 `Timeout` 컬럼이 표시되는가
- [ ] 타임아웃 설정값이 있는 쿼리의 값이 올바르게 표시되는가
- [ ] 값이 없는 경우 빈 값 또는 `-` 로 표시되는가

**완료 기준**  
목록에서 `timeOut` 값을 확인할 수 있다.

---

### Step 3-2. SQL 그룹 검색 autocomplete

**상태**: 🔲 대기

**목표**  
모달의 `SQL 그룹 ID` 입력 필드에 autocomplete를 적용하여 그룹 ID를 직접 타이핑하지 않고 검색/선택할 수 있게 한다.

**변경 파일**
- `admin/src/main/resources/templates/pages/sqlquery-manage/sqlquery-modal.html`

**작업 내용**
- [ ] 프로젝트에 이미 포함된 Select2(WebJars) 활용 여부 검토
- [ ] `#sqModalSqlGroupId` 필드에 Select2 또는 datalist autocomplete 적용
  - 검색 API: `GET /sql-groups?keyword={input}` (존재 여부 확인)
- [ ] 그룹 선택 시 `sqlGroupId` 값 자동 채움

**테스트 항목**
- [ ] `SQL 그룹 ID` 필드에 타이핑 시 매칭 그룹 목록이 드롭다운으로 표시되는가
- [ ] 목록에서 항목 선택 시 필드에 해당 ID가 채워지는가
- [ ] 읽기 전용 모드에서 autocomplete가 비활성화되는가

**완료 기준**  
SQL 그룹 ID를 타이핑으로 검색하고 선택할 수 있다.

---

### Step 3-3. WAS Reload 버튼

**상태**: 🔲 대기

**목표**  
쿼리 변경 후 WAS 서버에 즉시 반영(Reload)을 요청할 수 있는 버튼을 목록 페이지 툴바에 추가한다.

> 💡 **참고**: 프로젝트에 이미 `WasSelectReloadModal` 공통 컴포넌트가 존재함  
> 경로: `admin/src/main/resources/static/js/components/WasSelectReloadModal`

**변경 파일**
- `admin/src/main/resources/templates/pages/sqlquery-manage/sqlquery-manage.html`

**작업 내용**
- [ ] `WasSelectReloadModal` 컴포넌트 사용법 확인 (다른 페이지 참고)
- [ ] 목록 페이지 툴바에 `[WAS Reload]` 버튼 추가 (쓰기 권한 시에만 표시)
- [ ] 버튼 클릭 → `WasSelectReloadModal.open()` 호출
- [ ] Reload 대상 API 확인: `POST /sql-queries/{id}/reload` 또는 공통 Reload API

**테스트 항목**
- [ ] `[WAS Reload]` 버튼 클릭 → WAS 목록 선택 모달이 열리는가
- [ ] WAS 서버 선택 후 Reload 실행 → 성공 메시지가 표시되는가
- [ ] 읽기 권한 계정에서 버튼이 숨겨지는가

**완료 기준**  
`WasSelectReloadModal` 을 통해 WAS Reload를 정상적으로 실행할 수 있다.
