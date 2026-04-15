package com.example.admin_demo.domain.reactgenerate.ai.client;

import com.example.admin_demo.global.exception.InternalException;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

/**
 * Claude API(/v1/messages)를 호출하여 React 코드를 생성하는 클라이언트.
 *
 * <p>기존 RestTemplate 빈은 read timeout이 10초로 짧아 Claude 응답에 부적합하므로,
 * ClaudeApiProperties에 정의된 별도 타임아웃으로 RestTemplate을 직접 구성한다.
 *
 * <p>API 오류 발생 시 {@link InternalException}으로 변환하여 상위에 전파한다.
 */
@Slf4j
@Component
@EnableConfigurationProperties(ClaudeApiProperties.class)
public class ClaudeApiClient {

    /** 응답에서 코드 블록을 추출하는 정규식. ```tsx ... ``` 또는 ```typescript ... ``` 형태 */
    private static final Pattern CODE_BLOCK_PATTERN =
            Pattern.compile("```(?:tsx|typescript|jsx|js)?\\s*\\n([\\s\\S]*?)\\n```");

    private final RestTemplate restTemplate;
    private final ClaudeApiProperties props;

    public ClaudeApiClient(RestTemplateBuilder builder, ClaudeApiProperties props) {
        this.props = props;
        // Claude API 전용 타임아웃 설정 (코드 생성은 수십 초 소요 가능)
        this.restTemplate = builder.connectTimeout(Duration.ofSeconds(props.getConnectTimeoutSeconds()))
                .readTimeout(Duration.ofSeconds(props.getReadTimeoutSeconds()))
                .build();
    }

    /**
     * system prompt와 user prompt를 Claude API에 전달하여 생성된 React 코드를 반환한다.
     *
     * <p>응답 텍스트에서 마크다운 코드 블록(```tsx ... ```)을 추출한다.
     * 코드 블록이 없으면 전체 응답 텍스트를 그대로 반환한다.
     *
     * @param systemPrompt 컴포넌트 라이브러리 컨텍스트가 포함된 system prompt
     * @param userPrompt   Figma URL과 요구사항이 포함된 user prompt
     * @return 생성된 React 코드 문자열
     * @throws InternalException Claude API 호출 실패 시
     */
    public String generate(String systemPrompt, String userPrompt) {
        HttpHeaders headers = buildHeaders();

        Map<String, Object> body = Map.of(
                "model", props.getModel(),
                "max_tokens", props.getMaxTokens(),
                "system", systemPrompt,
                "messages", List.of(Map.of("role", "user", "content", userPrompt)));

        log.info(
                "Claude API 호출 시작 — model: {}, system prompt: {}자, user prompt: {}자",
                props.getModel(),
                systemPrompt.length(),
                userPrompt.length());

        try {
            ResponseEntity<Map> response =
                    restTemplate.postForEntity(props.getUrl(), new HttpEntity<>(body, headers), Map.class);

            String rawText = extractText(response.getBody());
            log.info("Claude API 응답 수신 — {}자", rawText.length());

            return extractCodeBlock(rawText);

        } catch (RestClientException e) {
            log.error("Claude API 호출 실패", e);
            throw new InternalException("React 코드 생성 중 오류가 발생했습니다.");
        }
    }

    /** Claude API 인증 헤더 구성 */
    private HttpHeaders buildHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-api-key", props.getKey());
        headers.set("anthropic-version", "2023-06-01");
        return headers;
    }

    /**
     * Claude API 응답 body에서 텍스트를 추출한다.
     * 응답 구조: { "content": [ { "type": "text", "text": "..." } ] }
     */
    @SuppressWarnings("unchecked")
    private String extractText(Map<?, ?> body) {
        if (body == null) {
            throw new InternalException("Claude API 응답이 비어있습니다.");
        }
        try {
            List<Map<String, Object>> content = (List<Map<String, Object>>) body.get("content");
            // content 리스트가 null이거나 비어있으면 응답 구조 이상으로 판단
            if (content == null || content.isEmpty()) {
                log.error("Claude API 응답 content가 비어있습니다: {}", body);
                throw new InternalException("Claude API 응답을 파싱할 수 없습니다.");
            }
            return (String) content.get(0).get("text");
        } catch (InternalException e) {
            throw e;
        } catch (Exception e) {
            log.error("Claude API 응답 파싱 실패: {}", body);
            throw new InternalException("Claude API 응답을 파싱할 수 없습니다.");
        }
    }

    /**
     * 마크다운 코드 블록에서 코드만 추출한다.
     * 코드 블록이 없으면 원본 텍스트를 그대로 반환한다.
     */
    private String extractCodeBlock(String text) {
        Matcher matcher = CODE_BLOCK_PATTERN.matcher(text);
        if (matcher.find()) {
            return matcher.group(1).trim();
        }
        // 코드 블록이 없으면 전체 텍스트 사용 (Claude가 형식을 지키지 않은 경우 대비)
        return text.trim();
    }
}
