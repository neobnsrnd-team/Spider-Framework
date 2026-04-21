/**
 * @file TransactionHandler.java
 * @description 이용내역/결제명세서 TCP 커맨드 처리 핸들러.
 *              GET_TRANSACTIONS, GET_PAYMENT_STATEMENT 커맨드를 담당한다.
 */
package com.example.tcpbackend.handler;

import java.util.Map;

import org.springframework.stereotype.Component;

import com.example.tcpbackend.domain.transaction.TransactionService;
import com.example.tcpbackend.tcp.TcpRequest;
import com.example.tcpbackend.tcp.TcpResponse;
import com.example.tcpbackend.tcp.session.SessionInfo;
import com.fasterxml.jackson.databind.JsonNode;

/**
 * 이용내역 핸들러.
 */
@Component
public class TransactionHandler {

    private final TransactionService transactionService;

    public TransactionHandler(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    /**
     * GET_TRANSACTIONS 커맨드 처리.
     *
     * payload:
     * <pre>
     * {
     *   "cardId":      "all" | "카드번호",  // 선택
     *   "period":      "thisMonth" | "1month" | "3months" | "custom",  // 선택
     *   "customMonth": "YYYY-MM",            // period="custom" 시 필요
     *   "fromDate":    "YYYYMMDD",           // 직접 지정 (period 무시)
     *   "toDate":      "YYYYMMDD",
     *   "usageType":   "lump" | "installment" | "cancel"  // 선택, 없으면 전체
     * }
     * </pre>
     *
     * @param request 요청 메시지
     * @param session 검증된 세션 정보
     * @return { transactions, totalCount, paymentSummary } 응답
     */
    public TcpResponse handleGetTransactions(TcpRequest request, SessionInfo session) {
        JsonNode p = request.getPayload();

        String cardId      = p != null ? p.path("cardId").asText(null)      : null;
        String period      = p != null ? p.path("period").asText(null)      : null;
        String customMonth = p != null ? p.path("customMonth").asText(null) : null;
        String fromDate    = p != null ? p.path("fromDate").asText(null)    : null;
        String toDate      = p != null ? p.path("toDate").asText(null)      : null;
        String usageType   = p != null ? p.path("usageType").asText(null)   : null;

        try {
            Map<String, Object> data = transactionService.getTransactions(
                    session.getUserId(), cardId, period, customMonth, fromDate, toDate, usageType);
            return TcpResponse.ok("GET_TRANSACTIONS", data);
        } catch (Exception e) {
            return TcpResponse.error("GET_TRANSACTIONS", "이용내역 조회 중 오류가 발생했습니다.");
        }
    }

    /**
     * GET_PAYMENT_STATEMENT 커맨드 처리.
     *
     * payload:
     * <pre>
     * {
     *   "yearMonth":  "YYYY-MM",  // 선택 — 특정 월 명세서 조회
     *   "paymentDay": "25"        // 선택 — 공여기간 기준 결제일
     * }
     * </pre>
     *
     * @param request 요청 메시지
     * @param session 검증된 세션 정보
     * @return { dueDate, totalAmount, items, cardInfo, billingPeriod } 응답
     */
    public TcpResponse handleGetPaymentStatement(TcpRequest request, SessionInfo session) {
        JsonNode p = request.getPayload();

        String yearMonth  = p != null ? p.path("yearMonth").asText(null)  : null;
        String paymentDay = p != null ? p.path("paymentDay").asText(null) : null;

        try {
            Map<String, Object> data = transactionService.getPaymentStatement(
                    session.getUserId(), yearMonth, paymentDay);
            return TcpResponse.ok("GET_PAYMENT_STATEMENT", data);
        } catch (IllegalStateException e) {
            // 공여기간 계산 실패 등 비즈니스 예외
            return TcpResponse.error("GET_PAYMENT_STATEMENT", e.getMessage());
        } catch (Exception e) {
            return TcpResponse.error("GET_PAYMENT_STATEMENT", "결제예정금액 조회 중 오류가 발생했습니다.");
        }
    }
}