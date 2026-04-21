package com.example.spiderlink.infra.tcp.server;

import com.example.spiderlink.infra.tcp.client.TcpClient;
import com.example.spiderlink.infra.tcp.model.JsonCommandRequest;
import com.example.spiderlink.infra.tcp.model.JsonCommandResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.net.Socket;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * spider-link TCP 서버에 연결된 Admin 클라이언트 1건을 처리하는 Runnable.
 *
 * <p>Admin으로부터 JsonCommandRequest를 수신하여 demo/backend로 그대로 프록시한다.
 * 커맨드 종류(PING, NOTICE_SYNC, NOTICE_END 등)를 해석하지 않고
 * 모든 커맨드를 demo/backend(9997)로 투명하게 포워딩한다.</p>
 *
 * <p>프로토콜: [4바이트 길이(int, big-endian)] + [UTF-8 JSON 바이트열]</p>
 */
@Slf4j
@RequiredArgsConstructor
public class LinkTcpClientHandler implements Runnable {

    /** 수신 메시지 최대 허용 크기 (1 MB) — 초과 시 비정상 요청으로 간주하여 연결 종료 */
    private static final int MAX_MSG_LEN = 1024 * 1024;

    private final Socket socket;
    private final TcpClient tcpClient;
    private final ObjectMapper objectMapper;
    private final String demoBackendHost;
    private final int demoBackendPort;

    @Override
    public void run() {
        try (socket) {
            socket.setKeepAlive(true);
            socket.setTcpNoDelay(true);
            socket.setSoTimeout(60_000);

            DataInputStream dis = new DataInputStream(socket.getInputStream());
            int length = dis.readInt();

            // 음수 또는 허용 최대 크기 초과 시 비정상 요청으로 즉시 연결 종료
            if (length < 0 || length > MAX_MSG_LEN) {
                log.error("[LinkTcpClientHandler] 허용 범위를 초과한 메시지 길이: {}", length);
                return;
            }

            byte[] bytes = new byte[length];
            dis.readFully(bytes);

            JsonCommandRequest request = objectMapper.readValue(bytes, JsonCommandRequest.class);
            log.info(
                    "[LinkTcpClientHandler] 수신: command={}, requestId={} → {}:{} 프록시",
                    request.getCommand(),
                    request.getRequestId(),
                    demoBackendHost,
                    demoBackendPort);

            JsonCommandResponse response = proxy(request);

            byte[] responseBytes = objectMapper.writeValueAsBytes(response);
            DataOutputStream dos = new DataOutputStream(socket.getOutputStream());
            dos.writeInt(responseBytes.length);
            dos.write(responseBytes);
            dos.flush();

            log.info(
                    "[LinkTcpClientHandler] 응답 전송 완료: command={}, success={}",
                    response.getCommand(),
                    response.isSuccess());
        } catch (IOException e) {
            log.warn("[LinkTcpClientHandler] 처리 중 오류: {}", e.getMessage());
        }
    }

    /**
     * Admin 요청을 demo/backend로 프록시하고 응답을 반환한다.
     * demo/backend 비가용 시 success=false 응답을 생성하여 Admin에 전달한다.
     */
    private JsonCommandResponse proxy(JsonCommandRequest request) {
        try {
            return tcpClient.sendJson(demoBackendHost, demoBackendPort, request);
        } catch (IOException e) {
            log.warn(
                    "[LinkTcpClientHandler] demo/backend 프록시 실패: command={}, error={}",
                    request.getCommand(),
                    e.getMessage());
            // demo/backend 비가용 시 Admin에 실패 응답 반환 (연결 자체는 유지)
            return JsonCommandResponse.builder()
                    .command(request.getCommand())
                    .success(false)
                    .error("demo/backend 연결 실패: " + e.getMessage())
                    .build();
        }
    }
}
