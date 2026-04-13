/**
 * @file index.tsx
 * @description 헤더 클릭으로 콘텐츠를 접고 펼치는 아코디언 섹션 컴포넌트.
 *
 * 전계좌 조회 페이지의 계좌 그룹(예금·외화예금·퇴직연금 등)처럼
 * 섹션 단위로 펼침/접기가 필요한 패턴을 표준화한다.
 * 헤더 영역 전체가 클릭 가능하며, 우측에 화살표 아이콘으로 상태를 나타낸다.
 *
 * @param header          - 항상 표시되는 헤더 (ReactNode — 자유롭게 구성 가능)
 * @param children        - 펼침 상태에서만 표시되는 콘텐츠
 * @param defaultExpanded - 초기 펼침 여부 (기본: true)
 *
 * @example
 * <CollapsibleSection
 *   header={<SectionHeader title="예금" badge={2} />}
 * >
 *   <Stack gap="sm">...</Stack>
 * </CollapsibleSection>
 */
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@lib/cn';
import type { CollapsibleSectionProps } from './types';

export function CollapsibleSection({
  header,
  children,
  defaultExpanded = true,
  headerAlign = 'center',
  className,
}: CollapsibleSectionProps) {
  /* 펼침 상태 — 순수 UI 상태이므로 컴포넌트 로컬에서 관리 */
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={cn('bg-white rounded-lg p-md', className)}>
      {/* 헤더 버튼: 전체 너비 클릭 영역, 화살표는 항상 우측 끝 고정 */}
      <button
        type="button"
        onClick={() => setIsExpanded(prev => !prev)}
        className="flex w-full items-center justify-between gap-sm"
        aria-expanded={isExpanded}
      >
        {/* headerAlign으로 텍스트 정렬 제어 — button 기본 text-align:center 상속을 명시적으로 override */}
        <div className={cn('flex-1 min-w-0', headerAlign === 'center' ? 'text-center' : 'text-left')}>
          {header}
        </div>
        <ChevronDown
          className={cn(
            'size-5 shrink-0 text-text-muted transition-transform duration-200',
            /* 펼침 상태: 화살표 위로 회전 */
            isExpanded && 'rotate-180',
          )}
          aria-hidden="true"
        />
      </button>

      {/* 콘텐츠 영역: 펼침 상태에서만 렌더링 */}
      {isExpanded && (
        <div className="mt-md">{children}</div>
      )}
    </div>
  );
}
