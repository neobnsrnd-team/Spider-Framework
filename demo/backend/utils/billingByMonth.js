/**
 * @file billingByMonth.js
 * @description 카드별 개별 결제일 기반 청구월 필터링 유틸리티.
 *
 * ── 두 가지 접근 방식 ────────────────────────────────────────────────────────
 *
 *   [Forward — getItemBillingMonth]
 *     이용일자 + 결제일 → 청구월 산출
 *     "이 이용이 몇 월에 청구되나?" 를 건별로 판단할 때 사용.
 *
 *   [Reverse — getBillingPeriodForMonth 기반]
 *     청구월 + 결제일 → 이용 기간(startDate ~ endDate) 역산 후 범위 비교
 *     "이 청구월에 포함될 이용내역은 뭔가?" 를 효율적으로 필터링할 때 사용.
 *     getBillingSummaryByMonth / getPaymentExpectedList 가 이 방식을 채택한다.
 *
 * ── 역산 방식의 장점 ─────────────────────────────────────────────────────────
 *   - 카드(결제일)의 종류(N)만큼만 getBillingPeriodForMonth를 호출하고
 *     이후 필터링은 YYYYMMDD 문자열 비교(O(1))로 처리 → 항목 수에 비례하지 않음
 *   - 동일 결제일의 기간은 periodCache로 중복 계산 방지
 */

"use strict";

const { getBillingPeriod, getBillingPeriodForMonth } = require("./billingPeriod");

/** cardSettings에 카드번호가 없을 때 사용할 기본 결제일 */
const DEFAULT_PAYMENT_DAY = 25;

// ── 내부 헬퍼 ────────────────────────────────────────────────────────────────

/**
 * "YYYYMMDD" 문자열 → Date 객체
 * @param {string} s
 * @returns {Date}
 */
function parseYYYYMMDD(s) {
  return new Date(
    parseInt(s.slice(0, 4), 10),
    parseInt(s.slice(4, 6), 10) - 1,
    parseInt(s.slice(6, 8), 10),
  );
}

// ── 공개 함수 (Forward) ──────────────────────────────────────────────────────

/**
 * 이용일자(YYYYMMDD)와 카드 결제일(paymentDay)을 받아
 * 해당 이용이 속하는 청구월("YYYY-MM")을 반환한다. (Forward 방식)
 *
 * @param {string}        useDate    - "YYYYMMDD"
 * @param {number|string} paymentDay - 카드 결제일 (1~31)
 * @returns {string} "YYYY-MM"
 *
 * @example
 *   getItemBillingMonth('20260314', 25) // '2026-04'  (3월 14일 → 4월 청구)
 *   getItemBillingMonth('20260312', 25) // '2026-03'  (3월 12일 → 3월 청구)
 *   getItemBillingMonth('20260314',  1) // '2026-05'  (3월 14일 → 5월 청구)
 */
function getItemBillingMonth(useDate, paymentDay) {
  const useDateObj = parseYYYYMMDD(useDate);
  const { dueDate } = getBillingPeriod(useDateObj, paymentDay);
  const y = dueDate.getFullYear();
  const m = String(dueDate.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

/**
 * 이용내역 단건의 청구월을 cardSettings를 참조하여 반환한다.
 *
 * @param {{ cardNo: string, useDate: string }} item
 * @param {Record<string, number>} cardSettings - { 카드번호: 결제일 }
 * @returns {string} "YYYY-MM"
 */
function calculateItemBillingMonth(item, cardSettings) {
  const paymentDay = cardSettings[item.cardNo] ?? DEFAULT_PAYMENT_DAY;
  return getItemBillingMonth(item.useDate, paymentDay);
}

// ── 공개 함수 (Reverse) ──────────────────────────────────────────────────────

/**
 * getBillingSummaryByMonth
 * 역산 방식으로 targetMonth에 청구될 이용내역을 필터링한다.
 *
 * 동작:
 *   1. 고유 결제일(paymentDay)별로 getBillingPeriodForMonth를 한 번씩만 호출해
 *      이용 기간(fromDate ~ toDate)을 캐시한다.
 *   2. 각 항목의 useDate가 해당 카드의 이용 기간 내에 있는지 문자열 비교로 필터링한다.
 *      (YYYYMMDD는 사전식 정렬 = 날짜 순이므로 >=, <= 비교 가능)
 *
 * @param {Array<{
 *   cardNo:   string,
 *   cardName: string,
 *   useDate:  string,  // "YYYYMMDD"
 *   amount:   number,
 *   dueDate?: string,
 * }>} allItems
 *
 * @param {string}                targetMonth  - "YYYY-MM"
 * @param {Record<string,number>} cardSettings - { 카드번호: 결제일 }
 *
 * @returns {{
 *   targetMonth:  string,
 *   totalAmount:  number,
 *   byCard: Array<{
 *     cardNo, cardName, paymentDay,
 *     billingStart, billingEnd,
 *     totalAmount, items
 *   }>,
 *   items: Array,
 * }}
 *
 * @example
 *   // 2026-04 청구월, D=25 카드
 *   // billingStart='2026.03.13', billingEnd='2026.04.12' 범위 항목만 포함
 *   getBillingSummaryByMonth(allItems, '2026-04', { '4531...': 25, '5412...': 1 })
 */
function getBillingSummaryByMonth(allItems, targetMonth, cardSettings) {
  // ── 결제일(paymentDay)별 이용 기간 캐시 ────────────────────────────────
  // 같은 결제일 카드가 여러 장이어도 getBillingPeriodForMonth는 한 번만 호출됨
  const periodCache = new Map();

  function getPeriod(paymentDay) {
    if (!periodCache.has(paymentDay)) {
      periodCache.set(paymentDay, getBillingPeriodForMonth(targetMonth, paymentDay));
    }
    return periodCache.get(paymentDay);
  }

  // ── useDate 범위 기반 필터링 + 카드별 집계 ─────────────────────────────
  /** @type {Map<string, { cardNo, cardName, paymentDay, billingStart, billingEnd, totalAmount, items }>} */
  const cardMap = new Map();

  for (const item of allItems) {
    const paymentDay = cardSettings[item.cardNo] ?? DEFAULT_PAYMENT_DAY;
    let period;
    try {
      period = getPeriod(paymentDay);
    } catch {
      continue; // 결제일 파싱 실패 시 해당 항목 제외
    }

    // YYYYMMDD 문자열은 사전식 정렬 = 날짜 순 → 부등호 비교 가능
    if (item.useDate < period.fromDate || item.useDate > period.toDate) continue;

    if (!cardMap.has(item.cardNo)) {
      cardMap.set(item.cardNo, {
        cardNo:       item.cardNo,
        cardName:     item.cardName,
        paymentDay,
        billingStart: period.formatted.usageStart,
        billingEnd:   period.formatted.usageEnd,
        totalAmount:  0,
        items:        [],
      });
    }
    const entry = cardMap.get(item.cardNo);
    entry.totalAmount += item.amount;
    entry.items.push(item);
  }

  const byCard       = [...cardMap.values()];
  const totalAmount  = byCard.reduce((sum, c) => sum + c.totalAmount, 0);
  const filteredItems = byCard.flatMap((c) => c.items);

  return { targetMonth, totalAmount, byCard, items: filteredItems };
}

/**
 * getPaymentExpectedList
 * 카드 중심(cardData) 구조로 yearMonth 청구 내역을 필터링한다.
 *
 * getBillingSummaryByMonth가 flat items + cardSettings 구조를 받는 반면,
 * 이 함수는 카드별로 items가 내장된 구조를 받는다.
 *
 * 역산 단계:
 *   1. yearMonth + card.paymentDay → getBillingPeriodForMonth로 이용 기간 계산
 *   2. item.useDate 가 [fromDate, toDate] 범위 내인지 체크
 *
 * @param {string} yearMonth - "YYYY-MM"
 * @param {Array<{
 *   cardNo:     string,
 *   cardName:   string,
 *   paymentDay: number,
 *   items:      Array<{ useDate: string, amount: number, [key: string]: any }>
 * }>} cardData - 카드별 이용내역 (카드 중심 구조)
 *
 * @returns {{
 *   yearMonth:   string,
 *   totalAmount: number,
 *   byCard: Array<{
 *     cardNo:       string,
 *     cardName:     string,
 *     paymentDay:   number,
 *     billingStart: string,  // 'YYYY.MM.DD'
 *     billingEnd:   string,
 *     totalAmount:  number,
 *     items:        Array,
 *   }>
 * }}
 *
 * @example — 2026-04 선택 시 각 카드별 이용 기간
 *   트래블로그 (D=25) : 2026.03.13 ~ 2026.04.12
 *   JADE First  (D=1) : 2026.02.19 ~ 2026.03.18
 *   아멕스 골드(D=10) : 2026.02.28 ~ 2026.03.27
 *
 *   item { cardNo: 트래블로그, useDate: '20260315', amount: 50000 }
 *     → 2026.03.13 ~ 2026.04.12 내 → 4월 청구 포함 ✓
 *
 *   item { cardNo: JADE First, useDate: '20260315', amount: 100000 }
 *     → 2026.02.19 ~ 2026.03.18 내 → 4월 청구 포함 ✓
 *
 *   item { cardNo: JADE First, useDate: '20260319', amount: 30000 }
 *     → 2026.03.19 > 2026.03.18 → 4월 청구 제외 ✗ (5월 청구분)
 */
function getPaymentExpectedList(yearMonth, cardData) {
  let grandTotal = 0;

  const byCard = cardData.map((card) => {
    const { fromDate, toDate, formatted } = getBillingPeriodForMonth(
      yearMonth,
      card.paymentDay,
    );

    // YYYYMMDD 문자열 비교로 범위 필터링
    const filteredItems = (card.items ?? []).filter(
      (item) => item.useDate >= fromDate && item.useDate <= toDate,
    );

    const cardTotal = filteredItems.reduce((sum, i) => sum + i.amount, 0);
    grandTotal += cardTotal;

    return {
      cardNo:       card.cardNo,
      cardName:     card.cardName,
      paymentDay:   card.paymentDay,
      billingStart: formatted.usageStart, // 이용 시작일 'YYYY.MM.DD'
      billingEnd:   formatted.usageEnd,   // 이용 종료일 'YYYY.MM.DD'
      totalAmount:  cardTotal,
      items:        filteredItems,
    };
  });

  return { yearMonth, totalAmount: grandTotal, byCard };
}

/**
 * calculateRemainingAmount
 * 대시보드용 '남은 결제 예정 금액' 산출 함수.
 *
 * getBillingSummaryByMonth / getPaymentExpectedList의 반환값(paymentData)을 받아
 * 오늘(currentDate)을 기준으로 각 카드의 결제 예정일(dueDate)을 계산하고
 * paid(결제일 경과) / remaining(결제 예정) 으로 분류한다.
 *
 * ── dueDate 계산 방법 ────────────────────────────────────────────────────────
 *   dueDate = yearMonth의 연/월 + 카드 결제일(paymentDay)
 *   e.g. yearMonth='2026-04', paymentDay=25 → dueDate=2026-04-25
 *   말일 초과 클램프: paymentDay=31이고 해당 월이 30일이면 30일로 처리
 *
 * ── 분류 기준 ────────────────────────────────────────────────────────────────
 *   dueDate <  오늘(currentDate) 00:00 → paid     (결제일 경과, 합산 제외)
 *   dueDate >= 오늘(currentDate) 00:00 → remaining (오늘 포함 결제 예정)
 *
 * @param {{
 *   targetMonth?: string,       // "YYYY-MM" — getBillingSummaryByMonth 반환 시 포함
 *   yearMonth?:   string,       // "YYYY-MM" — getPaymentExpectedList  반환 시 포함
 *   totalAmount:  number,
 *   byCard: Array<{
 *     cardNo:      string,
 *     cardName:    string,
 *     paymentDay:  number,
 *     totalAmount: number,
 *     items:       Array,
 *   }>
 * }} paymentData - getBillingSummaryByMonth 또는 getPaymentExpectedList 의 반환값
 *
 * @param {Date} [currentDate=new Date()] - 기준일 (기본: 오늘. 테스트 시 주입 가능)
 *
 * @returns {{
 *   yearMonth:        string,
 *   totalAmount:      number,
 *   paidAmount:       number,   // 결제일 경과 금액
 *   remainingAmount:  number,   // 남은 결제 예정 금액
 *   byCard: Array<{
 *     cardNo:     string,
 *     cardName:   string,
 *     paymentDay: number,
 *     dueDate:    string,   // 'YYYY.MM.DD'
 *     status:     'paid' | 'remaining',
 *     amount:     number,
 *   }>
 * }}
 *
 * @example
 *   // 오늘: 2026-04-14
 *   // yearMonth: '2026-04'
 *   // Card A: paymentDay=10, amount=500,000
 *   //   dueDate=2026-04-10 < 2026-04-14 → paid
 *   // Card B: paymentDay=25, amount=1,200,000
 *   //   dueDate=2026-04-25 >= 2026-04-14 → remaining
 *   //
 *   // 결과:
 *   //   totalAmount    = 1,700,000
 *   //   paidAmount     =   500,000
 *   //   remainingAmount = 1,200,000
 */
function calculateRemainingAmount(paymentData, currentDate = new Date()) {
  // targetMonth(getBillingSummaryByMonth) 또는 yearMonth(getPaymentExpectedList) 둘 다 수용
  const yearMonth = paymentData.targetMonth ?? paymentData.yearMonth;
  const [y, m]    = yearMonth.split("-").map(Number);

  // 오늘 00:00 기준 — 시간 차이로 인한 오판 방지
  const today = new Date(currentDate);
  today.setHours(0, 0, 0, 0);

  let paidAmount      = 0;
  let remainingAmount = 0;

  const byCard = paymentData.byCard.map((card) => {
    // 해당 월의 말일을 초과하는 결제일은 말일로 클램프
    // e.g. paymentDay=31, 4월 → 30일
    const lastDay = new Date(y, m, 0).getDate();
    const dueDay  = Math.min(card.paymentDay, lastDay);
    const dueDate = new Date(y, m - 1, dueDay); // 00:00

    // dueDate < today → 결제일 경과(paid), 그 외 → 결제 예정(remaining)
    const isPaid = dueDate < today;

    if (isPaid) {
      paidAmount += card.totalAmount;
    } else {
      remainingAmount += card.totalAmount;
    }

    const dueDateStr = `${y}.${String(m).padStart(2, "0")}.${String(dueDay).padStart(2, "0")}`;

    return {
      cardNo:     card.cardNo,
      cardName:   card.cardName,
      paymentDay: card.paymentDay,
      dueDate:    dueDateStr,               // 'YYYY.MM.DD'
      status:     isPaid ? "paid" : "remaining",
      amount:     card.totalAmount,
    };
  });

  return {
    yearMonth,
    totalAmount:     paymentData.totalAmount,
    paidAmount,
    remainingAmount,
    byCard,
  };
}

module.exports = {
  // Forward
  getItemBillingMonth,
  calculateItemBillingMonth,
  // Reverse
  getBillingSummaryByMonth,
  getPaymentExpectedList,
  // Dashboard
  calculateRemainingAmount,
};
