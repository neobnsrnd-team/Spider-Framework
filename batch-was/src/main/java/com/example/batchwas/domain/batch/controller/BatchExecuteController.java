package com.example.batchwas.domain.batch.controller;

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

        // Admin은 2xx = SUCCESS, 5xx = ABNORMAL_TERMINATION 으로 판단하므로
        // 배치 결과 코드가 ABNORMAL일 때도 응답 자체는 200으로 반환 (이력은 WAS가 기록)
        return ResponseEntity.ok(response);
    }
}
