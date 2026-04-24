// ============================================================================
// FWK_CMS_SERVER_INSTANCE — 서버 인스턴스 SQL 맵퍼 (AS-IS 참조)
// ============================================================================

/** 서버 인스턴스 단건 조회 */
export const SERVER_SELECT_BY_ID = `
  SELECT *
  FROM FWK_CMS_SERVER_INSTANCE
  WHERE INSTANCE_ID = :instanceId
`;

/** 서버 인스턴스 목록 조회 */
export const SERVER_SELECT_LIST = `
  SELECT *
  FROM FWK_CMS_SERVER_INSTANCE
  WHERE (:aliveYn IS NULL OR ALIVE_YN = :aliveYn)
  ORDER BY INSTANCE_NAME
`;

/** 서버 인스턴스 등록 */
export const SERVER_INSERT = `
  INSERT INTO FWK_CMS_SERVER_INSTANCE (
    INSTANCE_ID, INSTANCE_NAME, INSTANCE_DESC,
    INSTANCE_IP, INSTANCE_PORT, SERVER_TYPE,
    ALIVE_YN, LAST_MODIFIER_ID
  ) VALUES (
    :instanceId, :instanceName, :instanceDesc,
    :instanceIp, :instancePort, :serverType,
    'Y', :lastModifierId
  )
`;

/** 서버 상태 갱신 (생존 확인) */
export const SERVER_UPDATE_STATUS = `
  UPDATE FWK_CMS_SERVER_INSTANCE
  SET ALIVE_YN = :aliveYn,
      LAST_ALIVE_CHECK_DTIME = SYSTIMESTAMP,
      LAST_MODIFIER_ID = :lastModifierId
  WHERE INSTANCE_ID = :instanceId
`;
