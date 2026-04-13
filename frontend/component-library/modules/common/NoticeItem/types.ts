/**
 * @file types.ts
 * @description NoticeItem 컴포넌트의 TypeScript 타입 정의.
 * 아이콘 배경 원 + 제목 + 부제목 + 오른쪽 화살표로 구성된 공지/혜택 목록 항목.
 */
import React from 'react';

export interface NoticeItemProps {
  /**
   * 아이콘 슬롯.
   * lucide-react Icon 요소를 전달한다.
   */
  icon:             React.ReactNode;
  /**
   * 아이콘 배경 원의 추가 className.
   * 기본값: 'bg-brand-5 text-brand-text'
   * @example "bg-[#ecfdf5] text-success-text" — 초록색 배경
   */
  iconBgClassName?: string;
  /** 공지 제목 */
  title:            string;
  /** 공지 부제목 (미전달 시 미노출) */
  description?:     string;
  /** 항목 클릭 핸들러 */
  onClick?:         () => void;
  /**
   * 하단 구분선 표시 여부.
   * 목록의 마지막 항목에는 false를 전달한다.
   * 기본값: true
   */
  showDivider?:     boolean;
  className?:       string;
}
