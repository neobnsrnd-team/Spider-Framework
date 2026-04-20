package com.example.batchwas.domain.batch.controller;

import com.example.batchwas.constant.BatchConstants;
import com.example.batchwas.domain.batch.dto.BatchExecuteRequest;
import com.example.batchwas.domain.batch.dto.BatchExecuteResponse;
import com.example.batchwas.domain.batch.service.BatchExecuteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 배치 실행 Controller.
 *
 * <p>Admin의 BatchExecService가 POST /api/batch/execute 로 호출한다.
 * Job을 동기 실행하므로 HTTP 응답은 Job 완료 후 반환된다.</p>
 */
@Slf4j
@RestController
@RequestMapping("/api/batch")
@RequiredArgsConstructor
public class BatchExecuteController {

    private final BatchExecuteService batchExecuteService;

    /**
     * 배치 실행 요청 처리.
     *
     * <p>Job 성공 시 200 OK, 실패 시 500 Internal Server Error 반환.
     * Admin은 응답 상태 코드로 성공/실패를 판단한다.</p>
     *
     * @param request batchAppId, batchDate, userId, parameters
     * @return 실행 결과 (seq, 결과 코드, 처리 건수)
     */
    @PostMapping("/execute")
    public ResponseEntity<BatchExecuteResponse> execute(
            @Valid @RequestBody BatchExecuteRequest request) {

        log.info("POST /api/batch/execute - batchAppId={}, batchDate={}, userId={}",
                request.getBatchAppId(), request.getBatchDate(), request.getUserId());

        BatchExecuteResponse response = batchExecuteService.execute(request);

        // ABNORMAL 시 500 반환 → Admin의 RestTemplate이 RestClientException으로 처리해 실패로 인식
        // SUCCESS 시 200 반환 — FWK_BATCH_HIS 이력 업데이트는 WAS가 직접 처리
        if (BatchConstants.RES_RT_ABNORMAL.equals(response.getResRtCode())) {
            return ResponseEntity.internalServerError().body(response);
        }
        return ResponseEntity.ok(response);
    }
}
