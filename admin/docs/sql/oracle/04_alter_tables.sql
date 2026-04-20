-- =============================================================
-- Spider-Admin Oracle DDL — 테이블 컬럼 추가
-- =============================================================
-- 생성일: 2026-04-14
-- 01_create_tables.sql ~ 03_insert_initial_data.sql 실행 후 실행
-- =============================================================

-- =============================================================
-- 긴급공지 관리 (emergency-notice-manage)
-- FWK_PROPERTY 테이블 (긴급공지 전용 테이블 아님)
-- =============================================================
-- 배포 관리 컬럼 추가
ALTER TABLE FWK_PROPERTY ADD (
    START_DTIME   VARCHAR2(14),   -- 배포 시작 일시 (yyyyMMddHHmmss)
    END_DTIME     VARCHAR2(14),   -- 배포 종료 일시 (yyyyMMddHHmmss)
    DEPLOY_STATUS VARCHAR2(10)    -- 배포 상태 (DRAFT: 미배포 / DEPLOYED: 배포 중 / ENDED: 배포 종료)
);

-- 기존 USE_YN 행 초기 상태 설정 (초기 데이터 실행 후 적용)
UPDATE FWK_PROPERTY
SET DEPLOY_STATUS = 'DRAFT'
WHERE PROPERTY_GROUP_ID = 'notice'
  AND PROPERTY_ID = 'USE_YN';


-- =============================================================
-- 긴급공지 관리 (emergency-notice-manage)
-- POC_카드사용내역
-- =============================================================



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


COMMIT;
