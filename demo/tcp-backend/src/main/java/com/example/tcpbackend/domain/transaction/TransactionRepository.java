/**
 * @file TransactionRepository.java
 * @description 이용내역/결제명세서 도메인 DB 접근 계층.
 *              POC_카드사용내역, POC_카드리스트 테이블을 대상으로 한다.
 */
package com.example.tcpbackend.domain.transaction;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

/**
 * 이용내역 관련 DB 접근 객체.
 *
 * <p>동적 WHERE 절이 필요한 쿼리는 StringBuilder로 SQL을 조합하고
 * 바인드 변수는 List로 관리한다.
 */
@Repository
public class TransactionRepository {

    private final JdbcTemplate jdbc;

    public TransactionRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    /**
     * 이용내역을 조건에 따라 조회한다.
     *
     * @param userId      사용자 ID
     * @param cardId      카드번호 필터 (null 또는 "all" → 전체)
     * @param fromDate    조회 시작일 YYYYMMDD (null → 조건 없음)
     * @param toDate      조회 종료일 YYYYMMDD (null → 조건 없음)
     * @param usageType   "lump"=일시불, "installment"=할부, "cancel"=취소 (null → 전체)
     * @return 이용내역 Map 목록
     */
    public List<Map<String, Object>> findTransactions(String userId, String cardId,
                                                       String fromDate, String toDate,
                                                       String usageType) {
        StringBuilder sql = new StringBuilder("""
                SELECT "카드번호", "이용일자", "이용가맹점", "이용금액",
                       "할부개월", "승인여부", "카드명", "승인시각", "결제예정일", "승인번호"
                  FROM D_SPIDERLINK.POC_카드사용내역
                 WHERE "이용자" = ?
                """);

        List<Object> params = new ArrayList<>();
        params.add(userId);

        if (cardId != null && !"all".equals(cardId)) {
            sql.append(" AND \"카드번호\" = ?");
            params.add(cardId);
        }
        if (fromDate != null) {
            sql.append(" AND \"이용일자\" >= ?");
            params.add(fromDate);
        }
        if (toDate != null) {
            sql.append(" AND \"이용일자\" <= ?");
            params.add(toDate);
        }
        if ("lump".equals(usageType)) {
            // 일시불: 할부개월 0 또는 1, 승인건만
            sql.append(" AND \"할부개월\" <= 1 AND \"승인여부\" = 'Y'");
        } else if ("installment".equals(usageType)) {
            // 할부: 할부개월 2 이상, 승인건만
            sql.append(" AND \"할부개월\" > 1 AND \"승인여부\" = 'Y'");
        } else if ("cancel".equals(usageType)) {
            sql.append(" AND \"승인여부\" = 'N'");
        }

        sql.append(" ORDER BY \"이용일자\" DESC, \"승인시각\" DESC");

        return jdbc.queryForList(sql.toString(), params.toArray());
    }

    /**
     * 결제예정금액 조회용 이용내역을 기간 필터로 조회한다.
     * 승인건만 포함하고 이용일자, 결제예정일 정보를 함께 반환한다.
     *
     * @param userId    사용자 ID
     * @param fromDate  조회 시작일 (null → 조건 없음)
     * @param toDate    조회 종료일 (null → 조건 없음)
     * @return 이용내역 Map 목록
     */
    public List<Map<String, Object>> findForPaymentStatement(String userId, String fromDate, String toDate) {
        StringBuilder sql = new StringBuilder("""
                SELECT "카드번호", "카드명", "이용금액", "결제예정일", "이용일자"
                  FROM D_SPIDERLINK.POC_카드사용내역
                 WHERE "이용자" = ? AND "승인여부" = 'Y'
                """);

        List<Object> params = new ArrayList<>();
        params.add(userId);

        if (fromDate != null) {
            sql.append(" AND \"이용일자\" >= ?");
            params.add(fromDate);
        }
        if (toDate != null) {
            sql.append(" AND \"이용일자\" <= ?");
            params.add(toDate);
        }

        return jdbc.queryForList(sql.toString(), params.toArray());
    }

    /**
     * 사용자 카드의 결제 관련 정보(결제은행, 계좌, 결제일)를 조회한다.
     *
     * @param userId 사용자 ID
     * @return 카드 정보 Map 목록 (카드번호, 결제은행명, 결제계좌, 결제일)
     */
    public List<Map<String, Object>> findCardPaymentSettings(String userId) {
        String sql = """
                SELECT "카드번호", "결제은행명", "결제계좌", "결제일"
                  FROM D_SPIDERLINK.POC_카드리스트
                 WHERE "사용자아이디" = ?
                 ORDER BY "결제순번" NULLS LAST
                """;
        return jdbc.queryForList(sql, userId);
    }
}
