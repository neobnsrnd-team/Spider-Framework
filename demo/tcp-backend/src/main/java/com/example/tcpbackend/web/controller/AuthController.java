/**
 * @file AuthController.java
 * @description 인증 REST 컨트롤러.
 *              프론트엔드 Axios 클라이언트와 HTTP로 통신하는 인증 엔드포인트를 제공한다.
 *
 * @description 엔드포인트:
 *   POST /api/auth/login    — 로그인 (세션 발급 + httpOnly 쿠키 설정)
 *   POST /api/auth/refresh  — Access Token 갱신 (httpOnly 쿠키 기반)
 *   POST /api/auth/logout   — 로그아웃 (세션 무효화 + 쿠키 삭제)
 *   GET  /api/auth/me       — 현재 사용자 프로필 조회
 */
package com.example.tcpbackend.web.controller;

import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.Map;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.tcpbackend.domain.auth.AuthService;
import com.example.tcpbackend.tcp.SpiderLinkClient;
import com.example.tcpbackend.tcp.session.SessionInfo;
import com.example.tcpbackend.tcp.session.TcpSessionManager;

/**
 * 인증 컨트롤러.
 *
 * <p>세션 ID를 Access Token으로 사용한다 (POC 방식 — 실제 JWT 미사용).
 * Refresh Token은 동일한 세션 ID를 httpOnly 쿠키에 저장해 갱신 요청 시 재사용한다.
 *
 * <pre>{@code
 * 로그인 응답:
 *   Body  : { success, userId, userName, userGrade, token, lastLogin }
 *   Cookie: hnc_refresh={sessionId}; HttpOnly; Path=/api/auth; Max-Age=604800
 * }</pre>
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    /** Refresh Token 쿠키 이름 */
    private static final String REFRESH_COOKIE = "hnc_refresh";

    private final AuthService authService;
    private final SpiderLinkClient spiderLinkClient;
    private final TcpSessionManager sessionManager;

    public AuthController(AuthService authService, SpiderLinkClient spiderLinkClient,
                          TcpSessionManager sessionManager) {
        this.authService      = authService;
        this.spiderLinkClient = spiderLinkClient;
        this.sessionManager   = sessionManager;
    }

    // ── 엔드포인트 ────────────────────────────────────────────────────────────

    /**
     * 로그인 처리.
     * 성공 시 sessionId를 Access Token으로 반환하고, httpOnly 쿠키에 Refresh Token을 설정한다.
     *
     * @param body     { userId, password }
     * @param response Refresh Token 쿠키 설정용
     */
    @SuppressWarnings("unchecked")
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest body, HttpServletResponse response) {
        Map<String, Object> slResponse = spiderLinkClient.send(
                "DEMO_AUTH_LOGIN", Map.of("userId", body.userId(), "password", body.password()));

        if (!Boolean.TRUE.equals(slResponse.get("success"))) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false,
                            "error", slResponse.getOrDefault("error", "로그인 실패")));
        }

        Map<String, Object> userData = (Map<String, Object>) slResponse.get("payload");
        String userId    = String.valueOf(userData.get("userId"));
        String userName  = String.valueOf(userData.get("userName"));
        String userGrade = String.valueOf(userData.getOrDefault("userGrade", ""));

        String sessionId = sessionManager.createSession(userId, userName, userGrade);
        response.addCookie(buildRefreshCookie(sessionId, 7 * 24 * 3600));

        Map<String, Object> data = new LinkedHashMap<>();
        data.put("success", true);
        data.put("userId",    userId);
        data.put("userName",  userName);
        data.put("userGrade", userGrade);
        data.put("token",     sessionId);
        data.put("lastLogin", AuthService.formatLoginDtime(
                String.valueOf(userData.getOrDefault("lastLoginDtime", ""))));

        return ResponseEntity.ok(data);
    }

    /**
     * Access Token 갱신.
     * httpOnly 쿠키의 Refresh Token(= sessionId)을 검증하고 새 Access Token을 반환한다.
     * POC에서는 세션이 유효하면 동일한 sessionId를 재발급한다.
     *
     * @param request Refresh Token 쿠키 추출용
     */
    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(HttpServletRequest request) {
        String refreshToken = extractRefreshCookie(request);
        if (refreshToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "리프레시 토큰이 없습니다."));
        }

        SessionInfo session = sessionManager.getSession(refreshToken);
        if (session == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "만료된 세션입니다. 다시 로그인해 주세요."));
        }

        // 프로필에서 최신 lastLogin을 가져와 함께 반환
        Map<String, Object> profile = authService.getProfile(session.getUserId());
        return ResponseEntity.ok(Map.of(
                "accessToken", refreshToken,
                "lastLogin", profile.getOrDefault("lastLogin", "")
        ));
    }

    /**
     * 로그아웃 처리.
     * 세션을 무효화하고 Refresh Token 쿠키를 삭제한다.
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        String sessionId = (String) request.getAttribute("sessionId");
        if (sessionId != null) {
            sessionManager.invalidate(sessionId);
        }
        // Max-Age=0 으로 쿠키 즉시 만료
        response.addCookie(buildRefreshCookie("", 0));
        return ResponseEntity.ok(Map.of("success", true));
    }

    /**
     * 현재 사용자 프로필 조회.
     * 대시보드 진입 시 lastLogin이 없는 경우를 보완하는 용도로 사용된다.
     */
    @SuppressWarnings("unchecked")
    @GetMapping("/me")
    public ResponseEntity<?> me(HttpServletRequest request) {
        SessionInfo session = (SessionInfo) request.getAttribute("session");

        Map<String, Object> slResponse = spiderLinkClient.send(
                "DEMO_AUTH_ME", Map.of("userId", session.getUserId()));

        if (!Boolean.TRUE.equals(slResponse.get("success"))) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", slResponse.getOrDefault("error", "프로필 조회 실패")));
        }

        return ResponseEntity.ok((Map<String, Object>) slResponse.get("payload"));
    }

    // ── 내부 유틸 ────────────────────────────────────────────────────────────

    /** httpOnly Refresh Token 쿠키를 생성한다. */
    private Cookie buildRefreshCookie(String value, int maxAge) {
        Cookie cookie = new Cookie(REFRESH_COOKIE, value);
        cookie.setHttpOnly(true);
        cookie.setPath("/api/auth");  // /api/auth/* 요청에만 자동 첨부
        cookie.setMaxAge(maxAge);
        return cookie;
    }

    /** 요청에서 Refresh Token 쿠키 값을 추출한다. */
    private String extractRefreshCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies == null) return null;
        return Arrays.stream(cookies)
                .filter(c -> REFRESH_COOKIE.equals(c.getName()))
                .map(Cookie::getValue)
                .findFirst()
                .orElse(null);
    }

    // ── 요청 DTO ─────────────────────────────────────────────────────────────

    /** POST /api/auth/login 요청 본문 */
    record LoginRequest(String userId, String password) {}
}
