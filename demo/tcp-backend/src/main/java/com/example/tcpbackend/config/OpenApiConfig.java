/**
 * @file OpenApiConfig.java
 * @description Swagger / OpenAPI 3.0 문서 설정.
 *              SpringDoc OpenAPI가 자동 생성하는 API 문서의 메타데이터와
 *              Bearer 토큰 보안 스키마를 정의한다.
 *
 * @description 접속 URL:
 *   - Swagger UI : http://localhost:9998/swagger-ui.html
 *   - OpenAPI 스펙: http://localhost:9998/v3/api-docs
 */
package com.example.tcpbackend.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAPI 전역 설정.
 *
 * <p>인증이 필요한 엔드포인트는 컨트롤러에서 {@code @SecurityRequirement(name = "bearerAuth")}를 사용한다.
 * 로그인 후 발급된 sessionId를 Swagger UI 우측 상단 "Authorize" 버튼에 입력하면
 * 이후 요청에 {@code Authorization: Bearer {sessionId}} 헤더가 자동으로 포함된다.
 */
@Configuration
@OpenAPIDefinition(
        info = @Info(
                title = "HNC POC TCP Backend API",
                version = "1.0",
                description = "HNC POC 데모 백엔드 REST API — 인증, 카드, 이용내역, 긴급공지 기능을 제공한다."
        ),
        servers = @Server(url = "http://localhost:9998", description = "로컬 개발 서버")
)
@SecurityScheme(
        name = "bearerAuth",
        type = SecuritySchemeType.HTTP,
        scheme = "bearer",
        in = SecuritySchemeIn.HEADER,
        description = "POST /api/auth/login 으로 로그인하면 반환되는 token(sessionId)을 입력한다."
)
public class OpenApiConfig {
}
