'use strict';

/**
 * @file utils/cardBrand.js
 * @description 카드번호(IIN/BIN) 기반 브랜드 식별 유틸리티
 *
 * 숫자만 추출 후 앞자리 패턴을 순서대로 검사합니다.
 * 범위가 좁은(더 구체적인) 규칙을 먼저 배치해야 오판을 막을 수 있습니다.
 */

/** 지원 브랜드 상수 */
// 값을 프론트 CardBrand 타입과 일치시킵니다: 'VISA' | 'Mastercard' | 'AMEX' | 'JCB' | 'UnionPay'
const BRAND = Object.freeze({
  VISA:       'VISA',
  MASTERCARD: 'Mastercard',
  AMEX:       'AMEX',
  DISCOVER:   'Discover',   // CardBrand 외 — 프론트에서 Unknown 처리
  JCB:        'JCB',
  UNIONPAY:   'UnionPay',
  DINERS:     'Diners Club', // CardBrand 외 — 프론트에서 Unknown 처리
  UNKNOWN:    'Unknown',
});

/**
 * 카드번호에서 브랜드를 식별합니다.
 *
 * @param {string|number} cardNumber - 카드번호 (하이픈·공백 포함 가능)
 * @returns {string} BRAND 상수 중 하나
 *
 * @example
 * detectBrand('4111-1111-1111-1111') // 'Visa'
 * detectBrand('5500000000000004')     // 'Mastercard'
 * detectBrand('378282246310005')      // 'Amex'
 */
function detectBrand(cardNumber) {
  // 숫자만 추출
  const num = String(cardNumber).replace(/\D/g, '');
  if (!num) return BRAND.UNKNOWN;

  const len = num.length;

  // ── Amex (15자리, 34/37 시작) ────────────────────────────────────────────
  if (/^3[47]/.test(num) && len === 15) return BRAND.AMEX;

  // ── Diners Club (14자리) ─────────────────────────────────────────────────
  if (/^30[0-5]/.test(num) && len === 14) return BRAND.DINERS;
  if (/^3[68]/.test(num)   && len === 14) return BRAND.DINERS;

  // ── JCB (16자리, 3528–3589) ──────────────────────────────────────────────
  if (len === 16) {
    const prefix4 = parseInt(num.slice(0, 4), 10);
    if (prefix4 >= 3528 && prefix4 <= 3589) return BRAND.JCB;
  }

  // ── Discover ─────────────────────────────────────────────────────────────
  if (/^6011/.test(num)) return BRAND.DISCOVER;
  if (/^65/.test(num))   return BRAND.DISCOVER;
  if (/^64[4-9]/.test(num)) return BRAND.DISCOVER;
  // China UnionPay 와 겹치는 622126–622925 범위 → Discover 우선
  if (len >= 6) {
    const prefix6 = parseInt(num.slice(0, 6), 10);
    if (prefix6 >= 622126 && prefix6 <= 622925) return BRAND.DISCOVER;
  }

  // ── UnionPay (62 시작, Discover 범위 제외 후) ────────────────────────────
  if (/^62/.test(num)) return BRAND.UNIONPAY;

  // ── Mastercard ───────────────────────────────────────────────────────────
  // 전통 범위: 51–55
  if (/^5[1-5]/.test(num) && len === 16) return BRAND.MASTERCARD;
  // 신규 범위: 2221–2720
  if (len >= 4) {
    const prefix4 = parseInt(num.slice(0, 4), 10);
    if (prefix4 >= 2221 && prefix4 <= 2720 && len === 16) return BRAND.MASTERCARD;
  }

  // ── Visa (4 시작, 13/16/19자리) ──────────────────────────────────────────
  if (/^4/.test(num) && [13, 16, 19].includes(len)) return BRAND.VISA;

  return BRAND.UNKNOWN;
}

/**
 * 카드번호를 마스킹합니다.
 * Amex(15자리)는 4-6-5, 그 외는 4-4-4-4 포맷을 따릅니다.
 *
 * @param {string|number} cardNumber
 * @returns {string} 예) '4111-11**-****-1111'
 */
function maskCardNumber(cardNumber) {
  const num = String(cardNumber).replace(/\D/g, '');
  if (!num) return '';

  if (num.length === 15) {
    // Amex: XXXX-XXXXXX-XXXXX → 앞 4 + 중간 2자리 노출, 나머지 마스킹, 뒤 4 노출
    return `${num.slice(0, 4)}-${num.slice(4, 6)}****-*${num.slice(11)}`;
  }

  // 16자리 기준 4-4-4-4
  const padded = num.padEnd(16, '0');
  return [
    padded.slice(0, 4),
    padded.slice(4, 6) + '**',
    '****',
    padded.slice(12, 16),
  ].join('-');
}

module.exports = { detectBrand, maskCardNumber, BRAND };
