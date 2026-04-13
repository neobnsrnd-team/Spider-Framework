/**
 * @file useBankSelect.ts
 * @description 금융권 선택 BottomSheet 상태 관리 훅.
 *
 * BankSelectPage에서 필요한 열림 여부·탭·선택 항목 상태를 한 곳에서 관리한다.
 * Page는 이 훅에서 반환된 값과 핸들러를 BankSelectPage에 전달하기만 하면 된다.
 *
 * @param options.initialTab        - 초기 활성 탭. 기본: 'bank'
 * @param options.onBankSelect      - 은행 선택 완료 콜백 (id 전달)
 * @param options.onSecuritiesSelect - 증권사 선택 완료 콜백 (id 전달)
 * @param options.onConnectSecurities - 증권사 연결하기 CTA 콜백
 *
 * @example
 * const bankSelect = useBankSelect({
 *   onBankSelect: (id) => console.log('선택된 은행:', id),
 * });
 *
 * <Button onClick={bankSelect.handleOpen}>금융기관 선택</Button>
 * <BankSelectPage {...bankSelect} banks={BANKS} securities={SECURITIES} />
 */
import { useState, useCallback, useMemo } from 'react';
import type { BankSelectTab } from '../pages/banking/BankSelectPage/types';

export interface UseBankSelectOptions {
  /** 초기 활성 탭. 기본: 'bank' */
  initialTab?: BankSelectTab;
  /** 은행 선택 완료 시 호출 (선택된 은행 id 전달) */
  onBankSelect?: (id: string) => void;
  /** 증권사 선택 완료 시 호출 (선택된 증권사 id 전달) */
  onSecuritiesSelect?: (id: string) => void;
  /** 증권사 빈 상태 CTA \"증권사 연결하기\" 클릭 시 호출 */
  onConnectSecurities?: () => void;
}

export interface UseBankSelectReturn {
  /** BottomSheet 열림 여부 */
  open: boolean;
  /** 현재 활성 탭 */
  activeTab: BankSelectTab;
  /** 선택된 은행 id */
  selectedBankId: string | undefined;
  /** 선택된 증권사 id */
  selectedSecuritiesId: string | undefined;

  /**
   * BottomSheet 열기 — 외부에서 직접 호출하므로 handle 접두사 유지.
   * 나머지 핸들러는 BankSelectPage props와 spread 호환을 위해 on 접두사 사용.
   */
  handleOpen: () => void;
  /** BottomSheet 닫기 (BankSelectPage의 onClose prop에 대응) */
  onClose: () => void;
  /** 탭 전환 핸들러 (BankSelectPage의 onTabChange prop에 대응) */
  onTabChange: (tab: BankSelectTab) => void;
  /** 은행 선택 핸들러 (BankSelectPage의 onBankSelect prop에 대응) */
  onBankSelect: (id: string) => void;
  /** 증권사 선택 핸들러 (BankSelectPage의 onSecuritiesSelect prop에 대응) */
  onSecuritiesSelect: (id: string) => void;
  /** 증권사 연결하기 CTA 핸들러 (onConnectSecurities 미전달 시 undefined) */
  onConnectSecurities: (() => void) | undefined;
}

export function useBankSelect({
  initialTab = 'bank',
  onBankSelect,
  onSecuritiesSelect,
  onConnectSecurities,
}: UseBankSelectOptions = {}): UseBankSelectReturn {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<BankSelectTab>(initialTab);
  const [selectedBankId, setSelectedBankId] = useState<string | undefined>();
  const [selectedSecuritiesId, setSelectedSecuritiesId] = useState<string | undefined>();

  const handleOpen = useCallback(() => setOpen(true), []);

  const handleClose = useCallback(() => setOpen(false), []);

  const handleTabChange = useCallback((tab: BankSelectTab) => setActiveTab(tab), []);

  const handleBankSelect = useCallback(
    (id: string) => {
      setSelectedBankId(id);
      onBankSelect?.(id);
    },
    [onBankSelect],
  );

  const handleSecuritiesSelect = useCallback(
    (id: string) => {
      setSelectedSecuritiesId(id);
      onSecuritiesSelect?.(id);
    },
    [onSecuritiesSelect],
  );

  /* 증권사 연결하기: CTA 클릭 시 시트를 닫고 외부 콜백 호출.
     undefined를 반환할 수 있으므로 useCallback 대신 useMemo 사용 */
  const handleConnectSecurities = useMemo(
    () =>
      onConnectSecurities
        ? () => {
            setOpen(false);
            onConnectSecurities();
          }
        : /* onConnectSecurities 미전달 시 버튼 자체가 노출되지 않으므로 undefined 반환 */
          undefined,
    [onConnectSecurities],
  );

  return {
    open,
    activeTab,
    selectedBankId,
    selectedSecuritiesId,
    handleOpen,
    /* BankSelectPage props와 spread 호환을 위해 on 접두사로 노출 */
    onClose: handleClose,
    onTabChange: handleTabChange,
    onBankSelect: handleBankSelect,
    onSecuritiesSelect: handleSecuritiesSelect,
    onConnectSecurities: handleConnectSecurities,
  };
}
