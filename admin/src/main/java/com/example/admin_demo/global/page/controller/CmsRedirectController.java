package com.example.admin_demo.global.page.controller;

import com.example.admin_demo.global.security.CustomUserDetails;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class CmsRedirectController {

    private static final String ADMIN_ROLE = "ADMIN";
    private static final String CMS_ADMIN_ROLE = "cms_admin";
    private static final String CMS_ADMIN_APPROVALS_PATH = "/cms-admin/approvals";
    private static final String CMS_DASHBOARD_PATH = "/cms/dashboard";

    @GetMapping({"/cms", "/cms/"})
    public String redirectCmsRoot(@AuthenticationPrincipal CustomUserDetails userDetails) {
        String targetPath = isCmsAdmin(userDetails) ? CMS_ADMIN_APPROVALS_PATH : CMS_DASHBOARD_PATH;
        return "redirect:" + targetPath;
    }

    private boolean isCmsAdmin(CustomUserDetails userDetails) {
        if (userDetails == null) {
            return false;
        }
        String roleId = userDetails.getRoleId();
        return ADMIN_ROLE.equals(roleId) || CMS_ADMIN_ROLE.equals(roleId);
    }
}
