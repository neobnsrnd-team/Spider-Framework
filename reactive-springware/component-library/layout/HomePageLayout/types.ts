/**
 * @file types.ts
 * @description HomePageLayout 컴포넌트의 TypeScript 타입 정의.
 * 홈/메인 대시보드 전용 레이아웃. PageLayout과 달리 뒤로가기 버튼이 없고
 * 인사말 + 브랜드 타이틀 구조를 가진다.
 */
import React from 'react';
import type { BottomNavItem } from '../BottomNav/types';

export interface HomePageLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  /** 헤더 타이틀 (앱 이름 또는 서비스명, 예: '하나은행') */
  title: string;
  /**
   * 타이틀 좌측에 표시할 로고 슬롯.
   * - ReactNode: 그대로 렌더링
   * - string: lucide-react 아이콘 kebab-case 이름으로 조회해 렌더링 (CMS 브리지 전용)
   * - 미전달 시 로고 영역 렌더링 안 함
   */
  logo?: string | React.ReactNode;
  /**
   * 헤더 우측 슬롯.
   * 미전달 시 기본 프로필·벨·메뉴 3개 아이콘 버튼 표시
   */
  rightAction?: React.ReactNode;
  /**
   * 알림 뱃지 표시 여부.
   * rightAction을 직접 전달한 경우 무시됨.
   * 기본: false
   */
  hasNotification?: boolean;
  /** 하단 글로벌 탭바 영역 여백 자동 추가 여부. 기본: true */
  withBottomNav?: boolean;
  /**
   * CMS 브리지 전용: 하단 탭바에서 활성화할 탭 ID.
   * withBottomNav=true일 때만 사용된다.
   * @default "home"
   */
  activeId?: string;
  /**
   * 하단 탭바 항목 커스터마이징.
   * 미전달 시 기본 탭(자산·상품·홈·카드·챗봇)을 사용한다.
   */
  bottomNavItems?: BottomNavItem[];
  className?: string;
}