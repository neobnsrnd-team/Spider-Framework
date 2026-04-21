package com.example.admin_demo.domain.reactcmsadminapproval.controller;

import com.example.admin_demo.domain.reactcmsadminapproval.dto.ReactCmsAdminApprovalListRequest;
import com.example.admin_demo.domain.reactcmsadminapproval.dto.ReactCmsAdminApprovalListResponse;
import com.example.admin_demo.domain.reactcmsadminapproval.service.ReactCmsAdminApprovalService;
import com.example.admin_demo.global.dto.ApiResponse;
import com.example.admin_demo.global.dto.PageRequest;
import com.example.admin_demo.global.dto.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * React CMS Admin 승인 관리 API 컨트롤러
 *
 * <p>API 엔드포인트:
 * <ul>
 *   <li>GET /api/react-cms-admin/approval — 승인 관리 목록 조회</li>
 * </ul>
 */
@RestController
@RequiredArgsConstructor
public class ReactCmsAdminApprovalController {

    private final ReactCmsAdminApprovalService reactCmsAdminApprovalService;

    /** 승인 관리 목록 조회 (REACT_CMS:R) */
    @GetMapping("/api/react-cms-admin/approval")
    @PreAuthorize("hasAuthority('REACT_CMS:R')")
    public ResponseEntity<ApiResponse<PageResponse<ReactCmsAdminApprovalListResponse>>> findPageList(
            @ModelAttribute ReactCmsAdminApprovalListRequest req,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {

        PageRequest pageRequest =
                PageRequest.builder().page(Math.max(0, page - 1)).size(size).build();

        return ResponseEntity.ok(ApiResponse.success(reactCmsAdminApprovalService.findPageList(req, pageRequest)));
    }
}
