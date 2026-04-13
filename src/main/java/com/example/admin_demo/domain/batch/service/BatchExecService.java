package com.example.admin_demo.domain.batch.service;

import com.example.admin_demo.domain.batch.constant.BatchConstants;
import com.example.admin_demo.domain.batch.dto.BatchAppResponse;
import com.example.admin_demo.domain.batch.dto.BatchExecRequest;
import com.example.admin_demo.domain.batch.dto.BatchHisResponse;
import com.example.admin_demo.domain.batch.enums.BatchResRtCode;
import com.example.admin_demo.domain.batch.mapper.BatchAppMapper;
import com.example.admin_demo.domain.batch.mapper.BatchHisMapper;
import com.example.admin_demo.domain.wasinstance.dto.WasInstanceResponse;
import com.example.admin_demo.domain.wasinstance.mapper.WasInstanceMapper;
import com.example.admin_demo.global.exception.InvalidInputException;
import com.example.admin_demo.global.exception.NotFoundException;
import com.example.admin_demo.global.util.AuditUtil;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

/**
 * 배치 수동 실행 Service
 *
 * <p>WAS 인스턴스에 HTTP 요청으로 배치 실행을 전달합니다.</p>
 *
 * <p>TODO: WAS 측 배치 실행 API 구현 후, DB INSERT/UPDATE 로직을 WAS로 이관.
 * 현재는 WAS가 미구현이므로 Admin 서버에서 임시로 FWK_BATCH_HIS INSERT/UPDATE를 수행합니다.</p>
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BatchExecService {

    private final BatchAppMapper batchAppMapper;
    private final BatchHisMapper batchHisMapper;
    private final WasInstanceMapper wasInstanceMapper;
    private final RestTemplate restTemplate;

    private static final String BATCH_EXEC_ENDPOINT = "/api/batch/execute";

    @Transactional
    public List<BatchHisResponse> executeManualBatch(BatchExecRequest requestDTO) {
        // 중복 실행 방지: 이미 실행중(STARTED)인 배치가 있으면 차단
        int executingCount = batchHisMapper.countExecutingByBatchAppId(requestDTO.getBatchAppId());
        if (executingCount > 0) {
            throw new InvalidInputException(
                    "배치(" + requestDTO.getBatchAppId() + ")가 이미 실행중입니다. (" + executingCount + "건) 완료 후 재실행하세요.");
        }

        // 선행 배치 의존성 검증
        validatePreBatchDependency(requestDTO.getBatchAppId());

        String logDtime = LocalDateTime.now().format(BatchConstants.LOG_DATE_TIME_FORMATTER);
        String userId = AuditUtil.currentUserId();

        List<Map<String, Object>> batchHisList = new ArrayList<>();
        List<BatchHisResponse> results = new ArrayList<>();

        // 각 인스턴스별 실행 순번 맵 (WAS 요청 후 UPDATE에 사용)
        Map<String, Integer> instanceSeqMap = new HashMap<>();

        for (String instanceId : requestDTO.getInstanceIds()) {
            int nextSeq = batchHisMapper.selectNextExecuteSeq(
                    requestDTO.getBatchAppId(), instanceId, requestDTO.getBatchDate());

            instanceSeqMap.put(instanceId, nextSeq);

            // TODO: WAS 구현 후 DB INSERT는 WAS에서 처리하도록 이관
            Map<String, Object> map = new HashMap<>();
            map.put("batchAppId", requestDTO.getBatchAppId());
            map.put("instanceId", instanceId);
            map.put("batchDate", requestDTO.getBatchDate());
            map.put("batchExecuteSeq", nextSeq);
            map.put("logDtime", logDtime);
            map.put("resRtCode", BatchResRtCode.STARTED.getCode());
            map.put("lastUpdateUserId", userId);
            batchHisList.add(map);

            results.add(BatchHisResponse.builder()
                    .batchAppId(requestDTO.getBatchAppId())
                    .instanceId(instanceId)
                    .batchDate(requestDTO.getBatchDate())
                    .batchExecuteSeq(nextSeq)
                    .logDtime(logDtime)
                    .resRtCode(BatchResRtCode.STARTED.getCode())
                    .lastUpdateUserId(userId)
                    .build());
        }

        // 1. 배치 이력 INSERT (TODO: WAS 구현 후 WAS에서 처리하도록 이관)
        if (!batchHisList.isEmpty()) {
            batchHisMapper.insertBatchHisBatch(batchHisList);
        }

        // 2. 각 WAS 인스턴스에 배치 실행 요청 + 결과 UPDATE
        for (String instanceId : requestDTO.getInstanceIds()) {
            int seq = instanceSeqMap.get(instanceId);
            sendBatchExecAndUpdateResult(instanceId, seq, requestDTO, userId);
        }

        return results;
    }

    /**
     * WAS 인스턴스에 배치 실행 HTTP 요청을 전송하고, 응답에 따라 이력을 업데이트합니다.
     *
     * <p>TODO: WAS 측 배치 실행 API 구현 후, 이 UPDATE 로직은 WAS에서 직접 수행하도록 이관.
     * WAS가 배치 실행 완료 시 직접 FWK_BATCH_HIS를 UPDATE하는 구조로 변경 예정.</p>
     */
    private void sendBatchExecAndUpdateResult(
            String instanceId, int batchExecuteSeq, BatchExecRequest requestDTO, String userId) {

        WasInstanceResponse instance = wasInstanceMapper.selectResponseById(instanceId);
        if (instance == null) {
            log.warn("배치 실행 요청 실패: 인스턴스를 찾을 수 없습니다. instanceId={}", instanceId);
            updateBatchHisAsError(requestDTO, instanceId, batchExecuteSeq, userId, "인스턴스를 찾을 수 없습니다: " + instanceId);
            return;
        }

        String ip = instance.getIp();
        String port = instance.getPort();
        if (ip == null || ip.isBlank() || port == null || port.isBlank()) {
            log.warn("배치 실행 요청 실패: IP/PORT 정보 없음. instanceId={}", instanceId);
            updateBatchHisAsError(requestDTO, instanceId, batchExecuteSeq, userId, "IP/PORT 정보가 없습니다: " + instanceId);
            return;
        }

        String url = String.format("http://%s:%s%s", ip, port, BATCH_EXEC_ENDPOINT);

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, String> body = new HashMap<>();
            body.put("batchAppId", requestDTO.getBatchAppId());
            body.put("batchDate", requestDTO.getBatchDate());
            body.put("userId", userId);
            if (requestDTO.getParameters() != null
                    && !requestDTO.getParameters().isBlank()) {
                body.put("parameters", requestDTO.getParameters());
            }

            HttpEntity<Map<String, String>> httpEntity = new HttpEntity<>(body, headers);

            log.info("배치 실행 요청: instanceId={}, url={}, batchAppId={}", instanceId, url, requestDTO.getBatchAppId());

            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.POST, httpEntity, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                log.info("배치 실행 요청 성공: instanceId={}", instanceId);
                // TODO: WAS 구현 후 이 UPDATE는 WAS에서 직접 수행
                updateBatchHisAsSuccess(requestDTO, instanceId, batchExecuteSeq, userId);
            } else {
                log.warn("배치 실행 요청 실패 응답: instanceId={}, status={}", instanceId, response.getStatusCode());
                updateBatchHisAsError(
                        requestDTO, instanceId, batchExecuteSeq, userId, "WAS 응답 오류: " + response.getStatusCode());
            }
        } catch (RestClientException e) {
            log.warn("배치 실행 요청 통신 오류: instanceId={}, url={}, error={}", instanceId, url, e.getMessage());
            // TODO: WAS 구현 후 이 UPDATE는 WAS에서 직접 수행
            updateBatchHisAsError(requestDTO, instanceId, batchExecuteSeq, userId, "WAS 통신 오류: " + e.getMessage());
        }
    }

    /**
     * 배치 이력을 정상 종료로 업데이트
     * <p>TODO: WAS 구현 후 WAS에서 직접 수행하도록 이관</p>
     */
    private void updateBatchHisAsSuccess(
            BatchExecRequest requestDTO, String instanceId, int batchExecuteSeq, String userId) {
        String endDtime = LocalDateTime.now().format(BatchConstants.LOG_DATE_TIME_FORMATTER);
        batchHisMapper.updateBatchHisResult(
                requestDTO.getBatchAppId(),
                instanceId,
                requestDTO.getBatchDate(),
                batchExecuteSeq,
                BatchResRtCode.SUCCESS.getCode(),
                endDtime,
                null,
                userId);
    }

    /**
     * 배치 이력을 오류로 업데이트
     * <p>TODO: WAS 구현 후 WAS에서 직접 수행하도록 이관</p>
     */
    private void updateBatchHisAsError(
            BatchExecRequest requestDTO, String instanceId, int batchExecuteSeq, String userId, String errorReason) {
        String endDtime = LocalDateTime.now().format(BatchConstants.LOG_DATE_TIME_FORMATTER);
        batchHisMapper.updateBatchHisResult(
                requestDTO.getBatchAppId(),
                instanceId,
                requestDTO.getBatchDate(),
                batchExecuteSeq,
                BatchResRtCode.ABNORMAL_TERMINATION.getCode(),
                endDtime,
                errorReason,
                userId);
    }

    /**
     * 선행 배치 의존성 검증
     */
    private void validatePreBatchDependency(String batchAppId) {
        BatchAppResponse batchApp = batchAppMapper.selectResponseById(batchAppId);
        if (batchApp == null) {
            throw new NotFoundException("batchAppId: " + batchAppId);
        }

        String preBatchAppId = batchApp.getPreBatchAppId();
        if (preBatchAppId == null || preBatchAppId.isBlank()) {
            return;
        }

        if (batchAppMapper.countByBatchAppId(preBatchAppId) == 0) {
            throw new InvalidInputException("선행 배치가 존재하지 않습니다: " + preBatchAppId);
        }

        String latestStatus = batchHisMapper.selectLatestStatusByBatchAppId(preBatchAppId);

        if (latestStatus == null) {
            throw new InvalidInputException("선행 배치(" + preBatchAppId + ")의 실행 이력이 없습니다. 선행 배치를 먼저 실행하세요.");
        }

        if (!BatchResRtCode.SUCCESS.getCode().equals(latestStatus)) {
            BatchResRtCode status = BatchResRtCode.fromCode(latestStatus);
            String statusName = (status != null) ? status.getDescription() : latestStatus;
            throw new InvalidInputException(
                    "선행 배치(" + preBatchAppId + ")의 최근 실행 상태가 '" + statusName + "'입니다. 선행 배치가 정상 종료된 후 실행하세요.");
        }
    }

    public BatchHisResponse getBatchHis(
            String batchAppId, String instanceId, String batchDate, Integer batchExecuteSeq) {
        BatchHisResponse result =
                batchHisMapper.findByIdWithDetails(batchAppId, instanceId, batchDate, batchExecuteSeq);

        if (result == null) {
            throw new NotFoundException(String.format(
                    "batchAppId: %s, instanceId: %s, batchDate: %s, seq: %d",
                    batchAppId, instanceId, batchDate, batchExecuteSeq));
        }

        return result;
    }
}
