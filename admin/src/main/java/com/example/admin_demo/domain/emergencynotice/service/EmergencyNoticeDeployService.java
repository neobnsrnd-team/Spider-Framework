package com.example.admin_demo.domain.emergencynotice.service;

import com.example.admin_demo.domain.emergencynotice.dto.EmergencyNoticeDeployStatusResponse;
import com.example.admin_demo.domain.emergencynotice.dto.EmergencyNoticeHistoryResponse;
import com.example.admin_demo.domain.emergencynotice.dto.EmergencyNoticeResponse;
import com.example.admin_demo.domain.emergencynotice.mapper.EmergencyNoticeDeployMapper;
import com.example.admin_demo.domain.emergencynotice.mapper.EmergencyNoticeMapper;
import com.example.admin_demo.global.exception.InvalidInputException;
import com.example.admin_demo.global.exception.NotFoundException;
import com.example.admin_demo.global.util.AuditUtil;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

/**
 * 긴급공지 배포 관리 서비스
 *
 * <p>배포 라이프사이클(DRAFT → DEPLOYED → ENDED)을 관리하고,
 * Demo Backend에 SSE Push를 통해 배포 상태를 동기화한다.
 *
 * <p>흐름:
 * <ol>
 *   <li>Admin DB 업데이트 (FWK_PROPERTY DEPLOY_STATUS 변경) → 트랜잭션 커밋</li>
 *   <li>FWK_PROPERTY_HISTORY 스냅샷 삽입</li>
 *   <li>Demo Backend REST 호출 (비치명적 — 실패 시 재기동 후 복구됨)</li>
 * </ol>
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class EmergencyNoticeDeployService {

    /** 배포 상태 상수 */
    private static final String STATUS_DEPLOYED = "DEPLOYED";
    private static final String STATUS_ENDED    = "ENDED";

    /** Demo Backend 동기화 엔드포인트 */
    private static final String SYNC_PATH = "/api/notices/sync";
    private static final String END_PATH  = "/api/notices/end";

    /** Demo Backend를 호출할 때 실어 보내는 관리자 식별 헤더 */
    private static final String ADMIN_SECRET_HEADER = "X-Admin-Secret";

    private final EmergencyNoticeDeployMapper emergencyNoticeDeployMapper;
    private final EmergencyNoticeMapper       emergencyNoticeMapper;
    private final RestTemplate               restTemplate;

    @Value("${demo.backend.url:http://localhost:3001}")
    private String demoBackendUrl;

    @Value("${demo.backend.admin-secret:admin-secret}")
    private String adminSecret;

    /**
     * 현재 배포 상태, 노출 설정, 이력(페이징·필터 적용)을 함께 반환한다.
     *
     * @param reason   구분 필터 (null·빈문자열이면 전체 조회)
     * @param page     페이지 번호 (1부터)
     * @param pageSize 페이지당 건수
     */
    public Map<String, Object> getDeployInfo(String reason, int page, int pageSize) {
        EmergencyNoticeDeployStatusResponse status = selectDeployStatusOrThrow();
        int offset = (page - 1) * pageSize;
        List<EmergencyNoticeHistoryResponse> history =
                emergencyNoticeDeployMapper.selectHistory(reason, offset, pageSize);
        int historyTotal = emergencyNoticeDeployMapper.selectHistoryCount(reason);
        Map<String, Object> result = new HashMap<>();
        result.put("deployStatus",   status.getDeployStatus());
        result.put("startDtime",     status.getStartDtime());
        result.put("endDtime",       status.getEndDtime());
        result.put("closeableYn",    status.getCloseableYn()  != null ? status.getCloseableYn()  : "Y");
        result.put("hideTodayYn",    status.getHideTodayYn()  != null ? status.getHideTodayYn()  : "Y");
        result.put("history",        history);
        result.put("historyTotal",   historyTotal);
        result.put("historyPage",    page);
        result.put("historyPageSize", pageSize);
        return result;
    }

    /**
     * 긴급공지를 배포한다.
     *
     * <ol>
     *   <li>FWK_PROPERTY USE_YN 행의 DEPLOY_STATUS를 'DEPLOYED'로 변경</li>
     *   <li>배포 이력 스냅샷 삽입</li>
     *   <li>Demo Backend {@code POST /api/notices/sync} 호출로 SSE Push 트리거</li>
     * </ol>
     */
    @Transactional
    public void deploy() {
        EmergencyNoticeDeployStatusResponse status = selectDeployStatusOrThrow();
        if (STATUS_DEPLOYED.equals(status.getDeployStatus())) {
            throw new InvalidInputException("이미 배포 중입니다. 배포 종료 후 다시 시도해주세요.");
        }

        String now    = AuditUtil.now();
        String userId = AuditUtil.currentUserId();

        emergencyNoticeDeployMapper.updateDeployStart(now, now, userId);
        emergencyNoticeDeployMapper.insertHistorySnapshot("배포", now, userId);

        log.info("긴급공지 배포 완료: userId={}, startDtime={}", userId, now);

        // 트랜잭션 커밋 후 Demo Backend 동기화 (실패해도 DB 상태는 유지됨)
        syncToDemoBackend();
    }

    /**
     * 긴급공지 배포를 종료한다.
     *
     * <ol>
     *   <li>FWK_PROPERTY USE_YN 행의 DEPLOY_STATUS를 'ENDED'로 변경</li>
     *   <li>배포 종료 이력 스냅샷 삽입</li>
     *   <li>Demo Backend {@code POST /api/notices/end} 호출로 SSE Push 트리거</li>
     * </ol>
     */
    @Transactional
    public void endDeploy() {
        EmergencyNoticeDeployStatusResponse status = selectDeployStatusOrThrow();
        if (!STATUS_DEPLOYED.equals(status.getDeployStatus())) {
            throw new InvalidInputException("배포 중인 공지가 없습니다. 먼저 배포를 진행해주세요.");
        }

        String now    = AuditUtil.now();
        String userId = AuditUtil.currentUserId();

        emergencyNoticeDeployMapper.updateDeployEnd(now, now, userId);
        emergencyNoticeDeployMapper.insertHistorySnapshot("배포 종료", now, userId);

        log.info("긴급공지 배포 종료 완료: userId={}, endDtime={}", userId, now);

        endDemoBackendNotice();
    }

    /**
     * 공지 노출 설정(닫기 버튼·체크박스)을 저장한다.
     *
     * <p>배포 중(DEPLOYED) 상태라면 변경 즉시 Demo Backend에 재동기화하여
     * 실시간으로 반영한다. (critical 장애 시 즉각 차단 가능)
     *
     * @param closeableYn  닫기 버튼 노출 여부 (Y/N)
     * @param hideTodayYn 오늘 하루 보지 않기 체크박스 노출 여부 (Y/N)
     */
    @Transactional
    public void updateSettings(String closeableYn, String hideTodayYn) {
        String now    = AuditUtil.now();
        String userId = AuditUtil.currentUserId();

        emergencyNoticeDeployMapper.updateCloseableYn(closeableYn,  now, userId);
        emergencyNoticeDeployMapper.updateHideTodayYn(hideTodayYn, now, userId);
        emergencyNoticeDeployMapper.insertHistorySnapshot("설정 변경", now, userId);

        log.info("긴급공지 설정 변경: closeableYn={}, hideTodayYn={}, userId={}", closeableYn, hideTodayYn, userId);

        // 배포 중이면 변경 사항을 Demo Backend에 즉시 반영
        EmergencyNoticeDeployStatusResponse status = emergencyNoticeDeployMapper.selectDeployStatus();
        if (status != null && STATUS_DEPLOYED.equals(status.getDeployStatus())) {
            syncToDemoBackend();
        }
    }

    /**
     * USE_YN 행의 배포 상태를 조회하고, 데이터가 없으면 NotFoundException을 던진다.
     */
    private EmergencyNoticeDeployStatusResponse selectDeployStatusOrThrow() {
        EmergencyNoticeDeployStatusResponse status = emergencyNoticeDeployMapper.selectDeployStatus();
        if (status == null) {
            throw new NotFoundException("긴급공지 초기 데이터가 없습니다. 03_insert_initial_data.sql 실행 후 04_alter_fwk_property.sql을 실행해주세요.");
        }
        return status;
    }

    /**
     * 현재 공지 내용을 Demo Backend에 동기화한다 (배포 시 호출).
     *
     * <p>Demo Backend가 다운된 경우 경고 로그만 출력하고 계속 진행한다.
     * Demo Backend 재기동 시 {@code restoreNoticeState()} 로 DB에서 복구된다.
     */
    private void syncToDemoBackend() {
        try {
            List<EmergencyNoticeResponse> notices = emergencyNoticeMapper.selectAll();
            String displayType = emergencyNoticeMapper.selectDisplayType();

            // notices 배열을 Demo Backend가 기대하는 형태로 변환
            List<Map<String, String>> noticePayload = notices.stream()
                    .map(n -> {
                        Map<String, String> item = new HashMap<>();
                        item.put("lang",    n.getPropertyId());
                        item.put("title",   n.getTitle()   != null ? n.getTitle()   : "");
                        item.put("content", n.getContent() != null ? n.getContent() : "");
                        return item;
                    })
                    .toList();

            // 노출 설정 조회 (closeableYn, hideTodayYn)
            EmergencyNoticeDeployStatusResponse deployStatus = emergencyNoticeDeployMapper.selectDeployStatus();

            Map<String, Object> body = new HashMap<>();
            body.put("notices",      noticePayload);
            body.put("displayType",  displayType != null ? displayType : "N");
            body.put("closeableYn",  deployStatus != null && deployStatus.getCloseableYn()  != null ? deployStatus.getCloseableYn()  : "Y");
            body.put("hideTodayYn",  deployStatus != null && deployStatus.getHideTodayYn()  != null ? deployStatus.getHideTodayYn()  : "Y");

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set(ADMIN_SECRET_HEADER, adminSecret);

            restTemplate.postForObject(
                    demoBackendUrl + SYNC_PATH,
                    new HttpEntity<>(body, headers),
                    Void.class);

            log.info("Demo Backend 긴급공지 동기화 완료: url={}", demoBackendUrl + SYNC_PATH);
        } catch (Exception e) {
            // Demo Backend 비가용 시에도 Admin DB는 이미 업데이트됨 — 재기동 후 복구
            log.warn("Demo Backend 동기화 실패 (비치명적, 재기동 시 자동 복구): {}", e.getMessage());
        }
    }

    /**
     * Demo Backend에 배포 종료 신호를 보낸다.
     * 실패 시 경고 로그만 출력하고 계속 진행한다.
     */
    private void endDemoBackendNotice() {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set(ADMIN_SECRET_HEADER, adminSecret);

            restTemplate.postForObject(
                    demoBackendUrl + END_PATH,
                    new HttpEntity<>(null, headers),
                    Void.class);

            log.info("Demo Backend 긴급공지 종료 완료: url={}", demoBackendUrl + END_PATH);
        } catch (Exception e) {
            log.warn("Demo Backend 종료 신호 전송 실패 (비치명적): {}", e.getMessage());
        }
    }
}
