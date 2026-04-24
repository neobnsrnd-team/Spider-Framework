// ============================================================================
// FWK_BATCH_HIS — 배치 실행 이력 SQL 맵퍼
// spider-admin 프레임워크 테이블 — 배치 실행 결과 기록용
// ============================================================================

/** 배치 실행 이력 INSERT — 배치 시작 시 등록 (RES_RT_CODE: '0' = 시작)
 *  BATCH_EXECUTE_SEQ: 동일 BATCH_APP_ID + BATCH_DATE 내 최대값 + 1 자동 계산
 */
export const BATCH_HIS_INSERT = `
  INSERT INTO FWK_BATCH_HIS (
    BATCH_APP_ID,
    INSTANCE_ID,
    BATCH_DATE,
    BATCH_EXECUTE_SEQ,
    LOG_DTIME,
    RES_RT_CODE,
    LAST_UPDATE_USER_ID
  ) VALUES (
    :batchAppId,
    :instanceId,
    :batchDate,
    NVL(
      (SELECT MAX(BATCH_EXECUTE_SEQ) + 1
         FROM FWK_BATCH_HIS
        WHERE BATCH_APP_ID = :batchAppId
          AND BATCH_DATE   = :batchDate),
      1
    ),
    SYSTIMESTAMP,
    :resRtCode,
    :userId
  )
`;

/** 배치 실행 이력 UPDATE — 배치 완료/실패 시 결과 갱신
 *  RES_RT_CODE: '1' = 성공, '9' = 비정상 종료
 *  동일 BATCH_APP_ID + BATCH_DATE의 최신 SEQ 행을 대상으로 업데이트
 */
export const BATCH_HIS_UPDATE = `
  UPDATE FWK_BATCH_HIS
  SET RES_RT_CODE         = :resRtCode,
      BATCH_END_DTIME     = SYSTIMESTAMP,
      LAST_UPDATE_USER_ID = :userId,
      ERROR_CODE          = :errorCode,
      ERROR_REASON        = :errorReason,
      RECORD_COUNT        = :recordCount,
      EXECUTE_COUNT       = :executeCount,
      SUCCESS_COUNT       = :successCount,
      FAIL_COUNT          = :failCount
  WHERE BATCH_APP_ID    = :batchAppId
    AND BATCH_DATE      = :batchDate
    AND BATCH_EXECUTE_SEQ = (
      SELECT MAX(BATCH_EXECUTE_SEQ)
        FROM FWK_BATCH_HIS
       WHERE BATCH_APP_ID = :batchAppId
         AND BATCH_DATE   = :batchDate
    )
`;
