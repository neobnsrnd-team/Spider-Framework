/**
 * @file types.ts
 * @description ErrorState 컴포넌트의 TypeScript 타입 정의.
 * API 호출 실패 등 에러 상태를 표시하는 컴포넌트.
 */

export interface ErrorStateProps {
  /** 사용자에게 표시할 에러 메시지 */
  title?: string;
  /** 상세 설명 (선택) */
  description?: string;
  /** 재시도 버튼 클릭 핸들러. 전달 시 재시도 버튼 노출 */
  onRetry?: () => void;
  /** 재시도 버튼 레이블. 기본: '다시 시도' */
  retryLabel?: string;
  className?: string;
}
