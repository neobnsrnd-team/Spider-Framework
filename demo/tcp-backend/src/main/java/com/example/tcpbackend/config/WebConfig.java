/**
 * @file WebConfig.java
 * @description Spring MVC 웹 설정 — CORS 및 세션 인증 인터셉터를 등록한다.
 *
 * <p>CORS: 프론트엔드(http://localhost:5173)에서 직접 호출하는 Axios 요청을 허용한다.
 * <p>인터셉터: /api/auth/login, /api/auth/refresh, /api/notices/sse 를 제외한
 *             모든 /api/** 경로에 세션 인증 인터셉터를 적용한다.
 */
package com.example.tcpbackend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import com.example.tcpbackend.web.interceptor.SessionAuthInterceptor;

/**
 * Spring MVC 웹 설정.
 *
 * <pre>{@code
 * 프론트엔드 → (직접 HTTP) → localhost:9998/api/**  — CORS 필요
 * 프론트엔드 → (Vite 프록시) → localhost:9998/api/notices/sse  — 프록시 경유로 CORS 불필요
 * }</pre>
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    private final SessionAuthInterceptor sessionAuthInterceptor;

    public WebConfig(SessionAuthInterceptor sessionAuthInterceptor) {
        this.sessionAuthInterceptor = sessionAuthInterceptor;
    }

    /**
     * 프론트엔드(5173)에서 직접 호출하는 Axios 요청에 대해 CORS를 허용한다.
     * withCredentials: true 사용 시 allowedOrigins를 와일드카드로 설정할 수 없다.
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173", "http://localhost:5174")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                // Axios withCredentials: true → 쿠키(Refresh Token) 자동 전송 허용
                .allowCredentials(true)
                .maxAge(3600);
    }

    /**
     * 세션 인증 인터셉터 등록.
     * 로그인·토큰 갱신·SSE 구독 경로는 인증 없이 접근 가능하도록 제외한다.
     */
    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(sessionAuthInterceptor)
                .addPathPatterns("/api/**")
                .excludePathPatterns(
                        "/api/auth/login",
                        "/api/auth/refresh",
                        "/api/notices/sse"
                );
    }
}
