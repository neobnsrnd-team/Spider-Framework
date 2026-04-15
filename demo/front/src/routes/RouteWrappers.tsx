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
import { useState, useEffect }             from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import type { NoticePayload }              from '@/hooks/useEmergencyNotice';
import { useAuth }                         from '@/contexts/AuthContext';
import { Landmark, Building, Receipt, FileText, Wallet, Settings, Gift, CreditCard, Headphones } from 'lucide-react';

import { LoginPage }                from '@/pages/common/LoginPage';
import { CardDashboardPage }        from '@/pages/card/CardDashboardPage';
import { EmergencyNoticeBanner }    from '@/components/EmergencyNoticeBanner';
import { useEmergencyNotice }       from '@/hooks/useEmergencyNotice';
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
import { BottomSheet }              from '@cl/modules/common/BottomSheet';
import { CardInfoPanel }            from '@cl/biz/card/CardInfoPanel';
import { ModalSlideOver }           from '@cl/layout/ModalSlideOver';

import type { MenuItem }     from '@/pages/card/HanaCardMenuPage/types';
import type { CardItem }     from '@/pages/card/MyCardManagementPage/types';
import type { Transaction, SearchFilter }              from '@/pages/card/UsageHistoryPage/types';
import type { PaymentTabData, StatementTabData, CardPaymentEntry } from '@/pages/card/PaymentStatementPage/types';
import { PATHS }          from '@/constants/paths';
import {
  MOCK_CARD_OPTIONS,
  MOCK_CARDS_VISUAL,
  MOCK_CARDS_SIMPLE,
  MOCK_USERS,
  MOCK_MANAGEMENT_ROWS,
  MOCK_CAUTIONS,
} from '@/mocks/cardMocks';

/* ------------------------------------------------------------------ */
/* 공통 / 인증                                                           */
/* ------------------------------------------------------------------ */

export function LoginRoute() {
  const navigate       = useNavigate();
  const { login }      = useAuth();
  const [userId,       setUserId]       = useState('');
  const [password,     setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [hasError,     setHasError]     = useState(false);

  const handleLogin = async () => {
    setHasError(false);
    try {
      const res  = await fetch('http://localhost:3001/api/auth/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ userId, password }),
      });
      const data = await res.json();
      if (data.success) {
        login({ userId: data.userId, userName: data.userName, userGrade: data.userGrade, token: data.token });
        navigate(PATHS.CARD.DASHBOARD);
      } else {
        setHasError(true);
      }
    } catch {
      setHasError(true);
    }
  };

  return (
    <LoginPage
      userId={userId}
      password={password}
      onUserIdChange={setUserId}
      onPasswordChange={setPassword}
      hasError={hasError}
      showPassword={showPassword}
      onTogglePassword={() => setShowPassword((v) => !v)}
      onLogin={handleLogin}
    />
  );
}

/* ------------------------------------------------------------------ */
/* 카드 대시보드                                                         */
/* ------------------------------------------------------------------ */

/** 햄버거 메뉴 클릭 시 background location 패턴으로 /card/menu 를 모달로 열기 */
export function CardDashboardRoute() {
  const navigate    = useNavigate();
  const location    = useLocation();
  const { user }    = useAuth();
  const { notice }  = useEmergencyNotice(); // SSE 긴급공지 구독

  return (
    <>
      {/* 배포 중인 긴급공지가 있을 때 화면 최상단에 배너 표시 */}
      {notice && <EmergencyNoticeBanner data={notice} />}
      <CardDashboardPage
        userName={user?.userName}
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
    </>
  );
}

/* ------------------------------------------------------------------ */
/* 이용내역                                                              */
/* ------------------------------------------------------------------ */

/** 분할납부·즉시결제 클릭 시 즉시결제 안내로 이동 */
export function UsageHistoryRoute() {
  const navigate                = useNavigate();
  const { user, fetchWithAuth } = useAuth();
  const [transactions,   setTransactions]   = useState<Transaction[]>([]);
  const [totalCount,     setTotalCount]     = useState(0);
  const [paymentSummary, setPaymentSummary] = useState({ date: '', totalAmount: 0 });
  const [cardOptions,    setCardOptions]    = useState(MOCK_CARD_OPTIONS);
  const [loading,        setLoading]        = useState(true);

  /** SearchFilter → query string 변환 후 이용내역 재조회 */
  const fetchTransactions = (filter?: SearchFilter) => {
    const params = new URLSearchParams();
    if (filter) {
      if (filter.selectedCard && filter.selectedCard !== 'all')
        params.set('cardId', filter.selectedCard);
      if (filter.period) params.set('period', filter.period);
      if (filter.customMonth) params.set('customMonth', filter.customMonth);
      if (filter.usageType && filter.usageType !== 'all')
        params.set('usageType', filter.usageType);
    }
    const qs = params.toString() ? `?${params}` : '';
    fetchWithAuth(`http://localhost:3001/api/transactions${qs}`)
      .then((r) => r.json())
      .then((data) => {
        setTransactions(data.transactions ?? []);
        setTotalCount(data.totalCount ?? 0);
        setPaymentSummary(data.paymentSummary ?? { date: '', totalAmount: 0 });
      })
      .catch(console.error);
  };

  useEffect(() => {
    if (!user?.token) return;
    Promise.all([
      fetchWithAuth('http://localhost:3001/api/transactions').then((r) => r.json()),
      fetchWithAuth('http://localhost:3001/api/cards').then((r) => r.json()),
    ])
      .then(([txData, cardData]) => {
        setTransactions(txData.transactions ?? []);
        setTotalCount(txData.totalCount ?? 0);
        setPaymentSummary(txData.paymentSummary ?? { date: '', totalAmount: 0 });
        setCardOptions(
          (cardData.cards ?? []).map((c: { id: string; name: string }) => ({
            value: c.id,
            label: c.name,
          })),
        );
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.token]);

  if (loading) return null;

  return (
    <UsageHistoryPage
      transactions={transactions}
      totalCount={totalCount}
      paymentSummary={paymentSummary}
      cardOptions={cardOptions}
      onBack={()               => navigate(-1)}
      onClose={()              => navigate(PATHS.CARD.DASHBOARD, { replace: true })}
      onLoadMore={()           => {}}
      onRevolving={()          => {}}
      onSearch={fetchTransactions}
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
  const navigate                = useNavigate();
  const { user, fetchWithAuth } = useAuth();
  const [paymentData,   setPaymentData]   = useState<PaymentTabData | null>(null);
  const [statementData, setStatementData] = useState<StatementTabData | null>(null);
  const [cardOptions,   setCardOptions]   = useState(MOCK_CARD_OPTIONS);
  const [loading,       setLoading]       = useState(true);

  useEffect(() => {
    if (!user?.token) return;
    Promise.all([
      fetchWithAuth('http://localhost:3001/api/payment-statement').then((r) => r.json()),
      fetchWithAuth('http://localhost:3001/api/cards').then((r) => r.json()),
    ])
      .then(([stmtData, cardData]) => {
        // ── dueDate(YYMMDD 또는 YYYYMMDD) → dateFull / dateYM / dateMD ──
        const raw = String(stmtData.dueDate ?? '');
        let dateFull = '';
        let dateYM   = '';
        let dateMD   = '';
        if (raw.length === 6) {
          /* YYMMDD: DB 결제예정일 형식 */
          const y = `20${raw.slice(0, 2)}`;
          const m = raw.slice(2, 4);
          const d = raw.slice(4, 6);
          dateFull = `${y}.${m}.${d}`;
          dateYM   = `${raw.slice(0, 2)}년 ${Number(m)}월`;
          dateMD   = `${m}.${d}`;
        } else if (raw.length === 8) {
          /* YYYYMMDD */
          const y = raw.slice(0, 4);
          const m = raw.slice(4, 6);
          const d = raw.slice(6, 8);
          dateFull = `${y}.${m}.${d}`;
          dateYM   = `${y.slice(2)}년 ${Number(m)}월`;
          dateMD   = `${m}.${d}`;
        }

        // ── items → CardPaymentEntry[] ─────────────────────────────
        const paymentItems: CardPaymentEntry[] = (stmtData.items ?? []).map(
          (item: { cardNo: string; cardName: string; amount: number; dueDate: string }) => {
            /* dueDate(YYMMDD or YYYYMMDD) → "M월 D일 결제" */
            const raw = String(item.dueDate ?? '');
            let dueDateLabel = '';
            if (raw.length === 6) {
              dueDateLabel = `${Number(raw.slice(2, 4))}월 ${Number(raw.slice(4, 6))}일 결제`;
            } else if (raw.length === 8) {
              dueDateLabel = `${Number(raw.slice(4, 6))}월 ${Number(raw.slice(6, 8))}일 결제`;
            }
            return {
              id:         `${item.cardNo}_${item.dueDate}`,
              icon:       <CreditCard className="size-5" />,
              cardEnName: dueDateLabel,
              cardName:   item.cardName,
              amount:     item.amount,
            };
          },
        );

        // ── cardInfo → CardInfoSection[] ──────────────────────────
        const ci = stmtData.cardInfo;
        const infoSections = ci
          ? [
              {
                title: '결제정보',
                rows: [
                  { label: '결제은행명', value: ci.paymentBank },
                  { label: '결제계좌',   value: ci.paymentAccount },
                  { label: '결제일',     value: `${ci.paymentDay}일` },
                ],
              },
            ]
          : [];

        setPaymentData({
          dateFull,
          dateYM,
          dateMD,
          totalAmount:  stmtData.totalAmount ?? 0,
          revolving:    0,
          cardLoan:     0,
          cashAdvance:  0,
          infoSections,
          paymentItems,
        });
        setStatementData({
          totalAmount:  stmtData.totalAmount ?? 0,
          badge:        '예정',
          paymentItems,
          infoSections,
        });
        setCardOptions(
          (cardData.cards ?? []).map((c: { id: string; name: string }) => ({
            value: c.id,
            label: c.name,
          })),
        );
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.token, fetchWithAuth]);

  if (loading || !paymentData || !statementData) return null;

  return (
    <PaymentStatementPage
      cardOptions={cardOptions}
      paymentData={paymentData}
      statementData={statementData}
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

/** brand 값 → 카드 배경 그라디언트 */
const CARD_GRADIENTS: Record<string, string> = {
  VISA:       'linear-gradient(135deg, #008485, #14b8a6)',
  Mastercard: 'linear-gradient(135deg, #1a1a2e, #16213e)',
  AMEX:       'linear-gradient(135deg, #2d6a4f, #1b4332)',
  JCB:        'linear-gradient(135deg, #1e40af, #1e3a8a)',
  UnionPay:   'linear-gradient(135deg, #c0392b, #96281b)',
};

/** GET /api/cards 응답의 카드 전체 필드 */
interface ApiCardFull {
  id:             string;
  name:           string;
  brand:          string;
  maskedNumber:   string;
  balance:        number;
  expiry:         string;
  paymentBank:    string;
  paymentAccount: string;
  paymentDay:     string;
  limitAmount:    number;
  usedAmount:     number;
}

export function MyCardManagementRoute() {
  const navigate              = useNavigate();
  const { user, fetchWithAuth } = useAuth();
  const [cards, setCards]     = useState<CardItem[]>(MOCK_CARDS_VISUAL);
  const [rawCards, setRawCards] = useState<ApiCardFull[]>([]);
  const [loading, setLoading] = useState(true);
  /** 칩 탭에서 선택된 카드 ID — onCardSelect 콜백으로 동기화 */
  const [selectedCardId, setSelectedCardId] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!user?.token) return;
    fetchWithAuth('http://localhost:3001/api/cards')
      .then((r) => r.json())
      .then(({ cards: raw }: { cards: ApiCardFull[] }) => {
        setRawCards(raw);
        setCards(
          raw.map((c) => ({
            id:      c.id,
            name:    c.name,
            brand:   c.brand as 'VISA' | 'Mastercard' | 'AMEX' | 'JCB' | 'UnionPay',
            image:   (
              <div style={{
                width: '100%', height: '100%', borderRadius: 12,
                background: CARD_GRADIENTS[c.brand] ?? 'linear-gradient(135deg, #374151, #1f2937)',
              }} />
            ),
            balance: c.balance,
          }))
        );
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.token]);

  if (loading) return null;

  /** 현재 선택된 카드의 전체 API 데이터 (선택 전에는 첫 번째 카드 사용) */
  const activeCard = rawCards.find((c) => c.id === selectedCardId) ?? rawCards[0];

  /** 모달에 표시할 카드정보 섹션 */
  const cardInfoSections = activeCard ? [
    {
      title: '카드정보',
      rows: [
        { label: '카드번호', value: activeCard.maskedNumber },
        { label: '카드구분', value: activeCard.name },
        { label: '유효기간', value: activeCard.expiry },
      ],
    },
    {
      title: '결제정보',
      rows: [
        { label: '결제은행명', value: activeCard.paymentBank },
        { label: '결제계좌',   value: activeCard.paymentAccount },
        { label: '결제일',     value: `${activeCard.paymentDay}일` },
        { label: '한도금액',   value: `${activeCard.limitAmount.toLocaleString()}원` },
        { label: '사용금액',   value: `${activeCard.usedAmount.toLocaleString()}원` },
      ],
    },
  ] : [];

  /**
   * 관리 행 목록 — 선택된 카드 데이터로 동적 구성
   *   - 0번 "카드정보 확인": subText = 마스킹 카드번호, onClick = 모달 오픈
   *   - 1번 "결제계좌": subText = 결제은행명 + 계좌번호
   */
  const managementRows = MOCK_MANAGEMENT_ROWS.map((row, i) => {
    if (i === 0) return { ...row, subText: activeCard?.maskedNumber, onClick: () => setModalOpen(true) };
    if (i === 1) return { ...row, subText: activeCard ? `${activeCard.paymentBank} ${activeCard.paymentAccount}` : row.subText };
    return row;
  });

  return (
    <>
      <MyCardManagementPage
        cards={cards}
        managementRows={managementRows}
        onCardSelect={setSelectedCardId}
        onBack={()  => navigate(-1)}
        onClose={() => navigate(PATHS.CARD.DASHBOARD, { replace: true })}
      />
      <BottomSheet
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="카드정보 확인"
      >
        <CardInfoPanel sections={cardInfoSections} />
      </BottomSheet>
    </>
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
/* Admin 미리보기 전용                                                    */
/* ------------------------------------------------------------------ */

/**
 * 긴급공지 미리보기 페이지.
 *
 * Admin 관리 화면의 iframe에서 호출되는 공개 경로(/preview/notice).
 * 인증 없이 접근 가능하며, DEPLOY_STATUS와 무관하게 최신 저장된 공지 내용을 표시한다.
 * displayType이 'N'(사용안함)인 경우에도 내용 확인을 위해 배너를 강제 표시하고 안내 문구를 노출한다.
 */
export function NoticePreviewRoute() {
  const [searchParams]        = useSearchParams();
  // lang 파라미터: Admin 미리보기 버튼에서 언어 코드(EMERGENCY_KO / EMERGENCY_EN)를 전달한다.
  const lang                  = searchParams.get('lang') ?? 'EMERGENCY_KO';
  const [data,    setData]    = useState<NoticePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  useEffect(() => {
    fetch('/api/notices/preview')
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<NoticePayload>;
      })
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-sm text-text-muted">
        로딩 중...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen text-sm text-text-muted">
        공지 데이터를 불러올 수 없습니다.
      </div>
    );
  }

  // 미리보기 모드: displayType이 N이어도 배너를 강제 표시 (내용 확인 목적)
  const isUnused   = data.displayType === 'N';
  const previewData: NoticePayload = isUnused
    ? { ...data, displayType: 'A' }
    : data;

  return (
    <div className="min-h-screen bg-bg-base">
      {/* 미리보기 모드 안내 */}
      <div className="flex items-center justify-center py-1 bg-blue-50 border-b border-blue-200">
        <span className="text-xs text-blue-600 font-medium">
          미리보기 모드
          {isUnused && <span className="ml-1 text-orange-500">(노출 타입: 사용안함 — 실제 배포 시 미표시)</span>}
        </span>
      </div>
      <EmergencyNoticeBanner data={previewData} forceOpen lang={lang} />
    </div>
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
  const navigate    = useNavigate();
  const { logout }  = useAuth();

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
        onLogout={() => { logout(); navigate(PATHS.LOGIN, { replace: true }); }}
      />
    </ModalSlideOver>
  );
}
