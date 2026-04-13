/**
 * @file types.ts
 * @description Stack 레이아웃 컴포넌트의 TypeScript 타입 정의.
 * 세로 방향 flex 컨테이너로 간격 토큰을 prop으로 제어한다.
 */
import React from 'react';

export type StackGap   = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type StackAlign = 'start' | 'center' | 'end' | 'stretch';

export interface StackProps {
  children:   React.ReactNode;
  /** 자식 요소 간 간격. 기본: 'md' */
  gap?:       StackGap;
  /** 교차축(가로) 정렬. 기본: 'stretch' */
  align?:     StackAlign;
  /** 렌더링할 HTML 태그. 기본: 'div' */
  as?:        React.ElementType;
  className?: string;
}