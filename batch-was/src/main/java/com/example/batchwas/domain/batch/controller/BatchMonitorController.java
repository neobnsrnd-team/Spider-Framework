package com.example.batchwas.domain.batch.controller;

import com.example.batchwas.domain.batch.dto.BatchRunningResponse;
import com.example.batchwas.domain.batch.dto.BatchStopResponse;
import com.example.batchwas.domain.batch.service.BatchMonitorService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 실행 중인 배치 조회/강제 종료 Controller.
 *
 * <p>Admin UI 또는 운영자가 현재 실행 중인 배치를 조회하고,
 * 필요 시 강제 종료 요청을 보내는 엔드포인트를 제공한다.</p>
 */
@Slf4j
@RestController
@RequestMapping("/api/batch")
@RequiredArgsConstructor
public class BatchMonitorController {

    private final BatchMonitorService batchMonitorService;

    /**
     * 현재 실행 중인 배치 Job 목록 조회.
     *
     * <p>Spring Batch JobExplorer를 통해 STARTED 상태의 JobExecution을 조회하고
     * FWK_BATCH_APP의 배치 이름·CRON 정보를 포함하여 반환한다.</p>
     *
     * @return 실행 중인 배치 목록 (없으면 빈 배열)
     */
    @GetMapping("/running")
    public ResponseEntity<List<BatchRunningResponse>> getRunningJobs() {
        log.info("GET /api/batch/running - 실행 중인 배치 목록 조회 요청");

        List<BatchRunningResponse> runningJobs = batchMonitorService.getRunningJobs();

        log.info("GET /api/batch/running - 조회 완료: {}건", runningJobs.size());
        return ResponseEntity.ok(runningJobs);
    }

    /**
     * 실행 중인 배치 Job 강제 종료.
     *
     * <p>지정한 jobExecutionId에 해당하는 Job을 강제 종료하고
     * FWK_BATCH_HIS를 ABNORMAL 상태로 UPDATE한다.</p>
     *
     * @param jobExecutionId 종료할 Spring Batch JOB_EXECUTION_ID
     * @return 강제 종료 결과 (jobExecutionId + 메시지)
     */
    @PostMapping("/stop/{jobExecutionId}")
    public ResponseEntity<BatchStopResponse> stopJob(
            @PathVariable Long jobExecutionId) {

        log.info("POST /api/batch/stop/{} - 배치 강제 종료 요청", jobExecutionId);

        BatchStopResponse response = batchMonitorService.stopJob(jobExecutionId);

        log.info("POST /api/batch/stop/{} - 강제 종료 처리 완료: message={}", jobExecutionId, response.getMessage());
        return ResponseEntity.ok(response);
    }
}
