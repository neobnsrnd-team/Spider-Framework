package com.example.spiderlink.infra.tcp.server;

import com.example.spiderlink.infra.tcp.client.TcpClient;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.annotation.PreDestroy;
import java.io.IOException;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.RejectedExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

/**
 * spider-link TCP 서버 (포트 9996).
 *
 * <p>ApplicationRunner로 Spring Boot 기동 시 자동 시작된다.
 * Admin으로부터 JsonCommandRequest를 수신하여 demo/backend(9997)로 프록시한다.</p>
 *
 * <p>수신 프로토콜: 4바이트 길이 프리픽스(int, big-endian) + UTF-8 JSON</p>
 * <p>클라이언트 요청은 고정 크기 스레드 풀(기본 20)로 처리한다.</p>
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class LinkTcpServer implements ApplicationRunner {

    @Value("${tcp.server.port:9996}")
    private int tcpPort;

    /** 동시 접속 급증 시 무제한 스레드 생성 방지용 핸들러 풀 크기 (기본값 20) */
    @Value("${tcp.server.handler-pool-size:20}")
    private int handlerPoolSize;

    @Value("${tcp.demo-backend.host:localhost}")
    private String demoBackendHost;

    @Value("${tcp.demo-backend.port:9997}")
    private int demoBackendPort;

    private final TcpClient tcpClient;
    private final ObjectMapper objectMapper;

    /** accept 루프를 깨우기 위해 @PreDestroy에서 닫을 ServerSocket 참조 */
    private volatile ServerSocket serverSocket;

    /** 클라이언트 요청 처리 스레드 풀 */
    private ExecutorService handlerPool;

    /** 핸들러 스레드 번호 생성용 카운터 */
    private final AtomicInteger handlerCount = new AtomicInteger(0);

    @Override
    public void run(ApplicationArguments args) {
        // 고정 크기 스레드 풀 생성: non-daemon 스레드로 JVM 종료 시 진행 중인 요청 완료 보장
        handlerPool = Executors.newFixedThreadPool(handlerPoolSize, r -> {
            Thread t = new Thread(r, "link-tcp-handler-" + handlerCount.incrementAndGet());
            t.setDaemon(false);
            return t;
        });
        Thread serverThread = new Thread(this::startServer, "link-tcp-server");
        // 서버 accept 루프 스레드는 daemon 유지 (shutdown은 @PreDestroy에서 socket close로 처리)
        serverThread.setDaemon(true);
        serverThread.start();
        log.info(
                "[LinkTcpServer] TCP 서버 시작 (port={}, handlerPoolSize={}, proxyTo={}:{})",
                tcpPort,
                handlerPoolSize,
                demoBackendHost,
                demoBackendPort);
    }

    private void startServer() {
        try {
            serverSocket = new ServerSocket(tcpPort);
            log.info("[LinkTcpServer] 포트 {} 에서 대기 중", tcpPort);
            while (!Thread.currentThread().isInterrupted() && !serverSocket.isClosed()) {
                Socket clientSocket = serverSocket.accept();
                try {
                    // 스레드 풀에 핸들러 제출: 풀 포화 시 RejectedExecutionException으로 소켓 누수 방지
                    handlerPool.submit(
                            new LinkTcpClientHandler(clientSocket, tcpClient, objectMapper, demoBackendHost, demoBackendPort));
                } catch (RejectedExecutionException e) {
                    // 풀 포화(모든 스레드 사용 중) 또는 shutdown 중인 경우 소켓을 즉시 닫아 리소스 누수 방지
                    log.error("[LinkTcpServer] 핸들러 풀 포화, 소켓 닫음: {}", e.getMessage());
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
                log.info("[LinkTcpServer] ServerSocket 종료됨 (정상 shutdown)");
            } else {
                log.error("[LinkTcpServer] 서버 소켓 오류: {}", e.getMessage(), e);
            }
        }
    }

    /**
     * Spring 종료 시 ServerSocket을 닫아 accept 루프를 빠져나오게 한다.
     * 스레드 풀은 graceful shutdown: 진행 중인 요청은 30초 내 완료를 기다린다.
     */
    @PreDestroy
    public void shutdown() {
        if (serverSocket != null && !serverSocket.isClosed()) {
            try {
                serverSocket.close();
            } catch (IOException ignored) {
                // close 실패는 무시 (이미 종료 단계)
            }
            log.info("[LinkTcpServer] TCP 서버 소켓 닫음 (shutdown)");
        }
        if (handlerPool != null) {
            handlerPool.shutdown();
            try {
                if (!handlerPool.awaitTermination(30, TimeUnit.SECONDS)) {
                    handlerPool.shutdownNow();
                    log.warn("[LinkTcpServer] 핸들러 풀 강제 종료 (30초 초과)");
                }
            } catch (InterruptedException e) {
                handlerPool.shutdownNow();
                Thread.currentThread().interrupt();
            }
        }
    }
}
