/**
 * @file types.ts
 * @description react-cms DB 타입 정의.
 * SPW_CMS_PAGE 테이블 컬럼과 1:1 대응합니다.
 *
 * react-cms에서는 PAGE_HTML 컬럼에 JSON 문자열을 저장합니다.
 * (기존 테이블 구조 변경 없이 재편집용 JSON을 보존)
 */

export type ApproveState = 'WORK' | 'PENDING' | 'APPROVED' | 'REJECTED';
export type ViewMode = 'PC' | 'MOBILE' | 'RESPONSIVE';

/** SPW_CMS_PAGE 레코드 (실제 테이블 컬럼 기준) */
export interface CmsPage {
  PAGE_ID:             string;
  PAGE_NAME:           string;
  /** CMS 빌더 직렬화 JSON — 재편집용 */
  PAGE_HTML:           string | null;
  /** 생성된 React JSX 코드 */
  PAGE_DESC:           string | null;
  PAGE_TYPE:           string;
  VIEW_MODE:           ViewMode;
  APPROVE_STATE:       ApproveState;
  USE_YN:              'Y' | 'N';
  IS_PUBLIC:           'Y' | 'N';
  CREATE_USER_ID:      string | null;
  CREATE_USER_NAME:    string | null;
  LAST_MODIFIER_ID:    string | null;
  LAST_MODIFIER_NAME:  string | null;
  CREATE_DATE:         Date | null;
  LAST_MODIFIED_DTIME: Date | null;
}
