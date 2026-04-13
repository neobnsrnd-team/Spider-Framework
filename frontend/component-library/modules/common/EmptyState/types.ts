/**
 * @file types.ts
 * @description EmptyState 컴포넌트의 TypeScript 타입 정의.
 * 도메인별 콘텐츠를 props로 주입하는 브랜드 중립 컴포넌트.
 */
import React from 'react';

export interface EmptyStateProps {
  /** SVG 또는 img 요소. 도메인별 일러스트를 외부에서 주입 */
  illustration?: React.ReactNode;
  title:         string;
  description?:  string;
  /** CTA 버튼 등 액션 슬롯 */
  action?:       React.ReactNode;
  className?:    string;
}