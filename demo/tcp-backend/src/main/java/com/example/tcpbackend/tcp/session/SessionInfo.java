/**
 * @file SessionInfo.java
 * @description TCP 세션에 저장되는 인증 사용자 정보.
 *              HTTP의 JWT 페이로드와 동일한 역할을 한다.
 */
package com.example.tcpbackend.tcp.session;

import java.time.Instant;

/**
 * 인증된 사용자의 TCP 세션 정보.
 *
 * <p>로그인 성공 시 생성되어 {@link TcpSessionManager}에 저장된다.
 * 이후 요청은 sessionId로 이 객체를 조회해 인증 상태를 확인한다.
 */
public class SessionInfo {

    /** 사용자 ID */
    private final String userId;

    /** 사용자 이름 */
    private final String userName;

    /** 사용자 등급 */
    private final String userGrade;

    /** 세션 생성 시각 (만료 계산에 사용 가능) */
    private final Instant createdAt;

    /** 마지막 활동 시각 (연결 유지 중 주기적으로 갱신) */
    private volatile Instant lastActiveAt;

    public SessionInfo(String userId, String userName, String userGrade) {
        this.userId = userId;
        this.userName = userName;
        this.userGrade = userGrade;
        this.createdAt = Instant.now();
        this.lastActiveAt = this.createdAt;
    }

    /** 활동 감지 시 호출 — lastActiveAt을 현재 시각으로 갱신 */
    public void touch() {
        this.lastActiveAt = Instant.now();
    }

    public String getUserId() { return userId; }
    public String getUserName() { return userName; }
    public String getUserGrade() { return userGrade; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getLastActiveAt() { return lastActiveAt; }
}
