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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;

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
@Tag(name = "이용내역·결제명세서", description = "이용내역 조회 및 결제예정금액/명세서 조회 API")
@SecurityRequirement(name = "bearerAuth")
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
    @Operation(summary = "이용내역 조회", description = "다양한 필터 조건으로 카드 이용내역을 조회한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공 — { transactions, totalCount, paymentSummary }"),
            @ApiResponse(responseCode = "401", description = "인증 필요"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    @GetMapping("/transactions")
    public ResponseEntity<?> getTransactions(
            @Parameter(description = "카드번호 (미입력 시 전체 카드)") @RequestParam(required = false) String cardId,
            @Parameter(description = "기간 유형: thisMonth | 1month | 3months | custom") @RequestParam(required = false) String period,
            @Parameter(description = "period=custom 일 때 조회 월 (YYYY-MM)") @RequestParam(required = false) String customMonth,
            @Parameter(description = "직접 지정 시작일 (YYYYMMDD)") @RequestParam(required = false) String fromDate,
            @Parameter(description = "직접 지정 종료일 (YYYYMMDD)") @RequestParam(required = false) String toDate,
            @Parameter(description = "이용 유형: lump | installment | cancel (미입력 시 전체)") @RequestParam(required = false) String usageType,
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
    @Operation(summary = "결제예정금액/명세서 조회", description = "청구월 기준 결제예정금액과 명세서 항목을 반환한다.")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "조회 성공 — { dueDate, totalAmount, items, cardInfo, billingPeriod }"),
            @ApiResponse(responseCode = "400", description = "비즈니스 오류 (공여기간 계산 실패 등)"),
            @ApiResponse(responseCode = "401", description = "인증 필요"),
            @ApiResponse(responseCode = "500", description = "서버 오류")
    })
    @GetMapping("/payment-statement")
    public ResponseEntity<?> getPaymentStatement(
            @Parameter(description = "청구월 (YYYY-MM, 미입력 시 이번 달)") @RequestParam(required = false) String yearMonth,
            @Parameter(description = "결제일 (공여기간 계산에 사용)") @RequestParam(required = false) String paymentDay,
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
