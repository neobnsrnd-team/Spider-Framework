package com.example.spiderlink.infra.tcp.handler;

import com.example.spiderlink.infra.tcp.model.JsonCommandRequest;

/**
 * TCP 커맨드 핸들러 인터페이스 (전략 패턴).
 *
 * <p>CommandDispatcher가 supports()로 적합한 핸들러를 선택하여 위임한다.</p>
 */
public interface CommandHandler {

    boolean supports(String command);

    Object handle(String command, JsonCommandRequest request);
}
