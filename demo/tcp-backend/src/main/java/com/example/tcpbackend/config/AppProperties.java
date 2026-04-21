/**
 * @file AppProperties.java
 * @description application.yml의 커스텀 설정값을 바인딩하는 설정 속성 클래스.
 *              tcp.* 및 auth.* 네임스페이스를 담당한다.
 */
package com.example.tcpbackend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * 애플리케이션 커스텀 설정 속성 컨테이너.
 *
 * <p>Tcp, Auth는 각각 독립적인 @ConfigurationProperties 빈으로 등록되고,
 * AppProperties가 이를 @Autowired로 참조한다.
 * 다른 빈은 AppProperties 하나만 주입받아 getTcp()/getAuth()로 접근한다.
 */
@Configuration
public class AppProperties {

    @Autowired
    private Tcp tcp;

    @Autowired
    private Auth auth;

    @Autowired
    private SpiderLink spiderLink;

    public Tcp getTcp() { return tcp; }
    public Auth getAuth() { return auth; }
    public SpiderLink getSpiderLink() { return spiderLink; }

    /** TCP 서버 관련 설정 — application.yml의 tcp.* 에 바인딩 */
    @Configuration
    @ConfigurationProperties(prefix = "tcp")
    public static class Tcp {
        /** TCP 서버가 수신 대기할 포트 번호 */
        private int port = 9998;
        /** Netty acceptor(boss) 스레드 수 */
        private int bossThreads = 1;
        /** Netty I/O(worker) 스레드 수 */
        private int workerThreads = 4;
        /** 단일 메시지 최대 바이트 수 (기본 1MB) */
        private int maxFrameLength = 1_048_576;

        public int getPort() { return port; }
        public void setPort(int port) { this.port = port; }
        public int getBossThreads() { return bossThreads; }
        public void setBossThreads(int bossThreads) { this.bossThreads = bossThreads; }
        public int getWorkerThreads() { return workerThreads; }
        public void setWorkerThreads(int workerThreads) { this.workerThreads = workerThreads; }
        public int getMaxFrameLength() { return maxFrameLength; }
        public void setMaxFrameLength(int maxFrameLength) { this.maxFrameLength = maxFrameLength; }
    }

    /** spider-link 미들웨어 접속 정보 — application.yml의 spiderlink.* 에 바인딩 */
    @Configuration
    @ConfigurationProperties(prefix = "spiderlink")
    public static class SpiderLink {
        /** spider-link TCP 서버 호스트 */
        private String host = "localhost";
        /** spider-link TCP 서버 포트 */
        private int port = 9995;

        public String getHost() { return host; }
        public void setHost(String host) { this.host = host; }
        public int getPort() { return port; }
        public void setPort(int port) { this.port = port; }
    }

    /** 인증 관련 설정 — application.yml의 auth.* 에 바인딩 */
    @Configuration
    @ConfigurationProperties(prefix = "auth")
    public static class Auth {
        /** PIN 최대 허용 실패 횟수 */
        private int pinMaxAttempts = 3;
        /** Admin 전용 커맨드 인증 비밀 키 */
        private String adminSecret = "admin-secret";

        public int getPinMaxAttempts() { return pinMaxAttempts; }
        public void setPinMaxAttempts(int pinMaxAttempts) { this.pinMaxAttempts = pinMaxAttempts; }
        public String getAdminSecret() { return adminSecret; }
        public void setAdminSecret(String adminSecret) { this.adminSecret = adminSecret; }
    }
}