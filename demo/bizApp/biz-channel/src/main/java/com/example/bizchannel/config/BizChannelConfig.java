package com.example.bizchannel.config;

import com.example.bizchannel.web.filter.JwtAuthFilter;
import com.example.spiderlink.domain.messageinstance.MessageInstanceRecorder;
import com.example.spiderlink.infra.tcp.client.TcpClient;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Optional;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

/**
 * 채널AP 공통 설정 클래스.
 *
 * <p>CORS 정책, JWT 필터 등록을 담당한다.</p>
 *
 * <pre>{@code
 *   // application.yml 설정 예시
 *   biz.auth.host: localhost
 *   biz.auth.port: 19100
 *   biz.transfer.host: localhost
 *   biz.transfer.port: 19200
 *   admin.secret: admin-secret
 * }</pre>
 */
@Getter
@Configuration
public class BizChannelConfig {

    /** 인증AP(biz-auth) 접속 호스트 */
    @Value("${biz.auth.host:localhost}")
    private String authHost;

    /** 인증AP(biz-auth) TCP 포트 */
    @Value("${biz.auth.port:19100}")
    private int authPort;

    /** 이체AP(biz-transfer) 접속 호스트 */
    @Value("${biz.transfer.host:localhost}")
    private String transferHost;

    /** 이체AP(biz-transfer) TCP 포트 */
    @Value("${biz.transfer.port:19200}")
    private int transferPort;

    /** 공지 관리 API 보호용 어드민 시크릿 키 */
    @Value("${admin.secret:admin-secret}")
    private String adminSecret;

    /**
     * spider-link TcpClient 빈 등록.
     *
     * <p>{@link TcpClient} 는 {@code com.example.spiderlink} 패키지에 선언되어 있어
     * 컴포넌트 스캔 범위에 포함되지 않으므로 명시적으로 등록한다.
     * {@link MessageInstanceRecorder} 가 존재하면 주입하여 전문 이력을 기록한다.</p>
     *
     * @param objectMapper Jackson ObjectMapper
     * @param recorder     전문 이력 기록기 (JdbcTemplate 빈이 없으면 empty)
     * @return TcpClient 인스턴스
     */
    @Bean
    public TcpClient tcpClient(ObjectMapper objectMapper,
                                Optional<MessageInstanceRecorder> recorder) {
        return new TcpClient(objectMapper, recorder.orElse(null));
    }

    /**
     * CORS 전역 설정 빈.
     *
     * <p>React 개발 서버(localhost:3000 등) 에서의 쿠키 포함 요청을 허용하기 위해
     * {@code allowedOriginPattern} 으로 {@code http://localhost:*} 를 허용하고,
     * {@code allowCredentials=true} 를 설정한다.</p>
     *
     * @return 전체 경로({@code /**})에 CORS 정책을 적용한 {@link CorsConfigurationSource}
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        // 자격증명(쿠키) 포함 요청을 허용하므로 와일드카드 오리진 대신 패턴을 사용
        config.addAllowedOriginPattern("http://localhost:*");
        config.setAllowCredentials(true);
        config.addAllowedMethod("*");
        config.addAllowedHeader("*");

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    /**
     * CORS 필터 빈.
     *
     * <p>Spring Security 없는 순수 Spring MVC 환경에서는 {@link CorsConfigurationSource}만으로는
     * CORS가 적용되지 않는다. {@link CorsFilter}로 래핑하여 서블릿 필터 체인에 등록한다.</p>
     *
     * @return CORS 정책을 적용한 서블릿 필터
     */
    @Bean
    public CorsFilter corsFilter() {
        return new CorsFilter(corsConfigurationSource());
    }

    /**
     * JWT 인증 필터 서블릿 등록 빈.
     *
     * <p>{@link JwtAuthFilter} 를 서블릿 필터 체인에 등록하고,
     * {@code /api/*} 경로에만 적용한다.</p>
     *
     * @param jwtAuthFilter 스프링이 주입한 JWT 인증 필터 인스턴스
     * @return 필터 등록 정보 빈
     */
    @Bean
    public FilterRegistrationBean<JwtAuthFilter> jwtFilterRegistration(JwtAuthFilter jwtAuthFilter) {
        FilterRegistrationBean<JwtAuthFilter> registration = new FilterRegistrationBean<>();
        registration.setFilter(jwtAuthFilter);
        registration.addUrlPatterns("/api/*");
        // 다른 필터보다 먼저 실행되도록 낮은 order 값 지정
        registration.setOrder(1);
        return registration;
    }
}
