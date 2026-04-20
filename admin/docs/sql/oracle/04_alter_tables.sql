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

COMMIT;
