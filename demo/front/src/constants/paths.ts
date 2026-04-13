/**
 * @file paths.ts
 * @description 애플리케이션 전체 라우트 경로 상수.
 *
 * 경로를 문자열 리터럴로 직접 사용하면 오타·변경 시 누락으로 인한 버그가 발생하기 쉽다.
 * 모든 경로 참조는 반드시 이 상수를 통해 한다.
 *
 * @example
 * navigate(PATHS.CARD.DASHBOARD)
 * <Route path={PATHS.CARD.USAGE_HISTORY} element={<UsageHistoryRoute />} />
 */
export const PATHS = {
  LOGIN: "/login",

  CARD: {
    DASHBOARD: "/card/dashboard",
    MENU: "/card/menu",
    USAGE_HISTORY: "/card/usage-history",
    PAYMENT_STATEMENT: "/card/payment-statement",
    IMMEDIATE_PAYMENT: "/card/immediate-payment",
    IMMEDIATE_PAY: "/card/immediate-pay",
    IMMEDIATE_PAY_REQUEST: "/card/immediate-pay-request",
    IMMEDIATE_PAY_METHOD: "/card/immediate-pay-method",
    IMMEDIATE_PAY_COMPLETE: "/card/immediate-pay-complete",
    MY_CARD_MANAGEMENT: "/card/my-card-management",
    USER_MANAGEMENT: "/card/user-management",
  },
} as const;
