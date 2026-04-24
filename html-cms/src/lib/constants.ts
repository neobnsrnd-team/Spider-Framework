// src/lib/constants.ts

// ── 비즈니스 기본값 ──

/** 기본 은행 ID — bank 파라미터 미지정 시 폴백으로 사용 */
export const DEFAULT_BANK_ID = 'ibk';

/** 기본 뷰 모드 — viewMode 미지정 시 폴백으로 사용 */
export const DEFAULT_VIEW_MODE = 'mobile' as const;

// ── AI 설정 ──

/** OpenRouter 콘텐츠 생성 기본 모델 */
export const AI_DEFAULT_MODEL = 'openai/gpt-4o-mini';

/** Function Calling 고정 모델 (tool use 지원 필수) */
export const AI_FUNCTION_CALLING_MODEL = 'anthropic/claude-3.5-sonnet';

/** AI 요청 기본 temperature */
export const AI_DEFAULT_TEMPERATURE = 0.6;

/** AI 요청 기본 top_p */
export const AI_DEFAULT_TOP_P = 0.9;

// ── 파일 관리 ──

/** 파일 목록 페이지당 항목 수 */
export const PAGE_SIZE = 10;

/** 최대 업로드 파일 크기 (100MB) */
export const MAX_UPLOAD_SIZE = 100 * 1024 * 1024;
