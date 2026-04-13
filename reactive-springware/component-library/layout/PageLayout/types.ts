/**
 * @file types.ts
 * @description PageLayout 컴포넌트의 TypeScript 타입 정의.
 * 계좌 목록·상세, 이체 폼 등 일반 페이지에 사용하는 레이아웃.
 */
import React from 'react';

export interface PageLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 상단 헤더 타이틀 */
  title:         string;
  /** 전달 시 헤더 좌측에 뒤로가기(<) 버튼 표시 */
  onBack?:       () => void;
  /** 헤더 우측 슬롯 (알림·설정·닫기 버튼 등) */
  rightAction?:  React.ReactNode;
  /**
   * 화면 하단 고정 액션 바 슬롯 (iOS 스타일 하단 버튼 영역).
   * 전달 시 화면 하단에 blur 배경 고정 바가 렌더링되며,
   * 본문 스크롤 영역에 동일한 높이의 spacer가 추가되어
   * 마지막 콘텐츠가 고정 바에 가려지지 않는다.
   */
  bottomBar?:    React.ReactNode;
  className?:    string;
}