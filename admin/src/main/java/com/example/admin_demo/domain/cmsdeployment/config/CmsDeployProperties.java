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

    /** CMS push 엔드포인트 URL — HTML 조립·파일 저장·이력 기록을 CMS가 담당 */
    private String pushUrl;

    /** 배포 인증 토큰 (x-deploy-token 헤더) */
    private String secret;
}
