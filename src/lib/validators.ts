// src/lib/validators.ts

/** bank ID, page ID 등 경로에 사용되는 식별자 검증 (영문 소문자·숫자·하이픈, 1~64자) */
export function isValidBankId(id: unknown): id is string {
    return typeof id === 'string' && /^[a-z0-9-]{1,64}$/.test(id);
}

/** 만료 여부 판단 — IS_PUBLIC='N' + EXPIRED_DATE 경과 */
export function isPageExpired(isPublic: string | null, expiredDate: Date | string | null): boolean {
    if (isPublic !== 'N' || expiredDate == null) return false;
    return new Date(expiredDate) < new Date();
}
