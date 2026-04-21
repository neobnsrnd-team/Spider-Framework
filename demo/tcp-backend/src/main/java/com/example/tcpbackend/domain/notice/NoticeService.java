/**
 * @file NoticeService.java
 * @description 긴급공지 비즈니스 로직 서비스.
 *              Node.js SSE 브로드캐스트를 TCP 채널 그룹 브로드캐스트로 전환한다.
 *              인메모리 공지 상태는 서버 재기동 시 DB(FWK_PROPERTY)에서 복구한다.
 */
package com.example.tcpbackend.domain.notice;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CopyOnWriteArrayList;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.example.tcpbackend.domain.notice.dto.NoticeState;
import com.example.tcpbackend.tcp.TcpResponse;
import com.example.tcpbackend.tcp.session.TcpSessionManager;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.netty.channel.group.ChannelGroup;
import io.netty.channel.group.ChannelGroupFuture;

/**
 * 긴급공지 서비스.
 *
 * <p>공지 상태는 인메모리({@code currentNotice})에 보관하며,
 * 변경 시 구독 채널 그룹({@link TcpSessionManager#getNoticeSubscribers()})에 브로드캐스트한다.
 */
@Service
public class NoticeService {

    private static final Logger log = LoggerFactory.getLogger(NoticeService.class);

    private final JdbcTemplate jdbc;
    private final TcpSessionManager sessionManager;
    private final ObjectMapper objectMapper;

    /**
     * 현재 배포 중인 긴급공지 인메모리 상태.
     * null이면 배포 중인 공지 없음.
     */
    private volatile NoticeState currentNotice = null;

    /**
     * HTTP SSE 구독자 목록.
     * CopyOnWriteArrayList: 브로드캐스트 중 동시 구독/해지가 발생해도 안전하다.
     */
    private final List<SseEmitter> sseEmitters = new CopyOnWriteArrayList<>();

    public NoticeService(JdbcTemplate jdbc, TcpSessionManager sessionManager, ObjectMapper objectMapper) {
        this.jdbc = jdbc;
        this.sessionManager = sessionManager;
        this.objectMapper = objectMapper;
    }

    /**
     * 서버 재기동 시 FWK_PROPERTY에서 공지 상태를 복구한다.
     * 복구 실패 시 경고 로그만 출력하고 공지 없이 기동한다.
     */
    public void restoreFromDb() {
        try {
            List<Map<String, Object>> statusRows = jdbc.queryForList(
                    """
                    SELECT DEFAULT_VALUE AS DISPLAY_TYPE,
                           (SELECT DEFAULT_VALUE FROM FWK_PROPERTY
                             WHERE PROPERTY_GROUP_ID = 'notice'
                               AND PROPERTY_ID = 'DEPLOY_STATUS') AS DEPLOY_STATUS
                      FROM FWK_PROPERTY
                     WHERE PROPERTY_GROUP_ID = 'notice'
                       AND PROPERTY_ID = 'USE_YN'
                    """
            );

            if (statusRows.isEmpty() || !"DEPLOYED".equals(statusRows.get(0).get("DEPLOY_STATUS"))) {
                log.info("[Notice] 배포 중인 긴급공지 없음 — 초기 상태로 기동");
                return;
            }

            String displayType = String.valueOf(statusRows.get(0).get("DISPLAY_TYPE"));
            List<Map<String, Object>> noticeRows = jdbc.queryForList(
                    """
                    SELECT PROPERTY_ID AS LANG, PROPERTY_DESC AS TITLE, DEFAULT_VALUE AS CONTENT
                      FROM FWK_PROPERTY
                     WHERE PROPERTY_GROUP_ID = 'notice'
                       AND PROPERTY_ID IN ('EMERGENCY_KO', 'EMERGENCY_EN')
                     ORDER BY PROPERTY_ID
                    """
            );

            List<Map<String, Object>> settingRows = jdbc.queryForList(
                    """
                    SELECT PROPERTY_ID, DEFAULT_VALUE
                      FROM FWK_PROPERTY
                     WHERE PROPERTY_GROUP_ID = 'notice'
                       AND PROPERTY_ID IN ('CLOSEABLE_YN', 'HIDE_TODAY_YN')
                    """
            );

            Map<String, String> settings = new java.util.HashMap<>();
            settingRows.forEach(r -> settings.put(
                    String.valueOf(r.get("PROPERTY_ID")),
                    String.valueOf(r.get("DEFAULT_VALUE"))));

            List<Map<String, Object>> notices = new ArrayList<>();
            noticeRows.forEach(r -> {
                notices.add(Map.of(
                        "lang",    String.valueOf(r.get("LANG")),
                        "title",   String.valueOf(r.getOrDefault("TITLE", "")),
                        "content", String.valueOf(r.getOrDefault("CONTENT", ""))
                ));
            });

            currentNotice = new NoticeState(
                    notices, displayType,
                    settings.getOrDefault("CLOSEABLE_YN", "Y"),
                    settings.getOrDefault("HIDE_TODAY_YN", "Y")
            );

            log.info("[Notice] 긴급공지 상태 복구 완료: displayType={}", displayType);

        } catch (Exception e) {
            log.warn("[Notice] 긴급공지 상태 복구 실패 (비치명적): {}", e.getMessage());
        }
    }

    /**
     * 공지 배포 동기화 처리 — Admin NOTICE_SYNC 커맨드 수신 시 호출.
     * 인메모리 상태를 갱신하고 구독 채널 전체에 브로드캐스트한다.
     *
     * @param notices     언어별 공지 목록
     * @param displayType 노출 타입
     * @param closeableYn 닫기 버튼 여부
     * @param hideTodayYn 오늘 하루 보지 않기 여부
     */
    public void sync(List<Map<String, Object>> notices, String displayType,
                     String closeableYn, String hideTodayYn) {
        currentNotice = new NoticeState(notices, displayType, closeableYn, hideTodayYn);
        broadcast(currentNotice);
        log.info("[Notice] 긴급공지 TCP 동기화: displayType={}, 구독자={}명",
                displayType, sessionManager.getSubscriberCount());
    }

    /**
     * 공지 배포 종료 처리 — Admin NOTICE_END 커맨드 수신 시 호출.
     * 인메모리 상태를 null로 초기화하고 브로드캐스트한다.
     */
    public void end() {
        currentNotice = null;
        broadcast(null);
        log.info("[Notice] 긴급공지 TCP 배포 종료: 구독자={}명", sessionManager.getSubscriberCount());
    }

    /**
     * 신규 구독자에게 현재 공지 상태를 즉시 전송한다.
     * NOTICE_SUBSCRIBE 커맨드 처리 시 호출한다.
     *
     * @return 현재 공지 상태 (null이면 공지 없음)
     */
    public NoticeState getCurrentNotice() {
        return currentNotice;
    }

    /**
     * HTTP SSE 구독 등록 — GET /api/notices/sse 요청 시 호출한다.
     * 현재 공지 상태를 즉시 전송하고, 이후 변경 시 이벤트를 푸시한다.
     *
     * @return SseEmitter (Spring이 응답 스트림으로 유지)
     */
    public SseEmitter subscribe() {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);

        // 연결 종료(완료·타임아웃·오류) 시 목록에서 제거
        emitter.onCompletion(() -> sseEmitters.remove(emitter));
        emitter.onTimeout(() -> sseEmitters.remove(emitter));
        emitter.onError(e -> sseEmitters.remove(emitter));

        sseEmitters.add(emitter);

        // 재접속 시 최신 상태를 즉시 수신할 수 있도록 현재 공지를 바로 전송
        try {
            sendToSseEmitter(emitter, currentNotice);
        } catch (IOException e) {
            sseEmitters.remove(emitter);
            emitter.completeWithError(e);
        }

        log.info("[Notice] SSE 구독 등록 (총 SSE 구독자={})", sseEmitters.size());
        return emitter;
    }

    /**
     * DB 미리보기용 공지 조회 — DEPLOY_STATUS 무관하게 최신 저장값 반환.
     *
     * @return { notices, displayType }
     */
    public Map<String, Object> preview() {
        List<Map<String, Object>> statusRows = jdbc.queryForList(
                """
                SELECT DEFAULT_VALUE AS DISPLAY_TYPE
                  FROM FWK_PROPERTY
                 WHERE PROPERTY_GROUP_ID = 'notice' AND PROPERTY_ID = 'USE_YN'
                """
        );
        String displayType = statusRows.isEmpty() ? "N"
                : String.valueOf(statusRows.get(0).get("DISPLAY_TYPE"));

        List<Map<String, Object>> noticeRows = jdbc.queryForList(
                """
                SELECT PROPERTY_ID AS LANG, PROPERTY_DESC AS TITLE, DEFAULT_VALUE AS CONTENT
                  FROM FWK_PROPERTY
                 WHERE PROPERTY_GROUP_ID = 'notice'
                   AND PROPERTY_ID IN ('EMERGENCY_KO', 'EMERGENCY_EN')
                 ORDER BY PROPERTY_ID
                """
        );

        List<Map<String, Object>> notices = new ArrayList<>();
        noticeRows.forEach(r -> notices.add(Map.of(
                "lang",    String.valueOf(r.get("LANG")),
                "title",   String.valueOf(r.getOrDefault("TITLE", "")),
                "content", String.valueOf(r.getOrDefault("CONTENT", ""))
        )));

        return Map.of("notices", notices, "displayType", displayType);
    }

    // ── 내부 유틸 ───────────────────────────────────────────────────────────

    /**
     * 모든 구독자(TCP 채널 + HTTP SSE)에 현재 공지 상태를 전송한다.
     *
     * @param state 전송할 공지 상태 (null이면 "공지 없음" 전달)
     */
    private void broadcast(NoticeState state) {
        broadcastToTcp(state);
        broadcastToSse(state);
    }

    /** TCP 채널 구독자에게 브로드캐스트 */
    private void broadcastToTcp(NoticeState state) {
        ChannelGroup subscribers = sessionManager.getNoticeSubscribers();
        if (subscribers.isEmpty()) return;

        TcpResponse response = TcpResponse.ok("NOTICE_BROADCAST", state);
        ChannelGroupFuture future = subscribers.writeAndFlush(response);
        future.addListener(f -> {
            if (!f.isSuccess()) {
                log.warn("[Notice] TCP 브로드캐스트 실패 일부 발생: {}", f.cause().getMessage());
            }
        });
    }

    /** HTTP SSE 구독자에게 브로드캐스트 */
    private void broadcastToSse(NoticeState state) {
        if (sseEmitters.isEmpty()) return;

        for (SseEmitter emitter : sseEmitters) {
            try {
                sendToSseEmitter(emitter, state);
            } catch (IOException e) {
                // 전송 실패한 emitter는 연결이 끊긴 것이므로 제거
                sseEmitters.remove(emitter);
                log.debug("[Notice] SSE 구독자 전송 실패 — 제거 처리");
            }
        }
        log.info("[Notice] SSE 브로드캐스트 완료 (SSE 구독자={}명)", sseEmitters.size());
    }

    /**
     * 단일 SseEmitter에 공지 이벤트를 전송한다.
     * 프론트엔드는 "notice" 이벤트를 수신해 공지 상태를 갱신한다.
     *
     * @param emitter 전송 대상 emitter
     * @param state   전송할 공지 상태 (null → JSON "null" 전송)
     */
    private void sendToSseEmitter(SseEmitter emitter, NoticeState state) throws IOException {
        String json = objectMapper.writeValueAsString(state);
        emitter.send(SseEmitter.event().name("notice").data(json));
    }
}