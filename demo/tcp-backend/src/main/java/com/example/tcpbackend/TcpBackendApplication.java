/**
 * @file TcpBackendApplication.java
 * @description Spring Boot 애플리케이션 진입점.
 *              Netty TCP 서버가 Spring 컨텍스트 초기화 완료 후 자동으로 기동된다.
 *              웹 서버(Tomcat 등)는 사용하지 않으므로 spring-boot-starter-web 의존성이 없다.
 */
package com.example.tcpbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * HNC POC Demo Backend — Netty 기반 TCP/IP 서버 애플리케이션.
 *
 * <p>기존 Node.js HTTP API(port 3001)를 TCP 소켓 통신으로 전환한 구현체다.
 * 클라이언트는 4바이트 길이 헤더 + UTF-8 JSON 형식으로 메시지를 전송한다.
 *
 * <pre>{@code
 * 메시지 프레임 구조:
 *   [4 bytes: 전체 길이(big-endian)] [N bytes: UTF-8 JSON body]
 *
 * 요청 JSON 구조:
 *   { "cmd": "LOGIN", "sessionId": null, "adminSecret": null, "payload": { ... } }
 *
 * 응답 JSON 구조:
 *   { "cmd": "LOGIN", "success": true, "sessionId": "...", "data": { ... }, "error": null }
 * }</pre>
 */
@SpringBootApplication
public class TcpBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(TcpBackendApplication.class, args);
    }
}