/**
 * @file index.tsx
 * @description 이체 완료 등 성공 결과 화면의 시각적 히어로 섹션 컴포넌트.
 * 장식용 Confetti 폭발 모션, 성공 아이콘, 결과 타이틀, 부제목으로 구성된다.
 *
 * Confetti 애니메이션 흐름:
 *   1. confetti-pop  — 화면 진입 시 각 아이템이 scale 0에서 스프링 커브로 팝-인 (0.6s, 1회)
 *   2. confetti-float — 팝-인 종료 후 위아래로 부드럽게 부유하는 반복 모션 (2.5s, 무한)
 *   아이템별 animation-delay로 시차를 두어 자연스러운 폭발 효과를 연출한다.
 *
 * @example
 * <SuccessHero
 *   recipientName="홍길동"
 *   amount="50,000원"
 *   subtitle="성공적으로 이체되었습니다."
 * />
 */
import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@lib/cn';
import './SuccessHero.css';
import type { SuccessHeroProps } from './types';

/** 팝-인 애니메이션 지속 시간 (ms) — float delay 계산의 기준값 */
const POP_DURATION_MS = 600;

/**
 * 각 Confetti 아이템의 시각 정보 및 타이밍 정의.
 *
 * - style     : 절대 위치 좌표 (top/right/bottom/left)
 * - rotate    : 최종 회전각(deg) — CSS 변수 --confetti-rotate로 주입
 * - colorClass: 배경색 Tailwind 클래스 (브랜드 토큰 우선, 데코 전용 색은 임의값 허용)
 * - popDelay  : confetti-pop 시작 딜레이(ms) — 아이템별로 달리해 폭발감 연출
 */
const CONFETTI_ITEMS = [
  // 왼쪽 상단 — 브랜드 청록색, 가장 먼저 팝인
  { style: { top: 39, left: 39 },    rotate: 12,  colorClass: 'bg-brand-10',  popDelay: 0   },
  // 오른쪽 상단 — 노란색 강조 포인트
  { style: { top: 19, right: 79 },   rotate: -12, colorClass: 'bg-[#facc15]', popDelay: 80  },
  // 왼쪽 하단 — 핑크색 시각 다양성
  { style: { bottom: 38, left: 96 }, rotate: 45,  colorClass: 'bg-[#f472b6]', popDelay: 160 },
  // 오른쪽 중단 — 파란색 시각 다양성
  { style: { top: 78, right: 96 },   rotate: -45, colorClass: 'bg-[#60a5fa]', popDelay: 240 },
  // 오른쪽 하단 — 브랜드 청록색, 마지막 팝인
  { style: { bottom: 79, right: 39 }, rotate: 12, colorClass: 'bg-brand',     popDelay: 320 },
] as const;

export function SuccessHero({
  recipientName,
  amount,
  subtitle = '성공적으로 이체되었습니다.',
  className,
}: SuccessHeroProps) {
  return (
    <div
      className={cn('relative flex flex-col items-center px-xl py-3xl overflow-hidden', className)}
      aria-live="polite"
    >
      {/* ── 장식용 Confetti ──────────────────────────────────────
          aria-hidden: 순수 장식 요소이므로 스크린 리더에서 무시
          animation 두 개를 순서대로 연결:
            1) confetti-pop  — 팝인 (1회, popDelay ms 후 시작)
            2) confetti-float — 부유 반복 (pop 종료 후 시작)               */}
      {CONFETTI_ITEMS.map((item, i) => (
        <span
          key={i}
          aria-hidden="true"
          className={cn('absolute size-2 rounded-xs', item.colorClass)}
          style={{
            ...item.style,
            /* --confetti-rotate: CSS keyframe 내부에서 rotate() 값으로 참조 */
            '--confetti-rotate': `${item.rotate}deg`,
            animation: [
              /* 1단계: 스프링 커브 팝인 (0.6s, 1회) */
              `confetti-pop ${POP_DURATION_MS}ms cubic-bezier(0.34, 1.56, 0.64, 1) ${item.popDelay}ms both`,
              /* 2단계: 팝인 종료 직후부터 부유 반복 시작 */
              `confetti-float 2.5s ease-in-out ${item.popDelay + POP_DURATION_MS}ms infinite`,
            ].join(', '),
          } as unknown as React.CSSProperties}
        />
      ))}

      {/* ── 성공 아이콘: 외부 반투명 링 → 내부 브랜드 원 → 체크마크 ── */}
      <div
        aria-hidden="true"
        className="flex items-center justify-center size-24 rounded-full bg-brand-10 mb-2xl shrink-0"
      >
        {/* 브랜드 색상 원형 배경 — shadow-md로 입체감 부여 */}
        <div className="flex items-center justify-center size-16 rounded-full bg-brand shadow-md">
          <Check className="size-7 text-white" strokeWidth={3} aria-hidden="true" />
        </div>
      </div>

      {/* ── 결과 타이틀 + 부제목 ─────────────────────────────── */}
      <div className="flex flex-col items-center gap-sm text-center">
        {/* 이름과 금액을 두 줄로 표시: "{name}님께 / {amount} 이체 완료" */}
        <p className="text-2xl text-text-heading leading-snug">
          {recipientName}님께<br />{amount} 이체 완료
        </p>
        {subtitle && (
          <p className="text-base text-text-muted">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
