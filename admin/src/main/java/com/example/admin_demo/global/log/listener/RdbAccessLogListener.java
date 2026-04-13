package com.example.admin_demo.global.log.listener;

import com.example.admin_demo.domain.adminhistory.mapper.AdminActionLogMapper;
import com.example.admin_demo.global.log.event.AccessLogEvent;
import com.example.admin_demo.global.util.StringUtil;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.nio.charset.StandardCharsets;
import java.util.LinkedHashMap;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
@ConditionalOnProperty(name = "log.dest.rdb.access", havingValue = "true", matchIfMissing = true)
public class RdbAccessLogListener {

    private static final int MAX_INPUT_DATA_BYTES = 4000;
    private final AdminActionLogMapper adminActionLogMapper;
    private final ObjectMapper objectMapper;

    @Async("logExecutor")
    @EventListener
    public void onAccessLog(AccessLogEvent event) {
        try {
            String inputData = buildInputData(event);
            String accessUrl = "[" + event.getHttpMethod() + "] " + event.getAccessUrl();

            adminActionLogMapper.insert(
                    event.getUserId(),
                    event.getAccessDtime(),
                    event.getAccessIp(),
                    accessUrl,
                    inputData,
                    event.getResultMessage());
        } catch (Exception e) {
            log.error("Failed to save access log: userId={}, url={}", event.getUserId(), event.getAccessUrl(), e);
        }
    }

    private String buildInputData(AccessLogEvent event) throws JsonProcessingException {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("traceId", event.getTraceId());
        map.put("phase", event.getPhase());

        if ("RES".equals(event.getPhase())) {
            map.put("status", event.getStatus());
            map.put("duration", event.getDurationMs());
        }

        String data = event.getData() != null ? event.getData() : "";
        String errorMessage = event.getErrorMessage();

        // 고정 필드(traceId, phase, status, duration) 직렬화 후 남은 바이트 계산
        Map<String, Object> fixedMap = new LinkedHashMap<>(map);
        fixedMap.put("data", "");
        int fixedOverhead = objectMapper.writeValueAsString(fixedMap).getBytes(StandardCharsets.UTF_8).length;
        int budget = MAX_INPUT_DATA_BYTES - fixedOverhead - 50; // 여유분 50 bytes (errorMessage 키 등)

        // errorMessage 먼저 할당 (짧으므로), 나머지를 data에 할당
        if (errorMessage != null) {
            int errorBudget = Math.min(budget / 4, errorMessage.getBytes(StandardCharsets.UTF_8).length);
            errorMessage = StringUtil.truncateBytesWithMarker(errorMessage, errorBudget);
            budget -= errorMessage.getBytes(StandardCharsets.UTF_8).length;
        }
        data = StringUtil.truncateBytesWithMarker(data, budget);

        map.put("data", data);
        if (errorMessage != null) {
            map.put("errorMessage", errorMessage);
        }

        return objectMapper.writeValueAsString(map);
    }
}
