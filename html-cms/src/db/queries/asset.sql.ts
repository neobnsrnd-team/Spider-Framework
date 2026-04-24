// ============================================================================
// SPW_CMS_ASSET — 에셋(이미지) 테이블 SQL 맵퍼
// ============================================================================

/** 에셋 단건 조회 */
export const ASSET_SELECT_BY_ID = `
  SELECT ASSET_ID, ASSET_NAME, BUSINESS_CATEGORY, MIME_TYPE, FILE_SIZE,
         ASSET_PATH, ASSET_URL, ASSET_DESC, ASSET_STATE, USE_YN,
         CREATE_USER_ID, CREATE_USER_NAME,
         LAST_MODIFIER_ID, LAST_MODIFIER_NAME,
         CREATE_DATE, LAST_MODIFIED_DTIME
  FROM SPW_CMS_ASSET
  WHERE ASSET_ID = :assetId
    AND USE_YN = 'Y'
`;

/**
 * 에셋 목록 조회 (카테고리 필터, BLOB 제외, 페이지네이션 — Oracle 11g 호환)
 * USE_YN='Y' 고정: cms-admin 에서 "숨김" 처리된 자산(USE_YN='N')은 /cms/files 에 노출되지 않는다.
 */
export const ASSET_SELECT_LIST = `
  SELECT * FROM (
    SELECT A.*, ROWNUM AS RN FROM (
      SELECT ASSET_ID, ASSET_NAME, BUSINESS_CATEGORY, MIME_TYPE, FILE_SIZE,
             ASSET_PATH, ASSET_URL, ASSET_DESC, ASSET_STATE, USE_YN,
             CREATE_USER_ID, CREATE_USER_NAME,
             LAST_MODIFIER_ID, LAST_MODIFIER_NAME,
             CREATE_DATE, LAST_MODIFIED_DTIME
      FROM SPW_CMS_ASSET
      WHERE USE_YN = 'Y'
        AND (:businessCategory IS NULL OR BUSINESS_CATEGORY = :businessCategory)
        AND (:assetState IS NULL OR ASSET_STATE = :assetState)
        AND (:search IS NULL OR LOWER(ASSET_NAME) LIKE '%' || LOWER(:search) || '%')
      ORDER BY CREATE_DATE DESC
    ) A
    WHERE ROWNUM <= :endRow
  )
  WHERE RN > :startRow
`;

/** 에셋 전체 건수 (페이지네이션용) — SELECT_LIST 와 동일한 USE_YN='Y' 필터 유지 */
export const ASSET_COUNT = `
  SELECT COUNT(*) AS TOTAL_COUNT
  FROM SPW_CMS_ASSET
  WHERE USE_YN = 'Y'
    AND (:businessCategory IS NULL OR BUSINESS_CATEGORY = :businessCategory)
    AND (:assetState IS NULL OR ASSET_STATE = :assetState)
    AND (:search IS NULL OR LOWER(ASSET_NAME) LIKE '%' || LOWER(:search) || '%')
`;

/** 에셋 등록 */
export const ASSET_INSERT = `
  INSERT INTO SPW_CMS_ASSET (
    ASSET_ID, ASSET_NAME, BUSINESS_CATEGORY, MIME_TYPE, FILE_SIZE,
    ASSET_PATH, ASSET_URL, ASSET_DESC, ASSET_STATE, USE_YN,
    CREATE_USER_ID, CREATE_USER_NAME,
    LAST_MODIFIER_ID, LAST_MODIFIER_NAME
  ) VALUES (
    :assetId, :assetName, :businessCategory, :mimeType, :fileSize,
    :assetPath, :assetUrl, :assetDesc, NVL(:assetState, 'WORK'), 'Y',
    :createUserId, :createUserName,
    :lastModifierId, :lastModifierName
  )
`;

/** 에셋 승인 상태 변경 */
export const ASSET_UPDATE_STATE = `
  UPDATE SPW_CMS_ASSET
  SET ASSET_STATE = :assetState,
      LAST_MODIFIER_ID = :lastModifierId,
      LAST_MODIFIER_NAME = :lastModifierName,
      LAST_MODIFIED_DTIME = SYSTIMESTAMP
  WHERE ASSET_ID = :assetId
    AND USE_YN = 'Y'
`;

/** 에셋 파일 경로·URL 업데이트 (승인 후 파일 이동 시 사용) */
export const ASSET_UPDATE_PATH_URL = `
  UPDATE SPW_CMS_ASSET
  SET ASSET_PATH = :assetPath,
      ASSET_URL = :assetUrl,
      LAST_MODIFIER_ID = :lastModifierId,
      LAST_MODIFIER_NAME = :lastModifierName,
      LAST_MODIFIED_DTIME = SYSTIMESTAMP
  WHERE ASSET_ID = :assetId
    AND USE_YN = 'Y'
`;

/** 에셋 논리 삭제 (APPROVED 상태 전용 — 페이지 참조 보존) */
export const ASSET_DELETE = `
  UPDATE SPW_CMS_ASSET
  SET USE_YN = 'N',
      LAST_MODIFIER_ID = :lastModifierId,
      LAST_MODIFIER_NAME = :lastModifierName,
      LAST_MODIFIED_DTIME = SYSTIMESTAMP
  WHERE ASSET_ID = :assetId
`;

/** 에셋 물리 삭제 (WORK/PENDING/REJECTED 상태용) */
export const ASSET_HARD_DELETE = `
  DELETE FROM SPW_CMS_ASSET
  WHERE ASSET_ID = :assetId
`;

// ============================================================================
// SPW_CMS_ASSET_PAGE_MAP — 에셋-페이지 매핑 SQL 맵퍼
// ============================================================================

/** 페이지 버전별 에셋 매핑 조회 */
export const ASSET_MAP_SELECT_BY_PAGE = `
  SELECT M.PAGE_ID, M.VERSION, M.ASSET_ID,
         A.ASSET_NAME, A.MIME_TYPE, A.FILE_SIZE
  FROM SPW_CMS_ASSET_PAGE_MAP M
  JOIN SPW_CMS_ASSET A ON A.ASSET_ID = M.ASSET_ID AND A.USE_YN = 'Y'
  WHERE M.PAGE_ID = :pageId
    AND M.VERSION = :version
`;

/** 에셋-페이지 매핑 등록 (단건) */
export const ASSET_MAP_INSERT = `
  INSERT INTO SPW_CMS_ASSET_PAGE_MAP (PAGE_ID, VERSION, ASSET_ID)
  VALUES (:pageId, :version, :assetId)
`;

/** 에셋-페이지 매핑 삭제 (에셋 단위 — 에셋 물리 삭제 시 FK 정리용) */
export const ASSET_MAP_DELETE_BY_ASSET = `
  DELETE FROM SPW_CMS_ASSET_PAGE_MAP
  WHERE ASSET_ID = :assetId
`;

/** 에셋-페이지 매핑 삭제 (페이지+버전 단위) */
export const ASSET_MAP_DELETE_BY_PAGE_VERSION = `
  DELETE FROM SPW_CMS_ASSET_PAGE_MAP
  WHERE PAGE_ID = :pageId
    AND VERSION = :version
`;
