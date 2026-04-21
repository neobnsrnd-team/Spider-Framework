package com.example.spiderlink.infra.tcp.handler;

import com.example.spiderlink.domain.demo.dto.DemoPayableAmtResponse;
import com.example.spiderlink.domain.demo.mapper.DemoMapper;
import com.example.spiderlink.infra.tcp.model.JsonCommandRequest;
import com.example.spiderlink.infra.tcp.model.JsonCommandResponse;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * DEMO_PAYABLE_AMT 커맨드 핸들러.
 *
 * <p>demo/backend 즉시결제 가능금액 조회 요청을 수신하여
 * D_SPIDERLINK.POC_카드사용내역 / POC_카드리스트를 조회한다.</p>
 *
 * <p>payload: { userId, cardId }</p>
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DemoPayableAmtCommandHandler implements CommandHandler {

    private static final String TRX_ID = "DEMO_PAYABLE_AMT";

    private final DemoMapper demoMapper;

    @Override
    public boolean supports(String command) {
        return TRX_ID.equals(command);
    }

    @Override
    public Object handle(String command, JsonCommandRequest request) {
        Map<String, Object> payload = request.getPayload();
        String userId = payload != null ? String.valueOf(payload.getOrDefault("userId", "")) : "";
        String cardId = payload != null ? String.valueOf(payload.getOrDefault("cardId", "")) : "";

        if (userId.isBlank() || cardId.isBlank()) {
            return JsonCommandResponse.builder()
                    .command(command)
                    .success(false)
                    .error("userId 또는 cardId가 누락되었습니다.")
                    .build();
        }

        DemoPayableAmtResponse result = demoMapper.selectPayableAmt(userId, cardId);

        long payableAmount = result != null ? result.getPayableAmount() : 0L;
        long creditLimit   = result != null ? result.getCreditLimit()   : 0L;

        log.info("[DemoPayableAmtCommandHandler] 조회 성공: userId={}, cardId={}", userId, cardId);
        return JsonCommandResponse.builder()
                .command(command)
                .success(true)
                .payload(Map.<String, Object>of(
                        "payableAmount", payableAmount,
                        "creditLimit",   creditLimit
                ))
                .build();
    }
}
