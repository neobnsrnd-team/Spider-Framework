package com.example.spiderlink.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

/**
 * 내부 API 보안 인터셉터 — {@code /api/internal/**} 경로를 localhost 전용으로 제한한다.
 *
 * <p>외부 IP에서 접근 시 403을 반환한다. spider-link의 Reload API는
 * 어드민 서버(동일 머신 또는 내부망)에서만 호출하므로 이 제약으로 충분하다.</p>
 */
@Slf4j
@Component
public class InternalApiInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response,
                             Object handler) throws Exception {
        String remoteAddr = request.getRemoteAddr();

        // loopback(IPv4/IPv6) 또는 동일 호스트만 허용
        if (!isLocalhost(remoteAddr)) {
            log.warn("[InternalApiInterceptor] 외부 접근 차단: {} → {}", remoteAddr, request.getRequestURI());
            response.sendError(HttpServletResponse.SC_FORBIDDEN, "Internal API only");
            return false;
        }

        return true;
    }

    private boolean isLocalhost(String remoteAddr) {
        return "127.0.0.1".equals(remoteAddr)
                || "0:0:0:0:0:0:0:1".equals(remoteAddr)  // IPv6 loopback
                || "::1".equals(remoteAddr);
    }
}
