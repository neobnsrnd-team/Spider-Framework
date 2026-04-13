/**
 * @file index.tsx
 * @description 이번 달 명세서 히어로 카드 컴포넌트.
 *
 * 카드 대시보드 상단의 핵심 정보 영역. 브랜드 컬러 배경 위에
 * 이번 달 결제 예정 금액과 결제일을 크게 표시한다.
 * 우상단 장식 블러 원은 Figma 디자인의 글래스 오버레이를 재현한다.
 *
 * @param amount   - 이번 달 명세서 금액 (원화 정수)
 * @param dueDate  - 결제일 텍스트 (e.g. "12월 25일")
 * @param label    - 카드 설명 레이블 (기본: "이번 달 명세서")
 * @param onDetail - 상세 화살표 클릭 핸들러. 전달 시 화살표 버튼 노출
 *
 * @example
 * <StatementHeroCard
 *   amount={1250000}
 *   dueDate="12월 25일"
 *   onDetail={() => navigate('/statement')}
 * />
 */
import React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@lib/cn';
import type { StatementHeroCardProps } from './types';

/** 원화 금액 포맷터 */
const krwFormatter = new Intl.NumberFormat('ko-KR');

export function StatementHeroCard({
  amount,
  dueDate,
  label = '이번 달 명세서',
  onDetail,
  hidden = false,
  className,
}: StatementHeroCardProps) {
  const formattedAmount = krwFormatter.format(amount);

  return (
    <div
      className={cn(
        'relative w-full rounded-xl overflow-hidden',
        /* 브랜드 배경 + 그림자 */
        'bg-brand shadow-[0px_8px_24px_0px_var(--color-brand-shadow)]',
        'p-2xl',
        className,
      )}
    >
      {/* 우상단 장식 블러 원 (Figma 글래스 오버레이 재현) */}
      <span
        className="absolute top-[-40px] right-[-40px] size-[160px] rounded-full bg-white/10 blur-[32px] pointer-events-none"
        aria-hidden
      />

      <div className="relative flex flex-col gap-sm">
        {/* ── 상단: 레이블 ── */}
        <span className="text-sm font-medium text-brand-fg/80">{label}</span>

        {/* ── 금액 표시 ── */}
        <div className="flex items-end gap-xs">
          <span
            className="text-4xl font-bold text-brand-fg tabular-nums font-numeric leading-tight"
            aria-label={hidden ? '금액 숨김' : `${label} ${formattedAmount}원`}
          >
            {/* hidden이면 마스킹 문자로 대체 */}
            {hidden ? '금액 숨김 중' : formattedAmount}
          </span>
          {!hidden && <span className="text-xl font-bold text-brand-fg pb-1">원</span>}
        </div>

        {/* ── 결제일 뱃지 + 화살표 ── */}
        <div className="flex items-center justify-between pt-lg">
          {/* 결제일: 반투명 글래스 pill */}
          <span className="flex items-center px-md py-xs rounded-full bg-white/20 backdrop-blur-sm">
            <span className="text-[11px] font-bold text-brand-fg tracking-wide">
              {`결제일: ${dueDate}`}
            </span>
          </span>

          {/* 상세보기 화살표 — onDetail 전달 시에만 노출 */}
          {onDetail && (
            <button
              type="button"
              onClick={onDetail}
              aria-label="명세서 상세 보기"
              className="text-brand-fg/80 hover:text-brand-fg transition-colors duration-150"
            >
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
