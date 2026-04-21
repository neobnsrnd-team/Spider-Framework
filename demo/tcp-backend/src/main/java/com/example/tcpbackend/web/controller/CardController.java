/**
 * @file CardController.java
 * @description 카드 도메인 REST 컨트롤러.
 *              프론트엔드에서 호출하는 카드 관련 엔드포인트를 제공한다.
 *
 * @description 엔드포인트:
 *   GET    /api/cards                          — 카드 목록 조회
 *   GET    /api/cards/{cardId}/payable-amount  — 즉시결제 가능금액 조회
 *   POST   /api/cards/{cardId}/immediate-pay   — 즉시결제 처리
 *   DELETE /api/cards/{cardId}/pin-attempts    — PIN 시도 횟수 초기화
 */
package com.example.tcpbackend.web.controller;

import java.util.List;
import java.util.Map;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.example.tcpbackend.domain.card.CardService;
import com.example.tcpbackend.domain.card.CardService.BusinessException;
import com.example.tcpbackend.domain.card.CardService.PinException;
import com.example.tcpbackend.tcp.SpiderLinkClient;
import com.example.tcpbackend.tcp.session.SessionInfo;

/**
 * 카드 컨트롤러.
 *
 * <p>모든 엔드포인트는 SessionAuthInterceptor가 검증한 세션을 request attribute에서 꺼내 사용한다.
 *
 * <p>즉시결제 PIN 오류 응답 형식:
 * <pre>{@code
 * { "error": "PIN 번호가 올바르지 않습니다.", "attemptsLeft": 2 }  // HTTP 403
 * }</pre>
 */
@RestController
@RequestMapping("/api/cards")
public class CardController {

    private static final Logger log = LoggerFactory.getLogger(CardController.class);

    private final CardService cardService;
    private final SpiderLinkClient spiderLinkClient;

    public CardController(CardService cardService, SpiderLinkClient spiderLinkClient) {
        this.cardService      = cardService;
        this.spiderLinkClient = spiderLinkClient;
    }

    /**
     * 카드 목록 조회.
     *
     * @return { cards: [ { id, name, maskedNumber, balance, paymentBank, paymentAccount, ... } ] }
     */
    @GetMapping
    public ResponseEntity<?> getCards(HttpServletRequest request) {
        SessionInfo session = (SessionInfo) request.getAttribute("session");
        try {
            List<Map<String, Object>> cards = cardService.getCards(session.getUserId());
            return ResponseEntity.ok(Map.of("cards", cards));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "카드 목록 조회 중 오류가 발생했습니다."));
        }
    }

    /**
     * 즉시결제 가능금액 조회.
     *
     * @param cardId 카드번호 (URL 경로 변수)
     * @return { payableAmount, creditLimit }
     */
    @SuppressWarnings("unchecked")
    @GetMapping("/{cardId}/payable-amount")
    public ResponseEntity<?> getPayableAmount(@PathVariable String cardId,
                                               HttpServletRequest request) {
        SessionInfo session = (SessionInfo) request.getAttribute("session");

        Map<String, Object> slResponse = spiderLinkClient.send(
                "DEMO_PAYABLE_AMT", Map.of("userId", session.getUserId(), "cardId", cardId));

        if (!Boolean.TRUE.equals(slResponse.get("success"))) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", slResponse.getOrDefault("error", "가능금액 조회 실패")));
        }

        return ResponseEntity.ok((Map<String, Object>) slResponse.get("payload"));
    }

    /**
     * 즉시결제 처리.
     *
     * <p>PIN 오류 시 HTTP 403과 함께 attemptsLeft를 반환한다.
     * 프론트엔드 인터셉터가 401만 재시도하므로 PIN 오류는 반드시 403을 사용해야 한다.
     *
     * @param cardId 카드번호 (URL 경로 변수)
     * @param body   { pin, amount, accountNumber }
     * @return { paidAmount, processedCount, completedAt }
     */
    @PostMapping("/{cardId}/immediate-pay")
    public ResponseEntity<?> immediatePay(@PathVariable String cardId,
                                           @RequestBody ImmediatePayRequest body,
                                           HttpServletRequest request) {
        SessionInfo session = (SessionInfo) request.getAttribute("session");
        try {
            Map<String, Object> result = cardService.immediatePay(
                    session.getUserId(), cardId, body.pin(), body.amount(), body.accountNumber());
            return ResponseEntity.ok(result);

        } catch (PinException e) {
            // PIN 오류: 403 + attemptsLeft 반환 (인터셉터 재시도 방지)
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", e.getMessage(), "attemptsLeft", e.getAttemptsLeft()));

        } catch (BusinessException e) {
            // 잔액 부족, 계좌 미존재 등 비즈니스 오류: 400
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));

        } catch (Exception e) {
            log.error("즉시결제 처리 중 예외 발생 — cardId={}, userId={}", cardId, session.getUserId(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "즉시결제 처리 중 오류가 발생했습니다."));
        }
    }

    /**
     * PIN 시도 횟수 초기화.
     * 프론트엔드에서 횟수 초과 후 초기화 버튼 클릭 시 호출된다.
     *
     * @param cardId 카드번호 (URL 경로 변수)
     */
    @DeleteMapping("/{cardId}/pin-attempts")
    public ResponseEntity<?> resetPinAttempts(@PathVariable String cardId,
                                               HttpServletRequest request) {
        SessionInfo session = (SessionInfo) request.getAttribute("session");
        cardService.resetPinAttempts(session.getUserId(), cardId);
        return ResponseEntity.ok(Map.of("ok", true));
    }

    // ── 요청 DTO ─────────────────────────────────────────────────────────────

    /** POST /api/cards/{cardId}/immediate-pay 요청 본문 */
    record ImmediatePayRequest(String pin, long amount, String accountNumber) {}
}
