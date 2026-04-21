/**
 * @file NettyTcpServerConfig.java
 * @description Netty TCP 서버 기동 설정 클래스.
 *              Spring 컨텍스트 초기화 완료 후 TCP 서버를 시작하고
 *              종료 시 Netty EventLoopGroup을 안전하게 shutdown한다.
 *
 * @description Netty 서버 구성:
 *   - BossGroup: 클라이언트 연결 수락 (boss 스레드 수 설정 가능)
 *   - WorkerGroup: I/O 처리 (worker 스레드 수 설정 가능)
 *   - SO_BACKLOG: 연결 대기 큐 크기
 *   - SO_KEEPALIVE: TCP keepalive 활성화 (유휴 연결 자동 정리)
 */
package com.example.tcpbackend.config;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.example.tcpbackend.domain.notice.NoticeService;
import com.example.tcpbackend.tcp.TcpServerInitializer;

import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.Channel;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelOption;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.nio.NioServerSocketChannel;

/**
 * Netty TCP 서버 생명주기 관리자.
 *
 * <p>Spring 빈으로 등록되어 애플리케이션 기동 시 TCP 서버를 시작하고
 * 종료 시 Netty 자원을 안전하게 해제한다.
 */
@Component
public class NettyTcpServerConfig {

    private static final Logger log = LoggerFactory.getLogger(NettyTcpServerConfig.class);

    private final AppProperties appProperties;
    private final TcpServerInitializer serverInitializer;
    private final NoticeService noticeService;

    /** Netty acceptor 스레드 그룹 (연결 수락 전용) */
    private EventLoopGroup bossGroup;

    /** Netty I/O 처리 스레드 그룹 */
    private EventLoopGroup workerGroup;

    /** 서버 채널 참조 (shutdown 시 close에 사용) */
    private Channel serverChannel;

    public NettyTcpServerConfig(AppProperties appProperties,
                                TcpServerInitializer serverInitializer,
                                NoticeService noticeService) {
        this.appProperties   = appProperties;
        this.serverInitializer = serverInitializer;
        this.noticeService   = noticeService;
    }

    /**
     * Spring 컨텍스트 초기화 완료 후 TCP 서버를 기동한다.
     *
     * <ul>
     *   <li>DB에서 긴급공지 배포 상태를 복구한다 (재기동 시 공지 유지).</li>
     *   <li>Netty ServerBootstrap을 구성하고 설정된 포트에서 수신 대기를 시작한다.</li>
     * </ul>
     *
     * @throws InterruptedException 서버 bind 중 인터럽트 발생 시
     */
    @PostConstruct
    public void start() throws InterruptedException {
        // ① 재기동 시 배포 중인 긴급공지 상태 복구
        noticeService.restoreFromDb();

        AppProperties.Tcp tcpProps = appProperties.getTcp();

        bossGroup   = new NioEventLoopGroup(tcpProps.getBossThreads());
        workerGroup = new NioEventLoopGroup(tcpProps.getWorkerThreads());

        ServerBootstrap bootstrap = new ServerBootstrap()
                .group(bossGroup, workerGroup)
                .channel(NioServerSocketChannel.class)
                // 연결 요청이 몰릴 때 대기할 수 있는 큐 크기 (OS TCP backlog)
                .option(ChannelOption.SO_BACKLOG, 128)
                // TCP keepalive: 유휴 상태의 연결을 OS가 주기적으로 확인해 자동 정리
                .childOption(ChannelOption.SO_KEEPALIVE, true)
                .childHandler(serverInitializer);

        ChannelFuture future = bootstrap.bind(tcpProps.getPort()).sync();
        serverChannel = future.channel();

        log.info("[TCP Server] Netty TCP 서버 기동 완료 — port: {}, boss: {}, worker: {}",
                tcpProps.getPort(), tcpProps.getBossThreads(), tcpProps.getWorkerThreads());

        // 서버 채널을 논블로킹으로 감시 (비동기 — 메인 스레드 블로킹 없음)
        future.channel().closeFuture().addListener(f ->
                log.info("[TCP Server] 서버 채널 종료 감지"));
    }

    /**
     * Spring 컨텍스트 종료 시 Netty 자원을 안전하게 해제한다.
     *
     * <p>진행 중인 I/O 처리가 완료될 때까지 graceful shutdown을 시도한다.
     */
    @PreDestroy
    public void stop() {
        log.info("[TCP Server] Netty TCP 서버 정상 종료 시작...");
        try {
            if (serverChannel != null) {
                serverChannel.close().sync();
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        } finally {
            if (workerGroup != null) workerGroup.shutdownGracefully();
            if (bossGroup   != null) bossGroup.shutdownGracefully();
            log.info("[TCP Server] Netty TCP 서버 종료 완료");
        }
    }
}
