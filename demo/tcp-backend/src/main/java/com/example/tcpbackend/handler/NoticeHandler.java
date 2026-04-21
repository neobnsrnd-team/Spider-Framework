/**
 * @file NoticeHandler.java
 * @description 긴급공지 TCP 커맨드 처리 핸들러.
 *              NOTICE_SUBSCRIBE (Frontend), NOTICE_SYNC / NOTICE_END / NOTICE_PREVIEW (Admin) 커맨드를 담당한다.
 */
package com.example.tcpbackend.handler;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.example.tcpbackend.config.AppProperties;
import com.example.tcpbackend.domain.notice.NoticeService;
import com.example.tcpbackend.domain.notice.dto.NoticeState;
import com.example.tcpbackend.tcp.TcpRequest;
import com.example.tcpbackend.tcp.TcpResponse;
import com.example.tcpbackend.tcp.session.TcpSessionManager;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import io.netty.channel.Channel;

/**
 * 긴급공지 핸들러.
 *
 * <p>NOTICE_SUBSCRIBE는 일반 사용자(세션 필요), 나머지는 Admin 전용(adminSecret 필요)이다.
 */
@Component
public class NoticeHandler {

    private static final Logger log = LoggerFactory.getLogger(NoticeHandler.class);

    private final NoticeService noticeService;
    private final TcpSessionManager sessionManager;
    private final AppProperties appProperties;
    private final ObjectMapper objectMapper;

    public NoticeHandler(NoticeService noticeService,
                         TcpSessionManager sessionManager,
                         AppProperties appProperties,
                         ObjectMapper objectMapper) {
        this.noticeService = noticeService;
        this.sessionManager = sessionManager;
        this.appProperties = appProperties;
        this.objectMapper = objectMapper;
    }

    /**
     * NOTICE_SUBSCRIBE 커맨드 처리 — Frontend 연결 시 공지 구독 등록.
     * Node.js의 GET /api/notices/sse와 동일한 역할.
     *
     * <p>구독 등록 후 현재 공지 상태를 즉시 전송한다 (재접속 시 최신 상태 즉시 반영).
     *
     * @param channel 구독을 요청한 채널
     * @return 현재 공지 상태 응답
     */
    public TcpResponse handleSubscribe(Channel channel) {
        sessionManager.addNoticeSubscriber(channel);
        NoticeState current = noticeService.getCurrentNotice();
        log.info("[Notice] 공지 구독 등록 (channel={}, 총 구독자={})",
                channel.id(), sessionManager.getSubscriberCount());
        // 현재 상태를 즉시 응답으로 반환 (null이면 "공지 없음" 상태)
        return TcpResponse.ok("NOTICE_SUBSCRIBE", current);
    }

    /**
     * NOTICE_SYNC 커맨드 처리 — Admin 긴급공지 배포 동기화.
     * Node.js의 POST /api/notices/sync에 해당.
     *
     * payload:
     * <pre>
     * {
     *   "notices":     [{ "lang": "EMERGENCY_KO", "title": "...", "content": "..." }],
     *   "displayType": "A",
     *   "closeableYn": "Y",
     *   "hideTodayYn": "Y"
     * }
     * </pre>
     *
     * @param request 요청 메시지 (adminSecret 검증 필요)
     * @return 동기화 완료 응답 또는 인증 오류
     */
    public TcpResponse handleSync(TcpRequest request) {
        if (!verifyAdmin(request)) {
            return TcpResponse.error("NOTICE_SYNC", "관리자 인증이 필요합니다.");
        }

        JsonNode payload = request.getPayload();
        if (payload == null) {
            return TcpResponse.error("NOTICE_SYNC", "요청 데이터가 없습니다.");
        }

        JsonNode noticesNode = payload.path("notices");
        String displayType   = payload.path("displayType").asText(null);

        if (!noticesNode.isArray() || displayType == null) {
            return TcpResponse.error("NOTICE_SYNC", "notices 배열과 displayType이 필요합니다.");
        }

        // JsonNode 배열을 List<Map> 으로 변환
        List<Map<String, Object>> notices = objectMapper.convertValue(
                noticesNode,
                objectMapper.getTypeFactory().constructCollectionType(List.class, Map.class));

        String closeableYn = payload.path("closeableYn").asText("Y");
        String hideTodayYn = payload.path("hideTodayYn").asText("Y");

        noticeService.sync(notices, displayType, closeableYn, hideTodayYn);
        return TcpResponse.ok("NOTICE_SYNC", Map.of("success", true));
    }

    /**
     * NOTICE_END 커맨드 처리 — Admin 긴급공지 배포 종료.
     * Node.js의 POST /api/notices/end에 해당.
     *
     * @param request 요청 메시지 (adminSecret 검증 필요)
     * @return 종료 완료 응답 또는 인증 오류
     */
    public TcpResponse handleEnd(TcpRequest request) {
        if (!verifyAdmin(request)) {
            return TcpResponse.error("NOTICE_END", "관리자 인증이 필요합니다.");
        }
        noticeService.end();
        return TcpResponse.ok("NOTICE_END", Map.of("success", true));
    }

    /**
     * NOTICE_PREVIEW 커맨드 처리 — Admin 미리보기.
     * DEPLOY_STATUS 무관하게 DB의 최신 저장값을 반환한다.
     *
     * @param request 요청 메시지 (adminSecret 검증 필요)
     * @return { notices, displayType } 응답
     */
    public TcpResponse handlePreview(TcpRequest request) {
        if (!verifyAdmin(request)) {
            return TcpResponse.error("NOTICE_PREVIEW", "관리자 인증이 필요합니다.");
        }
        try {
            Map<String, Object> data = noticeService.preview();
            return TcpResponse.ok("NOTICE_PREVIEW", data);
        } catch (Exception e) {
            return TcpResponse.error("NOTICE_PREVIEW", "공지 데이터를 불러오지 못했습니다.");
        }
    }

    /** adminSecret 헤더(필드)를 검증한다. */
    private boolean verifyAdmin(TcpRequest request) {
        String secret = request.getAdminSecret();
        return secret != null && secret.equals(appProperties.getAuth().getAdminSecret());
    }
}
