/**
 * @file index.tsx
 * @description intent별 배경 색상을 가진 인라인 경고·안내 배너 컴포넌트.
 *
 * Figma 원본: Hana Bank App node-id: 1:2124
 * ("착오송금 방지를 위해 이체정보를 다시 한번 확인하세요!" — warning 배너)
 *
 * BrandBanner(브랜드 홍보용)·NoticeItem(클릭 가능한 목록 행)과 달리,
 * AlertBanner는 화면 중간에 정적으로 삽입되는 안내/경고 메시지 전용이다.
 *
 * @param intent    - 배너 의미·색상. 기본: 'warning'
 * @param children  - 배너 텍스트 (문자열 또는 ReactNode)
 * @param icon      - 좌측 아이콘 override (미전달 시 intent 기본 아이콘 사용)
 * @param className - 추가 Tailwind 클래스
 *
 * @example
 * // 이체 확인 화면 주의 배너
 * <AlertBanner intent="warning">
 *   착오송금 방지를 위해 이체정보를 다시 한번 확인하세요!
 * </AlertBanner>
 *
 * @example
 * // 오류 배너
 * <AlertBanner intent="danger">비밀번호가 일치하지 않습니다.</AlertBanner>
 */
import React from 'react';
import { TriangleAlert, AlertCircle, CheckCircle, Info } from 'lucide-react';
import { cn } from '@lib/cn';
import type { AlertBannerProps, AlertBannerIntent } from './types';

export type { AlertBannerProps, AlertBannerIntent } from './types';

// ── intent별 스타일 매핑 ───────────────────────────────────────

const intentStyles: Record<AlertBannerIntent, {
  container: string;
  icon:      string;
  text:      string;
  /** intent별 기본 아이콘 컴포넌트 */
  IconComponent: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
}> = {
  warning: {
    container:     'bg-warning-surface border border-warning-border',
    icon:          'text-warning-text',
    text:          'text-warning-text',
    IconComponent: TriangleAlert,
  },
  danger: {
    container:     'bg-danger-surface border border-danger-border',
    icon:          'text-danger-text',
    text:          'text-danger-text',
    IconComponent: AlertCircle,
  },
  success: {
    container:     'bg-success-surface border border-success-border',
    icon:          'text-success-text',
    text:          'text-success-text',
    IconComponent: CheckCircle,
  },
  info: {
    container:     'bg-primary-surface border border-primary-border',
    icon:          'text-primary-text',
    text:          'text-primary-text',
    IconComponent: Info,
  },
};

export function AlertBanner({ intent = 'warning', children, icon, className }: AlertBannerProps) {
  const styles = intentStyles[intent];
  const { IconComponent } = styles;

  return (
    /* rounded-xl: Figma 원본 24px 모서리 반경(--radius-xl) */
    <div
      role="alert"
      className={cn(
        'flex gap-md items-start p-standard rounded-xl',
        styles.container,
        className,
      )}
    >
      {/* 아이콘: shrink-0으로 텍스트 줄바꿈 시에도 크기 고정 */}
      <span className={cn('shrink-0 mt-px', styles.icon)} aria-hidden="true">
        {icon ?? <IconComponent className="size-[18px]" aria-hidden="true" />}
      </span>

      {/* 텍스트: text-sm(14px)로 본문 수준 가독성 확보 */}
      <p className={cn('text-sm leading-relaxed', styles.text)}>
        {children}
      </p>
    </div>
  );
}
