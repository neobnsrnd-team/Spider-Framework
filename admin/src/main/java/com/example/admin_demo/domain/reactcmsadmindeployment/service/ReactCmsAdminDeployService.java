package com.example.admin_demo.domain.reactcmsadmindeployment.service;

import com.example.admin_demo.domain.cmsdeployment.config.CmsDeployProperties;
import com.example.admin_demo.domain.reactcmsadmindeployment.dto.ReactCmsAdminDeployHistoryRequest;
import com.example.admin_demo.domain.reactcmsadmindeployment.dto.ReactCmsAdminDeployHistoryResponse;
import com.example.admin_demo.domain.reactcmsadmindeployment.dto.ReactCmsAdminDeployPageRequest;
import com.example.admin_demo.domain.reactcmsadmindeployment.dto.ReactCmsAdminDeployPageResponse;
import com.example.admin_demo.domain.reactcmsadmindeployment.mapper.ReactCmsAdminDeployMapper;
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

/** React CMS Admin 배포 관리 서비스 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReactCmsAdminDeployService {

    private final ReactCmsAdminDeployMapper reactCmsAdminDeployMapper;
    private final RestTemplate restTemplate;
    // CMS push API URL과 인증 토큰은 HTML CMS와 동일한 설정 공유
    private final CmsDeployProperties deployProperties;

    /** 배포 대상 페이지 목록 조회 (PAGE_TYPE='REACT', APPROVE_STATE='APPROVED') */
    public PageResponse<ReactCmsAdminDeployPageResponse> findApprovedPageList(
            ReactCmsAdminDeployPageRequest req, PageRequest pageRequest) {
        long total = reactCmsAdminDeployMapper.countApprovedPageList(req);
        List<ReactCmsAdminDeployPageResponse> list =
                reactCmsAdminDeployMapper.findApprovedPageList(req, pageRequest.getOffset(), pageRequest.getEndRow());

        // 프로토콜과 경로는 application.yml 설정값으로 관리 — 하드코딩 대신 환경별 변경 가능
        String protocol = deployProperties.getDeployedProtocol();
        String pathPrefix = deployProperties.getDeployedPathPrefix();
        list.forEach(item -> {
            if (item.getInstanceIp() != null && item.getInstancePort() != null) {
                item.setDeployedUrl(
                        protocol + "://" + item.getInstanceIp() + ":" + item.getInstancePort()
                        + pathPrefix + "/" + item.getPageId() + ".html");
            }
        });

        return PageResponse.of(list, total, pageRequest.getPage(), pageRequest.getSize());
    }

    /** 배포 이력 목록 조회 (모달용, pageId 필터) */
    public PageResponse<ReactCmsAdminDeployHistoryResponse> findHistoryList(
            ReactCmsAdminDeployHistoryRequest req, PageRequest pageRequest) {
        long total = reactCmsAdminDeployMapper.countHistoryList(req);
        List<ReactCmsAdminDeployHistoryResponse> list =
                reactCmsAdminDeployMapper.findHistoryList(req, pageRequest.getOffset(), pageRequest.getEndRow());
        return PageResponse.of(list, total, pageRequest.getPage(), pageRequest.getSize());
    }

    /**
     * 배포 실행
     *
     * <p>PAGE_TYPE='REACT', APPROVE_STATE='APPROVED' 사전 검증 후 CMS push API 호출.
     * HTML 조립·파일 저장·이력 기록은 CMS push API가 담당한다.
     */
    public void push(String pageId, String userId) {
        // REACT 타입이고 APPROVED 상태인지 사전 검증 — CLOB 전체 로드 대신 COUNT 쿼리로 경량 확인
        if (reactCmsAdminDeployMapper.existsApprovedPage(pageId) == 0) {
            throw new NotFoundException("승인된 React 페이지를 찾을 수 없습니다. pageId=" + pageId);
        }
        callCmsPush(pageId, userId);
        log.info("React CMS Admin 배포 요청 완료: pageId={}, userId={}", pageId, userId);
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
