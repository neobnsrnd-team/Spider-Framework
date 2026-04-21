package com.example.reactplatform.domain.reactgenerate.ai.client;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.example.reactplatform.global.exception.InternalException;
import java.lang.reflect.Field;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

/**
 * @file ClaudeApiClientTest.java
 * @description ClaudeApiClient 단위 테스트.
 *     실제 HTTP 요청 없이 요청 헤더·바디 구조, 응답 파싱(extractText·extractCodeBlock),
 *     예외 변환(RestClientException → InternalException)을 검증한다.
 * @see ClaudeApiClient
 */
@ExtendWith(MockitoExtension.class)
class ClaudeApiClientTest {

    @Mock
    private RestTemplate restTemplate;

    private ClaudeApiClient client;
    private ClaudeApiProperties props;

    private static final String TEST_URL = "https://api.anthropic.com/v1/messages";
    private static final String TEST_KEY = "test-api-key";
    private static final String TEST_MODEL = "claude-sonnet-4-6";
    private static final int TEST_MAX_TOKENS = 8192;

    @BeforeEach
    void setUp() throws Exception {
        props = new ClaudeApiProperties();
        props.setUrl(TEST_URL);
        props.setKey(TEST_KEY);
        props.setModel(TEST_MODEL);
        props.setMaxTokens(TEST_MAX_TOKENS);
        props.setConnectTimeoutSeconds(10);
        props.setReadTimeoutSeconds(120);

        client = new ClaudeApiClient(new RestTemplateBuilder(), props);

        // ClaudeApiClient가 생성자에서 직접 빌드한 RestTemplate을 Mock으로 교체
        Field field = ClaudeApiClient.class.getDeclaredField("restTemplate");
        field.setAccessible(true);
        field.set(client, restTemplate);
    }

    // ========== 요청 구조 검증 ==========

    @Test
    @DisplayName("요청 헤더에 x-api-key, anthropic-version, Content-Type이 포함된다")
    void generate_sendsRequiredHeaders() {
        stubSuccess("some code");

        client.generate("system", "user");

        HttpEntity<Map<String, Object>> entity = captureEntity();
        assertThat(entity.getHeaders().getFirst("x-api-key")).isEqualTo(TEST_KEY);
        assertThat(entity.getHeaders().getFirst("anthropic-version")).isEqualTo("2023-06-01");
        assertThat(entity.getHeaders().getContentType()).isEqualTo(MediaType.APPLICATION_JSON);
    }

    @Test
    @DisplayName("요청 바디에 model, max_tokens, system, messages가 올바르게 포함된다")
    void generate_sendsCorrectBody() {
        stubSuccess("some code");

        client.generate("my system prompt", "my user prompt");

        Map<String, Object> body = captureEntity().getBody();
        assertThat(body).containsEntry("model", TEST_MODEL);
        assertThat(body).containsEntry("max_tokens", TEST_MAX_TOKENS);
        assertThat(body).containsEntry("system", "my system prompt");

        @SuppressWarnings("unchecked")
        List<Map<String, Object>> messages = (List<Map<String, Object>>) body.get("messages");
        assertThat(messages).hasSize(1);
        assertThat(messages.get(0)).containsEntry("role", "user");
        assertThat(messages.get(0)).containsEntry("content", "my user prompt");
    }

    // ========== 응답 파싱 검증 ==========

    @Test
    @DisplayName("응답에 ```tsx 코드 블록이 있으면 코드만 추출해 반환한다")
    void generate_extractsTsxCodeBlock() {
        String code = "import React from 'react';\nexport default function App() {}";
        stubSuccess("```tsx\n" + code + "\n```");

        assertThat(client.generate("system", "user")).isEqualTo(code);
    }

    @Test
    @DisplayName("응답에 ```typescript 코드 블록이 있어도 코드만 추출한다")
    void generate_extractsTypescriptCodeBlock() {
        String code = "const x: string = 'hello';";
        stubSuccess("```typescript\n" + code + "\n```");

        assertThat(client.generate("system", "user")).isEqualTo(code);
    }

    @Test
    @DisplayName("코드 블록이 없으면 응답 전체 텍스트를 그대로 반환한다")
    void generate_noCodeBlock_returnsRawText() {
        String rawText = "const x = 1;";
        stubSuccess(rawText);

        assertThat(client.generate("system", "user")).isEqualTo(rawText);
    }

    // ========== 예외 처리 검증 ==========

    @Test
    @DisplayName("RestClientException 발생 시 InternalException으로 변환한다")
    void generate_restClientException_throwsInternalException() {
        when(restTemplate.exchange(anyString(), any(), any(), any(ParameterizedTypeReference.class)))
                .thenThrow(new RestClientException("connection refused"));

        assertThatThrownBy(() -> client.generate("system", "user")).isInstanceOf(InternalException.class);
    }

    @Test
    @DisplayName("응답 body가 null이면 InternalException을 던진다")
    void generate_nullBody_throwsInternalException() {
        when(restTemplate.exchange(anyString(), any(), any(), any(ParameterizedTypeReference.class)))
                .thenReturn(ResponseEntity.ok(null));

        assertThatThrownBy(() -> client.generate("system", "user")).isInstanceOf(InternalException.class);
    }

    @Test
    @DisplayName("응답 content 배열이 비어있으면 InternalException을 던진다")
    void generate_emptyContent_throwsInternalException() {
        when(restTemplate.exchange(anyString(), any(), any(), any(ParameterizedTypeReference.class)))
                .thenReturn(ResponseEntity.ok(Map.of("content", List.of())));

        assertThatThrownBy(() -> client.generate("system", "user")).isInstanceOf(InternalException.class);
    }

    // ========== helpers ==========

    /** 성공 응답을 스텁한다. content[0].text에 주어진 text를 넣어 반환한다. */
    private void stubSuccess(String text) {
        Map<String, Object> body = Map.of("content", List.of(Map.of("type", "text", "text", text)));
        when(restTemplate.exchange(anyString(), any(), any(), any(ParameterizedTypeReference.class)))
                .thenReturn(ResponseEntity.ok(body));
    }

    /** exchange() 호출에 전달된 HttpEntity를 캡처해 반환한다. */
    @SuppressWarnings("unchecked")
    private HttpEntity<Map<String, Object>> captureEntity() {
        ArgumentCaptor<HttpEntity> captor = ArgumentCaptor.forClass(HttpEntity.class);
        verify(restTemplate)
                .exchange(eq(TEST_URL), eq(HttpMethod.POST), captor.capture(), any(ParameterizedTypeReference.class));
        return captor.getValue();
    }
}
