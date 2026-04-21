package com.example.spiderbatch.config;

import com.example.spiderbatch.tcp.BatchExecCommandHandler;
import com.example.spiderlink.infra.tcp.codec.ObjectStreamMessageCodec;
import com.example.spiderlink.infra.tcp.handler.CommandDispatcher;
import com.example.spiderlink.infra.tcp.model.ManagementContext;
import com.example.spiderlink.infra.tcp.server.SpiderTcpServer;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * spider-batch TCP 서버 설정.
 *
 * <p>spider-link의 {@link SpiderTcpServer}에 {@link ObjectStreamMessageCodec}과
 * {@link BatchExecCommandHandler}를 주입하여 Admin ↔ spider-batch 구간 TCP 서버를 구성한다.</p>
 */
@Configuration
public class TcpServerConfig {

    /**
     * Admin과 ObjectStream 프로토콜로 통신하는 배치 TCP 서버 Bean.
     *
     * <p>Spring이 ApplicationRunner를 구현한 Bean을 자동으로 실행하므로
     * 별도의 시작 코드 없이 애플리케이션 기동 시 서버가 자동 시작된다.</p>
     */
    @Bean
    public SpiderTcpServer<ManagementContext, ManagementContext> batchTcpServer(
            @Value("${batch.tcp.port:9998}") int port,
            @Value("${batch.tcp.handler-pool-size:20}") int handlerPoolSize,
            @Value("${batch.tcp.queue-capacity:100}") int queueCapacity,
            BatchExecCommandHandler handler) {

        CommandDispatcher<ManagementContext, ManagementContext> dispatcher =
                new CommandDispatcher<>(List.of(handler));

        return new SpiderTcpServer<>(port, handlerPoolSize, queueCapacity, new ObjectStreamMessageCodec(), dispatcher);
    }
}
