/**
 * @file RequestLoggingFilter.java
 * @description 모든 HTTP API 요청/응답을 콘솔에 출력하는 서블릿 필터.
 *
 * <p>요청마다 다음 정보를 로깅한다:
 * <ul>
 *   <li>[→ REQ] 메서드, URI, 쿼리스트링, 클라이언트 IP, 요청 바디</li>
 *   <li>[← RES] HTTP 상태 코드, 소요 시간(ms), 응답 바디</li>
 *   <li>[✗ ERR] 처리 중 예외 발생 시 예외 메시지 추가 출력</li>
 * </ul>
 *
 * <p>요청/응답 바디는 InputStream이 한 번만 읽힐 수 있으므로
 * ContentCachingRequestWrapper / ContentCachingResponseWrapper로 래핑해 재사용한다.
 * SSE 스트리밍 응답은 바디를 버퍼링하지 않는다.
 */
package com.example.tcpbackend.web.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

/**
 * API 요청/응답 로깅 필터.
 * OncePerRequestFilter 상속으로 요청당 정확히 한 번만 실행된다.
 */
@Slf4j
@Component
public class RequestLoggingFilter extends OncePerRequestFilter {

    /** 로그에 출력할 바디 최대 길이 (너무 크면 로그가 지저분해지므로 제한) */
    private static final int MAX_BODY_LENGTH = 2000;

    @Override
    protected void doFilterInternal(
            HttpServletRequest  request,
            HttpServletResponse response,
            FilterChain         filterChain
    ) throws ServletException, IOException {

        long   startMs = System.currentTimeMillis();
        String method  = request.getMethod();
        String uri     = request.getRequestURI();
        String query   = request.getQueryString();
        String client  = request.getRemoteAddr();

        // SSE 스트리밍은 응답을 버퍼링하면 클라이언트에 데이터가 전달되지 않으므로 래핑을 건너뛴다.
        boolean isSse = "text/event-stream".equals(request.getHeader("Accept"));
        if (isSse) {
            filterChain.doFilter(request, response);
            return;
        }

        // 요청/응답 바디를 여러 번 읽기 위해 캐싱 래퍼로 교체한다.
        ContentCachingRequestWrapper  wrappedReq = new ContentCachingRequestWrapper(request);
        ContentCachingResponseWrapper wrappedRes = new ContentCachingResponseWrapper(response);

        String uriWithQuery = query != null ? uri + "?" + query : uri;

        try {
            filterChain.doFilter(wrappedReq, wrappedRes);
        } catch (Exception ex) {
            long elapsed = System.currentTimeMillis() - startMs;
            log.error("✗ ERR  {} {}  {}ms  exception={}", method, uri, elapsed, ex.getMessage(), ex);
            throw ex;
        } finally {
            long elapsed = System.currentTimeMillis() - startMs;
            int  status  = wrappedRes.getStatus();

            String reqBody = extractBody(wrappedReq.getContentAsByteArray());
            String resBody = extractBody(wrappedRes.getContentAsByteArray());

            if (status >= 500) {
                log.error("→ REQ  {} {}  (from {})  body={}", method, uriWithQuery, client, reqBody);
                log.error("← RES  {} {}  {} ({}ms)  body={}", method, uri, status, elapsed, resBody);
            } else if (status >= 400) {
                log.warn ("→ REQ  {} {}  (from {})  body={}", method, uriWithQuery, client, reqBody);
                log.warn ("← RES  {} {}  {} ({}ms)  body={}", method, uri, status, elapsed, resBody);
            } else {
                log.info ("→ REQ  {} {}  (from {})  body={}", method, uriWithQuery, client, reqBody);
                log.info ("← RES  {} {}  {} ({}ms)  body={}", method, uri, status, elapsed, resBody);
            }

            // 래핑된 응답의 바디를 실제 클라이언트에게 복사한다. (필수: 누락 시 응답 바디 유실)
            wrappedRes.copyBodyToResponse();
        }
    }

    /**
     * 바이트 배열을 UTF-8 문자열로 변환한다.
     * 바디가 없으면 "(empty)", MAX_BODY_LENGTH 초과분은 잘라낸다.
     *
     * @param bytes 캐싱된 바디 바이트 배열
     * @returns 로그 출력용 문자열
     */
    private String extractBody(byte[] bytes) {
        if (bytes == null || bytes.length == 0) {
            return "(empty)";
        }
        String body = new String(bytes, StandardCharsets.UTF_8);
        if (body.length() > MAX_BODY_LENGTH) {
            return body.substring(0, MAX_BODY_LENGTH) + "... (truncated)";
        }
        return body;
    }
}