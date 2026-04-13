/**
 * @file types.ts
 * @description Checkbox 컴포넌트의 TypeScript 타입 정의.
 */
import React from 'react';

export interface CheckboxProps {
  /** 체크 상태 */
  checked: boolean;
  /** 상태 변경 핸들러 */
  onChange: (checked: boolean) => void;
  /** 우측 레이블 텍스트 또는 ReactNode */
  label?: React.ReactNode;
  /**
   * label prop이 없을 때 스크린리더용 접근성 이름.
   * label이 없으면 반드시 전달해야 WCAG 접근성 기준을 충족한다.
   */
  ariaLabel?: string;
  /**
   * 체크박스 모양. 기본: 'square'
   * - 'square' : 둥근 모서리 사각형 (기본값, 일반 체크박스)
   * - 'circle' : 원형 (라디오 버튼 느낌의 단독 선택 등에 사용)
   */
  shape?: 'square' | 'circle';
  /** 비활성화 여부 */
  disabled?: boolean;
  /**
   * 체크박스 input의 id.
   * 전달 시 label htmlFor와 연결되어 레이블 클릭으로도 체크 상태 변경 가능.
   */
  id?: string;
  className?: string;
}
