/**
 * @file types.ts
 * @description KB국민은행 홈 화면에서 사용하는 TypeScript 타입 정의.
 *
 * 서버 API 응답 타입(Raw, snake_case)과 클라이언트 모델(camelCase)을 분리한다.
 * API 응답 구조가 바뀌어도 repository.ts만 수정하면 hook.ts·page.tsx는 변경 불필요.
 */

// ── 공통 ────────────────────────────────────────────────────────────────

/**
 * 공지 카테고리 — repository에서 iconBgClassName 변환에 사용.
 * - housing:     주택·청약 관련 공지
 * - promotion:   금리 우대·이벤트 혜택
 * - maintenance: 서비스 점검·운영 공지
 */
export type KbHomeNoticeCategory = 'housing' | 'promotion' | 'maintenance';

// ── 서버 API 응답 타입 (snake_case) ─────────────────────────────────────

/** 계좌 요약 API 응답 단일 항목 */
export interface KbHomeAccountApiResponse {
  account_name:   string;
  account_number: string;
  balance:        number;
  badge_text:     string;
  /** AccountSummaryCard 의 type prop 에 매핑 */
  account_type:   'deposit' | 'savings' | 'loan';
}

/** 공지·혜택 API 응답 단일 항목 */
export interface KbHomeNoticeApiItem {
  id:          string;
  /** 카테고리에 따라 repository 가 iconBgClassName 을 결정한다 */
  category:    KbHomeNoticeCategory;
  title:       string;
  description: string;
}

/** 홈 이벤트 배너 API 응답 */
export interface KbHomeBannerApiResponse {
  title:    string;
  subtitle: string;
}

// ── 클라이언트 모델 (camelCase) ──────────────────────────────────────────

/** AccountSummaryCard 에 전달할 계좌 요약 클라이언트 모델 */
export interface KbHomeAccountInfo {
  accountName:   string;
  accountNumber: string;
  balance:       number;
  badgeText:     string;
  /** AccountSummaryCard 의 type prop 에 직접 전달 */
  type:          'deposit' | 'savings' | 'loan';
}

/**
 * 공지·혜택 목록 아이템 클라이언트 모델.
 * iconBgClassName 은 repository 에서 category → Tailwind 클래스로 변환한다.
 * 실제 아이콘(ReactNode)은 UI 관심사이므로 page 에서 category 를 기준으로 결정한다.
 */
export interface KbHomeNoticeItem {
  id:              string;
  category:        KbHomeNoticeCategory;
  title:           string;
  description:     string;
  /** Tailwind 클래스 문자열 (예: 'bg-success-subtle text-success-text') */
  iconBgClassName: string;
}

/** 이벤트 배너 클라이언트 모델 */
export interface KbHomeBannerInfo {
  title:    string;
  subtitle: string;
}
