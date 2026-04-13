/**
 * @file types.ts
 * @description UsageTransactionItem 컴포넌트 타입 정의.
 */

/** 가맹점 상세 정보 — 상세 BottomSheet 아코디언에 표시 */
export interface MerchantInfo {
  address?:      string;
  phone?:        string;
  businessType?: string;
}

/** 이용내역 단건 */
export interface Transaction {
  id: string;
  /** 사용처(가맹점명) */
  merchant: string;
  /** 결제 금액(원). 음수: 취소/환불 */
  amount: number;
  /** 거래일. 예: '2026.04.08' */
  date: string;
  /** 거래구분. 예: '일시불' | '할부(3개월)' | '단기카드대출' | '취소' */
  type: string;
  /** 승인번호 */
  approvalNumber: string;
  /** 거래상태. 예: '승인' | '결제확정' | '취소' */
  status: string;
  /** 이용카드명 */
  cardName: string;
  /** 가맹점 상세 정보 */
  merchantInfo?: MerchantInfo;
}

export interface UsageTransactionItemProps {
  tx: Transaction;
  /**
   * 전달 시 행이 버튼으로 렌더링되며 클릭 시 상세 BottomSheet를 노출한다.
   * 미전달 시 행은 div로 렌더링되고 상세 BottomSheet를 노출하지 않는다.
   */
  onClick?: () => void;
}
