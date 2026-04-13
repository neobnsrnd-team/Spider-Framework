/**
 * @file useHomeDashboard.ts
 * @description 홈 대시보드 화면의 데이터 패칭·상태 관리 Hook.
 *
 * 역할 분리 원칙(rules/04-state-data.md):
 * - 데이터 패칭·가공은 이 Hook 안에서만 처리한다.
 * - Page는 이 Hook에서 반환하는 값과 핸들러만 사용한다.
 *
 * 이벤트 핸들러 네이밍(rules/06-event.md):
 * - Hook 내부 정의: handle~
 * - props로 전달할 때: on~ (컴포넌트 측에서 처리)
 */
import { useState, useCallback } from 'react';
import type {
  HomeDashboardData,
  HomeDashboardTabId,
  BottomNavTabId,
} from './types';

/* ── 목업 데이터 ──────────────────────────────────────────────
 * 실제 환경에서는 homeDashboardRepository.ts로 분리하여 API 호출.
 * 현재는 Figma 디자인 기준 정적 데이터로 대체.
 */
const MOCK_DATA: HomeDashboardData = {
  userName: '홍길동',
  activeTab: 'mine',
  mainAccount: {
    accountName: '하나 급여통장',
    accountNumber: '123-456789-01234',
    balance: 2500000,
    badgeText: '주거래',
  },
  connectionBanner: {
    title: '다른 은행 계좌 연결',
    description: '다른 은행 자산을 한 곳에서 관리해보세요',
    actionLabel: '연결하기',
  },
  notices: [
    {
      id: 'notice-1',
      title: '주택청약 종합저축 안내',
      description: '내 집 마련의 첫걸음을 시작하세요',
      iconBgClassName: 'bg-brand-5 text-brand-text',
    },
    {
      id: 'notice-2',
      title: '하나 체크카드 혜택 안내',
      description: '이달의 추천 혜택을 확인하세요',
      iconBgClassName: 'bg-[#ecfdf5] text-success-text',
    },
    {
      id: 'notice-3',
      title: '금융 소식 및 이벤트',
      description: '최신 금융 뉴스를 확인하세요',
    },
  ],
  activeBottomTab: 'home',
};

export function useHomeDashboard() {
  const [activeTab, setActiveTab] = useState<HomeDashboardTabId>(
    MOCK_DATA.activeTab,
  );
  const [activeBottomTab, setActiveBottomTab] = useState<BottomNavTabId>(
    MOCK_DATA.activeBottomTab,
  );

  /** 상단 탭 전환 핸들러 */
  const handleTabChange = useCallback((id: string) => {
    setActiveTab(id as HomeDashboardTabId);
  }, []);

  /** 하단 네비게이션 탭 전환 핸들러 */
  const handleBottomNavChange = useCallback((id: string) => {
    setActiveBottomTab(id as BottomNavTabId);
  }, []);

  /** 이체 버튼 핸들러 */
  const handleTransfer = useCallback(() => {
    /* TODO: 이체 페이지로 라우팅 */
    console.log('[HomeDashboard] 이체 클릭');
  }, []);

  /** ATM 출금 버튼 핸들러 */
  const handleAtmWithdraw = useCallback(() => {
    /* TODO: ATM 출금 페이지로 라우팅 */
    console.log('[HomeDashboard] ATM 출금 클릭');
  }, []);

  /** 전계좌조회 퀵메뉴 핸들러 */
  const handleAllAccounts = useCallback(() => {
    /* TODO: 전계좌조회 페이지로 라우팅 */
    console.log('[HomeDashboard] 전계좌조회 클릭');
  }, []);

  /** 이체 퀵메뉴 핸들러 */
  const handleQuickTransfer = useCallback(() => {
    /* TODO: 이체 페이지로 라우팅 */
    console.log('[HomeDashboard] 퀵 이체 클릭');
  }, []);

  /** 내역조회 퀵메뉴 핸들러 */
  const handleHistory = useCallback(() => {
    /* TODO: 거래내역 페이지로 라우팅 */
    console.log('[HomeDashboard] 내역조회 클릭');
  }, []);

  /** 배너 연결 버튼 핸들러 */
  const handleConnectionBanner = useCallback(() => {
    /* TODO: 타행 연결 페이지로 라우팅 */
    console.log('[HomeDashboard] 연결하기 클릭');
  }, []);

  /** 공지 항목 클릭 핸들러 */
  const handleNoticeClick = useCallback((id: string) => {
    /* TODO: 공지 상세 페이지로 라우팅 */
    console.log('[HomeDashboard] 공지 클릭:', id);
  }, []);

  /** 알림 버튼 핸들러 */
  const handleNotification = useCallback(() => {
    /* TODO: 알림 페이지로 라우팅 */
    console.log('[HomeDashboard] 알림 클릭');
  }, []);

  return {
    data: MOCK_DATA,
    activeTab,
    activeBottomTab,
    handleTabChange,
    handleBottomNavChange,
    handleTransfer,
    handleAtmWithdraw,
    handleAllAccounts,
    handleQuickTransfer,
    handleHistory,
    handleConnectionBanner,
    handleNoticeClick,
    handleNotification,
  };
}
