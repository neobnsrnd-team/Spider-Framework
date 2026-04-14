package com.example.admin_demo.domain.reactgenerate.controller;

import com.example.admin_demo.domain.reactgenerate.dto.ReactGenerateApprovalResponse;
import com.example.admin_demo.domain.reactgenerate.dto.ReactGenerateRequest;
import com.example.admin_demo.domain.reactgenerate.dto.ReactGenerateResponse;
import com.example.admin_demo.domain.reactgenerate.dto.RenderErrorRequest;
import com.example.admin_demo.domain.reactgenerate.service.ReactGenerateService;
import com.example.admin_demo.global.dto.ApiResponse;
import com.example.admin_demo.global.util.SecurityUtil;
import jakarta.servlet.http.HttpServletRequest;
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
        String currentUserId = SecurityUtil.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.success(reactGenerateService.generate(request, currentUserId)));
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

    /**
     * Preview App(iframe)에서 발생한 렌더링 오류를 수신하여 오류 이력에 기록한다.
     *
     * <p>렌더링 오류는 브라우저 side에서 소멸하므로 클라이언트가 명시적으로 전송해야 한다.
     * fire-and-forget 방식으로 호출되며, 항상 200을 반환한다.
     */
    @PostMapping("/render-error")
    public ResponseEntity<Void> logRenderError(
            @RequestBody RenderErrorRequest request, HttpServletRequest httpRequest) {
        reactGenerateService.logRenderError(
                request.getErrorMessage(), SecurityUtil.getCurrentUserIdOrAnonymous(), httpRequest.getRequestURI());
        return ResponseEntity.ok().build();
    }
}
