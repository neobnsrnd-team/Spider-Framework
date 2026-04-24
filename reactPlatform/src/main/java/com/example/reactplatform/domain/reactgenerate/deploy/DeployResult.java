/**
 * @file DeployResult.java
 * @description 배포 전략 실행 결과를 담는 값 객체.
 *     {@link ReactDeployStrategy#deploy}의 반환값으로 사용되며,
 *     {@code ReactDeployService}가 이 결과를 {@code FWK_REACT_DEPLOY_HIS}에 기록한다.
 */
package com.example.reactplatform.domain.reactgenerate.deploy;

import lombok.Getter;

@Getter
public class DeployResult {

    /** 배포 성공 여부. */
    private final boolean success;

    /**
     * git-pr 모드에서 생성된 PR URL.
     * local 모드이거나 실패한 경우 null.
     */
    private final String prUrl;

    /** 배포 실패 시 오류 메시지. 성공한 경우 null. */
    private final String failReason;

    private DeployResult(boolean success, String prUrl, String failReason) {
        this.success = success;
        this.prUrl = prUrl;
        this.failReason = failReason;
    }

    /**
     * 배포 성공 결과를 생성한다.
     *
     * @param prUrl git-pr 모드에서 생성된 PR URL (local 모드는 null)
     */
    public static DeployResult success(String prUrl) {
        return new DeployResult(true, prUrl, null);
    }

    /**
     * 배포 실패 결과를 생성한다.
     *
     * @param failReason 실패 사유 메시지
     */
    public static DeployResult failure(String failReason) {
        return new DeployResult(false, null, failReason);
    }

    /** DB 저장용 상태 문자열. */
    public String getStatus() {
        return success ? "SUCCESS" : "FAILED";
    }
}
