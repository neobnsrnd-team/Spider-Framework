# CLAUDE.md

## Project Overview
Spring Boot 3.4 + Thymeleaf 미들웨어 관리 콘솔. Oracle/MySQL 이중 지원, MyBatis ORM.
Base package: `com.example.admin_demo`

## Architecture
- `global/` — 공통 인프라 (security, exception, config, log, util)
- `domain/{name}/` — 비즈니스 모듈. 각 모듈은 controller/service/mapper/dto 계층으로 구성
- `resources/mapper/oracle/` — MyBatis XML (현재 Oracle만 구현, MySQL 매퍼는 미구현)
- `resources/templates/pages/` — Thymeleaf 뷰
- `resources/static/js/components/` — 공통 JS 컴포넌트 (DataTable, Modal, Pagination, SearchForm, Toast)

## Build & Run
```bash
./mvnw clean package                                    # 빌드
./mvnw spring-boot:run -Dspring-boot.run.profiles=oracle  # 실행
```

## Code Conventions
- **Java formatting**: Spotless + Palantir Java Format — `./mvnw spotless:apply` 로 포맷 적용
- **JS linting**: `npm run lint:fix`
- 새 도메인 추가 시 controller/service/mapper/dto 4계층 구조를 따를 것

## ArchUnit Rules (CI에서 강제됨)
- **레이어 의존성**: Controller → Service → Mapper 단방향만 허용
- **DTO 네이밍**: `dto` 패키지 클래스는 반드시 `*Request` 또는 `*Response`로 끝나야 함
- **금지 패턴**: `ServiceImpl`, `Entity`, `VO`, `Converter`, `Repository` 클래스명 금지
- **record 금지**: DTO/Event에 Java record 사용 금지 → Lombok class 사용
- **생성자 주입**: `@Autowired` 필드 주입 금지 → 생성자 주입(또는 `@RequiredArgsConstructor`)

## Exception Hierarchy
`BaseException` → `NotFoundException`, `DuplicateException`, `InvalidInputException`, `InternalException`
- `ErrorType` enum으로 에러 유형 분류
- `GlobalExceptionHandler`에서 일괄 처리

## Testing
- Unit: `./mvnw test` (JUnit 5, JaCoCo)
- E2E: `npm run test:e2e` (Playwright — auth-setup → readonly-setup → smoke → api → pages)
- 포맷 검사: `./mvnw spotless:check`

## Key Configuration Files
- `.env` / `.env.example` — 환경변수 (DB_URL, DB_USERNAME, DB_PASSWORD, DB_SCHEMA 등)
- `application.yml` — 메인 설정
- `application-{oracle,mysql,ci}.yml` — DB 프로필별 설정
- `menu-resource-permissions.yml` — 메뉴·리소스 권한 정의

## Database
- 매퍼 XML은 현재 Oracle만 구현 (`mapper/oracle/`). MySQL 프로필 설정은 존재하나 매퍼 XML 미구현
- DDL: `docs/sql/{oracle,mysql}/01_create_tables.sql`

## CI (GitHub Actions)
`main` push/PR → Build(Spotless+JaCoCo) → E2E(Oracle container+Playwright) → SonarCloud

## Frontend
- Thymeleaf SSR + Bootstrap 5.3 + jQuery
- 공통 컴포넌트는 `static/js/components/` 하위에 모듈화되어 있음
- WebJars로 라이브러리 관리 (Bootstrap, jQuery, Select2, SortableJS)
