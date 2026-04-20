package com.example.batchwas.domain.batch.tcp;

import com.example.admin_demo.infra.tcp.model.ManagementContext;
import com.example.batchwas.domain.batch.dto.BatchExecuteRequest;
import com.example.batchwas.domain.batch.dto.BatchExecuteResponse;
import com.example.batchwas.domain.batch.service.BatchExecuteService;
import java.io.IOException;
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

    @Override
    public void run(ApplicationArguments args) {
        Thread serverThread = new Thread(this::startServer, "batch-tcp-server");
        serverThread.setDaemon(true);
        serverThread.start();
        log.info("[BatchTcpServer] batch-was TCP 서버 스레드 시작 (port={})", tcpPort);
    }

    private void startServer() {
        try (ServerSocket serverSocket = new ServerSocket(tcpPort)) {
            log.info("[BatchTcpServer] 포트 {} 에서 대기 중", tcpPort);
            while (!Thread.currentThread().isInterrupted()) {
                Socket clientSocket = serverSocket.accept();
                Thread handlerThread = new Thread(
                        () -> handleClient(clientSocket),
                        "batch-tcp-handler-" + clientSocket.getPort());
                handlerThread.setDaemon(true);
                handlerThread.start();
            }
        } catch (IOException e) {
            log.error("[BatchTcpServer] 서버 소켓 오류: {}", e.getMessage(), e);
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
                .exception(new IllegalArgumentException("지원하지 않는 커맨드: " + ctx.getCommand()))
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
                    .exception(e)
                    .build();
        }
    }
}
