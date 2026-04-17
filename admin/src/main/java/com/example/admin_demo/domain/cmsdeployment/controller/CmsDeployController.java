package com.example.admin_demo.domain.cmsdeployment.controller;

import com.example.admin_demo.domain.cmsdeployment.dto.CmsDeployHistoryRequest;
import com.example.admin_demo.domain.cmsdeployment.dto.CmsDeployHistoryResponse;
import com.example.admin_demo.domain.cmsdeployment.dto.CmsDeployPageRequest;
import com.example.admin_demo.domain.cmsdeployment.dto.CmsDeployPageResponse;
import com.example.admin_demo.domain.cmsdeployment.dto.CmsDeployPushRequest;
import com.example.admin_demo.domain.cmsdeployment.service.CmsDeployService;
import com.example.admin_demo.global.dto.ApiResponse;
import com.example.admin_demo.global.dto.PageRequest;
import com.example.admin_demo.global.dto.PageResponse;
import com.example.admin_demo.global.security.CustomUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * CMS 배포 관리 API 컨트롤러
 *
 * <h4>API 엔드포인트:</h4>
 * <ul>
 *   <li>GET  /api/cms-admin/deployments/pages  — 배포 대상 페이지 목록 (APPROVED)</li>
 *   <li>GET  /api/cms-admin/deployments        — 배포 이력 조회 (모달용)</li>
 *   <li>POST /api/cms-admin/deployments/push   — 배포 실행</li>
 * </ul>
 */
@Slf4j
@RestController
@RequiredArgsConstructor
public class CmsDeployController {

    private final CmsDeployService cmsDeployService;

    /** 배포 대상 페이지 목록 조회 — APPROVE_STATE='APPROVED' (CMS:R) */
    @GetMapping("/api/cms-admin/deployments/pages")
    @PreAuthorize("hasAuthority('CMS:R')")
    public ResponseEntity<ApiResponse<PageResponse<CmsDeployPageResponse>>> findApprovedPageList(
            @ModelAttribute CmsDeployPageRequest req,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {

        PageRequest pageRequest =
                PageRequest.builder().page(Math.max(0, page - 1)).size(size).build();

        return ResponseEntity.ok(ApiResponse.success(cmsDeployService.findApprovedPageList(req, pageRequest)));
    }

    /** 배포 이력 조회 (모달용, pageId 필터) (CMS:R) */
    @GetMapping("/api/cms-admin/deployments")
    @PreAuthorize("hasAuthority('CMS:R')")
    public ResponseEntity<ApiResponse<PageResponse<CmsDeployHistoryResponse>>> findHistoryList(
            @ModelAttribute CmsDeployHistoryRequest req,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "20") int size) {

        PageRequest pageRequest =
                PageRequest.builder().page(Math.max(0, page - 1)).size(size).build();

        return ResponseEntity.ok(ApiResponse.success(cmsDeployService.findHistoryList(req, pageRequest)));
    }

    /** 배포 실행 (CMS:W) */
    @PostMapping("/api/cms-admin/deployments/push")
    @PreAuthorize("hasAuthority('CMS:W')")
    public ResponseEntity<ApiResponse<Void>> push(
            @Valid @RequestBody CmsDeployPushRequest req, @AuthenticationPrincipal CustomUserDetails userDetails) {

        cmsDeployService.push(req.getPageId(), userDetails.getUserId());
        return ResponseEntity.ok(ApiResponse.success("배포가 완료되었습니다.", null));
    }
}
