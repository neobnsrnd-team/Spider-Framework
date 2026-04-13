/**
 * @file types.ts
 * @description HanaCardMenuPage 컴포넌트 타입 정의.
 */
import React from 'react';

/** 사이드바 카테고리 식별자 */
export type MenuCategoryId = 'all' | 'history' | 'payment' | 'management' | 'benefit' | 'service';

export interface MenuItem {
  id: string;
  /** 'all' 탭에서는 모든 항목을 노출, 특정 카테고리 탭에서는 해당 항목만 노출 */
  category: Exclude<MenuCategoryId, 'all'>;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

export interface HanaCardMenuPageProps {
  /** 뒤로가기 클릭 핸들러 */
  onBack?: () => void;
  /** 내 정보 관리 클릭 핸들러 (UserProfile 설정 드롭다운) */
  onProfileManage?: () => void;
  /** 표시할 사용자 이름 (예: '홍길동님') */
  userName?: string;
  /** 최근 접속 일시 문자열 (예: '2026.04.09 10:00:00') */
  lastLogin?: string;
  /** 좌측 사이드바 카테고리 목록 */
  categories?: { id: MenuCategoryId; label: string }[];
  /** 우측 메뉴 항목 목록. 각 항목에 icon·label·category·onClick을 포함한다. */
  menuItems?: MenuItem[];
  /** 로그아웃 버튼 클릭 핸들러 */
  onLogout?: () => void;
}
