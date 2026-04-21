/**
 * @file CardService.java
 * @description 카드 도메인 비즈니스 로직 서비스.
 *              카드 목록 조회, 즉시결제(PIN 검증 포함), 가능금액 조회를 처리한다.
 */
package com.example.tcpbackend.domain.card;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.tcpbackend.config.AppProperties;

/**
 * 카드 서비스.
 *
 * <p>즉시결제는 DB 트랜잭션(FOR UPDATE + COMMIT/ROLLBACK)을 사용하므로
 * {@code @Transactional}을 적용한다.
 * PIN 시도 횟수는 인메모리 Map으로 관리한다 (Node.js pinAttemptStore 동일 방식).
 */
@Service
public class CardService {

    private static final Logger log = LoggerFactory.getLogger(CardService.class);

    private final CardRepository cardRepository;
    private final BankingRepository bankingRepository;
    private final AppProperties appProperties;

    /**
     * POC용 인메모리 PIN 시도 횟수 저장소.
     * 키: "userId:cardId", 값: 실패 횟수
     * 프로덕션에서는 Redis 또는 DB 테이블로 교체해야 한다.
     */
    private final ConcurrentHashMap<String, Integer> pinAttemptStore = new ConcurrentHashMap<>();

    public CardService(CardRepository cardRepository,
                       BankingRepository bankingRepository,
                       AppProperties appProperties) {
        this.cardRepository = cardRepository;
        this.bankingRepository = bankingRepository;
        this.appProperties = appProperties;
    }

    /**
     * 사용자가 보유한 카드 목록을 반환한다.
     *
     * @param userId 로그인 사용자 ID
     * @return 카드 정보 Map 목록
     */
    public List<Map<String, Object>> getCards(String userId) {
        List<Map<String, Object>> rows = cardRepository.findCardsByUserId(userId);
        List<Map<String, Object>> result = new ArrayList<>();
        for (Map<String, Object> row : rows) {
            result.add(mapCard(row));
        }
        return result;
    }

    /**
     * 즉시결제 가능금액 및 한도금액을 조회한다.
     *
     * @param userId 사용자 ID
     * @param cardId 카드번호
     * @return { payableAmount, creditLimit }
     */
    public Map<String, Object> getPayableAmount(String userId, String cardId) {
        long payable = cardRepository.getPayableAmount(userId, cardId);
        long limit = cardRepository.getCreditLimit(userId, cardId);
        return Map.of("payableAmount", payable, "creditLimit", limit);
    }

    /**
     * 즉시결제를 처리한다.
     *
     * <p>처리 흐름:
     * <ol>
     *   <li>PIN 검증 (오늘 날짜 MMDD 방식, 3회 실패 시 잠금)</li>
     *   <li>미결제 내역 조회 (FOR UPDATE 행 잠금)</li>
     *   <li>뱅킹 계좌 잔액 확인 (FOR UPDATE)</li>
     *   <li>이용일자 오름차순으로 순차 차감 (완납/부분결제)</li>
     *   <li>뱅킹 계좌 잔액 차감 및 거래내역 INSERT</li>
     *   <li>카드 사용금액 복원 (이용 가능한도 회복)</li>
     * </ol>
     *
     * @param userId        사용자 ID
     * @param cardId        카드번호
     * @param pin           사용자가 입력한 PIN
     * @param amount        결제 요청 금액
     * @param accountNumber 출금 계좌번호
     * @return { paidAmount, processedCount, completedAt }
     * @throws PinException          PIN 오류 또는 횟수 초과
     * @throws BusinessException     잔액 부족, 계좌 미존재 등 비즈니스 오류
     */
    @Transactional
    public Map<String, Object> immediatePay(String userId, String cardId,
                                            String pin, long amount, String accountNumber) {
        // ── 1. PIN 검증 ──────────────────────────────────────────────────
        int maxAttempts = appProperties.getAuth().getPinMaxAttempts();
        String pinKey = userId + ":" + cardId;
        int attempts = pinAttemptStore.getOrDefault(pinKey, 0);

        if (attempts >= maxAttempts) {
            throw new PinException("PIN 입력 횟수를 초과하였습니다.", 0);
        }

        // PIN = 오늘 날짜의 MMDD (예: 4월 21일 → "0421")
        String validPin = LocalDate.now().format(DateTimeFormatter.ofPattern("MMdd"));
        if (!validPin.equals(String.valueOf(pin))) {
            int next = attempts + 1;
            pinAttemptStore.put(pinKey, next);
            int left = maxAttempts - next;
            throw new PinException("PIN 번호가 올바르지 않습니다.", left);
        }

        // PIN 성공 → 실패 횟수 초기화
        pinAttemptStore.remove(pinKey);

        // ── 2. 트랜잭션 기준 시각 조회 ──────────────────────────────────
        // 복수 UPDATE/INSERT에 동일 시각을 사용해야 데이터 일관성이 보장된다.
        // DB DUAL 조회 대신 애플리케이션 시각을 사용해 불필요한 네트워크 왕복을 제거한다.
        // (DB 서버와 애플리케이션 서버 시간이 동기화되어 있다는 전제)
        LocalDateTime now      = LocalDateTime.now();
        String txDateTime  = now.format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String txDate      = now.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String completedAt = now.format(DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm"));

        // ── 3. 미결제 내역 조회 (FOR UPDATE) ────────────────────────────
        List<Map<String, Object>> unpaidRows = cardRepository.findUnpaidRowsForUpdate(userId, cardId);

        long totalDebt = unpaidRows.stream()
                .mapToLong(r -> toLong(r.get("결제잔액")))
                .sum();

        // 요청 금액이 미결제 잔액 총합보다 크면 초과분은 차감하지 않는다 (잔액 소실 방지)
        long actualDeduct = Math.min(amount, totalDebt);

        // ── 4. 뱅킹 계좌 잔액 확인 (FOR UPDATE) ─────────────────────────
        long currentBalance = bankingRepository.getBalanceForUpdate(accountNumber, userId);
        if (currentBalance < actualDeduct) {
            throw new BusinessException("잔액이 부족합니다.");
        }

        // ── 5. 이용일자 오름차순으로 순차 차감 ──────────────────────────
        long remaining = actualDeduct;
        long totalPaid = 0;
        int processedCount = 0;

        for (Map<String, Object> row : unpaidRows) {
            if (remaining <= 0) break;

            long 결제잔액     = toLong(row.get("결제잔액"));
            long 누적결제금액 = toLong(row.get("누적결제금액"));
            // oracle.sql.ROWID는 String으로 직접 캐스팅 불가 → toString() 경유
            String rowId      = String.valueOf(row.get("RID"));

            long deducted, newBalance;
            String statusCode;

            if (remaining >= 결제잔액) {
                // 완납: 이 내역의 잔액 전부 결제, 잔여 금액을 다음 건으로 이월
                deducted    = 결제잔액;
                newBalance  = 0;
                statusCode  = "1"; // 1 = 완납
            } else {
                // 부분결제: 남은 요청 금액만큼만 차감하고 루프 종료
                deducted    = remaining;
                newBalance  = 결제잔액 - remaining;
                statusCode  = "2"; // 2 = 부분결제
            }

            cardRepository.updatePaymentRow(newBalance, 누적결제금액 + deducted, statusCode, txDate, rowId);

            remaining -= deducted;
            totalPaid += deducted;
            processedCount++;
        }

        long finalBalance = currentBalance - totalPaid;

        // ── 6. 뱅킹 계좌 잔액 차감 ─────────────────────────────────────
        bankingRepository.deductBalance(finalBalance, accountNumber, userId);

        // ── 7. 뱅킹 거래내역 INSERT ─────────────────────────────────────
        bankingRepository.insertTransaction(accountNumber, txDateTime, totalPaid, finalBalance, cardId, userId);

        // ── 8. 카드 사용금액 복원 (이용 가능한도 회복) ──────────────────
        if (totalPaid > 0) {
            cardRepository.deductUsedAmount(totalPaid, userId, cardId);
        }

        return Map.of("paidAmount", totalPaid, "processedCount", processedCount, "completedAt", completedAt);
    }

    /**
     * PIN 시도 횟수를 초기화한다.
     *
     * @param userId 사용자 ID
     * @param cardId 카드번호
     */
    public void resetPinAttempts(String userId, String cardId) {
        pinAttemptStore.remove(userId + ":" + cardId);
    }

    // ── 내부 유틸 ───────────────────────────────────────────────────────────

    /** DB 조회 결과의 숫자 컬럼을 안전하게 long으로 변환한다. */
    private long toLong(Object value) {
        if (value == null) return 0L;
        if (value instanceof Number n) return n.longValue();
        return Long.parseLong(value.toString());
    }

    /** DB 로우 → 프론트 카드 객체 변환 */
    private Map<String, Object> mapCard(Map<String, Object> row) {
        String cardNo = String.valueOf(row.getOrDefault("카드번호", ""));
        long limit = toLong(row.get("한도금액"));
        long used  = toLong(row.get("사용금액"));

        Map<String, Object> card = new LinkedHashMap<>();
        card.put("id", cardNo);
        card.put("name", row.getOrDefault("카드구분", ""));
        card.put("brand", detectBrand(cardNo));
        card.put("maskedNumber", maskCardNumber(cardNo));
        card.put("balance", limit - used);
        card.put("expiry", row.getOrDefault("유효기간", ""));
        card.put("paymentBank", row.getOrDefault("결제은행명", ""));
        card.put("paymentAccount", String.valueOf(row.getOrDefault("결제계좌", "")));
        card.put("paymentDay", row.getOrDefault("결제일", ""));
        card.put("limitAmount", limit);
        card.put("usedAmount", used);
        return card;
    }

    /**
     * 카드번호 앞 자리로 브랜드를 감지한다.
     * VISA: 4로 시작, Mastercard: 51~55 또는 2221~2720
     */
    private String detectBrand(String cardNo) {
        if (cardNo == null || cardNo.length() < 4) return "Unknown";
        if (cardNo.startsWith("4")) return "VISA";
        int prefix2 = Integer.parseInt(cardNo.substring(0, 2));
        if (prefix2 >= 51 && prefix2 <= 55) return "Mastercard";
        int prefix4 = Integer.parseInt(cardNo.substring(0, 4));
        if (prefix4 >= 2221 && prefix4 <= 2720) return "Mastercard";
        return "Unknown";
    }

    /**
     * 카드번호를 마스킹한다. 예: 1234-****-****-5678
     */
    private String maskCardNumber(String cardNo) {
        if (cardNo == null || cardNo.length() < 8) return cardNo;
        String digits = cardNo.replaceAll("\\D", "");
        if (digits.length() != 16) return cardNo;
        return digits.substring(0, 4) + "-****-****-" + digits.substring(12);
    }

    // ── 중첩 예외 클래스 ────────────────────────────────────────────────────

    /** PIN 오류 전용 예외 (HTTP 403에 해당, 인터셉터 재시도 방지용으로 구분) */
    public static class PinException extends RuntimeException {
        private final int attemptsLeft;
        public PinException(String message, int attemptsLeft) {
            super(message);
            this.attemptsLeft = attemptsLeft;
        }
        public int getAttemptsLeft() { return attemptsLeft; }
    }

    /** 잔액 부족, 계좌 미존재 등 비즈니스 오류 전용 예외 */
    public static class BusinessException extends RuntimeException {
        public BusinessException(String message) { super(message); }
    }
}