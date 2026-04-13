/**
 * @file useAccountList.ts
 * @description 전계좌 조회 페이지의 상태 및 이벤트 핸들러 Hook.
 *
 * 책임:
 * - 금융기관 탭(해당금융/다른금융) 상태 관리 — 로컬 UI 상태
 * - 상품 카테고리 탭(예금/신탁/펀드/대출) 상태 관리 — 로컬 UI 상태
 * - 계좌 목록 데이터 패칭 (accountListRepository 호출)
 * - loading / error / empty 상태 관리
 * - 이벤트 핸들러 정의 후 Page에 전달
 *
 * 금지 사항:
 * - UI 렌더링 포함 금지
 * - 직접 HTTP 호출 금지 (accountListRepository를 통해서만)
 * - Page에서 이 Hook의 내부 상태를 직접 수정하는 방식 금지
 */

import { useState, useCallback, useEffect } from 'react';
import { accountListRepository } from '../repositories/accountListRepository';
import type {
  InstitutionTabId,
  ProductCategoryId,
  AccountGroup,
} from '../types/accountListTypes';

// ── 기본 탭 상태 ──────────────────────────────────────────────────────
// '해당금융'·'예금' 탭이 초기 활성 탭 — Figma 원본 기준
const DEFAULT_INSTITUTION_TAB: InstitutionTabId = 'mine';
const DEFAULT_PRODUCT_CATEGORY: ProductCategoryId = 'deposit';

export interface UseAccountListReturn {
  /** 계좌 그룹 목록 */
  groups: AccountGroup[];
  /** 데이터 로딩 중 여부 */
  isLoading: boolean;
  /** 에러 메시지 (null이면 에러 없음) */
  error: string | null;
  /** 현재 선택된 금융기관 탭 */
  institutionTab: InstitutionTabId;
  /** 현재 선택된 상품 카테고리 탭 */
  productCategory: ProductCategoryId;
  /** 금융기관 탭 변경 핸들러 */
  handleInstitutionTabChange: (tab: string) => void;
  /** 상품 카테고리 탭 변경 핸들러 */
  handleProductCategoryChange: (category: string) => void;
  /** 뒤로가기 핸들러 */
  handleBack: () => void;
  /** 거래내역 조회 핸들러 */
  handleViewHistory: (accountId: string) => void;
  /** 이체 핸들러 */
  handleTransfer: (accountId: string) => void;
  /** 퇴직연금 가입하기 핸들러 */
  handleJoinRetirement: () => void;
  /** 다른금융 계좌 연결하기 핸들러 */
  handleConnect: () => void;
  /** 헤더 메뉴 버튼 핸들러 */
  handleMenu: () => void;
}

export function useAccountList(): UseAccountListReturn {
  /* ── 탭 상태 (로컬 UI 상태) ── */
  const [institutionTab, setInstitutionTab] = useState<InstitutionTabId>(DEFAULT_INSTITUTION_TAB);
  const [productCategory, setProductCategory] = useState<ProductCategoryId>(DEFAULT_PRODUCT_CATEGORY);

  /* ── 데이터 상태 ── */
  const [groups, setGroups] = useState<AccountGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ── 계좌 목록 로드 함수 ── */
  const loadAccountList = useCallback(async (tab: InstitutionTabId) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await accountListRepository.getAccountList(tab);
      setGroups(result.groups);
    } catch (err) {
      setError(err instanceof Error ? err.message : '계좌 목록을 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* 컴포넌트 마운트 시 1회 초기 로드 — useEffect로 사이드이펙트 처리 */
  useEffect(() => {
    void loadAccountList(institutionTab);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadAccountList]);

  /* ── 금융기관 탭 변경 핸들러 ── */
  const handleInstitutionTabChange = useCallback((tab: string) => {
    // TabNav의 onTabChange가 string을 전달하므로 타입 단언으로 좁힘
    const typedTab = tab as InstitutionTabId;
    setInstitutionTab(typedTab);
    // 탭 변경 시 새 기관의 계좌 목록 재조회
    void loadAccountList(typedTab);
  }, [loadAccountList]);

  /* ── 상품 카테고리 탭 변경 핸들러 ── */
  const handleProductCategoryChange = useCallback((category: string) => {
    // 카테고리 변경은 로컬 필터링 — 서버 재조회 없음
    setProductCategory(category as ProductCategoryId);
  }, []);

  /* ── 뒤로가기 핸들러 ── */
  const handleBack = useCallback(() => {
    // 실제 앱에서는 navigate(-1) 또는 router.back() 사용
    console.log('뒤로가기');
  }, []);

  /* ── 거래내역 조회 핸들러 ── */
  const handleViewHistory = useCallback((accountId: string) => {
    // 실제 앱에서는 navigate(`/accounts/${accountId}/history`) 사용
    console.log('거래내역 조회:', accountId);
  }, []);

  /* ── 이체 핸들러 ── */
  const handleTransfer = useCallback((accountId: string) => {
    // 실제 앱에서는 navigate(`/transfer?from=${accountId}`) 사용
    console.log('이체:', accountId);
  }, []);

  /* ── 퇴직연금 가입하기 핸들러 ── */
  const handleJoinRetirement = useCallback(() => {
    console.log('퇴직연금 가입하기');
  }, []);

  /* ── 다른금융 계좌 연결하기 핸들러 ── */
  const handleConnect = useCallback(() => {
    // 실제 앱에서는 타행 계좌 연결 플로우 페이지로 이동
    console.log('다른금융 계좌 연결하기');
  }, []);

  /* ── 헤더 메뉴 버튼 핸들러 ── */
  const handleMenu = useCallback(() => {
    // 실제 앱에서는 설정·필터 등 메뉴 시트를 열거나 페이지로 이동
    console.log('메뉴');
  }, []);

  return {
    groups,
    isLoading,
    error,
    institutionTab,
    productCategory,
    handleInstitutionTabChange,
    handleProductCategoryChange,
    handleBack,
    handleViewHistory,
    handleTransfer,
    handleJoinRetirement,
    handleConnect,
    handleMenu,
  };
}
