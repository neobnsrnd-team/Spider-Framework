/**
 * @file index.tsx
 * @description 브랜드 컬러 배경 프로모션 배너 컴포넌트.
 *
 * BannerCarousel(복수 슬라이더)과 달리 단일 고정 배너로,
 * 전체 메뉴 화면 하단처럼 항상 노출되는 프로모션 영역에 사용한다.
 * onClick 전달 시 button 태그로 렌더링되어 클릭 가능한 배너가 된다.
 * Figma 원본 node-id: 1:560 (Bottom Banner / Footer)
 *
 * @param subtitle  - 배너 소제목 (예: '개인 맞춤 혜택')
 * @param title     - 배너 주요 타이틀
 * @param icon      - 우측 아이콘 (흰색 반투명 원형 컨테이너에 자동 삽입)
 * @param onClick   - 클릭 핸들러. 전달 시 button으로 렌더링
 * @param className - 추가 Tailwind 클래스
 *
 * @example
 * <BrandBanner
 *   subtitle="개인 맞춤 혜택"
 *   title="나만을 위한 특별한 한아멤버스"
 *   icon={<Star className="size-5 text-white" />}
 *   onClick={() => navigate('/membership')}
 * />
 */
import React from 'react';
import { cn } from '@lib/cn';
import type { BrandBannerProps } from './types';

export type { BrandBannerProps } from './types';

export function BrandBanner({
  subtitle,
  title,
  icon,
  onClick,
  className,
}: BrandBannerProps) {
  /* onClick 유무에 따라 클릭 가능한 button 또는 정적 div로 렌더링 */
  const Tag = onClick ? 'button' : 'div';

  return (
    <Tag
      /* button일 때만 type과 onClick 속성 부여 */
      {...(onClick ? { type: 'button' as const, onClick } : {})}
      className={cn(
        'flex items-center justify-between w-full',
        'bg-brand rounded-xl p-md',
        /* Figma 원본의 브랜드 컬러 그림자 적용 */
        'shadow-brand',
        /* 클릭 가능할 때 active 피드백 */
        onClick && 'transition-opacity active:opacity-80 cursor-pointer',
        className,
      )}
    >
      {/* 좌측: 소제목 + 타이틀 */}
      <div className="flex flex-col gap-xs text-left min-w-0">
        {subtitle && (
          /* 소제목 — 80% 불투명도로 타이틀보다 시각적으로 약하게 표현 */
          <span className="text-xs text-brand-fg opacity-80 truncate">
            {subtitle}
          </span>
        )}
        <span className="text-sm text-brand-fg truncate">{title}</span>
      </div>

      {/* 우측: 아이콘 컨테이너 — icon이 있을 때만 렌더링 */}
      {icon && (
        /* 흰색 반투명(20%) 원형 배경 — Figma의 Overlay 레이어 재현 */
        <div
          className="flex items-center justify-center size-10 rounded-full bg-white/20 shrink-0 ml-md"
          aria-hidden="true"
        >
          {icon}
        </div>
      )}
    </Tag>
  );
}
