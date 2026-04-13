/**
 * @file types.ts
 * @description Card 컴포넌트 및 서브 컴포넌트의 TypeScript 타입 정의
 */
import React from 'react';

export interface CardProps {
  children:     React.ReactNode;
  /** true이면 hover/active 인터랙션 스타일 활성화 */
  interactive?: boolean;
  /** 전달 시 <button> 태그로 렌더링 */
  onClick?:     () => void;
  /**
   * true이면 카드 내부 padding을 제거한다.
   * CardHighlight 등 카드 전체 너비를 차지하는 섹션을 구성할 때 사용한다.
   * 이 경우 내부 콘텐츠에서 직접 padding을 지정해야 한다.
   */
  noPadding?:   boolean;
  className?:   string;
}

export interface CardHeaderProps {
  title:      string;
  subtitle?:  string;
  /** 헤더 우측 버튼/링크 슬롯 */
  action?:    React.ReactNode;
  /** 헤더 좌측 아이콘 슬롯 */
  icon?:      React.ReactNode;
}

export interface CardRowProps {
  label:            string;
  value:            string;
  /** 금액 강조 등 값 텍스트 스타일 override */
  valueClassName?:  string;
}

/**
 * 우측에 임의 ReactNode를 배치하는 카드 행 컴포넌트.
 * value가 단순 문자열이 아닌 경우(편집 아이콘, 액션 버튼 포함 행 등)에 사용한다.
 * 예) 메모 편집 행, 상대계좌 + 이체하기 버튼 행
 */
export interface CardActionRowProps {
  /** 행 좌측 레이블 */
  label:      string;
  /** 행 우측에 자유롭게 배치할 ReactNode */
  children:   React.ReactNode;
  className?: string;
}

/**
 * 카드 하단의 강조 섹션 컴포넌트.
 * 이체 후 잔액 등 핵심 수치를 브랜드 색상 배경으로 강조 표시할 때 사용한다.
 * Card의 noPadding prop과 함께 사용하면 카드 전체 너비를 채울 수 있다.
 */
export interface CardHighlightProps {
  /** 좌측 레이블 텍스트 (예: "이체 후 잔액") */
  label:            string;
  /** 우측 값 텍스트 (예: "2,900,000원") */
  value:            string;
  /** 값 텍스트 스타일 override */
  valueClassName?:  string;
}