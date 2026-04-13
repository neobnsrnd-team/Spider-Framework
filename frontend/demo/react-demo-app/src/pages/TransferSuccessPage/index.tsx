/**
 * @file index.tsx
 * @description 이체 완료 페이지.
 *
 * Figma 화면 구성 (node-id: 1:1641 — "Hana Bank Transfer Success"):
 * - 상단 헤더: "이체 완료" 타이틀 + 우측 닫기(×) 버튼
 * - 성공 히어로 섹션: Confetti 장식 + 성공 아이콘 + 결과 타이틀 + 부제목
 * - 이체 요약 카드: 받는 계좌 / 내 통장 표시 / 받는 분 통장 표시 + 이체 후 잔액 강조
 * - 보조 액션 링크: 카카오톡 공유 / 자주 쓰는 계좌 등록
 * - 하단 고정 버튼 바: 추가 이체(outline) + 확인(primary)
 *
 * 이 컴포넌트는 UI 레이아웃만 담당한다.
 * 상태 및 이벤트 핸들러는 useTransferSuccess Hook에서 처리한다.
 */

import { X, MessageSquare, Star } from 'lucide-react';
import {
  PageLayout,
  Stack,
  Inline,
  SuccessHero,
  ActionLinkItem,
  Button,
} from '@neobnsrnd-team/reactive-springware';
import { useTransferSuccess } from './useTransferSuccess';
import { TransferSummaryCard } from './TransferSummaryCard';

// ──────────────────────────────────────────────
// 금액 포맷 유틸리티
// ──────────────────────────────────────────────

/**
 * 숫자를 한국어 원화 표시 문자열로 변환한다.
 * @example formatKRW(50000) → "50,000원"
 */
function formatKRW(amount: number): string {
  return `${amount.toLocaleString('ko-KR')}원`;
}

// ──────────────────────────────────────────────
// 메인 페이지 컴포넌트
// ──────────────────────────────────────────────

/**
 * 이체 완료 페이지 컴포넌트.
 * useTransferSuccess Hook에서 데이터와 핸들러를 받아 UI를 렌더링한다.
 */
export function TransferSuccessPage() {
  const {
    data,
    handleAddTransfer,
    handleConfirm,
    handleShareKakao,
    handleSaveFavorite,
  } = useTransferSuccess();

  return (
    /* data-brand="hana": 하나은행 브랜드 토큰 적용 (청록색 계열) */
    /* data-domain="banking": 뱅킹 도메인 배경색 토큰 적용 */
    <div data-brand="hana" data-domain="banking">
      <PageLayout
        title="이체 완료"
        /* 뒤로가기 없이 닫기(×) 버튼만 제공 — 이체 완료 후 히스토리 스택에 남지 않도록 */
        rightAction={
          <Button
            variant="ghost"
            size="md"
            iconOnly
            leftIcon={<X className="size-4" />}
            onClick={handleConfirm}
            aria-label="닫기"
            className="text-text-heading"
          />
        }
        /* 하단 고정 버튼 바: 추가 이체 + 확인 */
        bottomBar={
          <Inline gap="sm">
            {/* 추가 이체: outline 스타일 — 보조 액션 */}
            <Button
              variant="outline"
              size="lg"
              onClick={handleAddTransfer}
              fullWidth
            >
              추가 이체
            </Button>
            {/* 확인: primary 스타일 — 주 액션, 더 넓게 표시 */}
            <Button
              variant="primary"
              size="lg"
              onClick={handleConfirm}
              fullWidth
            >
              확인
            </Button>
          </Inline>
        }
      >
        <Stack gap="lg">
          {/* ── 성공 히어로 섹션 ──────────────────────────
              Confetti 장식 + 성공 아이콘 + "{이름}님께 {금액} 이체 완료" */}
          <section>
            <SuccessHero
              recipientName={data.recipientName}
              amount={formatKRW(data.amount)}
            />
          </section>

          {/* ── 이체 요약 카드 섹션 ───────────────────────
              받는 계좌 / 내 통장 표시 / 받는 분 통장 표시 + 이체 후 잔액 강조 */}
          <section className="px-standard">
            <TransferSummaryCard
              targetAccount={data.targetAccount}
              myMemo={data.myMemo}
              recipientMemo={data.recipientMemo}
              balanceAfterTransfer={formatKRW(data.balanceAfterTransfer)}
            />
          </section>

          {/* ── 보조 액션 링크 섹션 ───────────────────────
              카카오톡 공유 / 자주 쓰는 계좌 등록 */}
          <section>
            <Stack gap="sm" className="px-standard">
              {/* 카카오톡 공유: 카카오 브랜드 노란색(#fee500) 배경 */}
              <ActionLinkItem
                icon={<MessageSquare className="size-5" />}
                iconBgClassName="bg-[#fee500] text-text-heading"
                label="이체 결과를 카카오톡으로 공유하기"
                onClick={handleShareKakao}
              />
              {/* 자주 쓰는 계좌 등록: 브랜드 청록색 반투명 배경 */}
              <ActionLinkItem
                icon={<Star className="size-5 text-brand-text" />}
                label="자주 쓰는 계좌로 등록하기"
                onClick={handleSaveFavorite}
              />
            </Stack>
          </section>
        </Stack>
      </PageLayout>
    </div>
  );
}
