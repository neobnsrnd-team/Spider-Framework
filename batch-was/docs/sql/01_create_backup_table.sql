-- =============================================================
-- POC_카드사용내역_백업 테이블 DDL
-- DB2DBJob(db2db)이 POC_카드사용내역 → 이 테이블로 아카이브한다.
-- 최초 실행 전 DB에서 수동 실행할 것
-- =============================================================

CREATE TABLE POC_카드사용내역_백업 (
    이용자          VARCHAR2(20)   NOT NULL,
    카드번호        VARCHAR2(20)   NOT NULL,
    이용일자        VARCHAR2(8)    NOT NULL,
    이용가맹점      VARCHAR2(100),
    이용금액        NUMBER(15),
    할부개월        NUMBER(3),
    승인여부        VARCHAR2(1),
    카드명          VARCHAR2(100),
    승인시각        VARCHAR2(6)    NOT NULL,
    결제예정일      VARCHAR2(6),
    승인번호        VARCHAR2(20),
    결제잔액        NUMBER(15),
    누적결제금액    NUMBER(15),
    결제상태코드    VARCHAR2(1),
    최종결제일자    VARCHAR2(8),
    -- 제약명은 ASCII로 작성 (한글 포함 시 30바이트 초과로 ORA-00972 발생)
    CONSTRAINT PK_POC_CARD_USAGE_BAK
        PRIMARY KEY (이용자, 카드번호, 이용일자, 승인시각)
);

COMMIT;