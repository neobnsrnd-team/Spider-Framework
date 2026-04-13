/**
 * @file types.ts
 * @description TransferConfirmPage 컴포넌트의 TypeScript 타입 정의.
 *
 * 이체 실행 직전 사용자에게 이체 정보를 요약·확인시키는 BottomSheet 화면.
 * PIN 입력(AccountPasswordPage) 이전 단계에 위치한다.
 *
 * Figma 원본: Hana Bank App node-id: 1:2124
 */

export interface TransferConfirmPageProps {
  /** BottomSheet 열림 여부 */
  open: boolean;
  /** 닫기 / "아니오" 버튼 핸들러 */
  onClose: () => void;
  /** "예" 버튼 클릭 핸들러 — 다음 단계(PIN 입력 등)로 진행 */
  onConfirm: () => void;
  /** "추가이체" 링크 클릭 핸들러. 미전달 시 추가이체 버튼 미노출 */
  onAddTransfer?: () => void;

  // ── 이체 정보 ────────────────────────────────────────────────
  /** 수취인 이름 (타이틀 강조 표시에 사용) */
  recipientName: string;
  /**
   * 이체 금액 (원 단위 숫자).
   * 내부에서 toLocaleString('ko-KR') 으로 포맷하여 표시한다.
   * @example 100000 → "100,000원"
   */
  amount: number;
  /** 출금 계좌 문자열 (예: "하나 123-456-789012") */
  fromAccount: string;
  /** 입금 계좌 문자열 — 수취인명 포함 가능 (예: "국민 987-654-3210 (홍길동)") */
  toAccount: string;
  /**
   * 수수료 금액 (원 단위). 기본: 0
   * 0이면 브랜드 색상(무료 강조)으로 표시된다.
   */
  fee?: number;
  /** 내 통장 표시 메모 */
  myMemo?: string;
  /** 받는 분 통장 표시 메모 */
  recipientMemo?: string;
}
