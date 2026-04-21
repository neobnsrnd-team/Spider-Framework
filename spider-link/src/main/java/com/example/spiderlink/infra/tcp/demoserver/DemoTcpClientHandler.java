package com.example.spiderlink.infra.tcp.demoserver;

import com.example.spiderlink.infra.tcp.handler.CommandDispatcher;
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
 * Demo TCP 서버에 연결된 demo/backend 클라이언트 1건을 처리하는 Runnable.
 *
 * <p>demo/backend로부터 JsonCommandRequest를 수신하여
 * CommandDispatcher에 위임한 뒤 JsonCommandResponse를 반환한다.</p>
 *
 * <p>프로토콜: [4바이트 길이(int, big-endian)] + [UTF-8 JSON 바이트열]</p>
 */
@Slf4j
@RequiredArgsConstructor
public class DemoTcpClientHandler implements Runnable {

    private static final int MAX_MSG_LEN = 1024 * 1024;

    private final Socket socket;
    private final CommandDispatcher commandDispatcher;
    private final ObjectMapper objectMapper;

    @Override
    public void run() {
        try (socket) {
            socket.setKeepAlive(true);
            socket.setTcpNoDelay(true);
            socket.setSoTimeout(60_000);

            DataInputStream dis = new DataInputStream(socket.getInputStream());
            int length = dis.readInt();

            if (length < 0 || length > MAX_MSG_LEN) {
                log.error("[DemoTcpClientHandler] 허용 범위를 초과한 메시지 길이: {}", length);
                return;
            }

            byte[] bytes = new byte[length];
            dis.readFully(bytes);

            JsonCommandRequest request = objectMapper.readValue(bytes, JsonCommandRequest.class);
            log.info("[DemoTcpClientHandler] 수신: command={}, requestId={}", request.getCommand(), request.getRequestId());

            Object result;
            try {
                result = commandDispatcher.dispatch(request.getCommand(), request);
            } catch (Exception e) {
                log.warn("[DemoTcpClientHandler] 커맨드 처리 중 예외: command={}, error={}", request.getCommand(), e.getMessage(), e);
                result = JsonCommandResponse.builder()
                        .command(request.getCommand())
                        .success(false)
                        .error(e.getMessage())
                        .build();
            }

            byte[] responseBytes = objectMapper.writeValueAsBytes(result);
            DataOutputStream dos = new DataOutputStream(socket.getOutputStream());
            dos.writeInt(responseBytes.length);
            dos.write(responseBytes);
            dos.flush();

            log.info("[DemoTcpClientHandler] 응답 전송 완료: command={}", request.getCommand());
        } catch (IOException e) {
            log.warn("[DemoTcpClientHandler] 처리 중 오류: {}", e.getMessage());
        }
    }
}
