/**
 * @file types.ts
 * @description CardDashboardPage 컴포넌트 타입 정의.
 */

export interface CardDashboardPageProps {
  /** 뒤로가기 없음 — 홈 루트 화면이므로 onBack 불필요 */

  /** 로그인 사용자명 — StatementHeroCard 위 인사말에 표시 */
  userName?: string;

  /**
   * StatementHeroCard에 표시할 이번 달 결제 예정 금액.
   * /api/payment-statement 에서 공여기간 기준으로 집계된 totalAmount.
   */
  statementAmount?: number;
  /**
   * StatementHeroCard에 표시할 결제일 레이블 (예: "1월 25일").
   * /api/payment-statement billingPeriod.dueDate 에서 변환.
   */
  statementDueDate?: string;

  /** 알림 아이콘 클릭 */
  onNotification?: () => void;
  /** 메뉴 아이콘 클릭 */
  onMenu?: () => void;

  /** StatementHeroCard — 명세서 상세 화면 이동 */
  onStatementDetail?: () => void;

  /** LoanMenuBar 핸들러 */
  onShortLoan?:  () => void;
  onLongLoan?:   () => void;
  onRevolving?:  () => void;

  /** SummaryCard (asset) 액션 핸들러 */
  onMyAccount?:       () => void;
  onDiagnosis?:       () => void;
  onInsuranceDiag?:   () => void;

  /** SummaryCard (spending) 액션 핸들러 */
  onHouseholdBook?:     () => void;
  onSpendingBriefing?:  () => void;
  onFixedExpenses?:     () => void;

  /** QuickMenuGrid 핸들러 */
  onCardPerformance?: () => void;
  onUsageHistory?:    () => void;
  onMyCards?:         () => void;
  onCoupons?:         () => void;
  onLimitCheck?:      () => void;
  onInstallment?:     () => void;
  onCardApply?:       () => void;

  /** 하단 탭바 활성 탭 ID */
  activeBottomTab?: string;
  /** 하단 탭바 탭 변경 핸들러 */
  onBottomNavChange?: (id: string) => void;
}
