package com.example.admin_demo.global.page.controller;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.redirectedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.admin_demo.domain.user.enums.UserState;
import com.example.admin_demo.global.security.CustomUserDetails;
import com.example.admin_demo.global.security.dto.AuthenticatedUser;
import java.util.Set;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(CmsRedirectController.class)
@TestPropertySource(properties = "cms.app-base-url=http://localhost:3000/cms")
@DisplayName("CMS root redirect")
class CmsRedirectControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("cms_admin role redirects /cms to /cms-admin/approvals")
    void cmsRoot_cmsAdminRole_redirectsApprovals() throws Exception {
        mockMvc.perform(get("/cms").with(user(userDetails("admin", "cms_admin", "CMS:W"))))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/cms-admin/approvals"));
    }

    @Test
    @DisplayName("ADMIN role redirects /cms to /cms-admin/approvals")
    void cmsRoot_adminRole_redirectsApprovals() throws Exception {
        mockMvc.perform(get("/cms").with(user(userDetails("admin", "ADMIN", "CMS:W"))))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/cms-admin/approvals"));
    }

    @Test
    @DisplayName("cms_user role redirects /cms to configured CMS dashboard")
    void cmsRoot_cmsUserRole_redirectsDashboard() throws Exception {
        mockMvc.perform(get("/cms").with(user(userDetails("worker", "cms_user", "CMS:R"))))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("http://localhost:3000/cms/dashboard"));
    }

    @Test
    @DisplayName("/cms/ trailing slash follows same role policy")
    void cmsRootSlash_cmsAdminRole_redirectsApprovals() throws Exception {
        mockMvc.perform(get("/cms/").with(user(userDetails("admin", "cms_admin", "CMS:W"))))
                .andExpect(status().is3xxRedirection())
                .andExpect(redirectedUrl("/cms-admin/approvals"));
    }

    @Test
    @DisplayName("/cms requires authentication")
    void cmsRoot_unauthenticated_returnsUnauthorized() throws Exception {
        mockMvc.perform(get("/cms")).andExpect(status().isUnauthorized());
    }

    private CustomUserDetails userDetails(String userId, String roleId, String authority) {
        return new CustomUserDetails(
                new AuthenticatedUser(userId, userId, roleId, "{noop}password", UserState.NORMAL),
                Set.of(new SimpleGrantedAuthority(authority)));
    }
}
