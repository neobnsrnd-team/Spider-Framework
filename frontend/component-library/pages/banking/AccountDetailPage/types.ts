/**
 * @file types.ts
 * @description AccountDetailPage 컴포넌트 타입 정의.
 *
 * 계좌상세 페이지의 props 타입.
 * 계좌 기본정보 + 거래내역 목록을 단일 페이지에서 보여준다.
 */
import type { TransactionItem } from '../../../modules/banking/TransactionList/types';

/** 계좌 유형 — AccountSummaryCard.type과 동일 */
export type AccountDetailType =
  | 'deposit'
  | 'savings'
  | 'loan'
  | 'foreignDeposit'
  | 'retirement'
  | 'securities';

/** 페이지 렌더링 상태 (Storybook args 제어용) */
export type AccountDetailPageState = 'loading' | 'data' | 'error';

export interface AccountDetailPageProps {
  /** 계좌 유형 (배지 텍스트·금액 색상 결정) */
  accountType?: AccountDetailType;
  /** 계좌명 */
  accountName?: string;
  /** 계좌번호 */
  accountNumber?: string;
  /** 잔액 (원화 단위 정수) */
  balance?: number;
  /** 출금가능액 (원화 단위 정수) */
  availableBalance?: number;
  /** 거래내역 목록 */
  transactions?: TransactionItem[];
  /**
   * 초기 렌더링 상태 (Storybook 시각 확인용).
   * 실제 앱에서는 Hook의 isLoading·isError로 제어한다.
   */
  initialState?: AccountDetailPageState;
  /** 뒤로가기 버튼 클릭 핸들러 */
  onBack?: () => void;
  /** 우측 메뉴 버튼 클릭 핸들러 */
  onMenu?: () => void;
  /** 예금자보호 카드 클릭 핸들러 */
  onInsuranceInfo?: () => void;
  /** 거래내역 검색 아이콘 클릭 핸들러 */
  onTransactionSearch?: () => void;
  /** "거래내역 더보기" 클릭 핸들러 */
  onTransactionMore?: () => void;
  /** 거래 항목 클릭 핸들러 */
  onTransactionClick?: (item: TransactionItem) => void;
}
