// src/lib/env.ts
// 서버 사이드 전용 — NEXT_PUBLIC_ prefix 없는 환경변수는 클라이언트 번들에 포함되지 않습니다.

/**
 * 필수 환경변수 반환
 * 값이 없으면 즉시 예외를 발생시킵니다. 서버 시작 시 조기 검증에 활용합니다.
 */
export function requireEnv(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`환경변수 ${key}가 설정되지 않았습니다.`);
    }
    return value;
}

/**
 * 선택 환경변수 반환
 * 값이 없으면 defaultValue를 반환합니다.
 */
export function optionalEnv(key: string, defaultValue = ''): string {
    return process.env[key] ?? defaultValue;
}

// ── AI 서비스 ──
export const OPENROUTER_API_KEY = optionalEnv('OPENROUTER_API_KEY');
export const OPENAI_API_KEY = optionalEnv('OPENAI_API_KEY');
export const FAL_API_KEY = optionalEnv('FAL_API_KEY');
export const GEMINI_API_KEY = optionalEnv('GEMINI_API_KEY');

// ── 서버 운영 모드 ──
// 'cms': 현업 관리자 서버 (:3000) — 이미지 업로드 가능
// 'operation': 현업 제작자 서버 (:3001) — 이미지 업로드 차단, 대고객 서빙
export const SERVER_MODE = optionalEnv('SERVER_MODE', 'cms');

// ── 에셋 저장소 ──
export const ASSET_UPLOAD_DIR = optionalEnv('ASSET_UPLOAD_DIR', 'public/uploads');
export const ASSET_BASE_URL = optionalEnv('ASSET_BASE_URL', '/uploads');

// ── 배포 저장소 (승인 완료 이미지) ──
export const DEPLOYED_UPLOAD_DIR = optionalEnv('DEPLOYED_UPLOAD_DIR', 'public/deployed');
export const DEPLOYED_BASE_URL = optionalEnv('DEPLOYED_BASE_URL', '/deployed/static');
/**
 * 승인 완료 이미지가 저장되는 서브 디렉토리명 (DEPLOYED_UPLOAD_DIR 아래)
 * - 승인 시 파일 복사 대상 경로 + 에디터 이미지 브라우저 루트로 사용됨
 * - 기본값 'img' (운영 /data/deployed/img, 로컬 public/deployed/img)
 * - 변경 시 Spider Admin·nginx 설정도 함께 맞춰야 함
 */
export const DEPLOYED_IMG_SUBDIR = optionalEnv('DEPLOYED_IMG_SUBDIR', 'img');

// ── 브랜드 테마 ──
export const BANK_BRAND = optionalEnv('BANK_BRAND', '');

// ── git 자동 커밋·푸시 ──
export const GIT_AUTO_COMMIT = optionalEnv('GIT_AUTO_COMMIT', 'false');
export const GIT_USER_NAME = optionalEnv('GIT_USER_NAME', 'Springware CMS');
export const GIT_USER_EMAIL = optionalEnv('GIT_USER_EMAIL', 'cms@springware.local');
export const GIT_BRANCH = optionalEnv('GIT_BRANCH', 'main');

// ── 배포 보안 ──
/** 서버간 배포 API 인증 토큰 (Spider Admin → CMS, CMS → 운영 서버) */
export const DEPLOY_SECRET = optionalEnv('DEPLOY_SECRET');

// ── 트래커 CORS ──
/** 배포 페이지에서 트래커 API 호출 시 허용할 오리진 (기본: * — 공개 수집 엔드포인트) */
export const TRACKER_CORS_ORIGIN = optionalEnv('TRACKER_CORS_ORIGIN', '*');

// ── Oracle DB ──
export const ORACLE_USER = optionalEnv('ORACLE_USER');
export const ORACLE_PASSWORD = optionalEnv('ORACLE_PASSWORD');
export const ORACLE_HOST = optionalEnv('ORACLE_HOST');
export const ORACLE_PORT = optionalEnv('ORACLE_PORT', '1521');
export const ORACLE_SERVICE = optionalEnv('ORACLE_SERVICE');
export const ORACLE_SCHEMA = optionalEnv('ORACLE_SCHEMA');
/** Oracle 커넥션 풀 최대 크기 (공유 XE 세션 제한 대응 — 기본 3) */
export const ORACLE_POOL_MAX = Number(optionalEnv('ORACLE_POOL_MAX', '3'));
