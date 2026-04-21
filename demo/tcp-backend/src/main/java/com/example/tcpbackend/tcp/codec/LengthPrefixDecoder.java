/**
 * @file LengthPrefixDecoder.java
 * @description Netty 인바운드 핸들러 — 4바이트 길이 헤더 + JSON body 디코더.
 *              TCP 스트림에서 메시지 경계를 식별하고 TcpRequest로 역직렬화한다.
 *
 * @description 프레임 구조:
 *   [4 bytes: 전체 길이 (big-endian int)] [N bytes: UTF-8 JSON]
 *   - 전체 길이 = JSON body 바이트 수 (길이 헤더 자체 4바이트 미포함)
 */
package com.example.tcpbackend.tcp.codec;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.example.tcpbackend.tcp.TcpRequest;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.netty.buffer.ByteBuf;
import io.netty.buffer.ByteBufInputStream;
import io.netty.channel.ChannelHandlerContext;
import io.netty.handler.codec.ByteToMessageDecoder;

/**
 * TCP 메시지 디코더.
 *
 * <p>Netty의 {@link ByteToMessageDecoder}를 상속해 다음 순서로 동작한다:
 * <ol>
 *   <li>수신 버퍼에서 첫 4바이트(길이 헤더)를 읽는다.</li>
 *   <li>길이 헤더만큼 body 바이트가 누적될 때까지 대기한다.</li>
 *   <li>body를 UTF-8로 읽어 {@link TcpRequest}로 역직렬화한다.</li>
 * </ol>
 *
 * <p>{@code @ChannelHandler.Sharable}을 붙이지 않은 이유:
 * ByteToMessageDecoder는 내부에 누적 버퍼(cumulation)를 가지므로
 * 채널마다 별도 인스턴스가 필요하다. {@link TcpServerInitializer}에서
 * 매 채널 연결 시 new 인스턴스를 주입한다.
 */
public class LengthPrefixDecoder extends ByteToMessageDecoder {

    private static final Logger log = LoggerFactory.getLogger(LengthPrefixDecoder.class);

    /** 길이 헤더 바이트 크기 (4바이트 고정) */
    private static final int HEADER_SIZE = 4;

    private final ObjectMapper objectMapper;
    private final int maxFrameLength;

    /**
     * @param objectMapper  JSON 역직렬화에 사용할 Jackson ObjectMapper
     * @param maxFrameLength 허용할 최대 메시지 바이트 수 (초과 시 연결 종료)
     */
    public LengthPrefixDecoder(ObjectMapper objectMapper, int maxFrameLength) {
        this.objectMapper = objectMapper;
        this.maxFrameLength = maxFrameLength;
    }

    @Override
    protected void decode(ChannelHandlerContext ctx, ByteBuf in, List<Object> out) throws Exception {
        // 길이 헤더(4바이트)를 읽을 수 있는지 확인 — 부족하면 다음 패킷 도착까지 대기
        if (in.readableBytes() < HEADER_SIZE) {
            return;
        }

        // 현재 읽기 위치를 마킹해 두어, body가 부족하면 복원할 수 있게 한다
        in.markReaderIndex();

        int bodyLength = in.readInt(); // big-endian 4바이트 길이

        // 비정상적으로 큰 메시지는 악의적 요청 또는 프로토콜 오류로 판단해 연결을 끊는다
        if (bodyLength > maxFrameLength || bodyLength < 0) {
            log.warn("[Decoder] 비정상 메시지 길이 감지: {} bytes — 연결 종료 (channel={})",
                    bodyLength, ctx.channel().id());
            ctx.close();
            return;
        }

        // body 바이트가 아직 다 도착하지 않았으면 읽기 위치를 헤더 이전으로 복원하고 대기
        if (in.readableBytes() < bodyLength) {
            in.resetReaderIndex();
            return;
        }

        // ByteBufInputStream으로 ByteBuf에서 직접 역직렬화 — byte[] 중간 복사 생략
        try (ByteBufInputStream bbis = new ByteBufInputStream(in, bodyLength)) {
            TcpRequest request = objectMapper.readValue((java.io.InputStream) bbis, TcpRequest.class);
            out.add(request);
        } catch (Exception e) {
            log.error("[Decoder] JSON 역직렬화 실패 (channel={}): {}", ctx.channel().id(), e.getMessage());
            // 잘못된 JSON은 해당 메시지만 버리고 연결은 유지한다
        }
    }
}