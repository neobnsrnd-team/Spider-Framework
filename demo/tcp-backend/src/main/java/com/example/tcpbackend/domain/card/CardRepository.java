/**
 * @file CardRepository.java
 * @description 카드 도메인 DB 접근 계층.
 *              POC_카드리스트, POC_카드사용내역, POC_뱅킹계좌정보, POC_뱅킹거래내역 테이블을 다룬다.
 */
package com.example.tcpbackend.domain.card;

import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

/**
 * 카드 관련 DB 접근 객체.
 *
 * <p>Oracle 한글 컬럼명을 그대로 사용한다.
 * JdbcTemplate은 columnLabel 기준으로 ResultSet을 매핑하므로 큰따옴표 없이도 동작하지만,
 * SQL 내에서는 Oracle 예약어와 충돌 방지를 위해 한글 컬럼명에 큰따옴표를 유지한다.
 */
@Repository
public class CardRepository {

    private final JdbcTemplate jdbc;

    public CardRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    /**
     * 사용자가 보유한 카드 목록을 조회한다.
     *
     * @param userId 로그인 사용자 ID
     * @return 카드 정보 Map 목록 (컬럼명 → 값)
     */
    public List<Map<String, Object>> findCardsByUserId(String userId) {
        String sql = """
                SELECT "카드번호", "카드구분", "유효기간", "결제은행명",
                       "결제계좌", "결제일", "한도금액", "사용금액"
                  FROM D_SPIDERLINK.POC_카드리스트
                 WHERE "사용자아이디" = ?
                 ORDER BY "결제순번" NULLS LAST
                """;
        return jdbc.queryForList(sql, userId);
    }

    /**
     * 즉시결제 가능금액(미결제 잔액 합산)을 조회한다.
     *
     * @param userId 사용자 ID
     * @param cardId 카드번호
     * @return 미결제 잔액 총합
     */
    public long getPayableAmount(String userId, String cardId) {
        String sql = """
                SELECT NVL(SUM("이용금액" - "누적결제금액"), 0)
                  FROM D_SPIDERLINK.POC_카드사용내역
                 WHERE "이용자" = ? AND "카드번호" = ?
                   AND "누적결제금액" < "이용금액"
                   AND "결제상태코드" <> '9'
                """;
        // 결제상태코드 9 = 취소건 (즉시결제 대상 제외)
        Long result = jdbc.queryForObject(sql, Long.class, userId, cardId);
        return result == null ? 0L : result;
    }

    /**
     * 카드 한도금액을 조회한다.
     *
     * @param userId 사용자 ID
     * @param cardId 카드번호
     * @return 한도금액
     */
    public long getCreditLimit(String userId, String cardId) {
        String sql = """
                SELECT NVL("한도금액", 0)
                  FROM D_SPIDERLINK.POC_카드리스트
                 WHERE "사용자아이디" = ? AND "카드번호" = ?
                """;
        Long result = jdbc.queryForObject(sql, Long.class, userId, cardId);
        return result == null ? 0L : result;
    }

    /**
     * 미결제 내역을 이용일자 오름차순으로 조회한다 (FOR UPDATE 행 잠금).
     * 즉시결제 트랜잭션 내에서만 호출해야 한다.
     *
     * @param userId 사용자 ID
     * @param cardId 카드번호
     * @return ROWID, 결제잔액, 누적결제금액을 포함한 미결제 내역 목록
     */
    public List<Map<String, Object>> findUnpaidRowsForUpdate(String userId, String cardId) {
        String sql = """
                SELECT ROWID AS RID, "결제잔액", "누적결제금액"
                  FROM D_SPIDERLINK.POC_카드사용내역
                 WHERE "이용자" = ? AND "카드번호" = ?
                   AND "결제잔액" > 0 AND "결제상태코드" <> '9'
                 ORDER BY "이용일자" ASC
                   FOR UPDATE
                """;
        return jdbc.queryForList(sql, userId, cardId);
    }

    /**
     * 카드 사용내역 1건을 결제 처리로 업데이트한다.
     *
     * @param newBalance     남은 결제잔액
     * @param newAccumulated 갱신된 누적결제금액
     * @param newStatusCode  결제상태코드 ('1'=완납, '2'=부분결제)
     * @param txDate         결제 처리일자 (YYYYMMDD)
     * @param rowId          대상 행의 Oracle ROWID
     */
    public void updatePaymentRow(long newBalance, long newAccumulated,
                                 String newStatusCode, String txDate, String rowId) {
        String sql = """
                UPDATE D_SPIDERLINK.POC_카드사용내역
                   SET "결제잔액"     = ?,
                       "누적결제금액" = ?,
                       "결제상태코드" = ?,
                       "최종결제일자" = ?
                 WHERE ROWID = ?
                """;
        jdbc.update(sql, newBalance, newAccumulated, newStatusCode, txDate, rowId);
    }

    /**
     * 즉시결제 후 카드 사용금액을 차감해 이용 가능한도를 복원한다.
     *
     * @param totalPaid 이번 결제로 차감된 총 금액
     * @param userId    사용자 ID
     * @param cardId    카드번호
     */
    public void deductUsedAmount(long totalPaid, String userId, String cardId) {
        String sql = """
                UPDATE D_SPIDERLINK.POC_카드리스트
                   SET "사용금액" = "사용금액" - ?
                 WHERE "사용자아이디" = ? AND "카드번호" = ?
                """;
        jdbc.update(sql, totalPaid, userId, cardId);
    }
}