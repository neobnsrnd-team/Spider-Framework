-- =============================================================
-- Spider-Admin Oracle DDL — FWK_PROPERTY 배포 관리 행 방식 전환
-- =============================================================
-- 생성일: 2026-04-20
-- 01_create_tables.sql ~ 03_insert_initial_data.sql 실행 후 실행
-- ※ 아래 쿼리는 모두 개발자가 DB에서 직접 실행해야 합니다.
-- =============================================================

-- =============================================================
-- 긴급공지 관리 (emergency-notice-manage)
-- FWK_PROPERTY 배포 관리: 컬럼 추가 방식 → 행 추가(key-value) 방식으로 전환
-- FWK_PROPERTY는 key-value store 패턴 테이블이므로 새 속성은 컬럼이 아닌 행으로 관리한다.
-- =============================================================

-- 1단계: 기존 컬럼 방식 롤백 — ALTER TABLE로 추가했던 3개 컬럼 삭제
ALTER TABLE FWK_PROPERTY DROP COLUMN START_DTIME;
ALTER TABLE FWK_PROPERTY DROP COLUMN END_DTIME;
ALTER TABLE FWK_PROPERTY DROP COLUMN DEPLOY_STATUS;

-- 2단계: 배포 관리 속성을 'notice' 그룹의 행으로 추가
INSERT INTO FWK_PROPERTY (PROPERTY_GROUP_ID, PROPERTY_ID, PROPERTY_NAME, PROPERTY_DESC, VALID_DATA, DEFAULT_VALUE, LAST_UPDATE_USER_ID, LAST_UPDATE_DTIME)
VALUES ('notice', 'DEPLOY_STATUS', '배포상태', 'DRAFT(미배포) / DEPLOYED(배포 중) / ENDED(배포 종료)', 'DRAFT, DEPLOYED, ENDED', 'DRAFT', 'Admin', TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS'));

INSERT INTO FWK_PROPERTY (PROPERTY_GROUP_ID, PROPERTY_ID, PROPERTY_NAME, PROPERTY_DESC, DEFAULT_VALUE, LAST_UPDATE_USER_ID, LAST_UPDATE_DTIME)
VALUES ('notice', 'START_DTIME', '배포시작일시', '배포 시작 일시 (yyyyMMddHHmmss)', NULL, 'Admin', TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS'));

INSERT INTO FWK_PROPERTY (PROPERTY_GROUP_ID, PROPERTY_ID, PROPERTY_NAME, PROPERTY_DESC, DEFAULT_VALUE, LAST_UPDATE_USER_ID, LAST_UPDATE_DTIME)
VALUES ('notice', 'END_DTIME', '배포종료일시', '배포 종료 일시 (yyyyMMddHHmmss)', NULL, 'Admin', TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS'));

-- =============================================================
-- SPW_CMS_PAGE — 실제 DB 상태 반영 ALTER
-- =============================================================
-- 생성일: 2026-04-20
-- ※ 쿼리 수행은 개발자가 DB에서 직접 수행해야 합니다.
-- ※ 04_ab_test.sql 의 AB_GROUP_ID / AB_WEIGHT ALTER는 01_create_tables.sql 에
--    이미 포함되어 있으므로 실행하지 않아도 됩니다.
-- =============================================================

-- ① 컬럼 크기 변경 (VARCHAR2 길이 확장)
ALTER TABLE SPW_CMS_PAGE MODIFY (
    CREATE_USER_ID           VARCHAR2(100),   -- VARCHAR2(20) → 100
    CREATE_USER_NAME         VARCHAR2(200),   -- VARCHAR2(100) → 200
    LAST_MODIFIER_ID         VARCHAR2(100),   -- VARCHAR2(20) → 100
    LAST_MODIFIER_NAME       VARCHAR2(200),   -- VARCHAR2(100) → 200
    APPROVER_ID              VARCHAR2(100),   -- VARCHAR2(20) → 100
    APPROVER_NAME            VARCHAR2(200),   -- VARCHAR2(100) → 200
    FINAL_APPROVAL_STATE     VARCHAR2(20),    -- VARCHAR2(1) → 20
    FINAL_APPROVAL_USER_ID   VARCHAR2(100),   -- VARCHAR2(20) → 100
    FINAL_APPROVAL_USER_NAME VARCHAR2(200)    -- VARCHAR2(100) → 200
);

-- ② 날짜형 변경
ALTER TABLE SPW_CMS_PAGE MODIFY (
    CREATE_DATE          TIMESTAMP(6),  -- DATE → TIMESTAMP(6)
    FINAL_APPROVAL_DTIME TIMESTAMP(6)   -- VARCHAR2(14) → TIMESTAMP(6)
);

-- ③ VARCHAR2 → CLOB 변환
--    ※ 컬럼에 기존 데이터가 있을 경우 Oracle 12c 이상 환경에서만 직접 변환 가능합니다.
ALTER TABLE SPW_CMS_PAGE MODIFY (PAGE_DESC        CLOB);  -- VARCHAR2(500)
ALTER TABLE SPW_CMS_PAGE MODIFY (PAGE_DESC_DETAIL CLOB);  -- VARCHAR2(2000)
ALTER TABLE SPW_CMS_PAGE MODIFY (USER_GUIDE       CLOB);  -- VARCHAR2(500)
ALTER TABLE SPW_CMS_PAGE MODIFY (REJECTED_REASON  CLOB);  -- VARCHAR2(2000)

-- ④ VARCHAR2(1) → CHAR(1) 변환 및 NOT NULL 제약 추가
--    ※ IS_PUBLIC 에 NULL 행이 있으면 먼저 UPDATE SPW_CMS_PAGE SET IS_PUBLIC='N' WHERE IS_PUBLIC IS NULL; 실행
ALTER TABLE SPW_CMS_PAGE MODIFY (
    USE_YN    CHAR(1)              NOT NULL,  -- VARCHAR2(1) → CHAR(1), NOT NULL 유지
    IS_PUBLIC CHAR(1) DEFAULT 'N'  NOT NULL   -- VARCHAR2(1) nullable → CHAR(1) NOT NULL
);

-- ⑤ 기존 컬럼 NOT NULL 추가
--    ※ NULL 데이터가 있으면 UPDATE 로 채운 뒤 실행하세요.
--      PAGE_NAME : UPDATE SPW_CMS_PAGE SET PAGE_NAME=PAGE_ID WHERE PAGE_NAME IS NULL;
--      VIEW_MODE : UPDATE SPW_CMS_PAGE SET VIEW_MODE='responsive' WHERE VIEW_MODE IS NULL;
ALTER TABLE SPW_CMS_PAGE MODIFY (PAGE_NAME VARCHAR2(200) NOT NULL);
ALTER TABLE SPW_CMS_PAGE MODIFY (VIEW_MODE VARCHAR2(20)  NOT NULL);

-- ⑥ CHECK 제약 추가
ALTER TABLE SPW_CMS_PAGE ADD CONSTRAINT CHK_SPW_PAGE_APPROVE_STATE
    CHECK (APPROVE_STATE IN ('WORK', 'PENDING', 'APPROVED', 'REJECTED'));

ALTER TABLE SPW_CMS_PAGE ADD CONSTRAINT CHK_SPW_PAGE_USE_YN
    CHECK (USE_YN IN ('Y', 'N'));

ALTER TABLE SPW_CMS_PAGE ADD CONSTRAINT CHK_SPW_PAGE_IS_PUBLIC
    CHECK (IS_PUBLIC IN ('Y', 'N'));

ALTER TABLE SPW_CMS_PAGE ADD CONSTRAINT CHK_SPW_PAGE_VIEW_MODE
    CHECK (VIEW_MODE IN ('mobile', 'web', 'responsive'));

-- ⑦ 신규 컬럼 추가
ALTER TABLE SPW_CMS_PAGE ADD (
    TARGET_CD VARCHAR2(50)  -- 대상 코드
);

-- PAGE_TYPE: NOT NULL 컬럼 — DEFAULT 'PAGE' 로 기존 행을 초기화하면서 추가
ALTER TABLE SPW_CMS_PAGE ADD (
    PAGE_TYPE VARCHAR2(20) DEFAULT 'PAGE' NOT NULL
);

ALTER TABLE SPW_CMS_PAGE ADD CONSTRAINT CHK_SPW_PAGE_TYPE
    CHECK (PAGE_TYPE IN ('PAGE', 'TEMPLATE', 'REACT'));

-- =============================================================
-- bizApp — POC_USER 비밀번호 BCrypt 마이그레이션
-- 추가일: 2026-04-23
-- 주의: 개발자가 DB에서 직접 실행해야 한다
-- BCrypt 강도(strength): 10, 해시 길이: 60자
--
-- [순서]
-- 1. PASSWORD 컬럼 크기를 60자로 확장 (BCrypt 해시 길이 수용)
-- 2. BCrypt 해시 생성: new BCryptPasswordEncoder().encode("test12!") 실행 후 출력값 복사
-- 3. 아래 UPDATE 문의 '<BCrypt hash of test12!>' 를 실제 해시값으로 교체 후 실행
-- =============================================================

-- Step 1: PASSWORD 컬럼 크기 확장 (VARCHAR2(20) → VARCHAR2(60))
ALTER TABLE D_SPIDERLINK.POC_USER MODIFY PASSWORD VARCHAR2(60);

-- Step 2: 평문 비밀번호를 BCrypt 해시로 교체
-- '<BCrypt hash of test12!>' 를 실제 생성된 해시값(60자)으로 교체 후 실행
UPDATE D_SPIDERLINK.POC_USER
SET PASSWORD = '<BCrypt hash of test12!>'
WHERE PASSWORD = 'test12!';

-- =============================================================
-- CMS 배포 서버 인스턴스 포트 변경: 3001(Next.js 직접) → 8080(nginx)
-- =============================================================
-- 생성일: 2026-04-22
-- ※ 아래 쿼리는 개발자가 DB에서 직접 실행해야 합니다.
-- =============================================================

-- 미리보기 URL이 http://{ip}:{INSTANCE_PORT}/cms/deployed/{pageId}.html 형태로 구성되므로
-- INSTANCE_PORT를 8080으로 변경해야 nginx를 통해 정적 파일에 접근할 수 있다.
UPDATE FWK_CMS_SERVER_INSTANCE
SET INSTANCE_PORT = 8080,
    INSTANCE_DESC = '운영 배포 서버 (133.186.135.23:8080)'
WHERE INSTANCE_ID = 'prod-operation-01';

COMMIT;

-- =============================================================
-- #147 CMS 배포 관리 — 만료수동처리 기능 추가
-- ⚠ 개발자가 DB에서 직접 실행해야 합니다.
-- =============================================================

-- SPW_CMS_PAGE.BEGINNING_DATE / EXPIRED_DATE / IS_PUBLIC / FILE_PATH_BACK 컬럼은
-- 01_create_tables.sql 에 이미 정의되어 있으므로 별도 ALTER 불필요.
-- FWK_CMS_FILE_SEND_HIS 의 만료 전용 이력 조회 예시 (운영 확인용):
--   SELECT * FROM FWK_CMS_FILE_SEND_HIS
--   WHERE FILE_ID LIKE '%_expired.html'
--   ORDER BY LAST_MODIFIED_DTIME DESC;

-- =============================================================
-- FWK_SQL_QUERY_HIS — 실제 DB 테이블 확인 결과
-- =============================================================
-- 확인일: 2026-04-22
-- FWK_SQL_QUERY_HIS 테이블은 구버전부터 이미 존재하는 테이블입니다.
-- PK: (VERSION_ID VARCHAR2(50), QUERY_ID VARCHAR2(50))
-- 신버전에서는 VERSION_ID = System.currentTimeMillis() 문자열 사용
-- ※ 잘못 생성된 시퀀스를 아래 쿼리로 제거하세요 (개발자 직접 실행):
DROP SEQUENCE SEQ_FWK_SQL_QUERY_HIS;

-- =============================================================
-- FWK_SQL_QUERY_HIS 컬럼 크기 확장
-- =============================================================
-- 배경: 이력 저장 시 QUERY_NAME(50), QUERY_DESC(200) 초과 데이터 유실 방지
--       메인 테이블(FWK_SQL_QUERY) 기준으로 컬럼 크기를 일치시킴
-- ※ 개발자가 DB에서 직접 실행해야 합니다.
ALTER TABLE FWK_SQL_QUERY_HIS MODIFY (QUERY_NAME VARCHAR2(200));
ALTER TABLE FWK_SQL_QUERY_HIS MODIFY (QUERY_DESC VARCHAR2(500));

COMMIT;

-- =============================================================
-- #150 MetaDrivenCommandHandler Biz 타입('B') 데모 컴포넌트 데이터
-- =============================================================
-- 배경: MetaDrivenCommandHandler 에 Biz 클래스 리플렉션 호출(COMPONENT_TYPE='B') 추가.
--       외부시스템 TCP 호출이 필요한 서비스 스텝은 아래와 같이 FWK_COMPONENT 에 등록한다.
-- ⚠ 개발자가 DB에서 직접 실행해야 합니다.
--
-- COMPONENT_TYPE 값 정리:
--   S = SELECT (MyBatis selectOne)
--   U = UPDATE/INSERT/DELETE (MyBatis update, auto-commit)
--   B = Biz 클래스 리플렉션 호출 (COMPONENT_CLASS_NAME = 스프링 빈 클래스 전체 경로)
--
-- TcpCallBiz 사용 시 접속 대상은 spider-link application.yml 의 tcp.ext.host / tcp.ext.port 로 설정.

-- 외부 인증AP(biz-auth) 로그인 TCP 호출 컴포넌트 예시
INSERT INTO FWK_COMPONENT (
    COMPONENT_ID, COMPONENT_NAME, COMPONENT_DESC,
    COMPONENT_TYPE, COMPONENT_CLASS_NAME, COMPONENT_METHOD_NAME,
    USE_YN, LAST_UPDATE_DTIME, LAST_UPDATE_USER_ID
) VALUES (
    'EXT_TCP_AUTH_LOGIN',
    '외부 인증AP 로그인 TCP 호출',
    'TcpCallBiz 를 통해 biz-auth(포트 19100)로 AUTH_LOGIN 커맨드 전송',
    'B',
    'com.example.spiderlink.infra.tcp.biz.TcpCallBiz',
    'AUTH_LOGIN',
    'Y',
    TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS'),
    'Admin'
);

COMMIT;
