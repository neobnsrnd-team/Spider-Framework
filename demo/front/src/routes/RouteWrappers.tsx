/**
 * @file RouteWrappers.tsx
 * @description 각 페이지 컴포넌트에 navigate 핸들러를 주입하는 Route Wrapper 컴포넌트 모음.
 *
 * 역할:
 * - Page 컴포넌트는 onXxx props 만 받고, 실제 navigate 호출은 이 파일에서 처리한다.
 * - Mock 데이터를 주입하여 API 연동 전 개발·데모 환경을 지원한다.
 * - 각 Wrapper는 routes/index.tsx 에서 pageRoutes / modalRoutes 에 등록된다.
 *
 * 네이밍 규칙:
 * - 일반 페이지: XxxRoute (예: LoginRoute)
 * - 모달 오버레이: XxxModal (예: HanaCardMenuModal)
 */
import { useState }                        from 'react';
import { useNavigate, useLocation }        from 'react-router-dom';
import { Landmark, Building, Receipt, FileText, Wallet, Settings, Gift, CreditCard, Headphones } from 'lucide-react';

import { LoginPage }                from '@/pages/common/LoginPage';
import { CardDashboardPage }        from '@/pages/card/CardDashboardPage';
import { HanaCardMenuPage }         from '@/pages/card/HanaCardMenuPage';
import { UsageHistoryPage }         from '@/pages/card/UsageHistoryPage';
import { PaymentStatementPage }     from '@/pages/card/PaymentStatementPage';
import { ImmediatePaymentPage }     from '@/pages/card/ImmediatePaymentPage';
import { ImmediatePayPage }         from '@/pages/card/ImmediatePayPage';
import { ImmediatePayRequestPage }  from '@/pages/card/ImmediatePayRequestPage';
import { ImmediatePayMethodPage }   from '@/pages/card/ImmediatePayMethodPage';
import { ImmediatePayCompletePage } from '@/pages/card/ImmediatePayCompletePage';
import { MyCardManagementPage }     from '@/pages/card/MyCardManagementPage';
import { UserManagementPage }       from '@/pages/card/UserManagementPage';
import { PinConfirmSheet }          from '@cl/modules/common/PinConfirmSheet';
import { ModalSlideOver }           from '@cl/layout/ModalSlideOver';

import type { MenuItem } from '@/pages/card/HanaCardMenuPage/types';
import { PATHS }         from '@/constants/paths';
import {
  MOCK_TRANSACTIONS,
  MOCK_CARD_OPTIONS,
  MOCK_CARDS_VISUAL,
  MOCK_CARDS_SIMPLE,
  MOCK_USERS,
  MOCK_MANAGEMENT_ROWS,
  MOCK_PAYMENT_ITEMS,
  MOCK_INFO_SECTIONS,
  MOCK_CAUTIONS,
} from '@/mocks/cardMocks';

/* ------------------------------------------------------------------ */
/* 공통 / 인증                                                           */
/* ------------------------------------------------------------------ */

export function LoginRoute() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  return (
    <LoginPage
      showPassword={showPassword}
      onTogglePassword={() => setShowPassword((v) => !v)}
      onLogin={() => navigate(PATHS.CARD.DASHBOARD)}
    />
  );
}

/* ------------------------------------------------------------------ */
/* 카드 대시보드                                                         */
/* ------------------------------------------------------------------ */

/** 햄버거 메뉴 클릭 시 background location 패턴으로 /card/menu 를 모달로 열기 */
export function CardDashboardRoute() {
  const navigate  = useNavigate();
  const location  = useLocation();

  return (
    <CardDashboardPage
      onMenu={()             => navigate(PATHS.CARD.MENU, { state: { background: location } })}
      onNotification={()     => {}}
      onStatementDetail={()  => navigate(PATHS.CARD.PAYMENT_STATEMENT)}
      onShortLoan={()        => {}}
      onLongLoan={()         => {}}
      onRevolving={()        => {}}
      onCardPerformance={()  => {}}
      onUsageHistory={()     => navigate(PATHS.CARD.USAGE_HISTORY)}
      onMyCards={()          => navigate(PATHS.CARD.MY_CARD_MANAGEMENT)}
      onCoupons={()          => {}}
      onLimitCheck={()       => {}}
      onInstallment={()      => {}}
      onCardApply={()        => {}}
    />
  );
}

/* ------------------------------------------------------------------ */
/* 이용내역                                                              */
/* ------------------------------------------------------------------ */

/** 분할납부·즉시결제 클릭 시 즉시결제 안내로 이동 */
export function UsageHistoryRoute() {
  const navigate = useNavigate();
  return (
    <UsageHistoryPage
      transactions={MOCK_TRANSACTIONS}
      totalCount={25}
      paymentSummary={{ date: '2026년 4월 14일', totalAmount: 350_000 }}
      cardOptions={MOCK_CARD_OPTIONS}
      onBack={()               => navigate(-1)}
      onClose={()              => navigate(PATHS.CARD.DASHBOARD, { replace: true })}
      onLoadMore={()           => {}}
      onRevolving={()          => {}}
      onSearch={()             => {}}
      onInstallment={()        => navigate(PATHS.CARD.IMMEDIATE_PAYMENT)}
      onImmediatePayment={()   => navigate(PATHS.CARD.IMMEDIATE_PAYMENT)}
    />
  );
}

/* ------------------------------------------------------------------ */
/* 결제예정금액 / 명세서                                                  */
/* ------------------------------------------------------------------ */

/** 즉시결제·분할납부 클릭 시 즉시결제 안내로 이동 */
export function PaymentStatementRoute() {
  const navigate = useNavigate();
  return (
    <PaymentStatementPage
      cardOptions={MOCK_CARD_OPTIONS}
      paymentData={{
        dateFull:     '2026.04.14',
        dateYM:       '26년 4월',
        dateMD:       '04.08',
        totalAmount:  350000,
        revolving:    0,
        cardLoan:     0,
        cashAdvance:  0,
        infoSections: MOCK_INFO_SECTIONS,
        paymentItems: MOCK_PAYMENT_ITEMS,
      }}
      statementData={{
        totalAmount:  350000,
        badge:        '예정',
        paymentItems: MOCK_PAYMENT_ITEMS,
        infoSections: MOCK_INFO_SECTIONS,
      }}
      onBack={()              => navigate(-1)}
      onClose={()             => navigate(PATHS.CARD.DASHBOARD, { replace: true })}
      onCardChange={()        => {}}
      onDateClick={()         => {}}
      onRevolving={()         => {}}
      onCardLoan={()          => {}}
      onCashAdvance={()       => {}}
      onStatementDetail={()   => navigate(PATHS.CARD.USAGE_HISTORY)}
      onInstallment={()       => navigate(PATHS.CARD.IMMEDIATE_PAYMENT)}
      onImmediatePayment={()  => navigate(PATHS.CARD.IMMEDIATE_PAYMENT)}
    />
  );
}

/* ------------------------------------------------------------------ */
/* 즉시결제 플로우  (안내 → STEP1 → STEP2 → STEP3 → 완료)              */
/* ------------------------------------------------------------------ */

/** 즉시결제(선결제) 안내 — 즉시결제·건별즉시결제 클릭 시 STEP 1 으로 이동 */
export function ImmediatePaymentRoute() {
  const navigate = useNavigate();
  return (
    <ImmediatePaymentPage
      hanaAccount={{
        title: '하나은행 결제계좌',
        hours: '365일 06:00~23:30',
        icon:  <Landmark className="size-5" />,
      }}
      otherAccount={{
        title: '타행 결제계좌',
        hours: '365일 06:00~23:30',
        icon:  <Building className="size-5" />,
      }}
      cautions={MOCK_CAUTIONS}
      onImmediatePayment={() => navigate(PATHS.CARD.IMMEDIATE_PAY)}
      onItemPayment={()      => navigate(PATHS.CARD.IMMEDIATE_PAY)}
      onAutoPayment={()      => {}}
      onBack={()             => navigate(-1)}
      onClose={()            => navigate(PATHS.CARD.DASHBOARD, { replace: true })}
    />
  );
}

/** STEP 1 — 카드·결제유형 선택, 다음 클릭 시 STEP 2 로 이동 */
export function ImmediatePayRoute() {
  const navigate = useNavigate();
  return (
    <ImmediatePayPage
      cards={MOCK_CARDS_SIMPLE}
      initialCardId="card-1"
      initialPaymentType="total"
      onPaymentTypeChange={() => {}}
      onCardChange={()        => {}}
      onBack={()              => navigate(-1)}
      onClose={()             => navigate(PATHS.CARD.DASHBOARD, { replace: true })}
      onNext={()              => navigate(PATHS.CARD.IMMEDIATE_PAY_REQUEST)}
    />
  );
}

/** STEP 2 — 결제금액 확인, 다음 클릭 시 STEP 3 으로 이동 */
export function ImmediatePayRequestRoute() {
  const navigate = useNavigate();
  return (
    <ImmediatePayRequestPage
      card={{
        id:           'card-1',
        name:         '하나 머니 체크카드',
        maskedNumber: '1234-56**-****-7890',
      }}
      payableAmount={101000}
      paymentBreakdown={[
        { dateLabel: '2026.04.14 결제', amount: 91100 },
        { dateLabel: '2026.05.14 결제', amount:  9900 },
      ]}
      amountHelperText="금액 입금 시 당사의 입금공제 순서에 따라 처리되며, 특정 건만 처리 할 수 없습니다."
      cautions={[
        { title: '결제 제한 안내', content: '결제일 당일 출금 가능 잔액이 부족할 경우 즉시결제가 취소될 수 있습니다.' },
        { title: '취소 불가 안내', content: '즉시결제 신청 후에는 취소가 불가합니다.' },
      ]}
      onChangeCard={() => navigate(-1)}
      onNext={()       => navigate(PATHS.CARD.IMMEDIATE_PAY_METHOD)}
      onBack={()       => navigate(-1)}
      onClose={()      => navigate(PATHS.CARD.DASHBOARD, { replace: true })}
    />
  );
}

/** STEP 3 — 출금계좌 선택, 신청 클릭 시 PIN 입력 시트 열기 → 완료 시 STEP 4 로 이동 */
export function ImmediatePayMethodRoute() {
  const navigate          = useNavigate();
  const [pinOpen, setPinOpen] = useState(false);

  return (
    <>
      <ImmediatePayMethodPage
        summaryItems={[
          { label: '청구단위', value: '하나 머니 체크카드 1234-56**-****-7890' },
          { label: '이용구분', value: '일시불' },
          { label: '결제금액', value: '1,234,567원' },
        ]}
        accounts={[
          { id: 'acc-1', bankName: '하나은행', maskedAccount: '123-456789-01***' },
          { id: 'acc-2', bankName: '국민은행', maskedAccount: '987-654321-99***' },
        ]}
        initialAccountId="acc-1"
        onApply={()  => setPinOpen(true)}
        onBack={()   => navigate(-1)}
        onClose={()  => navigate(PATHS.CARD.DASHBOARD, { replace: true })}
      />
      <PinConfirmSheet
        open={pinOpen}
        onClose={()    => setPinOpen(false)}
        onConfirm={()  => navigate(PATHS.CARD.IMMEDIATE_PAY_COMPLETE, { replace: true })}
      />
    </>
  );
}

/** STEP 4 — 완료 화면, 확인 클릭 시 대시보드로 이동 */
export function ImmediatePayCompleteRoute() {
  const navigate = useNavigate();
  return (
    <ImmediatePayCompletePage
      cardName="하나 머니 체크카드"
      amount={1234567}
      account="하나은행 123-456789-01***"
      completedAt="2026.04.09 14:32"
      onConfirm={() => navigate(PATHS.CARD.DASHBOARD, { replace: true })}
    />
  );
}

/* ------------------------------------------------------------------ */
/* 카드 관리 / 사용자 관리                                               */
/* ------------------------------------------------------------------ */

export function MyCardManagementRoute() {
  const navigate = useNavigate();
  return (
    <MyCardManagementPage
      cards={MOCK_CARDS_VISUAL}
      managementRows={MOCK_MANAGEMENT_ROWS}
      onBack={()  => navigate(-1)}
      onClose={() => navigate(PATHS.CARD.DASHBOARD, { replace: true })}
    />
  );
}

export function UserManagementRoute() {
  const navigate = useNavigate();
  return (
    <UserManagementPage
      users={MOCK_USERS}
      onBack={()       => navigate(-1)}
      onMenuClick={()  => {}}
      onAddUser={()    => {}}
      onEditUser={()   => {}}
      onDeleteUser={()  => {}}
    />
  );
}

/* ------------------------------------------------------------------ */
/* 모달 오버레이                                                          */
/* ------------------------------------------------------------------ */

/**
 * 전체메뉴 모달.
 * - ModalSlideOver onClose: navigate(-1) — 모달 닫기 = 직전 페이지(대시보드)로 복귀.
 * - 메뉴 항목 클릭: replace: true — 뒤로가기 시 메뉴가 히스토리에 남지 않도록 한다.
 */
export function HanaCardMenuModal() {
  const navigate = useNavigate();

  const menuItems: MenuItem[] = [
    { id: 'usage-history',    category: 'history',    label: '이용내역',         icon: <Receipt    className="size-5" />, onClick: () => navigate(PATHS.CARD.USAGE_HISTORY,       { replace: true }) },
    { id: 'statement',        category: 'history',    label: '이용대금명세서',   icon: <FileText   className="size-5" />, onClick: () => navigate(PATHS.CARD.PAYMENT_STATEMENT,   { replace: true }) },
    { id: 'immediate-payment',category: 'payment',    label: '즉시결제',         icon: <Wallet     className="size-5" />, onClick: () => navigate(PATHS.CARD.IMMEDIATE_PAYMENT,   { replace: true }) },
    { id: 'card-management',  category: 'management', label: '카드 관리',        icon: <Settings   className="size-5" />, onClick: () => navigate(PATHS.CARD.MY_CARD_MANAGEMENT, { replace: true }) },
    { id: 'benefits',         category: 'benefit',    label: '혜택/포인트 조회', icon: <Gift       className="size-5" />, onClick: () => {} },
    { id: 'card-apply',       category: 'service',    label: '카드 신청',        icon: <CreditCard className="size-5" />, onClick: () => {} },
    { id: 'customer-service', category: 'service',    label: '고객센터',         icon: <Headphones className="size-5" />, onClick: () => {} },
  ];

  return (
    <ModalSlideOver onClose={() => navigate(-1)}>
      <HanaCardMenuPage
        userName="홍길동님"
        lastLogin="2026.04.09 10:00:00"
        categories={[
          { id: 'all',        label: '전체'    },
          { id: 'history',    label: '이용내역' },
          { id: 'payment',    label: '결제'    },
          { id: 'management', label: '카드관리' },
          { id: 'benefit',    label: '혜택'    },
          { id: 'service',    label: '서비스'  },
        ]}
        menuItems={menuItems}
        onBack={()          => navigate(-1)}
        onProfileManage={()  => {}}
        onLogout={()        => navigate(PATHS.LOGIN, { replace: true })}
      />
    </ModalSlideOver>
  );
}
