/**
 * @file types.ts
 * @description HomeDashboardPage에서 사용하는 TypeScript 타입 정의.
 * 홈 대시보드 화면의 계좌 요약, 공지, 배너 등 데이터 구조를 정의한다.
 */

/** 홈 탭 식별자 */
export type HomeDashboardTabId = 'mine' | 'other' | 'asset';

/** 하단 네비게이션 탭 식별자 */
export type BottomNavTabId = 'asset' | 'product' | 'home' | 'card' | 'chat';

/** 주계좌 요약 데이터 */
export interface MainAccountData {
  /** 계좌명 */
  accountName: string;
  /** 계좌번호 */
  accountNumber: string;
  /** 잔액 (숫자, 컴포넌트 내부에서 포맷) */
  balance: number;
  /** 배지 텍스트 (예: '주거래') */
  badgeText?: string;
}

/** 연결 서비스 배너 데이터 */
export interface ConnectionBannerData {
  /** 배너 제목 */
  title: string;
  /** 배너 설명 */
  description: string;
  /** 연결 버튼 레이블 */
  actionLabel: string;
}

/** 공지 항목 데이터 */
export interface NoticeData {
  /** 고유 식별자 */
  id: string;
  /** 공지 제목 */
  title: string;
  /** 공지 부제목 */
  description?: string;
  /** 아이콘 배경 색상 className */
  iconBgClassName?: string;
}

/** HomeDashboardPage 전체 데이터 */
export interface HomeDashboardData {
  /** 현재 사용자 이름 (인사말에 사용) */
  userName: string;
  /** 활성 탭 */
  activeTab: HomeDashboardTabId;
  /** 주계좌 요약 */
  mainAccount: MainAccountData;
  /** 연결 서비스 배너 */
  connectionBanner: ConnectionBannerData;
  /** 공지 및 혜택 목록 */
  notices: NoticeData[];
  /** 현재 활성 하단 탭 */
  activeBottomTab: BottomNavTabId;
}
