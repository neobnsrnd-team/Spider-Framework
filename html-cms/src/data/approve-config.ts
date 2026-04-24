// src/data/approve-config.ts
// 승인 관리 화면 필터 설정 — 서버/클라이언트 양쪽에서 공유

import { getCodesByGroup } from '@/lib/codes';
import { APPROVE_DEFAULT_LABELS, type ApproveStateValue } from '@/components/ui/PageCard';

export type ApproveStateFilter = 'WORK' | 'PENDING' | 'APPROVED' | 'REJECTED';

/** null 제외 상태 값 목록 — URL 파라미터 유효성 검사용 */
export const APPROVE_STATE_VALUES: ApproveStateFilter[] = ['WORK', 'PENDING', 'APPROVED', 'REJECTED'];

/** FWK_CODE 조회 실패 시 사용하는 기본 필터 목록 */
const FALLBACK_FILTERS: { value: ApproveStateFilter | null; label: string }[] = [
    { value: null, label: '전체' },
    { value: 'PENDING', label: APPROVE_DEFAULT_LABELS.PENDING },
    { value: 'APPROVED', label: APPROVE_DEFAULT_LABELS.APPROVED },
    { value: 'REJECTED', label: APPROVE_DEFAULT_LABELS.REJECTED },
];

/**
 * FWK_CODE에서 CS00001 코드 목록을 조회해 필터 배열을 반환한다.
 * 서버 컴포넌트에서 호출. 조회 실패 시 FALLBACK_FILTERS 반환.
 */
export async function buildApproveFilters(): Promise<{ value: ApproveStateFilter | null; label: string }[]> {
    const codes = await getCodesByGroup('CS00001');
    if (codes.length === 0) return FALLBACK_FILTERS;

    const validValues = new Set<string>(APPROVE_STATE_VALUES);
    const codeFilters = codes
        .filter((c) => validValues.has(c.code))
        .map((c) => ({ value: c.code as ApproveStateFilter, label: c.codeName }));

    return [{ value: null, label: '전체' }, ...codeFilters];
}

/**
 * FWK_CODE에서 승인 상태 레이블 맵을 조회한다.
 * 서버 컴포넌트에서 PageCard approveLabels prop으로 전달.
 * 조회 실패 시 APPROVE_DEFAULT_LABELS 반환.
 */
export async function getApproveLabels(): Promise<Partial<Record<ApproveStateValue, string>>> {
    const codes = await getCodesByGroup('CS00001');
    if (codes.length === 0) return { ...APPROVE_DEFAULT_LABELS };

    const validValues = new Set<string>(APPROVE_STATE_VALUES);
    return Object.fromEntries(
        codes.filter((c) => validValues.has(c.code)).map((c) => [c.code, c.codeName]),
    ) as Partial<Record<ApproveStateValue, string>>;
}
