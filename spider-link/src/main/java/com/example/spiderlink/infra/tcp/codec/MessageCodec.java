package com.example.spiderlink.infra.tcp.codec;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

/**
 * TCP 메시지 직렬화/역직렬화 전략 인터페이스.
 *
 * <p>프로토콜별 구현체를 교체함으로써 {@link com.example.spiderlink.infra.tcp.server.SpiderTcpServer}가
 * 특정 직렬화 방식에 의존하지 않도록 한다.</p>
 *
 * @param <REQ> 요청 메시지 타입 ({@link HasCommand} 구현 필요)
 * @param <RES> 응답 메시지 타입
 */
public interface MessageCodec<REQ, RES> {

    /**
     * 스트림에서 요청 메시지를 읽어 역직렬화한다.
     *
     * @param in 소켓 입력 스트림
     * @return 역직렬화된 요청 객체
     * @throws IOException 역직렬화 실패 또는 스트림 읽기 오류
     */
    REQ decode(InputStream in) throws IOException;

    /**
     * 응답 메시지를 직렬화하여 스트림에 쓴다.
     *
     * @param out      소켓 출력 스트림
     * @param response 직렬화할 응답 객체
     * @throws IOException 직렬화 실패 또는 스트림 쓰기 오류
     */
    void encode(OutputStream out, RES response) throws IOException;
}
