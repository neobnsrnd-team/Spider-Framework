package com.example.reactplatform.global.security;

import com.example.reactplatform.global.log.ContentCachingFilter;
import com.example.reactplatform.global.security.config.SecurityAccessProperties;
import com.example.reactplatform.global.security.handler.CustomAccessDeniedHandler;
import com.example.reactplatform.global.security.handler.CustomAuthenticationEntryPoint;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.context.SecurityContextHolderFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;
    private final CustomAuthenticationSuccessHandler successHandler;
    private final CustomAuthenticationFailureHandler failureHandler;
    private final SecurityAccessProperties securityAccessProperties;
    private final CustomAccessDeniedHandler accessDeniedHandler;
    private final CustomAuthenticationEntryPoint authenticationEntryPoint;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // ContentCachingFilter를 Security Filter 앞에 추가
                .addFilterBefore(new ContentCachingFilter(), SecurityContextHolderFilter.class)

                // CSRF 설정 — CookieCsrfTokenRepository로 클라이언트가 XSRF-TOKEN 쿠키를 읽어 X-XSRF-TOKEN 헤더로 전송
                .csrf(csrf -> csrf
                        .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                        .ignoringRequestMatchers("/h2-console/**"))

                // Headers 설정 (H2 Console iframe 허용)
                .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()))

                // 요청 권한 설정
                .authorizeHttpRequests(auth -> auth
                        // 정적 리소스 허용
                        .requestMatchers("/css/**", "/js/**", "/images/**", "/webjars/**", "/vendor/**", "/favicon.ico")
                        .permitAll()

                        // Swagger 허용
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html")
                        .permitAll()

                        // 회원가입 API 허용
                        .requestMatchers("/api/auth/register")
                        .permitAll()

                        // 로그인 페이지 허용
                        .requestMatchers("/login", "/error")
                        .permitAll()

                        // H2 Console 허용 (local 프로파일에서만 활성화됨)
                        .requestMatchers("/h2-console/**")
                        .permitAll()

                        // REST API 인증 필요
                        .requestMatchers("/api/**")
                        .authenticated()

                        // 페이지 접근은 인증 필요
                        .anyRequest()
                        .authenticated())

                // Exception Handling
                .exceptionHandling(ex ->
                        ex.accessDeniedHandler(accessDeniedHandler).authenticationEntryPoint(authenticationEntryPoint))

                // 로그인 설정
                .formLogin(form -> form.loginPage("/login") // 로그인 페이지 URL
                        .loginProcessingUrl("/login") // 로그인 처리 URL
                        .usernameParameter("userId") // 사용자 ID 파라미터
                        .passwordParameter("password") // 비밀번호 파라미터
                        .successHandler(successHandler) // 로그인 성공 핸들러
                        .failureHandler(failureHandler) // 로그인 실패 핸들러
                        .permitAll())

                // 로그아웃 설정
                .logout(logout -> logout.logoutUrl("/logout") // 로그아웃 URL
                        .logoutSuccessUrl("/login?logout=true") // 로그아웃 후 리다이렉트
                        .invalidateHttpSession(true) // 세션 무효화
                        .deleteCookies("JSESSIONID") // 쿠키 삭제
                        .permitAll())

                // 세션 관리
                .sessionManagement(
                        session -> session.sessionFixation()
                                .changeSessionId() // 로그인 시 세션 ID 변경 (세션 고정 공격 방지)
                                .maximumSessions(1) // 동시 세션 1개로 제한
                                .maxSessionsPreventsLogin(false) // 새 로그인 시 기존 세션 만료
                        )

                // Remember Me (선택사항)
                .rememberMe(remember -> remember.key(securityAccessProperties.getRememberMeKey())
                        .tokenValiditySeconds(86400) // 1일
                        .rememberMeParameter("remember-me"));

        return http.build();
    }
}
