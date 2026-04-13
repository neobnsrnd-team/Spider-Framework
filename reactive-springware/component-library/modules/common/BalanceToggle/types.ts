/**
 * @file types.ts
 * @description BalanceToggle 컴포넌트 타입 정의.
 */

export interface BalanceToggleProps {
  /** true = 잔액 숨김 상태, false = 잔액 표시 상태 */
  hidden: boolean
  /** 토글 클릭 시 호출되는 핸들러 */
  onToggle: () => void
  className?: string
}
