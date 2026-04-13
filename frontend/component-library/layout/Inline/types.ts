/**
 * @file types.ts
 * @description Inline 레이아웃 컴포넌트의 TypeScript 타입 정의.
 * 가로 방향 flex 컨테이너로 정렬·간격·줄바꿈을 prop으로 제어한다.
 */
import React from 'react';

import type { StackGap } from '../Stack/types';

export type InlineAlign   = 'start' | 'center' | 'end' | 'baseline' | 'stretch';
export type InlineJustify = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';

export interface InlineProps {
  children:   React.ReactNode;
  /** 요소 간 간격. 기본: 'sm' */
  gap?:       StackGap;
  /** 교차축(세로) 정렬. 기본: 'center' */
  align?:     InlineAlign;
  /** 주축(가로) 정렬. 기본: 'start' */
  justify?:   InlineJustify;
  /** true이면 flex-wrap 적용 */
  wrap?:      boolean;
  /** 렌더링할 HTML 태그. 기본: 'div' */
  as?:        React.ElementType;
  className?: string;
}