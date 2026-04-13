/**
 * @file hook.ts
 * @description 계좌 상세 페이지의 데이터 패칭·상태 관리 Hook.
 *
 * useQuery로 accountDetailRepository.getAccountById 를 호출하며,
 * React Query의 캐싱·재시도·staleTime 정책은 App.tsx의 QueryClient 전역 설정을 따른다.
 *
 * Query Key 전략:
 *   ['accounts', id]
 *   - 'accounts': accountList와 동일한 도메인 네임스페이스
 *   - id: 특정 계좌 단건 식별자
 *   - accountList 데이터가 invalidate 될 때 상세도 함께 무효화된다
 *
 * @param id - URL 파라미터에서 추출한 계좌 ID
 *
 * @returns data      - 계좌 상세 클라이언트 모델 (로딩/에러 시 undefined)
 * @returns isLoading - 최초 로딩 중 여부 (React Query: isPending)
 * @returns isError   - 데이터 로드 실패 여부
 * @returns refetch   - 수동 재조회 함수 (ErrorState의 onRetry에 전달)
 * @returns handleBack - 목록으로 돌아가는 네비게이션 핸들러
 */
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { accountDetailRepository } from './repository';

export function useAccountDetail(id: string) {
  const navigate = useNavigate();

  /**
   * React Query로 계좌 상세 데이터를 조회한다.
   *
   * queryKey에 id를 포함하므로, 동일 id의 이전 요청 결과가 캐시에 있으면
   * staleTime(5분) 내에는 네트워크 요청 없이 캐시를 반환한다.
   */
  const { data, isPending, isError, refetch } = useQuery({
    queryKey:  ['accounts', id],
    queryFn:   () => accountDetailRepository.getAccountById(id),
    // id가 빈 문자열이면 쿼리를 실행하지 않는다
    enabled:   Boolean(id),
  });

  /** 뒤로가기 — 전계좌 조회 목록으로 이동 */
  const handleBack = useCallback(() => {
    navigate('/accounts');
  }, [navigate]);

  /** 거래내역 전체 조회 — 현재는 placeholder (TODO: /accounts/:id/history 라우팅) */
  const handleViewAllTransactions = useCallback(() => {
    console.log('[AccountDetail] 전체 거래내역 클릭:', id);
  }, [id]);

  /** 이체 버튼 — 해당 계좌를 출금 계좌로 선택한 이체 화면으로 이동 */
  const handleTransfer = useCallback(() => {
    navigate(`/transfer?fromAccountId=${id}`);
  }, [navigate, id]);

  return {
    data,
    isLoading:             isPending,  // isPending을 isLoading으로 alias — Page의 일관된 처리를 위해
    isError,
    refetch,
    handleBack,
    handleViewAllTransactions,
    handleTransfer,
  };
}
