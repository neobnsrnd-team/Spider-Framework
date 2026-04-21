package com.example.spiderbatch.domain.batch.service;

import com.example.spiderbatch.constant.BatchConstants;
import com.example.spiderbatch.domain.batch.dto.BatchAppInfo;
import com.example.spiderbatch.domain.batch.dto.BatchRunningResponse;
import com.example.spiderbatch.domain.batch.dto.BatchStopResponse;
import com.example.spiderbatch.domain.batch.mapper.BatchAppMapper;
import com.example.spiderbatch.domain.batch.mapper.BatchHisMapper;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.batch.core.JobExecution;
import org.springframework.batch.core.explore.JobExplorer;
import org.springframework.batch.core.launch.JobOperator;
import org.springframework.batch.core.launch.JobExecutionNotRunningException;
import org.springframework.batch.core.launch.NoSuchJobExecutionException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * 실행 중인 배치 Job 조회 및 강제 종료 Service.
 *
 * <p>Spring Batch의 {@link JobExplorer}로 STARTED 상태의 JobExecution을 조회하고,
 * {@link JobOperator}로 강제 종료를 수행한다.</p>
 *
 * <p>강제 종료 시 FWK_BATCH_HIS를 즉시 ABNORMAL 상태로 UPDATE하여
 * Admin UI에 종료 상태가 빠르게 반영되도록 한다.</p>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class BatchMonitorService {

    /** startTime 포맷 — Admin UI 표시용 (ISO 형식) */
    private static final DateTimeFormatter START_TIME_FORMATTER =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    /** application.yml의 batch.was.instance-id 값 (FWK_WAS_INSTANCE.INSTANCE_ID 와 일치) */
    @Value("${batch.was.instance-id}")
    private String instanceId;

    private final JobExplorer jobExplorer;
    private final JobOperator jobOperator;
    private final BatchAppMapper batchAppMapper;
    private final BatchHisMapper batchHisMapper;

    /**
     * 현재 실행 중인 모든 배치 Job 목록을 조회한다.
     *
     * <p>JobExplorer에 등록된 모든 jobName을 순회하여 STARTED 상태의 JobExecution을 수집하고,
     * FWK_BATCH_APP에서 배치 이름과 CRON 표현식을 보강하여 반환한다.</p>
     *
     * @return 실행 중인 배치 Job 목록 (없으면 빈 리스트)
     */
    public List<BatchRunningResponse> getRunningJobs() {
        List<BatchRunningResponse> result = new ArrayList<>();

        // 등록된 모든 Job 이름 조회 후 각각 실행 중인 JobExecution 수집
        List<String> jobNames = jobExplorer.getJobNames();
        for (String jobName : jobNames) {
            Set<JobExecution> runningExecutions = jobExplorer.findRunningJobExecutions(jobName);
            for (JobExecution jobExecution : runningExecutions) {
                result.add(toRunningResponse(jobExecution));
            }
        }

        log.info("실행 중인 배치 조회 완료: {}건", result.size());
        return result;
    }

    /**
     * 지정한 jobExecutionId의 배치 Job을 강제 종료한다.
     *
     * <p>JobOperator.stop() 성공 후 FWK_BATCH_HIS를 ABNORMAL로 UPDATE하여
     * stop()이 실패(이미 종료 등)한 경우 DB 이력이 오염되지 않도록 한다.</p>
     *
     * @param jobExecutionId 종료할 JobExecution ID
     * @return 강제 종료 결과 (jobExecutionId + 메시지)
     * @throws IllegalArgumentException 해당 ID의 JobExecution이 존재하지 않는 경우
     */
    public BatchStopResponse stopJob(Long jobExecutionId) {
        // 1. JobExecution 조회 — 존재하지 않으면 예외
        JobExecution jobExecution = jobExplorer.getJobExecution(jobExecutionId);
        if (jobExecution == null) {
            throw new IllegalArgumentException(
                    "존재하지 않는 JobExecution입니다: jobExecutionId=" + jobExecutionId);
        }

        // 2. FWK_BATCH_HIS UPDATE에 필요한 파라미터 추출
        String batchAppId = jobExecution.getJobParameters().getString("batchAppId");
        String batchDate = jobExecution.getJobParameters().getString("batchDate");
        Long batchExecuteSeqLong = jobExecution.getJobParameters().getLong("batchExecuteSeq");

        // batchAppId가 없는 직접 실행 케이스는 DB UPDATE를 건너뜀
        boolean hasHisRecord = (batchAppId != null && batchDate != null && batchExecuteSeqLong != null);
        int batchExecuteSeq = hasHisRecord ? batchExecuteSeqLong.intValue() : 0;

        // 3. Spring Batch Job 강제 종료 요청 — stop() 성공 확인 후 DB UPDATE
        String message;
        boolean stopSucceeded = false;
        try {
            jobOperator.stop(jobExecutionId);
            stopSucceeded = true;
            log.info("배치 강제 종료 요청 완료: jobExecutionId={}, batchAppId={}", jobExecutionId, batchAppId);
            message = "강제 종료 요청이 완료되었습니다.";
        } catch (NoSuchJobExecutionException e) {
            // JobExplorer로는 존재하나 JobOperator 내부 상태와 불일치하는 극히 드문 케이스
            log.warn("배치 강제 종료 - JobExecution을 찾을 수 없음 (이미 종료됐을 수 있음): jobExecutionId={}", jobExecutionId, e);
            message = "이미 종료된 배치입니다.";
        } catch (JobExecutionNotRunningException e) {
            // 조회 시점과 종료 시점 사이에 배치가 완료된 경우
            log.warn("배치 강제 종료 - 이미 실행 중이 아님: jobExecutionId={}", jobExecutionId, e);
            message = "배치가 이미 실행 중이 아닙니다.";
        }

        // 4. stop() 성공한 경우에만 FWK_BATCH_HIS UPDATE — 정상 완료된 Job의 이력이 ABNORMAL로 오염되는 것을 방지
        if (stopSucceeded && hasHisRecord) {
            String batchEndDtime = LocalDateTime.now().format(BatchConstants.END_DATE_TIME_FORMATTER);
            int updated = batchHisMapper.updateBatchHisResult(
                    batchAppId, instanceId, batchDate, batchExecuteSeq,
                    BatchConstants.RES_RT_ABNORMAL, batchEndDtime,
                    "관리자 강제 종료",
                    0L, 0L, 0L,
                    "ADMIN");

            if (updated == 0) {
                // PK 불일치 시 경고만 남기고 진행
                log.warn("[WARN] FWK_BATCH_HIS UPDATE 0건 — batchAppId={}, seq={}", batchAppId, batchExecuteSeq);
            }
        }

        return BatchStopResponse.builder()
                .jobExecutionId(jobExecutionId)
                .message(message)
                .build();
    }

    /**
     * JobExecution을 BatchRunningResponse DTO로 변환한다.
     * FWK_BATCH_APP 조회로 배치 이름과 CRON 표현식을 보강한다.
     */
    private BatchRunningResponse toRunningResponse(JobExecution jobExecution) {
        String batchAppId = jobExecution.getJobParameters().getString("batchAppId");
        String batchDate = jobExecution.getJobParameters().getString("batchDate");

        // batchAppId가 없는 직접 실행(테스트 등)은 UNKNOWN으로 처리
        if (batchAppId == null) {
            batchAppId = "UNKNOWN";
        }

        // FWK_BATCH_APP에서 배치 이름과 CRON 표현식 조회
        String batchAppName = "";
        String cronText = "";
        if (!"UNKNOWN".equals(batchAppId)) {
            BatchAppInfo appInfo = batchAppMapper.selectBatchAppInfo(batchAppId);
            if (appInfo != null) {
                batchAppName = appInfo.getBatchAppName() != null ? appInfo.getBatchAppName() : "";
                // CRON_TEXT는 nullable — null이면 빈 문자열로 처리
                cronText = appInfo.getCronText() != null ? appInfo.getCronText() : "";
            }
        }

        // Spring Batch 5: getStartTime()은 LocalDateTime 반환
        String startTime = "";
        if (jobExecution.getStartTime() != null) {
            startTime = jobExecution.getStartTime().format(START_TIME_FORMATTER);
        }

        return BatchRunningResponse.builder()
                .jobExecutionId(jobExecution.getId())
                .batchAppId(batchAppId)
                .batchAppName(batchAppName)
                .batchAppFileName(jobExecution.getJobInstance().getJobName())
                .cronText(cronText)
                .batchDate(batchDate != null ? batchDate : "")
                .startTime(startTime)
                .status(jobExecution.getStatus().name())
                .build();
    }
}
