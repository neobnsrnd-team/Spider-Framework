/**
 * @file TransactionService.java
 * @description 이용내역 및 결제예정금액/이용대금명세서 비즈니스 로직 서비스.
 *              Node.js의 /api/transactions, /api/payment-statement 엔드포인트 로직을 이식한다.
 */
package com.example.tcpbackend.domain.transaction;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

/**
 * 이용내역 서비스.
 */
@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;

    public TransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    /**
     * 카드 이용내역을 조회한다.
     *
     * @param userId      사용자 ID
     * @param cardId      카드번호 필터 (null/"all" → 전체)
     * @param period      기간 타입 ("thisMonth", "1month", "3months", "custom")
     * @param customMonth 커스텀 월 "YYYY-MM" (period="custom" 시 사용)
     * @param fromDate    직접 지정 시작일 YYYYMMDD (period보다 우선)
     * @param toDate      직접 지정 종료일 YYYYMMDD
     * @param usageType   "lump"/"installment"/"cancel" (null → 전체)
     * @return { transactions, totalCount, paymentSummary }
     */
    public Map<String, Object> getTransactions(String userId, String cardId,
                                                String period, String customMonth,
                                                String fromDate, String toDate,
                                                String usageType) {
        DateRange range = getDateRange(period, customMonth);
        String effectiveFrom = fromDate != null ? fromDate : range.from;
        String effectiveTo   = toDate   != null ? toDate   : range.to;

        List<Map<String, Object>> rows = transactionRepository.findTransactions(
                userId, cardId, effectiveFrom, effectiveTo, usageType);

        List<Map<String, Object>> transactions = new ArrayList<>();
        for (int i = 0; i < rows.size(); i++) {
            transactions.add(mapUsageTransaction(rows.get(i), i));
        }

        // 결제예정일 대표값 추출 (가장 먼저 오는 날짜)
        String upcomingDate = rows.stream()
                .map(r -> String.valueOf(r.getOrDefault("결제예정일", "")))
                .filter(d -> !d.isEmpty() && !"null".equals(d))
                .sorted()
                .findFirst()
                .orElse("");

        long totalAmount = transactions.stream()
                .filter(t -> "승인".equals(t.get("status")))
                .mapToLong(t -> (Long) t.get("amount"))
                .sum();

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("transactions", transactions);
        result.put("totalCount", transactions.size());
        result.put("paymentSummary", Map.of(
                "date", formatDateKo(upcomingDate),
                "totalAmount", totalAmount));
        return result;
    }

    /**
     * 결제예정금액/이용대금명세서 데이터를 조회한다.
     *
     * @param userId       사용자 ID
     * @param yearMonth    특정 월 조회 "YYYY-MM" (null → 공여기간 기반)
     * @param paymentDay   카드 결제일 (1~31, yearMonth=null 시 사용)
     * @return { dueDate, totalAmount, items, cardInfo, billingPeriod }
     */
    public Map<String, Object> getPaymentStatement(String userId, String yearMonth, String paymentDay) {
        List<Map<String, Object>> cardRows = transactionRepository.findCardPaymentSettings(userId);

        // { 카드번호: 결제일(int) } — 카드별 결제일을 보관해 공여기간 계산에 사용
        Map<String, Integer> cardSettings = new HashMap<>();
        cardRows.forEach(row -> {
            String no = String.valueOf(row.getOrDefault("카드번호", "")).trim();
            if (!no.isEmpty()) {
                cardSettings.put(no, toInt(row.get("결제일")));
            }
        });

        Map<String, Object> cardInfo = null;
        if (!cardRows.isEmpty()) {
            Map<String, Object> first = cardRows.get(0);
            cardInfo = Map.of(
                    "paymentBank",    String.valueOf(first.getOrDefault("결제은행명", "")),
                    "paymentAccount", String.valueOf(first.getOrDefault("결제계좌", "")),
                    "paymentDay",     String.valueOf(first.getOrDefault("결제일", ""))
            );
        }

        // 날짜 범위 결정
        String fromDate = null, toDate = null;
        Map<String, String> billingPeriodFormatted = null;

        // yearMonth 지정 시 카드별 공여기간 캐시 — DB 조회 후 in-memory 필터링에 사용
        Map<Integer, BillingPeriod> periodByDay = new HashMap<>();

        if (yearMonth != null) {
            // getBillingPeriodForMonth 역산: 카드별 결제일로 공여기간을 개별 계산한다.
            // DB 조회는 전체 카드의 공여기간을 포괄하는 최소~최대 범위로 하고,
            // 조회 후 각 카드의 정확한 공여기간으로 in-memory 필터링한다.
            Set<Integer> uniqueDays = new HashSet<>(cardSettings.values());
            if (uniqueDays.isEmpty()) uniqueDays.add(25); // 카드 정보 없을 때 기본값

            String minFrom = null, maxTo = null;
            for (int day : uniqueDays) {
                BillingPeriod bp = BillingPeriod.forMonth(yearMonth, day);
                periodByDay.put(day, bp);
                if (minFrom == null || bp.fromDate().compareTo(minFrom) < 0) minFrom = bp.fromDate();
                if (maxTo == null || bp.toDate().compareTo(maxTo) > 0) maxTo = bp.toDate();
            }
            fromDate = minFrom;
            toDate   = maxTo;

            // billingPeriod 응답 필드: 첫 번째 카드의 결제일 기준으로 대표값 설정
            if (!cardRows.isEmpty()) {
                int repDay = toInt(cardRows.get(0).get("결제일"));
                BillingPeriod repBp = periodByDay.getOrDefault(repDay,
                        periodByDay.values().iterator().next());
                billingPeriodFormatted = Map.of(
                        "usageStart", repBp.usageStart(),
                        "usageEnd",   repBp.usageEnd(),
                        "dueDate",    repBp.dueDate()
                );
            }
        } else {
            // yearMonth 없을 때: 오늘 기준 공여기간(forward) 계산
            String dayStr = paymentDay != null ? paymentDay
                    : (cardInfo != null ? (String) cardInfo.get("paymentDay") : null);
            if (dayStr != null && !dayStr.isEmpty() && !"null".equals(dayStr)) {
                try {
                    BillingPeriod bp = BillingPeriod.of(LocalDate.now(), Integer.parseInt(dayStr));
                    fromDate = bp.fromDate();
                    toDate   = bp.toDate();
                    billingPeriodFormatted = Map.of(
                            "usageStart", bp.usageStart(),
                            "usageEnd",   bp.usageEnd(),
                            "dueDate",    bp.dueDate()
                    );
                } catch (Exception e) {
                    throw new IllegalStateException("공여기간 계산 실패 (결제일: " + dayStr + "): " + e.getMessage());
                }
            }
        }

        List<Map<String, Object>> txRows = transactionRepository.findForPaymentStatement(userId, fromDate, toDate);

        // yearMonth 지정 시: DB에서 넓은 범위로 가져온 뒤 카드별 공여기간으로 정확히 필터링
        if (yearMonth != null && !periodByDay.isEmpty()) {
            final int defaultDay = 25; // cardSettings에 없는 카드의 fallback 결제일
            txRows = txRows.stream()
                    .filter(r -> {
                        String cardNo = String.valueOf(r.getOrDefault("카드번호", "")).trim();
                        int day = cardSettings.getOrDefault(cardNo, defaultDay);
                        BillingPeriod bp = periodByDay.get(day);
                        if (bp == null) return false;
                        // YYYYMMDD 문자열은 사전식 정렬 = 날짜 순 → 부등호 비교 가능
                        String useDate = String.valueOf(r.getOrDefault("이용일자", ""));
                        return useDate.compareTo(bp.fromDate()) >= 0 && useDate.compareTo(bp.toDate()) <= 0;
                    })
                    .collect(Collectors.toList());
        }

        // 카드+결제예정일 기준 집계
        Map<String, Map<String, Object>> cardMap = new LinkedHashMap<>();
        for (Map<String, Object> r : txRows) {
            String cardNo  = String.valueOf(r.getOrDefault("카드번호", ""));
            String dDate   = String.valueOf(r.getOrDefault("결제예정일", ""));
            String key     = cardNo + "_" + dDate;
            cardMap.computeIfAbsent(key, k -> {
                Map<String, Object> item = new LinkedHashMap<>();
                item.put("cardNo",   cardNo);
                item.put("cardName", r.getOrDefault("카드명", ""));
                item.put("amount",   0L);
                item.put("dueDate",  dDate);
                return item;
            });
            long prev = (Long) cardMap.get(key).get("amount");
            cardMap.get(key).put("amount", prev + toLong(r.get("이용금액")));
        }

        List<Map<String, Object>> items = new ArrayList<>(cardMap.values());
        long totalAmount = items.stream().mapToLong(i -> (Long) i.get("amount")).sum();

        // 대표 결제예정일 (가장 많이 등장하는 값)
        String dueDate = txRows.stream()
                .map(r -> String.valueOf(r.getOrDefault("결제예정일", "")))
                .filter(d -> !d.isEmpty() && !"null".equals(d))
                .collect(Collectors.groupingBy(d -> d, Collectors.counting()))
                .entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("");

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("dueDate",       dueDate);
        result.put("totalAmount",   totalAmount);
        result.put("items",         items);
        result.put("cardInfo",      cardInfo);
        result.put("billingPeriod", billingPeriodFormatted);
        return result;
    }

    // ── 내부 유틸 ───────────────────────────────────────────────────────────

    /** DB 로우 → 프론트 Transaction 객체 변환 */
    private Map<String, Object> mapUsageTransaction(Map<String, Object> row, int idx) {
        boolean approved    = "Y".equals(row.get("승인여부"));
        int installment     = toInt(row.get("할부개월"));
        String type = !approved ? "취소"
                : installment > 1 ? "할부(" + installment + "개월)"
                : "일시불";
        long amount = approved
                ? toLong(row.get("이용금액"))
                : -toLong(row.get("이용금액")); // 취소는 음수

        Map<String, Object> tx = new LinkedHashMap<>();
        tx.put("id",             String.format("%s-%s-%s-%d",
                row.get("카드번호"), row.get("이용일자"), row.get("승인시각"), idx));
        tx.put("merchant",       row.getOrDefault("이용가맹점", ""));
        tx.put("amount",         amount);
        tx.put("date",           formatDateTime(
                String.valueOf(row.getOrDefault("이용일자", "")),
                String.valueOf(row.getOrDefault("승인시각", ""))));
        tx.put("type",           type);
        tx.put("approvalNumber", String.valueOf(row.getOrDefault("승인번호", "")));
        tx.put("status",         approved ? "승인" : "취소");
        tx.put("cardName",       row.getOrDefault("카드명", ""));
        return tx;
    }

    /** period → { from, to } YYYYMMDD 변환 */
    private DateRange getDateRange(String period, String customMonth) {
        LocalDate now = LocalDate.now();
        DateTimeFormatter ymd = DateTimeFormatter.ofPattern("yyyyMMdd");

        if ("thisMonth".equals(period)) {
            String y = String.valueOf(now.getYear());
            String m = String.format("%02d", now.getMonthValue());
            return new DateRange(y + m + "01", y + m + "31");
        }
        if ("1month".equals(period)) {
            return new DateRange(now.minusMonths(1).format(ymd), now.format(ymd));
        }
        if ("3months".equals(period)) {
            return new DateRange(now.minusMonths(3).format(ymd), now.format(ymd));
        }
        if ("custom".equals(period) && customMonth != null) {
            String[] parts = customMonth.split("-");
            return new DateRange(parts[0] + parts[1] + "01", parts[0] + parts[1] + "31");
        }
        return new DateRange(null, null);
    }

    /** 날짜(YYYYMMDD) + 시각(HHmmss) → 'YYYY.MM.DD HH:mm' */
    private String formatDateTime(String date, String time) {
        String d = date == null ? "" : date.replaceAll("\\D", "");
        String t = time == null ? "" : time.replaceAll("\\D", "");
        String datePart = d.length() == 8
                ? d.substring(0, 4) + "." + d.substring(4, 6) + "." + d.substring(6, 8)
                : d.length() == 6
                ? "20" + d.substring(0, 2) + "." + d.substring(2, 4) + "." + d.substring(4, 6)
                : d;
        String timePart = t.length() >= 4 ? t.substring(0, 2) + ":" + t.substring(2, 4) : "";
        return timePart.isEmpty() ? datePart : datePart + " " + timePart;
    }

    /** 날짜 문자열 → 'M월 D일' */
    private String formatDateKo(String raw) {
        if (raw == null || raw.isEmpty()) return "";
        String s = raw.replaceAll("\\D", "");
        if (s.length() == 8) return Integer.parseInt(s.substring(4, 6)) + "월 " + Integer.parseInt(s.substring(6, 8)) + "일";
        if (s.length() == 6) return Integer.parseInt(s.substring(2, 4)) + "월 " + Integer.parseInt(s.substring(4, 6)) + "일";
        return raw;
    }

    private long toLong(Object v) {
        if (v == null) return 0L;
        if (v instanceof Number n) return n.longValue();
        try { return Long.parseLong(v.toString()); } catch (NumberFormatException e) { return 0L; }
    }

    private int toInt(Object v) { return (int) toLong(v); }

    private record DateRange(String from, String to) {}
}
