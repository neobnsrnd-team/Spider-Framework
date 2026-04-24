-- ============================================================================
-- V5: Asset 저장소 전환 — DB BLOB → 파일 시스템 + URL
-- ============================================================================
-- Phase 7.5: ASSET_DATA(BLOB) 컬럼 제거, ASSET_PATH·ASSET_URL 컬럼 추가
-- 기존 BLOB 데이터 없는 상태에서 실행 (마이그레이션 불필요)
-- ============================================================================

-- 1. BLOB 컬럼 제거
ALTER TABLE SPW_CMS_ASSET DROP COLUMN ASSET_DATA;

-- 2. 파일 경로·URL 컬럼 추가
ALTER TABLE SPW_CMS_ASSET ADD (
    ASSET_PATH VARCHAR2(500),
    ASSET_URL  VARCHAR2(500)
);

-- 3. 컬럼 코멘트
COMMENT ON COLUMN SPW_CMS_ASSET.ASSET_PATH IS '서버 파일 시스템 저장 경로';
COMMENT ON COLUMN SPW_CMS_ASSET.ASSET_URL  IS '클라이언트 접근 URL (서브도메인 또는 상대경로)';
