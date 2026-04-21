/**
 * @file NoticeController.java
 * @description 긴급공지 SSE REST 컨트롤러.
 *              프론트엔드 EventSource가 연결하는 SSE 엔드포인트를 제공한다.
 *
 * @description 엔드포인트:
 *   GET /api/notices/sse — SSE 구독 (인증 불필요, Vite 프록시 경유)
 *
 * @description SSE 이벤트 형식:
 *   event: notice
 *   data: {"notices":[...],"displayType":"A","closeableYn":"Y","hideTodayYn":"Y"}
 *
 *   공지 없음:
 *   event: notice
 *   data: null
 */
package com.example.tcpbackend.web.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import com.example.tcpbackend.domain.notice.NoticeService;

/**
 * 긴급공지 SSE 컨트롤러.
 *
 * <p>프론트엔드 {@code useEmergencyNotice} 훅의 EventSource가 이 엔드포인트에 연결한다.
 * Vite 프록시(5173 → 9998)를 통해 접근하므로 CORS 설정이 불필요하다.
 */
@RestController
@RequestMapping("/api/notices")
public class NoticeController {

    private final NoticeService noticeService;

    public NoticeController(NoticeService noticeService) {
        this.noticeService = noticeService;
    }

    /**
     * SSE 구독 엔드포인트.
     * 연결 즉시 현재 공지 상태를 전송하고, 이후 변경 시 이벤트를 푸시한다.
     *
     * @return SseEmitter (Spring이 연결을 유지하며 이벤트를 스트리밍)
     */
    @GetMapping("/sse")
    public SseEmitter subscribe() {
        return noticeService.subscribe();
    }
}
