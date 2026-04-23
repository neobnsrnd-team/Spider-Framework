package com.example.biztransfer.config;

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
 * biz-transfer TCP 서버 설정 클래스.
 *
 * <p>SpiderTcpServer를 포트 19200에서 기동하며,
 * Spring 컨텍스트에 등록된 모든 {@link CommandHandler} 구현체를
 * {@link CommandDispatcher}에 자동으로 위임한다.</p>
 *
 * <pre>{@code
 * // 핸들러를 추가하려면 @Component를 붙인 CommandHandler 구현체를 작성하면 된다.
 * // Spring이 List<CommandHandler<...>>로 자동 주입한다.
 * }</pre>
 */
@Configuration
public class BizTransferConfig {

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
     * 이체AP용 SpiderTcpServer 빈 등록.
     *
     * <p>포트 19200, 코어 스레드 10개, 최대 스레드 50개로 설정한다.
     * {@link MessageInstanceRecorder} 가 존재하면 수신 요청·응답을 DB에 기록한다.</p>
     *
     * @param objectMapper Spring이 제공하는 Jackson ObjectMapper
     * @param handlers     컨텍스트에 등록된 모든 커맨드 핸들러 목록
     * @param recorder     전문 이력 기록기 (JdbcTemplate 빈이 없으면 empty)
     * @return 구성된 SpiderTcpServer 인스턴스
     */
    @Bean
    public SpiderTcpServer<JsonCommandRequest, JsonCommandResponse> bizTransferTcpServer(
            ObjectMapper objectMapper,
            List<CommandHandler<JsonCommandRequest, JsonCommandResponse>> handlers,
            Optional<MessageInstanceRecorder> recorder) {

        CommandDispatcher<JsonCommandRequest, JsonCommandResponse> dispatcher =
                new CommandDispatcher<>(handlers);

        // 포트 19200, corePoolSize=10, maxPoolSize=50
        return new SpiderTcpServer<>(19200, 10, 50, new JsonMessageCodec(objectMapper), dispatcher,
                recorder.orElse(null));
    }
}
