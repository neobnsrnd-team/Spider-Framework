/**
 * @file TcpResponse.java
 * @description 서버 → 클라이언트 TCP 응답 메시지 구조체.
 *              정적 팩토리 메서드로 성공/실패 응답을 간결하게 생성한다.
 *
 * @example
 * // 성공 응답
 * { "cmd": "LOGIN", "success": true, "sessionId": "a1b2c3d4", "data": { ... }, "error": null }
 *
 * // 실패 응답
 * { "cmd": "LOGIN", "success": false, "sessionId": null, "data": null, "error": "아이디 또는 비밀번호가 틀렸습니다." }
 */
package com.example.tcpbackend.tcp;

import com.fasterxml.jackson.annotation.JsonInclude;

/**
 * TCP 응답 메시지.
 *
 * <p>null 필드는 JSON 직렬화 시 생략한다({@link JsonInclude.Include#NON_NULL}).
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TcpResponse {

    /** 요청한 커맨드 타입 (에코) */
    private String cmd;

    /** 처리 성공 여부 */
    private boolean success;

    /**
     * 로그인 성공 시 발급된 세션 ID.
     * 이후 모든 요청의 sessionId 필드에 사용해야 한다.
     */
    private String sessionId;

    /** 성공 시 반환 데이터 */
    private Object data;

    /** 실패 시 오류 메시지 */
    private String error;

    /**
     * 성공 응답 생성 — 데이터 없이 성공만 알릴 때 사용.
     *
     * @param cmd 요청 커맨드
     * @return 성공 응답
     */
    public static TcpResponse ok(String cmd) {
        return ok(cmd, null);
    }

    /**
     * 성공 응답 생성 — 데이터를 포함한 성공 응답.
     *
     * @param cmd  요청 커맨드
     * @param data 응답 데이터 (null 허용)
     * @return 성공 응답
     */
    public static TcpResponse ok(String cmd, Object data) {
        TcpResponse r = new TcpResponse();
        r.cmd = cmd;
        r.success = true;
        r.data = data;
        return r;
    }

    /**
     * 로그인 성공 응답 생성 — sessionId를 포함한다.
     *
     * @param cmd       요청 커맨드
     * @param sessionId 발급된 세션 ID
     * @param data      사용자 정보 등 응답 데이터
     * @return 세션 ID 포함 성공 응답
     */
    public static TcpResponse okWithSession(String cmd, String sessionId, Object data) {
        TcpResponse r = ok(cmd, data);
        r.sessionId = sessionId;
        return r;
    }

    /**
     * 실패 응답 생성.
     *
     * @param cmd   요청 커맨드
     * @param error 사용자에게 전달할 오류 메시지
     * @return 실패 응답
     */
    public static TcpResponse error(String cmd, String error) {
        TcpResponse r = new TcpResponse();
        r.cmd = cmd;
        r.success = false;
        r.error = error;
        return r;
    }

    public String getCmd() { return cmd; }
    public boolean isSuccess() { return success; }
    public String getSessionId() { return sessionId; }
    public Object getData() { return data; }
    public String getError() { return error; }
}