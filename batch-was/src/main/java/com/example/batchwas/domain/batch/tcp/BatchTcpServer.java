package com.example.batchwas.domain.batch.tcp;

import com.example.admin_demo.infra.tcp.model.ManagementContext;
import com.example.batchwas.domain.batch.dto.BatchExecuteRequest;
import com.example.batchwas.domain.batch.dto.BatchExecuteResponse;
import com.example.batchwas.domain.batch.service.BatchExecuteService;
import jakarta.annotation.PreDestroy;
import java.io.IOException;
import java.io.ObjectInputFilter;
import java.io.ObjectInputStream;
import java.io.ObjectOutputStream;
import java.net.ServerSocket;
import java.net.Socket;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

/**
 * batch-was TCP 서버 (포트 9998).
 *
 * <p>Admin의 BatchManagementAdapter로부터 ManagementContext를
 * Java ObjectStream 바이너리로 수신하고 BatchExecuteService를 호출한다.
 * HTTP REST 경로(BatchExecuteController)와 병행 운영된다.</p>
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class BatchTcpServer implements ApplicationRunner {

    @Value("${batch.tcp.port:9998}")
    private int tcpPort;

    private final BatchExecuteService batchExecuteService;

    /** accept 루프를 깨우기 위해 @PreDestroy에서 닫을 ServerSocket 참조 */
    private volatile ServerSocket serverSocket;

    /**
     * ObjectInputStream 역직렬화 허용 화이트리스트.
     * ManagementContext, String, java.util.** 이외의 클래스는 거부한다 (역직렬화 공격 방어).
     */
    private static final String DESERIALIZATION_FILTER_PATTERN =
            "com.example.admin_demo.infra.tcp.model.ManagementContext;java.lang.String;java.util.**;!*";

    @Override
    public void run(ApplicationArguments args) {
        Thread serverThread = new Thread(this::startServer, "batch-tcp-server");
        // 서버 accept 루프 스레드는 daemon 유지 (shutdown은 @PreDestroy에서 socket close로 처리)
        serverThread.setDaemon(true);
        serverThread.start();
        log.info("[BatchTcpServer] batch-was TCP 서버 스레드 시작 (port={})", tcpPort);
    }

    private void startServer() {
        try {
            serverSocket = new ServerSocket(tcpPort);
            log.info("[BatchTcpServer] 포트 {} 에서 대기 중", tcpPort);
            while (!Thread.currentThread().isInterrupted() && !serverSocket.isClosed()) {
                Socket clientSocket = serverSocket.accept();
                try {
                    Thread handlerThread = new Thread(
                            () -> handleClient(clientSocket),
                            "batch-tcp-handler-" + clientSocket.getPort());
                    // 핸들러 스레드는 non-daemon — JVM 종료 시 진행 중인 요청이 완료될 때까지 대기
                    handlerThread.setDaemon(false);
                    handlerThread.start();
                } catch (Exception e) {
                    // 스레드 생성 실패 시 소켓이 누수되지 않도록 즉시 close
                    log.error("[BatchTcpServer] 핸들러 스레드 생성 실패, 소켓 닫음: {}", e.getMessage());
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
                log.info("[BatchTcpServer] ServerSocket 종료됨 (정상 shutdown)");
            } else {
                log.error("[BatchTcpServer] 서버 소켓 오류: {}", e.getMessage(), e);
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
            log.info("[BatchTcpServer] TCP 서버 소켓 닫음 (shutdown)");
        }
    }

    /**
     * 개별 클라이언트 연결을 처리한다.
     * ObjectInputStream으로 ManagementContext를 수신하고,
     * 결과 ManagementContext를 ObjectOutputStream으로 반환한다.
     */
    private void handleClient(Socket socket) {
        try (socket) {
            socket.setKeepAlive(true);
            socket.setTcpNoDelay(true);
            socket.setSoTimeout(60_000);

            ObjectInputStream ois = new ObjectInputStream(socket.getInputStream());
            // 역직렬화 공격 방어: 허용된 클래스만 읽도록 화이트리스트 필터 적용
            ois.setObjectInputFilter(ObjectInputFilter.Config.createFilter(DESERIALIZATION_FILTER_PATTERN));
            ManagementContext ctx = (ManagementContext) ois.readObject();
            log.info("[BatchTcpServer] 수신: command={}, instanceId={}, batchAppId={}",
                    ctx.getCommand(), ctx.getInstanceId(), ctx.getBatchAppId());

            ManagementContext result = processCommand(ctx);

            ObjectOutputStream oos = new ObjectOutputStream(socket.getOutputStream());
            oos.writeObject(result);
            oos.flush();
            log.info("[BatchTcpServer] 응답 전송: resultCode={}", result.getResultCode());

        } catch (IOException | ClassNotFoundException e) {
            log.error("[BatchTcpServer] 클라이언트 처리 실패: {}", e.getMessage(), e);
        }
    }

    /**
     * 수신된 커맨드를 분기 처리한다.
     * PING — 헬스 체크, BATCH_EXEC — 배치 실행
     */
    private ManagementContext processCommand(ManagementContext ctx) {
        if ("PING".equals(ctx.getCommand())) {
            return ManagementContext.builder()
                    .command(ctx.getCommand())
                    .resultCode("PONG")
                    .build();
        }

        if ("BATCH_EXEC".equals(ctx.getCommand())) {
            return executeBatch(ctx);
        }

        return ManagementContext.builder()
                .command(ctx.getCommand())
                .resultCode("ERROR")
                .errorMessage("지원하지 않는 커맨드: " + ctx.getCommand())
                .build();
    }

    /**
     * BATCH_EXEC 커맨드를 BatchExecuteService에 위임한다.
     * ManagementContext 필드를 BatchExecuteRequest로 매핑하고,
     * 결과 BatchExecuteResponse를 다시 ManagementContext로 래핑해 반환한다.
     */
    private ManagementContext executeBatch(ManagementContext ctx) {
        try {
            BatchExecuteRequest request = BatchExecuteRequest.builder()
                    .batchAppId(ctx.getBatchAppId())
                    .batchDate(ctx.getBatchDate())
                    .userId(ctx.getUserId())
                    .parameters(ctx.getParameters())
                    .build();

            BatchExecuteResponse response = batchExecuteService.execute(request);

            return ManagementContext.builder()
                    .command(ctx.getCommand())
                    .instanceId(ctx.getInstanceId())
                    .batchAppId(ctx.getBatchAppId())
                    .resultCode(response.getResRtCode())
                    // BatchExecuteResponse.batchExecuteSeq는 int 타입이므로 Integer로 자동 박싱된다
                    .executeSeq(response.getBatchExecuteSeq())
                    .build();

        } catch (Exception e) {
            log.error("[BatchTcpServer] 배치 실행 실패: batchAppId={}, error={}", ctx.getBatchAppId(), e.getMessage(), e);
            return ManagementContext.builder()
                    .command(ctx.getCommand())
                    .instanceId(ctx.getInstanceId())
                    .batchAppId(ctx.getBatchAppId())
                    .resultCode("ERROR")
                    // Exception 직렬화 대신 클래스명 + 메시지를 문자열로 전달 (ObjectStream 호환성/보안)
                    .errorMessage(e.getClass().getName() + ": " + e.getMessage())
                    .build();
        }
    }
}
