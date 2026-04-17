package com.example.admin_demo.domain.cmsdeployment.service;

import com.example.admin_demo.domain.cmsdeployment.config.CmsDeployProperties;
import com.example.admin_demo.domain.cmsdeployment.dto.CmsDeployHistoryRequest;
import com.example.admin_demo.domain.cmsdeployment.dto.CmsDeployHistoryResponse;
import com.example.admin_demo.domain.cmsdeployment.dto.CmsDeployPageRequest;
import com.example.admin_demo.domain.cmsdeployment.dto.CmsDeployPageResponse;
import com.example.admin_demo.domain.cmsdeployment.mapper.CmsDeployMapper;
import com.example.admin_demo.global.dto.PageRequest;
import com.example.admin_demo.global.dto.PageResponse;
import com.example.admin_demo.global.exception.InternalException;
import com.example.admin_demo.global.exception.NotFoundException;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionTemplate;
import org.springframework.web.client.RestTemplate;

/** CMS 배포 관리 서비스 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CmsDeployService {

    private final CmsDeployMapper cmsDeployMapper;
    private final RestTemplate restTemplate;
    private final CmsDeployProperties deployProperties;
    private final PlatformTransactionManager txManager;

    /** 배포 대상 페이지 목록 조회 (APPROVE_STATE = 'APPROVED') */
    public PageResponse<CmsDeployPageResponse> findApprovedPageList(CmsDeployPageRequest req, PageRequest pageRequest) {

        long total = cmsDeployMapper.countApprovedPageList(req);
        List<CmsDeployPageResponse> list =
                cmsDeployMapper.findApprovedPageList(req, pageRequest.getOffset(), pageRequest.getEndRow());

        return PageResponse.of(list, total, pageRequest.getPage(), pageRequest.getSize());
    }

    /** 배포 이력 목록 조회 (모달용, pageId 필터) */
    public PageResponse<CmsDeployHistoryResponse> findHistoryList(
            CmsDeployHistoryRequest req, PageRequest pageRequest) {

        long total = cmsDeployMapper.countHistoryList(req);
        List<CmsDeployHistoryResponse> list =
                cmsDeployMapper.findHistoryList(req, pageRequest.getOffset(), pageRequest.getEndRow());

        return PageResponse.of(list, total, pageRequest.getPage(), pageRequest.getSize());
    }

    /**
     * 배포 실행
     *
     * <p>트랜잭션 범위를 최소화하기 위해 외부 API 호출 중 DB 커넥션을 점유하지 않습니다.
     *
     * <ol>
     *   <li>APPROVED 상태 페이지 HTML 조회 (MyBatis가 커넥션 열린 상태에서 CLOB → String 변환)
     *   <li>cms-tracker.js fetch — 실패해도 배포 계속
     *   <li>receive API 호출 — 실패 시 예외, 이력 미저장
     *   <li>성공 이력 저장 (별도 단기 트랜잭션)
     * </ol>
     */
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    public void push(String pageId, String userId) {
        String html = cmsDeployMapper.findApprovedPageHtml(pageId);
        if (html == null) {
            throw new NotFoundException("승인된 페이지를 찾을 수 없습니다. pageId=" + pageId);
        }

        String instanceId = cmsDeployMapper.findFirstInstanceId();
        if (instanceId == null) {
            throw new InternalException("배포 서버 인스턴스가 없습니다. FWK_CMS_SERVER_INSTANCE 테이블을 확인해주세요.");
        }

        // 외부 API 호출 — DB 커넥션 미점유
        String trackerJs = fetchTrackerJs();
        callReceive(pageId, html, trackerJs);

        // 배포 성공: 단기 트랜잭션으로 이력 저장
        final long fileSize = html.getBytes(StandardCharsets.UTF_8).length;
        final String crcValue = computeCrc(html);
        new TransactionTemplate(txManager).executeWithoutResult(tx -> {
            int version = cmsDeployMapper.findNextFileVersion(pageId);
            String fileId = pageId + "_v" + version + ".html";
            cmsDeployMapper.insertSendHistory(instanceId, fileId, fileSize, crcValue, userId);
            log.info("CMS 배포 성공: pageId={}, fileId={}, userId={}", pageId, fileId, userId);
        });
    }

    private String fetchTrackerJs() {
        try {
            ResponseEntity<String> response =
                    restTemplate.getForEntity(deployProperties.getTrackerJsUrl(), String.class);
            if (response.getStatusCode().is2xxSuccessful()) {
                return response.getBody();
            }
        } catch (Exception e) {
            log.warn("cms-tracker.js를 가져올 수 없습니다. 트래커 없이 배포합니다. url={}", deployProperties.getTrackerJsUrl());
        }
        return null;
    }

    @SuppressWarnings("unchecked")
    private void callReceive(String pageId, String html, String trackerJs) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-deploy-token", deployProperties.getSecret());

        Map<String, Object> body = new HashMap<>();
        body.put("pageId", pageId);
        body.put("html", html);
        if (trackerJs != null) {
            body.put("trackerJs", trackerJs);
        }

        try {
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    deployProperties.getReceiveUrl(),
                    HttpMethod.POST,
                    new HttpEntity<>(body, headers),
                    new ParameterizedTypeReference<Map<String, Object>>() {});

            Map<String, Object> responseBody = response.getBody();
            if (responseBody == null) {
                throw new InternalException("배포 서버에서 빈 응답을 반환했습니다.");
            }

            if (!Boolean.TRUE.equals(responseBody.get("ok"))) {
                Object error = responseBody.get("error");
                throw new InternalException("배포 서버 오류: " + error);
            }

        } catch (InternalException e) {
            throw e;
        } catch (Exception e) {
            throw new InternalException("배포 서버 오류: " + e.getMessage(), e);
        }
    }

    private String computeCrc(String html) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hash = md.digest(html.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : hash) {
                sb.append(String.format("%02x", b));
            }
            return sb.substring(0, 16);
        } catch (NoSuchAlgorithmException e) {
            throw new InternalException("SHA-256 알고리즘을 찾을 수 없습니다.", e);
        }
    }
}
