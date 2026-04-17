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

    /** cmsUser 역할 사용자가 이동할 외부 CMS 서버 URL (환경변수 CMS_USER_URL로 오버라이드 가능) */
    @Value("${cms.user-url}")
    private String cmsUserUrl;

    @GetMapping({"/cms", "/cms/"})
    public String redirectCmsRoot(@AuthenticationPrincipal CustomUserDetails userDetails) {
        // cms_admin·ADMIN은 승인 관리 페이지, 그 외(cmsUser)는 외부 CMS 서버로 이동
        String targetPath = isCmsAdmin(userDetails) ? CMS_ADMIN_APPROVALS_PATH : cmsUserUrl;
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
