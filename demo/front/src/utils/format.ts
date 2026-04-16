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
