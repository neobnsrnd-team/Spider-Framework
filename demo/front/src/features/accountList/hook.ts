/**
 * @file hook.ts
 * @description 전계좌 조회 페이지의 상태 및 이벤트 핸들러 Hook.
 *
 * 책임:
 * - 금융기관 탭(해당금융/다른금융) 상태 관리 — 로컬 UI 상태 (useState)
 * - 상품 카테고리 탭(예금/신탁/펀드/대출) 상태 관리 — 로컬 UI 상태 (useState)
 * - 계좌 목록 데이터 패칭 (React Query useQuery)
 * - loading / error 상태 관리
 * - 이벤트 핸들러 정의 후 Page에 전달
 *
 * React Query 전략 (rules/04-state-data.md §3):
 *   queryKey: ['accounts', { institutionTab }]
 *   - 'accounts': accountDetail과 동일한 네임스페이스 — 도메인 단위 일괄 무효화 가능
 *   - institutionTab: 탭 변경 시 queryKey가 달라지므로 React Query가 자동 재조회
 *   - setInstitutionTab(tab) 만 호출하면 re-fetch가 자동 발생 (수동 loadAccountList 불필요)
 *
 * 금지 사항:
 * - UI 렌더링 포함 금지
 * - 직접 HTTP 호출 금지 (accountListRepository를 통해서만)
 * - Page에서 이 Hook의 내부 상태를 직접 수정하는 방식 금지
 */

import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { accountListRepository } from './repository';
import type {
  InstitutionTabId,
  ProductCategoryId,
  AccountGroup,
} from './types';

// ── 기본 탭 상태 ──────────────────────────────────────────────────────
// '해당금융'·'예금' 탭이 초기 활성 탭 — Figma 원본 기준
const DEFAULT_INSTITUTION_TAB: InstitutionTabId = 'mine';
const DEFAULT_PRODUCT_CATEGORY: ProductCategoryId = 'deposit';

export interface UseAccountListReturn {
  /** 계좌 그룹 목록 */
  groups: AccountGroup[];
  /** 최초 데이터 로딩 중 여부 (React Query: isPending) */
  isLoading: boolean;
  /** 데이터 로드 실패 여부 */
  isError: boolean;
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
  /** 계좌 상세 조회 핸들러 — /accounts/:id 로 이동 */
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
  const navigate = useNavigate();

  /* ── 탭 상태 (로컬 UI 상태 — 서버 데이터 아님) ── */
  const [institutionTab, setInstitutionTab] = useState<InstitutionTabId>(DEFAULT_INSTITUTION_TAB);
  const [productCategory, setProductCategory] = useState<ProductCategoryId>(DEFAULT_PRODUCT_CATEGORY);

  /**
   * 서버 데이터 → useQuery (rules/04-state-data.md §3).
   *
   * queryKey에 institutionTab을 포함하므로 탭 변경 시 React Query가 자동으로 재조회한다.
   * 수동 loadAccountList·useEffect 패턴이 필요 없다.
   * App.tsx의 QueryClient 전역 설정(staleTime 5분, retry 2)을 그대로 따른다.
   */
  const { data, isPending, isError } = useQuery({
    queryKey: ['accounts', { institutionTab }],
    queryFn:  () => accountListRepository.getAccountList(institutionTab),
  });

  /* ── 금융기관 탭 변경 핸들러 ── */
  const handleInstitutionTabChange = useCallback((tab: string) => {
    // TabNav의 onTabChange가 string을 전달하므로 타입 단언으로 좁힘
    setInstitutionTab(tab as InstitutionTabId);
    // queryKey: ['accounts', { institutionTab }]가 바뀌므로 React Query가 자동 재조회
    // 수동 fetch 호출 불필요
  }, []);

  /* ── 상품 카테고리 탭 변경 핸들러 ── */
  const handleProductCategoryChange = useCallback((category: string) => {
    // 카테고리 변경은 클라이언트 사이드 필터링 — 서버 재조회 없음
    setProductCategory(category as ProductCategoryId);
  }, []);

  /* ── 뒤로가기 핸들러 ── */
  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  /**
   * 계좌 상세 이동 핸들러.
   * AccountGroupSection의 onViewHistory prop을 통해 계좌 ID를 받아
   * /accounts/:id 상세 페이지로 이동한다 (List-Detail 내비게이션 패턴).
   */
  const handleViewHistory = useCallback((accountId: string) => {
    navigate(`/accounts/${accountId}`);
  }, [navigate]);

  /* ── 이체 핸들러 ── */
  const handleTransfer = useCallback((accountId: string) => {
    navigate(`/transfer?fromAccountId=${accountId}`);
  }, [navigate]);

  /* ── 퇴직연금 가입하기 핸들러 ── */
  const handleJoinRetirement = useCallback(() => {
    // TODO: 퇴직연금 가입 플로우 페이지 라우트 확정 후 navigate 연결
    console.log('[AccountList] 퇴직연금 가입하기');
  }, []);

  /* ── 다른금융 계좌 연결하기 핸들러 ── */
  const handleConnect = useCallback(() => {
    // TODO: 타행 계좌 연결 플로우 라우트 확정 후 navigate 연결
    console.log('[AccountList] 다른금융 계좌 연결하기');
  }, []);

  /* ── 헤더 메뉴 버튼 핸들러 ── */
  const handleMenu = useCallback(() => {
    // TODO: 설정·필터 메뉴 시트 또는 페이지 라우트 확정 후 연결
    console.log('[AccountList] 메뉴');
  }, []);

  return {
    groups:    data?.groups ?? [],  // 로딩·에러 시 빈 배열로 폴백
    isLoading: isPending,           // isPending → isLoading alias (Page 일관성)
    isError,
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
