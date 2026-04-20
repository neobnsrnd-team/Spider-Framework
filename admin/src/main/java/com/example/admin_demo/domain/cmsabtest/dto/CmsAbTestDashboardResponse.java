package com.example.admin_demo.domain.cmsabtest.dto;

import com.example.admin_demo.global.dto.PageResponse;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CmsAbTestDashboardResponse {

    private PageResponse<CmsAbPageResponse> pages;
    private List<CmsAbPageResponse> availablePages;
    private List<CmsAbGroupResponse> groups;
}
