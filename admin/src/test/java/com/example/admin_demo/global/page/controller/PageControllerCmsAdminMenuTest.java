package com.example.admin_demo.global.page.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.view;

import com.example.admin_demo.domain.board.service.BoardService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(PageController.class)
@DisplayName("PageController - CMS 관리 라우트 테스트")
class PageControllerCmsAdminMenuTest {

    // 아직 스켈레톤으로 남아 있는 경로
    private static final String[] CMS_ADMIN_SKELETON_PATHS = {"/cms-admin/components"};

    @TestConfiguration
    @EnableMethodSecurity
    static class TestSecurityConfig {}

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private BoardService boardService;

    @Test
    @WithMockUser
    @DisplayName("[라우팅] CMS pages/files 관리 경로는 승인 관리로 리다이렉트해야 한다")
    void cmsAdminDisabledRoutes_redirectApprovals() throws Exception {
        mockMvc.perform(get("/cms-admin/pages"))
                .andExpect(status().is3xxRedirection())
                .andExpect(view().name("redirect:/cms-admin/approvals"));

        mockMvc.perform(get("/cms-admin/files"))
                .andExpect(status().is3xxRedirection())
                .andExpect(view().name("redirect:/cms-admin/approvals"));
    }

    @Test
    @WithMockUser
    @DisplayName("[라우트] CMS 관리 일반 요청 시 home 뷰를 반환해야 한다")
    void cmsAdmin_normalRequest_returnsHome() throws Exception {
        for (String path : CMS_ADMIN_SKELETON_PATHS) {
            mockMvc.perform(get(path)).andExpect(status().isOk()).andExpect(view().name("home"));
        }
    }

    @Test
    @WithMockUser
    @DisplayName("[라우트] CMS 관리(스켈레톤) 탭 요청 시 skeleton content fragment를 반환해야 한다")
    void cmsAdmin_tabRequest_returnsSkeletonFragment() throws Exception {
        for (String path : CMS_ADMIN_SKELETON_PATHS) {
            mockMvc.perform(get(path).header("X-Tab-Request", "true"))
                    .andExpect(status().isOk())
                    .andExpect(view().name("pages/cms-admin-skeleton/cms-admin-skeleton :: content"));
        }
    }

    @Test
    @WithMockUser
    @DisplayName("[라우트] CMS 통계 탭 요청 시 cms-statistics content fragment를 반환해야 한다")
    void cmsAdminStatistics_tabRequest_returnsStatisticsFragment() throws Exception {
        mockMvc.perform(get("/cms-admin/statistics").header("X-Tab-Request", "true"))
                .andExpect(status().isOk())
                .andExpect(view().name("pages/cms-statistics/cms-statistics :: content"));
    }

    @Test
    @WithMockUser
    @DisplayName("[라우트] CMS 배포 관리 탭 요청 시 cms-deployment content fragment를 반환해야 한다")
    void cmsAdminDeployments_tabRequest_returnsDeploymentFragment() throws Exception {
        mockMvc.perform(get("/cms-admin/deployments").header("X-Tab-Request", "true"))
                .andExpect(status().isOk())
                .andExpect(view().name("pages/cms-deployment/cms-deployment :: content"));
    }

    @Test
    @WithMockUser
    @DisplayName("[라우팅] CMS A/B 관리 탭 요청은 cms-ab-test content fragment를 반환해야 한다")
    void cmsAdminAbTests_tabRequest_returnsAbTestFragment() throws Exception {
        mockMvc.perform(get("/cms-admin/ab-tests").header("X-Tab-Request", "true"))
                .andExpect(status().isOk())
                .andExpect(view().name("pages/cms-ab-test/cms-ab-test :: content"));
    }

    @Test
    @WithMockUser
    @DisplayName("[라우트] CMS 승인 관리 탭 요청 시 cms-approval content fragment를 반환해야 한다")
    void cmsAdminApprovals_tabRequest_returnsApprovalFragment() throws Exception {
        mockMvc.perform(get("/cms-admin/approvals").header("X-Tab-Request", "true"))
                .andExpect(status().isOk())
                .andExpect(view().name("pages/cms-approval/cms-approval :: content"));
    }

    @Test
    @WithMockUser
    @DisplayName("[라우트] CMS 승인 관리 일반 요청 시 home 뷰를 반환해야 한다")
    void cmsAdminApprovals_normalRequest_returnsHome() throws Exception {
        mockMvc.perform(get("/cms-admin/approvals")).andExpect(status().isOk()).andExpect(view().name("home"));
    }

    @Test
    @DisplayName("[인증] 비인증 사용자의 CMS 관리 요청은 인증 오류를 반환해야 한다")
    void cmsAdmin_unauthenticated_returnsUnauthorized() throws Exception {
        mockMvc.perform(get("/cms-admin/approvals")).andExpect(status().is4xxClientError());
    }
}
