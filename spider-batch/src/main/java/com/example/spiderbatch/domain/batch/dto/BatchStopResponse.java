package com.example.spiderbatch.domain.batch.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @file BatchStopResponse.java
 * @description 배치 Job 강제 종료 요청 응답 DTO.
 *              jobExecutionId와 처리 결과 메시지를 반환한다.
 * @returns POST /api/batch/stop/{jobExecutionId} 응답
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BatchStopResponse {

    /** 강제 종료를 요청한 Spring Batch JOB_EXECUTION_ID */
    private Long jobExecutionId;

    /** 처리 결과 메시지 (성공/이미종료 여부 등) */
    private String message;
}
