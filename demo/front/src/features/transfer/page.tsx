/**
 * @file page.tsx
 * @description 이체 폼 페이지.
 *
 * 레이아웃 구조:
 * PageLayout (타이틀: 이체, 뒤로가기)
 *   ├── Section "출금 계좌"  — AccountSelectorCard (fromAccountId 기반)
 *   ├── Section "받는 계좌"  — Input (formatPattern 계좌번호)
 *   ├── Section "이체 금액"  — Input (숫자, rightElement: amountDisplay)
 *   ├── Section "메모"       — Input (선택, 10자 이내)
 *   └── bottomBar           — 이체하기 Button (isValid 기반 disabled)
 *
 * URL: /transfer?fromAccountId=acc-001
 * 상태·검증: useTransferForm Hook (useTransferForm.ts)
 */

import { useSearchParams, useNavigate } from 'react-router-dom';
import { WalletMinimal } from 'lucide-react';
import {
  PageLayout,
  Stack,
  Section,
  Input,
  Button,
  AccountSelectorCard,
  LabelValueRow,
} from '@neobnsrnd-team/reactive-springware';
import { useTransferForm } from './useTransferForm';

export function TransferPage() {
  const navigate = useNavigate();
  // URL QueryParam에서 출금 계좌 ID 추출 — page는 파싱만, 나머지는 hook에 위임
  const [searchParams] = useSearchParams();
  const fromAccountId = searchParams.get('fromAccountId') ?? '';

  const {
    values,
    errors,
    touched,
    isValid,
    isSubmitting,
    availableBalance,
    amountDisplay,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useTransferForm(fromAccountId);

  return (
    <PageLayout
      title="이체"
      onBack={() => navigate(-1)}
      bottomBar={
        <Button
          variant="primary"
          size="lg"
          fullWidth
          loading={isSubmitting}
          disabled={!isValid}
          onClick={handleSubmit}
        >
          이체하기
        </Button>
      }
    >
      <Stack gap="lg" className="px-standard pb-standard">
        {/* ── 출금 계좌 ──────────────────────────────────────────────── */}
        <Section title="출금 계좌">
          <AccountSelectorCard
            accountName="하나 주거래 통장"
            accountNumber="123-456789-01207"
            icon={<WalletMinimal className="size-5" />}
            availableBalance={`출금가능금액: ${availableBalance.toLocaleString('ko-KR')}원`}
            onAccountChange={() => {
              /* TODO: 계좌 선택 시트 */
            }}
          />
        </Section>

        {/* ── 받는 계좌번호 ──────────────────────────────────────────── */}
        <Section title="받는 계좌">
          <Input
            label="계좌번호"
            placeholder="계좌번호를 입력하세요"
            /**
             * formatPattern: '#'=숫자 1자리, '-'=구분자.
             * Input 내부에서 자동 포맷하고 onChange에 포맷된 값을 전달한다.
             * 실제로는 은행마다 자릿수가 다르므로, 확정 후 패턴을 변경한다.
             */
            formatPattern="###-######-#####"
            value={values.accountNumber}
            onChange={(e) => handleChange('accountNumber', e.target.value)}
            onBlur={() => handleBlur('accountNumber')}
            validationState={touched.accountNumber && errors.accountNumber ? 'error' : 'default'}
            helperText={
              touched.accountNumber && errors.accountNumber
                ? errors.accountNumber
                : '은행 계좌번호 14자리'
            }
            fullWidth
          />
        </Section>

        {/* ── 이체 금액 ──────────────────────────────────────────────── */}
        <Section title="이체 금액">
          <Input
            label="금액"
            placeholder="금액을 입력하세요"
            inputMode="numeric"
            value={values.amount}
            onChange={(e) => {
              // 숫자만 허용 — 비숫자 문자 입력 무시
              const onlyNum = e.target.value.replace(/\D/g, '');
              handleChange('amount', onlyNum);
            }}
            onBlur={() => handleBlur('amount')}
            validationState={touched.amount && errors.amount ? 'error' : 'default'}
            helperText={touched.amount && errors.amount ? errors.amount : undefined}
            /**
             * rightElement: 입력한 숫자를 "X,XXX원" 형식으로 표시.
             * amountDisplay는 hook에서 계산하므로 page는 표시만 담당한다.
             */
            rightElement={
              amountDisplay ? (
                <span className="text-sm text-text-muted whitespace-nowrap">{amountDisplay}</span>
              ) : undefined
            }
            fullWidth
          />
          {/* 잔액 요약 — 에러 없는 정상 상태에서 출금 가능 금액 안내 */}
          {!errors.amount && (
            <LabelValueRow
              label="출금 가능"
              value={`${availableBalance.toLocaleString('ko-KR')}원`}
            />
          )}
        </Section>

        {/* ── 메모 (선택) ────────────────────────────────────────────── */}
        <Section title="메모">
          <Input
            label="내 통장 표시 (선택)"
            placeholder="최대 10자"
            value={values.memo}
            onChange={(e) => handleChange('memo', e.target.value)}
            onBlur={() => handleBlur('memo')}
            validationState={touched.memo && errors.memo ? 'error' : 'default'}
            helperText={touched.memo && errors.memo ? errors.memo : `${values.memo.length}/10`}
            fullWidth
          />
        </Section>
      </Stack>
    </PageLayout>
  );
}
