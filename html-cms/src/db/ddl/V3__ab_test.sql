-- ============================================================================
-- V3__ab_test.sql — SPW_CMS_PAGE A/B 테스트 컬럼 추가
-- ============================================================================
-- AB_GROUP_ID : 동일 그룹 내 페이지들을 묶는 식별자 (NULL = 단독 페이지)
-- AB_WEIGHT   : 노출 가중치 (예: 7이면 총합 대비 7 비율로 노출), NULL = 그룹 미참여

ALTER TABLE SPW_CMS_PAGE ADD (
    AB_GROUP_ID VARCHAR2(64)  DEFAULT NULL,
    AB_WEIGHT   NUMBER(5, 2)  DEFAULT NULL
);

COMMENT ON COLUMN SPW_CMS_PAGE.AB_GROUP_ID IS 'A/B 테스트 그룹 식별자 (동일 그룹 내 페이지 묶음)';
COMMENT ON COLUMN SPW_CMS_PAGE.AB_WEIGHT   IS 'A/B 테스트 노출 가중치 (Weighted Random Selection 기반)';
