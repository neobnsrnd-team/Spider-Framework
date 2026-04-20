package com.example.admin_demo.infra.tcp.server;

import com.example.admin_demo.infra.tcp.handler.CommandDispatcher;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PreDestroy;
import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

/**
 * Admin TCP 서버 (포트 9999).
 *
 * <p>ApplicationRunner로 Spring Boot 기동 시 자동 시작된다.
 * 클라이언트 연결마다 TcpClientHandler 스레드를 생성한다 (Thread-per-connection).
 * 추후 이슈 #93에서 WebFlux Reactor Netty 이벤트 루프로 전환 예정.</p>
 *
 * <p>수신 프로토콜: 4바이트 길이 프리픽스 + UTF-8 JSON (JsonCommandRequest)</p>
 *
 * <p>현재 호출자: demo/backend → Admin 전문 통신 (구현 진행 중).
 * 이슈 #92(Kafka) 구현 시 Kafka consumer가 Admin TCP로 커맨드를 중계할 예정.</p>
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class TcpServer implements ApplicationRunner {

    @Value("${tcp.server.port:9999}")
    private int tcpPort;

    private final CommandDispatcher commandDispatcher;
    private final ObjectMapper objectMapper;

    /** accept 루프를 깨우기 위해 @PreDestroy에서 닫을 ServerSocket 참조 */
    private volatile ServerSocket serverSocket;

    @Override
    public void run(ApplicationArguments args) {
        Thread serverThread = new Thread(this::startServer, "admin-tcp-server");
        // 서버 accept 루프 스레드는 daemon 유지 (shutdown은 @PreDestroy에서 socket close로 처리)
        serverThread.setDaemon(true);
        serverThread.start();
        log.info("[TcpServer] Admin TCP 서버 스레드 시작 (port={})", tcpPort);
    }

    private void startServer() {
        try {
            serverSocket = new ServerSocket(tcpPort);
            log.info("[TcpServer] 포트 {} 에서 대기 중", tcpPort);
            while (!Thread.currentThread().isInterrupted() && !serverSocket.isClosed()) {
                Socket clientSocket = serverSocket.accept();
                try {
                    Thread handlerThread = new Thread(
                            new TcpClientHandler(clientSocket, commandDispatcher, objectMapper),
                            "admin-tcp-handler-" + clientSocket.getPort());
                    // 핸들러 스레드는 non-daemon — JVM 종료 시 진행 중인 요청이 완료될 때까지 대기
                    handlerThread.setDaemon(false);
                    handlerThread.start();
                } catch (Exception e) {
                    // 스레드 생성 실패 시 소켓이 누수되지 않도록 즉시 close
                    log.error("[TcpServer] 핸들러 스레드 생성 실패, 소켓 닫음: {}", e.getMessage());
                    try {
                        clientSocket.close();
                    } catch (IOException ignored) {
                        // close 실패는 무시 (리소스 정리 단계)
                    }
                }
            }
        } catch (IOException e) {
            // serverSocket.close()로 accept()가 SocketException을 던지는 경우는 정상 종료로 처리
            if (serverSocket != null && serverSocket.isClosed()) {
                log.info("[TcpServer] ServerSocket 종료됨 (정상 shutdown)");
            } else {
                log.error("[TcpServer] 서버 소켓 오류: {}", e.getMessage(), e);
            }
        }
    }

    /**
     * Spring 종료 시 ServerSocket을 닫아 accept 루프를 빠져나오게 한다.
     * 진행 중이던 handler 스레드는 non-daemon이므로 JVM이 해당 스레드 완료를 기다린다.
     */
    @PreDestroy
    public void shutdown() {
        if (serverSocket != null && !serverSocket.isClosed()) {
            try {
                serverSocket.close();
            } catch (IOException ignored) {
                // close 실패는 무시 (이미 종료 단계)
            }
            log.info("[TcpServer] TCP 서버 소켓 닫음 (shutdown)");
        }
    }
}
