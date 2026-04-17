package com.example.admin_demo.global.page.controller;

import com.example.admin_demo.global.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class CmsRedirectController {

    private static final String ADMIN_ROLE = "ADMIN";
    private static final String CMS_ADMIN_ROLE = "cms_admin";
    private static final String CMS_ADMIN_APPROVALS_PATH = "/cms-admin/approvals";
    private static final String CMS_DASHBOARD_PATH = "/dashboard";

    @Value("${cms.app-base-url:/cms}")
    private String cmsAppBaseUrl;

    @GetMapping({"/cms", "/cms/"})
    public String redirectCmsRoot(@AuthenticationPrincipal CustomUserDetails userDetails) {
        if (isCmsAdmin(userDetails)) {
            return "redirect:" + CMS_ADMIN_APPROVALS_PATH;
        }

        return "redirect:" + cmsDashboardUrl();
    }

    private String cmsDashboardUrl() {
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
