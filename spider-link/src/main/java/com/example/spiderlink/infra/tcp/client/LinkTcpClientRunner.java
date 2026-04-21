package com.example.spiderlink.infra.tcp.client;

import com.example.spiderlink.infra.tcp.model.JsonCommandRequest;
import com.example.spiderlink.infra.tcp.model.JsonCommandResponse;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

/**
 * spider-link 기동 시 demo/backend TCP 연결 확인용 Runner.
 *
 * <p>dev 프로파일에서만 활성화된다.
 * demo/backend(9997)에 PING을 전송하여 프록시 대상 연결 상태를 확인한다.</p>
 */
@Slf4j
@Component
@Profile("dev")
@RequiredArgsConstructor
public class LinkTcpClientRunner implements ApplicationRunner {

    private final TcpClient tcpClient;

    @Value("${tcp.demo-backend.host:localhost}")
    private String demoHost;

    @Value("${tcp.demo-backend.port:9997}")
    private int demoPort;

    @Override
    public void run(ApplicationArguments args) {
        // spider-link TCP 서버가 완전히 기동될 때까지 잠시 대기
        try {
            Thread.sleep(1000);
        } catch (InterruptedException ignored) {
            Thread.currentThread().interrupt();
        }

        JsonCommandRequest ping = JsonCommandRequest.builder()
                .command("PING")
                .requestId(UUID.randomUUID().toString())
                .payload(Map.of())
                .build();

        try {
            JsonCommandResponse resp = tcpClient.sendJson(demoHost, demoPort, ping);
            log.info(
                    "[LinkTcpClientRunner] demo/backend PING 응답: success={}, message={}",
                    resp.isSuccess(),
                    resp.getMessage());
        } catch (Exception e) {
            log.warn("[LinkTcpClientRunner] demo/backend PING 실패 (비치명적): {}", e.getMessage());
        }
    }
}
