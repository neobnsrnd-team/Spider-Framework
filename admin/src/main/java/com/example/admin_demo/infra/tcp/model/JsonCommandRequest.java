package com.example.admin_demo.infra.tcp.model;

import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Admin ↔ demo/backend 간 TCP 통신 요청 모델.
 *
 * <p>JSON 직렬화 방식을 사용한다 (Node.js 호환).
 * 4바이트 길이 프리픽스(int) + UTF-8 JSON 바이트열로 전송된다.</p>
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JsonCommandRequest {

    /** 실행 커맨드 (NOTICE_SYNC, NOTICE_END, PING 등) */
    private String command;

    /** 요청 추적용 ID (UUID) */
    private String requestId;

    /** 커맨드 페이로드 (유연한 Map 구조) */
    private Map<String, Object> payload;
}
