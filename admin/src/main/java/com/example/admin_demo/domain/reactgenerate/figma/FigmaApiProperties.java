package com.example.admin_demo.domain.reactgenerate.figma;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * application.yml의 figma.api.* 설정을 바인딩하는 프로퍼티 클래스.
 *
 * <pre>{@code
 * figma:
 *   api:
 *     url: https://api.figma.com
 *     token: ${FIGMA_ACCESS_TOKEN}
 *     connect-timeout-seconds: 10
 *     read-timeout-seconds: 30
 * }</pre>
 */
@ConfigurationProperties(prefix = "figma.api")
public class FigmaApiProperties {

    /** Figma REST API 베이스 URL */
    private String url;

    /** Personal Access Token. 반드시 환경변수(FIGMA_ACCESS_TOKEN)로 주입 */
    private String token;

    /** 연결 타임아웃 (초) */
    private int connectTimeoutSeconds;

    /** 읽기 타임아웃 (초) */
    private int readTimeoutSeconds;

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public int getConnectTimeoutSeconds() {
        return connectTimeoutSeconds;
    }

    public void setConnectTimeoutSeconds(int connectTimeoutSeconds) {
        this.connectTimeoutSeconds = connectTimeoutSeconds;
    }

    public int getReadTimeoutSeconds() {
        return readTimeoutSeconds;
    }

    public void setReadTimeoutSeconds(int readTimeoutSeconds) {
        this.readTimeoutSeconds = readTimeoutSeconds;
    }
}
