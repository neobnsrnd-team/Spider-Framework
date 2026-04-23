/**
 * @file CardHandler.java
 * @description 카드 관련 TCP 커맨드 처리 핸들러.
 *              GET_CARDS, GET_PAYABLE_AMOUNT, IMMEDIATE_PAY, RESET_PIN_ATTEMPTS 커맨드를 담당한다.
 */
package com.example.tcpbackend.handler;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.example.tcpbackend.domain.card.CardService;
import com.example.tcpbackend.domain.card.CardService.BusinessException;
import com.example.tcpbackend.domain.card.CardService.PinException;
import com.example.tcpbackend.tcp.SpiderLinkClient;
import com.example.tcpbackend.tcp.TcpRequest;
import com.example.tcpbackend.tcp.TcpResponse;
import com.example.tcpbackend.tcp.session.SessionInfo;
import com.fasterxml.jackson.databind.JsonNode;

/**
 * 카드 핸들러.
 */
@Component
public class CardHandler {

    private final CardService cardService;
    private final SpiderLinkClient spiderLinkClient;

    public CardHandler(CardService cardService, SpiderLinkClient spiderLinkClient) {
        this.cardService      = cardService;
        this.spiderLinkClient = spiderLinkClient;
    }

    /**
     * GET_CARDS 커맨드 처리.
     * payload: {} (빈 페이로드 가능, userId는 세션에서 추출)
     *
     * @param session 검증된 세션 정보
     * @return 카드 목록 응답
     */
    public TcpResponse handleGetCards(SessionInfo session) {
        try {
            List<Map<String, Object>> cards = cardService.getCards(session.getUserId());
            return TcpResponse.ok("GET_CARDS", Map.of("cards", cards));
        } catch (Exception e) {
            return TcpResponse.error("GET_CARDS", "카드 목록 조회 중 오류가 발생했습니다.");
        }
    }

    /**
     * GET_PAYABLE_AMOUNT 커맨드 처리.
     * payload: { "cardId": "..." }
     *
     * @param request 요청 메시지
     * @param session 검증된 세션 정보
     * @return { payableAmount, creditLimit } 응답
     */
    @SuppressWarnings("unchecked")
    public TcpResponse handleGetPayableAmount(TcpRequest request, SessionInfo session) {
        JsonNode payload = request.getPayload();
        String cardId = payload != null ? payload.path("cardId").asText(null) : null;

        if (cardId == null || cardId.isBlank()) {
            return TcpResponse.error("GET_PAYABLE_AMOUNT", "cardId가 필요합니다.");
        }

        Map<String, Object> reqPayload = new HashMap<>();
        reqPayload.put("userId", session.getUserId());
        reqPayload.put("cardId", cardId);

        Map<String, Object> response = spiderLinkClient.send("DEMO_PAYABLE_AMT", reqPayload);

        if (!Boolean.TRUE.equals(response.get("success"))) {
            return TcpResponse.error("GET_PAYABLE_AMOUNT", String.valueOf(response.getOrDefault("error", "가능금액 조회 실패")));
        }

        Map<String, Object> data = (Map<String, Object>) response.get("payload");
        return TcpResponse.ok("GET_PAYABLE_AMOUNT", data);
    }

    /**
     * IMMEDIATE_PAY 커맨드 처리.
     * payload: { "cardId": "...", "pin": "MMDD", "amount": 100000, "accountNumber": "..." }
     *
     * <p>PIN 오류(PinException)는 일반 오류와 구분해 attemptsLeft를 함께 반환한다.
     *
     * @param request 요청 메시지
     * @param session 검증된 세션 정보
     * @return { paidAmount, processedCount, completedAt } 또는 오류 응답
     */
    public TcpResponse handleImmediatePay(TcpRequest request, SessionInfo session) {
        JsonNode payload = request.getPayload();
        if (payload == null) {
            return TcpResponse.error("IMMEDIATE_PAY", "요청 데이터가 없습니다.");
        }

        String cardId       = payload.path("cardId").asText(null);
        String pin          = payload.path("pin").asText(null);
        long   amount       = payload.path("amount").asLong(0);
        String accountNumber = payload.path("accountNumber").asText(null);

        if (cardId == null || pin == null || amount <= 0 || accountNumber == null) {
            return TcpResponse.error("IMMEDIATE_PAY", "cardId, pin, amount, accountNumber가 모두 필요합니다.");
        }

        try {
            Map<String, Object> result = cardService.immediatePay(
                    session.getUserId(), cardId, pin, amount, accountNumber);
            return TcpResponse.ok("IMMEDIATE_PAY", result);

        } catch (PinException e) {
            return buildPinErrorResponse(e);

        } catch (BusinessException e) {
            return TcpResponse.error("IMMEDIATE_PAY", e.getMessage());

        } catch (Exception e) {
            return TcpResponse.error("IMMEDIATE_PAY", "즉시결제 처리 중 오류가 발생했습니다.");
        }
    }

    /**
     * RESET_PIN_ATTEMPTS 커맨드 처리.
     * payload: { "cardId": "..." }
     *
     * @param request 요청 메시지
     * @param session 검증된 세션 정보
     * @return 초기화 완료 응답
     */
    public TcpResponse handleResetPinAttempts(TcpRequest request, SessionInfo session) {
        JsonNode payload = request.getPayload();
        String cardId = payload != null ? payload.path("cardId").asText(null) : null;

        if (cardId == null || cardId.isBlank()) {
            return TcpResponse.error("RESET_PIN_ATTEMPTS", "cardId가 필요합니다.");
        }

        cardService.resetPinAttempts(session.getUserId(), cardId);
        return TcpResponse.ok("RESET_PIN_ATTEMPTS", Map.of("ok", true));
    }

    /**
     * PIN 오류 응답 — 남은 시도 횟수를 error 메시지에 포함해 클라이언트에 전달한다.
     *
     * <p>attemptsLeft를 별도 필드로 전달하려면 TcpResponse에 data 필드를 추가하면 되나,
     * POC에서는 메시지에 포함하는 방식으로 단순화한다.
     */
    private TcpResponse buildPinErrorResponse(PinException e) {
        return TcpResponse.error("IMMEDIATE_PAY",
                e.getMessage() + " (남은 시도: " + e.getAttemptsLeft() + "회)");
    }
}