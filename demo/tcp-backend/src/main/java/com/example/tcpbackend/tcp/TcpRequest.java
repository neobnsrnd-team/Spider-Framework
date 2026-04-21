/**
 * @file TcpRequest.java
 * @description 클라이언트 → 서버 TCP 요청 메시지 구조체.
 *              4바이트 길이 헤더 뒤에 오는 JSON body를 역직렬화한 객체다.
 *
 * @example
 * // 카드 목록 조회 요청
 * {
 *   "cmd": "GET_CARDS",
 *   "sessionId": "a1b2c3d4",
 *   "adminSecret": null,
 *   "payload": {}
 * }
 */
package com.example.tcpbackend.tcp;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.JsonNode;

/**
 * TCP 요청 메시지.
 *
 * <p>모든 필드는 JSON 역직렬화 시 자동으로 채워진다.
 * 알 수 없는 필드는 무시한다({@link JsonIgnoreProperties}).
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class TcpRequest {

    /** 처리할 커맨드 타입 (예: "LOGIN", "GET_CARDS") */
    private String cmd;

    /**
     * 세션 ID — 로그인 이후 모든 요청에 포함해야 한다.
     * 서버는 이 값으로 인증 상태를 검증한다.
     */
    private String sessionId;

    /**
     * Admin 전용 커맨드(NOTICE_SYNC, NOTICE_END) 인증 비밀 키.
     * 일반 사용자 요청에는 null이어야 한다.
     */
    private String adminSecret;

    /**
     * 커맨드별 요청 데이터.
     * 각 Handler가 타입에 맞게 역직렬화해 사용한다.
     */
    private JsonNode payload;

    public String getCmd() { return cmd; }
    public void setCmd(String cmd) { this.cmd = cmd; }

    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }

    public String getAdminSecret() { return adminSecret; }
    public void setAdminSecret(String adminSecret) { this.adminSecret = adminSecret; }

    public JsonNode getPayload() { return payload; }
    public void setPayload(JsonNode payload) { this.payload = payload; }
}