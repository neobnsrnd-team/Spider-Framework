import {
  PageLayout,
  Stack,
  Inline,
  Typography,
  Badge,
  Button,
  Card,
  Section,
  HomePageLayout,
} from '@cl';
import {
  CreditCard,
  RefreshCw,
  Lock,
  Globe,
  Smartphone,
  AlertTriangle,
  BarChart2,
  ClipboardList,
  FileText,
  PauseCircle,
  Scissors,
  ChevronRight,
  Home,
  Wallet,
  Receipt,
  Gift,
  LayoutGrid,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useState } from 'react';

export interface CardManagementPageProps {
  cardName: string;
  cardNumber: string;
  cardBrand: string;
  linkedAccount: string;
  balance: number;
  onBack?: () => void;
}

export function CardManagementPage({
  cardName,
  cardNumber,
  cardBrand,
  linkedAccount,
  balance,
  onBack,
}: CardManagementPageProps) {
  const [balanceHidden, setBalanceHidden] = useState(true);

  const formatBalance = (amount: number) =>
    new Intl.NumberFormat('ko-KR').format(amount);

  const quickActions = [
    { icon: <CreditCard className="size-5" />, label: '카드정보\n확인' },
    { icon: <RefreshCw className="size-5" />, label: '결제계좌\n변경' },
    { icon: <Lock className="size-5" />, label: '카드\n비밀번호' },
  ];

  const securityMenus = [
    { icon: <Globe className="size-5" />, label: '해외결제 설정', danger: false },
    { icon: <Smartphone className="size-5" />, label: '간편결제 등록', danger: false },
    { icon: <AlertTriangle className="size-5 text-danger" />, label: '분실신고', danger: true },
  ];

  const limitMenus = [
    { icon: <BarChart2 className="size-5" />, label: '한도 조회/변경', danger: false },
    { icon: <ClipboardList className="size-5" />, label: '카드 이용내역 조회', danger: false },
  ];

  const serviceMenus = [
    { icon: <FileText className="size-5" />, label: '카드 재발급 신청', danger: false },
    { icon: <PauseCircle className="size-5" />, label: '일시정지 설정', danger: false },
    { icon: <Scissors className="size-5" />, label: '카드 해지', danger: false },
  ];

  const bottomNavItems = [
    { id: 'home', icon: <Home className="size-5" />, label: '홈', onClick: () => {} },
    { id: 'asset', icon: <Wallet className="size-5" />, label: '자산', onClick: () => {} },
    { id: 'payment', icon: <Receipt className="size-5" />, label: '결제', onClick: () => {} },
    { id: 'benefit', icon: <Gift className="size-5" />, label: '혜택', onClick: () => {} },
    { id: 'all', icon: <LayoutGrid className="size-5" />, label: '전체', onClick: () => {} },
  ];

  const MenuRow = ({
    icon,
    label,
    danger = false,
    onClick,
  }: {
    icon: React.ReactNode;
    label: string;
    danger?: boolean;
    onClick?: () => void;
  }) => (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between px-standard py-lg transition-colors duration-150 hover:bg-surface-subtle active:bg-surface-subtle"
      aria-label={label}
    >
      <Inline gap="md" align="center">
        <span className={danger ? 'text-danger' : 'text-text-label'}>{icon}</span>
        <Typography
          variant="body"
          weight="medium"
          color={danger ? 'danger' : 'heading'}
        >
          {label}
        </Typography>
      </Inline>
      <ChevronRight
        className={`size-4 ${danger ? 'text-danger opacity-30' : 'text-text-muted'}`}
        aria-hidden
      />
    </button>
  );

  return (
    <div data-brand="hana" data-domain="card">
      <HomePageLayout
        title="내 카드 관리"
        withBottomNav
        activeId="all"
        bottomNavItems={bottomNavItems}
      >
        <Stack gap="xl">
          {/* Premium Card Visual Section */}
          <Stack gap="sm" align="center">
            {/* Card Visual */}
            <div
              className="relative w-full rounded-3xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #00696A 0%, #00A5A6 100%)',
                boxShadow: '0px 20px 40px rgba(0,105,106,0.15)',
                padding: '24px',
              }}
              aria-label={`${cardName} 카드`}
            >
              {/* Decorative circle */}
              <div
                className="absolute -bottom-8 -right-8 rounded-full pointer-events-none"
                style={{
                  width: 128,
                  height: 128,
                  background: 'rgba(255,255,255,0.05)',
                }}
                aria-hidden
              />

              {/* Top Row: Brand + Visa chip */}
              <Inline justify="between" align="center" className="mb-xl">
                <Stack gap="xs">
                  <Typography
                    variant="caption"
                    color="muted"
                    className="opacity-60"
                    style={{ letterSpacing: '0.6px', color: 'rgba(255,255,255,0.60)' }}
                  >
                    {/* Hana Card brand label */}
                    Hana Card
                  </Typography>
                  <Typography
                    variant="subheading"
                    weight="bold"
                    numeric
                    className="text-white"
                  >
                    {cardName}
                  </Typography>
                </Stack>

                {/* Card brand chip (Visa-like gold gradient) */}
                <div
                  className="flex items-center justify-center rounded-md"
                  style={{
                    width: 48,
                    height: 32,
                    background: 'rgba(202,238,93,0.20)',
                    border: '1px solid rgba(255,255,255,0.10)',
                  }}
                  aria-label={cardBrand}
                >
                  <div
                    className="rounded-sm"
                    style={{
                      width: 32,
                      height: 24,
                      background: 'linear-gradient(135deg, #FDE047 0%, #CA8A04 100%)',
                    }}
                    aria-hidden
                  />
                </div>
              </Inline>

              {/* Card Number & Footer */}
              <Stack gap="md">
                <Typography
                  variant="subheading"
                  numeric
                  className="text-white tracking-widest"
                >
                  {cardNumber}
                </Typography>

                <Inline justify="between" align="end">
                  {/* Mastercard-like overlapping circles */}
                  <div className="flex items-center" aria-label="카드 브랜드 마크">
                    <div
                      className="rounded-full"
                      style={{
                        width: 24,
                        height: 24,
                        background: 'rgba(255,255,255,0.10)',
                        border: '1px solid rgba(255,255,255,0.05)',
                      }}
                      aria-hidden
                    />
                    <div
                      className="rounded-full -ml-3"
                      style={{
                        width: 24,
                        height: 24,
                        background: 'rgba(255,255,255,0.20)',
                        border: '1px solid rgba(255,255,255,0.05)',
                      }}
                      aria-hidden
                    />
                  </div>

                  <Typography
                    variant="caption"
                    weight="bold"
                    className="opacity-80"
                    style={{ color: 'rgba(255,255,255,0.80)', letterSpacing: '-0.5px' }}
                  >
                    PLATINUM
                  </Typography>
                </Inline>
              </Stack>
            </div>

            {/* Overlapping Account Info Card */}
            <div
              className="w-full rounded-2xl bg-surface px-standard py-lg"
              style={{
                boxShadow: '0px 8px 24px rgba(0,105,106,0.06)',
                border: '1px solid rgba(189,201,200,0.10)',
              }}
            >
              <Stack gap="xs">
                <Inline gap="sm" align="center">
                  <CreditCard className="size-4 text-brand-text" aria-hidden />
                  <Typography variant="body" weight="medium" color="label">
                    연결 계좌: {linkedAccount}
                  </Typography>
                </Inline>

                <Inline justify="between" align="center">
                  <Inline gap="sm" align="center">
                    <Typography variant="subheading" weight="bold" numeric color="heading">
                      {balanceHidden ? '잔액: ***원' : `잔액: ${formatBalance(balance)}원`}
                    </Typography>
                    <button
                      onClick={() => setBalanceHidden(!balanceHidden)}
                      aria-label={balanceHidden ? '잔액 보기' : '잔액 숨기기'}
                      className="text-text-label"
                    >
                      {balanceHidden ? (
                        <Eye className="size-4" />
                      ) : (
                        <EyeOff className="size-4" />
                      )}
                    </button>
                  </Inline>

                  <button
                    className="flex items-center justify-center rounded-full px-md py-xs"
                    style={{ background: 'rgba(145,243,243,0.20)' }}
                    aria-label="카드 상세보기"
                  >
                    <Typography variant="caption" weight="bold" color="brand">
                      상세보기
                    </Typography>
                  </button>
                </Inline>
              </Stack>
            </div>
          </Stack>

          {/* Quick Actions Bento Grid */}
          <div className="grid grid-cols-3 gap-0 overflow-hidden rounded-xl">
            {quickActions.map((action, idx) => (
              <button
                key={idx}
                className="flex flex-col items-center justify-center bg-surface py-lg transition-colors duration-150 hover:bg-surface-subtle active:bg-surface-subtle"
                style={{ boxShadow: '0px 4px 12px rgba(0,105,106,0.03)' }}
                aria-label={action.label.replace('\n', ' ')}
              >
                <div
                  className="flex items-center justify-center rounded-full mb-sm"
                  style={{
                    width: 40,
                    height: 40,
                    background: 'rgba(145,243,243,0.10)',
                  }}
                  aria-hidden
                >
                  <span className="text-brand-text">{action.icon}</span>
                </div>
                <Typography
                  variant="caption"
                  weight="bold"
                  color="label"
                  className="text-center whitespace-pre-line leading-tight"
                >
                  {action.label}
                </Typography>
              </button>
            ))}
          </div>

          {/* Management Menu Sections */}
          <Stack gap="xl">
            {/* Security Section */}
            <Stack gap="md">
              <Typography
                variant="caption"
                weight="bold"
                color="secondary"
                className="px-xs"
                style={{ letterSpacing: '1.2px' }}
              >
                보안 및 이용
              </Typography>
              <div className="bg-surface rounded-xl overflow-hidden">
                {securityMenus.map((menu, idx) => (
                  <div key={idx}>
                    <MenuRow
                      icon={menu.icon}
                      label={menu.label}
                      danger={menu.danger}
                    />
                    {idx < securityMenus.length - 1 && (
                      <hr className="border-border-subtle mx-standard" aria-hidden />
                    )}
                  </div>
                ))}
              </div>
            </Stack>

            {/* Limits Section */}
            <Stack gap="md">
              <Typography
                variant="caption"
                weight="bold"
                color="secondary"
                className="px-xs"
                style={{ letterSpacing: '1.2px' }}
              >
                한도 관리
              </Typography>
              <div className="bg-surface rounded-xl overflow-hidden">
                {limitMenus.map((menu, idx) => (
                  <div key={idx}>
                    <MenuRow icon={menu.icon} label={menu.label} />
                    {idx < limitMenus.length - 1 && (
                      <hr className="border-border-subtle mx-standard" aria-hidden />
                    )}
                  </div>
                ))}
              </div>
            </Stack>

            {/* Services Section */}
            <Stack gap="md">
              <Typography
                variant="caption"
                weight="bold"
                color="secondary"
                className="px-xs"
                style={{ letterSpacing: '1.2px' }}
              >
                서비스
              </Typography>
              <div className="bg-surface rounded-xl overflow-hidden">
                {serviceMenus.map((menu, idx) => (
                  <div key={idx}>
                    <MenuRow icon={menu.icon} label={menu.label} />
                    {idx < serviceMenus.length - 1 && (
                      <hr className="border-border-subtle mx-standard" aria-hidden />
                    )}
                  </div>
                ))}
              </div>
            </Stack>
          </Stack>

          {/* Editorial Banner */}
          <button
            className="w-full flex items-center gap-lg rounded-3xl overflow-hidden text-left transition-opacity duration-150 hover:opacity-90 active:opacity-80"
            style={{
              background: '#CAEE5D',
              padding: '24px',
            }}
            aria-label="시그니처 카드 고객님을 위한 프리미엄 바우처 확인하기"
          >
            {/* Illustration placeholder */}
            <div
              className="shrink-0 rounded-2xl bg-brand-10"
              style={{ width: 114, height: 114 }}
              aria-hidden
            />

            {/* Text content */}
            <Stack gap="sm" className="flex-1">
              <div
                className="inline-flex items-center rounded-xs px-sm py-xs"
                style={{ background: '#546B00', width: 'fit-content' }}
              >
                <Typography
                  variant="caption"
                  weight="bold"
                  className="text-white"
                  style={{ fontSize: 10 }}
                >
                  HOT TIP
                </Typography>
              </div>

              <Typography
                variant="body"
                weight="bold"
                style={{ color: '#546B00', fontSize: 16, lineHeight: '20px' }}
              >
                시그니처 카드 고객님을 위한{'\n'}프리미엄 바우처가 도착했습니다.
              </Typography>

              <Typography
                variant="caption"
                style={{ color: 'rgba(84,107,0,0.70)' }}
              >
                지금 확인하고 혜택 받기
              </Typography>
            </Stack>
          </button>
        </Stack>
      </HomePageLayout>
    </div>
  );
}

const mockProps: CardManagementPageProps = {
  cardName: 'Hana Signature Card',
  cardNumber: '**** **** **** 8820',
  cardBrand: 'PLATINUM',
  linkedAccount: '하나은행 123-****-456',
  balance: 3200000,
};

export default function MainDashboard() {
  return <CardManagementPage {...mockProps} />;
}