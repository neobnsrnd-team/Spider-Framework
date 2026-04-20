package com.example.admin_demo.domain.cmsdeployment.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * CMS 배포 설정
 *
 * <p>application.yml의 cms.deploy 섹션에서 설정값을 읽어옵니다.</p>
 */
@Component
@ConfigurationProperties(prefix = "cms.deploy")
@Getter
@Setter
public class CmsDeployProperties {

    /** 배포 receive 엔드포인트 URL */
    private String receiveUrl;

    /** 배포 인증 토큰 (x-deploy-token 헤더) */
    private String secret;

    /** cms-tracker.js 취득 URL */
    private String trackerJsUrl;
}
