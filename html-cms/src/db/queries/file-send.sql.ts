// ============================================================================
// FWK_CMS_FILE_SEND_HIS — 파일 전송 이력 SQL 맵퍼 (AS-IS 참조)
// ============================================================================

/** 파일 전송 이력 단건 조회 */
export const FILE_SEND_SELECT_BY_ID = `
  SELECT *
  FROM FWK_CMS_FILE_SEND_HIS
  WHERE INSTANCE_ID = :instanceId
    AND FILE_ID = :fileId
`;

/** 파일 전송 이력 등록 */
export const FILE_SEND_INSERT = `
  INSERT INTO FWK_CMS_FILE_SEND_HIS (
    INSTANCE_ID, FILE_ID, FILE_SIZE, FILE_CRC_VALUE, LAST_MODIFIER_ID
  ) VALUES (
    :instanceId, :fileId, :fileSize, :fileCrcValue, :lastModifierId
  )
`;

/** 페이지별 전송 이력 목록 — FILE_ID가 '{pageId}_v' 로 시작하는 이력 조회 */
export const FILE_SEND_SELECT_BY_PAGE = `
  SELECT h.*, s.INSTANCE_NAME, s.INSTANCE_IP, s.INSTANCE_PORT
  FROM FWK_CMS_FILE_SEND_HIS h
  LEFT JOIN FWK_CMS_SERVER_INSTANCE s ON h.INSTANCE_ID = s.INSTANCE_ID
  WHERE h.FILE_ID LIKE :fileIdPrefix || '%' ESCAPE '\\'
  ORDER BY h.LAST_MODIFIED_DTIME DESC
`;

/** 인스턴스별 전송 이력 목록 */
export const FILE_SEND_SELECT_BY_INSTANCE = `
  SELECT *
  FROM FWK_CMS_FILE_SEND_HIS
  WHERE INSTANCE_ID = :instanceId
  ORDER BY LAST_MODIFIED_DTIME DESC
`;

/** 파일 전송 이력 UPSERT — 동일 (INSTANCE_ID, FILE_ID) 재배포 시 UPDATE, 신규 시 INSERT */
export const FILE_SEND_UPSERT = `
  MERGE INTO FWK_CMS_FILE_SEND_HIS tgt
  USING (
    SELECT :instanceId AS INSTANCE_ID, :fileId AS FILE_ID FROM DUAL
  ) src
  ON (tgt.INSTANCE_ID = src.INSTANCE_ID AND tgt.FILE_ID = src.FILE_ID)
  WHEN MATCHED THEN
    UPDATE SET
      FILE_SIZE           = :fileSize,
      FILE_CRC_VALUE      = :fileCrcValue,
      LAST_MODIFIED_DTIME = TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS'),
      LAST_MODIFIER_ID    = :lastModifierId
  WHEN NOT MATCHED THEN
    INSERT (INSTANCE_ID, FILE_ID, FILE_SIZE, FILE_CRC_VALUE, LAST_MODIFIED_DTIME, LAST_MODIFIER_ID)
    VALUES (:instanceId, :fileId, :fileSize, :fileCrcValue, TO_CHAR(SYSDATE, 'YYYYMMDDHH24MISS'), :lastModifierId)
`;
