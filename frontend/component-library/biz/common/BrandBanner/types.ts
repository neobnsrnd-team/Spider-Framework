/**
 * @file types.ts
 * @description BrandBanner 컴포넌트의 TypeScript 타입 정의.
 *
 * 브랜드 컬러 배경의 프로모션 배너 컴포넌트.
 * BannerCarousel(복수 슬라이더)과 달리 단일 고정 배너에 사용한다.
 * 전체 메뉴 화면 하단의 "개인 맞춤 혜택" 배너 등에 활용.
 *
 * @see component-map.md §3.2-G (그라데이션 배너 처리 지침)
 */
import React from 'react';

export interface BrandBannerProps {
  /**
   * 배너 소제목 — 주요 타이틀 위에 표시되는 작은 텍스트.
   * (예: '개인 맞춤 혜택')
   */
  subtitle?: string;
  /**
   * 배너 주요 타이틀.
   * (예: '나만을 위한 특별한 한아멤버스')
   */
  title: string;
  /**
   * 우측 아이콘 슬롯 — 흰색 반투명 원형 컨테이너 내부에 렌더링됨.
   * 미전달 시 아이콘 영역 미표시.
   */
  icon?: React.ReactNode;
  /**
   * 배너 클릭 핸들러.
   * 전달 시 button 태그로 렌더링되어 클릭 가능 배너가 됨.
   */
  onClick?: () => void;
  /** 추가 Tailwind 클래스 */
  className?: string;
}
