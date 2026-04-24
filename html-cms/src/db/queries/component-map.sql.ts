// ============================================================================
// SPW_CMS_COMP_PAGE_MAP — 컴포넌트-페이지 매핑 SQL 맵퍼
// ============================================================================
// W-2 해결: SEQ 기반 → VERSION 기반 전면 재작성
// PK: (PAGE_ID, VERSION, SORT_ORDER)
// FK: (PAGE_ID, VERSION) → SPW_CMS_PAGE_HISTORY

/** 페이지+버전의 컴포넌트 매핑 목록 (정렬순, 컴포넌트 정보 JOIN) */
export const COMP_MAP_SELECT_BY_PAGE = `
  SELECT m.PAGE_ID, m.VERSION, m.SORT_ORDER, m.COMPONENT_ID,
         m.LAST_MODIFIER_ID, m.LAST_MODIFIED_DTIME,
         c.COMPONENT_TYPE, c.VIEW_MODE, c.COMPONENT_THUMBNAIL
  FROM SPW_CMS_COMP_PAGE_MAP m
  JOIN SPW_CMS_COMPONENT c ON m.COMPONENT_ID = c.COMPONENT_ID
  WHERE m.PAGE_ID = :pageId AND m.VERSION = :version
  ORDER BY m.SORT_ORDER
`;

/** 매핑 추가 (PK: PAGE_ID + VERSION + SORT_ORDER) */
export const COMP_MAP_INSERT = `
  INSERT INTO SPW_CMS_COMP_PAGE_MAP (
    PAGE_ID, VERSION, SORT_ORDER, COMPONENT_ID, LAST_MODIFIER_ID
  ) VALUES (
    :pageId, :version, :sortOrder, :componentId, :lastModifierId
  )
`;

/** 특정 매핑 삭제 (복합 PK 기반) */
export const COMP_MAP_DELETE = `
  DELETE FROM SPW_CMS_COMP_PAGE_MAP
  WHERE PAGE_ID = :pageId AND VERSION = :version AND SORT_ORDER = :sortOrder
`;

/** 페이지+버전의 모든 매핑 삭제 (승인 시 전체 재생성 패턴) */
export const COMP_MAP_DELETE_BY_PAGE_VERSION = `
  DELETE FROM SPW_CMS_COMP_PAGE_MAP
  WHERE PAGE_ID = :pageId AND VERSION = :version
`;
