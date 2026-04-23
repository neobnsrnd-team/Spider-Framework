package com.example.bizchannel;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 채널AP (biz-channel) 애플리케이션 진입점.
 *
 * <p>HTTP port 9998 에서 React 프론트엔드(demo/front) 요청을 수신하고,
 * spider-link {@code TcpClient} 를 통해 인증AP(biz-auth, TCP 19100) 및
 * 이체AP(biz-transfer, TCP 19200) 로 요청을 중계한다.</p>
 *
 * <p>JWT 기반 인증(액세스 토큰 + httpOnly 쿠키 리프레시 토큰)을 직접 처리하며,
 * SSE(Server-Sent Events) 를 통해 공지사항을 실시간으로 클라이언트에 푸시한다.</p>
 */
@SpringBootApplication
public class BizChannelApplication {

    public static void main(String[] args) {
        SpringApplication.run(BizChannelApplication.class, args);
    }
}
