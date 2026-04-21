/**
 * @file LengthPrefixEncoder.java
 * @description Netty 아웃바운드 핸들러 — TcpResponse를 4바이트 길이 헤더 + JSON body로 인코딩.
 *
 * @description 인코딩 순서:
 *   1. TcpResponse를 UTF-8 JSON 바이트 배열로 직렬화한다.
 *   2. 4바이트 big-endian 정수로 JSON 길이를 쓴다.
 *   3. JSON 바이트를 이어서 쓴다.
 */
package com.example.tcpbackend.tcp.codec;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.example.tcpbackend.tcp.TcpResponse;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.netty.buffer.ByteBuf;
import io.netty.buffer.ByteBufOutputStream;
import io.netty.channel.ChannelHandlerContext;
import io.netty.handler.codec.MessageToByteEncoder;

/**
 * TCP 메시지 인코더.
 *
 * <p>{@code @ChannelHandler.Sharable}: ObjectMapper는 스레드 안전하므로
 * 모든 채널이 단일 인스턴스를 공유할 수 있다.
 * {@link TcpServerInitializer}에서 동일 인스턴스를 모든 채널에 등록한다.
 */
@io.netty.channel.ChannelHandler.Sharable
public class LengthPrefixEncoder extends MessageToByteEncoder<TcpResponse> {

    private static final Logger log = LoggerFactory.getLogger(LengthPrefixEncoder.class);

    private final ObjectMapper objectMapper;

    /**
     * @param objectMapper JSON 직렬화에 사용할 Jackson ObjectMapper
     */
    public LengthPrefixEncoder(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    protected void encode(ChannelHandlerContext ctx, TcpResponse msg, ByteBuf out) throws Exception {
        try {
            // 길이 헤더 자리를 먼저 확보하고, ByteBufOutputStream으로 ByteBuf에 직접 직렬화
            // — byte[] 중간 복사 없이 메모리 할당 비용을 줄인다
            int lenIdx = out.writerIndex();
            out.writeInt(0); // 길이 헤더 placeholder
            try (ByteBufOutputStream bbos = new ByteBufOutputStream(out)) {
                objectMapper.writeValue((java.io.OutputStream) bbos, msg);
            }
            // 실제 기록된 JSON 바이트 수로 길이 헤더를 덮어씀
            int bodyLen = out.writerIndex() - lenIdx - Integer.BYTES;
            out.setInt(lenIdx, bodyLen);
        } catch (Exception e) {
            log.error("[Encoder] JSON 직렬화 실패 (channel={}): {}", ctx.channel().id(), e.getMessage());
            // 직렬화 실패 시 해당 응답은 전송하지 않는다 — 클라이언트 타임아웃으로 처리
        }
    }
}
