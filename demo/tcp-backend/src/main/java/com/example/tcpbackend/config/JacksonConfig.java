/**
 * @file JacksonConfig.java
 * @description Jackson ObjectMapper 빈 등록.
 *              spring-boot-starter-web 없이 TCP 서버만 사용하므로
 *              JacksonAutoConfiguration이 활성화되지 않아 직접 등록한다.
 */
package com.example.tcpbackend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;

/**
 * Jackson 설정.
 */
@Configuration
public class JacksonConfig {

    /**
     * TCP 메시지 직렬화/역직렬화에 사용할 ObjectMapper 빈.
     *
     * <ul>
     *   <li>알 수 없는 필드 무시 — 클라이언트 버전 차이에 유연하게 대응</li>
     *   <li>날짜를 타임스탬프 숫자 대신 ISO-8601 문자열로 출력</li>
     * </ul>
     */
    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper()
                // 역직렬화 시 JSON에 없는 필드가 있어도 예외 없이 무시
                .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
                // 날짜를 숫자(epoch ms) 대신 ISO 문자열로 직렬화
                .configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
    }
}
