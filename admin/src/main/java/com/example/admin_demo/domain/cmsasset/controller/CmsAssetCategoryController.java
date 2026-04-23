package com.example.admin_demo.domain.cmsasset.controller;

import com.example.admin_demo.domain.cmsasset.service.CmsAssetService;
import com.example.admin_demo.domain.code.dto.CodeResponse;
import com.example.admin_demo.global.dto.ApiResponse;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class CmsAssetCategoryController {

    private final CmsAssetService cmsAssetService;

    @GetMapping("/api/cms-admin/asset-categories")
    @PreAuthorize("hasAuthority('CMS:R')")
    public ResponseEntity<ApiResponse<List<CodeResponse>>> getAssetCategories() {
        return ResponseEntity.ok(ApiResponse.success(cmsAssetService.getAssetCategoryCodes()));
    }
}
