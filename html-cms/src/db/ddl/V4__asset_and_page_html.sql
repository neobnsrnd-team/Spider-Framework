-- ============================================================================
-- V4__asset_and_page_html.sql
-- 페이지 HTML DB 저장 전환 + 이미지 에셋 BLOB 저장
-- ============================================================================

-- ------------------------------------------------------------
-- 1. SPW_CMS_PAGE — PAGE_HTML CLOB 추가
-- ------------------------------------------------------------
ALTER TABLE SPW_CMS_PAGE ADD (
    PAGE_HTML CLOB
);

COMMENT ON COLUMN SPW_CMS_PAGE.PAGE_HTML
    IS '에디터 HTML 원본 (DB 직접 저장 — FILE_PATH 대체)';

-- ------------------------------------------------------------
-- 2. SPW_CMS_PAGE_HISTORY — PAGE_HTML CLOB 추가
-- ------------------------------------------------------------
ALTER TABLE SPW_CMS_PAGE_HISTORY ADD (
    PAGE_HTML CLOB
);

COMMENT ON COLUMN SPW_CMS_PAGE_HISTORY.PAGE_HTML
    IS '승인 시점 HTML 스냅샷 — 운영 서버 렌더링용';

-- ------------------------------------------------------------
-- 3. SPW_CMS_ASSET — 이미지 에셋 (1행 = 1이미지, BLOB 저장)
--    전제: 서버에 존재하는 모든 이미지 = 승인된 이미지
--    이미지 수정 시 → 새 ASSET_ID로 INSERT (기존 참조 보존)
-- ------------------------------------------------------------
CREATE TABLE SPW_CMS_ASSET (
    ASSET_ID            VARCHAR2(100)   NOT NULL,
    ASSET_NAME          VARCHAR2(200)   NOT NULL,
    BUSINESS_CATEGORY   VARCHAR2(50),
    MIME_TYPE           VARCHAR2(100)   NOT NULL,
    FILE_SIZE           NUMBER,
    ASSET_DATA          BLOB            NOT NULL,
    ASSET_DESC          VARCHAR2(1000),
    USE_YN              CHAR(1)         DEFAULT 'Y' NOT NULL,
    CREATE_USER_ID      VARCHAR2(100),
    CREATE_USER_NAME    VARCHAR2(200),
    LAST_MODIFIER_ID    VARCHAR2(100),
    LAST_MODIFIER_NAME  VARCHAR2(200),
    CREATE_DATE         TIMESTAMP(6)    DEFAULT SYSTIMESTAMP,
    LAST_MODIFIED_DTIME TIMESTAMP(6)    DEFAULT SYSTIMESTAMP,
    CONSTRAINT PK_SPW_CMS_ASSET       PRIMARY KEY (ASSET_ID),
    CONSTRAINT CHK_SPW_ASSET_USE_YN   CHECK (USE_YN IN ('Y','N'))
);

-- 자동 갱신 트리거
-- ※ DBeaver에서 실행 시 트리거 블록은 / 까지 별도 실행 필요 (Alt+X)
CREATE OR REPLACE TRIGGER TRG_SPW_ASSET_MOD_DTIME
BEFORE UPDATE ON SPW_CMS_ASSET
FOR EACH ROW
BEGIN
    :NEW.LAST_MODIFIED_DTIME := SYSTIMESTAMP;
END;
/

-- 카테고리별 조회 인덱스
CREATE INDEX IDX_SPW_ASSET_CATEGORY
    ON SPW_CMS_ASSET (BUSINESS_CATEGORY, USE_YN);

-- 권한
GRANT DELETE, INSERT, SELECT, UPDATE ON SPW_CMS_ASSET TO GUEST01;

-- 코멘트
COMMENT ON TABLE  SPW_CMS_ASSET                    IS '이미지 에셋 저장소 — BLOB 기반 [Springware CMS 신규]';
COMMENT ON COLUMN SPW_CMS_ASSET.ASSET_ID           IS '에셋 고유 식별자';
COMMENT ON COLUMN SPW_CMS_ASSET.ASSET_NAME         IS '이미지 파일명';
COMMENT ON COLUMN SPW_CMS_ASSET.BUSINESS_CATEGORY  IS '업무 카테고리 (카드, 뱅킹, 대출 등)';
COMMENT ON COLUMN SPW_CMS_ASSET.MIME_TYPE          IS 'MIME 타입 (image/png, image/jpeg 등)';
COMMENT ON COLUMN SPW_CMS_ASSET.FILE_SIZE          IS '파일 크기 (bytes)';
COMMENT ON COLUMN SPW_CMS_ASSET.ASSET_DATA         IS '이미지 바이너리 (BLOB)';
COMMENT ON COLUMN SPW_CMS_ASSET.ASSET_DESC         IS '이미지 설명';
COMMENT ON COLUMN SPW_CMS_ASSET.USE_YN             IS '사용 여부 (Y/N, 기본 Y)';
COMMENT ON COLUMN SPW_CMS_ASSET.CREATE_USER_ID     IS '등록자 ID';
COMMENT ON COLUMN SPW_CMS_ASSET.CREATE_USER_NAME   IS '등록자명';
COMMENT ON COLUMN SPW_CMS_ASSET.LAST_MODIFIER_ID   IS '최종 수정자 ID';
COMMENT ON COLUMN SPW_CMS_ASSET.LAST_MODIFIER_NAME IS '최종 수정자명';
COMMENT ON COLUMN SPW_CMS_ASSET.CREATE_DATE        IS '등록일시';
COMMENT ON COLUMN SPW_CMS_ASSET.LAST_MODIFIED_DTIME IS '최종 수정일시 (트리거 자동 갱신)';

-- ------------------------------------------------------------
-- 4. SPW_CMS_ASSET_PAGE_MAP — 페이지 버전별 이미지 사용 매핑
--    승인 시 HTML 파싱 → 사용된 ASSET_ID 목록 INSERT
--    용도: 배포 추적, 감사, 이미지 정리
-- ------------------------------------------------------------
CREATE TABLE SPW_CMS_ASSET_PAGE_MAP (
    PAGE_ID             VARCHAR2(100)   NOT NULL,
    VERSION             NUMBER          NOT NULL,
    ASSET_ID            VARCHAR2(100)   NOT NULL,
    LAST_MODIFIER_ID    VARCHAR2(100),
    LAST_MODIFIED_DTIME TIMESTAMP(6)    DEFAULT SYSTIMESTAMP,
    CONSTRAINT PK_SPW_ASSET_PAGE_MAP  PRIMARY KEY (PAGE_ID, VERSION, ASSET_ID),
    CONSTRAINT FK_SPW_ASSET_PM_HIST   FOREIGN KEY (PAGE_ID, VERSION)
        REFERENCES SPW_CMS_PAGE_HISTORY (PAGE_ID, VERSION),
    CONSTRAINT FK_SPW_ASSET_PM_ASSET  FOREIGN KEY (ASSET_ID)
        REFERENCES SPW_CMS_ASSET (ASSET_ID)
);

-- 권한
GRANT DELETE, INSERT, SELECT, UPDATE ON SPW_CMS_ASSET_PAGE_MAP TO GUEST01;

-- 코멘트
COMMENT ON TABLE  SPW_CMS_ASSET_PAGE_MAP                    IS '페이지 버전별 이미지 사용 매핑 — 배포·감사 추적용 [Springware CMS 신규]';
COMMENT ON COLUMN SPW_CMS_ASSET_PAGE_MAP.PAGE_ID            IS '페이지 ID';
COMMENT ON COLUMN SPW_CMS_ASSET_PAGE_MAP.VERSION            IS '페이지 버전 (PAGE_HISTORY와 동일)';
COMMENT ON COLUMN SPW_CMS_ASSET_PAGE_MAP.ASSET_ID           IS '사용된 이미지 에셋 ID';
COMMENT ON COLUMN SPW_CMS_ASSET_PAGE_MAP.LAST_MODIFIER_ID   IS '최종 수정자 ID';
COMMENT ON COLUMN SPW_CMS_ASSET_PAGE_MAP.LAST_MODIFIED_DTIME IS '최종 수정일시';

-- ------------------------------------------------------------
-- 5. 검증
-- ------------------------------------------------------------
-- PAGE_HTML 컬럼 확인
SELECT column_name, data_type FROM user_tab_columns
WHERE table_name = 'SPW_CMS_PAGE' AND column_name = 'PAGE_HTML';

SELECT column_name, data_type FROM user_tab_columns
WHERE table_name = 'SPW_CMS_PAGE_HISTORY' AND column_name = 'PAGE_HTML';

-- ASSET 테이블 확인
SELECT table_name FROM user_tables
WHERE table_name IN ('SPW_CMS_ASSET', 'SPW_CMS_ASSET_PAGE_MAP');

-- 인덱스 확인
SELECT index_name FROM user_indexes
WHERE table_name = 'SPW_CMS_ASSET';

-- 트리거 확인
SELECT trigger_name FROM user_triggers
WHERE table_name = 'SPW_CMS_ASSET';
