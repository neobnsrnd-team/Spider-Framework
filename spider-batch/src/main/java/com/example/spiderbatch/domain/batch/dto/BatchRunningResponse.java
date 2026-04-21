package com.example.spiderbatch.domain.batch.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @file BatchRunningResponse.java
 * @description 현재 실행 중인 배치 Job 정보 응답 DTO.
 *              Spring Batch의 JobExplorer로 조회한 STARTED 상태의 JobExecution 정보와
 *              FWK_BATCH_APP에서 보강한 배치 이름·CRON 표현식을 함께 반환한다.
 * @returns GET /api/batch/running 응답 목록의 개별 항목
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BatchRunningResponse {

    /** Spring Batch BATCH_JOB_EXECUTION.JOB_EXECUTION_ID */
    private Long jobExecutionId;

    /** FWK_BATCH_APP.BATCH_APP_ID (JobParameters에서 추출, 직접 실행 시 "UNKNOWN") */
    private String batchAppId;

    /** FWK_BATCH_APP.BATCH_APP_NAME */
    private String batchAppName;

    /** Spring Batch BATCH_JOB_INSTANCE.JOB_NAME (= Job Bean 이름) */
    private String batchAppFileName;

    /** FWK_BATCH_APP.CRON_TEXT — CRON 표현식 (스케줄 미등록 시 null) */
    private String cronText;

    /** 배치 기준일 (JobParameters에서 추출, yyyyMMdd 형식) */
    private String batchDate;

    /** Job 시작 일시 (yyyy-MM-dd HH:mm:ss 포맷) */
    private String startTime;

    /** 실행 상태 (BatchStatus.name() — "STARTED", "STARTING" 등) */
    private String status;

    /**
     * 이 응답을 생성한 WAS 인스턴스 ID (application.yml batch.was.instance-id).
     * Admin이 동일 IP를 공유하는 인스턴스들 사이에서 데이터 출처를 식별하는 데 사용한다.
     */
    private String instanceId;
}
