-- ============================================================================
-- V6: 템플릿 구분 + 이미지 승인 상태
-- ============================================================================
-- 1. PAGE_TYPE: 템플릿('TEMPLATE')과 일반 페이지('PAGE') 구분
-- 2. ASSET_STATE: 이미지 승인 워크플로 (WORK → PENDING → APPROVED / REJECTED)
-- ============================================================================


-- ------------------------------------------------------------
-- 1. SPW_CMS_PAGE — PAGE_TYPE 추가
-- ------------------------------------------------------------
ALTER TABLE SPW_CMS_PAGE ADD (
    PAGE_TYPE VARCHAR2(20) DEFAULT 'PAGE' NOT NULL
);

ALTER TABLE SPW_CMS_PAGE ADD CONSTRAINT CHK_SPW_PAGE_TYPE
    CHECK (PAGE_TYPE IN ('PAGE','TEMPLATE'));

COMMENT ON COLUMN SPW_CMS_PAGE.PAGE_TYPE
    IS '페이지 유형 (PAGE:일반 페이지 / TEMPLATE:템플릿)';


-- ------------------------------------------------------------
-- 2. SPW_CMS_PAGE_HISTORY — PAGE_TYPE 추가 (스냅샷 동기화)
-- ------------------------------------------------------------
ALTER TABLE SPW_CMS_PAGE_HISTORY ADD (
    PAGE_TYPE VARCHAR2(20) DEFAULT 'PAGE' NOT NULL
);

ALTER TABLE SPW_CMS_PAGE_HISTORY ADD CONSTRAINT CHK_SPW_HIST_PAGE_TYPE
    CHECK (PAGE_TYPE IN ('PAGE','TEMPLATE'));

COMMENT ON COLUMN SPW_CMS_PAGE_HISTORY.PAGE_TYPE
    IS '페이지 유형 (PAGE:일반 페이지 / TEMPLATE:템플릿)';


-- ------------------------------------------------------------
-- 3. SPW_CMS_ASSET — ASSET_STATE 추가
-- ------------------------------------------------------------
ALTER TABLE SPW_CMS_ASSET ADD (
    ASSET_STATE VARCHAR2(20) DEFAULT 'WORK' NOT NULL
);

ALTER TABLE SPW_CMS_ASSET ADD CONSTRAINT CHK_SPW_ASSET_STATE
    CHECK (ASSET_STATE IN ('WORK','PENDING','APPROVED','REJECTED'));

COMMENT ON COLUMN SPW_CMS_ASSET.ASSET_STATE
    IS '승인 상태 (WORK:미승인 / PENDING:승인요청 / APPROVED:승인 / REJECTED:반려)';

-- 승인 상태별 조회 인덱스
CREATE INDEX IDX_SPW_ASSET_STATE
    ON SPW_CMS_ASSET (ASSET_STATE, USE_YN);


-- ------------------------------------------------------------
-- 4. 검증
-- ------------------------------------------------------------
-- PAGE_TYPE 컬럼 확인
SELECT column_name, data_type, data_default FROM user_tab_columns
WHERE table_name = 'SPW_CMS_PAGE' AND column_name = 'PAGE_TYPE';

SELECT column_name, data_type, data_default FROM user_tab_columns
WHERE table_name = 'SPW_CMS_PAGE_HISTORY' AND column_name = 'PAGE_TYPE';

-- ASSET_STATE 컬럼 확인
SELECT column_name, data_type, data_default FROM user_tab_columns
WHERE table_name = 'SPW_CMS_ASSET' AND column_name = 'ASSET_STATE';

-- 제약조건 확인
SELECT constraint_name, search_condition FROM user_constraints
WHERE table_name IN ('SPW_CMS_PAGE','SPW_CMS_PAGE_HISTORY','SPW_CMS_ASSET')
AND constraint_name LIKE '%PAGE_TYPE%' OR constraint_name LIKE '%ASSET_STATE%';

-- 인덱스 확인
SELECT index_name FROM user_indexes
WHERE index_name = 'IDX_SPW_ASSET_STATE';
