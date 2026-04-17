-- =============================================================
-- batch-was 샘플 Job용 테이블 DDL
-- File2DBJob, DB2DBJob, DB2ForeignJob 시연에 사용
-- =============================================================

-- File2DBJob / DB2ForeignJob 읽기 소스 & File2DBJob 적재 타겟
CREATE TABLE SAMPLE_MEMBER (
    MEMBER_ID    NUMBER(10)    NOT NULL,
    MEMBER_NAME  VARCHAR2(50),
    EMAIL        VARCHAR2(100),
    PHONE        VARCHAR2(20),
    CONSTRAINT PK_SAMPLE_MEMBER PRIMARY KEY (MEMBER_ID)
);

-- DB2DBJob 복사 타겟
CREATE TABLE SAMPLE_MEMBER_BACKUP (
    MEMBER_ID    NUMBER(10)    NOT NULL,
    MEMBER_NAME  VARCHAR2(50),
    EMAIL        VARCHAR2(100),
    PHONE        VARCHAR2(20),
    CONSTRAINT PK_SAMPLE_MEMBER_BACKUP PRIMARY KEY (MEMBER_ID)
);
