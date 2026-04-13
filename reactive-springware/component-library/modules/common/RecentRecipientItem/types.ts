/**
 * @file types.ts
 * @description RecentRecipientItem 컴포넌트 props 타입 정의.
 */

export interface RecentRecipientItemProps {
  /** 수취인명. 예: '홍길동' */
  name: string;
  /** 은행명. 예: '하나은행' */
  bankName: string;
  /** 마스킹된 계좌번호. 예: '123-****-5678' */
  maskedAccount: string;
  /** 항목 클릭 핸들러 (해당 수취인 정보로 이체 폼 자동 입력) */
  onClick: () => void;
}
