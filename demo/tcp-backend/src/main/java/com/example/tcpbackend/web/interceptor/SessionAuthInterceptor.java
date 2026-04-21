/**
 * @file SessionAuthInterceptor.java
 * @description HTTP 요청 세션 인증 인터셉터.
 *              Authorization: Bearer {sessionId} 헤더를 검증하고
 *              유효한 경우 SessionInfo를 request attribute에 저장한다.
 *
 * @description 적용 대상: /api/** (WebConfig에서 login·refresh·sse 경로는 제외)
 * @description request attribute:
 *   - "session"   : SessionInfo (컨트롤러에서 사용자 정보 접근용)
 *   - "sessionId" : String (로그아웃 시 세션 무효화용)
 */
package com.example.tcpbackend.web.interceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import com.example.tcpbackend.tcp.session.SessionInfo;
import com.example.tcpbackend.tcp.session.TcpSessionManager;

/**
 * 세션 인증 인터셉터.
 *
 * <p>Authorization 헤더가 없거나 세션이 유효하지 않으면 401을 반환하고 요청을 차단한다.
 */
@Component
public class SessionAuthInterceptor implements HandlerInterceptor {

    private final TcpSessionManager sessionManager;

    public SessionAuthInterceptor(TcpSessionManager sessionManager) {
        this.sessionManager = sessionManager;
    }

    @Override
    public boolean preHandle(HttpServletRequest request,
                             HttpServletResponse response,
                             Object handler) throws Exception {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            writeUnauthorized(response, "인증이 필요합니다.");
            return false;
        }

        String sessionId = authHeader.substring(7).trim();
        SessionInfo session = sessionManager.getSession(sessionId);

        if (session == null) {
            writeUnauthorized(response, "유효하지 않은 세션입니다. 다시 로그인해 주세요.");
            return false;
        }

        // 컨트롤러에서 사용자 정보와 세션 ID를 꺼낼 수 있도록 attribute에 저장
        request.setAttribute("session", session);
        request.setAttribute("sessionId", sessionId);
        return true;
    }

    /** 401 응답 본문에 JSON 오류 메시지를 작성한다. */
    private void writeUnauthorized(HttpServletResponse response, String message) throws Exception {
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write("{\"error\":\"" + message + "\"}");
    }
}
