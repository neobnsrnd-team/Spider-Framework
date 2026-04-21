/**
 * @file SpiderLinkClient.java
 * @description spider-link 미들웨어로 전문을 전송하고 응답을 수신하는 TCP 클라이언트.
 *              4바이트 big-endian 길이 헤더 + UTF-8 JSON 프로토콜을 사용한다.
 *
 * @example
 * Map<String, Object> payload = Map.of("userId", "user01", "password", "1234");
 * Map<String, Object> response = spiderLinkClient.send("DEMO_AUTH_LOGIN", payload);
 * boolean success = Boolean.TRUE.equals(response.get("success"));
 */
package com.example.tcpbackend.tcp;

import com.example.tcpbackend.config.AppProperties;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.net.Socket;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

/**
 * spider-link 미들웨어 TCP 클라이언트.
 *
 * <p>요청마다 새 소켓을 열고 응답을 받은 뒤 닫는 단순 동기 방식으로 동작한다.
 * POC 수준의 요청 빈도에 적합하며, 고성능이 필요한 경우 커넥션 풀로 전환한다.</p>
 */
@Component
public class SpiderLinkClient {

    private static final Logger log = LoggerFactory.getLogger(SpiderLinkClient.class);

    /** 응답 대기 최대 시간 (ms) */
    private static final int SOCKET_TIMEOUT_MS = 10_000;

    private final AppProperties appProperties;
    private final ObjectMapper objectMapper;

    public SpiderLinkClient(AppProperties appProperties, ObjectMapper objectMapper) {
        this.appProperties = appProperties;
        this.objectMapper  = objectMapper;
    }

    /**
     * spider-link 미들웨어로 전문 요청을 전송하고 응답 Map을 반환한다.
     *
     * <p>전송 형식: [4byte 길이(big-endian)] + [UTF-8 JSON]
     * <br>JSON 구조: { "command": "...", "requestId": "uuid", "payload": {...} }</p>
     *
     * @param command spider-link 커맨드명 (예: "DEMO_AUTH_LOGIN")
     * @param payload 커맨드별 요청 데이터
     * @return 응답 Map. success(boolean), payload(Map), error(String) 포함
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> send(String command, Map<String, Object> payload) {
        String host = appProperties.getSpiderLink().getHost();
        int    port = appProperties.getSpiderLink().getPort();

        Map<String, Object> request = new HashMap<>();
        request.put("command",   command);
        request.put("requestId", UUID.randomUUID().toString());
        request.put("payload",   payload);

        log.debug("[SpiderLinkClient] 전송: command={}, host={}:{}", command, host, port);

        try (Socket socket = new Socket(host, port)) {
            socket.setSoTimeout(SOCKET_TIMEOUT_MS);

            byte[] reqBytes = objectMapper.writeValueAsBytes(request);

            DataOutputStream dos = new DataOutputStream(socket.getOutputStream());
            dos.writeInt(reqBytes.length);
            dos.write(reqBytes);
            dos.flush();

            DataInputStream dis = new DataInputStream(socket.getInputStream());
            int    length   = dis.readInt();
            byte[] resBytes = new byte[length];
            dis.readFully(resBytes);

            Map<String, Object> response = objectMapper.readValue(resBytes, Map.class);
            log.debug("[SpiderLinkClient] 수신: command={}, success={}", command, response.get("success"));
            return response;

        } catch (IOException e) {
            log.error("[SpiderLinkClient] 전문 전송 실패: command={}, error={}", command, e.getMessage());
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "미들웨어 연결 오류: " + e.getMessage());
            return errorResponse;
        }
    }
}
