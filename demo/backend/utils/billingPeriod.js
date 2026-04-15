/**
 * @file billingPeriod.js
 * @description 하나카드 공식 결제일별 신용공여기간 계산 유틸리티 (개인회원 일시불·할부 기준).
 *
 * 출처: https://www.hanacard.co.kr/OSA15000000N.web
 *
 * ── 공식 규칙 (결제일 D, 결제월 M 기준) ─────────────────────────────────
 *
 *   [D ≤ 12]
 *     이용 기간 시작: (M-2)월 (D+18)일
 *     이용 기간 종료: (M-1)월 (D+17)일
 *     결제 예정일  :  M월      D 일
 *     e.g. D=1  → 전전월 19일 ~ 전월 18일 / 결제 당월 1일
 *          D=10 → 전전월 28일 ~ 전월 27일 / 결제 당월 10일
 *          D=12 → 전전월 30일 ~ 전월 29일 / 결제 당월 12일
 *
 *   [D = 13]
 *     이용 기간: 전월 1일 ~ 전월 말일
 *     결제 예정일: 당월 13일
 *
 *   [D ≥ 14]
 *     이용 기간 시작: (M-1)월 (D-12)일
 *     이용 기간 종료:  M월    (D-13)일
 *     결제 예정일  :  M월      D 일
 *     e.g. D=14 → 전월  2일 ~ 당월  1일 / 결제 당월 14일
 *          D=25 → 전월 13일 ~ 당월 12일 / 결제 당월 25일
 *          D=27 → 전월 15일 ~ 당월 14일 / 결제 당월 27일
 *
 * ── 결제월(M) 결정 기준 ──────────────────────────────────────────────────
 *   기준일(baseDate)이 속한 이용 기간의 결제월은 cutoff(기준일)로 판단한다.
 *
 *   cutoff = D+17   (D ≤ 12): baseDay ≤ D+17 → 결제월=당월, 초과 → 결제월=익월
 *   cutoff = 말일   (D = 13): baseDay ≤ 말일(항상 true) → 결제월=익월 (전월이 종료월)
 *   cutoff = D-13   (D ≥ 14): baseDay ≤ D-13 → 결제월=당월, 초과 → 결제월=익월
 *
 * ── 말일 클램프 ──────────────────────────────────────────────────────────
 *   계산된 일(day)이 해당 월 말일을 초과하면 말일로 클램프.
 *   e.g. D=12, 이용 종료: 전월 29일 → 전월이 2월이면 2월 28일(또는 29일)
 *
 * ── 지원 결제일 ──────────────────────────────────────────────────────────
 *   하나카드 개인회원: 1, 5, 7, 8, 10, 12, 13, 14, 15, 17, 18, 20, 21, 23, 25, 27
 *   범위 외 값 입력 시 경고를 출력하되 계산은 수행한다.
 *
 * @example
 *   const p = getBillingPeriod(new Date('2026-04-14'), 25);
 *   // p.fromDate          → '20260313'  (전월 13일)
 *   // p.toDate            → '20260412'  (당월 12일)
 *   // p.dueDateStr        → '20260425'  (당월 25일)
 *   // p.formatted.usageStart → '2026.03.13'
 *
 * @example
 *   getBillingPeriod(new Date('2026-04-14'), 1)
 *   // fromDate: '20260319', toDate: '20260418', dueDateStr: '20260501'
 */

"use strict";

// ── 내부 헬퍼 ────────────────────────────────────────────────────────────

/** 특정 연/월(1-based)의 마지막 날짜를 반환 */
function lastDayOfMonth(year, month) {
  return new Date(year, month, 0).getDate();
}

/**
 * (year, month)에 offset 개월을 더한 { year, month } 반환.
 * month는 1-based(1~12). 음수 offset도 올바르게 처리.
 */
function addMonths(year, month, offset) {
  const total = month - 1 + offset;
  const m0 = ((total % 12) + 12) % 12;
  return { year: year + Math.floor(total / 12), month: m0 + 1 };
}

/**
 * 지정 연/월/일로 Date 생성. day가 말일을 초과하면 말일로 클램프.
 * 예) createDate(2026, 2, 30) → 2026-02-28
 */
function createDate(year, month, day) {
  return new Date(year, month - 1, Math.min(day, lastDayOfMonth(year, month)));
}

/** Date → 'YYYYMMDD' 문자열 (DB WHERE 절 바인딩용) */
function toYYYYMMDD(d) {
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("");
}

/** Date → 'YYYY.MM.DD' 문자열 (화면 표시용) */
function toDisplayDate(d) {
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join(".");
}

// ── 공개 상수 ────────────────────────────────────────────────────────────

/** 하나카드 개인회원 결제일 선택 가능 목록 */
const VALID_PAYMENT_DAYS = new Set([1, 5, 7, 8, 10, 12, 13, 14, 15, 17, 18, 20, 21, 23, 25, 27]);

// ── 공개 함수 ────────────────────────────────────────────────────────────

/**
 * 기준 날짜(baseDate)와 카드 결제일(paymentDay)을 받아
 * 해당 날짜가 속한 이용 기간(시작~종료)과 결제 예정일을 반환한다.
 *
 * @param {Date}          baseDate   - 기준 날짜 (오늘 또는 이용일)
 * @param {number|string} paymentDay - 카드 결제일. 숫자 또는 숫자형 문자열.
 * @returns {{
 *   usageStart : Date,
 *   usageEnd   : Date,
 *   dueDate    : Date,
 *   fromDate   : string,  // 'YYYYMMDD' — DB 이용일자 >= 조건
 *   toDate     : string,  // 'YYYYMMDD' — DB 이용일자 <= 조건
 *   dueDateStr : string,  // 'YYYYMMDD'
 *   formatted  : { usageStart: string, usageEnd: string, dueDate: string }
 * }}
 *
 * @throws {RangeError} paymentDay가 1~31 범위를 벗어날 때
 */
function getBillingPeriod(baseDate, paymentDay) {
  const D = typeof paymentDay === "string" ? parseInt(paymentDay, 10) : paymentDay;
  if (!Number.isInteger(D) || D < 1 || D > 31) {
    throw new RangeError(
      `paymentDay는 1~31 사이의 정수여야 합니다. (입력값: ${paymentDay})`
    );
  }
  if (!VALID_PAYMENT_DAYS.has(D)) {
    console.warn(
      `[billingPeriod] 결제일 ${D}일은 하나카드 공식 결제일 목록에 없습니다. ` +
      `유효 결제일: ${[...VALID_PAYMENT_DAYS].join(", ")}`
    );
  }

  const baseYear  = baseDate.getFullYear();
  const baseMonth = baseDate.getMonth() + 1; // 1-based
  const baseDay   = baseDate.getDate();

  let usageStart, usageEnd, dueDate;

  if (D <= 12) {
    // ── [D ≤ 12] ──────────────────────────────────────────────────
    // 이용 종료일 = (결제월 M-1), D+17일
    // 이용 시작일 = (결제월 M-2), D+18일
    // 결제 예정일 = (결제월 M),   D일
    //
    // cutoff = D+17: baseDay ≤ D+17 → 결제월=당월, 초과 → 결제월=익월
    const payPart = baseDay <= D + 17
      ? { year: baseYear, month: baseMonth }
      : addMonths(baseYear, baseMonth, 1);

    const endPart   = addMonths(payPart.year, payPart.month, -1); // M-1
    const startPart = addMonths(payPart.year, payPart.month, -2); // M-2

    usageEnd   = createDate(endPart.year,   endPart.month,   D + 17);
    usageStart = createDate(startPart.year, startPart.month, D + 18);
    dueDate    = createDate(payPart.year,   payPart.month,   D);

  } else if (D === 13) {
    // ── [D = 13] ──────────────────────────────────────────────────
    // 이용 기간 = 전월 1일 ~ 전월 말일
    // 결제 예정일 = 당월 13일
    //
    // baseDate가 어느 날이든 이용 종료월 = 전월(즉, 결제월 = 익월)
    const payPart = addMonths(baseYear, baseMonth, 1); // 결제월 = 익월
    const endPart = { year: baseYear, month: baseMonth }; // 이용 종료월 = 전월

    usageStart = new Date(endPart.year, endPart.month - 1, 1);
    usageEnd   = createDate(endPart.year, endPart.month, lastDayOfMonth(endPart.year, endPart.month));
    dueDate    = createDate(payPart.year, payPart.month, 13);

  } else {
    // ── [D ≥ 14] ──────────────────────────────────────────────────
    // 이용 종료일 = (결제월 M),   D-13일
    // 이용 시작일 = (결제월 M-1), D-12일
    // 결제 예정일 = (결제월 M),   D일
    //
    // cutoff = D-13: baseDay ≤ D-13 → 결제월=당월, 초과 → 결제월=익월
    const payPart = baseDay <= D - 13
      ? { year: baseYear, month: baseMonth }
      : addMonths(baseYear, baseMonth, 1);

    const startPart = addMonths(payPart.year, payPart.month, -1); // M-1

    usageEnd   = createDate(payPart.year,   payPart.month,   D - 13);
    usageStart = createDate(startPart.year, startPart.month, D - 12);
    dueDate    = createDate(payPart.year,   payPart.month,   D);
  }

  return {
    usageStart,
    usageEnd,
    dueDate,
    /** DB "이용일자" >= 조건 바인딩용 YYYYMMDD 문자열 */
    fromDate:   toYYYYMMDD(usageStart),
    /** DB "이용일자" <= 조건 바인딩용 YYYYMMDD 문자열 */
    toDate:     toYYYYMMDD(usageEnd),
    dueDateStr: toYYYYMMDD(dueDate),
    formatted: {
      usageStart: toDisplayDate(usageStart),
      usageEnd:   toDisplayDate(usageEnd),
      dueDate:    toDisplayDate(dueDate),
    },
  };
}

/**
 * 청구월(targetMonth)과 결제일(paymentDay)로부터
 * 해당 청구월에 해당하는 이용 기간(시작~종료)을 역산한다.
 *
 * getBillingPeriod()의 역방향 계산:
 *   getBillingPeriod        : 이용일(baseDate) + 결제일 → 결제예정일 산출  (forward)
 *   getBillingPeriodForMonth: 청구월(targetMonth) + 결제일 → 이용 기간 역산 (reverse)
 *
 * ── 역산 공식 (getBillingPeriod와 대칭) ──────────────────────────────────
 *   [D ≤ 12]  이용 시작: (M-2)월 (D+18)일  /  이용 종료: (M-1)월 (D+17)일
 *   [D = 13]  이용 시작: (M-1)월  1일       /  이용 종료: (M-1)월 말일
 *   [D ≥ 14]  이용 시작: (M-1)월 (D-12)일  /  이용 종료:  M월   (D-13)일
 *
 * @param {string}         targetMonth - "YYYY-MM" 형식의 청구월
 * @param {number|string}  paymentDay  - 카드 결제일 (1~31)
 * @returns {{
 *   usageStart : Date,
 *   usageEnd   : Date,
 *   fromDate   : string,  // 'YYYYMMDD' — DB "이용일자" >= 조건
 *   toDate     : string,  // 'YYYYMMDD' — DB "이용일자" <= 조건
 *   formatted  : { usageStart: string, usageEnd: string }
 * }}
 *
 * @example
 *   getBillingPeriodForMonth('2026-04', 25)
 *   // fromDate: '20260313', toDate: '20260412'  (전월 13일 ~ 당월 12일)
 *
 *   getBillingPeriodForMonth('2026-04', 1)
 *   // fromDate: '20260219', toDate: '20260318'  (전전월 19일 ~ 전월 18일)
 *
 *   getBillingPeriodForMonth('2026-04', 13)
 *   // fromDate: '20260301', toDate: '20260331'  (전월 1일 ~ 전월 말일)
 */
function getBillingPeriodForMonth(targetMonth, paymentDay) {
  const [y, m] = targetMonth.split("-").map(Number);
  const D = typeof paymentDay === "string" ? parseInt(paymentDay, 10) : paymentDay;

  if (!Number.isInteger(D) || D < 1 || D > 31) {
    throw new RangeError(
      `paymentDay는 1~31 사이의 정수여야 합니다. (입력값: ${paymentDay})`,
    );
  }
  if (!VALID_PAYMENT_DAYS.has(D)) {
    console.warn(
      `[billingPeriod] 결제일 ${D}일은 하나카드 공식 결제일 목록에 없습니다.`,
    );
  }

  let usageStart, usageEnd;

  if (D <= 12) {
    // 이용 시작: (M-2)월 (D+18)일
    // 이용 종료: (M-1)월 (D+17)일
    const startPart = addMonths(y, m, -2);
    const endPart   = addMonths(y, m, -1);
    usageStart = createDate(startPart.year, startPart.month, D + 18);
    usageEnd   = createDate(endPart.year,   endPart.month,   D + 17);
  } else if (D === 13) {
    // 이용 시작: (M-1)월 1일
    // 이용 종료: (M-1)월 말일
    const prevPart = addMonths(y, m, -1);
    usageStart = new Date(prevPart.year, prevPart.month - 1, 1);
    usageEnd   = createDate(
      prevPart.year,
      prevPart.month,
      lastDayOfMonth(prevPart.year, prevPart.month),
    );
  } else {
    // D ≥ 14
    // 이용 시작: (M-1)월 (D-12)일
    // 이용 종료:  M월   (D-13)일
    const prevPart = addMonths(y, m, -1);
    usageStart = createDate(prevPart.year, prevPart.month, D - 12);
    usageEnd   = createDate(y, m, D - 13);
  }

  return {
    usageStart,
    usageEnd,
    /** DB "이용일자" >= 조건 바인딩용 YYYYMMDD */
    fromDate:  toYYYYMMDD(usageStart),
    /** DB "이용일자" <= 조건 바인딩용 YYYYMMDD */
    toDate:    toYYYYMMDD(usageEnd),
    formatted: {
      usageStart: toDisplayDate(usageStart),
      usageEnd:   toDisplayDate(usageEnd),
    },
  };
}

module.exports = { getBillingPeriod, getBillingPeriodForMonth, VALID_PAYMENT_DAYS };
