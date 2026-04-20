package com.example.reactplatform.domain.reactgenerate.ai.client;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * application.yml의 claude.api.* 설정을 바인딩하는 프로퍼티 클래스.
 *
 * <pre>{@code
 * claude:
 *   api:
 *     url: https://api.anthropic.com/v1/messages
 *     key: ${CLAUDE_API_KEY}
 *     model: claude-sonnet-4-6
 *     max-tokens: 8192
 *     connect-timeout-seconds: 10
 *     read-timeout-seconds: 120
 * }</pre>
 */
@ConfigurationProperties(prefix = "claude.api")
public class ClaudeApiProperties {

    /** Claude API 엔드포인트 URL */
    private String url;

    /** API 인증 키. 반드시 환경변수(CLAUDE_API_KEY)로 주입 */
    private String key;

    /** 사용할 Claude 모델 ID */
    private String model;

    /** 응답 최대 토큰 수 */
    private int maxTokens;

    /** 연결 타임아웃 (초). Claude API 호출은 기본 RestTemplate과 별도 설정 */
    private int connectTimeoutSeconds;

    /** 읽기 타임아웃 (초). 코드 생성 요청은 수십 초 소요 가능 */
    private int readTimeoutSeconds;

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public int getMaxTokens() {
        return maxTokens;
    }

    public void setMaxTokens(int maxTokens) {
        this.maxTokens = maxTokens;
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
