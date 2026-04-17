package com.example.admin_demo.domain.cmsabtest.controller;

import com.example.admin_demo.domain.cmsabtest.dto.CmsAbGroupResponse;
import com.example.admin_demo.domain.cmsabtest.dto.CmsAbGroupSaveRequest;
import com.example.admin_demo.domain.cmsabtest.dto.CmsAbPromoteRequest;
import com.example.admin_demo.domain.cmsabtest.dto.CmsAbTestDashboardResponse;
import com.example.admin_demo.domain.cmsabtest.dto.CmsAbTestListRequest;
import com.example.admin_demo.domain.cmsabtest.dto.CmsAbWeightUpdateRequest;
import com.example.admin_demo.domain.cmsabtest.service.CmsAbTestService;
import com.example.admin_demo.global.dto.ApiResponse;
import com.example.admin_demo.global.dto.PageRequest;
import com.example.admin_demo.global.security.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class CmsAbTestController {

    private final CmsAbTestService cmsAbTestService;

    @GetMapping("/api/cms-admin/ab-tests")
    @PreAuthorize("hasAuthority('CMS:R')")
    public ResponseEntity<ApiResponse<CmsAbTestDashboardResponse>> findDashboard(
            @ModelAttribute CmsAbTestListRequest req,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageRequest pageRequest =
                PageRequest.builder().page(Math.max(0, page - 1)).size(size).build();
        return ResponseEntity.ok(ApiResponse.success(cmsAbTestService.findDashboard(req, pageRequest)));
    }

    @GetMapping("/api/cms-admin/ab-tests/{groupId}")
    @PreAuthorize("hasAuthority('CMS:R')")
    public ResponseEntity<ApiResponse<CmsAbGroupResponse>> findGroup(@PathVariable String groupId) {
        return ResponseEntity.ok(ApiResponse.success(cmsAbTestService.findGroup(groupId)));
    }

    @PostMapping("/api/cms-admin/ab-tests")
    @PreAuthorize("hasAuthority('CMS:W')")
    public ResponseEntity<ApiResponse<Void>> saveGroup(
            @RequestBody CmsAbGroupSaveRequest req, @AuthenticationPrincipal CustomUserDetails userDetails) {
        cmsAbTestService.saveGroup(req, userDetails.getUserId());
        return ResponseEntity.ok(ApiResponse.success("A/B group saved.", null));
    }

    @PatchMapping("/api/cms-admin/ab-tests/{groupId}/weights")
    @PreAuthorize("hasAuthority('CMS:W')")
    public ResponseEntity<ApiResponse<Void>> updateWeights(
            @PathVariable String groupId,
            @RequestBody CmsAbWeightUpdateRequest req,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        cmsAbTestService.updateWeights(groupId, req, userDetails.getUserId());
        return ResponseEntity.ok(ApiResponse.success("A/B weights updated.", null));
    }

    @PostMapping("/api/cms-admin/ab-tests/{groupId}/promote")
    @PreAuthorize("hasAuthority('CMS:W')")
    public ResponseEntity<ApiResponse<Void>> promote(
            @PathVariable String groupId,
            @RequestBody CmsAbPromoteRequest req,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        cmsAbTestService.promote(groupId, req.getWinnerPageId(), userDetails.getUserId());
        return ResponseEntity.ok(ApiResponse.success("A/B winner promoted.", null));
    }

    @DeleteMapping(value = "/api/cms-admin/ab-tests", params = "groupId")
    @PreAuthorize("hasAuthority('CMS:W')")
    public ResponseEntity<ApiResponse<Void>> clearGroup(
            @RequestParam String groupId, @AuthenticationPrincipal CustomUserDetails userDetails) {
        cmsAbTestService.clearGroup(groupId, userDetails.getUserId());
        return ResponseEntity.ok(ApiResponse.success("A/B group cleared.", null));
    }

    @DeleteMapping(value = "/api/cms-admin/ab-tests", params = "pageId")
    @PreAuthorize("hasAuthority('CMS:W')")
    public ResponseEntity<ApiResponse<Void>> clearPage(
            @RequestParam String pageId, @AuthenticationPrincipal CustomUserDetails userDetails) {
        cmsAbTestService.clearPage(pageId, userDetails.getUserId());
        return ResponseEntity.ok(ApiResponse.success("A/B page cleared.", null));
    }
}
