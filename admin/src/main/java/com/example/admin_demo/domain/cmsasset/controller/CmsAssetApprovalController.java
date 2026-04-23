package com.example.admin_demo.domain.cmsasset.controller;

import com.example.admin_demo.domain.cmsasset.client.CmsBuilderClient;
import com.example.admin_demo.domain.cmsasset.dto.CmsAssetApprovalListRequest;
import com.example.admin_demo.domain.cmsasset.dto.CmsAssetDetailResponse;
import com.example.admin_demo.domain.cmsasset.dto.CmsAssetListResponse;
import com.example.admin_demo.domain.cmsasset.dto.CmsAssetRejectRequest;
import com.example.admin_demo.domain.cmsasset.service.CmsAssetService;
import com.example.admin_demo.global.dto.ApiResponse;
import com.example.admin_demo.global.dto.PageRequest;
import com.example.admin_demo.global.dto.PageResponse;
import com.example.admin_demo.global.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * 결재자용 — 이미지 승인 관리 API 컨트롤러.
 *
 * <h4>API 엔드포인트:</h4>
 * <ul>
 *   <li>GET  /api/cms-admin/asset-approvals                        — PENDING 기본 필터 목록</li>
 *   <li>GET  /api/cms-admin/asset-approvals/{assetId}              — 모달 프리뷰용 상세</li>
 *   <li>GET  /api/cms-admin/asset-approvals/{assetId}/image        — CMS 이미지 프록시 (썸네일·미리보기)</li>
 *   <li>POST /api/cms-admin/asset-approvals/{assetId}/approve      — PENDING → APPROVED</li>
 *   <li>POST /api/cms-admin/asset-approvals/{assetId}/reject       — PENDING → REJECTED + 반려 사유(선택)</li>
 * </ul>
 */
@Slf4j
@RestController
@RequiredArgsConstructor
public class CmsAssetApprovalController {

    private final CmsAssetService cmsAssetService;
    private final CmsBuilderClient cmsBuilderClient;

    /** 승인 대기 이미지 목록 (기본 PENDING 필터) */
    @GetMapping("/api/cms-admin/asset-approvals")
    @PreAuthorize("hasAuthority('CMS:R')")
    public ResponseEntity<ApiResponse<PageResponse<CmsAssetListResponse>>> findApprovalList(
            @ModelAttribute CmsAssetApprovalListRequest req,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {

        PageRequest pageRequest =
                PageRequest.builder().page(Math.max(0, page - 1)).size(size).build();

        return ResponseEntity.ok(ApiResponse.success(cmsAssetService.findApprovalList(req, pageRequest)));
    }

    /**
     * CMS 이미지 프록시 — 썸네일·미리보기용.
     *
     * <p>CMS의 {@code GET /cms/api/assets/{assetId}/image} 를 중계한다.
     * CMS가 현재 파일 위치로 302 redirect 하므로 미승인·승인 상태와 무관하게 동일 URL로 동작한다.
     * 브라우저에서 직접 CMS를 호출하면 x-deploy-token 인증이 불가하므로 Admin이 중계한다.
     */
    @GetMapping("/api/cms-admin/asset-approvals/{assetId}/image")
    @PreAuthorize("hasAuthority('CMS:R')")
    public ResponseEntity<byte[]> proxyImage(@PathVariable String assetId) {
        ResponseEntity<byte[]> cmsResponse = cmsBuilderClient.fetchImage(assetId);
        byte[] body = cmsResponse.getBody();
        if (body == null || !cmsResponse.getStatusCode().is2xxSuccessful()) {
            return ResponseEntity.notFound().build();
        }
        String contentType = cmsResponse.getHeaders().getFirst(HttpHeaders.CONTENT_TYPE);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(
                        contentType != null ? contentType : MediaType.APPLICATION_OCTET_STREAM_VALUE))
                .body(body);
    }

    /** 이미지 상세 (프리뷰 모달용) */
    @GetMapping("/api/cms-admin/asset-approvals/{assetId}")
    @PreAuthorize("hasAuthority('CMS:R')")
    public ResponseEntity<ApiResponse<CmsAssetDetailResponse>> findDetail(@PathVariable String assetId) {
        return ResponseEntity.ok(ApiResponse.success(cmsAssetService.findById(assetId)));
    }

    /** 승인 확정 — PENDING → APPROVED (CMS 파일 복사 API 연동은 Issue #55) */
    @PostMapping("/api/cms-admin/asset-approvals/{assetId}/approve")
    @PreAuthorize("hasAuthority('CMS:W')")
    public ResponseEntity<ApiResponse<Void>> approve(
            @PathVariable String assetId, @AuthenticationPrincipal CustomUserDetails userDetails) {

        cmsAssetService.approve(assetId, userDetails.getUserId(), userDetails.getDisplayName());
        return ResponseEntity.ok(ApiResponse.success("승인이 완료되었습니다.", null));
    }

    /** 반려 — PENDING → REJECTED */
    @PostMapping("/api/cms-admin/asset-approvals/{assetId}/reject")
    @PreAuthorize("hasAuthority('CMS:W')")
    public ResponseEntity<ApiResponse<Void>> reject(
            @PathVariable String assetId,
            @RequestBody CmsAssetRejectRequest req,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        cmsAssetService.reject(assetId, req.getRejectedReason(), userDetails.getUserId(), userDetails.getDisplayName());
        return ResponseEntity.ok(ApiResponse.success("반려가 완료되었습니다.", null));
    }
}
