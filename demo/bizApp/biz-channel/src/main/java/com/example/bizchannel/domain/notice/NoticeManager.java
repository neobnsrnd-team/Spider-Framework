package com.example.bizchannel.domain.notice;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * 공지사항 SSE(Server-Sent Events) 상태 관리 컴포넌트.
 *
 * <p>현재 활성 공지사항({@code currentNotice})과 연결된 SSE 클라이언트 목록을
 * 인메모리로 관리하며, 공지 업데이트 시 모든 연결된 클라이언트에게 실시간으로 브로드캐스트한다.</p>
 *
 * <p>멀티스레드 환경에서의 클라이언트 목록 안전성을 위해 {@link CopyOnWriteArrayList} 를 사용하고,
 * 공지 상태는 가시성 보장을 위해 {@code volatile} 로 선언한다.</p>
 */
@Slf4j
@Component
public class NoticeManager {

    /** 현재 활성 공지사항 — null 이면 공지 없음. volatile 로 스레드 가시성 보장 */
    private volatile Map<String, Object> currentNotice = null;

    /**
     * SSE 연결 클라이언트 목록.
     * 읽기가 쓰기보다 훨씬 빈번하므로 CopyOnWriteArrayList 를 사용
     */
    private final List<SseEmitter> clients = new CopyOnWriteArrayList<>();

    /**
     * 새 SSE 클라이언트를 등록하고 현재 공지사항을 즉시 전송한다.
     *
     * <p>연결 완료·타임아웃·오류 발생 시 클라이언트 목록에서 자동으로 제거된다.</p>
     *
     * @return 생성된 {@link SseEmitter} 인스턴스
     */
    public SseEmitter addClient() {
        // 타임아웃 없이 유지 (Long.MAX_VALUE) — 서버 측 종료 또는 클라이언트 연결 해제까지 유지
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);

        emitter.onCompletion(() -> clients.remove(emitter));
        emitter.onTimeout(() -> {
            clients.remove(emitter);
            emitter.complete();
        });
        emitter.onError(e -> {
            clients.remove(emitter);
            log.debug("[NoticeManager] SSE 클라이언트 오류로 제거: {}", e.getMessage());
        });

        clients.add(emitter);
        log.debug("[NoticeManager] SSE 클라이언트 등록. 현재 연결 수={}", clients.size());

        // 신규 연결 시 현재 활성 공지가 있으면 즉시 전송
        if (currentNotice != null) {
            sendToEmitter(emitter, currentNotice);
        }

        return emitter;
    }

    /**
     * 공지사항을 업데이트하고 모든 연결된 클라이언트에게 브로드캐스트한다.
     *
     * @param notice 브로드캐스트할 공지사항 데이터 (null 이면 공지 종료)
     */
    public void broadcast(Map<String, Object> notice) {
        this.currentNotice = notice;
        log.info("[NoticeManager] 공지 브로드캐스트. 클라이언트 수={}, notice={}", clients.size(), notice != null ? "있음" : "없음(종료)");

        for (SseEmitter emitter : clients) {
            sendToEmitter(emitter, notice);
        }
    }

    /**
     * 현재 인메모리에 저장된 활성 공지사항을 반환한다.
     *
     * @return 현재 공지사항 Map, 없으면 {@code null}
     */
    public Map<String, Object> getCurrentNotice() {
        return currentNotice;
    }

    /**
     * 단일 SSE 이미터에 데이터를 전송한다.
     *
     * <p>전송 실패 시 해당 이미터를 목록에서 제거하고 완료 처리한다.
     * {@code notice} 가 {@code null} 이면 이벤트 이름을 {@code "notice-end"} 로 전송한다.</p>
     *
     * @param emitter 전송 대상 이미터
     * @param notice  전송할 공지 데이터 (null 허용)
     */
    private void sendToEmitter(SseEmitter emitter, Map<String, Object> notice) {
        try {
            if (notice != null) {
                emitter.send(SseEmitter.event().name("notice").data(notice));
            } else {
                // 공지 종료 신호 — 빈 데이터로 notice-end 이벤트 전송
                emitter.send(SseEmitter.event().name("notice-end").data(""));
            }
        } catch (IOException e) {
            // 연결이 끊어진 클라이언트 — 목록에서 제거
            clients.remove(emitter);
            log.debug("[NoticeManager] SSE 전송 실패로 클라이언트 제거: {}", e.getMessage());
        }
    }
}
