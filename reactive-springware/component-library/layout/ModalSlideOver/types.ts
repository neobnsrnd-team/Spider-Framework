import type { ReactNode } from 'react';

export interface ModalSlideOverProps {
  /** 모달 내부에 렌더링할 콘텐츠 */
  children: ReactNode;
  /** 백드롭 클릭 시 호출. 미전달 시 백드롭 클릭으로 닫기 비활성 */
  onClose?: () => void;
  /** 슬라이드 방향 (기본: 'right') */
  direction?: 'right' | 'bottom';
  /** z-index 레벨 (기본: 50) */
  zIndex?: number;
}
