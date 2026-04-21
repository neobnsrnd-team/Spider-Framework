package com.example.spiderbatch.domain.batch.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Admin으로부터 수신하는 배치 실행 요청 DTO.
 *
 * <p>Admin의 BatchExecService가 POST /api/batch/execute 로 전송하는 body와 동일한 구조.</p>
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BatchExecuteRequest {

    /** 배치 APP ID (FWK_BATCH_APP.BATCH_APP_ID) */
    @NotBlank(message = "배치 APP ID는 필수입니다")
    private String batchAppId;

    /** 배치 기준일 (YYYYMMDD) */
    @NotBlank(message = "기준일은 필수입니다")
    @Pattern(regexp = "^\\d{8}$", message = "기준일은 YYYYMMDD 8자리 숫자여야 합니다")
    private String batchDate;

    /** 실행 요청 사용자 ID */
    private String userId;

    /** 배치 파라미터 (ex: key=value;key2=value2) */
    private String parameters;
}
