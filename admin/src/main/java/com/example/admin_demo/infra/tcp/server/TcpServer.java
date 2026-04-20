package com.example.admin_demo.infra.tcp.server;

import com.example.admin_demo.infra.tcp.handler.CommandDispatcher;
import com.fasterxml.jackson.databind.ObjectMapper;
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
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class TcpServer implements ApplicationRunner {

    @Value("${tcp.server.port:9999}")
    private int tcpPort;

    private final CommandDispatcher commandDispatcher;
    private final ObjectMapper objectMapper;

    @Override
    public void run(ApplicationArguments args) {
        Thread serverThread = new Thread(this::startServer, "admin-tcp-server");
        serverThread.setDaemon(true);
        serverThread.start();
        log.info("[TcpServer] Admin TCP 서버 스레드 시작 (port={})", tcpPort);
    }

    private void startServer() {
        try (ServerSocket serverSocket = new ServerSocket(tcpPort)) {
            log.info("[TcpServer] 포트 {} 에서 대기 중", tcpPort);
            while (!Thread.currentThread().isInterrupted()) {
                Socket clientSocket = serverSocket.accept();
                Thread handlerThread = new Thread(
                        new TcpClientHandler(clientSocket, commandDispatcher, objectMapper),
                        "admin-tcp-handler-" + clientSocket.getPort());
                handlerThread.setDaemon(true);
                handlerThread.start();
            }
        } catch (IOException e) {
            log.error("[TcpServer] 서버 소켓 오류: {}", e.getMessage(), e);
        }
    }
}
