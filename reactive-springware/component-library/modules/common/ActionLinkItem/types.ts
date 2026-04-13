/**
 * @file types.ts
 * @description ActionLinkItem 컴포넌트의 TypeScript 타입 정의.
 * 아이콘 원형 배경 + 텍스트 레이블 + 오른쪽 화살표로 구성된 탭 가능 링크 행.
 * 이체 완료 화면의 "카카오톡 공유", "자주 쓰는 계좌 등록" 같은 보조 액션 패턴에 사용한다.
 */
import React from 'react';

export interface ActionLinkItemProps {
  /**
   * 아이콘 슬롯.
   * lucide-react Icon 컴포넌트 또는 이미지 요소를 전달한다.
   * @example <Share2 className="size-5" />
   */
  icon: React.ReactNode;
  /**
   * 아이콘 배경 원의 추가 className.
   * 브랜드별 아이콘 배경색을 지정할 때 사용한다.
   * 기본값: 'bg-brand-10 text-brand-text' (브랜드 청록색 반투명)
   * @example "bg-[#fee500]" — 카카오톡 노란색 배경
   */
  iconBgClassName?: string;
  /** 링크 레이블 텍스트 */
  label: string;
  /**
   * 상하 패딩 크기. 기본값: 'md'.
   * - 'md': py-standard (16px) — 카드형 단독 액션 버튼
   * - 'sm': py-sm (8px)       — 목록 내 행처럼 촘촘하게 나열할 때
   */
  size?: 'sm' | 'md';
  /**
   * 카드 테두리 표시 여부. 기본값: true.
   * false로 설정하면 border·shadow가 제거되어 목록 내 행(row) 형태로 사용 가능.
   * @example showBorder={false} — 전체 메뉴 화면의 메뉴 목록 행
   */
  showBorder?: boolean;
  /** 클릭 이벤트 핸들러 */
  onClick?: () => void;
  /** 추가 CSS className */
  className?: string;
}
