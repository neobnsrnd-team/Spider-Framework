/**
 * @file ReactDeployProperties.java
 * @description application.yml의 {@code react.deploy.*} 설정을 바인딩하는 프로퍼티 클래스.
 *     {@code mode} 값에 따라 로컬 파일 기록(local) 또는 GitHub PR 자동 생성(git-pr) 전략이 선택된다.
 *
 * <pre>{@code
 * react:
 *   deploy:
 *     mode: local                      # local | git-pr
 *     local:
 *       component-dir: ../demo/front/src/generated
 *       container-dir: ../demo/front/src/containers
 *     git-pr:
 *       token: ${GITHUB_TOKEN}
 *       owner: ${GITHUB_REPO_OWNER}
 *       repo: ${GITHUB_REPO_NAME}
 *       base-branch: main
 *       component-path: src/generated
 *       container-path: src/containers
 * }</pre>
 */
package com.example.reactplatform.domain.reactgenerate.deploy;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "react.deploy")
@Getter
@Setter
public class ReactDeployProperties {

    /**
     * 배포 전략 모드.
     * <ul>
     *   <li>{@code local} — 서버 로컬 파일시스템에 기록</li>
     *   <li>{@code git-pr} — GitHub 레포에 PR 자동 생성</li>
     * </ul>
     */
    private String mode = "local";

    /** local 모드 설정 */
    private Local local = new Local();

    /** git-pr 모드 설정 */
    private GitPr gitPr = new GitPr();

    @Getter
    @Setter
    public static class Local {

        /** UI 컴포넌트({codeId}.tsx)를 저장할 디렉토리 경로 */
        private String componentDir;

        /** Container scaffold({ComponentName}Container.tsx)를 저장할 디렉토리 경로 */
        private String containerDir;
    }

    @Getter
    @Setter
    public static class GitPr {

        /** GitHub Personal Access Token 또는 App Token. 반드시 환경변수로 주입 */
        private String token;

        /** 대상 레포 소유자 (조직명 또는 유저명) */
        private String owner;

        /** 대상 레포 이름 */
        private String repo;

        /** PR의 merge 대상 브랜치 (기본값: main) */
        private String baseBranch = "main";

        /** 레포 내 UI 컴포넌트 파일 저장 경로 (예: src/generated) */
        private String componentPath = "src/generated";

        /** 레포 내 Container scaffold 파일 저장 경로 (예: src/containers) */
        private String containerPath = "src/containers";
    }
}
