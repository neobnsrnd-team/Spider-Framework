package com.example.admin_demo.domain.cmsasset.controller;

import com.example.admin_demo.domain.cmsasset.dto.CmsAssetApprovalListRequest;
import com.example.admin_demo.domain.cmsasset.dto.CmsAssetDetailResponse;
import com.example.admin_demo.domain.cmsasset.dto.CmsAssetListResponse;
import com.example.admin_demo.domain.cmsasset.dto.CmsAssetRejectRequest;
import com.example.admin_demo.domain.cmsasset.dto.CmsAssetUploadResponse;
import com.example.admin_demo.domain.cmsasset.dto.CmsAssetVisibilityUpdateRequest;
import com.example.admin_demo.domain.cmsasset.service.CmsAssetService;
import com.example.admin_demo.global.dto.ApiResponse;
import com.example.admin_demo.global.dto.PageRequest;
import com.example.admin_demo.global.dto.PageResponse;
import com.example.admin_demo.global.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
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
import org.springframework.web.multipart.MultipartFile;

@Slf4j
@RestController
@RequiredArgsConstructor
public class CmsAssetApprovalController {

    private final CmsAssetService cmsAssetService;

    @GetMapping("/api/cms-admin/asset-approvals")
    @PreAuthorize("hasAuthority('CMS:R')")
    public ResponseEntity<ApiResponse<PageResponse<CmsAssetListResponse>>> findApprovalList(
            @ModelAttribute CmsAssetApprovalListRequest req,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {

        PageRequest pageRequest = PageRequest.builder().page(Math.max(0, page - 1)).size(size).build();
        return ResponseEntity.ok(ApiResponse.success(cmsAssetService.findApprovalList(req, pageRequest)));
    }

    @GetMapping("/api/cms-admin/asset-approvals/{assetId}")
    @PreAuthorize("hasAuthority('CMS:R')")
    public ResponseEntity<ApiResponse<CmsAssetDetailResponse>> findDetail(@PathVariable String assetId) {
        return ResponseEntity.ok(ApiResponse.success(cmsAssetService.findById(assetId)));
    }

    @PostMapping("/api/cms-admin/asset-approvals/{assetId}/approve")
    @PreAuthorize("hasAuthority('CMS:W')")
    public ResponseEntity<ApiResponse<Void>> approve(
            @PathVariable String assetId, @AuthenticationPrincipal CustomUserDetails userDetails) {

        cmsAssetService.approve(assetId, userDetails.getUserId(), userDetails.getDisplayName());
        return ResponseEntity.ok(ApiResponse.success("승인이 완료되었습니다.", null));
    }

    @PostMapping("/api/cms-admin/asset-approvals/{assetId}/reject")
    @PreAuthorize("hasAuthority('CMS:W')")
    public ResponseEntity<ApiResponse<Void>> reject(
            @PathVariable String assetId,
            @RequestBody CmsAssetRejectRequest req,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        cmsAssetService.reject(assetId, req.getRejectedReason(), userDetails.getUserId(), userDetails.getDisplayName());
        return ResponseEntity.ok(ApiResponse.success("반려가 완료되었습니다.", null));
    }

    @PostMapping("/api/cms-admin/asset-approvals/{assetId}/visibility")
    @PreAuthorize("hasAuthority('CMS:W')")
    public ResponseEntity<ApiResponse<Void>> updateVisibility(
            @PathVariable String assetId,
            @RequestBody CmsAssetVisibilityUpdateRequest req,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        cmsAssetService.updateVisibility(assetId, req.getUseYn(), userDetails.getUserId(), userDetails.getDisplayName());
        return ResponseEntity.ok(ApiResponse.success("노출 여부가 변경되었습니다.", null));
    }

    @PostMapping(value = "/api/cms-admin/asset-approvals/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAuthority('CMS:W')")
    public ResponseEntity<ApiResponse<CmsAssetUploadResponse>> uploadApproved(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "businessCategory", required = false) String businessCategory,
            @RequestParam(value = "assetDesc", required = false) String assetDesc,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        CmsAssetUploadResponse response = cmsAssetService.uploadApprovedAsset(
                file, businessCategory, assetDesc, userDetails.getUserId(), userDetails.getDisplayName());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("관리자 이미지 업로드가 완료되었습니다.", response));
    }
}
