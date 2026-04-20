package com.example.admin_demo.infra.tcp.adapter;

import com.example.admin_demo.infra.tcp.client.TcpClient;
import com.example.admin_demo.infra.tcp.model.JsonCommandRequest;
import com.example.admin_demo.infra.tcp.model.JsonCommandResponse;
import java.io.IOException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Admin ↔ demo/backend 간 TCP 통신 어댑터.
 *
 * <p>JsonCommandRequest를 4바이트 길이 프리픽스 + UTF-8 JSON 형식으로 전송한다.
 * demo/backend가 Node.js이므로 Java ObjectStream 대신 JSON 프로토콜을 사용한다.</p>
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DemoBackendAdapter implements ManagementAdapter<JsonCommandRequest, JsonCommandResponse> {

    private final TcpClient tcpClient;

    @Value("${tcp.demo-backend.host:localhost}")
    private String demoBackendHost;

    @Value("${tcp.demo-backend.port:9997}")
    private int demoBackendPort;

    /** demo/backend는 항상 별도 Node.js 프로세스이므로 로컬 실행 없음 */
    @Override
    public boolean isLocal() {
        return false;
    }

    /**
     * demo/backend TCP 서버에 JsonCommandRequest를 전송한다.
     *
     * @param command 실행 커맨드 (NOTICE_SYNC, NOTICE_END, PING 등)
     * @param payload JsonCommandRequest 인스턴스
     * @return 응답 JsonCommandResponse
     */
    @Override
    public JsonCommandResponse doProcess(String command, JsonCommandRequest req) {
        try {
            log.info("[DemoBackendAdapter] JSON TCP 전송: host={}, port={}, command={}",
                    demoBackendHost, demoBackendPort, command);
            return tcpClient.sendJson(demoBackendHost, demoBackendPort, req);
        } catch (IOException e) {
            log.warn("[DemoBackendAdapter] TCP 전송 실패 (비치명적): command={}, error={}", command, e.getMessage());
            return JsonCommandResponse.builder()
                    .command(command)
                    .success(false)
                    .error(e.getMessage())
                    .build();
        }
    }
}
