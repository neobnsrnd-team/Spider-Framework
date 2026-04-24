# 로컬 개발 환경 실행 가이드

이 문서는 `spider-admin`(Spring Boot)과 `html-cms`(Next.js) 두 서비스를 로컬에서 실행하는 방법을 안내한다.

---

## 사전 요구사항

| 항목 | 버전 | 비고 |
| --- | --- | --- |
| JDK | 17 이상 | `java -version` 으로 확인 |
| Node.js | 20 이상 | `node -v` 으로 확인 |
| Oracle DB | 11g 이상 | 공유 서버 또는 로컬 XE |
| Oracle Instant Client | Basic 패키지 | html-cms(Node.js oracledb)에서 필요 |
| Docker | 선택 | nginx proxy 통합 테스트 시 필요 |

---

## 1. spider-admin (Spring Boot)

### 1-1. 환경변수 설정

```bash
cd admin
cp .env.example .env
```

`.env` 파일을 열어 아래 필수 항목을 채운다.

| 변수 | 설명 | 예시 |
| --- | --- | --- |
| `DB_URL` | Oracle JDBC URL | `jdbc:oracle:thin:@localhost:1521:XE` |
| `DB_USERNAME` | DB 계정 | `guest01` |
| `DB_PASSWORD` | DB 비밀번호 | |
| `DB_SCHEMA` | 접속 스키마 | `D_SPIDERLINK` |
| `REMEMBER_ME_KEY` | Remember-me 시크릿 (임의 문자열) | `my-secret-key` |
| `AUTHORITY_SOURCE` | 권한 소스 | `user-menu` (고정) |

CMS 기능을 함께 사용할 경우 아래 항목도 설정한다.

| 변수 | 설명 | 예시 |
| --- | --- | --- |
| `CMS_USER_URL` | 제작자 계정 로그인 후 이동할 CMS URL | `http://localhost:3000/` |
| `CMS_PREVIEW_URL` | 이미지 미리보기 기준 URL | `http://localhost:3000` |
| `CMS_DEPLOY_PUSH_URL` | 배포 push API URL | `http://localhost:3000/cms/api/deploy/push` |
| `CMS_DEPLOY_SECRET` | 배포 인증 토큰 (html-cms `DEPLOY_SECRET`과 동일 값) | `springware-deploy-secret` |
| `CMS_BUILDER_BASE_URL` | 이미지 업로드 대상 CMS 서버 URL | `http://localhost:3000` |

### 1-2. 데이터베이스 초기화 (최초 1회)

테이블과 초기 데이터가 없는 경우 아래 SQL을 순서대로 실행한다.  
**쿼리 실행은 개발자가 DB에서 직접 수행해야 한다.**

```sql
-- Oracle
@docs/sql/oracle/01_create_tables.sql
@docs/sql/oracle/02_create_indexes.sql
@docs/sql/oracle/03_insert_initial_data.sql
```

### 1-3. 실행

**터미널 (bash)**

```bash
cd admin

# .env 파일 로드 후 실행
source .env && ./mvnw spring-boot:run -Dspring-boot.run.profiles=oracle
```

**PowerShell**

```powershell
cd admin
./mvnw spring-boot:run "-Dspring-boot.run.profiles=oracle"
# PowerShell은 -D 옵션에 따옴표가 필요하다
```

> 기동 후 http://localhost:8080 접속

**IntelliJ IDEA**

1. `Run > Edit Configurations` 열기
2. `+` → `Spring Boot` 추가
3. Main class: `com.example.admin_demo.AdminDemoApplication`
4. Active profiles: `oracle`
5. Environment variables 탭에서 `.env` 파일 직접 입력하거나 **EnvFile 플러그인** 사용 (`.env` 파일 경로 지정)

### 1-4. 빌드만 할 경우

```bash
cd admin
./mvnw clean package -DskipTests
```

---

## 2. html-cms (Next.js)

### 2-1. Oracle Instant Client 설치 (최초 1회)

Node.js의 `oracledb` 패키지는 Oracle Instant Client(Thick 모드)가 필요하다.

**Windows**

1. [Oracle Instant Client 다운로드](https://www.oracle.com/database/technologies/instant-client/downloads.html) → Basic 패키지 zip 다운로드
2. 압축 해제 후 PATH에 해당 디렉토리 추가  
   예: `C:\oracle\instantclient_21_x` → 시스템 환경변수 PATH에 추가

**Mac**

```bash
brew install instantclient-basic
```

설치 후 터미널을 재시작하거나 `source ~/.zshrc` 적용.

### 2-2. 환경변수 설정

```bash
cd html-cms
cp .env.example .env
```

`.env` 파일에서 아래 필수 항목을 채운다.

| 변수 | 설명 | 예시 |
| --- | --- | --- |
| `ORACLE_USER` | DB 계정 | `guest01` |
| `ORACLE_PASSWORD` | DB 비밀번호 | |
| `ORACLE_HOST` | DB 호스트 | `localhost` |
| `ORACLE_PORT` | DB 포트 | `1521` |
| `ORACLE_SERVICE` | DB 서비스명 | `XE` |
| `ORACLE_SCHEMA` | 접속 스키마 | `D_SPIDERLINK` |
| `DEPLOY_SECRET` | 배포 인증 토큰 (spider-admin `CMS_DEPLOY_SECRET`과 동일 값) | `springware-deploy-secret` |
| `CMS_ADMIN_BASE_URL` | spider-admin 서버 URL (인증 연동용) | `http://localhost:8080` |

이미지 저장 경로 (기본값으로 시작 가능):

| 변수 | 기본값 | 설명 |
| --- | --- | --- |
| `ASSET_UPLOAD_DIR` | `public/uploads` | 업로드된 이미지 임시 저장 디렉토리 |
| `ASSET_BASE_URL` | `/uploads` | 클라이언트 접근 URL |
| `DEPLOYED_UPLOAD_DIR` | `public/deployed` | 승인 완료 이미지 저장 디렉토리 |
| `DEPLOYED_BASE_URL` | `/deployed/static` | 승인 이미지 클라이언트 접근 URL |

### 2-3. 패키지 설치 (최초 1회)

```bash
cd html-cms
npm install
```

### 2-4. 실행

```bash
cd html-cms
npm run dev
```

> 기동 후 http://localhost:3000 접속  
> CMS 편집기는 http://localhost:3000/cms/edit

캐시 문제가 있을 경우:

```bash
npm run dev:clean   # .next 캐시 삭제 후 실행
```

---

## 3. 두 서비스 통합 테스트 (nginx proxy)

두 서비스를 동시에 띄운 뒤 nginx proxy를 통해 통합 접속한다.  
spider-admin만으로 테스트하면 `/cms/**` 요청이 proxy를 우회하므로 반드시 proxy를 사용한다.

```bash
cd admin
docker compose --profile admin-proxy up -d admin-proxy
```

> 통합 접속: http://localhost:9000  
> 로그인: http://localhost:9000/login

### 라우팅 규칙

| 경로 | 이동 서버 |
| --- | --- |
| `/login`, `/api/**` | spider-admin (8080) |
| `/cms/**` | html-cms (3000) |
| `/cms-admin/**` | spider-admin (8080) |

---

## 4. 자주 쓰는 명령어 요약

```bash
# spider-admin
./mvnw spring-boot:run -Dspring-boot.run.profiles=oracle   # 실행
./mvnw clean package -DskipTests                           # 빌드
./mvnw test                                                # 단위 테스트
./mvnw spotless:apply                                      # 코드 포맷

# html-cms
npm run dev          # 개발 서버 실행
npm run dev:clean    # 캐시 초기화 후 실행
npm run build        # 프로덕션 빌드
npm run lint:fix     # ESLint 자동 수정
```
