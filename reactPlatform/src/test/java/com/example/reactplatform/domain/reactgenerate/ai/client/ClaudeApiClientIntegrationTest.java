package com.example.reactplatform.domain.reactgenerate.ai.client;

import static org.assertj.core.api.Assertions.assertThatNoException;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import org.springframework.boot.web.client.RestTemplateBuilder;

/**
 * @file ClaudeApiClientIntegrationTest.java
 * @description Claude API 실 연결 확인 통합 테스트.
 *     API 키 유효성, URL 정확성, 네트워크 경로를 실제 호출로 검증한다.
 *     CLAUDE_API_KEY 환경변수가 없으면 자동으로 건너뛴다.
 *     비용 최소화를 위해 max-tokens=1, haiku 모델을 사용한다 (≈ $0.001 미만).
 * @see ClaudeApiClient
 */
@Tag("integration")
@EnabledIfEnvironmentVariable(named = "CLAUDE_API_KEY", matches = ".+")
class ClaudeApiClientIntegrationTest {

    private ClaudeApiClient client;

    @BeforeEach
    void setUp() {
        ClaudeApiProperties props = new ClaudeApiProperties();
        props.setUrl("https://api.anthropic.com/v1/messages");
        props.setKey(System.getenv("CLAUDE_API_KEY"));
        props.setModel("claude-haiku-4-5-20251001"); // 가장 저렴한 모델로 비용 절감
        props.setMaxTokens(1); // 응답 1토큰만 받아 입출력 토큰 최소화
        props.setConnectTimeoutSeconds(10);
        props.setReadTimeoutSeconds(30);

        client = new ClaudeApiClient(new RestTemplateBuilder(), props);
    }

    @Test
    @DisplayName("실 Claude API 연결 확인 — API 키 유효성·URL·네트워크 경로 검증")
    void generate_realApiConnection_succeeds() {
        // max_tokens=1이라 응답이 잘릴 수 있지만, InternalException 없이 반환되면 연결 성공
        assertThatNoException().isThrownBy(() -> client.generate("You are a minimal test assistant.", "Say hi"));
    }
}
