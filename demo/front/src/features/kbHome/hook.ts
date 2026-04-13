/**
 * @file hook.ts
 * @description KB국민은행 홈 화면의 데이터 패칭·상태 관리 훅.
 *
 * 데모 앱에는 @tanstack/react-query가 설치되어 있지 않으므로
 * useEffect + useState 패턴으로 kbHomeRepository 를 호출한다.
 * 실제 서비스 연동 시: useQuery + kbHomeRepository 로 교체한다.
 *
 * Promise.all 로 계좌·공지·배너를 병렬 로드하여 초기 렌더링 지연을 최소화한다.
 *
 * @returns activeTab      - 현재 선택된 금융 구분 탭 ID ('mine' | 'other' | 'asset')
 * @returns handleTabChange - 탭 전환 핸들러 (TabNav onTabChange 에 전달)
 * @returns accountInfo    - 주 계좌 요약 데이터 (로딩 전 null)
 * @returns noticeItems    - 공지·혜택 목록 (iconBgClassName 포함)
 * @returns bannerInfo     - 이벤트 배너 데이터 (로딩 전 null)
 * @returns isLoading      - 초기 데이터 로딩 중 여부
 * @returns isError        - 하나 이상의 API 호출 실패 여부
 */
import { useState, useEffect, useCallback } from 'react';
import { kbHomeRepository } from './repository';
import type { KbHomeAccountInfo, KbHomeNoticeItem, KbHomeBannerInfo } from './types';

/** 금융 구분 탭 ID — TabNav items 의 id 값과 일치해야 한다 */
type KbHomeTabId = 'mine' | 'other' | 'asset';

export function useKbHome() {
  /* ── 탭 상태 (로컬 UI 상태) ─────────────────────────────────────────── */
  // '해당금융' 탭이 초기 활성 — Figma 원본 기준
  const [activeTab, setActiveTab] = useState<KbHomeTabId>('mine');

  /* ── 서버 데이터 상태 ─────────────────────────────────────────────────
   * 로딩 완료 전은 null 로 유지하여 Page 가 조건부 렌더링할 수 있도록 한다. */
  const [accountInfo, setAccountInfo] = useState<KbHomeAccountInfo | null>(null);
  const [noticeItems, setNoticeItems] = useState<KbHomeNoticeItem[]>([]);
  const [bannerInfo, setBannerInfo]   = useState<KbHomeBannerInfo | null>(null);

  /* ── 로딩·에러 상태 ───────────────────────────────────────────────────
   * isLoading: true 초기값 — 컴포넌트 마운트 직후부터 로딩 UI 표시 */
  const [isLoading, setIsLoading] = useState(true);
  const [isError,   setIsError]   = useState(false);

  /**
   * 홈 화면에 필요한 모든 데이터를 병렬로 로드한다.
   * Promise.all 로 세 API 를 동시에 호출하여 총 대기 시간 ≈ 단일 요청 대기 시간.
   */
  const loadData = useCallback(async () => {
    setIsLoading(true);
    setIsError(false);

    try {
      const [account, notices, banner] = await Promise.all([
        kbHomeRepository.getAccountSummary(),
        kbHomeRepository.getNoticeList(),
        kbHomeRepository.getBannerInfo(),
      ]);

      setAccountInfo(account);
      setNoticeItems(notices);
      setBannerInfo(banner);
    } catch {
      // 하나라도 실패하면 에러 상태로 전환 — Page 에서 AlertBanner 표시
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* 컴포넌트 마운트 시 1회 초기 로드 */
  useEffect(() => {
    void loadData();
  }, [loadData]);

  /**
   * 금융 구분 탭 전환 핸들러.
   * TabNav 의 onTabChange 는 string 을 전달하므로 타입 단언으로 좁힌다.
   */
  const handleTabChange = useCallback((id: string) => {
    setActiveTab(id as KbHomeTabId);
  }, []);

  return {
    activeTab,
    handleTabChange,
    accountInfo,
    noticeItems,
    bannerInfo,
    isLoading,
    isError,
  };
}
