/**
 * @file types.ts
 * @description BlankPageLayout 컴포넌트의 TypeScript 타입 정의.
 * 로그인·온보딩 전용 레이아웃. 상단 헤더 없이 전체 화면을 자유롭게 사용한다.
 */
import React from 'react';

export interface BlankPageLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * 콘텐츠 세로 정렬 방식.
   * - 'top': 상단 정렬 (기본값 — 온보딩 스크롤 화면)
   * - 'center': 수직 중앙 정렬 (로그인 폼 등 단일 블록 화면)
   */
  align?: 'top' | 'center';
  className?: string;
}