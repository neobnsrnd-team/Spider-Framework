/**
 * @file types.ts
 * @description CardPaymentSummary 컴포넌트의 TypeScript 타입 정의.
 *
 * 카드 이용내역 화면 상단에 표시되는 청구 요약 카드 전용.
 * 총 청구금액·세부 항목(리볼빙·카드론·현금서비스)·결제 계좌·결제일을 표시한다.
 */

export interface CardPaymentSummaryProps {
  /** 출금예정일. 예: '2026.04.08' */
  dateFull: string;
  /** 청구 년월. 예: '26년 4월' */
  dateYM: string;
  /** 오늘날짜. 예: '04.08' */
  dateMD: string;
  /** 총 청구금액 (원) */
  totalAmount: number;
  /** 리볼빙 금액 (원). 0이면 표시하지 않음 */
  revolving?: number;
  /** 카드론 금액 (원). 0이면 표시하지 않음 */
  cardLoan?: number;
  /** 현금서비스 금액 (원). 0이면 표시하지 않음 */
  cashAdvance?: number;
  /** 리볼빙(일부결제금액이월약정) 버튼 클릭 핸들러. 미전달 시 버튼 비활성 */
  onRevolving?: () => void;
  /** 카드론(장기카드대출) 버튼 클릭 핸들러. 미전달 시 버튼 비활성 */
  onCardLoan?: () => void;
  /** 현금서비스(단기카드대출) 버튼 클릭 핸들러. 미전달 시 버튼 비활성 */
  onCashAdvance?: () => void;
  /** 날짜(년월) 영역 클릭 핸들러. 전달 시 날짜 선택 모달 등을 열 수 있음 */
  onDateClick?: () => void;
  className?: string;
}
