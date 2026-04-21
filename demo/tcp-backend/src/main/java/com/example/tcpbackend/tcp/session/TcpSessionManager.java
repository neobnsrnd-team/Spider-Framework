/**
 * @file TcpSessionManager.java
 * @description TCP 세션 저장소 및 공지 구독자 채널 관리.
 *              HTTP의 JWT + 인메모리 Refresh Token Store 역할을 통합한다.
 *              공지 브로드캐스트 대상 채널(ChannelGroup)도 함께 관리한다.
 */
package com.example.tcpbackend.tcp.session;

import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import io.netty.channel.Channel;
import io.netty.channel.group.ChannelGroup;
import io.netty.channel.group.DefaultChannelGroup;
import io.netty.util.concurrent.GlobalEventExecutor;

/**
 * TCP 세션 및 공지 구독 채널 관리자.
 *
 * <p>스레드 안전성: ConcurrentHashMap과 Netty의 ChannelGroup을 사용해
 * 다중 I/O 스레드에서 동시 접근해도 안전하다.
 */
@Component
public class TcpSessionManager {

    private static final Logger log = LoggerFactory.getLogger(TcpSessionManager.class);

    /**
     * sessionId → SessionInfo 매핑.
     * 로그인 성공 시 생성, 로그아웃 또는 채널 종료 시 제거된다.
     */
    private final ConcurrentHashMap<String, SessionInfo> sessions = new ConcurrentHashMap<>();

    /**
     * sessionId → Netty Channel 역매핑 (채널 종료 시 세션 자동 정리에 사용).
     */
    private final ConcurrentHashMap<String, Channel> sessionChannels = new ConcurrentHashMap<>();

    /**
     * userId → sessionId 역매핑 (중복 로그인 제어에 사용).
     * 동일 userId로 재로그인하면 기존 세션을 무효화한다.
     */
    private final ConcurrentHashMap<String, String> userSessions = new ConcurrentHashMap<>();

    /**
     * 공지 브로드캐스트 대상 채널 그룹.
     * NOTICE_SUBSCRIBE 커맨드를 받은 채널이 여기에 등록된다.
     * 채널이 끊기면 Netty가 자동으로 그룹에서 제거한다.
     */
    private final ChannelGroup noticeSubscribers =
            new DefaultChannelGroup(GlobalEventExecutor.INSTANCE);

    // ── 세션 생성 / 조회 / 삭제 ──────────────────────────────────────────────

    /**
     * HTTP 요청용 세션 생성 — Netty 채널 없이 세션만 등록한다.
     * 채널 종료 이벤트가 없으므로 세션은 로그아웃 호출 또는 서버 재기동 시 제거된다.
     *
     * @param userId    인증된 사용자 ID
     * @param userName  사용자 이름
     * @param userGrade 사용자 등급
     * @return 새로 발급된 세션 ID (UUID)
     */
    public String createSession(String userId, String userName, String userGrade) {
        return createSession(userId, userName, userGrade, null);
    }

    /**
     * 로그인 성공 시 새 세션을 생성한다.
     * 동일 userId로 기존 세션이 있으면 먼저 무효화한다(중복 로그인 방지).
     *
     * @param userId    인증된 사용자 ID
     * @param userName  사용자 이름
     * @param userGrade 사용자 등급
     * @param channel   로그인 요청을 보낸 Netty 채널 (HTTP 요청 시 null 허용)
     * @return 새로 발급된 세션 ID (UUID)
     */
    public String createSession(String userId, String userName, String userGrade, Channel channel) {
        // 기존 세션이 있으면 제거 (중복 로그인 → 기존 세션 무효화)
        String existingSessionId = userSessions.get(userId);
        if (existingSessionId != null) {
            invalidate(existingSessionId);
            log.debug("[Session] 기존 세션 무효화 (userId={})", userId);
        }

        String sessionId = UUID.randomUUID().toString().replace("-", "");
        SessionInfo info = new SessionInfo(userId, userName, userGrade);

        sessions.put(sessionId, info);
        // channel이 null이면 HTTP 세션 — 채널 종료 이벤트가 없으므로 채널 매핑 생략
        if (channel != null) {
            sessionChannels.put(sessionId, channel);
        }
        userSessions.put(userId, sessionId);

        log.info("[Session] 세션 생성 (userId={}, sessionId={})", userId, sessionId);
        return sessionId;
    }

    /**
     * sessionId로 세션 정보를 조회한다.
     * 세션이 존재하면 lastActiveAt을 갱신한다(Touch 방식).
     *
     * @param sessionId 조회할 세션 ID
     * @return 세션 정보, 없으면 null
     */
    public SessionInfo getSession(String sessionId) {
        if (sessionId == null) return null;
        SessionInfo info = sessions.get(sessionId);
        if (info != null) {
            info.touch(); // 마지막 활동 시각 갱신
        }
        return info;
    }

    /**
     * 세션을 무효화(로그아웃)한다.
     *
     * @param sessionId 무효화할 세션 ID
     */
    public void invalidate(String sessionId) {
        if (sessionId == null) return;
        SessionInfo info = sessions.remove(sessionId);
        sessionChannels.remove(sessionId);
        if (info != null) {
            userSessions.remove(info.getUserId());
            log.info("[Session] 세션 만료 (userId={}, sessionId={})", info.getUserId(), sessionId);
        }
    }

    /**
     * 채널이 끊길 때 호출 — 해당 채널의 세션을 정리한다.
     *
     * @param channel 끊긴 Netty 채널
     */
    public void onChannelInactive(Channel channel) {
        // 채널 ID로 sessionId를 역탐색해 제거
        sessionChannels.entrySet().removeIf(entry -> {
            if (entry.getValue().equals(channel)) {
                invalidate(entry.getKey());
                return true;
            }
            return false;
        });
    }

    // ── 공지 구독 채널 관리 ────────────────────────────────────────────────────

    /**
     * 공지 구독 채널로 등록한다.
     *
     * @param channel 등록할 채널 (NOTICE_SUBSCRIBE 요청을 보낸 채널)
     */
    public void addNoticeSubscriber(Channel channel) {
        noticeSubscribers.add(channel);
        log.debug("[Notice] 구독 채널 등록 (channel={}, 총 구독자={})",
                channel.id(), noticeSubscribers.size());
    }

    /**
     * @return 현재 공지 구독 채널 그룹 (브로드캐스트에 직접 사용 가능)
     */
    public ChannelGroup getNoticeSubscribers() {
        return noticeSubscribers;
    }

    /** @return 현재 활성 세션 수 */
    public int getSessionCount() {
        return sessions.size();
    }

    /** @return 현재 공지 구독자 수 */
    public int getSubscriberCount() {
        return noticeSubscribers.size();
    }
}
