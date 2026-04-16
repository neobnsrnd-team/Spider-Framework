/**
 * @file format.ts
 * @description 공통 포맷 유틸리티 함수 모음
 *
 * @example
 *   formatAmount(10000) // → "10,000원"
 */

/**
 * 숫자 금액을 한국어 통화 표기(원)로 변환한다.
 * @param n - 원 단위 정수 금액
 * @returns "1,234원" 형태 문자열
 */
export function formatAmount(n: number): string {
  return `${n.toLocaleString('ko-KR')}원`;
}

/**
 * 계좌번호를 마스킹한다.
 *
 * 하이픈이 있는 경우 첫 번째·마지막 구간만 노출하고 중간 구간을 마스킹한다.
 * 하이픈이 없는 경우 앞 3자리와 뒤 4자리만 노출한다.
 *
 * @param account - 원본 계좌번호. 예: '123-456789-01234' 또는 '1234567890123'
 * @returns 마스킹된 계좌번호. 예: '123-******-01234' 또는 '123******0123'
 */
export function maskAccountNumber(account: string): string {
  if (!account) return '';

  const parts = account.split('-');
  if (parts.length >= 3) {
    // 하이픈이 2개 이상인 경우: 첫·마지막 구간 유지, 중간 구간을 같은 길이의 * 로 치환
    // e.g. '123-456789-01234' → '123-******-01234'
    const masked = parts.slice(1, -1).map((p) => '*'.repeat(p.length));
    return [parts[0], ...masked, parts[parts.length - 1]].join('-');
  }

  // 하이픈이 없거나 1개인 경우: 숫자만 추출 후 앞 3자리·뒤 4자리 유지
  // e.g. '1234567890123' → '123******0123'
  const digits = account.replace(/\D/g, '');
  if (digits.length <= 7) return account; // 너무 짧으면 마스킹 생략
  return digits.slice(0, 3) + '*'.repeat(digits.length - 7) + digits.slice(-4);
}
