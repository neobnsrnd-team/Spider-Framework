/**
 * @file ImmediatePayConfirmSheet.tsx
 * @description 즉시결제 확인 바텀시트.
 *
 * PIN 입력 전, 결제 내용을 최종 확인하는 단계다.
 * 결제 요청 금액을 강조 표시하고 카드명·출금계좌·결제 후 이용가능한도를 상세 정보로 보여준다.
 *
 * @param open              - 바텀시트 표시 여부
 * @param payAmount         - 결제 요청 금액 (원)
 * @param cardName          - 결제 카드명
 * @param account           - 출금계좌 (마스킹 포함)
 * @param availableLimit    - 결제 후 이용가능한도 (원)
 * @param onClose           - 취소 버튼 / 외부 클릭 시 호출
 * @param onConfirm         - 결제하기 버튼 클릭 시 호출
 */
import { BottomSheet } from "@cl/modules/common/BottomSheet";
import { Button } from "@cl/core/Button";
import { Typography } from "@cl/core/Typography";
import { Divider } from "@cl/modules/common/Divider";
import { LabelValueRow } from "@cl/modules/common/LabelValueRow";

interface ImmediatePayConfirmSheetProps {
  open: boolean;
  /** 결제 요청 금액 (원) */
  payAmount: number;
  /** 결제 카드명 */
  cardName: string;
  /** 마스킹된 카드번호 */
  cardNumber: string;
  /** 출금계좌 (마스킹 포함) */
  account: string;
  /** 결제 후 이용가능한도 (원) */
  availableLimit: number;
  onClose: () => void;
  onConfirm: () => void;
}

/** 금액 포맷 (정수 → "1,234,567원") */
function formatAmount(n: number) {
  return `${n.toLocaleString("ko-KR")}원`;
}

export function ImmediatePayConfirmSheet({
  open,
  payAmount,
  cardName,
  cardNumber,
  account,
  availableLimit,
  onClose,
  onConfirm,
}: ImmediatePayConfirmSheetProps) {
  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      snap="auto"
      footer={
        <div className="flex gap-sm">
          <Button variant="outline" size="lg" fullWidth onClick={onClose}>
            취소
          </Button>
          <Button variant="primary" size="lg" fullWidth onClick={onConfirm}>
            결제하기
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-lg px-standard">
        {/* ── 결제 요청 금액 강조 ─────────────────────────────────
         * 사용자가 한눈에 금액을 확인할 수 있도록 중앙 정렬로 크게 표시 */}
        <div className="flex flex-col items-center gap-xs">
          <Typography variant="caption" color="muted">
            결제 요청 금액
          </Typography>
          <Typography variant="heading" weight="bold" color="brand" numeric>
            {formatAmount(payAmount)}
          </Typography>
        </div>

        <Divider />

        {/* ── 결제 상세 정보 ─────────────────────────────────────── */}
        <div className="flex flex-col gap-sm">
          <LabelValueRow label="카드명" value={cardName} />
          <LabelValueRow label="카드번호" value={cardNumber} />
          <LabelValueRow label="출금계좌" value={account} />
          <LabelValueRow
            label="결제 후 이용가능한도"
            value={formatAmount(availableLimit)}
          />
        </div>

        <Divider />

        {/* ── 안내 문구 ───────────────────────────────────────────
         * 결제하기 버튼을 누르기 전에 사용자가 내용을 다시 한번 확인할 수 있도록 안내한다. */}
        <Typography variant="body-sm" color="muted" className="text-center">
          결제하기 버튼을 누르시면 즉시결제가 진행됩니다.
        </Typography>
      </div>
    </BottomSheet>
  );
}
