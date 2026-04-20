package com.example.admin_demo.domain.cmsdashboard.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * CMS 새 페이지 생성 요청 DTO
 */
@Getter
@Setter
@NoArgsConstructor
public class CmsDashboardCreateRequest {

    /** 페이지명 */
    private String pageName;

    /** 뷰 모드 (PC / mobile) */
    private String viewMode;
}
