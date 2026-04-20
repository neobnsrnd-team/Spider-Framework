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
import org.springframework.transaction.annotation.Transactional;
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
     * <p>HTML 조립(ContentBuilder CSS·런타임 인라인, 에셋 경로 치환)·파일 저장·이력 기록은 CMS push API가 담당한다.
     * Admin은 APPROVED 상태 사전 검증 후 CMS push API를 호출한다.
     */
    public void push(String pageId, String userId) {
        // APPROVED 상태 사전 검증 — CMS가 실패하기 전에 빠른 피드백 제공
        String html = cmsDeployMapper.findApprovedPageHtml(pageId);
        if (html == null) {
            throw new NotFoundException("승인된 페이지를 찾을 수 없습니다. pageId=" + pageId);
        }
        // HTML 조립·파일 저장·이력 기록은 CMS push API가 담당
        callCmsPush(pageId, userId);
        log.info("CMS 배포 요청 완료: pageId={}, userId={}", pageId, userId);
    }

    /** CMS push API 호출 — x-deploy-token 서버 간 인증 사용 */
    @SuppressWarnings("unchecked")
    private void callCmsPush(String pageId, String userId) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("x-deploy-token", deployProperties.getSecret());

        Map<String, Object> body = new HashMap<>();
        body.put("pageId", pageId);
        body.put("userId", userId);

        try {
            ResponseEntity<Map<String, Object>> response = restTemplate.exchange(
                    deployProperties.getPushUrl(),
                    HttpMethod.POST,
                    new HttpEntity<>(body, headers),
                    new ParameterizedTypeReference<Map<String, Object>>() {});

            Map<String, Object> responseBody = response.getBody();
            if (responseBody == null) {
                throw new InternalException("CMS 배포 서버에서 빈 응답을 반환했습니다.");
            }
            if (!Boolean.TRUE.equals(responseBody.get("ok"))) {
                Object error = responseBody.get("error");
                throw new InternalException("CMS 배포 서버 오류: " + error);
            }
        } catch (InternalException e) {
            throw e;
        } catch (Exception e) {
            throw new InternalException("CMS 배포 서버 오류: " + e.getMessage(), e);
        }
    }
}
