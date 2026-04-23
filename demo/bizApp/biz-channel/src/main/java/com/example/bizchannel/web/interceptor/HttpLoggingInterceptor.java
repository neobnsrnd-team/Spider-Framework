package com.example.bizchannel.web.interceptor;

import com.example.spiderlink.domain.messageinstance.MessageInstanceRecorder;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.UUID;

/**
 * HTTP 거래 로그 기록 인터셉터.
 *
 * <p>Front → biz-channel HTTP 수신 시점에 UUID를 생성하여 {@code requestId} request 속성으로 저장하고,
 * {@link MessageInstanceRecorder}를 통해 {@code FWK_MESSAGE_INSTANCE}에 REQ 로그를 INSERT한다.
 * 응답 완료 후 {@code afterCompletion}에서 RES 로그를 INSERT한다.</p>
 *
 * <p>생성된 {@code requestId}는 Controller → {@link com.example.bizchannel.client.BizClient}까지
 * 전달되어 후속 TCP 구간과 동일한 {@code TRX_TRACKING_NO}로 연결된다.</p>
 *
 * <p>{@link MessageInstanceRecorder}가 없는 경우(JdbcTemplate 미존재) UUID 생성만 수행하고 로그 기록은 생략한다.</p>
 */
@Slf4j
@Component
public class HttpLoggingInterceptor implements HandlerInterceptor {

    /** JdbcTemplate 빈이 없으면 null — 로그 기록 생략 */
    @Nullable
    @Autowired(required = false)
    private MessageInstanceRecorder recorder;

    @Value("${server.port:18080}")
    private int serverPort;

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String requestId = UUID.randomUUID().toString();
        // Controller에서 BizClient로 전달할 수 있도록 request 속성에 저장
        request.setAttribute("requestId", requestId);

        String uri = request.getRequestURI();
        log.debug("[HttpLoggingInterceptor] HTTP REQ: requestId={} uri={}", requestId, uri);
        if (recorder != null) {
            recorder.recordHttpRequest(requestId, uri, null, serverPort);
        }
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response,
                                Object handler, Exception ex) {
        String requestId = (String) request.getAttribute("requestId");
        if (requestId == null) return;

        String uri = request.getRequestURI();
        boolean success = response.getStatus() < 400;
        log.debug("[HttpLoggingInterceptor] HTTP RES: requestId={} uri={} status={}", requestId, uri, response.getStatus());
        if (recorder != null) {
            recorder.recordHttpResponse(requestId, uri, null, success, serverPort);
        }
    }
}
