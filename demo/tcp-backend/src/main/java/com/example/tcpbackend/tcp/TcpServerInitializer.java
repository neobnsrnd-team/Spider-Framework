/**
 * @file TcpServerInitializer.java
 * @description Netty 채널 파이프라인 초기화기.
 *              신규 TCP 연결이 수락될 때마다 호출되어 코덱과 핸들러를 파이프라인에 등록한다.
 *
 * @description 파이프라인 구성 (인바운드 순서):
 *   1. LengthPrefixDecoder  — 4바이트 길이 헤더를 읽어 TcpRequest로 역직렬화
 *   2. TcpMessageHandler    — 커맨드 라우팅 및 비즈니스 처리
 *
 * @description 파이프라인 구성 (아웃바운드 순서):
 *   1. LengthPrefixEncoder  — TcpResponse를 4바이트 길이 헤더 + JSON으로 직렬화
 */
package com.example.tcpbackend.tcp;

import org.springframework.stereotype.Component;

import com.example.tcpbackend.config.AppProperties;
import com.example.tcpbackend.tcp.codec.LengthPrefixDecoder;
import com.example.tcpbackend.tcp.codec.LengthPrefixEncoder;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelPipeline;
import io.netty.channel.socket.SocketChannel;

/**
 * Netty 채널 파이프라인 초기화기.
 *
 * <p>LengthPrefixEncoder는 Sharable이므로 공유 인스턴스를 재사용한다.
 * LengthPrefixDecoder는 채널별 내부 누적 버퍼를 가지므로 매 연결마다 new 인스턴스를 생성한다.
 */
@Component
public class TcpServerInitializer extends ChannelInitializer<SocketChannel> {

    private final ObjectMapper objectMapper;
    private final AppProperties appProperties;
    private final TcpMessageHandler messageHandler;

    /** 모든 채널이 공유하는 Encoder 단일 인스턴스 (Sharable) */
    private final LengthPrefixEncoder encoder;

    public TcpServerInitializer(ObjectMapper objectMapper,
                                AppProperties appProperties,
                                TcpMessageHandler messageHandler) {
        this.objectMapper   = objectMapper;
        this.appProperties  = appProperties;
        this.messageHandler = messageHandler;
        this.encoder        = new LengthPrefixEncoder(objectMapper);
    }

    @Override
    protected void initChannel(SocketChannel ch) {
        ChannelPipeline pipeline = ch.pipeline();

        // 아웃바운드: TcpResponse → 4바이트 헤더 + JSON (Sharable, 단일 인스턴스 재사용)
        pipeline.addLast("encoder", encoder);

        // 인바운드: 바이트 스트림 → TcpRequest (채널별 별도 인스턴스 필요)
        pipeline.addLast("decoder", new LengthPrefixDecoder(
                objectMapper, appProperties.getTcp().getMaxFrameLength()));

        // 비즈니스 로직 라우터 (Sharable, 단일 인스턴스 재사용)
        pipeline.addLast("handler", messageHandler);
    }
}
