/**
 * @file ReactRedeployResponse.java
 * @description 재배포 실행 응답 DTO.
 */
package com.example.reactplatform.domain.reactdeploy.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReactRedeployResponse {

    private boolean success;
    private String message;

    /** PR URL — git-pr 모드에서만 포함, local 모드는 null */
    private String prUrl;
}
