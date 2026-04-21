/**
 * @file AuthHandler.java
 * @description 인증 관련 TCP 커맨드 처리 핸들러.
 *              LOGIN, LOGOUT, GET_PROFILE 커맨드를 담당한다.
 */
package com.example.tcpbackend.handler;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.example.tcpbackend.domain.auth.AuthService;
import com.example.tcpbackend.domain.auth.dto.UserRow;
import com.example.tcpbackend.tcp.TcpRequest;
import com.example.tcpbackend.tcp.TcpResponse;
import com.example.tcpbackend.tcp.session.SessionInfo;
import com.example.tcpbackend.tcp.session.TcpSessionManager;
import com.fasterxml.jackson.databind.JsonNode;

import io.netty.channel.Channel;

/**
 * 인증 핸들러.
 *
 * <p>각 메서드는 {@link com.example.tcpbackend.tcp.TcpMessageHandler}에서 커맨드 타입에 따라 호출된다.
 */
@Component
public class AuthHandler {

    private final AuthService authService;
    private final TcpSessionManager sessionManager;

    public AuthHandler(AuthService authService, TcpSessionManager sessionManager) {
        this.authService = authService;
        this.sessionManager = sessionManager;
    }

    /**
     * LOGIN 커맨드 처리.
     * payload: { "userId": "...", "password": "..." }
     *
     * @param request 요청 메시지
     * @param channel 요청을 보낸 Netty 채널 (세션 생성에 사용)
     * @return 로그인 결과 응답 (sessionId 포함)
     */
    public TcpResponse handleLogin(TcpRequest request, Channel channel) {
        JsonNode payload = request.getPayload();
        if (payload == null) {
            return TcpResponse.error("LOGIN", "요청 데이터가 없습니다.");
        }

        String userId   = payload.path("userId").asText(null);
        String password = payload.path("password").asText(null);

        if (userId == null || userId.isBlank() || password == null || password.isBlank()) {
            return TcpResponse.error("LOGIN", "아이디와 비밀번호를 입력하세요.");
        }

        try {
            UserRow user = authService.login(userId, password);

            // 세션 생성 — HTTP JWT 역할을 TCP 세션이 대체
            String sessionId = sessionManager.createSession(
                    user.userId(), user.userName(), user.userGrade(), channel);

            Map<String, Object> data = new LinkedHashMap<>();
            data.put("userId",    user.userId());
            data.put("userName",  user.userName());
            data.put("userGrade", user.userGrade());
            data.put("lastLogin", AuthService.formatLoginDtime(user.lastLoginDtime()));

            return TcpResponse.okWithSession("LOGIN", sessionId, data);

        } catch (IllegalArgumentException e) {
            return TcpResponse.error("LOGIN", e.getMessage());
        } catch (IllegalStateException e) {
            // 비활성 계정
            return TcpResponse.error("LOGIN", e.getMessage());
        }
    }

    /**
     * LOGOUT 커맨드 처리.
     * sessionId만 있으면 처리 가능 (payload 불필요).
     *
     * @param request 요청 메시지 (sessionId 필드 사용)
     * @return 로그아웃 결과 응답
     */
    public TcpResponse handleLogout(TcpRequest request) {
        sessionManager.invalidate(request.getSessionId());
        return TcpResponse.ok("LOGOUT");
    }

    /**
     * GET_PROFILE 커맨드 처리.
     * 세션에서 userId를 가져와 DB에서 최신 프로필을 조회한다.
     *
     * @param request 요청 메시지
     * @param session 검증된 세션 정보
     * @return 사용자 프로필 응답
     */
    public TcpResponse handleGetProfile(TcpRequest request, SessionInfo session) {
        try {
            Map<String, Object> data = authService.getProfile(session.getUserId());
            return TcpResponse.ok("GET_PROFILE", data);
        } catch (IllegalArgumentException e) {
            return TcpResponse.error("GET_PROFILE", e.getMessage());
        }
    }
}