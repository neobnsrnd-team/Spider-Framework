/**
 * @file index.tsx
 * @description 계좌 선택 리스트 아이템 컴포넌트.
 *
 * Figma 원본: Hana Bank App node-id: 1:1385 (출금 계좌 선택 — 계좌 리스트 아이템)
 *
 * 출금/입금 계좌 선택 BottomSheet의 스크롤 가능한 계좌 목록에서
 * 각 계좌를 나타내는 리스트 아이템이다.
 * 선택 상태에 따라 배경·아이콘 원·우측 체크 아이콘이 자동으로 전환된다.
 *
 * @param icon          - 아이콘 슬롯 (lucide-react 아이콘). 기본: Landmark
 * @param accountName   - 계좌 명칭 (예: "하나 주거래 통장")
 * @param accountNumber - 계좌번호 (예: "123-456-789012")
 * @param balance       - 잔액 문자열 (예: "3,000,000원")
 * @param selected      - 선택 상태. 기본: false
 * @param onClick       - 클릭 핸들러
 * @param className     - 추가 Tailwind 클래스
 *
 * @example
 * <AccountSelectItem
 *   icon={<Landmark className="size-5" />}
 *   accountName="하나 주거래 통장"
 *   accountNumber="123-456-789012"
 *   balance="3,000,000원"
 *   selected
 *   onClick={() => handleSelect('acc-1')}
 * />
 */
import React from 'react';
import { Landmark, Check } from 'lucide-react';
import { cn } from '@lib/cn';
import type { AccountSelectItemProps } from './types';

export type { AccountSelectItemProps } from './types';

export function AccountSelectItem({
  icon,
  accountName,
  accountNumber,
  balance,
  selected = false,
  onClick,
  className,
}: AccountSelectItemProps) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-standard px-standard py-lg',
        'text-left transition-colors duration-150',
        'border-b border-border-subtle last:border-b-0',
        /* 선택: 브랜드 반투명 배경 / 미선택: 기본 배경 */
        selected ? 'bg-brand-5' : 'bg-surface hover:bg-surface-subtle active:bg-surface-subtle',
        className,
      )}
    >
      {/* 아이콘 원형 컨테이너 — 선택 상태에 따라 배경·색상 전환 */}
      <span
        className={cn(
          'flex items-center justify-center size-10 rounded-full shrink-0',
          selected
            /* 선택: 브랜드 배경 + 흰 아이콘 */
            ? 'bg-brand text-brand-fg'
            /* 미선택: 중립 배경 + 회색 아이콘 */
            : 'bg-surface-subtle text-text-muted',
        )}
        aria-hidden="true"
      >
        {/* icon 미전달 시 Landmark(은행 건물) 아이콘으로 폴백 */}
        {icon ?? <Landmark className="size-5" />}
      </span>

      {/* 계좌 정보 — 계좌명 / 계좌번호 / 잔액 수직 배열 */}
      <span className="flex-1 min-w-0 flex flex-col gap-xs">
        <span className="text-body text-text-heading truncate">{accountName}</span>
        <span className="text-sm text-text-secondary tabular-nums">{accountNumber}</span>
        <span className="text-body text-text-heading tabular-nums">{balance}</span>
      </span>

      {/* 선택 체크 아이콘 — 선택 상태일 때만 표시 */}
      {selected && (
        <Check
          className="shrink-0 size-5 text-brand"
          aria-hidden="true"
        />
      )}
    </button>
  );
}
