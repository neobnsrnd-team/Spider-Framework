/**
 * @file AccountGroupSection.tsx
 * @description 전계좌 조회 페이지의 계좌 그룹 섹션 컴포넌트.
 *
 * 레이아웃 구조:
 * CollapsibleSection
 *   ├── header: SectionHeader (그룹명 + 계좌 수 배지)
 *   └── children:
 *       ├── LabeledAmount (나의자산 현황 레이블 + 합계 잔액)
 *       └── Stack (AccountSummaryCard 목록) 또는 EmptyState
 *
 * 계좌가 없는 그룹(퇴직연금·증권)은 EmptyState로 처리하며,
 * 퇴직연금만 가입 유도 CTA 버튼을 노출한다.
 * 각 그룹은 기본 펼침 상태이며 헤더 클릭으로 접을 수 있다.
 *
 * @param group            - 계좌 그룹 데이터
 * @param onViewHistory    - 거래내역 조회 콜백 (계좌 ID 전달)
 * @param onTransfer       - 이체 콜백 (계좌 ID 전달)
 * @param onJoinRetirement - 퇴직연금 가입하기 콜백
 */

import {
  Stack,
  Button,
  EmptyState,
  SectionHeader,
  LabelValueRow,
  CollapsibleSection,
  AccountSummaryCard,
} from '@neobnsrnd-team/reactive-springware';
import type { AccountGroup } from './types';

interface AccountGroupSectionProps {
  group: AccountGroup;
  /** 거래내역 조회 콜백 */
  onViewHistory: (id: string) => void;
  /** 이체 콜백 */
  onTransfer: (id: string) => void;
  /** 퇴직연금 가입하기 콜백 */
  onJoinRetirement: () => void;
}

export function AccountGroupSection({
  group,
  onViewHistory,
  onTransfer,
  onJoinRetirement,
}: AccountGroupSectionProps) {
  const isEmpty = group.accounts.length === 0;

  return (
    <CollapsibleSection
      header={
        <SectionHeader title={group.label} badge={isEmpty ? undefined : group.accounts.length} />
      }
    >
      {/* 나의자산 현황: 레이블(좌) + 합계 잔액(우) */}
      <LabelValueRow
        label="나의자산 현황"
        value={isEmpty ? '0원' : group.totalBalanceDisplay}
        className="mb-md"
      />

      {isEmpty ? (
        /* 계좌 없음 — 빈 상태 메시지 */
        <EmptyState
          title={`보유하신 ${group.label} 계좌가 없습니다`}
          /* 퇴직연금만 가입 유도 버튼 노출 — 증권은 단순 안내 */
          action={
            group.type === 'retirement' ? (
              <Button variant="primary" size="sm" onClick={onJoinRetirement}>
                퇴직연금 가입하기
              </Button>
            ) : undefined
          }
        />
      ) : (
        <Stack gap="sm">
          {group.accounts.map((account) => (
            <AccountSummaryCard
              key={account.id}
              /* group.type이 AccountType과 호환되므로 그대로 전달 */
              type={group.type}
              accountName={account.name}
              accountNumber={account.accountNumber}
              balance={account.balance}
              /* repository에서 포맷된 문자열 우선 사용 — 외화 등 다중 통화 대응 */
              balanceDisplay={account.balanceDisplay}
              /* actions에 Inline 래퍼 없이 버튼을 직접 전달해야
                 AccountSummaryCard 내부의 [&>*]:flex-1이 각 버튼에 적용됨 */
              actions={
                <>
                  <Button variant="outline" size="sm" onClick={() => onViewHistory(account.id)}>
                    거래내역
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => onTransfer(account.id)}>
                    이체
                  </Button>
                </>
              }
            />
          ))}
        </Stack>
      )}
    </CollapsibleSection>
  );
}
