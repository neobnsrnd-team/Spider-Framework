/**
 * @file TransferSummaryCard.tsx
 * @description 이체 완료 화면의 이체 요약 정보 카드 컴포넌트.
 *
 * 받는 계좌, 내 통장 표시, 받는 분 통장 표시 세 가지 정보를 행으로 나열하고,
 * 하단 강조 섹션에 이체 후 잔액을 브랜드 색상 배경으로 표시한다.
 *
 * @param targetAccount     - 받는 계좌 표시 문자열 (예: "국민 987-654-321012")
 * @param myMemo            - 내 통장 표시 메모 (예: "점심값")
 * @param recipientMemo     - 받는 분 통장 표시 메모 (예: "김하나")
 * @param balanceAfterTransfer - 이체 후 잔액 포맷 문자열 (예: "2,900,000원")
 */
import {
  Card,
  CardRowPlain,
  CardHighlight,
  Stack,
} from '@neobnsrnd-team/reactive-springware';

interface TransferSummaryCardProps {
  targetAccount:         string;
  myMemo:                string;
  recipientMemo:         string;
  /** 이체 후 잔액 — 이미 포맷된 문자열 (예: "2,900,000원") */
  balanceAfterTransfer:  string;
}

/**
 * 이체 요약 카드.
 * noPadding Card + Stack(padding 수동 부여) + CardHighlight 구성으로
 * 강조 섹션이 카드 좌우 경계까지 꽉 채워지도록 처리한다.
 */
export function TransferSummaryCard({
  targetAccount,
  myMemo,
  recipientMemo,
  balanceAfterTransfer,
}: TransferSummaryCardProps) {
  return (
    /* noPadding: 내부 padding을 직접 제어하여 CardHighlight가 카드 전체 너비를 채울 수 있도록 함 */
    <Card noPadding>
      {/* 이체 정보 행 목록 — p-standard로 내부 padding 직접 부여
          CardRowPlain: 행 간 구분선 없이 여백만으로 구분 */}
      <Stack gap="md" className="p-standard">
        <CardRowPlain label="받는 계좌"         value={targetAccount} />
        <CardRowPlain label="내 통장 표시"      value={myMemo} />
        <CardRowPlain label="받는 분 통장 표시" value={recipientMemo} />
      </Stack>

      {/* 이체 후 잔액 — 브랜드 청록색 배경의 강조 섹션 */}
      <CardHighlight
        label="이체 후 잔액"
        value={balanceAfterTransfer}
        /* 금액은 numeric font(Manrope)로 표시하여 숫자 가독성 향상 */
        valueClassName="font-numeric"
      />
    </Card>
  );
}
