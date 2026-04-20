package com.example.admin_demo.domain.cmsasset.config;

import java.time.Duration;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestClient;

/**
 * CMS Builder 호출용 RestClient 빈 구성 — Issue #65.
 *
 * <p>별도 RestClient 로 분리한 이유: 타임아웃과 baseUrl 이 다른 CMS 호출과 격리되어야 하고,
 * 업로드 호출의 독립적인 타임아웃을 관리한다.
 */
@Configuration
@RequiredArgsConstructor
@EnableConfigurationProperties(CmsBuilderProperties.class)
public class CmsBuilderConfig {

    private final CmsBuilderProperties properties;

    /** CMS Builder 전용 RestClient */
    @Bean
    public RestClient cmsBuilderRestClient() {
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(Duration.ofSeconds(properties.getConnectTimeoutSeconds()));
        requestFactory.setReadTimeout(Duration.ofSeconds(properties.getReadTimeoutSeconds()));

        return RestClient.builder()
                .baseUrl(properties.getBaseUrl())
                .requestFactory(requestFactory)
                .build();
    }
}
