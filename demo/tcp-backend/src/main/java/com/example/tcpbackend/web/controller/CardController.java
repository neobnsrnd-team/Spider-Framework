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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

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
@Tag(name = "카드", description = "카드 목록 조회·즉시결제·PIN 시도 초기화 API")
@SecurityRequirement(name = "bearerAuth")
@RestController
@RequestMapping("/api/cards")
public class CardController {

    private static final Logger log = LoggerFactory.getLogger(CardController.class);

    private final CardService cardService;

    public CardController(CardService cardService) {
        this.cardService = cardService;
    }

    /**
     * 카드 목록 조회.
     *
     * @return { cards: [ { id, name, maskedNumber, balance, paymentBank, paymentAccount, ... } ] }
     */
    @Operation(summary = "카드 목록 조회", description = "세션 사용자에게 속한 모든 카드를 조회한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공 — { cards: [...] }"),
            @ApiResponse(responseCode = "401", description = "인증 필요"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
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
    @Operation(summary = "즉시결제 가능금액 조회", description = "해당 카드의 즉시결제 가능금액과 신용한도를 반환한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공 — { payableAmount, creditLimit }"),
            @ApiResponse(responseCode = "401", description = "인증 필요"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    @GetMapping("/{cardId}/payable-amount")
    public ResponseEntity<?> getPayableAmount(
            @Parameter(description = "카드번호", required = true) @PathVariable String cardId,
                                               HttpServletRequest request) {
        SessionInfo session = (SessionInfo) request.getAttribute("session");
        try {
            Map<String, Object> data = cardService.getPayableAmount(session.getUserId(), cardId);
            return ResponseEntity.ok(data);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "가능금액 조회 중 오류가 발생했습니다."));
        }
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
    @Operation(summary = "즉시결제 처리", description = "PIN 인증 후 즉시결제를 수행한다. PIN 오류 시 403과 남은 시도 횟수를 반환한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "결제 성공 — { paidAmount, processedCount, completedAt }"),
            @ApiResponse(responseCode = "400", description = "비즈니스 오류 (잔액 부족, 계좌 미존재 등)"),
            @ApiResponse(responseCode = "401", description = "인증 필요"),
            @ApiResponse(responseCode = "403", description = "PIN 오류 — { error, attemptsLeft }"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    @PostMapping("/{cardId}/immediate-pay")
    public ResponseEntity<?> immediatePay(
            @Parameter(description = "카드번호", required = true) @PathVariable String cardId,
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
    @Operation(summary = "PIN 시도 횟수 초기화", description = "PIN 오류 횟수 초과 후 초기화 버튼 클릭 시 호출된다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "초기화 성공 — { ok: true }"),
            @ApiResponse(responseCode = "401", description = "인증 필요")
    })
    @DeleteMapping("/{cardId}/pin-attempts")
    public ResponseEntity<?> resetPinAttempts(
            @Parameter(description = "카드번호", required = true) @PathVariable String cardId,
                                               HttpServletRequest request) {
        SessionInfo session = (SessionInfo) request.getAttribute("session");
        cardService.resetPinAttempts(session.getUserId(), cardId);
        return ResponseEntity.ok(Map.of("ok", true));
    }

    // ── 요청 DTO ─────────────────────────────────────────────────────────────

    /** POST /api/cards/{cardId}/immediate-pay 요청 본문 */
    record ImmediatePayRequest(String pin, long amount, String accountNumber) {}
}
