/**
 * @file axiosInstance.ts
 * @description Axios 싱글톤 인스턴스 + JWT 자동 갱신 인터셉터
 *
 * 토큰 저장 전략:
 *   - Access Token  : localStorage (짧은 TTL, Authorization 헤더 삽입)
 *   - Refresh Token : httpOnly 쿠키 (JS 접근 불가 → XSS 방지, 백엔드 관리)
 *
 * 요청 흐름:
 *   1. 요청 인터셉터 : localStorage의 Access Token → Authorization 헤더 자동 삽입
 *   2. 응답 인터셉터 : 401 수신 시 /api/auth/refresh 호출 (쿠키 자동 전송)
 *      - 성공 : 새 Access Token으로 원래 요청 재시도
 *      - 실패 : onAuthFailure 콜백 실행 → 로그인 페이지 리다이렉트
 *   3. 동시 요청 처리 : isRefreshing 플래그 + 대기열로 중복 refresh 방지
 *
 * @example
 *   const { data } = await axiosInstance.get('/cards');
 */
import axios, {
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

export const API_BASE    = 'http://localhost:3001/api';
const        STORAGE_KEY = 'hnc_auth';

// ── 모듈 레벨 인증 콜백 ─────────────────────────────────────────────────────
// React 컴포넌트 트리 외부에서 AuthContext 메서드를 호출하기 위한 참조.
// AuthProvider 마운트 시 registerAuthCallbacks()로 등록된다.
type TokenRefreshedCb = (newToken: string) => void;
type AuthFailureCb   = () => void;

let _onTokenRefreshed: TokenRefreshedCb | null = null;
let _onAuthFailure:    AuthFailureCb   | null = null;

/**
 * AuthProvider가 마운트될 때 호출하여 콜백을 등록한다.
 *
 * @param onRefreshed - 토큰 갱신 성공 시 React 상태 동기화용 콜백
 * @param onFailure   - Refresh 실패(세션 완전 만료) 시 로그아웃 처리 콜백
 */
export function registerAuthCallbacks(
  onRefreshed: TokenRefreshedCb,
  onFailure:   AuthFailureCb,
): void {
  _onTokenRefreshed = onRefreshed;
  _onAuthFailure    = onFailure;
}

// ── Refresh 대기열 ──────────────────────────────────────────────────────────
// 여러 요청이 동시에 401을 받았을 때 Refresh가 한 번만 실행되도록 큐 관리.
// Refresh 완료 후 새 토큰을 각 대기 요청에 배포하거나, 실패 시 reject 처리.
let isRefreshing = false;

interface QueueEntry {
  resolve: (token: string) => void;
  reject:  (err: unknown)  => void;
}
let refreshQueue: QueueEntry[] = [];

function enqueueWaiter(
  resolve: QueueEntry['resolve'],
  reject:  QueueEntry['reject'],
): void {
  refreshQueue.push({ resolve, reject });
}

function flushQueue(newToken: string): void {
  refreshQueue.forEach(({ resolve }) => resolve(newToken));
  refreshQueue = [];
}

function rejectQueue(err: unknown): void {
  refreshQueue.forEach(({ reject }) => reject(err));
  refreshQueue = [];
}

// ── Axios 인스턴스 ──────────────────────────────────────────────────────────
export const axiosInstance = axios.create({
  baseURL:         API_BASE,
  timeout:         10_000,
  withCredentials: true, // httpOnly 쿠키(Refresh Token) 자동 전송
  headers:         { 'Content-Type': 'application/json' },
});

/** localStorage에서 저장된 Access Token을 읽는다. */
function readAccessToken(): string | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as { token?: string }).token ?? null : null;
  } catch {
    return null;
  }
}

// ── 요청 인터셉터 ───────────────────────────────────────────────────────────
/**
 * 요청 전 localStorage에서 Access Token을 읽어 Authorization 헤더에 자동 삽입.
 * 토큰이 없으면 헤더 없이 요청 진행 (공개 API 허용).
 */
axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = readAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── 응답 인터셉터 ───────────────────────────────────────────────────────────
/**
 * 응답 오류 처리 흐름:
 *
 * [401 — Access Token 만료·무효]
 *   재시도 로직을 실행한다.
 *   1. 이미 재시도한 요청(_retry) → 그냥 reject (무한 루프 방지)
 *   2. Refresh 진행 중 → 대기열 등록, 완료 후 새 토큰으로 재시도
 *   3. Refresh 시도 (/api/auth/refresh, httpOnly 쿠키 자동 전송)
 *      - 성공 → localStorage 갱신 + React 상태 콜백 + 원래 요청 재시도
 *      - 실패 → 대기열 전체 reject + onAuthFailure 콜백 실행
 *
 * [400 / 403 — 비즈니스 오류 (예: PIN 틀림·횟수 초과)]
 *   재시도하지 않고 즉시 reject한다.
 *   호출부 catch 블록에서 response.data를 읽어 사용자에게 오류 메시지를 표시한다.
 *   → PIN 오류를 401로 응답하면 인터셉터가 재시도하면서 실패 카운트가
 *     중복 증가하므로, 서버는 반드시 403을 사용해야 한다.
 *
 * [그 외 오류 (500 등)]
 *   동일하게 즉시 reject한다.
 */
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    // _retry 플래그: Refresh 실패 후 401이 다시 이 인터셉터를 트리거하는 무한 루프 방지
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    // 다른 요청이 이미 Refresh 진행 중이면 완료를 기다렸다가 새 토큰으로 재시도
    if (isRefreshing) {
      return new Promise<AxiosResponse>((resolve, reject) => {
        enqueueWaiter(
          (newToken) => {
            original._retry = true;
            original.headers.Authorization = `Bearer ${newToken}`;
            resolve(axiosInstance(original));
          },
          reject,
        );
      });
    }

    original._retry = true;
    isRefreshing    = true;

    try {
      // axiosInstance 대신 axios 직접 사용 → 이 인터셉터 재진입 방지
      // withCredentials: true 로 httpOnly 쿠키(Refresh Token) 자동 전송
      const { data } = await axios.post<{ accessToken: string }>(
        `${API_BASE}/auth/refresh`,
        {},
        { withCredentials: true },
      );

      const newToken = data.accessToken;

      // localStorage의 Access Token만 갱신 (Refresh Token은 쿠키로 백엔드 관리)
      const raw  = localStorage.getItem(STORAGE_KEY);
      const auth = raw ? JSON.parse(raw) : {};
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...auth, token: newToken }));

      _onTokenRefreshed?.(newToken);

      isRefreshing = false;
      flushQueue(newToken);

      // 원래 실패한 요청 재시도
      original.headers.Authorization = `Bearer ${newToken}`;
      return axiosInstance(original);
    } catch (refreshError) {
      isRefreshing = false;
      rejectQueue(refreshError);
      _onAuthFailure?.();
      return Promise.reject(refreshError);
    }
  },
);
