package com.example.spiderlink.infra.tcp.handler;

import com.example.spiderlink.infra.tcp.model.JsonCommandRequest;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * TCP 커맨드 디스패처 (전략 패턴).
 *
 * <p>Spring이 자동 수집한 CommandHandler 목록을 순회하여
 * 커맨드를 처리할 수 있는 핸들러에 위임한다.</p>
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class CommandDispatcher {

    private final List<CommandHandler> handlers;

    public Object dispatch(String command, JsonCommandRequest request) {
        log.info("[CommandDispatcher] dispatch: command={}, requestId={}", command, request.getRequestId());
        return handlers.stream()
                .filter(h -> h.supports(command))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("지원하지 않는 커맨드: " + command))
                .handle(command, request);
    }
}
