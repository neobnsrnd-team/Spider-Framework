-- =============================================================
-- Spider-Admin Oracle DDL — FWK_PROPERTY 배포 관리 컬럼 추가
-- =============================================================
-- 생성일: 2026-04-14
-- 01_create_tables.sql ~ 03_insert_initial_data.sql 실행 후 실행
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

COMMIT;
