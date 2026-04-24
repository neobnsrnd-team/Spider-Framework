-- ============================================================================
-- Springware CMS — Oracle 11g XE DDL 통합 스크립트
-- ============================================================================
-- 이슈 #26 ERD v5 기준 | 신규 4개 테이블
-- 네임스페이스: SPW_CMS_ (AS-IS FWK_CMS_ 와 충돌 방지)
-- 생성일: 2026-03-18
-- 최종 수정: 2026-03-24 (실제 DB 스키마 전면 동기화)
--   - #80 MAP PK 변경 (SEQ→VERSION), 시퀀스 제거
--   - #62 FILE_PATH 추가, PAGE_DESC 유지 (호환용)
--   - #74 RENDERED_HTML·SNAPSHOT_DTIME 제거
--   - PAGE: TARGET_CD 추가, VIEW_MODE VARCHAR2(20) DEFAULT 'mobile' NOT NULL
--   - HISTORY: CHECK 제약조건 4개 추가, VIEW_MODE·TARGET_CD 동기화
--   - COMP_PAGE_MAP: FK 대상 PAGE→PAGE_HISTORY 변경, SORT_ORDER DEFAULT 0 + CHECK
--   - 인덱스: IDX_SPW_HIST_STATE 추가, IDX_SPW_COMP_MAP 보정
--
-- ※ DBeaver 실행 방법:
--    1. Script 실행 설정에서 "Stop on first error" 체크 해제
--    2. 스크립트 전체 선택 후 Alt+X (Execute SQL Script)
--    3. SECTION 0의 DROP 에러는 무시 (없는 객체를 지우려 할 때 발생하는 정상 에러)
--       - ORA-00942: 테이블 없음 (DROP TABLE)
--    4. 트리거는 별도 파일 V1__triggers.sql 에서 실행
-- ============================================================================


-- ════════════════════════════════════════════════════════════════════════════
-- [SECTION 0] 정리 스크립트 — 반복 실행용 DROP (FK 의존 테이블부터 역순)
-- ════════════════════════════════════════════════════════════════════════════

DROP TABLE SPW_CMS_COMP_PAGE_MAP CASCADE CONSTRAINTS PURGE;
DROP TABLE SPW_CMS_PAGE_HISTORY  CASCADE CONSTRAINTS PURGE;
DROP TABLE SPW_CMS_PAGE          CASCADE CONSTRAINTS PURGE;
DROP TABLE SPW_CMS_COMPONENT     CASCADE CONSTRAINTS PURGE;


-- ════════════════════════════════════════════════════════════════════════════
-- [SECTION 1] 독립 테이블 생성
-- ════════════════════════════════════════════════════════════════════════════


-- ──────────────────────────────────────────────────────────────────────────
-- 1-1. SPW_CMS_COMPONENT — 컴포넌트 카탈로그 (금융 + 기본 블록)
-- ──────────────────────────────────────────────────────────────────────────
CREATE TABLE SPW_CMS_COMPONENT (
    COMPONENT_ID        VARCHAR2(100)  NOT NULL,
    COMPONENT_TYPE      VARCHAR2(20)   NOT NULL,
    VIEW_MODE           VARCHAR2(20)   NOT NULL,
    COMPONENT_THUMBNAIL VARCHAR2(500),
    DATA                CLOB,
    USE_YN              CHAR(1)        DEFAULT 'Y' NOT NULL,
    CREATE_USER_ID      VARCHAR2(100),
    CREATE_USER_NAME    VARCHAR2(200),
    LAST_MODIFIER_ID    VARCHAR2(100),
    LAST_MODIFIED_DTIME TIMESTAMP      DEFAULT SYSTIMESTAMP,
    CONSTRAINT PK_SPW_CMS_COMPONENT     PRIMARY KEY (COMPONENT_ID),
    CONSTRAINT CHK_SPW_COMP_TYPE        CHECK (COMPONENT_TYPE IN ('finance','basic')),
    CONSTRAINT CHK_SPW_COMP_VIEW_MODE   CHECK (VIEW_MODE IN ('mobile','web','responsive')),
    CONSTRAINT CHK_SPW_COMP_USE_YN      CHECK (USE_YN IN ('Y','N'))
);

COMMENT ON TABLE  SPW_CMS_COMPONENT                        IS 'CMS 컴포넌트 카탈로그 [Springware CMS 신규]';
COMMENT ON COLUMN SPW_CMS_COMPONENT.COMPONENT_TYPE         IS '컴포넌트 유형 (finance:금융전용 / basic:기본)';
COMMENT ON COLUMN SPW_CMS_COMPONENT.VIEW_MODE              IS '뷰 모드 (mobile / web / responsive)';
COMMENT ON COLUMN SPW_CMS_COMPONENT.COMPONENT_THUMBNAIL    IS '썸네일 URL — 빌더 UI 빈번 조회로 별도 컬럼 유지';
COMMENT ON COLUMN SPW_CMS_COMPONENT.DATA                   IS '컴포넌트 원본 JSON 전문 (CLOB) — JSON 유효성은 앱 레이어에서 검증';


-- ──────────────────────────────────────────────────────────────────────────
-- 1-2. SPW_CMS_PAGE — 페이지 마스터
-- ──────────────────────────────────────────────────────────────────────────
CREATE TABLE SPW_CMS_PAGE (
    PAGE_ID                  VARCHAR2(100)  NOT NULL,
    PAGE_NAME                VARCHAR2(200)  NOT NULL,
    VIEW_MODE                VARCHAR2(20)   DEFAULT 'mobile' NOT NULL,
    OWNER_DEPT_CODE          VARCHAR2(50),
    FILE_PATH                VARCHAR2(500),
    CREATE_USER_ID           VARCHAR2(100),
    CREATE_USER_NAME         VARCHAR2(200),
    LAST_MODIFIER_ID         VARCHAR2(100),
    LAST_MODIFIER_NAME       VARCHAR2(200),
    APPROVER_ID              VARCHAR2(100),
    APPROVER_NAME            VARCHAR2(200),
    CREATE_DATE              TIMESTAMP      DEFAULT SYSTIMESTAMP,
    CONFIRM_DTIME            TIMESTAMP,
    BEGINNING_DATE           DATE,
    EXPIRED_DATE             DATE,
    APPROVE_STATE            VARCHAR2(20)   DEFAULT 'WORK' NOT NULL,
    LAST_MODIFIED_DTIME      TIMESTAMP      DEFAULT SYSTIMESTAMP,
    PAGE_DESC                CLOB,
    PAGE_DESC_DETAIL         CLOB,
    TEMPLATE_ID              VARCHAR2(100),
    THUMBNAIL                VARCHAR2(500),
    TARGET_CD                VARCHAR2(50),
    USER_GUIDE               CLOB,
    FILE_PATH_BACK           VARCHAR2(500),
    REJECTED_REASON          CLOB,
    USE_YN                   CHAR(1)        DEFAULT 'Y' NOT NULL,
    IS_PUBLIC                CHAR(1)        DEFAULT 'Y' NOT NULL,
    APPROVE_DATE             TIMESTAMP,
    FILE_CRC_VALUE           VARCHAR2(64),
    FINAL_APPROVAL_STATE     VARCHAR2(20),
    FINAL_APPROVAL_DTIME     TIMESTAMP,
    FINAL_APPROVAL_USER_ID   VARCHAR2(100),
    FINAL_APPROVAL_USER_NAME VARCHAR2(200),
    CONSTRAINT PK_SPW_CMS_PAGE              PRIMARY KEY (PAGE_ID),
    CONSTRAINT CHK_SPW_PAGE_APPROVE_STATE   CHECK (APPROVE_STATE IN ('WORK','PENDING','APPROVED','REJECTED')),
    CONSTRAINT CHK_SPW_PAGE_VIEW_MODE      CHECK (VIEW_MODE IN ('mobile','web','responsive')),
    CONSTRAINT CHK_SPW_PAGE_USE_YN         CHECK (USE_YN IN ('Y','N')),
    CONSTRAINT CHK_SPW_PAGE_IS_PUBLIC      CHECK (IS_PUBLIC IN ('Y','N'))
);

COMMENT ON TABLE  SPW_CMS_PAGE                              IS 'CMS 페이지 마스터 [Springware CMS 신규]';
COMMENT ON COLUMN SPW_CMS_PAGE.VIEW_MODE                    IS '뷰 모드 (mobile / web / responsive)';
COMMENT ON COLUMN SPW_CMS_PAGE.FILE_PATH                    IS '페이지 HTML 파일 경로 (/uploads/pages/{pageId}.html)';
COMMENT ON COLUMN SPW_CMS_PAGE.APPROVE_STATE                IS '결재 상태 (WORK:작업중 / PENDING:결재요청 / APPROVED:승인 / REJECTED:반려)';
COMMENT ON COLUMN SPW_CMS_PAGE.IS_PUBLIC                    IS '공개 여부 — 긴급 차단용 (Y:공개 / N:즉시차단)';
COMMENT ON COLUMN SPW_CMS_PAGE.FILE_CRC_VALUE               IS '배포 파일 무결성 검증 CRC 값';
COMMENT ON COLUMN SPW_CMS_PAGE.EXPIRED_DATE                 IS '만료일 — 경과 시 파일 삭제, 레코드는 보존';


-- ════════════════════════════════════════════════════════════════════════════
-- [SECTION 2] 의존 테이블 생성
-- ════════════════════════════════════════════════════════════════════════════


-- ──────────────────────────────────────────────────────────────────────────
-- 2-1. SPW_CMS_PAGE_HISTORY — 페이지 승인 이력
--      승인(APPROVED) 시에만 INSERT — PAGE 스냅샷 복사
-- ──────────────────────────────────────────────────────────────────────────
CREATE TABLE SPW_CMS_PAGE_HISTORY (
    PAGE_ID                  VARCHAR2(100)  NOT NULL,
    VERSION                  NUMBER         NOT NULL,
    PAGE_NAME                VARCHAR2(200),
    OWNER_DEPT_CODE          VARCHAR2(50),
    FILE_PATH                VARCHAR2(500),
    CREATE_USER_ID           VARCHAR2(100),
    CREATE_USER_NAME         VARCHAR2(200),
    LAST_MODIFIER_ID         VARCHAR2(100),
    LAST_MODIFIER_NAME       VARCHAR2(200),
    APPROVER_ID              VARCHAR2(100),
    APPROVER_NAME            VARCHAR2(200),
    CREATE_DATE              TIMESTAMP,
    CONFIRM_DTIME            TIMESTAMP,
    BEGINNING_DATE           DATE,
    EXPIRED_DATE             DATE,
    APPROVE_STATE            VARCHAR2(20),
    LAST_MODIFIED_DTIME      TIMESTAMP,
    PAGE_DESC                CLOB,
    PAGE_DESC_DETAIL         CLOB,
    TEMPLATE_ID              VARCHAR2(100),
    THUMBNAIL                VARCHAR2(500),
    TARGET_CD                VARCHAR2(50),
    USER_GUIDE               CLOB,
    FILE_PATH_BACK           VARCHAR2(500),
    REJECTED_REASON          CLOB,
    USE_YN                   CHAR(1),
    IS_PUBLIC                CHAR(1),
    APPROVE_DATE             TIMESTAMP,
    FILE_CRC_VALUE           VARCHAR2(64),
    FINAL_APPROVAL_STATE     VARCHAR2(20),
    FINAL_APPROVAL_USER_ID   VARCHAR2(100),
    FINAL_APPROVAL_USER_NAME VARCHAR2(200),
    VIEW_MODE                VARCHAR2(20)   DEFAULT 'mobile' NOT NULL,
    FINAL_APPROVAL_DTIME     TIMESTAMP,
    CONSTRAINT PK_SPW_CMS_PAGE_HISTORY     PRIMARY KEY (PAGE_ID, VERSION),
    CONSTRAINT FK_SPW_PAGE_HIST_PAGE       FOREIGN KEY (PAGE_ID)
        REFERENCES SPW_CMS_PAGE (PAGE_ID),
    CONSTRAINT CHK_SPW_HIST_APPROVE_STATE  CHECK (APPROVE_STATE IN ('WORK','PENDING','APPROVED','REJECTED')),
    CONSTRAINT CHK_SPW_HIST_VIEW_MODE      CHECK (VIEW_MODE IN ('mobile','web','responsive')),
    CONSTRAINT CHK_SPW_HIST_USE_YN         CHECK (USE_YN IN ('Y','N')),
    CONSTRAINT CHK_SPW_HIST_IS_PUBLIC      CHECK (IS_PUBLIC IN ('Y','N'))
);

COMMENT ON TABLE  SPW_CMS_PAGE_HISTORY                      IS 'CMS 페이지 승인 이력 — 승인 시에만 버전 INSERT [Springware CMS 신규]';
COMMENT ON COLUMN SPW_CMS_PAGE_HISTORY.VERSION              IS '승인 버전 번호 (승인 시마다 +1)';
COMMENT ON COLUMN SPW_CMS_PAGE_HISTORY.FILE_PATH            IS '승인 시점의 페이지 HTML 파일 경로 스냅샷';
COMMENT ON COLUMN SPW_CMS_PAGE_HISTORY.VIEW_MODE            IS '뷰 모드 (mobile / web / responsive)';
COMMENT ON COLUMN SPW_CMS_PAGE_HISTORY.FINAL_APPROVAL_DTIME IS '최종 승인 시간';


-- ──────────────────────────────────────────────────────────────────────────
-- 2-2. SPW_CMS_COMP_PAGE_MAP — 페이지-컴포넌트 매핑
--      PK: (PAGE_ID, VERSION, SORT_ORDER) — 이슈 #80에서 SEQ 기반 → VERSION 기반 변경
--      FK: PAGE_HISTORY(PAGE_ID, VERSION) 참조
-- ──────────────────────────────────────────────────────────────────────────
CREATE TABLE SPW_CMS_COMP_PAGE_MAP (
    PAGE_ID             VARCHAR2(100)  NOT NULL,
    VERSION             NUMBER         NOT NULL,
    SORT_ORDER          NUMBER         DEFAULT 0 NOT NULL,
    COMPONENT_ID        VARCHAR2(100)  NOT NULL,
    LAST_MODIFIER_ID    VARCHAR2(100),
    LAST_MODIFIED_DTIME TIMESTAMP      DEFAULT SYSTIMESTAMP,
    CONSTRAINT PK_SPW_CMS_COMP_PAGE_MAP PRIMARY KEY (PAGE_ID, VERSION, SORT_ORDER),
    CONSTRAINT FK_SPW_COMP_MAP_HIST     FOREIGN KEY (PAGE_ID, VERSION)
        REFERENCES SPW_CMS_PAGE_HISTORY (PAGE_ID, VERSION),
    CONSTRAINT FK_SPW_COMP_MAP_COMP     FOREIGN KEY (COMPONENT_ID)
        REFERENCES SPW_CMS_COMPONENT (COMPONENT_ID),
    CONSTRAINT CHK_SPW_MAP_SORT         CHECK (SORT_ORDER >= 0)
);

COMMENT ON TABLE  SPW_CMS_COMP_PAGE_MAP                    IS '페이지-컴포넌트 매핑 — 버전별 배치 이력 관리 [Springware CMS]';
COMMENT ON COLUMN SPW_CMS_COMP_PAGE_MAP.VERSION            IS '페이지 버전 (PAGE_HISTORY와 동일)';
COMMENT ON COLUMN SPW_CMS_COMP_PAGE_MAP.SORT_ORDER         IS '페이지 내 컴포넌트 배치 순서';


-- ════════════════════════════════════════════════════════════════════════════
-- [SECTION 3] 인덱스
-- ════════════════════════════════════════════════════════════════════════════

-- PAGE 인덱스
CREATE INDEX IDX_SPW_PAGE_CREATOR_STATE
    ON SPW_CMS_PAGE (CREATE_USER_ID, APPROVE_STATE);

CREATE INDEX IDX_SPW_PAGE_EXPIRY
    ON SPW_CMS_PAGE (EXPIRED_DATE, IS_PUBLIC, USE_YN);

-- COMPONENT 인덱스
CREATE INDEX IDX_SPW_COMP_TYPE_VIEW
    ON SPW_CMS_COMPONENT (COMPONENT_TYPE, VIEW_MODE, USE_YN);

-- PAGE_HISTORY 인덱스
CREATE INDEX IDX_SPW_PAGE_HIST_VER
    ON SPW_CMS_PAGE_HISTORY (PAGE_ID, VERSION DESC);

CREATE INDEX IDX_SPW_HIST_STATE
    ON SPW_CMS_PAGE_HISTORY (PAGE_ID, APPROVE_STATE);


-- ════════════════════════════════════════════════════════════════════════════
-- [SECTION 4] 검증 쿼리
-- ════════════════════════════════════════════════════════════════════════════

SELECT table_name FROM user_tables
WHERE table_name LIKE 'SPW_CMS_%'
ORDER BY table_name;

SELECT index_name, table_name
FROM user_indexes
WHERE table_name LIKE 'SPW_CMS_%'
ORDER BY table_name;
