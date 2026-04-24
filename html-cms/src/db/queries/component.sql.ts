// ============================================================================
// SPW_CMS_COMPONENT — 컴포넌트 테이블 SQL 맵퍼
// ============================================================================

/** 컴포넌트 단건 조회 */
export const COMPONENT_SELECT_BY_ID = `
  SELECT *
  FROM SPW_CMS_COMPONENT
  WHERE COMPONENT_ID = :componentId
    AND USE_YN = 'Y'
`;

/** 컴포넌트 목록 조회 (유형 + 뷰모드 필터) */
export const COMPONENT_SELECT_LIST = `
  SELECT *
  FROM SPW_CMS_COMPONENT
  WHERE USE_YN = 'Y'
    AND (:componentType IS NULL OR COMPONENT_TYPE = :componentType)
    AND (:viewMode IS NULL OR VIEW_MODE = :viewMode)
  ORDER BY COMPONENT_TYPE, COMPONENT_ID
`;

/** 컴포넌트 등록 */
export const COMPONENT_INSERT = `
  INSERT INTO SPW_CMS_COMPONENT (
    COMPONENT_ID, COMPONENT_TYPE, VIEW_MODE,
    COMPONENT_THUMBNAIL, DATA,
    CREATE_USER_ID, CREATE_USER_NAME,
    LAST_MODIFIER_ID, USE_YN
  ) VALUES (
    :componentId, :componentType, :viewMode,
    :componentThumbnail, :data,
    :createUserId, :createUserName,
    :lastModifierId, 'Y'
  )
`;

/** 컴포넌트 수정 */
export const COMPONENT_UPDATE = `
  UPDATE SPW_CMS_COMPONENT
  SET COMPONENT_TYPE = :componentType,
      VIEW_MODE = :viewMode,
      COMPONENT_THUMBNAIL = :componentThumbnail,
      DATA = :data,
      LAST_MODIFIER_ID = :lastModifierId
  WHERE COMPONENT_ID = :componentId
    AND USE_YN = 'Y'
`;

/** 컴포넌트 논리 삭제 */
export const COMPONENT_DELETE = `
  UPDATE SPW_CMS_COMPONENT
  SET USE_YN = 'N',
      LAST_MODIFIER_ID = :lastModifierId
  WHERE COMPONENT_ID = :componentId
`;
