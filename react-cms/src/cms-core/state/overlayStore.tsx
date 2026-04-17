/**
 * @file overlayStore.ts
 * @description 런타임 오버레이 open/close 상태를 관리하는 React Context 스토어.
 * PageRenderer 최상단에 OverlayProvider를 배치하고, 하위 컴포넌트에서 useOverlayStore로 접근합니다.
 */
import { createContext, useContext, useState } from "react";
import type React from "react";

interface OverlayStore {
  /** 현재 열려 있는 overlay의 id. null이면 닫힌 상태 */
  current: string | null;
  /** 특정 overlay를 엽니다 */
  open: (id: string) => void;
  /** 현재 overlay를 닫습니다 */
  close: () => void;
}

const OverlayContext = createContext<OverlayStore>({
  current: null,
  open: () => {},
  close: () => {},
});

/**
 * @description 오버레이 상태를 제공하는 Context Provider.
 * @param children 하위 컴포넌트
 */
export function OverlayProvider({ children }: { children: React.ReactNode }) {
  const [current, setCurrent] = useState<string | null>(null);
  return (
    <OverlayContext.Provider
      value={{ current, open: setCurrent, close: () => setCurrent(null) }}
    >
      {children}
    </OverlayContext.Provider>
  );
}

/**
 * @description 오버레이 open/close 상태와 액션을 반환하는 훅.
 * @returns OverlayStore
 */
export function useOverlayStore(): OverlayStore {
  return useContext(OverlayContext);
}
