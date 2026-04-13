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
   * 헤더 타이틀 정렬.
   * - 'left'  (기본): 타이틀 좌측, X 버튼 우측 (일반 확인 모달)
   * - 'center': 타이틀 중앙, X 버튼 절대 우측 (경고·안내 모달)
   * @default 'left'
   */
  titleAlign?:       ModalTitleAlign;
  className?:        string;
}