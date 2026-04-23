package com.example.mockcore.config;

import com.example.spiderlink.domain.messageinstance.MessageInstanceRecorder;
import com.example.spiderlink.infra.tcp.codec.JsonMessageCodec;
import com.example.spiderlink.infra.tcp.handler.CommandDispatcher;
import com.example.spiderlink.infra.tcp.handler.CommandHandler;
import com.example.spiderlink.infra.tcp.model.JsonCommandRequest;
import com.example.spiderlink.infra.tcp.model.JsonCommandResponse;
import com.example.spiderlink.infra.tcp.server.SpiderTcpServer;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;
import java.util.Optional;

/**
 * 계정계 Mock TCP 서버 설정 클래스.
 *
 * <p>SpiderTcpServer를 포트 19300에서 시작하며, Spring 컨텍스트에 등록된
 * 모든 {@link CommandHandler} 빈을 {@link CommandDispatcher}에 자동 주입한다.</p>
 *
 * <pre>{@code
 * // SpiderTcpServer는 ApplicationRunner를 구현하여 자동 시작되며,
 * // @PreDestroy 로 애플리케이션 종료 시 자동 정지된다.
 * }</pre>
 */
@Configuration
public class MockCoreConfig {

    /**
     * 계정계 Mock용 TCP 서버 빈.
     *
     * @param objectMapper JSON 직렬화에 사용할 ObjectMapper (Spring 자동 주입)
     * @param handlers     컨텍스트에 등록된 모든 CommandHandler 목록 (Spring 자동 수집)
     * @return 포트 19300에서 동작하는 SpiderTcpServer 인스턴스
     */
    /**
     * 계정계 Mock용 TCP 서버 빈.
     *
     * <p>mock-core는 datasource가 구성되어 있으므로 JdbcTemplate 빈이 항상 존재하며,
     * {@link MessageInstanceRecorder} 를 통해 전문 이력이 자동 기록된다.</p>
     *
     * @param objectMapper JSON 직렬화에 사용할 ObjectMapper (Spring 자동 주입)
     * @param handlers     컨텍스트에 등록된 모든 CommandHandler 목록 (Spring 자동 수집)
     * @param recorder     전문 이력 기록기 (JdbcTemplate 빈이 없으면 empty)
     * @return 포트 19300에서 동작하는 SpiderTcpServer 인스턴스
     */
    @Bean
    public SpiderTcpServer<JsonCommandRequest, JsonCommandResponse> mockCoreTcpServer(
            ObjectMapper objectMapper,
            List<CommandHandler<JsonCommandRequest, JsonCommandResponse>> handlers,
            Optional<MessageInstanceRecorder> recorder) {

        CommandDispatcher<JsonCommandRequest, JsonCommandResponse> dispatcher =
                new CommandDispatcher<>(handlers);

        // 포트 19300, 워커 스레드 10개, 요청 큐 최대 50개
        return new SpiderTcpServer<>(19300, 10, 50,
                new JsonMessageCodec(objectMapper), dispatcher, recorder.orElse(null));
    }
}
