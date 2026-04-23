package com.example.bizauth;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 인증AP (biz-auth) 애플리케이션 진입점.
 *
 * <p>SpiderTcpServer 를 통해 TCP port 19100 에서 채널AP(biz-channel) 요청을 수신하고,
 * TcpClient 를 통해 계정계 Mock(mock-core, TCP port 19300) 에 요청을 위임한다.</p>
 *
 * <p>HTTP 서버를 사용하지 않는 비Web 스탠드얼론 애플리케이션이다.
 * {@code spring.main.web-application-type=none} 설정으로 내장 서블릿 컨테이너를 비활성화한다.</p>
 */
@SpringBootApplication
public class BizAuthApplication {

    public static void main(String[] args) {
        SpringApplication.run(BizAuthApplication.class, args);
    }
}
