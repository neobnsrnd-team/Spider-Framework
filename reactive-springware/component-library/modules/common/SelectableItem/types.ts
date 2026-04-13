/**
 * @file types.ts
 * @description SelectableItem 컴포넌트의 TypeScript 타입 정의.
 *
 * 아이콘 + 레이블로 구성된 선택 가능 카드 타일 컴포넌트.
 * 금융권 선택(은행·증권사), 카테고리 선택 등 Grid 2열 배열에서
 * 선택 상태를 시각적으로 표현할 때 사용한다.
 *
 * Figma 원본: Hana Bank App node-id: 1:1282 (은행 선택 그리드)
 */
import React from 'react';

export interface SelectableItemProps {
  /**
   * 아이콘 슬롯.
   * lucide-react 아이콘 컴포넌트를 전달한다.
   * 선택 상태에 따라 컨테이너 배경·아이콘 색상이 자동 전환된다.
   */
  icon: React.ReactNode;
  /** 표시할 레이블 텍스트 (예: "하나은행", "KB국민은행") */
  label: string;
  /**
   * 선택 상태. 기본값: false
   * - true : 브랜드 배경(bg-brand-5) + 브랜드 아이콘 원 + 브랜드 텍스트
   * - false: 중립 배경(bg-surface-subtle) + 회색 아이콘 원 + label 텍스트
   */
  selected?: boolean;
  /** 클릭 핸들러 */
  onClick?: () => void;
  /** 추가 Tailwind 클래스 */
  className?: string;
}
