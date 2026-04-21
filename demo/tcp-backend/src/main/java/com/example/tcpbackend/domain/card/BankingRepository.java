/**
 * @file BankingRepository.java
 * @description 뱅킹 계좌 DB 접근 계층.
 *              즉시결제 시 계좌 잔액 확인, 차감, 거래내역 기록을 담당한다.
 */
package com.example.tcpbackend.domain.card;

import java.util.Map;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.example.tcpbackend.domain.card.CardService.BusinessException;

/**
 * 뱅킹 계좌 관련 DB 접근 객체.
 */
@Repository
public class BankingRepository {

    private final JdbcTemplate jdbc;

    public BankingRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    /**
     * 계좌 잔액을 조회한다 (FOR UPDATE — 동시 출금 방지).
     * 계좌가 존재하지 않으면 BusinessException을 던진다.
     *
     * @param accountNumber 계좌번호
     * @param userId        사용자 ID
     * @return 현재 계좌 잔액
     * @throws BusinessException 계좌 미존재
     */
    public long getBalanceForUpdate(String accountNumber, String userId) {
        String sql = """
                SELECT "계좌잔액"
                  FROM D_SPIDERLINK.POC_뱅킹계좌정보
                 WHERE "계좌번호" = ? AND "사용자아이디" = ?
                   FOR UPDATE
                """;
        try {
            Long balance = jdbc.queryForObject(sql, Long.class, accountNumber, userId);
            return balance == null ? 0L : balance;
        } catch (EmptyResultDataAccessException e) {
            throw new BusinessException("출금 계좌를 찾을 수 없습니다.");
        }
    }

    /**
     * 계좌 잔액을 차감한다.
     *
     * @param finalBalance  차감 후 잔액
     * @param accountNumber 계좌번호
     * @param userId        사용자 ID
     */
    public void deductBalance(long finalBalance, String accountNumber, String userId) {
        String sql = """
                UPDATE D_SPIDERLINK.POC_뱅킹계좌정보
                   SET "계좌잔액" = ?
                 WHERE "계좌번호" = ? AND "사용자아이디" = ?
                """;
        jdbc.update(sql, finalBalance, accountNumber, userId);
    }

    /**
     * 카드 즉시결제 거래내역을 삽입한다.
     *
     * @param accountNumber 출금 계좌번호
     * @param txDateTime    거래 일시 (YYYYMMDDHH24MISS)
     * @param totalPaid     출금액
     * @param finalBalance  거래 후 잔액
     * @param cardId        결제 카드번호 (입금계좌번호 필드에 기록)
     * @param userId        사용자 ID
     */
    public void insertTransaction(String accountNumber, String txDateTime,
                                  long totalPaid, long finalBalance,
                                  String cardId, String userId) {
        String sql = """
                INSERT INTO D_SPIDERLINK.POC_뱅킹거래내역
                  ("계좌번호", "거래일시", "거래점", "출금액", "입금액", "잔액",
                   "보낸분받는분", "적요", "송금메모", "입금계좌번호", "사용자아이디")
                VALUES
                  (?, ?, '하나카드', ?, 0, ?, '하나카드사', '카드즉시결제', NULL, ?, ?)
                """;
        jdbc.update(sql, accountNumber, txDateTime, totalPaid, finalBalance, cardId, userId);
    }
}