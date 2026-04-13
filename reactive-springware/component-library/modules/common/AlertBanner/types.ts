/**
 * @file types.ts
 * @description AlertBanner 컴포넌트의 TypeScript 타입 정의.
 *
 * 아이콘 + 텍스트 메시지를 intent(의도)별 배경 색상으로 강조하는 인라인 배너 컴포넌트.
 * 이체 확인 화면의 "착오송금 방지" 주의 문구처럼 화면 중간에 경고·안내를 삽입할 때 사용한다.
 *
 * Figma 원본: Hana Bank App node-id: 1:2124 (warning 배너)
 *
 * intent별 색상 매핑:
 *   - warning : bg-warning-surface  / text-warning-text  / TriangleAlert 아이콘
 *   - danger  : bg-danger-surface   / text-danger-text   / AlertCircle 아이콘
 *   - success : bg-success-surface  / text-success-text  / CheckCircle 아이콘
 *   - info    : bg-primary-surface  / text-primary-text  / Info 아이콘
 */
import React from 'react';

/**
 * 배너의 의미·색상 조합을 결정하는 intent.
 * - 'warning' : 주의·경고 (amber/노란색)
 * - 'danger'  : 오류·위험 (red)
 * - 'success' : 완료·성공 (green)
 * - 'info'    : 안내·정보 (blue)
 */
export type AlertBannerIntent = 'warning' | 'danger' | 'success' | 'info';

export interface AlertBannerProps {
  /**
   * 배너 의미·색상 조합. 기본값: 'warning'
   * Figma 이체 확인 화면의 주의 배너는 'warning'을 사용한다.
   */
  intent?: AlertBannerIntent;
  /**
   * 배너 텍스트 콘텐츠.
   * 문자열 또는 ReactNode(강조 span 포함) 모두 허용한다.
   */
  children: React.ReactNode;
  /**
   * 좌측 아이콘 슬롯 override.
   * 미전달 시 intent별 기본 아이콘이 자동 사용된다.
   * @example icon={<Lock className="size-4" />}
   */
  icon?: React.ReactNode;
  /** 추가 Tailwind 클래스 */
  className?: string;
}
