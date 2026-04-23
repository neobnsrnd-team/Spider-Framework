package com.example.bizauth.config;

import com.example.spiderlink.domain.messageinstance.MessageInstanceRecorder;
import com.example.spiderlink.infra.tcp.client.TcpClient;
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
 * 인증AP TCP 서버 설정 클래스.
 *
 * <p>SpiderTcpServer 를 스프링 빈으로 등록한다.
 * {@link SpiderTcpServer} 는 {@code ApplicationRunner} 를 구현하므로
 * 컨텍스트 로드 완료 후 자동으로 서버를 시작하고,
 * {@code @PreDestroy} 훅을 통해 애플리케이션 종료 시 자동으로 정지한다.</p>
 *
 * <pre>{@code
 *   // 수신 흐름: biz-channel → [TCP 19100] → SpiderTcpServer → CommandDispatcher → AuthLoginHandler / AuthMeHandler
 *   // 발신 흐름: AuthService → TcpClient → [TCP 19300] → mock-core
 * }</pre>
 */
@Configuration
public class BizAuthConfig {

    /**
     * spider-link TcpClient 빈 등록.
     *
     * <p>{@link TcpClient} 는 {@code com.example.spiderlink} 패키지에 선언되어 있어
     * 컴포넌트 스캔 범위에 포함되지 않으므로 명시적으로 등록한다.
     * {@link MessageInstanceRecorder} 가 존재하면 주입하여 전문 이력을 기록한다.</p>
     *
     * @param objectMapper Jackson ObjectMapper
     * @param recorder     전문 이력 기록기 (JdbcTemplate 빈이 없으면 empty)
     * @return TcpClient 인스턴스
     */
    @Bean
    public TcpClient tcpClient(ObjectMapper objectMapper,
                                Optional<MessageInstanceRecorder> recorder) {
        return new TcpClient(objectMapper, recorder.orElse(null));
    }

    /**
     * 인증AP 인바운드 TCP 서버 빈.
     *
     * <p>스프링이 수집한 {@link CommandHandler} 구현체 목록을
     * {@link CommandDispatcher} 에 등록하여 커맨드별 라우팅을 수행한다.
     * {@link MessageInstanceRecorder} 가 존재하면 수신 요청·응답을 DB에 기록한다.</p>
     *
     * @param objectMapper JSON 직렬화·역직렬화에 사용할 ObjectMapper
     * @param handlers     스프링 컨텍스트에 등록된 모든 CommandHandler 구현체 목록
     * @param recorder     전문 이력 기록기 (JdbcTemplate 빈이 없으면 empty)
     * @return port 19100 에서 수신 대기하는 SpiderTcpServer 인스턴스
     */
    @Bean
    public SpiderTcpServer<JsonCommandRequest, JsonCommandResponse> bizAuthTcpServer(
            ObjectMapper objectMapper,
            List<CommandHandler<JsonCommandRequest, JsonCommandResponse>> handlers,
            Optional<MessageInstanceRecorder> recorder) {

        CommandDispatcher<JsonCommandRequest, JsonCommandResponse> dispatcher =
                new CommandDispatcher<>(handlers);

        // port=19100, handlerPoolSize=5, queueCapacity=20
        return new SpiderTcpServer<>(19100, 5, 20, new JsonMessageCodec(objectMapper), dispatcher,
                recorder.orElse(null));
    }
}
