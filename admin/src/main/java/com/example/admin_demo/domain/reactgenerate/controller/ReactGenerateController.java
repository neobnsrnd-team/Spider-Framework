package com.example.admin_demo.domain.reactgenerate.controller;

import com.example.admin_demo.domain.reactgenerate.dto.ReactGenerateApprovalResponse;
import com.example.admin_demo.domain.reactgenerate.dto.ReactGenerateRequest;
import com.example.admin_demo.domain.reactgenerate.dto.ReactGenerateResponse;
import com.example.admin_demo.domain.reactgenerate.service.ReactGenerateService;
import com.example.admin_demo.global.dto.ApiResponse;
import com.example.admin_demo.global.util.SecurityUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/react-generate")
@RequiredArgsConstructor
@PreAuthorize("hasAuthority('REACT_GENERATE:R')")
public class ReactGenerateController {

    private final ReactGenerateService reactGenerateService;

    @PostMapping("/generate")
    @PreAuthorize("hasAuthority('REACT_GENERATE:W')")
    public ResponseEntity<ApiResponse<ReactGenerateResponse>> generate(
            @Valid @RequestBody ReactGenerateRequest request) {
        return ResponseEntity.ok(ApiResponse.success(reactGenerateService.generate(request)));
    }

    @PostMapping("/{id}/request-approval")
    @PreAuthorize("hasAuthority('REACT_GENERATE:W')")
    public ResponseEntity<ApiResponse<ReactGenerateApprovalResponse>> requestApproval(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success(reactGenerateService.requestApproval(id)));
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasAuthority('REACT_GENERATE:W')")
    public ResponseEntity<ApiResponse<ReactGenerateApprovalResponse>> approve(@PathVariable String id) {
        String currentUserId = SecurityUtil.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(reactGenerateService.approve(id, currentUserId)));
    }
}
