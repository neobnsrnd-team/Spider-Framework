/**
 * @file AuthContext.tsx
 * @description 로그인 상태 전역 관리
 *
 * - 로그인 정보(userId, userName, userGrade, token)를 localStorage에 저장해
 *   새로고침 후에도 세션이 유지됩니다.
 * - useAuth() 훅으로 어느 컴포넌트에서든 로그인 상태를 읽고 login/logout을 호출합니다.
 */
import { createContext, useContext, useState, type ReactNode } from 'react';

const STORAGE_KEY = 'hnc_auth';

export interface AuthUser {
  userId:    string;
  userName:  string;
  userGrade: string;
  token:     string;
}

interface AuthContextValue {
  user:          AuthUser | null;
  isLoggedIn:    boolean;
  login:         (user: AuthUser) => void;
  logout:        () => void;
  /** Authorization 헤더를 자동 첨부하고, 401 시 alert + 로그아웃 처리 */
  fetchWithAuth: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
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

  const login = (user: AuthUser) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  const fetchWithAuth = async (input: RequestInfo, init: RequestInit = {}): Promise<Response> => {
    const token = (JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') as AuthUser | null)?.token;
    const res = await fetch(input, {
      ...init,
      headers: { ...init.headers, ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    });
    if (res.status === 401) {
      alert('세션이 만료되었습니다. 다시 로그인해 주세요.');
      logout();
    }
    return res;
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, logout, fetchWithAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.');
  return ctx;
}
