// ============================================================================
// SPW_CMS_PAGE_VIEW_LOG — 페이지 조회/클릭 로그 SQL 맵퍼
// ============================================================================

/** 로그 INSERT (LOG_ID는 트리거가 시퀀스에서 자동 채번) */
export const VIEW_LOG_INSERT = `
  INSERT INTO SPW_CMS_PAGE_VIEW_LOG (
    PAGE_ID, COMPONENT_ID, EVENT_TYPE
  ) VALUES (
    :pageId, :componentId, :eventType
  )
`;

/** 페이지별 VIEW 건수 조회 */
export const VIEW_LOG_COUNT_BY_PAGE = `
  SELECT COUNT(*) AS VIEW_COUNT
  FROM SPW_CMS_PAGE_VIEW_LOG
  WHERE PAGE_ID = :pageId
    AND EVENT_TYPE = 'VIEW'
`;

/** 페이지별 컴포넌트 CLICK 집계 (클릭수 내림차순) */
export const VIEW_LOG_COUNT_BY_COMPONENT = `
  SELECT COMPONENT_ID, COUNT(*) AS CLICK_COUNT
  FROM SPW_CMS_PAGE_VIEW_LOG
  WHERE PAGE_ID = :pageId
    AND EVENT_TYPE = 'CLICK'
  GROUP BY COMPONENT_ID
  ORDER BY CLICK_COUNT DESC
`;

/** 페이지별 CLICK 총 건수 조회 */
export const VIEW_LOG_CLICK_COUNT_BY_PAGE = `
  SELECT COUNT(*) AS CLICK_COUNT
  FROM SPW_CMS_PAGE_VIEW_LOG
  WHERE PAGE_ID = :pageId
    AND EVENT_TYPE = 'CLICK'
`;

/** 페이지 목록 VIEW 건수 일괄 조회 — N+1 방지 */
export const VIEW_LOG_VIEW_COUNTS_BY_PAGES = (count: number): string => `
  SELECT PAGE_ID, COUNT(*) AS VIEW_COUNT
  FROM SPW_CMS_PAGE_VIEW_LOG
  WHERE PAGE_ID IN (${Array.from({ length: count }, (_, i) => `:pageId${i}`).join(', ')})
    AND EVENT_TYPE = 'VIEW'
  GROUP BY PAGE_ID
`;

/** 페이지 목록 CLICK 건수 일괄 조회 — N+1 방지 */
export const VIEW_LOG_CLICK_COUNTS_BY_PAGES = (count: number): string => `
  SELECT PAGE_ID, COUNT(*) AS CLICK_COUNT
  FROM SPW_CMS_PAGE_VIEW_LOG
  WHERE PAGE_ID IN (${Array.from({ length: count }, (_, i) => `:pageId${i}`).join(', ')})
    AND EVENT_TYPE = 'CLICK'
  GROUP BY PAGE_ID
`;
