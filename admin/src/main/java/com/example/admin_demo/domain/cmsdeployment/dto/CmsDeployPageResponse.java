package com.example.admin_demo.domain.cmsdeployment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * CMS 배포 대상 페이지 응답 DTO (SPW_CMS_PAGE APPROVE_STATE='APPROVED')
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CmsDeployPageResponse {

    /** 페이지 ID */
    private String pageId;

    /** 페이지명 */
    private String pageName;

    /** 작성자명 */
    private String createUserName;

    /** 최근 배포된 파일 URL (배포 이력 없으면 null) */
    private String deployedUrl;
}
