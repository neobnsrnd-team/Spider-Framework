/**
 * @file cardMocks.tsx
 * @description 카드 관련 페이지 개발·데모용 Mock 데이터 모음.
 *
 * 실제 API 연동 전까지 RouteWrappers.tsx 에서 참조하는 임시 데이터다.
 * API 연동 시 이 파일의 상수를 Repository 호출 결과로 교체한다.
 *
 * JSX를 포함(카드 이미지, 아이콘)하므로 확장자를 .tsx 로 유지한다.
 */
import { CreditCard } from 'lucide-react';
import type { Transaction } from '@/pages/card/UsageHistoryPage/types';
import type { UserItem }    from '@/pages/card/UserManagementPage/types';

/* ------------------------------------------------------------------ */
/* 이용내역                                                              */
/* ------------------------------------------------------------------ */

export const MOCK_TRANSACTIONS: Transaction[] = Array.from({ length: 25 }, (_, i) => ({
  id:             `tx-${i + 1}`,
  merchant:       ['스타벅스 강남점', '이마트 역삼점', 'GS25 테헤란로점', '올리브영 강남', '맥도날드 삼성점'][i % 5],
  amount:         i === 3 ? -15000 : (i + 1) * 13500,
  date:           `2026.04.${String(i + 1).padStart(2, '0')}`,
  type:           i % 4 === 0 ? '할부(3개월)' : i % 4 === 3 ? '취소' : '일시불',
  approvalNumber: `2026${String(i + 1).padStart(8, '0')}`,
  status:         i % 4 === 3 ? '취소' : i % 3 === 0 ? '결제확정' : '승인',
  cardName:       i % 2 === 0 ? '하나 머니 체크카드' : '하나 플래티넘 신용카드',
}));

/* ------------------------------------------------------------------ */
/* 카드 목록                                                             */
/* ------------------------------------------------------------------ */

export const MOCK_CARD_OPTIONS = [
  { value: 'card-1', label: '하나 머니 체크카드' },
  { value: 'card-2', label: '하나 플래티넘 신용카드' },
];

/** 카드 슬라이더용 — 이미지(JSX)·잔액 포함 */
export const MOCK_CARDS_VISUAL = [
  {
    id:      'card-1',
    name:    '하나 머니 체크카드',
    brand:   'VISA' as const,
    image:   <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#008485,#14b8a6)', borderRadius: 12 }} />,
    balance: 1_200_000,
  },
  {
    id:      'card-2',
    name:    '하나 플래티넘 신용카드',
    brand:   'Mastercard' as const,
    image:   <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg,#1a1a2e,#16213e)', borderRadius: 12 }} />,
    balance: 850_000,
  },
];

/** 선택 드롭다운용 — 마스킹 번호만 포함 */
export const MOCK_CARDS_SIMPLE = [
  { id: 'card-1', name: '하나 머니 체크카드',      maskedNumber: '1234-56**-****-7890' },
  { id: 'card-2', name: '하나 플래티넘 신용카드', maskedNumber: '9876-54**-****-3210' },
];

/* ------------------------------------------------------------------ */
/* 사용자 관리                                                           */
/* ------------------------------------------------------------------ */

export const MOCK_USERS: UserItem[] = [
  { id: '1', userId: 'admin01',  userName: '김관리자', pwErrorCount: 0, status: 'normal'     },
  { id: '2', userId: 'user01',   userName: '이사용자', pwErrorCount: 2, status: 'normal'     },
  { id: '3', userId: 'user02',   userName: '박사용자', pwErrorCount: 5, status: 'terminated' },
  { id: '4', userId: 'manager1', userName: '최매니저', pwErrorCount: 1, status: 'normal'     },
];

/* ------------------------------------------------------------------ */
/* 카드 관리                                                             */
/* ------------------------------------------------------------------ */

export const MOCK_MANAGEMENT_ROWS = [
  { label: '카드정보 확인',          subText: '1234 **** **** 5678',   onClick: () => {} },
  { label: '결제계좌',               subText: '하나은행 123-****-5678', onClick: () => {} },
  { label: '카드 비밀번호 설정',     onClick: () => {} },
  { label: '해외 결제 신청',         onClick: () => {} },
  { label: '이용한도 조회/변경',     onClick: () => {} },
  { label: '분실/도난 신고',         onClick: () => {} },
  { label: '카드 재발급 신청',       onClick: () => {} },
  { label: '카드이용정지 등록/해제', onClick: () => {} },
  { label: '카드 해지',              onClick: () => {} },
];

/* ------------------------------------------------------------------ */
/* 결제 내역 / 명세서                                                    */
/* ------------------------------------------------------------------ */

export const MOCK_PAYMENT_ITEMS = [
  {
    id:            'item-1',
    icon:          <CreditCard size={18} />,
    cardEnName:    'HANA MONEY CHECK',
    cardName:      '하나 머니 체크카드',
    amount:        150000,
    onDetailClick: () => {},
  },
  {
    id:            'item-2',
    icon:          <CreditCard size={18} />,
    cardEnName:    'HANA PLATINUM CREDIT',
    cardName:      '하나 플래티넘 신용카드',
    amount:        200000,
    onDetailClick: () => {},
  },
];

export const MOCK_INFO_SECTIONS = [
  {
    title: '결제정보',
    rows: [
      { label: '결제 계좌', value: '하나은행\n123456****1234' },
      { label: '결제일',   value: '매월 14일' },
    ],
  },
];

/* ------------------------------------------------------------------ */
/* 즉시결제 안내 주의사항                                                 */
/* ------------------------------------------------------------------ */

export const MOCK_CAUTIONS = [
  {
    title:   '출금 제한 안내',
    content: '출금 가능 시간 이외에는 즉시결제 서비스를 이용하실 수 없습니다.',
  },
  {
    title:   '결제 취소 안내',
    content: '즉시결제(선결제) 후에는 취소가 불가합니다.',
  },
];
