/**
 * @file ReactDeployProperties.java
 * @description React 코드 배포 파일 경로 설정.
 *     승인(approve) 시 생성된 .tsx 파일을 저장할 디렉토리 경로를 바인딩한다.
 *
 * <pre>{@code
 * deploy:
 *   react:
 *     output-dir: ../demo/front/src/generated
 * }</pre>
 */
package com.example.admin_demo.domain.reactgenerate.service;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * application.yml {@code deploy.react.*} 설정을 바인딩하는 프로퍼티 클래스.
 *
 * <p>승인 시 생성된 React 컴포넌트 파일({@code {codeId}.tsx})을 저장할 디렉토리를 지정한다.
 * 파일은 {@code {outputDir}/{codeId}.tsx} 경로에 기록되며, Vite HMR이 변경을 감지한다.
 */
@Component
@ConfigurationProperties(prefix = "deploy.react")
@Getter
@Setter
public class ReactDeployProperties {

    /**
     * React 컴포넌트 파일을 저장할 디렉토리 경로.
     * 절대 경로 또는 {@code user.dir}(admin 프로젝트 루트) 기준 상대 경로.
     * 기본값: {@code ../demo/front/src/generated}
     */
    private String outputDir;
}
