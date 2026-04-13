/**
 * @file useAccountSelect.ts
 * @description 계좌 선택 BottomSheet 상태 관리 훅.
 *
 * AccountSelectPage에서 필요한 열림 여부·탭·선택 계좌 상태를 한 곳에서 관리한다.
 * Page는 이 훅에서 반환된 값과 핸들러를 AccountSelectPage에 전달하기만 하면 된다.
 *
 * @param options.initialTab           - 초기 활성 탭. 기본: 'mine'
 * @param options.onAccountSelect      - 해당금융 계좌 선택 완료 콜백 (id 전달)
 * @param options.onOtherAccountSelect - 다른 금융 계좌 선택 완료 콜백 (id 전달)
 * @param options.onConnectOtherAccount - 다른 금융 계좌 연결하기 CTA 콜백
 *
 * @example
 * const accountSelect = useAccountSelect({
 *   onAccountSelect: (id) => console.log('선택된 계좌:', id),
 * });
 *
 * <Button onClick={accountSelect.handleOpen}>계좌 선택</Button>
 * <AccountSelectPage {...accountSelect} accounts={ACCOUNTS} otherAccounts={OTHER_ACCOUNTS} />
 */
import { useState, useCallback, useMemo } from 'react';
import type { AccountSelectTab } from '../pages/banking/AccountSelectPage/types';

export interface UseAccountSelectOptions {
  /** 초기 활성 탭. 기본: 'mine' */
  initialTab?: AccountSelectTab;
  /** 해당금융 계좌 선택 완료 시 호출 (선택된 계좌 id 전달) */
  onAccountSelect?: (id: string) => void;
  /** 다른 금융 계좌 선택 완료 시 호출 (선택된 계좌 id 전달) */
  onOtherAccountSelect?: (id: string) => void;
  /** 다른 금융 빈 상태 CTA "다른 금융 계좌 연결하기" 클릭 시 호출 */
  onConnectOtherAccount?: () => void;
}

export interface UseAccountSelectReturn {
  /** BottomSheet 열림 여부 */
  open: boolean;
  /** 현재 활성 탭 */
  activeTab: AccountSelectTab;
  /** 선택된 해당금융 계좌 id */
  selectedAccountId: string | undefined;
  /** 선택된 다른 금융 계좌 id */
  selectedOtherAccountId: string | undefined;

  /** BottomSheet 열기 */
  handleOpen: () => void;
  /** BottomSheet 닫기 (AccountSelectPage의 onClose prop에 대응) */
  onClose: () => void;
  /** 탭 전환 핸들러 (AccountSelectPage의 onTabChange prop에 대응) */
  onTabChange: (tab: AccountSelectTab) => void;
  /** 해당금융 계좌 선택 핸들러 (AccountSelectPage의 onAccountSelect prop에 대응) */
  onAccountSelect: (id: string) => void;
  /** 다른 금융 계좌 선택 핸들러 (AccountSelectPage의 onOtherAccountSelect prop에 대응) */
  onOtherAccountSelect: (id: string) => void;
  /** 다른 금융 연결하기 CTA 핸들러 (onConnectOtherAccount 미전달 시 undefined) */
  onConnectOtherAccount: (() => void) | undefined;
}

export function useAccountSelect({
  initialTab = 'mine',
  onAccountSelect,
  onOtherAccountSelect,
  onConnectOtherAccount,
}: UseAccountSelectOptions = {}): UseAccountSelectReturn {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<AccountSelectTab>(initialTab);
  const [selectedAccountId, setSelectedAccountId] = useState<string | undefined>();
  const [selectedOtherAccountId, setSelectedOtherAccountId] = useState<string | undefined>();

  const handleOpen = useCallback(() => setOpen(true), []);

  const handleClose = useCallback(() => setOpen(false), []);

  const handleTabChange = useCallback((tab: AccountSelectTab) => setActiveTab(tab), []);

  const handleAccountSelect = useCallback(
    (id: string) => {
      setSelectedAccountId(id);
      onAccountSelect?.(id);
      /* 선택 완료 시 시트를 닫아 사용자가 선택이 반영됐음을 직관적으로 인지할 수 있도록 함 */
      setOpen(false);
    },
    [onAccountSelect],
  );

  const handleOtherAccountSelect = useCallback(
    (id: string) => {
      setSelectedOtherAccountId(id);
      onOtherAccountSelect?.(id);
      /* handleConnectOtherAccount와 일관성: 선택/액션 후 시트 자동 닫힘 */
      setOpen(false);
    },
    [onOtherAccountSelect],
  );

  /* 다른 금융 연결하기: CTA 클릭 시 시트를 닫고 외부 콜백 호출.
     undefined를 반환할 수 있으므로 useMemo 사용 */
  const handleConnectOtherAccount = useMemo(
    () =>
      onConnectOtherAccount
        ? () => {
            setOpen(false);
            onConnectOtherAccount();
          }
        : /* onConnectOtherAccount 미전달 시 CTA 버튼 자체가 노출되지 않음 */
          undefined,
    [onConnectOtherAccount],
  );

  return {
    open,
    activeTab,
    selectedAccountId,
    selectedOtherAccountId,
    handleOpen,
    /* AccountSelectPage props와 spread 호환을 위해 on 접두사로 노출 */
    onClose: handleClose,
    onTabChange: handleTabChange,
    onAccountSelect: handleAccountSelect,
    onOtherAccountSelect: handleOtherAccountSelect,
    onConnectOtherAccount: handleConnectOtherAccount,
  };
}
