/**
 * @file useSessionActivity.ts
 * @description 클릭 이벤트 기반 세션 활동 감지 훅
 *
 * 두 가지 세션 만료 감지를 조합한다:
 *   1. 비활성 타임아웃 : 마지막 클릭으로부터 SESSION_TIMEOUT 이상 경과 시 자동 로그아웃
 *                       (1분 인터벌로 체크 — 마지막 클릭 후 사용자가 아무것도 안 하는 경우)
 *   2. 토큰 만료 체크  : 클릭마다 쓰로틀링(THROTTLE_MS)을 적용해 JWT exp 필드를 디코딩,
 *                       Access Token 만료 시 즉시 로그아웃
 *                       (Axios 인터셉터가 API 호출 시점에 처리하지만,
 *                        호출 없이 탭에만 머무는 경우를 대비한 클라이언트 사이드 보완)
 *
 * 쓰로틀링을 적용하는 이유:
 *   빠른 연속 클릭 시마다 토큰 파싱·시간 비교 연산이 실행되지 않도록 부하 제어.
 *
 * @example
 *   // BrowserRouter + AuthProvider 내부 컴포넌트에서 호출
 *   function AppRoutes() {
 *     useSessionActivity();
 *     ...
 *   }
 */
import { useEffect, useRef, useCallback } from 'react';
import { useNavigate }                    from 'react-router-dom';
import { useAuth }                        from '@/contexts/AuthContext';
import { PATHS }                          from '@/constants/paths';

/** 무활동 세션 타임아웃 (30분) — 마지막 클릭 이후 이 시간이 지나면 자동 로그아웃 */
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

/** 토큰 만료 체크 쓰로틀 간격 (1분) — 빈번한 클릭 시 연산 부하 방지 */
const THROTTLE_MS = 60 * 1000;

export function useSessionActivity(): void {
  const { isLoggedIn, logout, user } = useAuth();
  const navigate = useNavigate();

  /** 마지막 사용자 클릭 시각 (ms) — 비활성 감지 기준점 */
  const lastActivityRef = useRef<number>(Date.now());
  /** 마지막 토큰 만료 체크 시각 — 쓰로틀 기준점 */
  const lastCheckRef    = useRef<number>(0);

  /**
   * 쓰로틀된 JWT 만료 체크.
   *
   * Access Token의 exp 클레임을 클라이언트 사이드에서 검증한다.
   * Axios 인터셉터는 API 호출 시 401을 받아 Refresh를 시도하지만,
   * 오래 열어둔 탭에서 API 호출 없이 클릭하는 경우를 조기에 감지하기 위해 사용한다.
   */
  const checkTokenExpiry = useCallback(() => {
    if (!isLoggedIn || !user) return;

    const now = Date.now();

    // 쓰로틀: 마지막 체크로부터 THROTTLE_MS 미경과 시 스킵
    if (now - lastCheckRef.current < THROTTLE_MS) return;
    lastCheckRef.current = now;

    try {
      const parts = user.token.split('.');
      // JWT 구조 검증 (header.payload.signature 3부분)
      if (parts.length !== 3) return;

      const payload = JSON.parse(atob(parts[1])) as { exp?: number };

      if (payload.exp && now > payload.exp * 1000) {
        // Access Token 만료 — 로그인 페이지 Modal용 메시지를 세션에 남기고 강제 로그아웃
        sessionStorage.setItem('sessionExpiredMessage', '세션이 만료되었습니다. 다시 로그인해 주세요.');
        logout();
        navigate(PATHS.LOGIN, { replace: true });
      }
    } catch {
      // 토큰 파싱 오류는 무시 (Axios 인터셉터가 API 호출 시 별도 처리)
    }
  }, [isLoggedIn, user, logout, navigate]);

  /**
   * document 클릭 이벤트 핸들러.
   * - 모든 클릭 : lastActivityRef 갱신 (비활성 타임아웃 리셋)
   * - 쓰로틀 통과 시 : JWT 만료 체크 실행
   */
  const handleClick = useCallback(() => {
    lastActivityRef.current = Date.now();
    checkTokenExpiry();
  }, [checkTokenExpiry]);

  // ── 비활성 감지 인터벌 ─────────────────────────────────────────────────────
  // 1분마다 마지막 클릭 시각을 확인해 SESSION_TIMEOUT 초과 시 로그아웃.
  // 클릭 이벤트와 독립적으로 동작하므로 탭에 머물기만 한 경우도 감지한다.
  useEffect(() => {
    if (!isLoggedIn) return;

    const intervalId = setInterval(() => {
      if (Date.now() - lastActivityRef.current > SESSION_TIMEOUT_MS) {
        // 비활성 세션 만료 — 로그인 페이지 Modal용 메시지를 세션에 남기고 강제 로그아웃
        sessionStorage.setItem('sessionExpiredMessage', '세션이 만료되었습니다. 다시 로그인해 주세요.');
        logout();
        navigate(PATHS.LOGIN, { replace: true });
      }
    }, 60_000); // 1분마다 체크

    return () => clearInterval(intervalId);
  }, [isLoggedIn, logout, navigate]);

  // ── 클릭 이벤트 리스너 ────────────────────────────────────────────────────
  useEffect(() => {
    if (!isLoggedIn) return;

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [isLoggedIn, handleClick]);
}
