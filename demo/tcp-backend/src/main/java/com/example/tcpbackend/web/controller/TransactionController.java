/**
 * @file TransactionController.java
 * @description 이용내역/결제명세서 REST 컨트롤러.
 *              프론트엔드에서 호출하는 이용내역 관련 엔드포인트를 제공한다.
 *
 * @description 엔드포인트:
 *   GET /api/transactions      — 이용내역 조회 (다양한 필터 쿼리 파라미터 지원)
 *   GET /api/payment-statement — 결제예정금액/명세서 조회
 */
package com.example.tcpbackend.web.controller;

import java.util.Map;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.tcpbackend.domain.transaction.TransactionService;
import com.example.tcpbackend.tcp.session.SessionInfo;

/**
 * 이용내역·결제명세서 컨트롤러.
 */
@RestController
@RequestMapping("/api")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    /**
     * 이용내역 조회.
     *
     * @param cardId      카드번호 (선택 — 없으면 전체 카드)
     * @param period      기간 유형: thisMonth | 1month | 3months | custom (선택)
     * @param customMonth period=custom 시 조회 월 (YYYY-MM 형식)
     * @param fromDate    직접 지정 시작일 (YYYYMMDD)
     * @param toDate      직접 지정 종료일 (YYYYMMDD)
     * @param usageType   이용 유형: lump | installment | cancel (선택 — 없으면 전체)
     * @return { transactions, totalCount, paymentSummary }
     */
    @GetMapping("/transactions")
    public ResponseEntity<?> getTransactions(
            @RequestParam(required = false) String cardId,
            @RequestParam(required = false) String period,
            @RequestParam(required = false) String customMonth,
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate,
            @RequestParam(required = false) String usageType,
            HttpServletRequest request) {

        SessionInfo session = (SessionInfo) request.getAttribute("session");
        try {
            Map<String, Object> data = transactionService.getTransactions(
                    session.getUserId(), cardId, period, customMonth, fromDate, toDate, usageType);
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "이용내역 조회 중 오류가 발생했습니다."));
        }
    }

    /**
     * 결제예정금액/명세서 조회.
     *
     * @param yearMonth  조회 청구월 (YYYY-MM 형식, 선택)
     * @param paymentDay 결제일 (선택 — 공여기간 기준 계산에 사용)
     * @return { dueDate, totalAmount, items, cardInfo, billingPeriod }
     */
    @GetMapping("/payment-statement")
    public ResponseEntity<?> getPaymentStatement(
            @RequestParam(required = false) String yearMonth,
            @RequestParam(required = false) String paymentDay,
            HttpServletRequest request) {

        SessionInfo session = (SessionInfo) request.getAttribute("session");
        try {
            Map<String, Object> data = transactionService.getPaymentStatement(
                    session.getUserId(), yearMonth, paymentDay);
            return ResponseEntity.ok(data);
        } catch (IllegalStateException e) {
            // 공여기간 계산 실패 등 비즈니스 오류
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "결제예정금액 조회 중 오류가 발생했습니다."));
        }
    }
}
