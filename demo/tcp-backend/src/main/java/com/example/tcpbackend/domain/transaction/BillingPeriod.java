/**
 * @file BillingPeriod.java
 * @description 하나카드 공식 결제일별 신용공여기간 계산 유틸리티.
 *              billingPeriod.js의 getBillingPeriod()를 Java로 이식한다.
 *
 * <p>공식 규칙 (결제일 D, 결제월 M 기준):
 *
 * <pre>
 *   [D ≤ 12]
 *     이용 시작 : (M-2)월 (D+18)일
 *     이용 종료 : (M-1)월 (D+17)일
 *     결제 예정 :  M월     D일
 *     cutoff   : D+17일 — baseDay ≤ D+17 → 결제월=당월, 초과 → 결제월=익월
 *
 *   [D = 13]
 *     이용 시작 : (M-1)월 1일
 *     이용 종료 : (M-1)월 말일
 *     결제 예정 :  M월 13일
 *     (baseDate가 어느 날이든 결제월은 항상 익월)
 *
 *   [D ≥ 14]
 *     이용 시작 : (M-1)월 (D-12)일
 *     이용 종료 :  M월    (D-13)일
 *     결제 예정 :  M월     D일
 *     cutoff   : D-13일 — baseDay ≤ D-13 → 결제월=당월, 초과 → 결제월=익월
 * </pre>
 *
 * <p>예: 결제일 25일, 오늘이 4월 10일(baseDay=10 ≤ cutoff=12) → 결제월=4월
 * <br>이용기간 = 3월 13일 ~ 4월 12일, 결제일 = 4월 25일
 *
 * <p>예: 결제일 25일, 오늘이 4월 21일(baseDay=21 > cutoff=12) → 결제월=5월
 * <br>이용기간 = 4월 13일 ~ 5월 12일, 결제일 = 5월 25일
 */
package com.example.tcpbackend.domain.transaction;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;

/**
 * 공여기간 계산 결과.
 *
 * @param fromDate   이용 시작일 (YYYYMMDD, DB 조회 범위에 사용)
 * @param toDate     이용 종료일 (YYYYMMDD, DB 조회 범위에 사용)
 * @param usageStart 이용 시작일 표시용 ('YYYY.MM.DD')
 * @param usageEnd   이용 종료일 표시용 ('YYYY.MM.DD')
 * @param dueDate    결제일 표시용 ('YYYY.MM.DD')
 */
public record BillingPeriod(
        String fromDate,
        String toDate,
        String usageStart,
        String usageEnd,
        String dueDate
) {

    private static final DateTimeFormatter YMD     = DateTimeFormatter.ofPattern("yyyyMMdd");
    private static final DateTimeFormatter DISPLAY = DateTimeFormatter.ofPattern("yyyy.MM.dd");

    /**
     * 기준일(today)과 결제일(paymentDay)을 받아 공여기간을 계산한다.
     * billingPeriod.js의 getBillingPeriod() 로직과 동일하게 동작한다.
     *
     * @param today      기준일 (오늘 또는 이용일)
     * @param paymentDay 카드 결제일 (1~31)
     * @return 공여기간 정보
     * @throws IllegalArgumentException paymentDay가 1~31 범위를 벗어날 때
     */
    public static BillingPeriod of(LocalDate today, int paymentDay) {
        if (paymentDay < 1 || paymentDay > 31) {
            throw new IllegalArgumentException("결제일은 1~31 사이여야 합니다: " + paymentDay);
        }

        int D        = paymentDay;
        int baseYear = today.getYear();
        int baseMonth = today.getMonthValue();
        int baseDay  = today.getDayOfMonth();

        LocalDate usageStartDate, usageEndDate, dueDateVal;

        if (D <= 12) {
            // ── [D ≤ 12] ───────────────────────────────────────────────────────
            // cutoff = D+17: baseDay ≤ D+17 → 결제월=당월, 초과 → 결제월=익월
            YearMonth payPart   = baseDay <= D + 17
                    ? YearMonth.of(baseYear, baseMonth)
                    : YearMonth.of(baseYear, baseMonth).plusMonths(1);
            YearMonth endPart   = payPart.minusMonths(1); // M-1
            YearMonth startPart = payPart.minusMonths(2); // M-2

            usageEndDate   = clampToLastDay(endPart.getYear(),   endPart.getMonthValue(),   D + 17);
            usageStartDate = clampToLastDay(startPart.getYear(), startPart.getMonthValue(), D + 18);
            dueDateVal     = clampToLastDay(payPart.getYear(),   payPart.getMonthValue(),   D);

        } else if (D == 13) {
            // ── [D = 13] ───────────────────────────────────────────────────────
            // 결제월 = 항상 익월 / 이용 기간 = 당월 1일 ~ 당월 말일
            YearMonth payPart = YearMonth.of(baseYear, baseMonth).plusMonths(1);
            YearMonth endPart = YearMonth.of(baseYear, baseMonth); // 이용 종료월 = 당월

            usageStartDate = LocalDate.of(endPart.getYear(), endPart.getMonthValue(), 1);
            usageEndDate   = LocalDate.of(endPart.getYear(), endPart.getMonthValue(), endPart.lengthOfMonth());
            dueDateVal     = clampToLastDay(payPart.getYear(), payPart.getMonthValue(), 13);

        } else {
            // ── [D ≥ 14] ───────────────────────────────────────────────────────
            // cutoff = D-13: baseDay ≤ D-13 → 결제월=당월, 초과 → 결제월=익월
            YearMonth payPart   = baseDay <= D - 13
                    ? YearMonth.of(baseYear, baseMonth)
                    : YearMonth.of(baseYear, baseMonth).plusMonths(1);
            YearMonth startPart = payPart.minusMonths(1); // M-1

            usageEndDate   = clampToLastDay(payPart.getYear(),   payPart.getMonthValue(),   D - 13);
            usageStartDate = clampToLastDay(startPart.getYear(), startPart.getMonthValue(), D - 12);
            dueDateVal     = clampToLastDay(payPart.getYear(),   payPart.getMonthValue(),   D);
        }

        return new BillingPeriod(
                usageStartDate.format(YMD),
                usageEndDate.format(YMD),
                usageStartDate.format(DISPLAY),
                usageEndDate.format(DISPLAY),
                dueDateVal.format(DISPLAY)
        );
    }

    /**
     * 청구월(targetMonth)과 결제일(paymentDay)로부터 해당 청구월의 이용 기간을 역산한다.
     * billingPeriod.js의 getBillingPeriodForMonth() 로직과 동일하게 동작한다.
     *
     * <pre>
     *   [D ≤ 12]  이용 시작: (M-2)월 (D+18)일  /  이용 종료: (M-1)월 (D+17)일
     *   [D = 13]  이용 시작: (M-1)월  1일       /  이용 종료: (M-1)월 말일
     *   [D ≥ 14]  이용 시작: (M-1)월 (D-12)일  /  이용 종료:  M월   (D-13)일
     * </pre>
     *
     * @param targetMonth 청구월 "YYYY-MM"
     * @param paymentDay  카드 결제일 (1~31)
     * @return 이용 기간 정보
     * @throws IllegalArgumentException paymentDay가 1~31 범위를 벗어날 때
     */
    public static BillingPeriod forMonth(String targetMonth, int paymentDay) {
        String[] parts = targetMonth.split("-");
        int y = Integer.parseInt(parts[0]);
        int m = Integer.parseInt(parts[1]);
        int D = paymentDay;

        if (D < 1 || D > 31) {
            throw new IllegalArgumentException("결제일은 1~31 사이여야 합니다: " + D);
        }

        LocalDate usageStartDate, usageEndDate;

        if (D <= 12) {
            // 이용 시작: (M-2)월 (D+18)일  /  이용 종료: (M-1)월 (D+17)일
            YearMonth startPart = YearMonth.of(y, m).minusMonths(2);
            YearMonth endPart   = YearMonth.of(y, m).minusMonths(1);
            usageStartDate = clampToLastDay(startPart.getYear(), startPart.getMonthValue(), D + 18);
            usageEndDate   = clampToLastDay(endPart.getYear(),   endPart.getMonthValue(),   D + 17);
        } else if (D == 13) {
            // 이용 시작: (M-1)월 1일  /  이용 종료: (M-1)월 말일
            YearMonth prevPart = YearMonth.of(y, m).minusMonths(1);
            usageStartDate = LocalDate.of(prevPart.getYear(), prevPart.getMonthValue(), 1);
            usageEndDate   = LocalDate.of(prevPart.getYear(), prevPart.getMonthValue(), prevPart.lengthOfMonth());
        } else {
            // D ≥ 14: 이용 시작: (M-1)월 (D-12)일  /  이용 종료: M월 (D-13)일
            YearMonth prevPart = YearMonth.of(y, m).minusMonths(1);
            usageStartDate = clampToLastDay(prevPart.getYear(), prevPart.getMonthValue(), D - 12);
            usageEndDate   = clampToLastDay(y, m, D - 13);
        }

        LocalDate dueDateVal = clampToLastDay(y, m, D);

        return new BillingPeriod(
                usageStartDate.format(YMD),
                usageEndDate.format(YMD),
                usageStartDate.format(DISPLAY),
                usageEndDate.format(DISPLAY),
                dueDateVal.format(DISPLAY)
        );
    }

    /**
     * 해당 월의 말일을 초과하는 날짜를 말일로 클램프한다.
     * e.g. clampToLastDay(2026, 2, 30) → 2026-02-28
     */
    private static LocalDate clampToLastDay(int year, int month, int day) {
        int lastDay = YearMonth.of(year, month).lengthOfMonth();
        return LocalDate.of(year, month, Math.min(day, lastDay));
    }
}