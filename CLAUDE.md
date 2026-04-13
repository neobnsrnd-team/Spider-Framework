# CLAUDE.md

## GitHub 작업 규칙

### 이슈 생성

- 이슈 생성 시 반드시 `.github/ISSUE_TEMPLATE/feature_request.md` 템플릿을 기반으로 작성한다.
- 이슈 생성 시 label은 `.github/label.json`을 사용한다.

### PR 생성

- PR 생성 시 반드시 `.github/pull_request_template.md` 템플릿을 기반으로 작성한다.
- PR 생성 시 label은 `.github/label.json`을 사용한다.

## 코드 작성 규칙

### 주석

코드만 봐도 의도를 파악할 수 있도록 주석을 충분히 작성한다.

**파일 상단 JSDoc**

- 새 파일을 생성할 때는 반드시 파일 상단에 JSDoc 주석을 작성한다.
- 주석에는 다음 내용을 포함한다:
  - 파일명 (`@file`)
  - 파일/함수의 역할 설명 (`@description`)
  - 주요 파라미터 (`@param`)
  - 반환값 (`@returns`)
  - 필요한 경우 사용 예시 (`@example`)

** 파일 상단 JavaDoc**:
  - 클래스: 역할 한 줄 요약 + 필요 시 `<p>` 태그로 상세 설명 (설정 클래스는 사용 예시 `<pre>{@code ...}</pre>` 포함)
  - 필드: `/** 한 줄 설명 */` 형식. 단순 getter/setter는 생략
  - 내부 로직이 자명하지 않은 private 메서드에도 작성
  - 비즈니스 로직 설명이 없는 단순 위임 메서드(Controller → Service 단순 호출 등)는 생략 가능

**인라인 주석**

- 다음 경우에는 반드시 인라인 주석을 추가한다:
  - 왜 이 값을 선택했는지 이유가 필요한 상수·기본값 
  - 개발자가 처음 봤을 때 의도를 오해할 수 있는 로직
  - 타입 단언(`as`)이나 예외 처리 등 방어 코드
  - 여러 분기 중 특정 분기가 존재하는 이유가 명확하지 않은 경우
