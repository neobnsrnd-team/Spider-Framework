/**
 * @file repository.ts
 * @description KB국민은행 홈 화면 API 호출·데이터 가공·모델 변환 담당.
 *
 * 서버 응답(snake_case)을 클라이언트 모델(camelCase)로 변환한다.
 * API 응답 구조가 바뀌어도 이 파일만 수정하면 hook·page는 변경하지 않아도 된다.
 *
 * @example
 * const account = await kbHomeRepository.getAccountSummary();
 * const notices = await kbHomeRepository.getNoticeList();
 * const banner  = await kbHomeRepository.getBannerInfo();
 */

import type {
  KbHomeAccountApiResponse,
  KbHomeNoticeApiItem,
  KbHomeBannerApiResponse,
  KbHomeNoticeCategory,
  KbHomeAccountInfo,
  KbHomeNoticeItem,
  KbHomeBannerInfo,
} from './types';

// ── 카테고리 → iconBgClassName 매핑 ─────────────────────────────────────
// NoticeItem 컴포넌트에 전달할 아이콘 배경 스타일을 category 기준으로 결정한다.
// 아이콘 자체(ReactNode)는 UI 관심사이므로 page 에서 처리한다 (rules/03-component.md).
const CATEGORY_ICON_BG: Record<KbHomeNoticeCategory, string> = {
  housing:     'bg-success-subtle text-success-text', // 주택·청약 — 초록 계열
  promotion:   'bg-brand-5 text-brand-text',          // 혜택·이벤트 — 브랜드 색
  maintenance: 'bg-warning-subtle text-warning-text', // 점검·공지 — 경고 색
};

// ── 목업 데이터 (Figma node-id: 1-202 기반) ─────────────────────────────
// 실제 API 연동 시 아래 MOCK_* 상수와 setTimeout 블록을 제거하고
// axios.get('/api/...') 호출로 교체한다.

const MOCK_ACCOUNT: KbHomeAccountApiResponse = {
  account_name:   'KB 주거래 통장',
  account_number: '123-456789-01207',
  balance:        2500000,
  badge_text:     '주거래',
  account_type:   'deposit',
};

const MOCK_NOTICES: KbHomeNoticeApiItem[] = [
  {
    id:          'notice-1',
    category:    'housing',
    title:       '주택청약 종합저축 안내',
    description: '내 집 마련의 첫걸음을 시작하세요',
  },
  {
    id:          'notice-2',
    category:    'promotion',
    title:       '금리 우대 적금 홍보',
    description: '최대 연 4.5% 우대금리 이벤트 진행 중',
  },
  {
    id:          'notice-3',
    category:    'maintenance',
    title:       '서비스 점검 공지사항',
    description: '2026.04.01 02:00~04:00 일부 서비스 중단',
  },
];

const MOCK_BANNER: KbHomeBannerApiResponse = {
  title:    '이벤트 확인하기',
  subtitle: '참여하면 100% 당첨!',
};

// ── 서버 → 클라이언트 모델 변환 함수 ────────────────────────────────────

function toAccountInfo(raw: KbHomeAccountApiResponse): KbHomeAccountInfo {
  return {
    accountName:   raw.account_name,
    accountNumber: raw.account_number,
    balance:       raw.balance,
    badgeText:     raw.badge_text,
    type:          raw.account_type,
  };
}

function toNoticeItem(raw: KbHomeNoticeApiItem): KbHomeNoticeItem {
  return {
    id:              raw.id,
    category:        raw.category,
    title:           raw.title,
    description:     raw.description,
    iconBgClassName: CATEGORY_ICON_BG[raw.category],
  };
}

function toBannerInfo(raw: KbHomeBannerApiResponse): KbHomeBannerInfo {
  return {
    title:    raw.title,
    subtitle: raw.subtitle,
  };
}

// ── Repository ────────────────────────────────────────────────────────

export const kbHomeRepository = {
  /**
   * 주 계좌 요약 정보를 조회한다.
   * @returns 계좌 요약 클라이언트 모델
   * @throws Error 네트워크 오류 또는 서버 에러 시
   */
  getAccountSummary: async (): Promise<KbHomeAccountInfo> => {
    // 네트워크 지연 시뮬레이션 — 실제 API 연동 시 axios.get('/api/accounts/main')으로 교체
    await new Promise(resolve => setTimeout(resolve, 300));
    return toAccountInfo(MOCK_ACCOUNT);
  },

  /**
   * 공지·혜택 목록을 조회한다.
   * @returns 공지 항목 클라이언트 모델 배열 (iconBgClassName 포함)
   * @throws Error 네트워크 오류 또는 서버 에러 시
   */
  getNoticeList: async (): Promise<KbHomeNoticeItem[]> => {
    // 네트워크 지연 시뮬레이션 — 실제 API 연동 시 axios.get('/api/notices')으로 교체
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_NOTICES.map(toNoticeItem);
  },

  /**
   * 홈 이벤트 배너 정보를 조회한다.
   * @returns 배너 클라이언트 모델
   * @throws Error 네트워크 오류 또는 서버 에러 시
   */
  getBannerInfo: async (): Promise<KbHomeBannerInfo> => {
    // 네트워크 지연 시뮬레이션 — 실제 API 연동 시 axios.get('/api/banners/home')으로 교체
    await new Promise(resolve => setTimeout(resolve, 300));
    return toBannerInfo(MOCK_BANNER);
  },
};
