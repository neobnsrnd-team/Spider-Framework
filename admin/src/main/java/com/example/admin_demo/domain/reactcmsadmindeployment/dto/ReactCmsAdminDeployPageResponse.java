package com.example.admin_demo.domain.reactcmsadmindeployment.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * React CMS Admin 배포 대상 페이지 응답 DTO
 *
 * <p>SPW_CMS_PAGE (PAGE_TYPE='REACT', APPROVE_STATE='APPROVED') 기반
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReactCmsAdminDeployPageResponse {

    /** 페이지 ID */
    private String pageId;

    /** 페이지명 */
    private String pageName;

    /** 작성자명 */
    private String createUserName;

    /** 최근 배포된 파일 URL (배포 이력 없으면 null) — 서비스 레이어에서 instanceIp/Port + 설정값으로 조합 */
    private String deployedUrl;

    /** 최근 배포 서버 IP (URL 조합용, 배포 이력 없으면 null) */
    private String instanceIp;

    /** 최근 배포 서버 포트 (URL 조합용, 배포 이력 없으면 null) */
    private Integer instancePort;
}
