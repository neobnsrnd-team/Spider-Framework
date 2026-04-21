package com.example.spiderlink.infra.tcp.demoserver;

import com.example.spiderlink.infra.tcp.handler.CommandDispatcher;
import com.example.spiderlink.infra.tcp.parser.JsonMessageParser;
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
 * Demo 전문 처리 TCP 서버 (포트 9999).
 *
 * <p>demo/backend로부터 전문 커맨드(DEMO_AUTH_LOGIN, DEMO_AUTH_ME, DEMO_PAYABLE_AMT 등)를
 * 수신하여 CommandDispatcher에 위임한다.</p>
 *
 * <p>수신 프로토콜: 4바이트 길이 프리픽스(int, big-endian) + UTF-8 JSON</p>
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DemoTcpServer implements ApplicationRunner {

    @Value("${tcp.demo-server.port:9999}")
    private int tcpPort;

    @Value("${tcp.demo-server.handler-pool-size:20}")
    private int handlerPoolSize;

    private final CommandDispatcher commandDispatcher;
    private final ObjectMapper objectMapper;
    private final JsonMessageParser jsonMessageParser;

    private volatile ServerSocket serverSocket;
    private ExecutorService handlerPool;
    private final AtomicInteger handlerCount = new AtomicInteger(0);

    @Override
    public void run(ApplicationArguments args) {
        handlerPool = Executors.newFixedThreadPool(handlerPoolSize, r -> {
            Thread t = new Thread(r, "demo-tcp-handler-" + handlerCount.incrementAndGet());
            t.setDaemon(false);
            return t;
        });
        Thread serverThread = new Thread(this::startServer, "demo-tcp-server");
        serverThread.setDaemon(true);
        serverThread.start();
        log.info("[DemoTcpServer] TCP 서버 시작 (port={}, handlerPoolSize={})", tcpPort, handlerPoolSize);
    }

    private void startServer() {
        try {
            serverSocket = new ServerSocket(tcpPort);
            log.info("[DemoTcpServer] 포트 {} 에서 대기 중 (demo/backend 전문 수신)", tcpPort);
            while (!Thread.currentThread().isInterrupted() && !serverSocket.isClosed()) {
                Socket clientSocket = serverSocket.accept();
                try {
                    handlerPool.submit(new DemoTcpClientHandler(clientSocket, commandDispatcher, objectMapper, jsonMessageParser));
                } catch (RejectedExecutionException e) {
                    log.error("[DemoTcpServer] 핸들러 풀 포화, 소켓 닫음: {}", e.getMessage());
                    try { clientSocket.close(); } catch (IOException ignored) {}
                }
            }
        } catch (IOException e) {
            if (serverSocket != null && serverSocket.isClosed()) {
                log.info("[DemoTcpServer] ServerSocket 종료됨 (정상 shutdown)");
            } else {
                log.error("[DemoTcpServer] 서버 소켓 오류: {}", e.getMessage(), e);
            }
        }
    }

    @PreDestroy
    public void shutdown() {
        if (serverSocket != null && !serverSocket.isClosed()) {
            try { serverSocket.close(); } catch (IOException ignored) {}
            log.info("[DemoTcpServer] TCP 서버 소켓 닫음 (shutdown)");
        }
        if (handlerPool != null) {
            handlerPool.shutdown();
            try {
                if (!handlerPool.awaitTermination(30, TimeUnit.SECONDS)) {
                    handlerPool.shutdownNow();
                    log.warn("[DemoTcpServer] 핸들러 풀 강제 종료 (30초 초과)");
                }
            } catch (InterruptedException e) {
                handlerPool.shutdownNow();
                Thread.currentThread().interrupt();
            }
        }
    }
}
