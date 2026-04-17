/**
 * @file AuthContext.tsx
 * @description 로그인 상태 전역 관리
 *
 * - 로그인 정보(userId, userName, userGrade, token)를 localStorage에 저장해
 *   새로고침 후에도 세션이 유지됩니다.
 * - Refresh Token은 httpOnly 쿠키로 백엔드가 관리하므로 이 Context에서는 다루지 않습니다.
 * - 마운트 시 registerAuthCallbacks()를 통해 Axios 인터셉터와 콜백을 연결합니다.
 *   - onRefreshed : Access Token 갱신 성공 시 React 상태 동기화
 *   - onFailure   : Refresh 실패 시 강제 로그아웃 (세션 완전 만료)
 * - useAuth() 훅으로 어느 컴포넌트에서든 로그인 상태를 읽고 login/logout을 호출합니다.
 */
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import { registerAuthCallbacks } from '@/api/axiosInstance';

const STORAGE_KEY = 'hnc_auth';

export interface AuthUser {
  userId:    string;
  userName:  string;
  userGrade: string;
  token:     string;     // Access Token (localStorage 저장, 짧은 TTL)
  lastLogin: string;     // 이전 로그인 시각 (로그인 응답 시 업데이트 전 값, 'YYYY.MM.DD HH:MM:SS')
  // Refresh Token은 httpOnly 쿠키로 백엔드 관리 — 이 인터페이스에 포함하지 않음
}

interface AuthContextValue {
  user:             AuthUser | null;
  isLoggedIn:       boolean;
  login:            (user: AuthUser) => void;
  logout:           () => void;
  /** lastLogin만 갱신한다. /api/auth/me로 보완할 때 사용. */
  setLastLogin:     (lastLogin: string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readStorage(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(readStorage);

  const login = (newUser: AuthUser) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  const setLastLogin = (lastLogin: string) => {
    setUser(prev => {
      if (!prev) return prev;
      const next = { ...prev, lastLogin };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  /**
   * Axios 인터셉터와 인증 콜백 연결.
   *
   * 마운트 시 한 번만 등록한다. setState를 직접 참조하므로
   * user/logout 의존성 없이도 항상 최신 상태를 갱신한다.
   */
  useEffect(() => {
    registerAuthCallbacks(
      // Access Token 갱신 성공: token·lastLogin 교체 (나머지 사용자 정보 유지)
      // lastLogin이 전달된 경우 '최근 접속 일시'를 즉시 갱신한다.
      (newToken: string, lastLogin?: string) => {
        setUser(prev =>
          prev
            ? { ...prev, token: newToken, ...(lastLogin ? { lastLogin } : {}) }
            : prev,
        );
      },
      // Refresh 실패: 완전 세션 만료 → 로그인 페이지 Modal용 메시지를 세션에 남기고 상태 초기화
      () => {
        sessionStorage.setItem('sessionExpiredMessage', '세션이 만료되었습니다. 다시 로그인해 주세요.');
        localStorage.removeItem(STORAGE_KEY);
        setUser(null);
      },
    );
  }, []); // 마운트 시 한 번만 등록

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout, setLastLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.');
  return ctx;
}
