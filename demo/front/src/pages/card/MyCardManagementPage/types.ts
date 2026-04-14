/**
 * @file types.ts
 * @description MyCardManagementPage 컴포넌트 타입 정의.
 */
import type { CardBrand } from '@cl/biz/card/CardVisual/types';
import type { CardManagementNavRow } from '@cl/biz/card/CardManagementPanel/types';

export type { CardManagementNavRow };

/** 카드 선택 목록 항목 */
export interface CardItem {
  id:       string;
  name:     string;
  brand:    CardBrand;
  /** 카드 이미지 슬롯 (img 또는 placeholder) */
  image:    React.ReactNode;
  /** 연결계좌 잔액 */
  balance:  number;
}

export interface MyCardManagementPageProps {
  /** 카드 목록 */
  cards:              CardItem[];
  /** 초기 선택 카드 ID (기본: 첫 번째 카드) */
  initialCardId?:     string;
  /** 카드 관리 네비게이션 행 목록 */
  managementRows:     CardManagementNavRow[];
  /** 카드 선택 변경 시 호출 — 선택된 카드 ID 전달 */
  onCardSelect?:      (cardId: string) => void;
  /** 뒤로가기 클릭 */
  onBack?:            () => void;
  /** 닫기(X) 클릭 */
  onClose?:           () => void;
}
