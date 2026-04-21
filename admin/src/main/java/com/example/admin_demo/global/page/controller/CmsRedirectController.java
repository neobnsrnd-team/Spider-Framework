package com.example.admin_demo.global.page.controller;

import com.example.admin_demo.global.security.CustomUserDetails;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class CmsRedirectController {

    private static final String ADMIN_ROLE = "ADMIN";
    private static final String CMS_ADMIN_ROLE = "cms_admin";
    private static final String CMS_ADMIN_APPROVALS_PATH = "/cms-admin/approvals";
    private static final String CMS_DASHBOARD_PATH = "/dashboard";

    /** 탭 시스템 AJAX 요청 식별 헤더 */
    private static final String TAB_REQUEST_HEADER = "X-Tab-Request";
    private static final String TAB_REQUEST_VALUE = "true";

    @Value("${cms.app-base-url:/cms}")
    private String cmsAppBaseUrl;

    @Value("${cms.user-url:}")
    private String cmsUserUrl;

    @GetMapping("/cms/user-dashboard")
    public String redirectCmsRoot(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            HttpServletRequest request,
            Model model) {

        if (isCmsAdmin(userDetails)) {
            // 관리자 — 동일 출처 내부 경로이므로 서버 사이드 redirect 사용
            return "redirect:" + CMS_ADMIN_APPROVALS_PATH;
        }

        String targetUrl = cmsUserRedirectUrl();

        if (TAB_REQUEST_VALUE.equals(request.getHeader(TAB_REQUEST_HEADER))) {
            // 탭 시스템 AJAX 요청: 외부 URL로 서버 사이드 redirect 시 CORS 차단 문제 발생
            // window.top.location.href 로 브라우저 전체 화면을 외부 URL로 이동시킨다.
            model.addAttribute("cmsUserUrl", targetUrl);
            return "cms-user-redirect";
        }

        // 직접 브라우저 접근 (북마크, 주소창 입력 등)
        return "redirect:" + targetUrl;
    }

    private String cmsUserRedirectUrl() {
        if (cmsUserUrl != null && !cmsUserUrl.isBlank()) {
            return cmsUserUrl.trim();
        }
        String baseUrl = (cmsAppBaseUrl == null || cmsAppBaseUrl.isBlank()) ? "/cms" : cmsAppBaseUrl.trim();
        return baseUrl.replaceAll("/+$", "") + CMS_DASHBOARD_PATH;
    }

    private boolean isCmsAdmin(CustomUserDetails userDetails) {
        if (userDetails == null) {
            return false;
        }
        String roleId = userDetails.getRoleId();
        return ADMIN_ROLE.equals(roleId) || CMS_ADMIN_ROLE.equals(roleId);
    }
}
