/**
 * @file types.ts
 * @description Grid 레이아웃 컴포넌트의 TypeScript 타입 정의.
 * 2×N 퀵메뉴, 통계 카드 등 열 기반 그리드에 사용.
 */
import React from 'react';

import type { StackGap } from '../Stack/types';

export interface GridProps {
  children:      React.ReactNode;
  /**
   * 모바일 기준 열 수. 기본: 2.
   */
  cols?:         1 | 2 | 3 | 4;
  /**
   * 태블릿(md 이상) 기준 열 수. 미전달 시 cols 값 유지.
   */
  tabletCols?:   2 | 3 | 4;
  /** 셀 간격. 기본: 'sm' */
  gap?:          StackGap;
  className?:    string;
}