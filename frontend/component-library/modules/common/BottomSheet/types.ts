/**
 * @file types.ts
 * @description BottomSheet 컴포넌트의 TypeScript 타입 정의.
 * 모바일 전용 하단 오버레이 시트. Modal과 달리 뷰포트 크기와 무관하게
 * 항상 화면 하단에 고정 표시된다.
 */
import React from 'react';

/**
 * 시트 최대 높이 프리셋.
 * - 'auto': 콘텐츠 높이에 맞춤 (최대 90dvh)
 * - 'half': 화면 절반(50dvh)
 * - 'full': 전체 화면(90dvh)
 */
export type BottomSheetSnap = 'auto' | 'half' | 'full';

export interface BottomSheetProps {
  /** 시트 열림 여부 */
  open: boolean;
  /** 시트 닫기 핸들러 (백드롭 클릭, ESC 키, 닫기 버튼 공통) */
  onClose: () => void;
  /** 시트 상단 타이틀. 미전달 시 타이틀 영역 렌더링 안 함 */
  title?: string;
  /** 본문 슬롯 */
  children?: React.ReactNode;
  /** 하단 고정 버튼 영역 슬롯 */
  footer?: React.ReactNode;
  /**
   * 시트 최대 높이 프리셋. 기본: 'auto'
   * 콘텐츠가 프리셋 높이를 초과하면 본문 영역이 내부 스크롤로 전환
   */
  snap?: BottomSheetSnap;
  /**
   * 백드롭 클릭으로 닫기 비활성화 여부.
   * 필수 액션이 있는 시트(예: 약관 동의)에서 true로 설정.
   * 기본: false
   */
  disableBackdropClose?: boolean;
  /**
   * 헤더 우측 X(닫기) 버튼 숨김 여부. 기본: false
   * Footer 버튼으로만 닫기를 처리하는 시트(예: 이체 확인)에서 true로 설정한다.
   * true로 설정해도 ESC 키·백드롭 클릭 닫기는 유지된다.
   */
  hideCloseButton?: boolean;
  className?: string;
}