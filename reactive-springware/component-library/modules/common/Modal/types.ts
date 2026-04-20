/**
 * @file types.ts
 * @description Modal 컴포넌트의 TypeScript 타입 정의
 */
import React from 'react';

export type ModalSize      = 'sm' | 'md' | 'lg' | 'fullscreen';
/**
 * 모달 헤더 타이틀 정렬 방향.
 * - 'left'  (기본): 타이틀 좌측 정렬, X 버튼 우측 배치 (일반 확인 모달)
 * - 'center': 타이틀 중앙 정렬, X 버튼 절대 배치 우측 (경고/안내 모달)
 */
export type ModalTitleAlign = 'left' | 'center';

export interface ModalProps {
  /** 모달 표시 여부 */
  open:              boolean;
  /** 닫기 요청 핸들러 (ESC 키, 배경 클릭 포함) */
  onClose:           () => void;
  /** 헤더 제목. 생략 시 닫기 버튼만 표시 */
  title?:            string;
  /** 본문 영역. 내용이 길면 내부 스크롤 */
  children:          React.ReactNode;
  /** 하단 버튼 영역. Button 조합 권장 */
  footer?:           React.ReactNode;
  /**
   * 데스크톱 기준 모달 최대 너비.
   * 모바일에서는 항상 전체 너비 Bottom Sheet.
   * @default 'md'
   */
  size?:             ModalSize;
  /** true이면 배경 클릭으로 닫기 비활성화 */
  disableBackdropClose?: boolean;
  /**
   * false이면 X 닫기 버튼을 숨기고 ESC 키 닫기도 비활성화한다.
   * disableBackdropClose와 함께 사용하면 프로그래밍 방식으로만 닫힘.
   * critical 공지 등 사용자가 강제로 확인해야 하는 경우에 사용한다.
   * @default true
   */
  closeable?: boolean;
  /**
   * 헤더 타이틀 정렬.
   * - 'left'  (기본): 타이틀 좌측, X 버튼 우측 (일반 확인 모달)
   * - 'center': 타이틀 중앙, X 버튼 절대 우측 (경고·안내 모달)
   * @default 'left'
   */
  titleAlign?:       ModalTitleAlign;
  /**
   * Portal 렌더링 대상 요소. 기본값: document.body.
   * CMS 캔버스처럼 특정 컨테이너 안에 오버레이를 가두고 싶을 때 전달한다.
   * 전달 시 백드롭 포지션이 fixed → absolute로 전환되므로
   * 컨테이너 요소에 `position: relative`와 `overflow: hidden`이 필요하다.
   */
  container?: HTMLElement;
  /**
   * CMS 브리지 전용: footer ReactNode가 없을 때 버튼 수를 지정해 footer를 자동 생성한다.
   * footer prop이 있으면 무시된다.
   * @default "0"
   */
  bottomBtnCnt?: '0' | '1' | '2';
  /** CMS 브리지 전용: 자동 생성 footer의 첫 번째(primary) 버튼 텍스트. @default "확인" */
  bottomBtn1Label?: string;
  /** CMS 브리지 전용: 자동 생성 footer의 두 번째(secondary) 버튼 텍스트. @default "취소" */
  bottomBtn2Label?: string;
  className?:        string;
}