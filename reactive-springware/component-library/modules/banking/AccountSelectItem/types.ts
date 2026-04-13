/**
 * @file types.ts
 * @description AccountSelectItem 컴포넌트의 TypeScript 타입 정의.
 *
 * 출금/입금 계좌 선택 BottomSheet의 계좌 리스트 아이템.
 * 아이콘 원 + 계좌명 + 계좌번호 + 잔액으로 구성되며,
 * 선택 상태에 따라 배경·아이콘 원·체크 아이콘이 전환된다.
 *
 * Figma 원본: Hana Bank App node-id: 1:1385 (출금 계좌 선택 — 계좌 리스트 아이템)
 */
import React from 'react';

export interface AccountSelectItemProps {
  /**
   * 아이콘 슬롯.
   * lucide-react 아이콘 컴포넌트를 전달한다.
   * 선택 상태에 따라 컨테이너 배경·색상이 자동 전환된다.
   */
  icon?: React.ReactNode;
  /** 계좌 명칭 (예: \"하나 주거래 통장\") */
  accountName: string;
  /** 계좌번호 (예: \"123-456-789012\") */
  accountNumber: string;
  /**
   * 잔액 표시 문자열 (예: \"3,000,000원\").
   * 포맷 처리는 호출자에서 완료 후 전달한다.
   */
  balance: string;
  /**
   * 선택 상태. 기본값: false
   * - true : 브랜드 배경(bg-brand-5) + 브랜드 아이콘 원 + 우측 체크 아이콘
   * - false: 기본 배경 + 중립 아이콘 원
   */
  selected?: boolean;
  /** 클릭 핸들러 */
  onClick?: () => void;
  /** 추가 Tailwind 클래스 */
  className?: string;
}
